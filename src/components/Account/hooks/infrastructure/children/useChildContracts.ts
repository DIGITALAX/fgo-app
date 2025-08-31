import { useState, useEffect, useCallback } from "react";
import { getChildContracts } from "@/lib/subgraph/queries/getContracts";
import { ChildContract } from "../../../types";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { ensureMetadata } from "@/lib/helpers/metadata";

export const useChildContracts = (infraId: string) => {
  const [childContracts, setChildContracts] = useState<ChildContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildContracts = useCallback(async () => {
    if (!infraId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getChildContracts(convertInfraIdToBytes32(infraId));
      if (result?.data?.childContracts) {
        const processedContracts = await Promise.all(
          result.data.childContracts.map(async (contract: any) => {
            const processedContract = await ensureMetadata(contract);
            return {
              ...processedContract,
              infraId: contract.infraId,
            };
          })
        );

        setChildContracts(processedContracts);
      } else {
        setChildContracts([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch child contracts";
      setError(errorMessage);
      setChildContracts([]);
    } finally {
      setLoading(false);
    }
  }, [infraId]);

  useEffect(() => {
    fetchChildContracts();
  }, [fetchChildContracts]);

  const refetch = useCallback(() => {
    fetchChildContracts();
  }, [fetchChildContracts]);

  return {
    childContracts,
    loading,
    error,
    refetch,
  };
};
