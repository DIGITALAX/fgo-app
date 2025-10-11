import { useState, useCallback } from "react";
import { useWalletConnection } from "@/components/Library/hooks/useWalletConnection";
import { Language } from "../types";
import { usePathname, useRouter } from "next/navigation";

export const useSettingsTab = (dict: any) => {
  const { isConnected, address } = useWalletConnection();
  const router = useRouter();
  const path = usePathname();
  
  const currentLang = (path.split("/")[1] || "en") as Language;
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLang);

  const languageOptions = [
    { code: "en" as Language, name: dict?.english || "English" },
    { code: "es" as Language, name: dict?.spanish || "Español" },
    { code: "pt" as Language, name: dict?.portuguese || "Português" },
  ];

  const handleLanguageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newLanguage = event.target.value as Language;
      setSelectedLanguage(newLanguage);

      const segments = path.split("/");
      const hasLangSegment = segments[1] && ["en", "es", "pt"].includes(segments[1]);

      let newPath;
      if (hasLangSegment) {
        segments[1] = newLanguage;
        newPath = segments.join("/");
      } else {
        newPath = `/${newLanguage}${path}`;
      }

      document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; SameSite=Lax`;

      router.push(newPath);
    },
    [path, router]
  );

  return {
    isConnected,
    address,
    selectedLanguage,
    languageOptions,
    handleLanguageChange,
  };
};
