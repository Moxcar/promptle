import type { NextRequest } from "next/server";
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
    return new Response(JSON.stringify({ success: true, imageUrl }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
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

  console.log("Generating image for word:", randomWord);

  try {
    const imageUrl = await generateImage(randomWord);

    // Save to database
    await api.dailyImage.createDailyImageGuess({
      imageUrl,
      word: randomWord,
    });

    console.log("Image generated successfully", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
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
