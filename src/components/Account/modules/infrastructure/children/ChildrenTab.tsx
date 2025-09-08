import { ChildrenTabProps } from "../../../types";
import { useChildContracts } from "../../../hooks/infrastructure/children/useChildContracts";
import { useChildrenNavigation } from "../../../hooks/infrastructure/children/useChildrenNavigation";
import { DeployChildModal } from "./DeployChildModal";
import { ContractCard } from "../ContractCard";
import { ChildContractDetailView } from "./ChildContractDetailView";
import { useDeployChild } from "@/components/Account/hooks/infrastructure/children/useDeployChild";

export const ChildrenTab = ({
  infrastructure,
  isOwner,
  dict,
}: ChildrenTabProps) => {
  const {
    childContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useChildContracts(infrastructure.infraId, dict);

  const {
    isModalOpen,
    loading,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  } = useDeployChild(infrastructure, refetch);

  const { selectedChildContract, selectChildContract, clearSelection } =
    useChildrenNavigation();

  if (selectedChildContract) {
    return (
      <ChildContractDetailView
        childContract={selectedChildContract}
        infrastructure={infrastructure}
        onBack={clearSelection}
        dict={dict}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-herm text-white">{dict?.childContracts}</h3>
        {isOwner && (
          <button
            onClick={openModal}
            disabled={infrastructure.isActive == false || loading}
            className="px-3 py-2 bg-white hover:opacity-70 disabled:bg-ama disabled:text-black text-black text-sm font-herm rounded-sm transition-colors"
          >
            {dict?.deployChildContract}
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <div className="bg-black border border-ama rounded-sm p-4">
          <p className="text-ama text-sm font-herm">
            {dict?.infrastructureInactiveCannotDeployChildren}
          </p>
        </div>
      )}

      {contractsError && (
        <div className="bg-black border border-fresa rounded-sm p-4">
          <p className="text-fresa text-sm font-herm"> {contractsError}</p>
          <button
            onClick={refetch}
            className="mt-2 text-fresa hover:text-ama text-xs underline font-herm"
          >
            {dict?.tryAgain}
          </button>
        </div>
      )}

      {contractsLoading ? (
        <div className="flex items-center justify-center font-herm">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
            <span>{dict?.loadingChildContracts}</span>
          </div>
        </div>
      ) : childContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {childContracts.map((childContract) => (
            <ContractCard
              key={childContract.id}
              contract={childContract}
              onClick={selectChildContract}
              dict={dict}
            />
          ))}
        </div>
      ) : (
        <div className="p-6">
          <p className="text-ama text-xs text-center font-herm">
            {infrastructure.isActive
              ? dict?.noChildContractsDeployed
              : dict?.infrastructureInactiveActivateChildContracts}
          </p>
        </div>
      )}

      <DeployChildModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onCancel={cancelOperation}
        loading={loading}
        dict={dict}
      />
    </div>
  );
};
