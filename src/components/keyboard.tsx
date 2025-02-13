"use client";

import { type KeyType } from "~/lib/types";
import { useGlobalState } from "./GlobalStateContext";
import { useEffect, useCallback } from "react";
import { STATUS_COLORS } from "~/lib/constants";

export default function Keyboard({
  length,
  dailyImageGuessId,
}: Readonly<{ length: number; dailyImageGuessId: number }>) {
  const { keys, attempts, setAttempts, submitCurrentAttempt } =
    useGlobalState() ?? {};
  // OnKeyClick trigger keyboard event if key is pressed
  const onKeyClick = useCallback(
    (key: KeyType) => {
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
    [attempts, length, setAttempts, submitCurrentAttempt, dailyImageGuessId],
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
    <>
      {keys?.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex gap-2">
            {row.map((key, keyIndex) => {
              return (
                <button
                  key={keyIndex}
                  className={`rounded-md ${STATUS_COLORS[key.status]} border-[1px] border-gray-800 p-2 text-black dark:text-white`}
                  onClick={() => onKeyClick(key)}
                >
                  {key.key}
                </button>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
