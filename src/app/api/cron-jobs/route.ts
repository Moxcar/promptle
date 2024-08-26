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
  generateDailyImageWithRandomWord()
    .then((result) => {
      return Response.json({ success: true, result });
    })
    .catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return Response.json({ success: false, error });
    });
}

const generateDailyImageWithRandomWord = async () => {
  const randomWord = getRandomWord();
  const system =
    "Generate an image that clearly represents the word. The image should focus on the key elements or features commonly associated with this word, making it easily identifiable. Use vibrant colors and simple shapes to make the concept of the word obvious. IMPORTANT: The image should not have the word written on it, but should be able to convey the meaning of the word without any text.";

  let imageUrl = "";

  await streamText({
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
          imageUrl = (await generateImage(word)).images[0].url;
          //Save to database
          await api.dailyImage.createDailyImageGuess({
            imageUrl,
            word,
          });
        },
      }),
    },
  });
  return imageUrl;
};

const generateImage = async (
  word: string,
): Promise<{
  images: [];
  url: string;
}> => {
  fal.config({
    credentials: process.env.FAL_API_KEY,
  });
  const result: { url: string; images: [] } = await fal.subscribe(
    "fal-ai/fast-sdxl",
    {
      input: {
        prompt: `Generate a image that represents correctly the requested word: ${word}`,
        image_size: "portrait_4_3",
      },
      logs: true,
    },
  );
  return result;
};
