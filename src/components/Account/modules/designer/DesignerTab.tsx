"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ContractCard } from "../infrastructure/ContractCard";
import { ParentContract } from "../../types";
import { useParentContractsByDesigner } from "../../hooks/designer/useParentContractsByDesigner";
import { ParentContractDetailView } from "../infrastructure/parents/ParentContractDetailView";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const DesignerTab = ({ dict }: { dict: any }) => {
  const { address } = useAccount();
  const [selectedContract, setSelectedContract] =
    useState<ParentContract | null>(null);

  const { parentContracts, loading, error, refetch } =
    useParentContractsByDesigner(address || "", dict);

  if (selectedContract) {
    return (
      <ParentContractDetailView
        parentContract={selectedContract}
        onBack={() => setSelectedContract(null)}
        dict={dict}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-awk uppercase text-oro">
            {dict?.designerDashboard}
          </h2>
          <p className="text-gris font-chicago text-sm mt-2">
            {dict?.manageParentContracts}
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
            {parentContracts.length}{" "}
            {parentContracts.length === 1 ? dict?.contract : dict?.contracts}
          </span>
        </div>
      </div>

      {error && (
        <FancyBorder type="diamond" color="oro" className="relative">
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
      ) : parentContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parentContracts.map((contract) => (
            <ContractCard
              key={contract.contractAddress}
              contract={contract}
              onClick={(contractData: ParentContract) =>
                setSelectedContract(contractData)
              }
              dict={dict}
            />
          ))}
        </div>
      ) : (
        <FancyBorder type="diamond" color="oro" className="relative">
          <div className="relative z-10 p-8 text-center space-y-3">
            <h3 className="text-2xl font-awk uppercase text-oro">
              {dict?.noParentContractsFound}
            </h3>
            <p className="text-gris font-chicago text-sm">
              {dict?.noParentContractsAccess}
            </p>
            <p className="text-xs text-gris font-chicago">
              {dict?.contactInfrastructureOwnerParent}
            </p>
          </div>
        </FancyBorder>
      )}
    </div>
  );
};
