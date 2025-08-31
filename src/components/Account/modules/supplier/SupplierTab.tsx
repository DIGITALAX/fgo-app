import { useState } from "react";
import { useAccount } from "wagmi";
import { useContractsBySupplier } from "../../hooks/supplier/useContractsBySupplier";
import { ContractCard } from "../infrastructure/ContractCard";
import { ChildContract, TemplateContract } from "../../types";
import { ChildContractDetailView } from "../infrastructure/children/ChildContractDetailView";
import { TemplateContractDetailView } from "../infrastructure/templates/TemplateContractDetailView";

type SupplierContractTab = "children" | "templates";

export const SupplierTab = () => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<SupplierContractTab>("children");
  const [selectedChildContract, setSelectedChildContract] = useState<ChildContract | null>(null);
  const [selectedTemplateContract, setSelectedTemplateContract] = useState<TemplateContract | null>(null);

  const {
    childContracts,
    templateContracts,
    loading,
    error,
    refetch,
  } = useContractsBySupplier(address || "");

  if (selectedChildContract) {
    return (
      <ChildContractDetailView
        childContract={selectedChildContract}
        infrastructure={{ infraId: selectedChildContract.infraId }}
        onBack={() => setSelectedChildContract(null)}
      />
    );
  }

  if (selectedTemplateContract) {
    return (
      <TemplateContractDetailView
        templateContract={selectedTemplateContract}
        onBack={() => setSelectedTemplateContract(null)}
      />
    );
  }

  const currentContracts = activeTab === "children" ? childContracts : templateContracts;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-herm text-white mb-1">Supplier Dashboard</h2>
          <p className="text-white/60 font-herm text-sm">
            Manage child and template contracts
          </p>
        </div>
        <div className="text-sm text-white/60 font-herm">
          {childContracts.length + templateContracts.length} total contract{(childContracts.length + templateContracts.length) !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex gap-1 bg-black border border-white rounded-sm p-1 w-fit">
        <button
          onClick={() => setActiveTab("children")}
          className={`px-4 py-2 rounded-sm text-sm font-herm transition-colors ${
            activeTab === "children"
              ? "bg-ama text-black"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          Child Contracts ({childContracts.length})
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-sm text-sm font-herm transition-colors ${
            activeTab === "templates"
              ? "bg-ama text-black"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          Template Contracts ({templateContracts.length})
        </button>
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
            <span>Loading {activeTab} contracts...</span>
          </div>
        </div>
      ) : currentContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentContracts.map((contract) => (
            <ContractCard
              key={contract.contractAddress}
              contract={contract}
              onClick={(contractData: ChildContract | TemplateContract) => {
                if (activeTab === "children") {
                  setSelectedChildContract(contractData as ChildContract);
                } else {
                  setSelectedTemplateContract(contractData as TemplateContract);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-black border border-white rounded-sm p-6 text-center">
          <div className="mb-4">
            <span className="text-4xl">{activeTab === "children" ? "🧩" : "📋"}</span>
          </div>
          <h3 className="text-lg font-herm text-white mb-2">
            No {activeTab === "children" ? "Child" : "Template"} Contracts Found
          </h3>
          <p className="text-white/60 mb-4 font-herm text-sm">
            You don't have access to any {activeTab} contracts yet.
          </p>
          <p className="text-xs text-white/40 font-herm">
            Contact an infrastructure owner to get supplier access to {activeTab} contracts.
          </p>
        </div>
      )}
    </div>
  );
};