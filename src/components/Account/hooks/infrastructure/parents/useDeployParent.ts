import { useState, useCallback, useContext, useEffect, useRef } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { getCoreContractAddresses, getCurrentNetwork } from "@/constants";
import { CONTRACT_FUNCTIONS } from "@/constants/contracts";
import { ABIS } from "@/abis";
import { Infrastructure, DeployParentFormData } from "../../../types";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

export const useDeployParent = (
  infrastructure: Infrastructure,
  dict: any,
  onSuccess?: () => void
) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
  const cancelledRef = useRef<boolean>(false);
  const { address } = useAccount();

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
        dict?.parentContractDeployedSuccessfully,
        successTxHash
      );
      setSuccessTxHash(null);
    }
  }, [successTxHash, dict]);

  const deployParentContract = useCallback(
    async (formData: DeployParentFormData) => {
      if (!walletClient || !publicClient || !context) {
        throw new Error(dict?.walletNotConnected);
      }

      if (!infrastructure.isActive) {
        throw new Error(dict?.infrastructureIsNotActive);
      }

      setLoading(true);
      cancelledRef.current = false;

      try {
        if (cancelledRef.current) {
          setLoading(false);
          return;
        }
        let imageHash = "";

        if (formData.image) {
          imageHash = await uploadImageToIPFS(formData.image);
        }

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        const metadata = {
          title: formData.title,
          description: formData.description,
          image: imageHash ? `ipfs://${imageHash}` : "",
        };

        const metadataHash = await uploadJSONToIPFS(metadata);
        const parentURI = `ipfs://${metadataHash}`;

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
          functionName: CONTRACT_FUNCTIONS.FACTORY.DEPLOY_PARENT_CONTRACT,
          args: [
            infraIdAsBytes32,
            parentURI,
            formData.scm,
            formData.symbol,
            formData.name,
          ],
          account: address,
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
              : dict?.failedToDeployParentContract;
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
    async (formData: DeployParentFormData) => {
      try {
        await deployParentContract(formData);
        if (!cancelledRef.current) {
          closeModal();
        }
      } catch (err) {}
    },
    [deployParentContract, closeModal]
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
