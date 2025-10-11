"use client";

import { useAccount } from "wagmi";
import { useFulfillerContracts } from "../../hooks/useFulfillerContracts";
import { useMarketsNavigation } from "../../hooks/infrastructure/markets/useMarketsNavigation";
import { ContractCard } from "./../infrastructure/ContractCard";
import { MarketContractDetailView } from "./../infrastructure/markets/MarketContractDetailView";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const FulfillerTab = ({ dict }: { dict: any }) => {
  const { address } = useAccount();
  const {
    marketContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useFulfillerContracts(address || "", dict);

  const { selectedMarketContract, selectMarketContract, clearSelection } =
    useMarketsNavigation();

  if (selectedMarketContract) {
    return (
      <MarketContractDetailView
        marketContract={selectedMarketContract}
        onBack={clearSelection}
        dict={dict}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-awk uppercase text-oro">
            {dict?.fulfillerDashboard}
          </h2>
          <p className="text-gris font-chicago text-sm mt-2">
            {dict?.manageMarketContracts}
          </p>
        </div>
        <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
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
            {marketContracts.length}{" "}
            {marketContracts.length === 1 ? dict?.contract : dict?.contracts}
          </span>
        </div>
      </div>

      {contractsError && (
        <FancyBorder type="diamond" color="oro" className="relative">
          <div className="relative z-10 p-4 space-y-3">
            <p className="text-fresa text-sm font-chicago">{contractsError}</p>
            <div
              onClick={refetch}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.tryAgain}</span>
              </div>
            </div>
          </div>
        </FancyBorder>
      )}

      {contractsLoading ? (
        <div className="w-full h-full flex items-center justify-center py-12">
          <div className="relative w-fit animate-spin h-fit flex">
            <div className="relative w-6 h-6 flex">
              <Image
                layout="fill"
                objectFit="cover"
                src={"/images/scissors.png"}
                draggable={false}
                alt="loader"
              />
            </div>
          </div>
        </div>
      ) : marketContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketContracts.map((marketContract) => (
            <ContractCard
              key={marketContract.id}
              contract={marketContract}
              onClick={selectMarketContract}
              dict={dict}
            />
          ))}
        </div>
      ) : (
        <FancyBorder type="diamond" color="oro" className="relative">
          <div className="relative z-10 p-8 text-center space-y-3">
            <h3 className="text-2xl font-awk uppercase text-oro">
              {dict?.noMarketContractsFound}
            </h3>
            <p className="text-gris font-chicago text-sm">
              {dict?.noMarketContractsAccess}
            </p>
            <p className="text-xs text-gris font-chicago">
              {dict?.contactInfrastructureOwner}
            </p>
          </div>
        </FancyBorder>
      )}
    </div>
  );
};
