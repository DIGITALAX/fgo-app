import { useState, useRef, useCallback, ChangeEvent } from "react";
import { CreateInfrastructureFormData, PaymentToken } from "../../types";

export const useCreateInfrastructureForm = (paymentTokens: PaymentToken[]) => {
  const [formData, setFormData] = useState<CreateInfrastructureFormData>({
    title: "",
    description: "",
    image: null,
    paymentToken: paymentTokens[0]?.address || "",
  });
  const [showCustomToken, setShowCustomToken] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "paymentToken" && value === "custom") {
      setShowCustomToken(true);
      setFormData((prev) => ({ ...prev, [name]: "" }));
    } else if (name === "paymentToken" && value !== "custom") {
      setShowCustomToken(false);
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      image: null,
      paymentToken: paymentTokens[0]?.address || "",
    });
    setShowCustomToken(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [paymentTokens]);

  const isFormValid = formData.title.trim() && formData.description.trim();

  return {
    formData,
    showCustomToken,
    fileInputRef,
    handleInputChange,
    handleImageChange,
    resetForm,
    isFormValid,
  };
};