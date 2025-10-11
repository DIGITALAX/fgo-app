"use client";

import { NAV_ITEMS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = ({ dict }: { dict: any }) => {
  const pathname = usePathname();
  const isRootPath =
    pathname === "/" ||
    pathname === "/en/" ||
    pathname === "/es/" ||
    pathname === "/pt/";

  return (
    <div className="relative flex items-center justify-center w-full px-4">
      <div className="relative w-[95%] sm:w-[85%] h-fit flex items-center justify-center sm:justify-between flex-row pt-2 sm:pt-3 text-white px-3 sm:flex-nowrap flex-wrap gap-5">
        <div className="relative w-fit h-fit text-4xl text-oro font-count">
          fgo
        </div>
        <div className="flex flex-wrap justify-center items-center flex-row gap-2 font-pixel">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md uppercase text-sm ${
                (item.label.toLowerCase() === "library" && isRootPath) ||
                pathname.includes(item.label.toLowerCase())
                  ? "text-oro"
                  : "text-gris hover:text-oro"
              }`}
            >
              {dict?.[item.label.toLowerCase()] || item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
