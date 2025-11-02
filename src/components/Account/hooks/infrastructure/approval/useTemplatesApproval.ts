import { useState, useEffect, useContext, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { getAllTemplates } from "@/lib/subgraph/queries/getApprovals";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";
import { Child, Template } from "@/components/Item/types";
import { Parent } from "@/components/Account/types";

export const useTemplatesApproval = (
  itemData: Child | Template | Parent,
  itemType: "child" | "template" | "parent",
  searchQuery: string,
  dict: any
) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);
  const { address } = useAccount();

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);

  const fetchTemplates = useCallback(
    async (skip: number = 0, isLoadMore: boolean = false) => {
      try {
        if (!isLoadMore) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const result = await getAllTemplates(
          20,
          skip,
          searchQuery || undefined
        );

        if (result?.data?.templates) {
          const newTemplates = result.data.templates;

          if (isLoadMore) {
            setTemplates((prev) => [...prev, ...newTemplates]);
          } else {
            setTemplates(newTemplates);
          }

          setHasMore(newTemplates.length === 20);
        } else {
          if (!isLoadMore) {
            setTemplates([]);
          }
          setHasMore(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : dict?.failedToLoadTemplates
        );
        if (!isLoadMore) {
          setTemplates([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    fetchTemplates(0, false);
  }, [fetchTemplates]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchTemplates(templates.length, true);
    }
  }, [hasMore, loadingMore, templates.length, fetchTemplates]);

  const getContractInfo = () => {
    switch (itemType) {
      case "child":
        return {
          contractAddress: (itemData as Child).childContract,
          itemId: (itemData as Child).childId,
        };
      case "template":
        return {
          contractAddress: (itemData as Template).templateContract,
          itemId: (itemData as Template).templateId,
        };
      case "parent":
        return {
          contractAddress: (itemData as Parent).parentContract,
          itemId: (itemData as Parent).designId,
        };
      default:
        throw new Error(dict?.item);
    }
  };

  const approveTemplate = async (template: any, isPhysical: boolean) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    const { contractAddress, itemId } = getContractInfo();
    setApproving(template.templateContract);
    try {
      let hash: `0x${string}`;

      switch (itemType) {
        case "child":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "approveTemplate",
            args: [
              BigInt(itemId),
              BigInt(template.templateId),
              BigInt("1"),
              template.templateContract as `0x${string}`,
              isPhysical,
            ],
            account: address,
          });
          break;

        case "template":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOTemplateChild,
            functionName: "approveTemplate",
            args: [
              BigInt(itemId),
              BigInt(template.templateId),
              BigInt("1"),
              template.templateContract as `0x${string}`,
              isPhysical,
            ],
            account: address,
          });
          break;

        case "parent":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOParent,
            functionName: "approveTemplate",
            args: [
              BigInt(itemId),
              BigInt(template.templateId),
              BigInt("1"),
              template.templateContract as `0x${string}`,
              isPhysical,
            ],
            account: address,
          });
          break;

        default:
          throw new Error(dict?.item);
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess(dict?.templateApprovedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToApproveTemplate;
      context.showError(errorMessage);
    } finally {
      setApproving(null);
    }
  };

  const revokeTemplate = async (template: Template) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    const { contractAddress, itemId } = getContractInfo();
    setRevoking(template.templateContract);
    try {
      let hash: `0x${string}`;

      switch (itemType) {
        case "child":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "revokeTemplate",
            args: [
              BigInt(itemId),
              BigInt(template.templateId),
              template.templateContract as `0x${string}`,
            ],
            account: address,
          });
          break;

        case "template":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOTemplateChild,
            functionName: "revokeTemplate",
            args: [
              BigInt(itemId),
              BigInt(template.templateId),
              template.templateContract as `0x${string}`,
            ],
            account: address,
          });
          break;

        case "parent":
          hash = await walletClient.writeContract({
            address: contractAddress as `0x${string}`,
            abi: ABIS.FGOParent,
            functionName: "revokeTemplate",
            args: [
              BigInt(itemId),
              BigInt(template.templateId),
              template.templateContract as `0x${string}`,
            ],
            account: address,
          });
          break;

        default:
          throw new Error(dict?.item);
      }

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess(dict?.templateApprovalRevokedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToApproveMarket;
      context.showError(errorMessage);
    } finally {
      setRevoking(null);
    }
  };

  return {
    templates,
    loading,
    error,
    hasMore,
    loadMore,
    approveTemplate,
    revokeTemplate,
    approving,
    revoking,
  };
};
