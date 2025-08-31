import InfiniteScroll from "react-infinite-scroll-component";
import { useLibrary } from "../hooks/useLibrary";
import { LibraryCard } from "./LibraryCard";
import { SearchBar } from "./SearchBar";

export const Library = () => {
  const {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    searchText,
    handleSearch,
  } = useLibrary();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading && items.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <SearchBar searchText={searchText} onSearch={handleSearch} />
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<div className="text-center py-4 text-gray-400">Loading more items...</div>}
        height="calc(100vh - 200px)"
        style={{
          height: "calc(100vh - 200px)",
          overflow: "auto"
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {items.map((item, i: number) => (
            <LibraryCard key={i} data={item} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};
