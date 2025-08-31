import Image from "next/image";
import {ParentItemCardProps } from "../../../types";
import { INFURA_GATEWAY } from "@/constants";


export const ParentItemCard = ({ parent, onClick }: ParentItemCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(parent);
    }
  };

  const displayTitle = parent.metadata?.title || parent.title || "Unnamed Parent";
  const displayImage = parent.metadata?.image || "";

  return (
    <div
      className={`bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-3 transition-all ${
        onClick ? "hover:bg-gray-700 hover:border-gray-600 cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
        {displayImage ? (
          <Image
            src={displayImage.startsWith('ipfs://') 
              ? `${INFURA_GATEWAY}${displayImage.slice(7)}`
              : displayImage
            }
            alt={displayTitle}
            width={150}
            height={150}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="text-gray-500 text-xl">🎨</div>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-white font-medium text-sm line-clamp-2">
          {displayTitle}
        </h4>
        
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>ID:</span>
            <span className="text-gray-300">#{parent.designId}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-gray-300">{parent.status}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Purchases:</span>
            <span className="text-gray-300">{parent.totalPurchases}</span>
          </div>
        </div>
      </div>
    </div>
  );
};