import { ParentContractDetailViewProps } from "../../../types";
import { ProfileManager } from "../../ProfileManager";
import { INFURA_GATEWAY } from "@/constants";
import { ParentItemCard } from "./ParentItemCard";
import { getCurrentNetwork } from "@/constants";
import { CreateItemModal } from "../CreateItemModal";
import { useCreateParent } from "../../../hooks/infrastructure/parents/useCreateParent";
import { useRoleVerification } from "../../../hooks/useRoleVerification";
import { useState } from "react";
import { useParentItems } from "@/components/Account/hooks/infrastructure/parents/useParentItems";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export const ParentContractDetailView = ({
  parentContract,
  onBack,
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
    "Unnamed Parent";
  const displayDescription = parentContract.parentMetadata?.description || "";

  const {
    parentItems,
    loading: itemsLoading,
    error: itemsError,
    refetch,
  } = useParentItems(parentContract.contractAddress);

  const { createParent, loading: createLoading } = useCreateParent(
    parentContract.contractAddress
  );

  const { verifyRole } = useRoleVerification();

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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-ama transition-colors font-herm"
        >
          <span className="text-sm">←</span>
          <span className="text-sm">Back to Parent Contracts</span>
        </button>
      </div>

      <div className="bg-black rounded-sm border border-white p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-herm text-white mb-3">
              {displayTitle}
            </h1>
            {displayDescription && (
              <p className="text-white mb-3 font-herm text-sm">
                {displayDescription}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-ama font-herm">Contract:</span>
                <p className="font-mono text-xs text-white break-all">
                  {parentContract.contractAddress}
                </p>
              </div>
              <div>
                <span className="text-ama font-herm">Symbol:</span>
                <p className="text-white font-herm">{parentContract.symbol}</p>
              </div>
              <div>
                <span className="text-ama font-herm">SCM:</span>
                <p className="text-white font-herm">{parentContract.scm}</p>
              </div>
              <div>
                <span className="text-ama font-herm">TX Hash:</span>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-mar hover:text-ama text-xs break-all transition-colors underline flex"
                >
                  {parentContract.transactionHash.substring(0, 15) + "..."}
                </a>
              </div>
              <div>
                <span className="text-ama font-herm">Deployer:</span>
                <p className="font-mono text-xs text-white break-all">
                  {parentContract.deployer}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCreateParentClick}
            className="px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors flex items-center gap-2 text-sm"
          >
            Create Parent
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors flex items-center gap-2 text-sm"
          >
            Designer Profile
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {itemsError && (
          <div className="bg-black border border-fresa rounded-sm p-4">
            <p className="text-fresa text-sm font-herm">Error: {itemsError}</p>
            <button
              onClick={refetch}
              className="mt-2 text-fresa hover:text-ama text-xs underline font-herm"
            >
              Try again
            </button>
          </div>
        )}

        {itemsLoading ? (
          <div className="bg-black rounded-sm p-4 border border-white flex items-center justify-center">
            <div className="flex items-center gap-2 text-white font-herm text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
              <span>Loading parent items...</span>
            </div>
          </div>
        ) : parentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parentItems.map((parent) => (
              <ParentItemCard
                key={parent.designId}
                parent={parent}
                onClick={handleParentClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-black rounded-sm p-4 border border-white">
            <p className="text-ama text-center font-herm text-sm">
              No parent items found in this contract.
            </p>
          </div>
        )}
      </div>

      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateParent}
        loading={createLoading}
        mode="parent"
        infraId={parentContract.infraId}
      />

      <ProfileManager
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
