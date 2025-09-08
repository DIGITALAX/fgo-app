import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTemplatesApproval } from "../../../hooks/infrastructure/approval/useTemplatesApproval";
import { ApprovalItemCard } from "./ApprovalItemCard";
import { MarketsApprovalTabProps } from "@/components/Account/types";

export const TemplatesApprovalTab = ({
  itemData,
  itemType,
    dict
}: MarketsApprovalTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    templates,
    loading,
    error,
    hasMore,
    loadMore,
    approveTemplate,
    revokeTemplate,
    approving,
    revoking,
  } = useTemplatesApproval(itemData, itemType, searchQuery, dict);

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-fresa font-herm text-sm">
          {dict?.errorLoadingTemplates}: {error}
        </p>
      </div>
    );
  }

  if (loading && templates.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white text-sm font-herm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
          <span>{dict?.loadingTemplates}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-herm text-lg">{dict?.availableTemplates}</h3>
        <div className="text-white/60 font-herm text-sm">
          {templates.length} {templates.length !== 1 ? dict?.templates : dict?.template}
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder={dict?.searchByTitleDescription}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white font-herm text-sm placeholder:text-white/40 focus:outline-none focus:border-ama"
        />
      </div>

      <div className="flex-1">
        <InfiniteScroll
          dataLength={templates.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4 text-white/60 font-herm text-sm">
              {dict?.loadingMoreTemplates}
            </div>
          }
          height="100%"
          style={{ height: "100%" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {templates.map((template: any) => {
              const isApproved =
                itemData.authorizedTemplates?.some(
                  (at: any) =>
                    at.templateContract?.toLowerCase() ===
                    template.templateContract?.toLowerCase()
                ) || false;

              return (
                <ApprovalItemCard
                  key={template.templateContract}
                  item={template}
                  isApproved={isApproved}
                  isActive={template.status !== "2"}
                  onApprove={() => approveTemplate(template)}
                  onRevoke={() => revokeTemplate(template)}
                  itemType="template"
                  loading={
                    approving === template.templateContract ||
                    revoking === template.templateContract
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
