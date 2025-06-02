import DailyImage from "~/components/DailyImage";
import GuessesInputs from "~/components/GuesssesInputs";
import Keyboard from "~/components/Keyboard";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home({
  params,
}: {
  params: { imageId: string };
}) {
  const {
    imageUrl,
    wordLength = 0,
    dailyImageGuessId = 0,
  } = await api.dailyImage.getImageUrlOfTheDay(Number(params.imageId));
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center gap-4">
        <DailyImage imageUrl={imageUrl} />
        <GuessesInputs length={wordLength} />
        <Keyboard length={wordLength} dailyImageGuessId={dailyImageGuessId} />
      </div>
    </HydrateClient>
  );
}
