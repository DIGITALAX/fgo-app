"use client";

import { useState, useCallback, useContext, useRef } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { getCoreContractAddresses } from "@/constants";
import { getCurrentNetwork } from "@/constants";
import { AppContext } from "@/lib/providers/Providers";
import { CreateInfrastructureFormData, PaymentToken } from "../../types";
import { ABIS } from "@/abis";

export const useCreateInfrastructure = (dict: any) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cancelledRef = useRef<boolean>(false);

  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const network = getCurrentNetwork();
  const { Factory: factoryAddress, Mona: monaAddress } =
    getCoreContractAddresses(network.chainId);

  const paymentTokens: PaymentToken[] = [
    {
      address: monaAddress,
      name: "MONA",
      symbol: "MONA",
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
        throw new Error(dict?.walletNotConnected);
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

        context.showSuccess(dict?.infrastructureDeployedSuccessfully);
      } catch (err) {
        if (!cancelledRef.current) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : dict?.failedToDeployInfrastructure;
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
      await deployInfrastructure(formData);
      if (!cancelledRef.current) {
        closeModal();
      }
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
