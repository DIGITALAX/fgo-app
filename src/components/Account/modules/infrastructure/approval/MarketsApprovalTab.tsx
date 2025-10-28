import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMarketsApproval } from "../../../hooks/infrastructure/approval/useMarketsApproval";
import { ApprovalItemCard } from "./ApprovalItemCard";
import { MarketContract, MarketsApprovalTabProps } from "@/components/Account/types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const MarketsApprovalTab = ({
  itemData,
  itemType,
  dict,
}: MarketsApprovalTabProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        <p className="text-fresa font-chicago text-sm">
          {dict?.errorLoadingMarkets}: {error}
        </p>
      </div>
    );
  }

  if (loading && markets.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
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
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-oro font-awk uppercase text-lg">
          {dict?.availableMarkets}
        </h3>
        <div className="text-gris font-chicago text-sm">
          {markets.length} {markets.length !== 1 ? dict?.markets : dict?.market}
        </div>
      </div>

      <FancyBorder type="circle" color="white" className="relative mb-4 h-10">
        <input
          type="text"
          placeholder={dict?.searchByTitleDescriptionLink}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="relative z-10 w-full h-full px-4 py-2 text-white font-chicago text-sm placeholder:text-gris/40 focus:outline-none"
        />
      </FancyBorder>

      <div className="flex-1">
        <InfiniteScroll
          dataLength={markets.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center py-4">
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
          }
          height={500}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {markets.map((market, i) => {
              const isApproved =
                itemData.authorizedMarkets?.some(
                  (am: MarketContract) =>
                    am.contractAddress?.toLowerCase() ===
                    market.contractAddress?.toLowerCase()
                ) || false;

              return (
                <ApprovalItemCard
                  key={i}
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
