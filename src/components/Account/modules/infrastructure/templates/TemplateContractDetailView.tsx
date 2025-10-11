import { TemplateContractDetailViewProps } from "../../../types";
import { getCurrentNetwork } from "@/constants";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import { CreateItemModal } from "../CreateItemModal";
import { ProfileManager } from "../../ProfileManager";
import { useState } from "react";
import { useTemplateItems } from "@/components/Account/hooks/infrastructure/templates/useTemplateItems";
import { useAccount } from "wagmi";
import { useRoleVerification } from "../../../hooks/useRoleVerification";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

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
        <div
          onClick={onBack}
          className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
        >
          <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro items-center gap-2">
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span className="relative z-10 text-sm">←</span>
            <span className="relative z-10">
              {dict?.backToTemplateContracts}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h1 className="text-2xl font-awk uppercase text-oro mb-3">
            {displayTitle}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.contract}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {templateContract.contractAddress}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.symbol}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {templateContract.symbol}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.type}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {templateContract.childType}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.scm}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {templateContract.scm}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.txHash}:
              </span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-oro hover:text-white text-xs break-all transition-colors underline flex"
              >
                {templateContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.deployer}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {templateContract.deployer}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleCreateTemplateClick} className="relative">
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.createTemplate}</span>
              </div>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="relative"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.supplierProfile}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {itemsError && (
          <div className="relative">
            <div className="relative z-10 p-4 space-y-3">
              <p className="text-fresa text-sm font-chicago">
                {dict?.error}: {itemsError}
              </p>
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
          </div>
        )}

        {itemsLoading ? (
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
          <div className="relative">
            <div className="relative z-10 p-4 text-center">
              <p className="text-gris font-chicago text-sm">
                {dict?.noTemplateItemsFound}
              </p>
            </div>
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
