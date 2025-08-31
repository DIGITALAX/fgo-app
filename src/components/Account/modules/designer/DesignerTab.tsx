import { useState } from "react";
import { useAccount } from "wagmi";
import { ContractCard } from "../infrastructure/ContractCard";
import { ParentContract } from "../../types";
import { useParentContractsByDesigner } from "../../hooks/designer/useParentContractsByDesigner";
import { ParentContractDetailView } from "../infrastructure/parents/ParentContractDetailView";

export const DesignerTab = () => {
  const { address } = useAccount();
  const [selectedContract, setSelectedContract] = useState<ParentContract | null>(null);

  const {
    parentContracts,
    loading,
    error,
    refetch,
  } = useParentContractsByDesigner(address || "");

  if (selectedContract) {
    return (
      <ParentContractDetailView
        parentContract={selectedContract}
        onBack={() => setSelectedContract(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-herm text-white mb-1">Designer Dashboard</h2>
          <p className="text-white/60 font-herm text-sm">
            Manage parent contracts and create designs
          </p>
        </div>
        <div className="text-sm text-white/60 font-herm">
          {parentContracts.length} contract{parentContracts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {error && (
        <div className="bg-black border border-fresa rounded-sm p-4">
          <p className="text-fresa text-sm font-herm">❌ {error}</p>
          <button
            onClick={refetch}
            className="mt-2 text-fresa hover:text-ama text-xs underline font-herm"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center font-herm p-8">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
            <span>Loading parent contracts...</span>
          </div>
        </div>
      ) : parentContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parentContracts.map((contract) => (
            <ContractCard
              key={contract.contractAddress}
              contract={contract}
              onClick={(contractData: ParentContract) => setSelectedContract(contractData)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-black border border-white rounded-sm p-6 text-center">
          <div className="mb-4">
            <span className="text-4xl">🎨</span>
          </div>
          <h3 className="text-lg font-herm text-white mb-2">No Parent Contracts Found</h3>
          <p className="text-white/60 mb-4 font-herm text-sm">
            You don't have access to any parent contracts yet. 
          </p>
          <p className="text-xs text-white/40 font-herm">
            Contact an infrastructure owner to get designer access to parent contracts.
          </p>
        </div>
      )}
    </div>
  );
};