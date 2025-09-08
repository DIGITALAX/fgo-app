"use client";

import { useState, useCallback } from "react";
import { useWalletConnection } from "@/components/Library/hooks/useWalletConnection";
import { AccountTab } from "../types";

export const useAccount = () => {
  const { isConnected } = useWalletConnection();
  const [activeTab, setActiveTab] = useState<AccountTab>("settings");

  const handleTabChange = useCallback((tab: AccountTab) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    isConnected,
  };
};