import DailyImage from "~/components/DailyImage";
import GuessesInputs from "~/components/guesses-inputs";
import Keyboard from "~/components/keyboard";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const {
    imageUrl,
    wordLength = 0,
    dailyImageGuessId = 0,
  } = await api.dailyImage.getImageUrlOfTheDay();
  return (
    <HydrateClient>
      <DailyImage imageUrl={imageUrl} />
      <GuessesInputs length={wordLength} />
      <Keyboard length={wordLength} dailyImageGuessId={dailyImageGuessId} />
    </HydrateClient>
  );
}
