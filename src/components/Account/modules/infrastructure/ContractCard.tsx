import Image from "next/image";
import { ContractCardProps } from "../../types";
import { INFURA_GATEWAY } from "@/constants";

export const ContractCard = ({ contract, onClick, dict }: ContractCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(contract as any);
    }
  };

  const isMarketContract = "marketURI" in contract;
  const isChildContract = "childType" in contract;
  const displayTitle = isMarketContract
    ? contract.marketMetadata?.title || contract.title || dict?.unnamedMarket
    : isChildContract
    ? contract.title || dict?.unnamedChild
    : contract.parentMetadata?.title || contract.title || dict?.unnamedParent;
  const displayImage = isMarketContract
    ? contract.marketMetadata?.image || ""
    : isChildContract
    ? null
    : contract.parentMetadata?.image || "";

  return (
    <div
      className={`rounded-sm border border-white p-4 space-y-4 transition-all ${
        onClick ? "hover:border-fresa cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      {displayImage && (
        <div className="aspect-square rounded-sm overflow-hidden bg-black flex items-center justify-center">
          <Image
            src={
              displayImage.startsWith("ipfs://")
                ? `${INFURA_GATEWAY}${displayImage.slice(7)}`
                : displayImage
            }
            alt={displayTitle}
            width={200}
            draggable={false}
            height={200}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-white font-semibold text-sm line-clamp-2">
          {displayTitle}
        </h3>

        <div className="text-xs text-white space-y-1">
          {!isMarketContract && (
            <div className="flex justify-between">
              <span>{dict?.scm}:</span>
              <span className="font-mono text-ama">{contract.scm}</span>
            </div>
          )}

          {isChildContract && (
            <div className="flex justify-between">
              <span>{dict?.type}:</span>
              <span className="font-mono text-ama">
                {contract.childType}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>{dict?.symbol}:</span>
            <span className="font-mono text-ama">{contract.symbol}</span>
          </div>

          <div className="flex justify-between">
            <span>{dict?.address}:</span>
            <span className="font-mono text-ama truncate max-w-20">
              {contract.contractAddress}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
