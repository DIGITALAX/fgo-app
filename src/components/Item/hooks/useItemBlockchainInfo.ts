import { useMemo } from "react";
import { Child, Template } from "../types";
import { Parent } from "@/components/Account/types";

const BLOCK_EXPLORER_BASE_URL = "https://polygonscan.com/tx/";

export const useItemBlockchainInfo = (item: Child | Template | Parent) => {
  const formattedCreatedDate: string = useMemo(() => {
    return new Date(parseInt(item.createdAt) * 1000).toLocaleDateString();
  }, [item.createdAt]);

  const formattedUpdatedDate: string = useMemo(() => {
    return new Date(parseInt(item.updatedAt) * 1000).toLocaleDateString();
  }, [item.updatedAt]);

  const truncatedTxHash: string = useMemo(() => {
    if (!item.transactionHash) return "N/A";
    return `${item.transactionHash.slice(0, 10)}...${item.transactionHash.slice(-8)}`;
  }, [item.transactionHash]);

  const explorerUrl: string | null = useMemo(() => {
    if (!item.transactionHash) return null;
    return `${BLOCK_EXPLORER_BASE_URL}${item.transactionHash}`;
  }, [item.transactionHash]);

  return {
    formattedCreatedDate,
    formattedUpdatedDate,
    truncatedTxHash,
    explorerUrl,
  };
};