import { useState, useCallback } from "react";
import { useWalletConnection } from "@/components/Library/hooks/useWalletConnection";
import { LANGUAGES, Language } from "../types";

export const useSettingsTab = () => {
  const { isConnected, address } = useWalletConnection();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  const languageOptions = Object.entries(LANGUAGES).map(([code, name]) => ({
    code: code as Language,
    name,
  }));

  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as Language;
    setSelectedLanguage(newLanguage);
  }, []);

  return {
    isConnected,
    address,
    selectedLanguage,
    languageOptions,
    handleLanguageChange,
  };
};