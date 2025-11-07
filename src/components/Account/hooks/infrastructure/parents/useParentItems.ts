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

  const fetchParentItems = useCallback(async (skipValue: number, reset = false) => {
    if (!parentContract) return;

    setLoading(true);
    setError(null);

    try {
      const currentSkip = reset ? 0 : skipValue;
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
  }, [parentContract, dict]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setSkip((prevSkip) => {
        fetchParentItems(prevSkip, false);
        return prevSkip + ITEMS_PER_PAGE;
      });
    }
  }, [fetchParentItems, loading, hasMore]);

  const refetch = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchParentItems(0, true);
  }, [fetchParentItems]);

  useEffect(() => {
    fetchParentItems(0, true);
  }, [parentContract, fetchParentItems]);

  return {
    parentItems,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};