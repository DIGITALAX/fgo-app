import { useState, useEffect, useCallback } from "react";
import { getContractsbyFulfiller } from "@/lib/subgraph/queries/getContracts";

export const useFulfillerContracts = (walletAddress: string) => {
  const [marketContracts, setMarketContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getContractsbyFulfiller(walletAddress);
      if (result?.data?.fgousers && result.data.fgousers.length > 0) {
        const marketContracts = result.data.fgousers.flatMap((user: any) => 
          user.fulfillerRoles.flatMap((role: any) => role.marketContracts)
        );
        setMarketContracts(marketContracts);
      } else {
        setMarketContracts([]);
      }
    } catch (err) {
      setError("Failed to load fulfiller contracts");
      setMarketContracts([]);
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
    marketContracts,
    loading,
    error,
    refetch,
  };
};