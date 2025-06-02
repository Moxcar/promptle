"use client";

import { useEffect, useState } from "react";
import type { GameStatusType } from "~/lib/types";

export default function Alert({ type }: { type: GameStatusType }) {
  const [show, setShow] = useState(false);

  const color = type === "won" ? "text-green-600" : "text-red-600";

  useEffect(() => {
    if (type === "won" || type === "lost") {
      setShow(true);
    }
  }, [type]);

  if (!show) return null;

  return (
    <div
      className="fixed top-0 z-30 flex h-full w-full items-center justify-center bg-black/50"
      onClick={() => {
        setShow(false);
      }}
    >
      <dialog
        open
        className={`w-80 max-w-full rounded-lg border border-black bg-white p-0 text-black dark:border-gray-500 dark:bg-black dark:text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-6">
          <h1 className={`mb-2 text-2xl font-bold ${color}`}>
            {type === "won" ? "You Win!" : "You Lose!"}
          </h1>
        </div>
      </dialog>
    </div>
  );
}
