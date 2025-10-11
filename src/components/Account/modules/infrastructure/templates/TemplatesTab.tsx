import { TemplatesTabProps } from "../../../types";
import { useDeployTemplate } from "../../../hooks/infrastructure/templates/useDeployTemplate";
import { DeployTemplateModal } from "./DeployTemplateModal";
import { ContractCard } from "../ContractCard";
import { TemplateContractDetailView } from "./TemplateContractDetailView";
import { useTemplatesNavigation } from "@/components/Account/hooks/infrastructure/templates/useTemplatesNavigation";
import { useTemplateContracts } from "@/components/Account/hooks/infrastructure/templates/useTemplateContracts";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

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
        <h3 className="text-lg font-awk uppercase text-oro">
          template contracts
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
              <span className="relative z-10">deploy template contract</span>
            </div>
          </button>
        )}
      </div>

      {infrastructure.isActive == false && (
        <FancyBorder className="relative" type="diamond" color="oro">
          <div className="relative z-10 p-4">
            <p className="text-white text-sm font-chicago">
              infrastructure is inactive. cannot deploy template contracts.
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
                <span className="relative z-10">try again</span>
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
        <div className="relative">
          <div className="relative z-10 p-6 text-center">
            <p className="text-gris font-chicago text-sm">
              {infrastructure.isActive
                ? "no template contracts deployed yet. deploy your first template contract to get started."
                : "infrastructure is inactive. activate infrastructure to deploy template contracts."}
            </p>
          </div>
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
