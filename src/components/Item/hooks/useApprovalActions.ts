import { useState, useCallback, useContext } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";

export const useApprovalActions = (
  contractAddress: string,
  itemId: string,
  contractType: "child" | "template" | "parent",
  dict: any
) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const { address } = useAccount();

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
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

  const approveMarketRequest = useCallback(
    async (marketContract: string) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
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
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        context.showSuccess(dict?.marketRequestApproved, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : dict?.failedToApproveMarketRequest;
        context.showError(errorMessage);
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [walletClient, publicClient, context, contractAddress, itemId, contractType]
  );

  const rejectMarketRequest = useCallback(
    async (marketContract: string) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
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
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        context.showSuccess(dict?.marketRequestRejected, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : dict?.failedToRejectMarketRequest;
        context.showError(errorMessage);
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [walletClient, publicClient, context, contractAddress, itemId, contractType]
  );

  const approveParentRequest = useCallback(
    async (
      parentContract: string,
      parentId: string,
      approvedAmount: string,
      isPhysical: boolean
    ) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      const loadingKey = `approve-parent-${parentContract}-${parentId}-${
        isPhysical ? "physical" : "digital"
      }`;
      setLoading(loadingKey, true);

      try {
        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI(),
          functionName: "approveParentRequest",
          args: [
            BigInt(itemId),
            BigInt(parentId),
            BigInt(approvedAmount),
            parentContract as `0x${string}`,
            isPhysical,
          ],
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        context.showSuccess(dict?.parentRequestApproved, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : dict?.failedToApproveParentRequest;
        context.showError(errorMessage);
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [walletClient, publicClient, context, contractAddress, itemId, contractType]
  );

  const rejectParentRequest = useCallback(
    async (parentContract: string, parentId: string, isPhysical: boolean) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      const loadingKey = `reject-parent-${parentContract}-${parentId}-${
        isPhysical ? "physical" : "digital"
      }`;
      setLoading(loadingKey, true);

      try {
        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI(),
          functionName: "rejectParentRequest",
          args: [
            BigInt(itemId),
            BigInt(parentId),
            parentContract as `0x${string}`,
            isPhysical,
          ],
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        context.showSuccess(dict?.parentRequestRejected, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : dict?.failedToRejectParentRequest;
        context.showError(errorMessage);
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [walletClient, publicClient, context, contractAddress, itemId, contractType]
  );

  const approveTemplateRequest = useCallback(
    async (
      templateContract: string,
      templateId: string,
      approvedAmount: string,
      isPhysical: boolean
    ) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      const loadingKey = `approve-template-${templateContract}-${templateId}-${
        isPhysical ? "physical" : "digital"
      }`;
      setLoading(loadingKey, true);

      try {
        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI(),
          functionName: "approveTemplateRequest",
          args: [
            BigInt(itemId),
            BigInt(templateId),
            BigInt(approvedAmount),
            templateContract as `0x${string}`,
            isPhysical,
          ],
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        context.showSuccess(dict?.templateRequestApproved, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : dict?.failedToApproveTemplateRequest;
        context.showError(errorMessage);
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [walletClient, publicClient, context, contractAddress, itemId, contractType]
  );

  const rejectTemplateRequest = useCallback(
    async (
      templateContract: string,
      templateId: string,
      isPhysical: boolean
    ) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      const loadingKey = `reject-template-${templateContract}-${templateId}-${
        isPhysical ? "physical" : "digital"
      }`;
      setLoading(loadingKey, true);

      try {
        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI(),
          functionName: "rejectTemplateRequest",
          args: [
            BigInt(itemId),
            BigInt(templateId),
            templateContract as `0x${string}`,
            isPhysical,
          ],
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        context.showSuccess(dict?.templateRequestRejected, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : dict?.failedToRejectTemplateRequest;
        context.showError(errorMessage);
      } finally {
        setLoading(loadingKey, false);
      }
    },
    [walletClient, publicClient, context, contractAddress, itemId, contractType]
  );

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
