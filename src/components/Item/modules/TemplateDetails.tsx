import { useTemplateDetails } from "../hooks/useTemplateDetails";
import { useTemplateActions } from "../hooks/useTemplateActions";
import { ItemHeader } from "./ItemHeader";
import { ItemPricing } from "./ItemPricing";
import { ItemMetadata } from "./ItemMetadata";
import { ItemRequests } from "./ItemRequests";
import { ItemAuthorized } from "./ItemAuthorized";
import { ChildReferences } from "./ChildReferences";
import { ItemBlockchainInfo } from "./ItemBlockchainInfo";
import { CreateItemModal } from "@/components/Account/modules/infrastructure/CreateItemModal";
import { ManualApprovalModal } from "@/components/Account/modules/infrastructure/ManualApprovalModal";
import { TemplateDetailsProps } from "../types";
import { useState } from "react";

export const TemplateDetails = ({
  contractAddress,
  templateId,
}: TemplateDetailsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { template, isLoading, error } = useTemplateDetails(
    contractAddress,
    templateId
  );

  const {
    isSupplier,
    canDelete,
    canCreate,
    deleting,
    creating,
    updating,
    handleCreateTemplate,
    handleDeleteTemplate,
    handleEditSubmit,
  } = useTemplateActions(contractAddress, templateId, template);

  if (isLoading) {
    return <div>Loading template...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="p-6 space-y-8 h-screen overflow-y-auto">
      {isSupplier && (
        <div className="flex gap-3 mb-6">
          {canCreate && (
            <button
              onClick={handleCreateTemplate}
              disabled={creating}
              className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
                creating && "cursor-not-allowed"
              }`}
            >
              {creating ? "Creating..." : "Create Template"}
            </button>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            Edit Template
          </button>
          <button
            onClick={handleDeleteTemplate}
            disabled={!canDelete || deleting}
            className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
              (!canDelete || deleting) && "cursor-default opacity-70"
            }`}
            title={
              !canDelete
                ? "Cannot delete: Template has usage or supply count > 0"
                : ""
            }
          >
            {deleting ? "Deleting..." : "Delete Template"}
          </button>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="px-2 py-1 font-herm bg-ama hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            Approvals
          </button>
        </div>
      )}
      <ItemHeader item={template} isTemplate={true} />
      <ItemPricing item={template} />
      <ItemMetadata item={template} />
      <ItemRequests item={template} />
      <ItemAuthorized item={template} />
      <ChildReferences childData={template.childReferences || []} />
      <ItemBlockchainInfo item={template} />

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
        mode="template"
        infraId=""
        isEditMode={true}
        editItem={template}
      />

      <ManualApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        itemType="template"
        itemData={template}
        contractAddress={contractAddress}
        itemId={templateId.toString()}
      />
    </div>
  );
};
