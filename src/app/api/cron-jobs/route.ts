import type { NextRequest } from "next/server";
import { convertToCoreMessages, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import * as fal from "@fal-ai/serverless-client";
import { api } from "~/trpc/server";
import getRandomWord from "~/lib/generateRandomWord";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  console.log("Generating daily image...");
  try {
    // Esperar a que la función asincrónica termine
    const imageUrl = await generateDailyImageWithRandomWord();
    console.log("Daily image generated:", imageUrl);
    return new Response(JSON.stringify({ success: true, result: imageUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating daily image:", error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return new Response(
      JSON.stringify({ success: false, error: error as string }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
}

const generateDailyImageWithRandomWord = async () => {
  const randomWord = getRandomWord();
  const system =
    "Generate an image that clearly represents the word. The image should focus on the key elements or features commonly associated with this word, making it easily identifiable. Use vibrant colors and simple shapes to make the concept of the word obvious. IMPORTANT: The image should not have the word written on it, but should be able to convey the meaning of the word without any text.";

  let imageUrl = "";

  console.log("Generating image for word:", randomWord);

  return streamText({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    model: openai("gpt-4o-mini") as any,
    system,
    messages: convertToCoreMessages([
      {
        content: randomWord,
        role: "system",
      },
    ]),
    tools: {
      generate_image: tool({
        description:
          "Generate a image that represents correctly the requested word",
        parameters: z.object({
          word: z.string(),
        }),
        execute: async ({ word }) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          imageUrl = await generateImage(word);
          //Save to database
          await api.dailyImage.createDailyImageGuess({
            imageUrl,
            word,
          });
        },
      }),
    },
  })
    .then(() => {
      console.log("Image generated successfully", imageUrl);
      return imageUrl;
    })
    .catch((error) => {
      console.error("Error generating image:", error);
      throw error;
    });
};

const generateImage = async (word: string): Promise<string> => {
  fal.config({
    credentials: process.env.FAL_API_KEY,
  });

  const result = await fal.subscribe("fal-ai/fast-sdxl", {
    input: {
      prompt: `Generate an image that represents correctly the requested word: ${word}`,
      image_size: "portrait_4_3",
    },
    logs: true,
  });

  if (result && typeof result === "object") {
    const typedResult = result as { images?: { url?: string }[] };

    if (
      Array.isArray(typedResult.images) &&
      typedResult.images.length > 0 &&
      typedResult.images[0]?.url
    ) {
      console.log("Image generated:", typedResult.images[0].url);
      return typedResult.images[0].url;
    } else {
      console.log(
        "No images were generated or image URL is missing, Result:",
        result,
      );
      throw new Error("No images were generated or image URL is missing");
    }
  } else {
    console.log("Result is undefined or not an object, Result:", result);
    throw new Error("Result is undefined or not an object");
  }
};
