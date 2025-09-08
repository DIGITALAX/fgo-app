import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMarketsApproval } from "../../../hooks/infrastructure/approval/useMarketsApproval";
import { ApprovalItemCard } from "./ApprovalItemCard";
import { MarketsApprovalTabProps } from "@/components/Account/types";

export const MarketsApprovalTab = ({
  itemData,
  itemType,
  dict
}: MarketsApprovalTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    markets,
    loading,
    error,
    hasMore,
    loadMore,
    approveMarket,
    revokeMarket,
    approving,
    revoking,
  } = useMarketsApproval(itemData, itemType, searchQuery, dict);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-fresa font-herm text-sm">
          {dict?.errorLoadingMarkets}: {error}
        </p>
      </div>
    );
  }

  if (loading && markets.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white text-sm font-herm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
          <span>{dict?.loadingMarkets}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-herm text-lg">{dict?.availableMarkets}</h3>
        <div className="text-white/60 font-herm text-sm">
          {markets.length} {markets.length !== 1 ? dict?.markets : dict?.market}
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder={dict?.searchByTitleDescriptionLink}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white font-herm text-sm placeholder:text-white/40 focus:outline-none focus:border-ama"
        />
      </div>

      <div className="flex-1">
        <InfiniteScroll
          dataLength={markets.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4 text-white/60 font-herm text-sm">
              {dict?.loadingMoreMarkets}
            </div>
          }
          height="100%"
          style={{ height: "100%" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {markets.map((market: any) => {
              const isApproved =
                itemData.authorizedMarkets?.some(
                  (am: any) =>
                    am.contractAddress?.toLowerCase() ===
                    market.contractAddress?.toLowerCase()
                ) || false;

              return (
                <ApprovalItemCard
                  key={market.contractAddress}
                  item={market}
                  isApproved={isApproved}
                  isActive={market.isActive !== false}
                  onApprove={() => approveMarket(market.contractAddress)}
                  onRevoke={() => revokeMarket(market.contractAddress)}
                  itemType="market"
                  loading={
                    approving === market.contractAddress ||
                    revoking === market.contractAddress
                  }
                  dict={dict}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};
