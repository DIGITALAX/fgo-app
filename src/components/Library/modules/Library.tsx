"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { useLibrary } from "../hooks/useLibrary";
import { LibraryCard } from "./LibraryCard";
import { SearchBar } from "./SearchBar";
import { AdvancedFilters } from "./AdvancedFilters";

export const Library = ({ dict }: { dict: any }) => {
  const {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    filters,
    handleFiltersChange,
    handleSearch,
  } = useLibrary(dict);

  if (error) {
    return <div>{dict?.error}: {error}</div>;
  }

  if (isLoading && items.length === 0) {
    return <div>{dict?.loading}</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <SearchBar searchText={filters.searchText} onSearch={handleSearch} dict={dict} />
        <AdvancedFilters filters={filters} onFiltersChange={handleFiltersChange} dict={dict} />
      </div>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="text-center py-4 text-gray-400">
            {dict?.loadingMore}
          </div>
        }
        height="calc(100vh - 300px)"
        style={{
          height: "calc(100vh - 300px)",
          overflow: "auto",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-4">
          {items.map((item, i: number) => (
            <LibraryCard key={i} data={item} dict={dict} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
