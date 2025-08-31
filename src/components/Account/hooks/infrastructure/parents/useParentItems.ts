import { useState, useEffect, useCallback } from "react";
import { getParents } from "@/lib/subgraph/queries/getItems";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Parent } from "../../../types";

export const useParentItems = (parentContract: string) => {
  const [parentItems, setParentItems] = useState<Parent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParentItems = useCallback(async () => {
    if (!parentContract) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getParents(parentContract);
      
      if (result?.data?.parents) {
        const processedItems = await Promise.all(
          result.data.parents.map(async (parent: any) => {
            const processedParent = await ensureMetadata(parent);
            return processedParent;
          })
        );
        
        setParentItems(processedItems);
      } else {
        setParentItems([]);
      }
    } catch (err) {
      setError("Failed to load parent items");
      setParentItems([]);
    } finally {
      setLoading(false);
    }
  }, [parentContract]);

  useEffect(() => {
    fetchParentItems();
  }, [fetchParentItems]);

  const refetch = useCallback(() => {
    fetchParentItems();
  }, [fetchParentItems]);

  return {
    parentItems,
    loading,
    error,
    refetch,
  };
};