import { ParentsTabProps } from "../../../types";
import { DeployParentModal } from "./DeployParentModal";
import { ContractCard } from "../ContractCard";
import { ParentContractDetailView } from "./ParentContractDetailView";
import { useParentContracts } from "@/components/Account/hooks/infrastructure/parents/useParentContracts";
import { useDeployParent } from "@/components/Account/hooks/infrastructure/parents/useDeployParent";
import { useParentsNavigation } from "@/components/Account/hooks/infrastructure/parents/useParentsNavigation";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ParentsTab = ({
  infrastructure,
  isOwner,
  dict,
}: ParentsTabProps) => {
  const {
    parentContracts,
    loading: contractsLoading,
    error: contractsError,
    refetch,
  } = useParentContracts(infrastructure.infraId, dict);

  const {
    isModalOpen,
    loading,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  } = useDeployParent(infrastructure, refetch);

  const { selectedParentContract, selectParentContract, clearSelection } =
    useParentsNavigation();

  if (selectedParentContract) {
    return (
      <ParentContractDetailView
        parentContract={selectedParentContract}
        onBack={clearSelection}
        dict={dict}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-awk uppercase text-oro">
          {dict?.parentContracts}
        </h3>
        {isOwner && (
          <button
            onClick={openModal}
            disabled={infrastructure.isActive == false || loading}
            className="relative"
          >
            <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
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
                {dict?.deployParentContract}
              </span>
            </div>
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <FancyBorder className="relative" type="none" color="oro">
          <div className="relative z-10 p-4">
            <p className="text-white text-sm font-chicago">
              {dict?.infrastructureInactiveCannotDeploy ||
                "infrastructure inactive, cannot deploy"}
            </p>
          </div>
        </FancyBorder>
      )}

      {contractsError && (
        <FancyBorder className="relative" type="none" color="oro">
          <div className="relative z-10 p-4 space-y-3">
            <p className="text-fresa text-sm font-chicago">{contractsError}</p>
            <div
              onClick={refetch}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.tryAgain}</span>
              </div>
            </div>
          </div>
        </FancyBorder>
      )}

      {contractsLoading ? (
        <div className="w-full h-full flex items-center justify-center py-12">
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
      ) : parentContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parentContracts.map((parentContract) => (
            <ContractCard
              dict={dict}
              key={parentContract.id}
              contract={parentContract}
              onClick={selectParentContract}
            />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="relative z-10 p-6 text-center">
            <p className="text-gris font-chicago text-sm">
              {infrastructure.isActive
                ? dict?.noParentContractsDeployed ||
                  "no parent contracts deployed"
                : dict?.infrastructureInactiveActivateFirst ||
                  "infrastructure inactive, activate first"}
            </p>
          </div>
        </div>
      )}

      <DeployParentModal
        dict={dict}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onCancel={cancelOperation}
        loading={loading}
      />
    </div>
  );
};
