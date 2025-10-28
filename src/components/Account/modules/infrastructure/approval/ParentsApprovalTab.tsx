import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParentsApproval } from "../../../hooks/infrastructure/approval/useParentsApproval";
import { ApprovalItemCard } from "./ApprovalItemCard";
import { MarketsApprovalTabProps } from "@/components/Account/types";
import { AuthorizedParents, Child, Template } from "@/components/Item/types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ParentsApprovalTab = ({
  itemData,
  itemType,
  dict,
}: MarketsApprovalTabProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
  } = useParentsApproval(itemData, itemType, searchQuery, dict);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-fresa font-chicago text-sm">
          {dict?.errorLoadingParents}: {error}
        </p>
      </div>
    );
  }

  if (loading && parents.length === 0) {
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
          {dict?.availableParents}
        </h3>
        <div className="text-gris font-chicago text-sm">
          {parents.length} {parents.length !== 1 ? dict?.parents : dict?.parent}
        </div>
      </div>

      <FancyBorder color="white" type="circle" className="relative mb-4 h-10">
        <input
          type="text"
          placeholder={dict?.searchByTitleDescription}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="relative z-10 w-full h-full px-4 py-2 text-white font-chicago text-sm placeholder:text-gris/40 focus:outline-none"
        />
      </FancyBorder>

      <div className="flex-1">
        <InfiniteScroll
          dataLength={parents.length}
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
            {parents.map((parent, i) => {
              const isApproved =
                (itemData as Child | Template).authorizedParents?.some(
                  (ap: AuthorizedParents) =>
                    ap.parentContract?.toLowerCase() ===
                    parent.parentContract?.toLowerCase()
                ) || false;

              const hasBothAvailability = parent.availability === "2";

              return (
                <ApprovalItemCard
                  key={i}
                  item={parent}
                  isApproved={isApproved}
                  isActive={parent.status !== "2"}
                  onApprove={() => approveParent(parent, false)}
                  onRevoke={() => revokeParent(parent)}
                  itemType="parent"
                  loading={
                    approving === parent.parentContract ||
                    revoking === parent.parentContract
                  }
                  dict={dict}
                  onApprovePhysical={
                    hasBothAvailability
                      ? () => approveParent(parent, true)
                      : undefined
                  }
                  onApproveDigital={
                    hasBothAvailability
                      ? () => approveParent(parent, false)
                      : undefined
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
