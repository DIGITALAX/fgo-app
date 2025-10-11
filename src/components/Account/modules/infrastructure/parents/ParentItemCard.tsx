import Image from "next/image";
import { ParentItemCardProps } from "../../../types";
import { INFURA_GATEWAY } from "@/constants";
import { formatPrice } from "@/lib/helpers/price";
import { useEffect, useState } from "react";
import { getStatusLabel } from "@/lib/helpers/status";

export const ParentItemCard = ({
  parent,
  onClick,
  dict,
}: ParentItemCardProps) => {
  const [formattedDigitalPrice, setFormattedDigitalPrice] =
    useState<string>("Free");
  const [formattedPhysicalPrice, setFormattedPhysicalPrice] =
    useState<string>("Free");

  const handleClick = () => {
    if (onClick) {
      onClick(parent);
    }
  };

  const displayTitle =
    parent.metadata?.title || parent.title || dict?.unnamedParent;
  const displayImage = parent.metadata?.image || "";

  useEffect(() => {
    const formatPrices = async () => {
      if (parent.digitalPrice && parent.digitalPrice !== "0") {
        const digital = await formatPrice(
          parent.digitalPrice,
          parent.infraCurrency
        );
        setFormattedDigitalPrice(digital);
      }

      if (parent.physicalPrice && parent.physicalPrice !== "0") {
        const physical = await formatPrice(
          parent.physicalPrice,
          parent.infraCurrency
        );
        setFormattedPhysicalPrice(physical);
      }
    };

    formatPrices();
  }, [parent.digitalPrice, parent.physicalPrice, parent.infraCurrency]);

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
        !onClick ? "pointer-events-none" : ""
      }`}
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
      <div className="relative z-10 p-3 space-y-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-col w-full">
            <div className="text-xs font-awk uppercase tracking-wide mb-1 text-oro">
              {dict?.design} #{parent.designId}
            </div>
            <h4 className="font-agency text-base leading-tight text-white truncate">
              {displayTitle}
            </h4>
          </div>
          <div className="flex">
            <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderoro2.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">
                {getStatusLabel(parent.status, dict)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden">
          {displayImage ? (
            <Image
              src={
                displayImage.startsWith("ipfs://")
                  ? `${INFURA_GATEWAY}${displayImage.slice(7)}`
                  : displayImage
              }
              fill
              draggable={false}
              alt={displayTitle}
              className="object-cover rounded-md transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-oro text-4xl">🎨</div>
            </div>
          )}
          <div className="absolute z-0 top-0 left-0 w-full h-full flex">
            <Image
              src={"/images/borderblue.png"}
              draggable={false}
              objectFit="fill"
              fill
              alt="border"
            />
          </div>
        </div>

        <div className="pt-3">
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-awk uppercase text-gris">
                {dict?.purchases}:
              </span>
              <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{parent.totalPurchases}</span>
              </div>
            </div>
            {Number(parent.digitalPrice) > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-awk uppercase text-oro">
                  {dict?.digital}:
                </span>
                <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">{formattedDigitalPrice}</span>
                </div>
              </div>
            )}
            {Number(parent.physicalPrice) > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-awk uppercase text-oro">
                  {dict?.physical}:
                </span>
                <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">
                    {formattedPhysicalPrice}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
