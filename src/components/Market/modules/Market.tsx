"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useMarket } from "../hooks/useMarket";
import { MarketFilters } from "./MarketFilters";
import { MarketSearchBar } from "./MarketSearchBar";
import { FuturePositionCard } from "./FuturePositionCard";
import { SupplyRequestCard } from "./SupplyRequestCard";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import { ParentItemCard } from "@/components/Account/modules/infrastructure/parents/ParentItemCard";
import { FuturePosition, SupplyRequest } from "../types";
import { Child, Template } from "@/components/Item/types";
import { Parent } from "@/components/Account/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Market = ({ dict }: { dict: any }) => {
  const router = useRouter();
  const {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    filters,
    handleFiltersChange,
  } = useMarket(dict);

  const isFuturePosition = (item: any): item is FuturePosition => {
    return (
      "child" in item &&
      "pricePerUnit" in item &&
      "supplier" in item &&
      "isSettled" in item
    );
  };

  const isSupplyRequest = (item: any): item is SupplyRequest => {
    return (
      "customSpec" in item &&
      "quantity" in item &&
      "isPhysical" in item &&
      "paid" in item
    );
  };

  const isChild = (item: any): item is Child => {
    return (
      "childId" in item && "childContract" in item && !("templateId" in item)
    );
  };

  const isTemplate = (item: any): item is Template => {
    return "templateId" in item && "templateContract" in item;
  };

  const isParent = (item: any): item is Parent => {
    return "designId" in item && "parentContract" in item;
  };

  const renderCard = (item: any, index: number) => {
    if (isFuturePosition(item)) {
      return (
        <FuturePositionCard key={index} futurePosition={item} dict={dict} />
      );
    }

    if (isSupplyRequest(item)) {
      return <SupplyRequestCard key={index} supplyRequest={item} dict={dict} />;
    }

    if (isChild(item)) {
      return <LibraryCard key={index} data={item} dict={dict} />;
    }

    if (isTemplate(item)) {
      return <LibraryCard key={index} data={item} dict={dict} />;
    }

    if (isParent(item)) {
      return (
        <ParentItemCard
          key={index}
          parent={item}
          onClick={(parent) =>
            router.push(
              `/library/parent/${parent.parentContract}/${parent.designId}`
            )
          }
          dict={dict}
        />
      );
    }

    return null;
  };

  if (error) {
    return (
      <div>
        {dict?.error}: {error}
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
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
    <div className="h-full flex flex-col">
      <div className="p-4">
        <MarketSearchBar
          searchText={filters.searchText}
          onSearch={(text) => handleFiltersChange({ searchText: text })}
          dict={dict}
        />
        <MarketFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          dict={dict}
        />
      </div>
      <InfiniteScroll
        dataLength={items.length}
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
        height="calc(100vh - 350px)"
        style={{
          height: "calc(100vh - 350px)",
          overflow: "auto",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-4">
          {items.map((item, i: number) => renderCard(item, i))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
