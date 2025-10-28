import { useCallback, useEffect, useMemo, useState } from "react";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { getSupplierChildren } from "@/lib/subgraph/queries/getMarkets";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { SupplierChild, UseSupplierChildrenResult } from "../types";

const ITEMS_PER_PAGE = 20;

const mapAvailabilityValue = (value: any): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }
    const lower = value.toLowerCase();
    if (lower.includes("digital") && lower.includes("physical")) {
      return 0;
    }
    if (lower.includes("digital")) {
      return 1;
    }
    if (lower.includes("physical")) {
      return 2;
    }
  }

  return 0;
};

export const useSupplierChildren = (
  supplier: string | undefined,
  dict: any
): UseSupplierChildrenResult => {
  const [children, setChildren] = useState<SupplierChild[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const normalizedSupplier = useMemo(
    () => supplier?.toLowerCase() ?? "",
    [supplier]
  );

  const fetchChildren = useCallback(
    async (skipCount: number, reset = false) => {
      if (!normalizedSupplier) {
        setChildren([]);
        setHasMore(false);
        return;
      }

      try {
        if (reset) {
          setIsLoading(true);
          setError(null);
        }

        const result = await getSupplierChildren(
          ITEMS_PER_PAGE,
          skipCount,
          normalizedSupplier
        );

        if (!result?.data) {
          setHasMore(false);
          return;
        }

        const rawChildren = result.data.childs || [];

        if (rawChildren.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        const processed: SupplierChild[] = await Promise.all(
          rawChildren.map(async (item: any) => {
            const metadataSource = await ensureMetadata({
              uri: item.uri,
              metadata: item.metadata,
            });

            const availabilityValue = mapAvailabilityValue(item.availability);

            return {
              childId: item.childId,
              childContract: item.childContract,
              availability: getAvailabilityLabel(availabilityValue, dict),
              availabilityValue,
              metadata: metadataSource.metadata || item.metadata || {},
              supplyCount: item.supplyCount,
              digitalPrice: item.digitalPrice,
              physicalPrice: item.physicalPrice,
              infraCurrency: item.infraCurrency,
              supplier: item.supplier,
            };
          })
        );

        if (reset) {
          setChildren(processed);
        } else {
          setChildren((prev) => [...prev, ...processed]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : dict?.unknownError);
      } finally {
        setIsLoading(false);
      }
    },
    [dict, normalizedSupplier]
  );

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    if (normalizedSupplier) {
      fetchChildren(0, true);
    }
  }, [fetchChildren, normalizedSupplier]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    const nextSkip = skip + ITEMS_PER_PAGE;
    setSkip(nextSkip);
    fetchChildren(nextSkip, false);
  }, [fetchChildren, hasMore, isLoading, skip]);

  const refresh = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchChildren(0, true);
  }, [fetchChildren]);

  return {
    children,
    isLoading,
    error,
    hasMore,
    loadMore,
    searchText,
    setSearchText,
    refresh,
  };
};

