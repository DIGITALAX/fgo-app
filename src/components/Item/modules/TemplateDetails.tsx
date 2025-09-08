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
  dict,
}: TemplateDetailsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { template, isLoading, error } = useTemplateDetails(
    contractAddress,
    templateId,
    dict
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
  } = useTemplateActions(contractAddress, templateId, template, dict);

  if (isLoading) {
    return <div>{dict?.loadingTemplate}</div>;
  }

  if (error) {
    return (
      <div>
        {dict?.error}: {error}
      </div>
    );
  }

  if (!template) {
    return <div>{dict?.templateNotFound}</div>;
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
              {creating ? dict?.creating : dict?.createTemplate}
            </button>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            {dict?.editTemplate}
          </button>
          <button
            onClick={handleDeleteTemplate}
            disabled={!canDelete || deleting}
            className={`px-2 py-1 font-herm bg-white hover:opacity-70 rounded-sm flex items-center text-xs text-black ${
              (!canDelete || deleting) && "cursor-default opacity-70"
            }`}
            title={!canDelete ? dict?.cannotDeleteChildUsageCount : ""}
          >
            {deleting ? dict?.deleting : dict?.deleteTemplate}
          </button>
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            className="px-2 py-1 font-herm bg-ama hover:opacity-70 rounded-sm flex items-center text-xs text-black"
          >
            {dict?.approvals}
          </button>
        </div>
      )}
      <ItemHeader item={template} isTemplate={true} dict={dict} />
      <ItemPricing item={template} dict={dict} />
      <ItemMetadata item={template} dict={dict} />
      <ItemRequests item={template} dict={dict} />
      <ItemAuthorized item={template} dict={dict} />
      <ChildReferences childData={template.childReferences || []} dict={dict} />
      <ItemBlockchainInfo item={template} dict={dict} />

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
        infraId={template.infraId}
        isEditMode={true}
        editItem={template}
        dict={dict}
      />

      <ManualApprovalModal
        dict={dict}
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        itemType="template"
        itemData={template}
      />
    </div>
  );
};
