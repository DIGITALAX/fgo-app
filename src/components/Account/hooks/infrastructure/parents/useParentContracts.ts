import { useState, useEffect, useCallback } from "react";
import { getParentContracts } from "@/lib/subgraph/queries/getContracts";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { ParentContract } from "../../../types";

export const useParentContracts = (infraId: string, dict: any) => {
  const [parentContracts, setParentContracts] = useState<ParentContract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParentContracts = useCallback(async () => {
    if (!infraId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getParentContracts(convertInfraIdToBytes32(infraId));
      
      if (result?.data?.parentContracts) {
        const processedContracts = await Promise.all(
          result.data.parentContracts.map(async (contract: any) => {
            const processedContract = await ensureMetadata(contract);
            return {
              ...processedContract,
              infraId: contract.infraId,
            };
          })
        );

        setParentContracts(processedContracts);
      } else {
        setParentContracts([]);
      }
    } catch (err) {
      setError(dict?.failedToLoadParentContracts);
      setParentContracts([]);
    } finally {
      setLoading(false);
    }
  }, [infraId]);

  useEffect(() => {
    fetchParentContracts();
  }, [fetchParentContracts]);

  const refetch = useCallback(() => {
    fetchParentContracts();
  }, [fetchParentContracts]);

  return {
    parentContracts,
    loading,
    error,
    refetch,
  };
};
