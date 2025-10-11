"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useContractsBySupplier } from "../../hooks/supplier/useContractsBySupplier";
import { ContractCard } from "../infrastructure/ContractCard";
import { ChildContract, TemplateContract } from "../../types";
import { ChildContractDetailView } from "../infrastructure/children/ChildContractDetailView";
import { TemplateContractDetailView } from "../infrastructure/templates/TemplateContractDetailView";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

type SupplierContractTab = "children" | "templates";

export const SupplierTab = ({ dict }: { dict: any }) => {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<SupplierContractTab>("children");
  const [selectedChildContract, setSelectedChildContract] =
    useState<ChildContract | null>(null);
  const [selectedTemplateContract, setSelectedTemplateContract] =
    useState<TemplateContract | null>(null);

  const { childContracts, templateContracts, loading, error, refetch } =
    useContractsBySupplier(address || "", dict);

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

  const currentContracts =
    activeTab === "children" ? childContracts : templateContracts;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-awk uppercase text-oro">
            {dict?.supplierDashboard}
          </h2>
          <p className="text-gris font-chicago text-sm mt-2">
            {dict?.manageChildTemplateContracts}
          </p>
        </div>
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
          <span className="relative z-10">
            {childContracts.length + templateContracts.length}{" "}
            {childContracts.length + templateContracts.length === 1
              ? dict?.totalContract
              : dict?.totalContracts}
          </span>
        </div>
      </div>

      <div className="flex gap-3 w-fit">
        <div
          onClick={() => setActiveTab("children")}
          className="relative cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="text-xs font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span
              className={`relative z-10 ${
                activeTab === "children" ? "text-oro" : "text-gris"
              }`}
            >
              {dict?.childContracts} ({childContracts.length})
            </span>
          </div>
        </div>
        <div
          onClick={() => setActiveTab("templates")}
          className="relative cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="text-xs font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span
              className={`relative z-10 ${
                activeTab === "templates" ? "text-oro" : "text-gris"
              }`}
            >
              {dict?.templateContracts} ({templateContracts.length})
            </span>
          </div>
        </div>
      </div>

      {error && (
        <FancyBorder className="relative" type="diamond" color="oro">
          <div className="relative z-10 p-4 space-y-3">
            <p className="text-fresa text-sm font-chicago">{error}</p>
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

      {loading ? (
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
        <FancyBorder className="relative" type="diamond" color="oro">
          <div className="relative z-10 p-8 text-center space-y-3">
            <h3 className="text-2xl font-awk uppercase text-oro">
              {activeTab === "children"
                ? dict?.noChildContractsFound
                : dict?.noTemplateContractsFound}
            </h3>
            <p className="text-gris font-chicago text-sm">
              {activeTab === "children"
                ? dict?.noChildContractsAccess
                : dict?.noTemplateContractsAccess}
            </p>
            <p className="text-xs text-gris font-chicago">
              {activeTab === "children"
                ? dict?.contactInfrastructureOwnerChild
                : dict?.contactInfrastructureOwnerTemplate}
            </p>
          </div>
        </FancyBorder>
      )}
    </div>
  );
};
