import { useState } from "react";
import { useCreateInfrastructureForm } from "../../hooks/infrastructure/useCreateInfrastructureForm";
import { CreateInfrastructureModalPropsExtended } from "../../types";


export const CreateInfrastructureModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  loading,
  paymentTokens,
}: CreateInfrastructureModalPropsExtended) => {
  const {
    formData,
    showCustomToken,
    fileInputRef,
    handleInputChange,
    handleImageChange,
    resetForm,
    isFormValid,
  } = useCreateInfrastructureForm(paymentTokens);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }
    
    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-herm text-white">
              Create Infrastructure
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
                Payment Token
              </label>
              <select
                name="paymentToken"
                value={showCustomToken ? "custom" : formData.paymentToken}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                disabled={loading}
              >
                {paymentTokens.map((token) => (
                  <option key={token.address} value={token.address} className="bg-black text-white">
                    {token.name} ({token.symbol})
                  </option>
                ))}
                <option value="custom" className="bg-black text-white">Custom ERC20 Token</option>
              </select>
              
              {showCustomToken && (
                <input
                  type="text"
                  name="paymentToken"
                  value={formData.paymentToken}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                  placeholder="0x..."
                  disabled={loading}
                />
              )}
              <div className="mt-2 text-xs text-ama font-herm space-y-1">
                <p>• <span className="font-herm text-white">Private infrastructure:</span> Any ERC20 token is suitable</p>
                <p>• <span className="font-herm text-white">Cross-designer collaboration:</span> MONA is the default compatible token across markets</p>
                <p>• You can input any custom ERC20 address above</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder="Infrastructure name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama resize-none font-herm"
                placeholder="Describe your infrastructure"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-herm text-ama mb-2">
                Image
              </label>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-xs file:bg-white file:text-black hover:file:opacity-70 font-herm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-white/10 hover:opacity-70 text-white font-herm rounded-sm transition-colors"
                disabled={false}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
