// app/test/page.tsx
import { api, HydrateClient } from "~/trpc/server";
import { ScrollingRow } from "~/components/ScrollingRow";
import CustomImage from "~/components/CustomImage";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { type ImageData } from "~/lib/types";

export default async function Home() {
  // Fetch data from your API (adjust as needed)
  // Fetch the daily image data (not using destructured variables to avoid unused warnings)
  await api.dailyImage.getImageUrlOfTheDay();

  const images = await api.dailyImage.getImagesForBackground();
  console.log("images", images);

  // Group images into rows. In this example, we assume 7 rows.
  const numberOfRows = 7;
  const rows: ImageData[][] = Array.from({ length: numberOfRows }, () => []);
  images.forEach((image, index) => {
    (rows[index % numberOfRows] as ImageData[]).push(image);
  });

  return (
    <HydrateClient>
      <div className="overflow-hidden">
        <div>
          {rows.map((rowImages, rowIndex) => (
            <ScrollingRow
              key={rowIndex}
              images={rowImages}
              // Alternate direction based on row index.
              direction={rowIndex % 2 === 0 ? "left" : "right"}
              speed={50} // adjust speed as desired
              RenderItem={CustomImage}
            />
          ))}
        </div>

        {/* Floating CTA Button */}
        <div className="fixed left-1/2 top-full z-50 -translate-x-1/2 -translate-y-full pb-16">
          <Link href="/daily-guess">
            <Button
              size="lg"
              className="h-auto rounded-full bg-primary px-8 py-6 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary/80"
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-play"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play Today&apos;s Guess
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </HydrateClient>
  );
}
