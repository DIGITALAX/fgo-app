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
}: ParentDetailsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { parent, isLoading, error } = useParentDetails(
    contractAddress,
    designId
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
  } = useParentActions(contractAddress, designId, parent);

  if (isLoading) {
    return <div>Loading parent...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!parent) {
    return <div>Parent not found</div>;
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
              {creating ? "Creating..." : "Create Parent"}
            </button>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            Edit Parent
          </button>
          <button
            onClick={handleDeleteParent}
            disabled={!canDelete || deleting}
            className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
              (!canDelete || deleting) && "cursor-default opacity-70"
            }`}
            title={
              !canDelete ? "Cannot delete: Parent has total purchases > 0" : ""
            }
          >
            {deleting ? "Deleting..." : "Delete Parent"}
          </button>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="px-2 py-1 font-herm bg-ama hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            Approvals
          </button>
        </div>
      )}
      <ItemHeader item={parent} isTemplate={false} />
      <ItemPricing item={parent} />
      <ItemMetadata item={parent} />
      <ItemWorkflow item={parent} />
      <ItemRequests item={parent} />
      <ItemAuthorized item={parent} />
      <ChildReferences childData={parent.childReferences || []} />
      <ItemBlockchainInfo item={parent} />

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
        mode="parent"
        infraId=""
        isEditMode={true}
        editItem={parent}
      />

      <ManualApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        itemType="parent"
        itemData={parent}
        contractAddress={contractAddress}
        itemId={designId.toString()}
      />
    </div>
  );
};
