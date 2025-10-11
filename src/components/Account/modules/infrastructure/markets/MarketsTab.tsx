import { MarketsTabProps } from "../../../types";
import { useMarketContracts } from "../../../hooks/infrastructure/children/useMarketContracts";
import { useMarketsNavigation } from "../../../hooks/infrastructure/markets/useMarketsNavigation";
import { DeployMarketModal } from "./DeployMarketModal";
import { ContractCard } from "../ContractCard";
import { MarketContractDetailView } from "./MarketContractDetailView";
import { useDeployMarket } from "@/components/Account/hooks/infrastructure/markets/useDeployMarket";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const MarketsTab = ({
  infrastructure,
  isOwner,
  dict,
}: MarketsTabProps) => {
  const {
    marketContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useMarketContracts(infrastructure.infraId, dict);

  const {
    isModalOpen,
    loading,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  } = useDeployMarket(infrastructure, refetch);

  const { selectedMarketContract, selectMarketContract, clearSelection } =
    useMarketsNavigation();

  if (selectedMarketContract) {
    return (
      <MarketContractDetailView
        dict={dict}
        marketContract={selectedMarketContract}
        onBack={clearSelection}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-awk uppercase text-oro">
          {dict?.marketContracts}
        </h3>
        {isOwner && (
          <button
            onClick={openModal}
            disabled={infrastructure.isActive == false || loading}
            className="relative"
          >
            <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
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
                {dict?.deployMarketContract}
              </span>
            </div>
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <FancyBorder className="relative" type="diamond" color="oro">
          <div className="relative z-10 p-4">
            <p className="text-white text-sm font-chicago">
              {dict?.infrastructureInactiveCannotDeployMarkets ||
                "infrastructure inactive, cannot deploy markets"}
            </p>
          </div>
        </FancyBorder>
      )}

      {contractsError && (
        <FancyBorder className="relative" type="diamond" color="oro">
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
                <span className="relative z-10">
                  {dict?.tryAgain}
                </span>
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
              dict={dict}
              key={marketContract.id}
              contract={marketContract}
              onClick={selectMarketContract}
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="relative z-10 p-6 text-center">
            <p className="text-gris font-chicago text-sm">
              {infrastructure.isActive
                ? dict?.noMarketContractsDeployed ||
                  "no market contracts deployed"
                : dict?.infrastructureInactiveActivateMarkets ||
                  "infrastructure inactive, activate first"}
            </p>
          </div>
        </div>
      )}

      <DeployMarketModal
        dict={dict}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onCancel={cancelOperation}
        loading={loading}
      />
    </div>
  );
};
