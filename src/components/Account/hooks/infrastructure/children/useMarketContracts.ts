import { useState, useEffect, useCallback } from "react";
import { getMarketContracts } from "@/lib/subgraph/queries/getContracts";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { MarketContract } from "../../../types";

export const useMarketContracts = (infraId: string, dict: any) => {
  const [marketContracts, setMarketContracts] = useState<MarketContract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketContracts = useCallback(async () => {
    if (!infraId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getMarketContracts(convertInfraIdToBytes32(infraId));
      
      if (result?.data?.marketContracts) {
        const processedContracts = await Promise.all(
          result.data.marketContracts.map(async (contract: MarketContract) => {
            const processedContract = await ensureMetadata(contract);
            return {
              ...processedContract,
              infraId: contract.infraId,
            };
          })
        );
        
        setMarketContracts(processedContracts);
      } else {
        setMarketContracts([]);
      }
    } catch (err) {
      setError(dict?.failedToLoadMarketContracts);
      setMarketContracts([]);
    } finally {
      setLoading(false);
    }
  }, [infraId]);

  useEffect(() => {
    fetchMarketContracts();
  }, [fetchMarketContracts]);

  const refetch = useCallback(() => {
    fetchMarketContracts();
  }, [fetchMarketContracts]);

  return {
    marketContracts,
    loading,
    error,
    refetch,
  };
};