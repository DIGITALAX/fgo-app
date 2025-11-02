"use client";

import { useInfrastructure } from "../../hooks/infrastructure/useInfrastructure";
import { InfrastructureCard } from "./InfrastructureCard";
import { CreateInfrastructureModal } from "./CreateInfrastructureModal";
import { InfrastructureDetailView } from "./InfrastructureDetailView";
import { useCreateInfrastructure } from "../../hooks/infrastructure/useCreateInfrastructure";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { useContext } from "react";
import { AppContext } from "@/lib/providers/Providers";

export const InfrastructureTab = ({ dict }: { dict: any }) => {
  const {
    loading,
    error,
    isConnected,
    handleInfrastructureClick,
    handleBackToList,
  } = useInfrastructure(dict);
  const context = useContext(AppContext);
  const {
    isModalOpen,
    loading: createLoading,
    paymentTokens,
    openModal,
    closeModal,
    handleSubmit,
    cancelOperation,
  } = useCreateInfrastructure(dict);

  if (!isConnected) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <FancyBorder className="relative" type="none" color="oro">
          <div className="relative z-10 p-8 text-center space-y-3">
            <h3 className="text-2xl font-awk uppercase text-oro">
              {dict?.connectYourWallet}
            </h3>
            <p className="text-gris font-chicago text-sm">
              {dict?.connectWalletViewInfrastructure}
            </p>
          </div>
        </FancyBorder>
      </div>
    );
  }

  if (context?.selectedInfrastructure) {
    return (
      <InfrastructureDetailView
        infrastructure={context?.selectedInfrastructure.infrastructure}
        isOwner={context?.selectedInfrastructure.isOwner}
        onBack={handleBackToList}
        dict={dict}
      />
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-awk uppercase text-oro">
          {dict?.infrastructure}
        </h2>
        <div
          onClick={openModal}
          className="relative cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
            <div className="absolute z-0 top-0 left-0 w-full h-full flex">
              <Image
                src={"/images/borderoro2.png"}
                draggable={false}
                objectFit="fill"
                fill
                alt="border"
              />
            </div>
            <span className="relative z-10">{dict?.createInfrastructure}</span>
          </div>
        </div>
      </div>

      {loading && (
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
      )}

      {error && (
        <FancyBorder className="relative" type="none" color="oro">
          <div className="relative z-10 p-4">
            <p className="text-fresa text-sm font-chicago">{error}</p>
          </div>
        </FancyBorder>
      )}

      {!loading && context?.fgoUser && (
        <div className="space-y-6">
          {context?.fgoUser.ownedInfrastructures.length > 0 && (
            <div>
              <h3 className="text-xl font-awk uppercase text-oro mb-4">
                {dict?.ownedInfrastructure}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {context?.fgoUser.ownedInfrastructures.map(
                  (infrastructure, index) => (
                    <InfrastructureCard
                      key={`owned-${infrastructure.infraId}-${index}`}
                      infrastructure={infrastructure}
                      isOwner={true}
                      onClick={handleInfrastructureClick}
                      dict={dict}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {context?.fgoUser.adminInfrastructures.length > 0 && (
            <div>
              <h3 className="text-xl font-awk uppercase text-oro mb-4">
                {dict?.adminInfrastructure}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {context?.fgoUser.adminInfrastructures.map((infrastructure, index) => (
                  <InfrastructureCard
                    key={`admin-${infrastructure.infraId}-${index}`}
                    infrastructure={infrastructure}
                    isOwner={false}
                    onClick={handleInfrastructureClick}
                    dict={dict}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateInfrastructureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onCancel={cancelOperation}
        loading={createLoading}
        paymentTokens={paymentTokens}
        dict={dict}
      />
    </div>
  );
};
