import { useEffect } from "react";
import { useDeployMarketForm } from "@/components/Account/hooks/infrastructure/markets/useDeployMarketForm";
import { DeployMarketModalProps } from "../../../types";

export const DeployMarketModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  loading,
  dict,
}: DeployMarketModalProps) => {
  const {
    formData,
    fileInputRef,
    handleImageChange,
    handleInputChange,
    resetForm,
    isFormValid,
  } = useDeployMarketForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleCancel = () => {
    onCancel();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-herm text-white">
              {dict?.deployMarketContract}
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
                {dict?.contractName} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder={dict?.enterContractName}
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
                placeholder={dict?.marketSymbolPlaceholder}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.title} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder={dict?.enterMarketTitle}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.description} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama resize-none font-herm"
                placeholder={dict?.enterMarketDescription}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                {dict?.image}
              </label>
              <div className="space-y-2">
                {formData.image && (
                  <div className="text-xs text-white font-herm p-2 bg-black border border-white rounded-sm">
                    {dict?.selected}: {formData.image.name}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:bg-white file:text-black hover:file:opacity-70 font-herm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors"
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
