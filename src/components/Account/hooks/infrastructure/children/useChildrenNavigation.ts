import { useState, useCallback } from "react";
import { ChildContract } from "../../../types";

export const useChildrenNavigation = () => {
  const [selectedChildContract, setSelectedChildContract] = useState<ChildContract | null>(null);

  const selectChildContract = useCallback((childContract: ChildContract) => {
    setSelectedChildContract(childContract);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedChildContract(null);
  }, []);

  return {
    selectedChildContract,
    selectChildContract,
    clearSelection,
  };
};