"use client";

import { type ImageData } from "~/lib/types";
import { ScrollingRow } from "./ScrollingRow";
import CustomImage from "./CustomImage";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface ScrollingRowContainerProps {
  images: ImageData[];
}

export default function ScrollingRowContainer({
  images,
}: ScrollingRowContainerProps) {
  const [numberOfRows, setNumberOfRows] = useState(4);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [rows, setRows] = useState<ImageData[][]>(() => {
    const initialRows = Array.from({ length: numberOfRows }, () => []);
    images.forEach((image, index) => {
      initialRows[index % numberOfRows]?.push(image);
    });
    return initialRows;
  });

  const [ref, inView] = useInView();
  const { data: newImages } = api.dailyImage.getImagesForBackground.useQuery(
    {
      amount: 12,
      skip: numberOfRows * 12,
    },
    {
      enabled: inView,
    },
  );

  useEffect(() => {
    if (newImages) {
      if (newImages.length > 0) {
        setRows((prevRows) => {
          const newRows = [...prevRows];
          newRows[numberOfRows] = newImages;
          return newRows;
        });
        setNumberOfRows((prev) => prev + 1);
      } else {
        setInfiniteScroll(false);
      }
    }
  }, [newImages, numberOfRows]);

  return (
    <div className="overflow-hidden">
      <div>
        {rows.map((rowImages, rowIndex) => (
          <ScrollingRow
            key={rowIndex}
            images={rowImages}
            direction={rowIndex % 2 === 0 ? "left" : "right"}
            speed={50}
            RenderItem={CustomImage}
          />
        ))}
        {infiniteScroll && <div ref={ref} className="h-4" />}
      </div>
    </div>
  );
}
