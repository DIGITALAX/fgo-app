import { getCurrentNetwork } from "@/constants";
import { useChildItems } from "../../../hooks/infrastructure/children/useChildItems";
import { useRoleVerification } from "../../../hooks/useRoleVerification";
import { LibraryCard } from "@/components/Library/modules/LibraryCard";
import { CreateItemModal } from "../../infrastructure/CreateItemModal";
import { ProfileManager } from "../../ProfileManager";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ChildContractDetailViewProps } from "@/components/Account/types";

export const ChildContractDetailView = ({
  childContract,
  infrastructure,
  onBack,
}: ChildContractDetailViewProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { address } = useAccount();

  const network = getCurrentNetwork();
  const explorerUrl = `${network.blockExplorer}/tx/${childContract.transactionHash}`;

  const displayTitle = childContract.title || "Unnamed Child";

  const {
    childItems,
    loading: itemsLoading,
    error: itemsError,
    refetch,
    createChild,
    createLoading,
  } = useChildItems(childContract.contractAddress, infrastructure);

  const { verifyRole } = useRoleVerification();

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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-ama transition-colors font-herm"
        >
          <span className="text-sm">←</span>
          <span className="text-sm">Back to Child Contracts</span>
        </button>
      </div>

      <div className="bg-black rounded-sm border border-white p-4">
        <div className="mb-4">
          <h1 className="text-xl font-herm text-white mb-3">{displayTitle}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-ama font-herm">Contract:</span>
              <p className="font-mono text-xs text-white break-all">
                {childContract.contractAddress}
              </p>
            </div>
            <div>
              <span className="text-ama font-herm">Symbol:</span>
              <p className="text-white font-herm">{childContract.symbol}</p>
            </div>
            <div>
              <span className="text-ama font-herm">Type:</span>
              <p className="text-white font-herm">{childContract.childType}</p>
            </div>
            <div>
              <span className="text-ama font-herm">SCM:</span>
              <p className="text-white font-herm">{childContract.scm}</p>
            </div>
            <div>
              <span className="text-ama font-herm">TX Hash:</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-mar hover:text-ama text-xs break-all transition-colors underline flex"
              >
                {childContract.transactionHash.substring(0, 15) + "..."}
              </a>
            </div>
            <div>
              <span className="text-ama font-herm">Deployer:</span>
              <p className="font-mono text-xs text-white break-all">
                {childContract.deployer}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleCreateChildClick()}
            className="px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors flex items-center gap-2 text-sm"
          >
            Create Child
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors flex items-center gap-2 text-sm"
          >
            Supplier Profile
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
              <span>Loading child items...</span>
            </div>
          </div>
        ) : childItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {childItems.map((child) => (
              <LibraryCard key={child.childId} data={child} />
            ))}
          </div>
        ) : (
          <div className="bg-black rounded-sm p-4 border border-white">
            <p className="text-ama text-center font-herm text-sm">
              No child items found in this contract.
            </p>
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
      />

      <ProfileManager
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        contract={childContract.supplierContract}
        infraId={childContract.infraId}
        walletAddress={address || ""}
        profileType="Supplier"
      />
    </div>
  );
};
