"use client";

import { type KeyType } from "~/lib/types";
import { useGlobalState } from "./GlobalStateContext";
import { useEffect, useCallback } from "react";
import { STATUS_COLORS } from "~/lib/constants";

export default function Keyboard({
  length,
  dailyImageGuessId,
}: Readonly<{ length: number; dailyImageGuessId: number }>) {
  const { keys, attempts, setAttempts, submitCurrentAttempt, gameStatus } =
    useGlobalState() ?? {};
  // OnKeyClick trigger keyboard event if key is pressed
  const onKeyClick = useCallback(
    (key: KeyType) => {
      if (gameStatus !== "playing") return;
      // Submit the current attempt if the key clicked is "ENTER"
      if (key.key === "ENTER") {
        submitCurrentAttempt?.(dailyImageGuessId, length);
        return;
      }
      // Change actual attempt keys to add the key clicked
      const newAttempts = attempts?.map((attempt) => {
        if (attempt.status === "pending" && key.key === "BACKSPACE") {
          return {
            ...attempt,
            keys: attempt.keys.slice(0, -1),
          };
        }
        if (attempt.status === "pending" && attempt.keys.length < length) {
          return {
            ...attempt,
            keys: attempt.keys.concat(key),
          };
        }
        return attempt;
      });
      setAttempts?.(newAttempts ?? []);
    },
    [
      attempts,
      length,
      setAttempts,
      submitCurrentAttempt,
      dailyImageGuessId,
      gameStatus,
    ],
  );

  // Memoize the handleKeyDown function to prevent it from being recreated on every render
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      const keyType = keys?.flat().find((keyType) => {
        return keyType.key === key;
      });
      if (keyType) {
        onKeyClick(keyType);
      }
    },
    [keys, onKeyClick], // Dependencies
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {keys?.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex gap-2">
            {row.map((key, keyIndex) => {
              return (
                <button
                  key={keyIndex}
                  className={`rounded-md ${STATUS_COLORS[key.status]} ${rowIndex == keys.length - 1 && (keyIndex == 0 || keyIndex == row.length - 1) ? "w-[73.5px]" : "w-[45px]"} border-[1px] border-gray-800 p-2 text-black dark:text-white`}
                  onClick={() => onKeyClick(key)}
                >
                  {key.key === "BACKSPACE" ? (
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      data-testid="icon-backspace"
                      className="mx-auto text-gray-800 dark:text-white"
                    >
                      <path
                        fill="currentColor"
                        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                      ></path>
                    </svg>
                  ) : (
                    key.key
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
