"use client";

import Alert from "~/components/Alert";
import { useGlobalState } from "~/components/GlobalStateContext";

export default function DailyGuessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gameStatus } = useGlobalState() ?? {};
  return (
    <>
      <Alert type={gameStatus ?? "playing"} />
      {children}
    </>
  );
}
