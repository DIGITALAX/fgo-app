import { useState, useCallback, useContext, useRef } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { getCoreContractAddresses } from "@/constants";
import { getCurrentNetwork } from "@/constants";
import { AppContext } from "@/lib/providers/Providers";
import { CreateInfrastructureFormData, PaymentToken } from "../../types";
import { ABIS } from "@/abis";

export const useCreateInfrastructure = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cancelledRef = useRef<boolean>(false);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const network = getCurrentNetwork();
  const { Factory: factoryAddress, TestToken: testTokenAddress } =
    getCoreContractAddresses(network.chainId);

  const paymentTokens: PaymentToken[] = [
    {
      address: testTokenAddress,
      name: "Test Token",
      symbol: "TEST",
    },
  ];

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

  const deployInfrastructure = useCallback(
    async (formData: CreateInfrastructureFormData) => {
      if (!walletClient || !publicClient || !context) {
        throw new Error("Wallet not connected");
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
        const uri = `ipfs://${metadataHash}`;

        if (cancelledRef.current) {
          setLoading(false);
          return;
        }

        const hash = await walletClient.writeContract({
          address: factoryAddress as `0x${string}`,
          abi: ABIS.FGOFactory,
          functionName: "deployInfrastructure",
          args: [formData.paymentToken as `0x${string}`, uri],
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

        context.showSuccess("Infrastructure deployed successfully!");
      } catch (err) {
        if (!cancelledRef.current) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to deploy infrastructure";
          context.showError(errorMessage);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    [walletClient, publicClient, factoryAddress]
  );

  const handleSubmit = useCallback(
    async (formData: CreateInfrastructureFormData) => {
      try {
        await deployInfrastructure(formData);
        if (!cancelledRef.current) {
          closeModal();
        }
      } catch (err) {}
    },
    [deployInfrastructure, closeModal]
  );

  return {
    isModalOpen,
    loading,
    paymentTokens,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  };
};
