import Image from "next/image";
import MainInput from "~/components/main-input";

export default function Page() {
  const inputLength = 8;
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <Image src="/logo.svg" alt="Logo" width={200} height={200} />
      <MainInput length={inputLength} />
      <MainInput length={inputLength} />
      <MainInput length={inputLength} />
      <MainInput length={inputLength} />
      <MainInput length={inputLength} />
      <MainInput length={inputLength} />
    </main>
  );
}
