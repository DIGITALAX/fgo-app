import { useState, useEffect, useContext, useCallback } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import { getAllMarkets } from "@/lib/subgraph/queries/getApprovals";
import { MarketContract } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";

export const useMarketsApproval = (
  itemData: any,
  itemType: "child" | "template" | "parent",
  searchQuery: string,
  dict: any
) => {
  const [markets, setMarkets] = useState<MarketContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);

  const fetchMarkets = useCallback(async (skip: number = 0, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const result = await getAllMarkets(20, skip, searchQuery || undefined);

      if (result?.data?.marketContracts) {
        const newMarkets = result.data.marketContracts;
        
        if (isLoadMore) {
          setMarkets(prev => [...prev, ...newMarkets]);
        } else {
          setMarkets(newMarkets);
        }
        
        setHasMore(newMarkets.length === 20);
      } else {
        if (!isLoadMore) {
          setMarkets([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : dict?.failedToLoadMarkets);
      if (!isLoadMore) {
        setMarkets([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchMarkets(0, false);
  }, [fetchMarkets]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchMarkets(markets.length, true);
    }
  }, [hasMore, loadingMore, markets.length, fetchMarkets]);

  const getContractInfo = () => {
    switch (itemType) {
      case "child":
        return {
          contractAddress: itemData.childContract,
          itemId: itemData.childId,
        };
      case "template":
        return {
          contractAddress: itemData.templateContract,
          itemId: itemData.templateId,
        };
      case "parent":
        return {
          contractAddress: itemData.parentContract,
          itemId: itemData.designId,
        };
      default:
        throw new Error(dict?.item);
    }
  };

  const approveMarket = async (marketAddress: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    const { contractAddress, itemId } = getContractInfo();
    setApproving(marketAddress);
    try {
      let hash: `0x${string}`;

      switch (itemType) {
        case "child":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "approveMarket",
            args: [BigInt(itemId), marketAddress as `0x${string}`],
          });
          break;

        case "template":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOTemplateChild,
            functionName: "approveMarket",
            args: [BigInt(itemId), marketAddress as `0x${string}`],
          });
          break;

        case "parent":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOParent,
            functionName: "approveMarket",
            args: [BigInt(itemId), marketAddress as `0x${string}`],
          });
          break;

        default:
          throw new Error(dict?.item);
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess(dict?.marketApprovedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToApproveMarket;
      context.showError(errorMessage);
    } finally {
      setApproving(null);
    }
  };

  const revokeMarket = async (marketAddress: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    const { contractAddress, itemId } = getContractInfo();
    setRevoking(marketAddress);
    try {
      let hash: `0x${string}`;

      switch (itemType) {
        case "child":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "revokeMarket",
            args: [BigInt(itemId), marketAddress as `0x${string}`],
          });
          break;

        case "template":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOTemplateChild,
            functionName: "revokeMarket",
            args: [BigInt(itemId), marketAddress as `0x${string}`],
          });
          break;

        case "parent":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOParent,
            functionName: "revokeMarket",
            args: [BigInt(itemId), marketAddress as `0x${string}`],
          });
          break;

        default:
          throw new Error(dict?.item);
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess(dict?.marketApprovalRevokedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : dict?.failedToRevokeMarketApproval;
      context.showError(errorMessage);
    } finally {
      setRevoking(null);
    }
  };

  return {
    markets,
    loading,
    error,
    hasMore,
    loadMore,
    approveMarket,
    revokeMarket,
    approving,
    revoking,
  };
};
