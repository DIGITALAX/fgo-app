import { useState, useContext } from "react";
import { useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { ABIS } from "@/abis";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { CreateItemFormData } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";

export const useCreateParent = (contractAddress: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const createParent = async (formData: CreateItemFormData) => {
    if (!walletClient) {
      setError("Wallet not connected");
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
      };

      const metadataUri = await uploadJSONToIPFS(metadata);

      const placements = await Promise.all(
        formData.childReferences?.map(async (ref) => {
          const placementData = {
            instructions: ref.instructions || "",
            customFields: ref.customFields || {},
          };
          const placementHash = await uploadJSONToIPFS(placementData);

          return {
            childId: BigInt(ref.childId),
            amount: BigInt(ref.amount),
            childContract: ref.childContract as `0x${string}`,
            placementURI: `ipfs://${placementHash}`,
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
        maxDigitalEditions: BigInt("1000"),
        maxPhysicalEditions: BigInt(formData.maxPhysicalEditions || "0"),
        printType: 0,
        availability: formData.availability,
        digitalMarketsOpenToAll: formData.digitalMarketsOpenToAll,
        physicalMarketsOpenToAll: formData.physicalMarketsOpenToAll,
        uri: `ipfs://${metadataUri}`,
        childReferences: placements,
        authorizedMarkets: [] as `0x${string}`[],
        workflow: formData.fulfillmentWorkflow || {
          digitalSteps: [],
          physicalSteps: [],
        },
      };


      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOParent,
        functionName: "reserveParent",
        args: [createParentParams],
      });

      context?.showSuccess("Parent reserved successfully!", hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reserve parent";
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
