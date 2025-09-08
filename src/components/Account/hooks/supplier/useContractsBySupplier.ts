import { useState, useEffect, useCallback } from "react";
import { getContractsBySupplier } from "@/lib/subgraph/queries/getContracts";
import { ChildContract, TemplateContract } from "../../types";

export const useContractsBySupplier = (walletAddress: string, dict: any) => {
  const [childContracts, setChildContracts] = useState<ChildContract[]>([]);
  const [templateContracts, setTemplateContracts] = useState<TemplateContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getContractsBySupplier(walletAddress);
      if (result?.data?.fgousers?.[0]?.supplierRoles) {
        const allChildContracts: ChildContract[] = [];
        const allTemplateContracts: TemplateContract[] = [];

        
        result.data.fgousers[0].supplierRoles.forEach((role: any) => {
          if (role.childContracts) {
            allChildContracts.push(...role.childContracts);
          }
          if (role.templateContracts) {
            allTemplateContracts.push(...role.templateContracts);
          }
        });
        
        setChildContracts(allChildContracts);
        setTemplateContracts(allTemplateContracts);
      } else {
        setChildContracts([]);
        setTemplateContracts([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : dict?.failedToFetchSupplierContracts;
      setError(errorMessage);
      setChildContracts([]);
      setTemplateContracts([]);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const refetch = useCallback(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    childContracts,
    templateContracts,
    loading,
    error,
    refetch,
  };
};