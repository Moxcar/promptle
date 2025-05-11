// components/CustomImage.tsx
"use client"; // Ensure this component is a Client Component if needed

import React from "react";
import { type RenderItemProps } from "./ScrollingRow";
import Image from "next/image";

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
        transition: "transform 300ms ease",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={image.imageUrl}
        alt={`Custom image ${index}`}
        objectFit="cover"
        width={210}
        height={280}
        className="rounded-xl p-2"
      />
    </div>
  );
}
