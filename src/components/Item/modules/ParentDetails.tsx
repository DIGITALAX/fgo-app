import { useParentDetails } from "../hooks/useParentDetails";
import { useParentActions } from "../hooks/useParentActions";
import { ItemHeader } from "./ItemHeader";
import { ItemPricing } from "./ItemPricing";
import { ItemMetadata } from "./ItemMetadata";
import { ItemRequests } from "./ItemRequests";
import { ItemAuthorized } from "./ItemAuthorized";
import { ItemWorkflow } from "./ItemWorkflow";
import { ChildReferences } from "./ChildReferences";
import { ItemBlockchainInfo } from "./ItemBlockchainInfo";
import { CreateItemModal } from "@/components/Account/modules/infrastructure/CreateItemModal";
import { ManualApprovalModal } from "@/components/Account/modules/infrastructure/ManualApprovalModal";
import { ParentDetailsProps } from "../types";
import { useState } from "react";

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
    return <div>{dict?.loadingParent}</div>;
  }

  if (error) {
    return (
      <div>
        {dict?.error}: {error}
      </div>
    );
  }

  if (!parent) {
    return <div>{dict?.parentNotFound}</div>;
  }

  return (
    <div className="p-6 space-y-8 h-screen overflow-y-auto">
      {isDesigner && (
        <div className="flex gap-3 mb-6">
          {canCreate && (
            <button
              onClick={handleCreateParent}
              disabled={creating}
              className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
                creating && "cursor-not-allowed"
              }`}
            >
              {creating ? dict?.creating : dict?.createParent}
            </button>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            {dict?.editParent}
          </button>
          <button
            onClick={handleDeleteParent}
            disabled={!canDelete || deleting}
            className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
              (!canDelete || deleting) && "cursor-default opacity-70"
            }`}
            title={!canDelete ? dict?.cannotDeleteParentPurchases : ""}
          >
            {deleting ? dict?.deleting : dict?.deleteParent}
          </button>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="px-2 py-1 font-herm bg-ama hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            {dict?.approvals}
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
