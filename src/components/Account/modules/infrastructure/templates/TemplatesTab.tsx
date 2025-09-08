import { TemplatesTabProps } from "../../../types";
import { useDeployTemplate } from "../../../hooks/infrastructure/templates/useDeployTemplate";
import { DeployTemplateModal } from "./DeployTemplateModal";
import { ContractCard } from "../ContractCard";
import { TemplateContractDetailView } from "./TemplateContractDetailView";
import { useTemplatesNavigation } from "@/components/Account/hooks/infrastructure/templates/useTemplatesNavigation";
import { useTemplateContracts } from "@/components/Account/hooks/infrastructure/templates/useTemplateContracts";

export const TemplatesTab = ({
  infrastructure,
  isOwner,
  dict,
}: TemplatesTabProps) => {
  const {
    templateContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useTemplateContracts(infrastructure.infraId, dict);

  const {
    isModalOpen,
    loading,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  } = useDeployTemplate(infrastructure, refetch);

  const { selectedTemplateContract, selectTemplateContract, clearSelection } =
    useTemplatesNavigation();

  if (selectedTemplateContract) {
    return (
      <TemplateContractDetailView
        templateContract={selectedTemplateContract}
        onBack={clearSelection}
        dict={dict}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Template Contracts</h3>
        {isOwner && (
          <button
            onClick={openModal}
            disabled={infrastructure.isActive == false || loading}
            className="px-3 py-2 bg-white hover:opacity-70 disabled:bg-ama disabled:text-black text-black text-sm font-herm rounded-sm transition-colors"
          >
            Deploy Template Contract
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 text-sm">
            Infrastructure is inactive. Cannot deploy template contracts.
          </p>
        </div>
      )}

      {contractsError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm">{contractsError}</p>
          <button
            onClick={refetch}
            className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
          >
            Try again
          </button>
        </div>
      )}

      {contractsLoading ? (
        <div className="flex items-center justify-center font-herm">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
            <span>Loading template contracts...</span>
          </div>
        </div>
      ) : templateContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templateContracts.map((templateContract) => (
            <ContractCard
              key={templateContract.id}
              contract={templateContract}
              onClick={selectTemplateContract}
              dict={dict}
            />
          ))}
        </div>
      ) : (
        <div className="p-6">
          <p className="text-ama text-xs text-center font-herm">
            {infrastructure.isActive
              ? "No template contracts deployed yet. Deploy your first template contract to get started."
              : "Infrastructure is inactive. Activate infrastructure to deploy template contracts."}
          </p>
        </div>
      )}

      <DeployTemplateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        dict={dict}
        onCancel={cancelOperation}
        loading={loading}
      />
    </div>
  );
};
