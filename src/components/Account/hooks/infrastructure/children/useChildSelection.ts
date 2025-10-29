import { useState, useEffect, useCallback } from "react";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { getAllChildren } from "@/lib/subgraph/queries/getGlobal";
import { Child, Template } from "@/components/Item/types";

export const useChildSelection = (dict: any) => {
  const [items, setItems] = useState<(Child | Template)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const ITEMS_PER_PAGE = 20;

  const fetchItems = useCallback(
    async (skipCount: number, reset = false, searchQuery?: string) => {
      try {
        if (reset) {
          setIsLoading(true);
          setError(null);
        }

        const result = await getAllChildren(
          ITEMS_PER_PAGE,
          skipCount,
          searchQuery
        );

        if (!result?.data) {
          setHasMore(false);
          return;
        }

        const allItems = [
          ...(result.data.childs || []),
          ...(result.data.templates || []),
        ];

        if (allItems.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        const processedItems: (Child | Template)[] = await Promise.all(
          allItems.map(async (item: any) => {
            const processedItem = await ensureMetadata(item);
            const isTemplate = item.__typename === "Template";

            return {
              [isTemplate ? "templateId" : "childId"]: isTemplate
                ? item.templateId
                : item.childId,
              [isTemplate ? "templateContract" : "childContract"]: isTemplate
                ? item.templateContract
                : item.childContract,
              supplier: item.supplier || "Unknown",
              supplierProfile: item.supplierProfile || {
                uri: "",
                version: "",
                metadata: { title: "", image: "", description: "", link: "" },
              },
              futures: item.futures,
              childType: item.childType || "Unknown",
              scm: item.scm || "Unknown",
              title:
                processedItem.metadata?.title ||
                item.title ||
                `${item.__typename} ${
                  isTemplate ? item.templateId : item.childId
                }`,
              symbol: item.symbol || "",
              digitalPrice: item.digitalPrice,
              physicalPrice: item.physicalPrice,
              version: item.version || "1",
              maxPhysicalEditions: item.maxPhysicalEditions || "0",
              currentPhysicalEditions: item.currentPhysicalEditions || "0",
              uriVersion: item.uriVersion || "1",
              usageCount: item.usageCount || "0",
              supplyCount: item.supplyCount,
              infraCurrency: item.infraCurrency,
              uri: item.uri,
              metadata: processedItem.metadata || {
                title: "",
                description: "",
                image: "",
                attachments: [],
                tags: [],
                prompt: "",
                aiModel: "",
                loras: [],
                workflow: "",
                version: "",
              },
              status: item.status,
              availability: getAvailabilityLabel(item.availability || 0, dict),
              isImmutable: item.isImmutable || false,
              digitalMarketsOpenToAll: item.digitalMarketsOpenToAll || false,
              physicalMarketsOpenToAll: item.physicalMarketsOpenToAll || false,
              digitalReferencesOpenToAll:
                item.digitalReferencesOpenToAll || false,
              physicalReferencesOpenToAll:
                item.physicalReferencesOpenToAll || false,
              standaloneAllowed: item.standaloneAllowed || "false",
              authorizedMarkets: item.authorizedMarkets || "",
              createdAt: item.createdAt,
              updatedAt: item.updatedAt || item.createdAt,
              blockNumber: item.blockNumber || "0",
              blockTimestamp: item.blockTimestamp || item.createdAt,
              transactionHash: item.transactionHash || "",
              authorizedParents: item.authorizedParents || [],
              authorizedTemplates: item.authorizedTemplates || [],
              parentRequests: item.parentRequests || [],
              templateRequests: item.templateRequests || [],
              marketRequests: item.marketRequests || [],
              authorizedChildren: item.authorizedChildren || [],
              physicalRights: item.physicalRights || [],
              ...(isTemplate && {
                childReferences: item.childReferences || [],
              }),
            } as Child | Template;
          })
        );

        if (reset) {
          setItems(processedItems);
        } else {
          setItems((prev) => [...prev, ...processedItems]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : dict?.unknownError);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextSkip = skip + ITEMS_PER_PAGE;
      setSkip(nextSkip);
      fetchItems(nextSkip, false, searchText);
    }
  }, [skip, isLoading, hasMore, searchText, fetchItems]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchText(query);
      setSkip(0);
      setHasMore(true);
      fetchItems(0, true, query);
    },
    [fetchItems]
  );

  useEffect(() => {
    fetchItems(0, true);
  }, [fetchItems]);

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    searchText,
    handleSearch,
  };
};
