"use client";

import { STATUS_COLORS } from "~/lib/constants";
import { useGlobalState } from "./GlobalStateContext";

export default function GuessesInputs({
  length,
}: Readonly<{ length: number }>) {
  const { attempts } = useGlobalState() ?? {};

  return (
    <>
      {attempts?.map((attempt, index) => {
        return (
          <div key={index} className="flex gap-4">
            {Array.from({ length }, (_, i) => (
              <div
                className={`flex h-10 w-10 items-center justify-center border-[1px] border-gray-500 text-2xl ${attempt.status != "pending" && STATUS_COLORS[attempt?.keys[i]?.status ?? "unused"]}`}
                key={i}
              >
                {attempt?.keys[i]?.key}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
