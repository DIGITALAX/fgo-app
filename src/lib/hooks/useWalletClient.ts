"use client";

import { useMemo } from "react";
import { useWalletClient as useWagmiWalletClient } from "wagmi";
import { BLOCKED_WALLET_ACTIONS, CONTRACTS_PAUSED } from "@/constants";
import { blockIfPaused } from "@/lib/helpers/contractsPaused";

export const useWalletClient = () => {
  const { data: walletClient } = useWagmiWalletClient();

  const data = useMemo(() => {
    if (!walletClient || !CONTRACTS_PAUSED) return walletClient;
    return new Proxy(walletClient, {
      get(target, prop) {
        if (
          typeof prop === "string" &&
          BLOCKED_WALLET_ACTIONS.includes(prop)
        ) {
          return async () => {
            blockIfPaused();
          };
        }
        return target[prop as keyof typeof target];
      },
    });
  }, [walletClient]);

  return { data };
};
