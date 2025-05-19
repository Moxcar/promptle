// components/CustomImage.tsx
"use client"; // Ensure this component is a Client Component if needed

import React from "react";
import { type RenderItemProps } from "./ScrollingRow";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function CustomImage({
  image,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: RenderItemProps) {
  return (
    <div
      key={index}
      style={{
        width: 210,
        height: 280,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden rounded-md"
    >
      <Image
        style={{
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 300ms ease",
        }}
        src={image.imageUrl}
        alt={`Custom image ${index}`}
        objectFit="cover"
        width={210}
        height={280}
        className="rounded-xl p-2"
      />
      {isHovered && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 -translate-y-full pb-6">
          <Link href={`/daily-guess/${image.dailyImageGuessId}`}>
            <Button
              size="lg"
              className="h-auto rounded-full bg-primary p-4 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary/80"
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
      )}
    </div>
  );
}
