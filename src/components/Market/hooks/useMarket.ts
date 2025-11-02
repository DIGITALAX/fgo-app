import { useState, useCallback, useEffect } from "react";
import {
  MarketItem,
  MarketFilterState,
  FuturePosition,
  SupplyRequest,
} from "../types";
import {
  getAllFutures,
  getAllSupplyRequests,
  getAllMarketsActive,
} from "@/lib/subgraph/queries/getMarkets";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { fetchCustomSpec, getIPFSUrl } from "@/lib/helpers/ipfs";
import { Child, Template } from "@/components/Item/types";
import { Parent } from "@/components/Account/types";

export const useMarket = (dict: any) => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [filters, setFilters] = useState<MarketFilterState>({
    searchText: "",
    itemType: "all",
    availability: "all",
    orderBy: "createdDate",
    orderDirection: "desc",
  });

  const ITEMS_PER_PAGE = 20;

  const fetchItems = useCallback(
    async (skipCount: number, reset = false) => {
      try {
        if (reset) {
          setIsLoading(true);
          setError(null);
        }

        const [futuresResult, supplyRequestsResult, marketsActiveResult] =
          await Promise.all([
            getAllFutures(ITEMS_PER_PAGE, skipCount),
            getAllSupplyRequests(ITEMS_PER_PAGE, skipCount),
            getAllMarketsActive(ITEMS_PER_PAGE, skipCount),
          ]);

        const allItems: MarketItem[] = [];

        if (futuresResult?.data?.futurePositions) {
          const futurePositions: FuturePosition[] = await Promise.all(
            futuresResult.data.futurePositions.map(async (data: any) => {
              return {
                ...data,
                child: await ensureMetadata(data?.child),
              };
            })
          );
          allItems.push(...futurePositions);
        }

        if (supplyRequestsResult?.data?.childSupplyRequests) {
          const supplyRequests: SupplyRequest[] = await Promise.all(
            supplyRequestsResult.data.childSupplyRequests.map(
              async (request: any) => {
                const customSpecText = await fetchCustomSpec(
                  request.customSpec
                );
                return {
                  ...request,
                  customSpec: customSpecText,
                };
              }
            )
          );
          allItems.push(...supplyRequests);
        }

        if (marketsActiveResult?.data) {
          const children: Child[] = await Promise.all(
            (marketsActiveResult.data.childs || []).map(async (item: any) => {
              const processedItem = await ensureMetadata(item);
              return {
                childId: item.childId,
                childContract: item.childContract,
                supplier: item.supplier,
                infraId: item.infraId,
                supplierProfile: item.supplierProfile,
                childType: item.childType,
                scm: item.scm,
                title: processedItem.metadata?.title || item.title || "",
                symbol: item.symbol,
                futures: item.futures,
                totalPrepaidAmount: item.totalPrepaidAmount,
                totalReservedSupply: item.totalReservedSupply,
                totalPrepaidUsed: item.totalPrepaidUsed,
                digitalPrice: item.digitalPrice,
                physicalPrice: item.physicalPrice,
                version: item.version,
                currentDigitalEditions: item.currentDigitalEditions,
                maxPhysicalEditions: item.maxPhysicalEditions,
                currentPhysicalEditions: item.currentPhysicalEditions,
                uriVersion: item.uriVersion,
                usageCount: item.usageCount,
                supplyCount: item.supplyCount,
                infraCurrency: item.infraCurrency,
                uri: item.uri,
                metadata: processedItem.metadata,
                status: item.status,
                availability: item.availability,
                isImmutable: item.isImmutable,
                digitalMarketsOpenToAll: item.digitalMarketsOpenToAll,
                physicalMarketsOpenToAll: item.physicalMarketsOpenToAll,
                digitalReferencesOpenToAll: item.digitalReferencesOpenToAll,
                physicalReferencesOpenToAll: item.physicalReferencesOpenToAll,
                standaloneAllowed: item.standaloneAllowed,
                authorizedMarkets: item.authorizedMarkets || [],
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                blockNumber: item.blockNumber,
                blockTimestamp: item.blockTimestamp,
                transactionHash: item.transactionHash,
                authorizedParents: item.authorizedParents || [],
                authorizedTemplates: item.authorizedTemplates || [],
                parentRequests: item.parentRequests || [],
                templateRequests: item.templateRequests || [],
                marketRequests: item.marketRequests || [],
                authorizedChildren: item.authorizedChildren || [],
                physicalRights: item.physicalRights || [],
              } as Child;
            })
          );

          const templates: Template[] = await Promise.all(
            (marketsActiveResult.data.templates || []).map(
              async (item: any) => {
                const processedItem = await ensureMetadata(item);
                return {
                  templateId: item.templateId,
                  templateContract: item.templateContract,
                  supplier: item.supplier,
                  supplierProfile: item.supplierProfile,
                  childType: item.childType,
                  infraId: item.infraId,
                  scm: item.scm,
                  title: processedItem.metadata?.title || item.title || "",
                  symbol: item.symbol,
                  digitalPrice: item.digitalPrice,
                  physicalPrice: item.physicalPrice,
                  version: item.version,
                  maxPhysicalEditions: item.maxPhysicalEditions,
                  maxDigitalEditions: item.maxDigitalEditions,
                  currentDigitalEditions: item.currentDigitalEditions,
                  currentPhysicalEditions: item.currentPhysicalEditions,
                  uriVersion: item.uriVersion,
                  usageCount: item.usageCount,
                  supplyCount: item.supplyCount,
                  infraCurrency: item.infraCurrency,
                  uri: item.uri,
                  metadata: processedItem.metadata,
                  status: item.status,
                  availability: item.availability,
                  isImmutable: item.isImmutable,
                  digitalMarketsOpenToAll: item.digitalMarketsOpenToAll,
                  physicalMarketsOpenToAll: item.physicalMarketsOpenToAll,
                  digitalReferencesOpenToAll: item.digitalReferencesOpenToAll,
                  physicalReferencesOpenToAll: item.physicalReferencesOpenToAll,
                  standaloneAllowed: item.standaloneAllowed,
                  authorizedMarkets: item.authorizedMarkets || [],
                  childReferences: item.childReferences || [],
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  blockNumber: item.blockNumber,
                  blockTimestamp: item.blockTimestamp,
                  transactionHash: item.transactionHash,
                  authorizedParents: item.authorizedParents || [],
                  authorizedTemplates: item.authorizedTemplates || [],
                  parentRequests: item.parentRequests || [],
                  templateRequests: item.templateRequests || [],
                  marketRequests: item.marketRequests || [],
                  authorizedChildren: item.authorizedChildren || [],
                  physicalRights: item.physicalRights || [],
                } as Template;
              }
            )
          );

          const parents: Parent[] = await Promise.all(
            (marketsActiveResult.data.parents || []).map(async (item: any) => {
              const processedItem = await ensureMetadata(item);
              return {
                designId: item.designId,
                parentContract: item.parentContract,
                designerProfile: item.designerProfile,
                infraCurrency: item.infraCurrency,
                digitalPrice: item.digitalPrice,
                physicalPrice: item.physicalPrice,
                status: item.status,
                metadata: processedItem.metadata,
                uri: item.uri,
              } as Parent;
            })
          );

          allItems.push(...children, ...templates, ...parents);
        }

        if (allItems.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        if (reset) {
          setItems(allItems);
        } else {
          setItems((prev) => [...prev, ...allItems]);
        }
      } catch (err: any) {
        setError(
          err?.message || dict?.errorLoadingMarkets || "Failed to load markets"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [dict]
  );

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    fetchItems(0, true);
  }, [filters]);

  const loadMore = useCallback(() => {
    const newSkip = skip + ITEMS_PER_PAGE;
    setSkip(newSkip);
    fetchItems(newSkip, false);
  }, [skip, fetchItems]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<MarketFilterState>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setItems([]);
      setHasMore(true);
    },
    []
  );

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    filters,
    handleFiltersChange,
  };
};
