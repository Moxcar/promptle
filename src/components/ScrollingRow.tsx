// components/ScrollingRow.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";
import { type ImageData } from "~/lib/types";

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
  LoadingItem?: React.ComponentType;
  isLoading?: boolean;
}

export function ScrollingRow({
  images,
  direction = "left",
  speed = 50,
  RenderItem,
  LoadingItem,
  isLoading,
}: ScrollingRowProps) {
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const animationRef = useRef<ReturnType<typeof animate>>();

  // Console log hovered index
  useEffect(() => {
    if (hoveredIndex !== null) {
      console.log("Hovered index:", hoveredIndex);
    }
  }, [hoveredIndex]);

  // Measure the container width
  useEffect(() => {
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth / 2);
    }
  }, [images]);

  // Calculate the duration so that the entire scrollWidth is covered at the given speed
  const duration = scrollWidth / speed;

  // Start the animation when scrollWidth is determined
  useEffect(() => {
    if (scrollWidth > 0) {
      const startPosition = direction === "left" ? 0 : -scrollWidth;
      const endPosition = direction === "left" ? -scrollWidth : 0;

      // Start the animation
      animationRef.current = animate(
        scope.current,
        { x: [startPosition, endPosition] },
        {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      );
    }

    return () => {
      // Cleanup animation on unmount
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [scrollWidth, direction, speed, animate, duration, scope]);

  // Handle pausing and resuming the animation
  useEffect(() => {
    if (!animationRef.current) return;

    if (isHovered) {
      animationRef.current.pause();
    } else {
      animationRef.current.play();
    }
  }, [isHovered]);

  // If we haven't measured the container width yet, render a static version to measure
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

  return (
    <div
      className="h-[280px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={scope}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          maxHeight: "280px",
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
            {isLoading ? (
              <LoadingItem />
            ) : RenderItem ? (
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
