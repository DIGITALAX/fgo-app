import { useState, useCallback } from "react";
import { TemplateContract } from "../../../types";

export const useTemplatesNavigation = () => {
  const [selectedTemplateContract, setSelectedTemplateContract] = useState<TemplateContract | null>(null);

  const selectTemplateContract = useCallback((templateContract: TemplateContract) => {
    setSelectedTemplateContract(templateContract);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTemplateContract(null);
  }, []);

  return {
    selectedTemplateContract,
    selectTemplateContract,
    clearSelection,
  };
};