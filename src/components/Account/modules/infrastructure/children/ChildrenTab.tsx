import { ChildrenTabProps } from "../../../types";
import { useChildContracts } from "../../../hooks/infrastructure/children/useChildContracts";
import { useChildrenNavigation } from "../../../hooks/infrastructure/children/useChildrenNavigation";
import { DeployChildModal } from "./DeployChildModal";
import { ContractCard } from "../ContractCard";
import { ChildContractDetailView } from "./ChildContractDetailView";
import { useDeployChild } from "@/components/Account/hooks/infrastructure/children/useDeployChild";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

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
        <h3 className="text-lg font-awk uppercase text-oro">
          {dict?.childContracts}
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
              <span className="relative z-10">{dict?.deployChildContract}</span>
            </div>
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <FancyBorder className="relative" type="diamond" color="oro">
          <div className="relative z-10 p-4">
            <p className="text-white text-sm font-chicago">
              {dict?.infrastructureInactiveCannotDeployChildren ||
                "infrastructure inactive, cannot deploy children"}
            </p>
          </div>
        </FancyBorder>
      )}

      {contractsError && (
        <FancyBorder className="relative" type="diamond" color="oro">
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
        <div className="relative">
          <div className="relative z-10 p-6 text-center">
            <p className="text-gris font-chicago text-sm">
              {infrastructure.isActive
                ? dict?.noChildContractsDeployed ||
                  "no child contracts deployed"
                : dict?.infrastructureInactiveActivateChildContracts ||
                  "infrastructure inactive, activate first"}
            </p>
          </div>
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
