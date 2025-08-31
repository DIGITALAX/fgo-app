import { useState, useCallback } from "react";
import { ParentContract } from "../../../types";

export const useParentsNavigation = () => {
  const [selectedParentContract, setSelectedParentContract] = useState<ParentContract | null>(null);

  const selectParentContract = useCallback((parentContract: ParentContract) => {
    setSelectedParentContract(parentContract);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedParentContract(null);
  }, []);

  return {
    selectedParentContract,
    selectParentContract,
    clearSelection,
  };
};