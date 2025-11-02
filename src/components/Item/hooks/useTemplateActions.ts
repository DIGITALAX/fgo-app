import { useState, useCallback, useContext, useEffect } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";
import { parseEther } from "viem";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { Template } from "../types";
import { checkCreate } from "@/lib/helpers/canCreate";

export const useTemplateActions = (
  contractAddress: string,
  templateId: string | number,
  template: Template,
  dict: any
) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);

  const isSupplier =
    address && address.toLowerCase() === template?.supplier?.toLowerCase();
  const canDelete =
    parseInt(template?.usageCount || "0") === 0 &&
    parseInt(template?.supplyCount || "0") === 0;
  const isReserved = Number(template?.status) === 0;

  const handleCreateTemplate = useCallback(async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    if (!canCreate || !isReserved) {
      context?.showError(dict?.cannotCreateTemplateStatus);
      return;
    }

    setCreating(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOTemplateChild,
        functionName: "createTemplate",
        args: [BigInt(templateId)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.templateCreatedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToCreateTemplate;
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
      context?.showError(dict?.walletNotConnected);
      return;
    }

    if (!canDelete) {
      context?.showError(dict?.cannotDeleteTemplateUsageCount);
      return;
    }

    setDeleting(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOTemplateChild,
        functionName: "deleteTemplate",
        args: [BigInt(templateId)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess(dict?.templateDeletedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToDeleteTemplate;
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
          makeImmutable: !template.isImmutable && formData.isImmutable === true,
          standaloneAllowed:
            formData.standaloneAllowed !== undefined
              ? formData.standaloneAllowed
              : (template as any).standaloneAllowed === true,
          childUri: templateUri,
          updateReason: "Updated via FGO interface",
          authorizedMarkets:
            formData.authorizedMarkets.length > 0
              ? (formData.authorizedMarkets as `0x${string}`[])
              : ((Array.isArray(template.authorizedMarkets)
                  ? (template as any).authorizedMarkets
                  : (template as any).authorizedMarkets
                  ? (template as any).authorizedMarkets
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
          account: address,
        });

        await publicClient.waitForTransactionReceipt({ hash });

        context.showSuccess(dict?.templateUpdatedSuccessfully, hash);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : dict?.failedToUpdateTemplate;
        context.showError(errorMessage);
      } finally {
        setUpdating(false);
      }
    },
    [walletClient, publicClient, context, template, contractAddress]
  );
  const creationCheck = async () => {
    try {
      const res = await checkCreate(template, dict);
      setCanCreate(res);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (isReserved && !canCreate) {
      creationCheck();
    }
  }, [isReserved]);

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
