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
import Image from "next/image";

export const TemplateDetails = ({
  contractAddress,
  templateId,
  dict,
}: TemplateDetailsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);

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
  } = useTemplateActions(contractAddress, templateId, template!, dict);

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

  if (!template) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-6">
        <p className="text-white font-chicago text-sm">
          {dict?.templateNotFound}
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-2 h-screen overflow-y-auto">
      {isSupplier && (
        <div className="flex gap-3 mb-6">
          {canCreate && (
            <button
              onClick={handleCreateTemplate}
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
              <span className="relative z-10">{creating ? dict?.creating : dict?.createTemplate}</span>
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
            <span className="relative z-10">{dict?.editTemplate}</span>
          </button>
          <button
            onClick={handleDeleteTemplate}
            disabled={!canDelete || deleting}
            className={`relative px-3 py-1 bg-offNegro text-fresa font-chicago text-xs uppercase cursor-pointer hover:opacity-70 ${
              (!canDelete || deleting) ? "cursor-not-allowed opacity-50" : ""
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
            <span className="relative z-10">{deleting ? dict?.deleting : dict?.deleteTemplate}</span>
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
