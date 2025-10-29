"use client";

import { FuturePositionCardProps } from "../types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { formatPrice } from "@/lib/helpers/price";
import { truncateAddress } from "@/lib/helpers/address";
import { useContext, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AppContext } from "@/lib/providers/Providers";

export const FuturePositionCard = ({
  futurePosition,
  futureCredit,
  dict,
}: FuturePositionCardProps) => {
  const router = useRouter();
  const context = useContext(AppContext);
  const [formattedPrice, setFormattedPrice] = useState<string>("");

  const child = futureCredit ? futureCredit.child : futurePosition?.child;
  const position = futureCredit ? futureCredit.position : futurePosition;

  useEffect(() => {
    const loadPrice = async () => {
      if (!position || !child) return;
      const price = await formatPrice(
        position.pricePerUnit,
        child.infraCurrency
      );
      setFormattedPrice(price);
    };
    loadPrice();
  }, [position, child]);

  const handleClick = () => {
    if (!child) return;
    router.push(`/market/future/${child.childContract}/${child.childId}`);
  };

  if (!child || !position) return null;

  const imageUrl = child.metadata?.image
    ? getIPFSUrl(child.metadata.image)
    : "/images/default.png";

  const title = child.metadata?.title || `${dict?.child} ${child.childId}`;

  const supplierName =
    futurePosition?.supplierProfile?.metadata?.title ||
    truncateAddress(position.supplier);

  const deadline =
    position.deadline !== "0"
      ? formatDistanceToNow(new Date(Number(position.deadline) * 1000), {
          addSuffix: true,
        })
      : dict?.perpetual ;

  const formattedDate = new Date(
    parseInt(position.blockTimestamp) * 1000
  ).toLocaleDateString();

  const available = futureCredit
    ? BigInt(futureCredit.credits) - BigInt(futureCredit.consumed)
    : null;

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer transition-all duration-300 relative overflow-hidden"
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
              {dict?.futures} #{child.childId}
            </div>
            <h4 className="font-agency text-base leading-tight truncate">
              {title}
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
              {position.isActive
                ? dict?.active
                : dict?.inactive}
            </div>
          </div>
        </div>
        <div
          className={`relative aspect-square overflow-hidden rounded-xl ${
            context?.colorSwitch ? "bg-white" : "bg-black"
          }`}
        >
          <Image
            src={imageUrl}
            fill
            draggable={false}
            alt={title}
            className="object-contain rounded-md transition-transform duration-300"
          />
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderblue.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
          <div
            className="absolute top-1 right-2 cursor-pointer flex w-fit h-fit"
            onClick={(e) => {
              e.stopPropagation();
              context?.setColorSwitch((prev) => !prev);
            }}
          >
            <div className="relative w-4 h-4 flex">
              <Image
                src={`/images/${
                  context?.colorSwitch ? "blackswitch" : "whiteswitch"
                }.png`}
                draggable={false}
                objectFit="contain"
                fill
                alt="switch"
              />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="text-xs text-verde font-chicago relative lowercase cursor-pointer flex px-3 py-1 bg-offNegro/70 rounded-sm">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderblue.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                {position.isSettled
                  ? dict?.settled 
                  : dict?.open }
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3">
          <div className="grid grid-cols-2 gap-2 text-base mb-2">
            <div className="space-y-1">
              <div className="font-awk uppercase tracking-wide text-gris">
                {dict?.supplier}
              </div>
              <div className="text-oro font-slim text-xs leading-tight truncate">
                {supplierName}
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
                  {dict?.pricePerUnit}
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

          {futureCredit && (
            <div className="pt-3 border-t border-oro/30 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="font-awk uppercase tracking-wide text-gris">
                    {dict?.credits}
                  </div>
                  <div className="text-white font-slim">
                    {futureCredit.credits}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-awk uppercase tracking-wide text-gris">
                    {dict?.consumed}
                  </div>
                  <div className="text-fresa font-slim">
                    {futureCredit.consumed}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-verde/30 grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="font-awk uppercase tracking-wide text-verde">
                    {dict?.available}
                  </div>
                  <div className="text-verde font-slim">
                    {available?.toString()}
                  </div>
                </div>
              </div>
            </div>
          )}

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
