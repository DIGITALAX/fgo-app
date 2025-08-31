import { useState, useEffect, useContext, useCallback } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import { getAllParents } from "@/lib/subgraph/queries/getApprovals";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";

export const useParentsApproval = (
  itemData: any,
  itemType: "child" | "template" | "parent",
  searchQuery: string
) => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);

  const fetchParents = useCallback(async (skip: number = 0, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const result = await getAllParents(20, skip, searchQuery || undefined);

      if (result?.data?.parents) {
        const newParents = result.data.parents;
        
        if (isLoadMore) {
          setParents(prev => [...prev, ...newParents]);
        } else {
          setParents(newParents);
        }
        
        setHasMore(newParents.length === 20);
      } else {
        if (!isLoadMore) {
          setParents([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load parents");
      if (!isLoadMore) {
        setParents([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchParents(0, false);
  }, [fetchParents]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchParents(parents.length, true);
    }
  }, [hasMore, loadingMore, parents.length, fetchParents]);

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
        throw new Error("Invalid item type");
    }
  };

  const approveParent = async (parent: any) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const { contractAddress, itemId } = getContractInfo();
    setApproving(parent.parentContract);
    try {
      let hash: `0x${string}`;

      switch (itemType) {
        case "child":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "approveParent",
            args: [BigInt(itemId), BigInt(parent.designId), BigInt("1"), parent.parentContract as `0x${string}`],
          });
          break;

        case "template":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOTemplateChild,
            functionName: "approveParent",
            args: [BigInt(itemId), BigInt(parent.designId), BigInt("1"), parent.parentContract as `0x${string}`],
          });
          break;

        default:
          throw new Error("Parents cannot approve other parents");
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Parent approved successfully!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve parent";
      context.showError(errorMessage);
    } finally {
      setApproving(null);
    }
  };

  const revokeParent = async (parent: any) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const { contractAddress, itemId } = getContractInfo();
    setRevoking(parent.parentContract);
    try {
      let hash: `0x${string}`;

      switch (itemType) {
        case "child":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "revokeParent",
            args: [BigInt(itemId), BigInt(parent.designId), parent.parentContract as `0x${string}`],
          });
          break;

        case "template":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOTemplateChild,
            functionName: "revokeParent",
            args: [BigInt(itemId), BigInt(parent.designId), parent.parentContract as `0x${string}`],
          });
          break;

        default:
          throw new Error("Parents cannot revoke other parents");
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Parent approval revoked successfully!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to revoke parent approval";
      context.showError(errorMessage);
    } finally {
      setRevoking(null);
    }
  };

  return {
    parents,
    loading,
    error,
    hasMore,
    loadMore,
    approveParent,
    revokeParent,
    approving,
    revoking,
  };
};