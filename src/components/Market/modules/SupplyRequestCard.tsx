"use client";

import { SupplyRequestCardProps } from "../types";
import Image from "next/image";
import { formatPrice } from "@/lib/helpers/price";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const TEST_TOKEN_ADDRESS = "0xE5E9D4C119a28302EDa029155bF00efd35E06c93";

export const SupplyRequestCard = ({
  supplyRequest,
  dict,
}: SupplyRequestCardProps) => {
  const [formattedPrice, setFormattedPrice] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const loadPrice = async () => {
      const price = await formatPrice(
        supplyRequest.preferredMaxPrice,
        TEST_TOKEN_ADDRESS
      );
      setFormattedPrice(price);
    };
    loadPrice();
  }, [supplyRequest]);

  const deadline = supplyRequest.deadline
    ? formatDistanceToNow(new Date(Number(supplyRequest.deadline) * 1000), {
        addSuffix: true,
      })
    : dict?.na || "N/A";

  const formattedDate = new Date(
    parseInt(supplyRequest.blockTimestamp) * 1000
  ).toLocaleDateString();

  const handleClick = () => {
    router.push(`/market/supply-request/${supplyRequest.id}/`);
  };

  return (
    <div
      className="group transition-all duration-300 relative overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
        <Image
          src={"/images/borderpurple.png"}
          draggable={false}
          objectFit="fill"
          fill
          alt="border"
        />
      </div>
      <div className="p-3 space-y-3 text-white">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col w-fit h-fit">
            <div className="text-xs font-awk uppercase tracking-wide mb-1">
              {dict?.supplyRequest}
            </div>
            <h4 className="font-agency text-base leading-tight">
              {supplyRequest.isPhysical
                ? dict?.physical
                : dict?.digital}
            </h4>
          </div>
          <div className="flex">
            <div className="text-xs text-gris font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro">
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderoro2.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              {supplyRequest.paid ? dict?.paid : dict?.open }
            </div>
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden bg-offNegro/30 flex items-center justify-center">
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderblue.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
          {supplyRequest.customSpec && (
            <div className="relative z-10 p-4 w-full h-full overflow-y-auto">
              <div className="text-xs font-chicago text-gris mb-2 uppercase">
                {dict?.customSpec }:
              </div>
              <div className="text-xs font-chicago text-white whitespace-pre-wrap">
                {supplyRequest.customSpec}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3">
          <div className="grid grid-cols-2 gap-2 text-base mb-2">
            <div className="space-y-1">
              <div className="font-awk uppercase tracking-wide text-gris">
                {dict?.quantity}
              </div>
              <div className="text-oro font-slim text-xs leading-tight truncate">
                {supplyRequest.quantity}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-awk uppercase tracking-wide text-gris">
                {dict?.deadline}
              </div>
              <div className="text-oro font-slim text-xs leading-tight truncate">
                {deadline}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-awk text-oro uppercase text-lg">
                  {dict?.maxPrice}
                </span>
                <div className="text-xs text-gris font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  {formattedPrice}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-gris text-center w-full justify-center flex">
            <div className="text-sm font-awk uppercase tracking-wide">
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
