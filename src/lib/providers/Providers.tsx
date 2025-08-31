"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createContext, useState } from "react";
import { getCurrentNetwork } from "@/constants";
import {
  AppContextType,
  ErrorData,
  SuccessData,
} from "@/components/Modals/types";
import { chains } from "@lens-chain/sdk/viem";

const currentNetwork = getCurrentNetwork();

export const AppContext = createContext<AppContextType | undefined>(undefined);

const config = createConfig(
  getDefaultConfig({
    appName: "FGO - Fractional Garment Ownership",
    appDescription: "Composable Fashion Engineering.",
    appUrl: "https://fgo.themanufactory.xyz",
    appIcon: "https://fgo.themanufactory.xyz/favicon.ico",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    chains: [chains.testnet],
    connectors: [],
    transports: {
      [currentNetwork.chainId]: http(),
    },
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  const showSuccess = (message: string, txHash?: string) => {
    setSuccessData({ message, txHash });
  };

  const showError = (message: string) => {
    setErrorData({ message });
  };

  const hideSuccess = () => {
    setSuccessData(null);
  };

  const hideError = () => {
    setErrorData(null);
  };

  const contextValue: AppContextType = {
    showSuccess,
    showError,
    hideSuccess,
    hideError,
    successData,
    errorData,
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="midnight">
          <AppContext.Provider value={contextValue}>
            {children}
          </AppContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
