import { useEffect } from "react";
import { useDeployParentForm } from "@/components/Account/hooks/infrastructure/parents/useDeployParentForm";
import { DeployParentModalProps } from "../../../types";

export const DeployParentModal = ({ isOpen, onClose, onSubmit, onCancel, loading }: DeployParentModalProps) => {
  const {
    formData,
    fileInputRef,
    handleImageChange,
    handleInputChange,
    resetForm,
    isFormValid,
  } = useDeployParentForm();

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
      <div className="bg-black rounded-sm border border-white max-w-md w-full max-h-[85vh] overflow-y-auto text-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-herm text-white">
              Deploy Parent Contract
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
              <label className="block text-xs font-herm text-ama mb-2">
                Contract Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder="Enter contract name"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-2">
                Symbol *
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder="e.g., PRNT"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-2">
                SCM *
              </label>
              <input
                type="text"
                name="scm"
                value={formData.scm}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder="Enter SCM"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                placeholder="Enter parent title"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama resize-none font-herm"
                placeholder="Enter parent description"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-2">
                Image
              </label>
              <div className="space-y-2">
                {formData.image && (
                  <div className="text-xs text-white font-herm p-2 bg-black border border-white rounded-sm">
                    Selected: {formData.image.name}
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
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                    Deploying...
                  </>
                ) : (
                  "Deploy"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};