import { ABIS } from "@/abis";
import {
  Details,
  EncryptedData,
  Fulfillment,
  Order,
} from "@/components/Account/types";
import { decryptData } from "@/lib/helpers/encryption";
import { uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { AppContext } from "@/lib/providers/Providers";
import { SetStateAction, useCallback, useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export const isEncryptedDetails = (details: EncryptedData) => {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return false;
  }

  return Object.values(details as Record<string, any>).every((value) => {
    if (!value || typeof value !== "object") {
      return false;
    }

    const candidate = value as {
      ciphertext?: unknown;
      iv?: unknown;
      ephemPublicKey?: unknown;
    };

    return (
      typeof candidate.ciphertext === "string" &&
      typeof candidate.iv === "string" &&
      typeof candidate.ephemPublicKey === "string"
    );
  });
};

const useSteps = (
  dict: any,
  setFlows: (e: SetStateAction<Fulfillment[]>) => void,
  fulfillment: Fulfillment
) => {
  const { address } = useAccount();
  const context = useContext(AppContext);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [completing, setCompleting] = useState<boolean>(false);
  const [decrypting, setDecrypting] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const completeStep = useCallback(
    async (stepIndex: number) => {
      if (!walletClient || !publicClient || !context) {
        context?.showError(dict?.walletNotConnected);
        return;
      }

      if (
        !fulfillment.contract ||
        (fulfillment.isPhysical
          ? fulfillment.physicalSteps
          : fulfillment.digitalSteps)?.[
          stepIndex
        ]?.fulfiller?.fulfiller?.toLowerCase() !== address?.toLowerCase() ||
        fulfillment?.fulfillmentOrderSteps?.length !== stepIndex
      ) {
        context?.showError(dict?.cannotCompleteStep);
        return;
      }

      setCompleting(true);

      let note = notes;
      if (note.trim() !== "") {
        const metadataHash = await uploadJSONToIPFS({
          notes,
        });
        const newURI = `ipfs://${metadataHash}`;
        note = newURI;
      }

      try {
        const hash = await walletClient.writeContract({
          address: fulfillment.contract as `0x${string}`,
          abi: ABIS.FGOFulfillment,
          functionName: "completeStep",
          args: [BigInt(fulfillment.orderId), BigInt(stepIndex), note],
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        setNotes("");
        context?.showSuccess(dict?.parentCreatedSuccessfully, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : dict?.failedToCompleteStep;
        context?.showError(errorMessage);
      } finally {
        setCompleting(false);
      }
    },
    [walletClient, publicClient, context, fulfillment]
  );

  const handleDecryptFulfillment = async (): Promise<void> => {
    if (!address) {
      return;
    }

    if (
      fulfillment?.order?.decrypted ||
      !isEncryptedDetails(fulfillment?.order?.fulfillmentData as EncryptedData)
    ) {
      return;
    }

    setDecrypting(true);
    try {
      let key = privateKey;

      if (!key) {
        const promptValue = window.prompt(dict?.decryptPrompt);

        if (!promptValue) {
          setDecrypting(false);
          return;
        }

        key = promptValue.trim();

        if (!key.startsWith("0x")) {
          key = `0x${key}`;
        }

        setPrivateKey(key);
      }

      const decrypted = await decryptData(
        fulfillment?.order?.fulfillmentData as EncryptedData,
        key,
        address
      );

      setFlows((prev) =>
        prev.map((item) => {
          if (item.orderId == fulfillment.orderId) {
            return {
              ...item!,
              order: {
                ...item.order!,
                fulfillmentData: decrypted as Details,
                decrypted: true,
              },
            };
          } else {
            return item;
          }
        })
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToDecrypt;
      context?.showError(errorMessage);
      setPrivateKey(null);
    } finally {
      setDecrypting(false);
    }
  };

  return {
    completing,
    completeStep,
    notes,
    setNotes,
    handleDecryptFulfillment,
    decrypting,
  };
};

export default useSteps;
