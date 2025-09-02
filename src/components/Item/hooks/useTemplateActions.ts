import { useState, useCallback, useContext } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";
import { parseEther } from "viem";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";

export const useTemplateActions = (
  contractAddress: string,
  templateId: string | number,
  template: any
) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isSupplier =
    address && address.toLowerCase() === template?.supplier?.toLowerCase();
  const canDelete =
    parseInt(template?.usageCount || "0") === 0 &&
    parseInt(template?.supplyCount || "0") === 0;

  const isReserved = Number(template?.status) === 0;
  const areAllChildrenAuthorized =
    template?.childReferences?.length == template?.authorizedChildren?.length;
  const canCreate = isReserved && areAllChildrenAuthorized;


  const handleCreateTemplate = useCallback(async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    if (!canCreate) {
      context?.showError(
        "Cannot create template: ensure status is reserved and all child references are authorized"
      );
      return;
    }

    setCreating(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOTemplateChild,
        functionName: "createTemplate",
        args: [BigInt(templateId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Template created successfully!", hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create template";
      context?.showError(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [
    walletClient,
    publicClient,
    context,
    contractAddress,
    templateId,
    canCreate,
  ]);

  const handleDeleteTemplate = useCallback(async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    if (!canDelete) {
      context?.showError(
        "Cannot delete template with usage count or supply count greater than 0"
      );
      return;
    }

    setDeleting(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOTemplateChild,
        functionName: "deleteTemplate",
        args: [BigInt(templateId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Template deleted successfully!", hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete template";
      context?.showError(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [
    walletClient,
    publicClient,
    context,
    contractAddress,
    templateId,
    canDelete,
  ]);

  const handleEditSubmit = useCallback(
    async (formData: any) => {
      if (!walletClient || !publicClient || !context) return;

      setUpdating(true);
      try {
        let templateUri = template.uri;

        if (formData.metadata) {
          let imageHash = "";
          if (formData.metadata.image) {
            imageHash = await uploadImageToIPFS(formData.metadata.image);
          }

          const attachmentUris: string[] = [];
          if (formData.metadata.attachments.length > 0) {
            for (const file of formData.metadata.attachments) {
              const hash = await uploadImageToIPFS(file);
              attachmentUris.push(`ipfs://${hash}`);
            }
          }

          const finalAttachments =
            attachmentUris.length > 0
              ? attachmentUris.map((uri) => ({ uri, type: "image" }))
              : template.metadata?.attachments || [];

          const metadata = {
            title: formData.metadata.title,
            description: formData.metadata.description,
            image: imageHash
              ? `ipfs://${imageHash}`
              : template.metadata?.image || "",
            attachments: finalAttachments,
            tags: formData.metadata.tags,
            prompt: formData.metadata.prompt,
            aiModel: formData.metadata.aiModel,
            loras: formData.metadata.loras,
            workflow: formData.metadata.workflow,
            version: formData.version || template.version,
          };

          const metadataHash = await uploadJSONToIPFS(metadata);
          templateUri = `ipfs://${metadataHash}`;
        }

        const updateParams = {
          childId: BigInt(template.templateId),
          digitalPrice: parseEther(formData.digitalPrice),
          physicalPrice: parseEther(formData.physicalPrice),
          version: BigInt(formData.version || template.version),
          maxPhysicalEditions: BigInt(formData.maxPhysicalEditions),
          availability:
            formData.availability !== undefined
              ? formData.availability
              : parseInt(template.availability),
          makeImmutable: !template.isImmutable && formData.isImmutable === true,
          standaloneAllowed:
            formData.standaloneAllowed !== undefined
              ? formData.standaloneAllowed
              : template.standaloneAllowed === "true",
          childUri: templateUri,
          updateReason: "Updated via FGO interface",
          authorizedMarkets:
            formData.authorizedMarkets.length > 0
              ? (formData.authorizedMarkets as `0x${string}`[])
              : ((Array.isArray(template.authorizedMarkets)
                  ? template.authorizedMarkets
                  : template.authorizedMarkets
                  ? template.authorizedMarkets
                      .split(",")
                      .map((m: string) => m.trim())
                      .filter((m: string) => m)
                  : []) as `0x${string}`[]),
        };

        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: ABIS.FGOTemplateChild,
          functionName: "updateChild",
          args: [updateParams],
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context.showSuccess("Template updated successfully!", hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update template";
        context.showError(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [walletClient, publicClient, context, template, contractAddress]
  );

  return {
    isSupplier,
    canDelete,
    canCreate,
    deleting,
    creating,
    updating,
    handleCreateTemplate,
    handleDeleteTemplate,
    handleEditSubmit,
  };
};
