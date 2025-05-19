// app/test/page.tsx
import { api, HydrateClient } from "~/trpc/server";
import ScrollingRowContainer from "~/components/ScrollingRowContainer";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const images = await api.dailyImage.getImagesForBackground({
    amount: 4 * 12,
    skip: 0,
  });

  return (
    <HydrateClient>
      <ScrollingRowContainer images={images} />

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
            </span>
          </Button>
        </Link>
      </div>
    </HydrateClient>
  );
}
