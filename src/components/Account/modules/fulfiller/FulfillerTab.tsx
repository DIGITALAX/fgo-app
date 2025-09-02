import { useAccount } from "wagmi";
import { useFulfillerContracts } from "../../hooks/useFulfillerContracts";
import { useMarketsNavigation } from "../../hooks/infrastructure/markets/useMarketsNavigation";
import { ContractCard } from "./../infrastructure/ContractCard";
import { MarketContractDetailView } from "./../infrastructure/markets/MarketContractDetailView";

export const FulfillerTab = () => {
  const { address } = useAccount();
  const {
    marketContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useFulfillerContracts(address || "");

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-herm text-white mb-1">
            Fulfiller Dashboard
          </h2>
          <p className="text-white/60 font-herm text-sm">
            Manage market contracts and fulfill orders
          </p>
        </div>
        <div className="text-sm text-white/60 font-herm">
          {marketContracts.length} contract
          {marketContracts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {contractsError && (
        <div className="bg-black border border-fresa rounded-sm p-4">
          <p className="text-fresa text-sm font-herm">❌ {contractsError}</p>
          <button
            onClick={refetch}
            className="mt-2 text-fresa hover:text-ama text-xs underline font-herm"
          >
            Try again
          </button>
        </div>
      )}

      {contractsLoading ? (
        <div className="flex items-center justify-center font-herm p-8">
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
        <div className="bg-black border border-white rounded-sm p-6 text-center">
          <h3 className="text-lg font-herm text-white mb-2">
            No Market Contracts Found
          </h3>
          <p className="text-white/60 mb-4 font-herm text-sm">
            You don't have access to any market contracts yet.
          </p>
          <p className="text-xs text-white/40 font-herm">
            Contact an infrastructure owner to get fulfiller access to market
            contracts.
          </p>
        </div>
      )}
    </div>
  );
};
