import { useState, useCallback, useContext } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";
import { parseEther } from "viem";

export const useParentActions = (
  contractAddress: string,
  designId: string | number,
  parent: any,
  dict: any
) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isDesigner =
    address && address.toLowerCase() === parent?.designer?.toLowerCase();
  const canDelete = parseInt(parent?.totalPurchases || "0") === 0;

  const isReserved = Number(parent?.status) === 0;
  const areAllChildrenAuthorized =
    parent?.childReferences?.length == parent?.authorizedChildren?.length;
  const canCreate = isReserved && areAllChildrenAuthorized;

  const handleCreateParent = useCallback(async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    if (!canCreate) {
      context?.showError(dict?.cannotCreateParentStatus);
      return;
    }

    setCreating(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOParent,
        functionName: "createParent",
        args: [BigInt(designId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.parentCreatedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToCreateParent;
      context?.showError(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [
    walletClient,
    publicClient,
    context,
    contractAddress,
    designId,
    canCreate,
  ]);

  const handleDeleteParent = useCallback(async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    if (!canDelete) {
      context?.showError(dict?.cannotDeleteParentPurchases);
      return;
    }

    setDeleting(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOParent,
        functionName: "deleteParent",
        args: [BigInt(designId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.parentDeletedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToDeleteParent;
      context?.showError(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [
    walletClient,
    publicClient,
    context,
    contractAddress,
    designId,
    canDelete,
  ]);

  const handleEditSubmit = useCallback(async (formData: any) => {
    if (!walletClient || !publicClient || !context) return;

    setUpdating(true);
    try {
      const updateParams = {
        designId: BigInt(designId),
        digitalPrice: parseEther(formData.digitalPrice || "0"),
        physicalPrice: parseEther(formData.physicalPrice || "0"),
        maxDigitalEditions: BigInt(formData.maxDigitalEditions || "0"),
        maxPhysicalEditions: BigInt(formData.maxPhysicalEditions || "0"),
        authorizedMarkets: formData.authorizedMarkets?.length > 0 
          ? (formData.authorizedMarkets as `0x${string}`[])
          : ((Array.isArray(parent.authorizedMarkets)
              ? parent.authorizedMarkets
              : parent.authorizedMarkets
              ? parent.authorizedMarkets.split(",").map((m: string) => m.trim()).filter((m: string) => m)
              : []) as `0x${string}`[])
      };

      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOParent,
        functionName: "updateParent",
        args: [updateParams],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess(dict?.parentUpdatedSuccessfully, hash);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : dict?.failedToUpdateParent;
      context.showError(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [walletClient, publicClient, context, contractAddress, designId, parent]);

  return {
    isDesigner,
    canDelete,
    canCreate,
    deleting,
    creating,
    updating,
    handleCreateParent,
    handleDeleteParent,
    handleEditSubmit,
  };
};
