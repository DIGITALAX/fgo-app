"use client";

import { NAV_ITEMS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="relative w-full h-fit flex items-center justify-center pt-2 sm:pt-3 text-white px-2">
      <div className="relative flex w-fit h-fit max-w-full">
        <div className="bg-black backdrop-blur-sm border-2 border-mar px-3 sm:px-6 py-2 sm:py-3 w-full">
          <div className="flex items-center space-x-2 sm:space-x-6 justify-center flex-wrap sm:flex-nowrap">
            <div className="relative w-fit h-fit flex flex-col items-center justify-start gap-2 sm:gap-0 flex-shrink-0">
              <div className="relative font-gen uppercase flex w-fit text-center text-xl sm:text-2xl lg:text-5xl h-fit justify-center items-center tracking-widest">
                FGO
              </div>
              <div
                className="absolute text-black font-gen uppercase flex w-fit text-center text-xl sm:text-2xl lg:text-5xl h-fit justify-center items-center z-1 sm:right-1 right-px tracking-widest"
                id="title"
              >
                FGO
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto flex-shrink-0">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    pathname === item.href ||
                    pathname.replace(/\/$/, "") === item.href
                      ? "text-mar"
                      : "hover:text-mar/80"
                  }`}
                >
                  <div className="relative w-fit h-fit flex flex-col items-center justify-start gap-2 sm:gap-0">
                    <div className="relative font-gen uppercase flex w-fit text-center text-lg sm:text-xl lg:text-5xl h-fit justify-center items-center tracking-widest">
                      {item.label}
                    </div>
                    <div
                      className="absolute text-black font-gen uppercase flex w-fit text-center text-lg sm:text-xl lg:text-5xl h-fit justify-center items-center z-1 sm:right-1 right-px tracking-widest"
                      id="title"
                    >
                      {item.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
