import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTemplatesApproval } from "../../../hooks/infrastructure/approval/useTemplatesApproval";
import { ApprovalItemCard } from "./ApprovalItemCard";
import { MarketsApprovalTabProps } from "@/components/Account/types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { AuthorizedTemplates, Template } from "@/components/Item/types";

export const TemplatesApprovalTab = ({
  itemData,
  itemType,
  dict,
}: MarketsApprovalTabProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
        <p className="text-fresa font-pixel text-sm">
          {dict?.errorLoadingTemplates}: {error}
        </p>
      </div>
    );
  }

  if (loading && templates.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
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
          {dict?.availableTemplates}
        </h3>
        <div className="text-gris font-chicago text-sm">
          {templates.length}{" "}
          {templates.length !== 1 ? dict?.templates : dict?.template}
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
          dataLength={templates.length}
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
            {templates.map((template, i) => {
              const isApproved =
                itemData.authorizedTemplates?.some(
                  (at: AuthorizedTemplates | Template) =>
                    at.templateContract?.toLowerCase() ===
                      template.templateContract?.toLowerCase() &&
                    at.templateId == template.templateId
                ) || false;

              const hasBothAvailability = template.availability === "2";

              return (
                <ApprovalItemCard
                  key={i}
                  item={template}
                  isApproved={isApproved}
                  isActive={template.status !== "2"}
                  onApprove={() => approveTemplate(template, false)}
                  onRevoke={() => revokeTemplate(template)}
                  itemType="template"
                  loading={
                    approving === template.templateContract ||
                    revoking === template.templateContract
                  }
                  dict={dict}
                  onApprovePhysical={
                    hasBothAvailability
                      ? () => approveTemplate(template, true)
                      : undefined
                  }
                  onApproveDigital={
                    hasBothAvailability
                      ? () => approveTemplate(template, false)
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
