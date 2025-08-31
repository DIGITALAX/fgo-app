import { useState, useEffect, useCallback } from "react";
import { getContractsByDesigner } from "@/lib/subgraph/queries/getContracts";
import { ParentContract } from "../../types";

export const useParentContractsByDesigner = (walletAddress: string) => {
  const [parentContracts, setParentContracts] = useState<ParentContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParentContracts = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getContractsByDesigner(walletAddress);
  
      if (result?.data?.fgousers?.[0]?.designerRoles) {
        const allContracts: ParentContract[] = [];
        result.data.fgousers[0].designerRoles.forEach((role: any) => {
          if (role.parentContracts) {
            allContracts.push(...role.parentContracts);
          }
        });
        setParentContracts(allContracts);
      } else {
        setParentContracts([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch parent contracts";
      setError(errorMessage);
      setParentContracts([]);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

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