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

const LoadingItem = () => (
  <div className="relative m-2 h-[280px] w-[210px] overflow-hidden rounded-lg">
    <div className="absolute inset-0 animate-pulse bg-gray-200" />
    <div className="absolute bottom-0 left-0 right-0 p-2">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-300" />
    </div>
  </div>
);

export default function ScrollingRowContainer({
  images,
}: ScrollingRowContainerProps) {
  const [numberOfRows, setNumberOfRows] = useState(4);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<ImageData[][]>(() => {
    const initialRows: ImageData[][] = Array.from(
      { length: numberOfRows },
      () => [],
    );
    images.forEach((image, index) => {
      initialRows[index % numberOfRows]?.push(image);
    });
    return initialRows;
  });

  const [completedImageIds, setCompletedImageIds] = useState<number[]>([]);
  // Initialize completedImageIds from local storage
  useEffect(() => {
    const storedCompletedImageIds = localStorage.getItem("completedImageIds");
    if (storedCompletedImageIds) {
      setCompletedImageIds(JSON.parse(storedCompletedImageIds) as number[]);
    }
  }, []);

  const [ref, inView] = useInView();
  const { data: newImages, isLoading: isFetching } =
    api.dailyImage.getImagesForBackground.useQuery(
      {
        amount: 12,
        skip: numberOfRows * 12,
      },
      {
        enabled: () => {
          return inView && infiniteScroll && !isLoading;
        },
      },
    );

  useEffect(() => {
    if (newImages) {
      if (newImages.length === 0) {
        setInfiniteScroll(false);
        return;
      }
      setRows((prevRows) => {
        const newRows = [...prevRows];
        newRows[numberOfRows] = newImages;
        return newRows;
      });
      setNumberOfRows((prev) => prev + 1);
    }
  }, [newImages, numberOfRows]);

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

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
            LoadingItem={LoadingItem}
            completedImageIds={completedImageIds}
          />
        ))}
        {isLoading && (
          <ScrollingRow
            images={Array.from({ length: 12 }, (_, i) => ({
              imageUrl: "",
              dailyImageGuessId: -1,
              wordLength: 0,
            }))}
            direction={numberOfRows % 2 === 0 ? "left" : "right"}
            speed={50}
            RenderItem={CustomImage}
            LoadingItem={LoadingItem}
            isLoading={true}
          />
        )}
        {infiniteScroll && <div ref={ref} className="h-4" />}
      </div>
    </div>
  );
}
