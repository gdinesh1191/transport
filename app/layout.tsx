 'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingProvider } from "./utils/pageLoader";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    const startLoading = () => {
      setLoading(true);
      setProgress(20);
      timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);
    };

    const finishLoading = () => {
      clearInterval(timer);
      setProgress(100);
      finishTimer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 400);
    };

    startLoading();
    const renderComplete = setTimeout(() => {
      finishLoading();
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
      clearTimeout(renderComplete);
    };
  }, [pathname]);

  return (
    <html lang="en">
      <head>
      <link rel="icon" href="favig.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
        <LoadingProvider>
          {/* TopLoader */}
          {loading && (
            <div
              className="fixed top-0 left-0 h-1 bg-[#009333] z-50 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          )}

          {children}
        </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
