import { useState, useCallback, useContext } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";

export const useApprovalActions = (contractAddress: string, itemId: string, contractType: "child" | "template" | "parent") => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const getABI = () => {
    switch (contractType) {
      case "child":
        return ABIS.FGOChild;
      case "template":
        return ABIS.FGOTemplateChild;
      case "parent":
        return ABIS.FGOParent;
      default:
        return ABIS.FGOChild;
    }
  };

  const approveMarketRequest = useCallback(async (marketContract: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const loadingKey = `approve-market-${marketContract}`;
    setLoading(loadingKey, true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: getABI(),
        functionName: "approveMarketRequest",
        args: [BigInt(itemId), marketContract as `0x${string}`],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Market request approved!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve market request";
      context.showError(errorMessage);
    } finally {
      setLoading(loadingKey, false);
    }
  }, [walletClient, publicClient, context, contractAddress, itemId, contractType]);

  const rejectMarketRequest = useCallback(async (marketContract: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const loadingKey = `reject-market-${marketContract}`;
    setLoading(loadingKey, true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: getABI(),
        functionName: "rejectMarketRequest",
        args: [BigInt(itemId), marketContract as `0x${string}`],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Market request rejected!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject market request";
      context.showError(errorMessage);
    } finally {
      setLoading(loadingKey, false);
    }
  }, [walletClient, publicClient, context, contractAddress, itemId, contractType]);

  const approveParentRequest = useCallback(async (parentContract: string, parentId: string, approvedAmount: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const loadingKey = `approve-parent-${parentContract}-${parentId}`;
    setLoading(loadingKey, true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: getABI(),
        functionName: "approveParentRequest",
        args: [BigInt(itemId), BigInt(parentId), BigInt(approvedAmount), parentContract as `0x${string}`],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Parent request approved!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve parent request";
      context.showError(errorMessage);
    } finally {
      setLoading(loadingKey, false);
    }
  }, [walletClient, publicClient, context, contractAddress, itemId, contractType]);

  const rejectParentRequest = useCallback(async (parentContract: string, parentId: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const loadingKey = `reject-parent-${parentContract}-${parentId}`;
    setLoading(loadingKey, true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: getABI(),
        functionName: "rejectParentRequest",
        args: [BigInt(itemId), BigInt(parentId), parentContract as `0x${string}`],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Parent request rejected!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject parent request";
      context.showError(errorMessage);
    } finally {
      setLoading(loadingKey, false);
    }
  }, [walletClient, publicClient, context, contractAddress, itemId, contractType]);

  const approveTemplateRequest = useCallback(async (templateContract: string, templateId: string, approvedAmount: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const loadingKey = `approve-template-${templateContract}-${templateId}`;
    setLoading(loadingKey, true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: getABI(),
        functionName: "approveTemplateRequest",
        args: [BigInt(itemId), BigInt(templateId), BigInt(approvedAmount), templateContract as `0x${string}`],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Template request approved!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to approve template request";
      context.showError(errorMessage);
    } finally {
      setLoading(loadingKey, false);
    }
  }, [walletClient, publicClient, context, contractAddress, itemId, contractType]);

  const rejectTemplateRequest = useCallback(async (templateContract: string, templateId: string) => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    const loadingKey = `reject-template-${templateContract}-${templateId}`;
    setLoading(loadingKey, true);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: getABI(),
        functionName: "rejectTemplateRequest",
        args: [BigInt(itemId), BigInt(templateId), templateContract as `0x${string}`],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      context.showSuccess("Template request rejected!", hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject template request";
      context.showError(errorMessage);
    } finally {
      setLoading(loadingKey, false);
    }
  }, [walletClient, publicClient, context, contractAddress, itemId, contractType]);

  return {
    approveMarketRequest,
    rejectMarketRequest,
    approveParentRequest,
    rejectParentRequest,
    approveTemplateRequest,
    rejectTemplateRequest,
    loadingStates,
  };
};