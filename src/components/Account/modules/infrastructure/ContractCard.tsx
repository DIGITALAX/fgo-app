import Image from "next/image";
import { ContractCardProps } from "../../types";
import { INFURA_GATEWAY } from "@/constants";

export const ContractCard = ({
  contract,
  onClick,
  dict,
}: ContractCardProps) => {
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
      className={`group cursor-pointer transition-all duration-300 relative overflow-hidden ${
        !onClick ? "pointer-events-none" : ""
      }`}
      onClick={handleClick}
    >
      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
        <Image
          src={"/images/borderblue.png"}
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
              {isMarketContract
                ? dict?.market
                : isChildContract
                ? dict?.child
                : dict?.parent}
            </div>
            <h4 className="font-agency text-base leading-tight text-white line-clamp-2">
              {displayTitle}
            </h4>
          </div>
        </div>

        {displayImage && (
          <div className="relative aspect-square overflow-hidden">
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
        )}

        <div className="pt-3">
          <div className="grid grid-cols-1 gap-2 text-xs">
            {!isMarketContract && (
              <div className="flex justify-between items-center">
                <span className="font-awk uppercase text-gris">
                  {dict?.scm}:
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
                  <span className="relative z-10">{contract.scm}</span>
                </div>
              </div>
            )}

            {isChildContract && (
              <div className="flex justify-between items-center">
                <span className="font-awk uppercase text-gris">
                  {dict?.type}:
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
                  <span className="relative z-10">{contract.childType}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="font-awk uppercase text-gris">
                {dict?.symbol}:
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
                <span className="relative z-10">{contract.symbol}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-awk uppercase text-gris">
                {dict?.address}:
              </span>
              <div className="text-xs text-gris font-pixel relative flex px-2 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10 truncate max-w-20">
                  {contract.contractAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
