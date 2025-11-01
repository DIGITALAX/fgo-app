import { useCallback, useEffect, useMemo, useState } from "react";
import { Fulfiller } from "../types";
import { getAllFulfillers } from "@/lib/subgraph/queries/getFGOUser";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

const PAGE_SIZE = 20;

export const useFulfillers = (infraId?: string) => {
  const [fulfillers, setFulfillers] = useState<Fulfiller[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const normalizedInfraId = useMemo(() => {
    if (!infraId) return "";
    try {
      return convertInfraIdToBytes32(infraId);
    } catch {
      return infraId;
    }
  }, [infraId]);

  const fetchFulfillers = useCallback(
    async (skipCount: number, reset = false) => {
      if (!normalizedInfraId) {
        setFulfillers([]);
        setHasMore(false);
        return;
      }

      try {
        if (reset) {
          setIsLoading(true);
          setError(null);
        }

        const result = await getAllFulfillers(
          PAGE_SIZE,
          skipCount,
          normalizedInfraId
        );

        if (!result?.data) {
          setHasMore(false);
          return;
        }

        const rawFulfillers = result.data.fulfillers || [];
        if (rawFulfillers.length < PAGE_SIZE) {
          setHasMore(false);
        }

        const processed: Fulfiller[] = await Promise.all(
          rawFulfillers.map(async (item: any) => {
            const metadataSource = await ensureMetadata({
              uri: item.uri,
              metadata: item.metadata,
            });

            return {
              id: item.id ?? `${item.fulfillerId || ""}-${item.fulfiller}`,
              fulfillerId: item.fulfillerId ?? item.id ?? item.fulfiller,
              fulfiller: item.fulfiller,
              infraId: item.infraId,
              blockNumber: item.blockNumber,
              isActive: item.isActive,
              blockTimestamp: item.blockTimestamp,
              transactionHash: item.transactionHash,
              uri: item.uri,
              version: item.version,
              basePrice: item.basePrice,
              vigBasisPoints: item.vigBasisPoints,
              metadata: metadataSource.metadata || item.metadata || {
                title: "",
                description: "",
                image: "",
                link: "",
              },
              accessControlContract: item.accessControlContract,
            } as Fulfiller;
          })
        );

        if (reset) {
          setFulfillers(processed);
        } else {
          setFulfillers((prev) => [...prev, ...processed]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load fulfillers"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [normalizedInfraId]
  );

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    if (normalizedInfraId) {
      fetchFulfillers(0, true);
    } else {
      setFulfillers([]);
    }
  }, [fetchFulfillers, normalizedInfraId]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    fetchFulfillers(nextSkip, false);
  }, [fetchFulfillers, hasMore, isLoading, skip]);

  const refresh = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchFulfillers(0, true);
  }, [fetchFulfillers]);

  const filteredFulfillers = useMemo(() => {
    if (!searchText) return fulfillers;
    const query = searchText.toLowerCase();
    return fulfillers.filter((item) => {
      const title = item.metadata?.title?.toLowerCase() ?? "";
      const address = item.fulfiller?.toLowerCase() ?? "";
      return title.includes(query) || address.includes(query);
    });
  }, [fulfillers, searchText]);

  return {
    fulfillers: filteredFulfillers,
    isLoading,
    hasMore,
    error,
    loadMore,
    refresh,
    searchText,
    setSearchText,
  };
};
