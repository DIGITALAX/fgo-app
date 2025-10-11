import { ParentContractDetailViewProps } from "../../../types";
import { ProfileManager } from "../../ProfileManager";
import { ParentItemCard } from "./ParentItemCard";
import { getCurrentNetwork } from "@/constants";
import { CreateItemModal } from "../CreateItemModal";
import { useCreateParent } from "../../../hooks/infrastructure/parents/useCreateParent";
import { useRoleVerification } from "../../../hooks/useRoleVerification";
import { useState } from "react";
import { useParentItems } from "@/components/Account/hooks/infrastructure/parents/useParentItems";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const ParentContractDetailView = ({
  parentContract,
  onBack,
  dict,
}: ParentContractDetailViewProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${parentContract.transactionHash}`;

  const displayTitle =
    parentContract.parentMetadata?.title ||
    parentContract.title ||
    dict?.unnamedParent;
  const displayDescription = parentContract.parentMetadata?.description || "";

  const {
    parentItems,
    loading: itemsLoading,
    error: itemsError,
    refetch,
  } = useParentItems(parentContract.contractAddress, dict);

  const { createParent, loading: createLoading } = useCreateParent(
    parentContract.contractAddress,
    dict
  );

  const { verifyRole } = useRoleVerification(dict);

  const handleCreateParentClick = async () => {
    const isVerified = await verifyRole(
      "Designer",
      parentContract.infraId,
      address || ""
    );
    if (isVerified) {
      setIsCreateModalOpen(true);
    }
  };

  const handleCreateParent = async (formData: any) => {
    await createParent(formData);
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleParentClick = (parent: any) => {
    router.push(
      `/library/parent/${parentContract.contractAddress}/${parent.designId}`
    );
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
            <span className="relative z-10">{dict?.backToParentContracts}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative z-10 p-4 space-y-4">
          <h1 className="text-2xl font-awk uppercase text-oro mb-3">
            {displayTitle}
          </h1>
          {displayDescription && (
            <p className="text-gris font-chicago text-sm mb-3">
              {displayDescription}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.contract}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {parentContract.contractAddress}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.symbol}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {parentContract.symbol}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.scm}:
              </span>
              <p className="text-gris font-chicago text-sm">
                {parentContract.scm}
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
                {parentContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div className="space-y-1">
              <span className="font-awk uppercase text-gris text-xs">
                {dict?.deployer}:
              </span>
              <p className="font-pixel text-xs text-oro break-all">
                {parentContract.deployer}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleCreateParentClick} className="relative">
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
                <span className="relative z-10">{dict?.createParent}</span>
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
                <span className="relative z-10">{dict?.designerProfile}</span>
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
        ) : parentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parentItems.map((parent) => (
              <ParentItemCard
                key={parent.designId}
                parent={parent}
                onClick={handleParentClick}
                dict={dict}
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="relative z-10 p-4 text-center">
              <p className="text-gris font-chicago text-sm">
                {dict?.noParentItemsFound}
              </p>
            </div>
          </div>
        )}
      </div>

      <CreateItemModal
        dict={dict}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateParent}
        loading={createLoading}
        mode="parent"
        infraId={parentContract.infraId}
      />

      <ProfileManager
        dict={dict}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contract={parentContract.designerContract}
        infraId={parentContract.infraId}
        walletAddress={address || ""}
        profileType="Designer"
      />
    </div>
  );
};
