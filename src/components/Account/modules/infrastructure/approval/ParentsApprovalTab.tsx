import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParentsApproval } from "../../../hooks/infrastructure/approval/useParentsApproval";
import { ApprovalItemCard } from "./ApprovalItemCard";
import { MarketsApprovalTabProps } from "@/components/Account/types";
import { Child, Template } from "@/components/Item/types";

export const ParentsApprovalTab = ({
  itemData,
  itemType,
}: MarketsApprovalTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    parents,
    loading,
    error,
    hasMore,
    loadMore,
    approveParent,
    revokeParent,
    approving,
    revoking,
  } = useParentsApproval(itemData, itemType, searchQuery);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-fresa font-herm text-sm">
          Error loading parents: {error}
        </p>
      </div>
    );
  }

  if (loading && parents.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white text-sm font-herm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
          <span>Loading parents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-herm text-lg">Available Parents</h3>
        <div className="text-white/60 font-herm text-sm">
          {parents.length} parent{parents.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white font-herm text-sm placeholder:text-white/40 focus:outline-none focus:border-ama"
        />
      </div>

      <div className="flex-1">
        <InfiniteScroll
          dataLength={parents.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4 text-white/60 font-herm text-sm">
              Loading more parents...
            </div>
          }
          height="100%"
          style={{ height: "100%" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {parents.map((parent: any) => {
              const isApproved =
                (itemData as Child | Template).authorizedParents?.some(
                  (ap: any) =>
                    ap.parentContract?.toLowerCase() ===
                    parent.parentContract?.toLowerCase()
                ) || false;

              return (
                <ApprovalItemCard
                  key={parent.parentContract}
                  item={parent}
                  isApproved={isApproved}
                  isActive={parent.status !== "2"}
                  onApprove={() => approveParent(parent)}
                  onRevoke={() => revokeParent(parent)}
                  itemType="parent"
                  loading={
                    approving === parent.parentContract ||
                    revoking === parent.parentContract
                  }
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};
