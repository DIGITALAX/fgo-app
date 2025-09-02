import Image from "next/image";
import { ParentItemCardProps } from "../../../types";
import { INFURA_GATEWAY } from "@/constants";
import { formatPrice } from "@/lib/helpers/price";
import { useEffect, useState } from "react";
import { getStatusLabel } from "@/lib/helpers/status";

export const ParentItemCard = ({ parent, onClick }: ParentItemCardProps) => {
  const [formattedDigitalPrice, setFormattedDigitalPrice] = useState<string>("Free");
  const [formattedPhysicalPrice, setFormattedPhysicalPrice] = useState<string>("Free");

  const handleClick = () => {
    if (onClick) {
      onClick(parent);
    }
  };

  const displayTitle =
    parent.metadata?.title || parent.title || "Unnamed Parent";
  const displayImage = parent.metadata?.image || "";

  useEffect(() => {
    const formatPrices = async () => {
      if (parent.digitalPrice && parent.digitalPrice !== "0") {
        const digital = await formatPrice(parent.digitalPrice, parent.infraCurrency);
        setFormattedDigitalPrice(digital);
      }
      
      if (parent.physicalPrice && parent.physicalPrice !== "0") {
        const physical = await formatPrice(parent.physicalPrice, parent.infraCurrency);
        setFormattedPhysicalPrice(physical);
      }
    };

    formatPrices();
  }, [parent.digitalPrice, parent.physicalPrice, parent.infraCurrency]);

  return (
    <div
      className={`group overflow-hidden gap-1 sm:gap-2 flex flex-col transition-colors p-1 sm:p-2 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="border border-white rounded-sm p-1 sm:p-2 group-hover:border-fresa transition-colors">
        {displayImage ? (
          <div className="aspect-square w-full relative">
            <Image
              src={
                displayImage.startsWith("ipfs://")
                  ? `${INFURA_GATEWAY}${displayImage.slice(7)}`
                  : displayImage
              }
              alt={displayTitle}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="aspect-square w-full flex items-center justify-center">
            <div className="text-ama text-xl">🎨</div>
          </div>
        )}
      </div>

      <div className="border border-white rounded-sm w-full flex flex-row gap-1 sm:gap-2 justify-between p-1 sm:p-2 text-xs uppercase font-break text-ama group-hover:border-fresa transition-colors">
        <div className="relative w-fit h-fit flex truncate">
          #{parent.designId}
        </div>
        <div className="relative w-fit h-fit flex truncate">
          {getStatusLabel(parent.status)}
        </div>
      </div>

      <div className="space-y-1 sm:space-y-2 border border-white rounded-sm p-1 sm:p-2 group-hover:border-fresa transition-colors">
        <h4 className="text-white font-semibold text-sm truncate">
          {displayTitle}
        </h4>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="truncate">Purchases:</span>
            <span className="text-ama truncate ml-1">
              {parent.totalPurchases}
            </span>
          </div>
          {Number(parent.digitalPrice) > 0 && (
            <div className="flex justify-between">
              <span className="truncate">Digital Price:</span>
              <span className="text-ama truncate ml-1">
                {formattedDigitalPrice}
              </span>
            </div>
          )}
          {Number(parent.physicalPrice) > 0 && (
            <div className="flex justify-between">
              <span className="truncate">Physical Price:</span>
              <span className="text-ama truncate ml-1">
                {formattedPhysicalPrice}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
