import { useState, useRef, useCallback } from "react";
import { DeployParentFormData } from "../../../types";

export const useDeployParentForm = () => {
  const [formData, setFormData] = useState<DeployParentFormData>({
    name: "",
    symbol: "",
    scm: "",
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
      scm: "",
      title: "",
      description: "",
      image: null,
    });
  }, []);

  const isFormValid = formData.name.trim() && 
                    formData.symbol.trim() && 
                    formData.scm.trim() && 
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