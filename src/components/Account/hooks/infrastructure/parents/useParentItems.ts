import { useState, useEffect, useCallback } from "react";
import { getParents } from "@/lib/subgraph/queries/getItems";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Parent } from "../../../types";

const ITEMS_PER_PAGE = 20;

export const useParentItems = (parentContract: string, dict: any) => {
  const [parentItems, setParentItems] = useState<Parent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);

  const fetchParentItems = useCallback(async (reset = false) => {
    if (!parentContract) return;
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const currentSkip = reset ? 0 : skip;
      const result = await getParents(parentContract, ITEMS_PER_PAGE, currentSkip);

      if (result?.data?.parents) {
        const processedItems = await Promise.all(
          result.data.parents.map(async (parent: any) => {
            const processedParent = await ensureMetadata(parent);
            return processedParent;
          })
        );

        if (reset) {
          setParentItems(processedItems);
          setSkip(ITEMS_PER_PAGE);
        } else {
          setParentItems((prev) => [...prev, ...processedItems]);
          setSkip((prev) => prev + ITEMS_PER_PAGE);
        }

        if (processedItems.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        if (reset) {
          setParentItems([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      setError(dict?.failedToLoadParentItems);
      if (reset) {
        setParentItems([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [parentContract, skip, loading, dict]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchParentItems(false);
    }
  }, [fetchParentItems, loading, hasMore]);

  const refetch = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchParentItems(true);
  }, [fetchParentItems]);

  useEffect(() => {
    fetchParentItems(true);
  }, [parentContract]);

  return {
    parentItems,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};