import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/ThemeProvider";
import { GlobalStateProvider } from "~/components/GlobalStateContext";
import NavBar from "~/components/Navbar";

export const metadata: Metadata = {
  title: "Promptle",
  description: "A daily word game based on AI generated images",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <GlobalStateProvider>
              <main className="min-h-screen pt-16 text-black dark:text-white">
                <NavBar />
                {children}
              </main>
            </GlobalStateProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
