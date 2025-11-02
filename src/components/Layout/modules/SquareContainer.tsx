"use client";

import Image from "next/image";
import { ContainerProps } from "../types";

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="relative flex items-center justify-center w-full px-4">
      <div className="relative w-[95%] sm:w-[85%] min-h-[40rem] h-[85vh]">
        <div className="absolute -right-3 top-3 flex w-full h-full">
          <Image
            layout="fill"
            draggable={false}
            objectFit="fill"
            alt="bg"
            src={"/images/bg.png"}
          />
        </div>
        <div className="relative border-4 rounded-lg border-oro overflow-hidden w-full h-full bg-black flex flex-col p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
