"use client";

import { useInfrastructure } from "../../hooks/infrastructure/useInfrastructure";
import { InfrastructureCard } from "./InfrastructureCard";
import { CreateInfrastructureModal } from "./CreateInfrastructureModal";
import { InfrastructureDetailView } from "./InfrastructureDetailView";
import { useCreateInfrastructure } from "../../hooks/infrastructure/useCreateInfrastructure";

export const InfrastructureTab = ({ dict }: { dict: any }) => {
  const {
    fgoUser,
    loading,
    error,
    isConnected,
    selectedInfrastructure,
    handleInfrastructureClick,
    handleBackToList,
  } = useInfrastructure(dict);

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
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-xl font-herm text-white mb-2">
              {dict?.connectYourWallet}
            </h3>
            <p className="text-white/60 font-herm">
              {dict?.connectWalletViewInfrastructure}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedInfrastructure) {
    return (
      <InfrastructureDetailView
        infrastructure={selectedInfrastructure.infrastructure}
        isOwner={selectedInfrastructure.isOwner}
        onBack={handleBackToList}
        dict={dict}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-herm text-white">
          {dict?.infrastructure}
        </h2>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors"
        >
          {dict?.createInfrastructure}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ama mx-auto mb-4"></div>
            <p className="text-white/60 font-herm">
              {dict?.loadingInfrastructure}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-fresa/10 border border-fresa/20 rounded-sm p-4 mb-6">
          <p className="text-fresa text-sm font-herm">{error}</p>
        </div>
      )}

      {!loading && fgoUser && (
        <div className="space-y-6">
          {fgoUser.ownedInfrastructures.length > 0 && (
            <div>
              <h3 className="text-lg font-herm text-ama mb-4">
                {dict?.ownedInfrastructure}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fgoUser.ownedInfrastructures.map((infrastructure, index) => (
                  <InfrastructureCard
                    key={`owned-${infrastructure.infraId}-${index}`}
                    infrastructure={infrastructure}
                    isOwner={true}
                    onClick={handleInfrastructureClick}
                    dict={dict}
                  />
                ))}
              </div>
            </div>
          )}

          {fgoUser.adminInfrastructures.length > 0 && (
            <div>
              <h3 className="text-lg font-herm text-ama mb-4">
                {dict?.adminInfrastructure}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fgoUser.adminInfrastructures.map((infrastructure, index) => (
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
