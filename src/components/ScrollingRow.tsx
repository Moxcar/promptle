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
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
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
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  //Console log hovered index
  useEffect(() => {
    if (hoveredIndex !== null) {
      console.log("Hovered index:", hoveredIndex);
    }
  }, [hoveredIndex]);

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
            <span
              key={index}
              style={{ display: "inline-block" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {RenderItem ? (
                <RenderItem
                  image={image}
                  index={index}
                  isHovered={hoveredIndex === index}
                  onMouseEnter={() => {
                    setIsHovered(true);
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    setHoveredIndex(null);
                  }}
                />
              ) : (
                <div
                  className="transition-transform duration-300"
                  style={{
                    transform:
                      hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Image
                    src={image.imageUrl}
                    alt="Daily image"
                    width={250}
                    height={250}
                    className="aspect-[3/4] max-h-[250px] max-w-[250px]"
                  />
                </div>
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
    <div
      className="h-[280px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={containerRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          maxHeight: "280px",
        }}
        animate={animation}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: duration,
            paused: isHovered,
          },
        }}
      >
        {[...images, ...images, ...images].map((image, index) => (
          <span
            key={index}
            style={{ display: "inline-block" }}
            onMouseEnter={() => {
              setIsHovered(true);
              setHoveredIndex(index);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setHoveredIndex(null);
            }}
          >
            {RenderItem ? (
              <RenderItem
                image={image}
                index={index}
                isHovered={hoveredIndex === index}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredIndex(index);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredIndex(null);
                }}
              />
            ) : (
              <div
                className="transition-transform duration-300"
                style={{
                  transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Image
                  src={image.imageUrl}
                  alt="Daily image"
                  width={250}
                  height={250}
                  className="aspect-[3/4] max-h-[250px] max-w-[250px]"
                />
              </div>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
