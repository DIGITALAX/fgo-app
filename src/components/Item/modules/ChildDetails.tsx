import { useChildDetails } from "../hooks/useChildDetails";
import { ItemHeader } from "./ItemHeader";
import { ItemPricing } from "./ItemPricing";
import { ItemMetadata } from "./ItemMetadata";
import { ItemRequests } from "./ItemRequests";
import { ItemAuthorized } from "./ItemAuthorized";
import { ItemBlockchainInfo } from "./ItemBlockchainInfo";
import { CreateItemModal } from "@/components/Account/modules/infrastructure/CreateItemModal";
import { ManualApprovalModal } from "@/components/Account/modules/infrastructure/ManualApprovalModal";
import { ChildDetailsProps } from "../types";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useState, useContext } from "react";
import { AppContext } from "@/lib/providers/Providers";
import { ABIS } from "@/abis";
import { parseEther } from "viem";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";

export const ChildDetails = ({
  contractAddress,
  childId,
}: ChildDetailsProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { child, isLoading, error } = useChildDetails(contractAddress, childId);

  if (isLoading) {
    return <div>Loading child...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!child) {
    return <div>Child not found</div>;
  }

  const isSupplier =
    address && address.toLowerCase() === child.supplier.toLowerCase();
  const canDelete =
    parseInt(child.usageCount) === 0 && parseInt(child.supplyCount) === 0;

  const handleDeleteChild = async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError("Wallet not connected");
      return;
    }

    if (!canDelete) {
      context?.showError(
        "Cannot delete child with usage count or supply count greater than 0"
      );
      return;
    }

    setDeleting(true);
    try {
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOChild,
        functionName: "deleteChild",
        args: [BigInt(childId)],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context?.showSuccess("Child deleted successfully!", hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete child";
      context?.showError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditSubmit = async (formData: any) => {
    if (!walletClient || !publicClient || !context) return;

    setUpdating(true);
    try {
      let childUri = child.uri;

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
            : child.metadata?.attachments || [];

        const metadata = {
          title: formData.metadata.title,
          description: formData.metadata.description,
          image: imageHash
            ? `ipfs://${imageHash}`
            : child.metadata?.image || "",
          attachments: finalAttachments,
          tags: formData.metadata.tags,
          prompt: formData.metadata.prompt,
          aiModel: formData.metadata.aiModel,
          loras: formData.metadata.loras,
          workflow: formData.metadata.workflow,
          version: formData.version || child.version,
        };

        const metadataHash = await uploadJSONToIPFS(metadata);
        childUri = `ipfs://${metadataHash}`;
      }

      const updateParams = {
        childId: BigInt(child.childId),
        digitalPrice: parseEther(formData.digitalPrice),
        physicalPrice: parseEther(formData.physicalPrice),
        version: BigInt(formData.version || child.version),
        maxPhysicalEditions: BigInt(formData.maxPhysicalEditions),
        availability:
          formData.availability !== undefined
            ? formData.availability
            : parseInt(child.availability),
        makeImmutable: !child.isImmutable && formData.isImmutable === true,
        standaloneAllowed:
          formData.standaloneAllowed !== undefined
            ? formData.standaloneAllowed
            : child.standaloneAllowed === "true",
        childUri,
        updateReason: "Updated via FGO interface",
        authorizedMarkets:
          formData.authorizedMarkets.length > 0
            ? (formData.authorizedMarkets.map(
                (m: any) => m.contractAddress
              ) as `0x${string}`[])
            : child.authorizedMarkets?.map((m: any) => m.contractAddress) ||
              ([] as `0x${string}`[]),
      };

      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOChild,
        functionName: "updateChild",
        args: [updateParams],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      context.showSuccess("Child updated successfully!", hash);
      setIsEditModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update child";
      context.showError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-8 h-screen overflow-y-auto">
      {isSupplier && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            Edit Child
          </button>
          <button
            onClick={handleDeleteChild}
            disabled={!canDelete || deleting}
            className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
              (!canDelete || deleting) && "cursor-default opacity-70"
            }`}
            title={
              !canDelete
                ? "Cannot delete: Child has usage or supply count > 0"
                : ""
            }
          >
            {deleting ? "Deleting..." : "Delete Child"}
          </button>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="px-2 py-1 font-herm bg-ama hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            Approvals
          </button>
        </div>
      )}
      <ItemHeader item={child} isTemplate={false} />
      <ItemPricing item={child} />
      <ItemMetadata item={child} />
      <ItemRequests item={child} />
      <ItemAuthorized item={child} />
      <ItemBlockchainInfo item={child} />

      <CreateItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (formData) => {
          try {
            await handleEditSubmit(formData);
            setIsEditModalOpen(false);
          } catch (error) {
            throw error;
          }
        }}
        loading={updating}
        mode="child"
        infraId=""
        isEditMode={true}
        editItem={child}
      />

      <ManualApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        itemType="child"
        itemData={child}
        contractAddress={contractAddress}
        itemId={childId.toString()}
      />
    </div>
  );
};
