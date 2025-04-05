// components/CustomImage.tsx
"use client"; // Ensure this component is a Client Component if needed

import React from "react";
import { type RenderItemProps } from "./ScrollingRow";
import Image from "next/image";

export default function CustomImage({ image, index }: RenderItemProps) {
  return (
    <div
      key={index}
      style={{ width: 210, height: 280}}
    >
      <Image
        src={image.imageUrl}
        alt={`Custom image ${index}`}
        objectFit="cover"
        width={210}
        height={280}
      />
    </div>
  );
}
