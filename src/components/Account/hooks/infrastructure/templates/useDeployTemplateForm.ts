import { useState, useCallback } from "react";
import { DeployTemplateFormData } from "../../../types";

export const useDeployTemplateForm = () => {
  const [formData, setFormData] = useState<DeployTemplateFormData>({
    name: "",
    symbol: "",
    scm: "",
    childType: 0,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "childType" ? parseInt(value) || 0 : value 
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      symbol: "",
      scm: "",
      childType: 0,
    });
  }, []);

  const isFormValid = formData.name.trim() && 
                    formData.symbol.trim() && 
                    formData.scm.trim() &&
                    formData.childType >= 0;

  return {
    formData,
    handleInputChange,
    resetForm,
    isFormValid,
  };
};