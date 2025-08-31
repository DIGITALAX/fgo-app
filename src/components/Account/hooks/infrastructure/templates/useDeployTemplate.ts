import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { getCoreContractAddresses, getCurrentNetwork } from "@/constants";
import { CONTRACT_FUNCTIONS } from "@/constants/contracts";
import { ABIS } from "@/abis";
import { Infrastructure, DeployTemplateFormData } from "../../../types";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

export const useDeployTemplate = (
  infrastructure: Infrastructure,
  onSuccess?: () => void
) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const cancelledRef = useRef<boolean>(false);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const network = getCurrentNetwork();
  const { Factory: factoryAddress } = getCoreContractAddresses(network.chainId);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const cancelOperation = useCallback(() => {
    cancelledRef.current = true;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (successTxHash) {
      context?.showSuccess(
        "Template contract deployed successfully!",
        successTxHash
      );
      setSuccessTxHash(null);
    }
  }, [successTxHash]);

  const deployTemplateContract = useCallback(
    async (formData: DeployTemplateFormData) => {
      if (!walletClient || !publicClient || !context) {
        throw new Error("Wallet not connected");
      }

      if (!infrastructure.isActive) {
        throw new Error("Infrastructure is not active");
      }

      setLoading(true);
      cancelledRef.current = false;

      try {
        if (cancelledRef.current) {
          setLoading(false);
          return;
        }
        const infraIdAsBytes32 = convertInfraIdToBytes32(
          infrastructure.infraId
        );

        const hash = await walletClient.writeContract({
          address: factoryAddress as `0x${string}`,
          abi: ABIS.FGOFactory,
          functionName: CONTRACT_FUNCTIONS.FACTORY.DEPLOY_TEMPLATE_CONTRACT,
          args: [
            formData.childType,
            infraIdAsBytes32,
            formData.name,
            formData.symbol,
            formData.scm,
          ],
        });

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        setSuccessTxHash(hash);
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        if (!cancelledRef.current) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to deploy template contract";
          context.showError(errorMessage);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [
      walletClient,
      publicClient,
      context,
      factoryAddress,
      infrastructure.infraId,
      infrastructure.isActive,
    ]
  );

  const handleSubmit = useCallback(
    async (formData: DeployTemplateFormData) => {
      try {
        await deployTemplateContract(formData);
        if (!cancelledRef.current) {
          closeModal();
        }
      } catch (err) {}
    },
    [deployTemplateContract, closeModal]
  );

  return {
    isModalOpen,
    loading,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  };
};
