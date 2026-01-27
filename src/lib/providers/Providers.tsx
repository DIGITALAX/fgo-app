"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { createContext, useState } from "react";
import { getCurrentNetwork } from "@/constants";
import {
  AppContextType,
  ErrorData,
  SuccessData,
} from "@/components/Modals/types";
import { chains } from "@lens-chain/sdk/viem";
import { FGOUser, Infrastructure } from "@/components/Account/types";

const currentNetwork = getCurrentNetwork();

export const AppContext = createContext<AppContextType | undefined>(undefined);

const config = createConfig({
  chains: [chains.mainnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [currentNetwork.chainId]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [colorSwitch, setColorSwitch] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [fgoUser, setFgoUser] = useState<FGOUser | null>(null);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<{
    infrastructure: Infrastructure;
    isOwner: boolean;
  } | null>(null);
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
    fgoUser,
    setFgoUser,
    colorSwitch,
    setColorSwitch,
    selectedInfrastructure,
    setSelectedInfrastructure,
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
