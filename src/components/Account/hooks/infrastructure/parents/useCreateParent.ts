import { useState, useContext } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { ABIS } from "@/abis";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { CreateItemFormData } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";

export const useCreateParent = (contractAddress: string, dict: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);

  const createParent = async (formData: CreateItemFormData) => {
    if (!walletClient || !publicClient) {
      setError(dict?.walletNotConnected);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = "";
      if (formData.metadata.image) {
        imageUrl = await uploadImageToIPFS(formData.metadata.image);
      }
      let attachmentUris: any[] = [];
      if (formData.metadata.attachments.length > 0) {
        for (const attachment of formData.metadata.attachments) {
          const attachmentHash = await uploadImageToIPFS(attachment);
          const fileType = attachment.type.split("/")[1] || attachment.type;
          attachmentUris.push({
            uri: `ipfs://${attachmentHash}`,
            type: fileType,
          });
        }
      }

      const metadata = {
        title: formData.metadata.title,
        description: formData.metadata.description,
        image: `ipfs://${imageUrl}`,
        tags: formData.metadata.tags,
        prompt: formData.metadata.prompt,
        attachments: attachmentUris,
        aiModel: formData.metadata.aiModel,
        loras: formData.metadata.loras,
        workflow: formData.metadata.workflow,
        customFields: formData.metadata.customFields,
      };

      const metadataUri = await uploadJSONToIPFS(metadata);

      const placements = await Promise.all(
        formData.childReferences?.map(async (ref) => {
          const placementData = {
            instructions: ref.metadata.instructions || "",
            customFields: ref.metadata.customFields || {},
          };
          const placementHash = await uploadJSONToIPFS(placementData);

          return {
            childId: BigInt(ref.childId),
            amount: BigInt(ref.amount),
            childContract: ref.childContract as `0x${string}`,
            uri: `ipfs://${placementHash}`,
          };
        }) || []
      );

      const createParentParams = {
        digitalPrice:
          formData.availability === 1
            ? parseEther("0")
            : parseEther(formData.digitalPrice || "0"),
        physicalPrice:
          formData.availability === 0
            ? parseEther("0")
            : parseEther(formData.physicalPrice || "0"),
        maxDigitalEditions:
          formData.availability === 1
            ? BigInt("0")
            : BigInt(formData.maxDigitalEditions || "0"),
        maxPhysicalEditions:
          formData.availability === 0
            ? BigInt("0")
            : BigInt(formData.maxPhysicalEditions || "0"),
        printType: Number(formData.printType || "0"),
        availability: formData.availability,
        digitalMarketsOpenToAll: formData.digitalMarketsOpenToAll,
        physicalMarketsOpenToAll: formData.physicalMarketsOpenToAll,
        uri: `ipfs://${metadataUri}`,
        childReferences: placements,
        authorizedMarkets: formData.authorizedMarkets || ([] as `0x${string}`[]),
        workflow: {
          digitalSteps: formData.fulfillmentWorkflow?.digitalSteps || [],
          physicalSteps: formData.fulfillmentWorkflow?.physicalSteps || [],
        },
      };

      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOParent,
        functionName: "reserveParent",
        args: [createParentParams],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.parentReservedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToReserveParent;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createParent,
    loading,
    error,
  };
};
