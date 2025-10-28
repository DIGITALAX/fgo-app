"use client";

import Image from "next/image";
import { useState } from "react";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { MarketSearchBarProps } from "../types";

export const MarketSearchBar = ({ searchText, onSearch, dict }: MarketSearchBarProps) => {
  const [inputValue, setInputValue] = useState<string>(searchText);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <div className="relative w-full h-fit flex font-chicago">
      <div className="w-full max-w-lg mx-auto mb-6 h-10 flex flex-row gap-3">
        <div className="relative w-fit flex">
          <div className="relative w-7 h-full flex">
            <Image
              src={"/images/detail.png"}
              draggable={false}
              objectFit="contain"
              fill
              alt="detail"
            />
          </div>
        </div>
        <FancyBorder
          color="white"
          type="circle"
          className="relative h-full flex w-full"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={dict?.searchPlaceholder}
            className="w-full px-4 py-2 z-10 flex text-white focus:outline-none pr-20"
          />

          <div className="absolute right-2 z-20 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gris hover:text-white text-sm"
              >
                {dict?.close}
              </button>
            )}
            <div className="relative w-fit h-fit cursor-pointer z-20 flex">
              <div
                onClick={() => handleSubmit()}
                className="relative w-6 h-6 flex"
              >
                <Image
                  src={"/images/arrow.png"}
                  draggable={false}
                  objectFit="contain"
                  fill
                  alt="arrow"
                />
              </div>
            </div>
          </div>
        </FancyBorder>
        <div className="relative w-fit flex">
          <div className="relative w-7 h-full flex">
            <Image
              src={"/images/detail.png"}
              draggable={false}
              objectFit="contain"
              fill
              alt="detail"
            />
          </div>
        </div>
      </div>
    </div>
  );
};