import { MarketsTabProps } from "../../../types";
import { useMarketContracts } from "../../../hooks/infrastructure/children/useMarketContracts";
import { useMarketsNavigation } from "../../../hooks/infrastructure/markets/useMarketsNavigation";
import { DeployMarketModal } from "./DeployMarketModal";
import { ContractCard } from "../ContractCard";
import { MarketContractDetailView } from "./MarketContractDetailView";
import { useDeployMarket } from "@/components/Account/hooks/infrastructure/markets/useDeployMarket";

export const MarketsTab = ({ infrastructure, isOwner }: MarketsTabProps) => {
  const {
    marketContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useMarketContracts(infrastructure.infraId);

  const { isModalOpen, loading, openModal, closeModal, handleSubmit, cancelOperation } =
    useDeployMarket(infrastructure, refetch);

  const { selectedMarketContract, selectMarketContract, clearSelection } =
    useMarketsNavigation();

  if (selectedMarketContract) {
    return (
      <MarketContractDetailView
        marketContract={selectedMarketContract}
        onBack={clearSelection}
        
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Market Contracts</h3>
        {isOwner && (
          <button
            onClick={openModal}
            disabled={infrastructure.isActive == false || loading}
            className="px-3 py-2 bg-white hover:opacity-70 disabled:bg-ama disabled:text-black text-black text-sm font-herm rounded-sm transition-colors"
          >
            Deploy Market Contract
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 text-sm">
            Infrastructure is inactive. Cannot deploy market contracts.
          </p>
        </div>
      )}

      {contractsError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">❌ {contractsError}</p>
          <button
            onClick={refetch}
            className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
          >
            Try again
          </button>
        </div>
      )}

      {contractsLoading ? (
        <div className="flex items-center justify-center font-herm">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
            <span>Loading market contracts...</span>
          </div>
        </div>
      ) : marketContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketContracts.map((marketContract) => (
            <ContractCard
              key={marketContract.id}
              contract={marketContract}
              onClick={selectMarketContract}
            />
          ))}
        </div>
      ) : (
        <div className="p-6">
          <p className="text-ama text-xs text-center font-herm">
            {infrastructure.isActive
              ? "No market contracts deployed yet. Deploy your first market contract to get started."
              : "Infrastructure is inactive. Activate infrastructure to deploy market contracts."}
          </p>
        </div>
      )}

      <DeployMarketModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onCancel={cancelOperation}
        loading={loading}
      />
    </div>
  );
};
