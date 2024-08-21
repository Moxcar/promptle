import Image from "next/image";

export default async function DailyImage({
  imageUrl,
}: {
  imageUrl: string | undefined;
}) {
  return (
    <Image
      src={imageUrl ?? ""}
      alt="Daily image"
      width={250}
      height={250}
      priority
    />
  );
}
