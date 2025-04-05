// components/ScrollingRow.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ImageData {
  imageUrl: string;
  // Add other fields if necessary
}

export interface RenderItemProps {
  image: ImageData;
  index: number;
}

interface ScrollingRowProps {
  images: ImageData[];
  direction?: "left" | "right";
  speed?: number; // in pixels per second
  /**
   * A React component that will be used to render an image.
   * It receives an object with the image data and its index.
   */
  RenderItem?: React.ComponentType<RenderItemProps>;
}

export function ScrollingRow({
  images,
  direction = "left",
  speed = 50,
  RenderItem,
}: ScrollingRowProps) {
  // Use a ref to measure the width of one set of images.
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    // Once images are rendered, measure the container width and divide by 2 (because of duplication).
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth / 2);
    }
  }, [images]);

  // Until we've measured the scrollWidth, render a static container.
  if (scrollWidth === 0) {
    return (
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {[...images, ...images].map((image, index) => (
            <span key={index} style={{ display: "inline-block" }}>
              {RenderItem ? (
                <RenderItem image={image} index={index} />
              ) : (
                <Image
                  src={image.imageUrl}
                  alt="Daily image"
                  width={250}
                  height={250}
                  className="max-w-[250px] max-h-[250px] aspect-[3/4]"
                />
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Calculate the duration so that the entire scrollWidth is covered at the given speed.
  const duration = scrollWidth / speed;

  // Animation values:
  // For leftward scroll: animate from x = 0 to x = -scrollWidth
  // For rightward scroll: animate from x = -scrollWidth to x = 0
  const animation =
    direction === "left" ? { x: [0, -scrollWidth] } : { x: [-scrollWidth, 0] };

  return (
    <div className="overflow-hidden h-[280px]">
      <motion.div
        ref={containerRef}
        style={{ display: "inline-block", whiteSpace: "nowrap", maxHeight: "280px" }}
        animate={animation}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: duration,
          },
        }}
      >
        {[...images, ...images, ...images].map((image, index) => (
          <span key={index} style={{ display: "inline-block" }}>
            {RenderItem ? (
              <RenderItem image={image} index={index} />
            ) : (
              <Image
                src={image.imageUrl}
                alt="Daily image"
                width={250}
                height={250}
                className="max-w-[250px] max-h-[250px] aspect-[3/4]"
              />
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
