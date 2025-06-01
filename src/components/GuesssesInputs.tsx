"use client";

import { STATUS_COLORS } from "~/lib/constants";
import { useGlobalState } from "./GlobalStateContext";
import React, { useEffect, useRef, useState } from "react";

export default function GuessesInputs({
  length,
}: Readonly<{ length: number }>) {
  const { attempts } = useGlobalState() ?? {};
  const [shakeRows, setShakeRows] = useState<number[]>([]);
  const prevStatuses = useRef<(string | undefined)[]>([]);

  useEffect(() => {
    if (!attempts) return;
    const newShakeRows: number[] = [];
    attempts.forEach((attempt, idx) => {
      const prev = prevStatuses.current[idx];
      if (prev === "pending" && attempt.status !== "pending") {
        newShakeRows.push(idx);
      }
    });
    if (newShakeRows.length > 0) {
      setShakeRows((prev) => [...prev, ...newShakeRows]);
    }
    prevStatuses.current = attempts.map((a) => a.status);
  }, [attempts]);

  const handleAnimationEnd = (idx: number) => {
    setShakeRows((prev) => prev.filter((i) => i !== idx));
  };

  return (
    <>
      {attempts?.map((attempt, index) => {
        const isShaking = shakeRows.includes(index);
        return (
          <div
            key={index}
            className={`flex gap-4 ${isShaking ? "shake" : ""}`}
            onAnimationEnd={() => handleAnimationEnd(index)}
          >
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
