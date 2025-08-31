import { useState, useCallback } from "react";
import { MarketContract } from "../../../types";

export const useMarketsNavigation = () => {
  const [selectedMarketContract, setSelectedMarketContract] = useState<MarketContract | null>(null);

  const selectMarketContract = useCallback((marketContract: MarketContract) => {
    setSelectedMarketContract(marketContract);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMarketContract(null);
  }, []);

  return {
    selectedMarketContract,
    selectMarketContract,
    clearSelection,
  };
};