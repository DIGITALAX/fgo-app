import { useParentDetails } from "../hooks/useParentDetails";
import { useParentActions } from "../hooks/useParentActions";
import { CreateItemModal } from "@/components/Account/modules/infrastructure/CreateItemModal";
import { ManualApprovalModal } from "@/components/Account/modules/infrastructure/ManualApprovalModal";
import { ParentDetailsProps } from "../types";
import { useState } from "react";
import Image from "next/image";
import { ItemHeader } from "./ItemHeader";
import { ItemPricing } from "./ItemPricing";
import { ItemMetadata } from "./ItemMetadata";
import { ItemWorkflow } from "./ItemWorkflow";
import { ItemRequests } from "./ItemRequests";
import { ItemBlockchainInfo } from "./ItemBlockchainInfo";
import { ChildReferences } from "./ChildReferences";
import { ItemAuthorized } from "./ItemAuthorized";

export const ParentDetails = ({
  contractAddress,
  designId,
  dict,
}: ParentDetailsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { parent, isLoading, error } = useParentDetails(
    contractAddress,
    designId,
    dict
  );

  const {
    isDesigner,
    canDelete,
    canCreate,
    deleting,
    creating,
    updating,
    handleCreateParent,
    handleDeleteParent,
    handleEditSubmit,
  } = useParentActions(contractAddress, designId, parent, dict);

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

  if (!parent) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-white font-chicago text-sm">
          {dict?.parentNotFound}
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-2 h-screen overflow-y-auto">
      {isDesigner && (
        <div className="flex gap-3 mb-6">
          {canCreate && (
            <button
              onClick={handleCreateParent}
              disabled={creating}
              className={`relative px-3 py-1 bg-offNegro text-oro font-chicago text-xs uppercase cursor-pointer hover:opacity-70 ${
                creating ? "cursor-not-allowed opacity-50" : ""
              }`}
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
              <span className="relative z-10">{creating ? dict?.creating : dict?.createParent}</span>
            </button>
          )}
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
            <span className="relative z-10">{dict?.editParent}</span>
          </button>
          <button
            onClick={handleDeleteParent}
            disabled={!canDelete || deleting}
            className={`relative px-3 py-1 bg-offNegro text-fresa font-chicago text-xs uppercase cursor-pointer hover:opacity-70 ${
              (!canDelete || deleting) ? "cursor-not-allowed opacity-50" : ""
            }`}
            title={!canDelete ? dict?.cannotDeleteParentPurchases : ""}
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
            <span className="relative z-10">{deleting ? dict?.deleting : dict?.deleteParent}</span>
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
      <ItemHeader item={parent} isTemplate={false} dict={dict} />
      <ItemPricing item={parent} dict={dict} />
      <ItemMetadata item={parent} dict={dict} />
      <ItemWorkflow item={parent} dict={dict} />
      <ItemRequests item={parent} dict={dict} />
      <ItemAuthorized item={parent} dict={dict} />
      <ChildReferences childData={parent.childReferences || []} dict={dict} />
      <ItemBlockchainInfo item={parent} dict={dict} />

      <CreateItemModal
        dict={dict}
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
        mode="parent"
        infraId={parent.infraId}
        isEditMode={true}
        editItem={parent}
      />

      <ManualApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        itemType="parent"
        dict={dict}
        itemData={parent}
      />
    </div>
  );
};
