import { useState, useCallback } from "react";
import { DeployChildFormData } from "../../../types";

export const useDeployChildForm = () => {
  const [formData, setFormData] = useState<DeployChildFormData>({
    name: "",
    symbol: "",
    scm: "",
    childType: 0,
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "childType" ? parseInt(value) : value 
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
                    formData.scm.trim();

  return {
    formData,
    handleInputChange,
    resetForm,
    isFormValid,
  };
};