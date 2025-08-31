import { useState, useRef, useCallback } from "react";
import { DeployMarketFormData } from "../../../types";

export const useDeployMarketForm = () => {
  const [formData, setFormData] = useState<DeployMarketFormData>({
    name: "",
    symbol: "",
    title: "",
    description: "",
    image: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      symbol: "",
      title: "",
      description: "",
      image: null,
    });
  }, []);

  const isFormValid = formData.name.trim() && 
                    formData.symbol.trim() && 
                    formData.title.trim() && 
                    formData.description.trim();

  return {
    formData,
    fileInputRef,
    handleImageChange,
    handleInputChange,
    resetForm,
    isFormValid,
  };
};