import { getCurrentNetwork } from "@/constants";
import { useChildItems } from "../../../hooks/infrastructure/children/useChildItems";
import { useRoleVerification } from "../../../hooks/useRoleVerification";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import { CreateItemModal } from "../../infrastructure/CreateItemModal";
import { ProfileManager } from "../../ProfileManager";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ChildContractDetailViewProps } from "@/components/Account/types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ChildContractDetailView = ({
  childContract,
  infrastructure,
  onBack,
  dict,
}: ChildContractDetailViewProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { address } = useAccount();

  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${childContract.transactionHash}`;

  const displayTitle = childContract.title || dict?.unnamedChild;

  const {
    childItems,
    loading: itemsLoading,
    error: itemsError,
    refetch,
    createChild,
    createLoading,
  } = useChildItems(childContract.contractAddress, infrastructure, dict);

  const { verifyRole } = useRoleVerification(dict);

  const handleCreateChildClick = async () => {
    const isVerified = await verifyRole(
      "Supplier",
      childContract.infraId,
      address || ""
    );

    if (isVerified) {
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateChild = async (formData: any) => {
    await createChild(formData);
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
            <span className="relative z-10">{dict?.backToChildContracts}</span>
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
              <p className="font-pixel text-xs text-verde break-all">
                {childContract.contractAddress}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.symbol}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {childContract.symbol}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.type}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {childContract.childType}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.scm}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {childContract.scm}
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
                {childContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.deployer}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {childContract.deployer}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleCreateChildClick()}
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
                <span className="relative z-10">{dict?.createChild}</span>
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
        ) : childItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {childItems.map((child) => (
              <LibraryCard key={child.childId} data={child} dict={dict} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="relative z-10 p-4 text-center">
              <p className="text-gris font-chicago text-sm">
                {dict?.noChildItemsFound}
              </p>
            </div>
          </div>
        )}
      </div>

      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChild}
        loading={createLoading}
        mode="child"
        infraId={childContract.infraId}
        dict={dict}
      />

      <ProfileManager
        isOpen={isProfileModalOpen}
        dict={dict}
        onClose={() => setIsProfileModalOpen(false)}
        contract={childContract.supplierContract}
        infraId={childContract.infraId}
        walletAddress={address || ""}
        profileType="Supplier"
      />
    </div>
  );
};
