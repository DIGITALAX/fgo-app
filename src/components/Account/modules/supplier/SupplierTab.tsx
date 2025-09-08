"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useContractsBySupplier } from "../../hooks/supplier/useContractsBySupplier";
import { ContractCard } from "../infrastructure/ContractCard";
import { ChildContract, TemplateContract } from "../../types";
import { ChildContractDetailView } from "../infrastructure/children/ChildContractDetailView";
import { TemplateContractDetailView } from "../infrastructure/templates/TemplateContractDetailView";

type SupplierContractTab = "children" | "templates";

export const SupplierTab = ({ dict }: { dict: any }) => {
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
  } = useContractsBySupplier(address || "", dict);

  if (selectedChildContract) {
    return (
      <ChildContractDetailView
        childContract={selectedChildContract}
        infrastructure={{ infraId: selectedChildContract.infraId }}
        onBack={() => setSelectedChildContract(null)}
        dict={dict}
      />
    );
  }

  if (selectedTemplateContract) {
    return (
      <TemplateContractDetailView
        templateContract={selectedTemplateContract}
        onBack={() => setSelectedTemplateContract(null)}
        dict={dict}
      />
    );
  }

  const currentContracts = activeTab === "children" ? childContracts : templateContracts;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-herm text-white mb-1">{dict?.supplierDashboard}</h2>
          <p className="text-white/60 font-herm text-sm">
            {dict?.manageChildTemplateContracts}
          </p>
        </div>
        <div className="text-sm text-white/60 font-herm">
          {childContracts.length + templateContracts.length} {(childContracts.length + templateContracts.length) === 1 ? dict?.totalContract : dict?.totalContracts}
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
          {dict?.childContracts} ({childContracts.length})
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-sm text-sm font-herm transition-colors ${
            activeTab === "templates"
              ? "bg-ama text-black"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {dict?.templateContracts} ({templateContracts.length})
        </button>
      </div>

      {error && (
        <div className="bg-black border border-fresa rounded-sm p-4">
          <p className="text-fresa text-sm font-herm"> {error}</p>
          <button
            onClick={refetch}
            className="mt-2 text-fresa hover:text-ama text-xs underline font-herm"
          >
            {dict?.tryAgain}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center font-herm p-8">
          <div className="flex items-center gap-2 text-white text-xs">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mar"></div>
            <span>{activeTab === 'children' ? dict?.loadingChildContracts : dict?.loadingTemplateContracts}</span>
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
              dict={dict}
            />
          ))}
        </div>
      ) : (
        <div className="bg-black border border-white rounded-sm p-6 text-center">
          <h3 className="text-lg font-herm text-white mb-2">
            {activeTab === 'children' ? dict?.noChildContractsFound : dict?.noTemplateContractsFound}
          </h3>
          <p className="text-white/60 mb-4 font-herm text-sm">
            {activeTab === 'children' ? dict?.noChildContractsAccess : dict?.noTemplateContractsAccess}
          </p>
          <p className="text-xs text-white/40 font-herm">
            {activeTab === 'children' ? dict?.contactInfrastructureOwnerChild : dict?.contactInfrastructureOwnerTemplate}
          </p>
        </div>
      )}
    </div>
  );
};