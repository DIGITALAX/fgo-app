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
import Image from "next/image";

export const ChildDetails = ({
  contractAddress,
  childId,
  dict,
}: ChildDetailsProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const context = useContext(AppContext);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] =
    useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const { child, isLoading, error } = useChildDetails(
    contractAddress,
    childId,
    dict
  );

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="relative w-fit animate-spin h-fit flex">
          <div className="relative w-6 h-6 flex">
            <Image
              layout="fill"
              objectFit="cover"
              src={"/images/scissors.png"}
              draggable={false}
              alt="loader"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-fresa font-chicago text-sm">
          {dict?.error}: {error}
        </p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-white font-chicago text-sm">{dict?.childNotFound}</p>
      </div>
    );
  }

  const isSupplier =
    address && address.toLowerCase() === child.supplier.toLowerCase();
  const canDelete =
    parseInt(child.usageCount) === 0 && parseInt(child.supplyCount) === 0;
  const isFuturesChild = Boolean(Number(child.futures?.pricePerUnit) > 0);

  const handleDeleteChild = async () => {
    if (!walletClient || !publicClient || !context) {
      context?.showError(dict?.walletNotConnected);
      return;
    }

    if (!canDelete) {
      context?.showError(dict?.cannotDeleteChildUsageCount);
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

      context?.showSuccess(dict?.childDeletedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToDeleteChild;
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
        makeImmutable: !child.isImmutable && formData.isImmutable === true,
        standaloneAllowed:
          formData.standaloneAllowed !== undefined
            ? formData.standaloneAllowed
            : child.standaloneAllowed === true,
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

      context.showSuccess(dict?.childUpdatedSuccessfully, hash);
      setIsEditModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToUpdateChild;
      context.showError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-2 md:p-6 space-y-2 h-screen overflow-y-auto">
      {isSupplier && (
        <div className="flex gap-3 mb-6">
          {!isFuturesChild && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="relative px-3 py-1 bg-offNegro text-oro font-chicago text-xs uppercase cursor-pointer hover:opacity-70"
            >
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderoro2.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">{dict?.editChild}</span>
            </button>
          )}
          <button
            onClick={handleDeleteChild}
            disabled={!canDelete || deleting}
            className={`relative px-3 py-1 bg-offNegro text-fresa font-chicago text-xs uppercase cursor-pointer hover:opacity-70 ${
              !canDelete || deleting ? "cursor-not-allowed opacity-50" : ""
            }`}
            title={!canDelete ? dict?.cannotDeleteChildUsageCount : ""}
          >
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span className="relative z-10">
              {deleting ? dict?.deleting : dict?.deleteChild}
            </span>
          </button>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="relative px-3 py-1 bg-offNegro text-ama font-chicago text-xs uppercase cursor-pointer hover:opacity-70"
          >
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span className="relative z-10">{dict?.approvals}</span>
          </button>
        </div>
      )}
      <ItemHeader item={child} isTemplate={false} dict={dict} />
      <ItemPricing item={child} dict={dict} />
      <ItemMetadata item={child} dict={dict} />
      <ItemRequests item={child} dict={dict} />
      <ItemAuthorized item={child} dict={dict} />
      <ItemBlockchainInfo item={child} dict={dict} />

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
        infraId={child.infraId}
        dict={dict}
        isEditMode={true}
        editItem={child}
      />

      <ManualApprovalModal
        dict={dict}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        itemType="child"
        itemData={child}
      />
    </div>
  );
};
