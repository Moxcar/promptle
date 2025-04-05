// app/test/page.tsx
import { api, HydrateClient } from "~/trpc/server";
import { ScrollingRow } from "~/components/ScrollingRow";
import CustomImage from "~/components/CustomImage";

export default async function Home() {
  // Fetch data from your API (adjust as needed)
  const {
    imageUrl,
    wordLength = 0,
    dailyImageGuessId = 0,
  } = await api.dailyImage.getImageUrlOfTheDay();

  const images = await api.dailyImage.getImagesForBackground();
  console.log("images", images);

  // Group images into rows. In this example, we assume 7 rows.
  const numberOfRows = 7;
  const rows: { imageUrl: string }[][] = Array.from(
    { length: numberOfRows },
    () => [],
  );
  images.forEach((image, index) => {
    (rows[index % numberOfRows] as { imageUrl: string }[]).push(image);
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
      </div>
    </HydrateClient>
  );
}
