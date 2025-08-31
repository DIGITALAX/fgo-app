"use client";

import { NAV_ITEMS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="relative w-full h-fit flex items-center justify-center pt-3 text-white">
      <div className="relative flex w-fit h-fit">
        <div className="bg-black backdrop-blur-sm border-2 border-mar px-6 py-3">
          <div className="flex items-center space-x-6">
            <div className="relative w-full h-fit flex flex-col items-center justify-start gap-4 sm:gap-0">
              <div className="relative font-gen uppercase flex w-full text-center sm:text-5xl text-2xl h-fit justify-center items-center tracking-widest">
                FGO
              </div>
              <div
                className="absolute text-black font-gen uppercase flex w-full text-center sm:text-5xl text-2xl h-fit justify-center items-center z-1  sm:right-1 right-px tracking-widest"
                id="title"
              >
                FGO
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href ||
                    pathname.replace(/\/$/, "") === item.href
                      ? "text-mar"
                      : "hover:text-mar/80"
                  }`}
                >
                  <div className="relative w-full h-fit flex flex-col items-center justify-start gap-4 sm:gap-0">
                    <div className="relative font-gen uppercase flex w-full text-center sm:text-5xl text-2xl h-fit justify-center items-center tracking-widest">
                      {item.label}
                    </div>
                    <div
                      className="absolute text-black font-gen uppercase flex w-full text-center sm:text-5xl text-2xl h-fit justify-center items-center z-1  sm:right-1 right-px tracking-widest"
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
