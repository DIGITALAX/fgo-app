import { useEffect } from "react";
import { useDeployChildForm } from "@/components/Account/hooks/infrastructure/children/useDeployChildForm";
import { DeployChildModalProps } from "../../../types";

export const DeployChildModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  loading,
  dict,
}: DeployChildModalProps) => {
  const {
    formData,
    handleInputChange,
    resetForm,
    isFormValid,
  } = useDeployChildForm();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel();
  };

  const handleClose = () => {
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-herm text-white">
              {dict?.deployChildContract}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-ama transition-colors font-herm"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.childType} *
              </label>
              <input
                type="number"
                name="childType"
                value={formData.childType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder={dict?.childTypeNumber}
                min="0"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.name} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder={dict?.contractName}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.symbol} *
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder={dict?.contractSymbol}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.scm} *
              </label>
              <input
                type="text"
                name="scm"
                value={formData.scm}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder={dict?.supplyChainModule}
                disabled={loading}
                required
              />
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-white/10 hover:opacity-70 text-white font-herm rounded-sm transition-colors"
                disabled={false}
              >
                {dict?.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                    {dict?.deploying}...
                  </>
                ) : (
                  dict?.deploy
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};