import { TemplateContractDetailViewProps } from "../../../types";
import { getCurrentNetwork } from "@/constants";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import { CreateItemModal } from "../CreateItemModal";
import { ProfileManager } from "../../ProfileManager";
import { useState } from "react";
import { useTemplateItems } from "@/components/Account/hooks/infrastructure/templates/useTemplateItems";
import { useAccount } from "wagmi";
import { useRoleVerification } from "../../../hooks/useRoleVerification";

export const TemplateContractDetailView = ({
  templateContract,
  onBack,
  dict,
}: TemplateContractDetailViewProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { address } = useAccount();

  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${templateContract.transactionHash}`;

  const displayTitle = templateContract.title || dict?.unnamedTemplate;

  const {
    templateItems,
    loading: itemsLoading,
    error: itemsError,
    refetch,
    createTemplate,
    createLoading,
  } = useTemplateItems(templateContract.contractAddress, dict);

  const { verifyRole } = useRoleVerification(dict);

  const handleCreateTemplateClick = async () => {
    const isVerified = await verifyRole(
      "Supplier",
      templateContract.infraId,
      address || ""
    );
    if (isVerified) {
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateTemplate = async (formData: any) => {
    await createTemplate(formData);
    setIsCreateModalOpen(false);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-ama transition-colors font-herm"
        >
          <span className="text-sm">←</span>
          <span className="text-sm">{dict?.backToTemplateContracts}</span>
        </button>
      </div>

      <div className="bg-black rounded-sm border border-white p-4">
        <div className="mb-4">
          <h1 className="text-xl font-herm text-white mb-3">{displayTitle}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-ama font-herm">{dict?.contract}:</span>
              <p className="font-mono text-xs text-white break-all">
                {templateContract.contractAddress}
              </p>
            </div>
            <div>
              <span className="text-ama font-herm">{dict?.symbol}:</span>
              <p className="text-white font-herm">{templateContract.symbol}</p>
            </div>
            <div>
              <span className="text-ama font-herm">{dict?.type}:</span>
              <p className="text-white font-herm">
                {templateContract.childType}
              </p>
            </div>
            <div>
              <span className="text-ama font-herm">{dict?.scm}:</span>
              <p className="text-white font-herm">{templateContract.scm}</p>
            </div>
            <div>
              <span className="text-ama font-herm">{dict?.txHash}:</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-mar hover:text-ama text-xs break-all transition-colors underline flex"
              >
                {templateContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div>
              <span className="text-ama font-herm">{dict?.deployer}:</span>
              <p className="font-mono text-xs text-white break-all">
                {templateContract.deployer}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCreateTemplateClick}
            className="px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors flex items-center gap-2 text-sm"
          >
            {dict?.createTemplate}
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors flex items-center gap-2 text-sm"
          >
            {dict?.supplierProfile}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {itemsError && (
          <div className="bg-black border border-fresa rounded-sm p-4">
            <p className="text-fresa text-sm font-herm">
              {dict?.error}: {itemsError}
            </p>
            <button
              onClick={refetch}
              className="mt-2 text-fresa hover:text-ama text-xs underline font-herm"
            >
              {dict?.tryAgain}
            </button>
          </div>
        )}

        {itemsLoading ? (
          <div className="bg-black rounded-sm p-4 border border-white flex items-center justify-center">
            <div className="flex items-center gap-2 text-white font-herm text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
              <span>{dict?.loadingTemplateItems}</span>
            </div>
          </div>
        ) : templateItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templateItems.map((template) => (
              <LibraryCard
                key={template.templateId}
                data={template}
                dict={dict}
              />
            ))}
          </div>
        ) : (
          <div className="bg-black rounded-sm p-4 border border-white">
            <p className="text-ama text-center font-herm text-sm">
              {dict?.noTemplateItemsFound}
            </p>
          </div>
        )}
      </div>

      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTemplate}
        loading={createLoading}
        mode="template"
        dict={dict}
        infraId={templateContract.infraId}
      />

      <ProfileManager
        dict={dict}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contract={templateContract.supplierContract}
        infraId={templateContract.infraId}
        walletAddress={address || ""}
        profileType="Supplier"
      />
    </div>
  );
};
