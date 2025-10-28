import { MarketContractDetailViewProps } from "@/components/Account/types";
import { getCurrentNetwork } from "@/constants";
import { ProfileManager } from "../../ProfileManager";
import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const MarketContractDetailView = ({
  marketContract,
  onBack,
  dict,
}: MarketContractDetailViewProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const { address } = useAccount();

  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${marketContract.transactionHash}`;

  const displayTitle =
    marketContract.marketMetadata?.title ||
    marketContract.title ||
    dict?.unnamedMarket;
  const displayDescription = marketContract.marketMetadata?.description || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div
          onClick={onBack}
          className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
        >
          <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro items-center gap-2">
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span className="relative z-10 text-sm">←</span>
            <span className="relative z-10">
              {dict?.backToMarketContracts}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h1 className="text-2xl font-awk uppercase text-oro mb-3">
            {displayTitle}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.contract}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {marketContract.contractAddress}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.symbol}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {marketContract.symbol}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.txHash }:
              </span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-oro hover:text-white text-xs break-all transition-colors underline flex"
              >
                {marketContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.deployer}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {marketContract.deployer}
              </p>
            </div>
          </div>

          {displayDescription && (
            <div className="mt-3 pt-3">
              <p className="text-gris font-chicago text-sm">
                {displayDescription}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="relative"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
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
                  {dict?.fulfillerProfile }
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <FancyBorder className="relative" type="diamond" color="oro">
        <div className="relative z-10 p-4 text-center">
          <p className="text-gris font-chicago text-sm">
            {dict?.marketFunctionalityComingSoon ||
              "Market functionality coming soon"}
          </p>
        </div>
      </FancyBorder>

      <ProfileManager
        dict={dict}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contract={marketContract.fulfillerContract}
        infraId={marketContract.infraId}
        walletAddress={address || ""}
        profileType="Fulfiller"
      />
    </div>
  );
};
