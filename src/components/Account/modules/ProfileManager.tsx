import { useEffect } from "react";
import { ProfileManagerProps } from "../types";
import { useProfileManager } from "../hooks/useProfileManager";
import { getIPFSUrl } from "@/lib/helpers/ipfs";

export const ProfileManager = ({
  isOpen,
  onClose,
  contract,
  infraId,
  walletAddress,
  profileType,
}: ProfileManagerProps) => {
  
  const {
    formData,
    existingProfile,
    loading,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    resetForm,
    checkExistingProfile,
    cancelOperation
  } = useProfileManager({
    contract,
    infraId,
    walletAddress,
    profileType,
  });

  const handleModalOpen = async () => {
    const isValid = await checkExistingProfile(true);
    if (!isValid) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleModalOpen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData, handleClose);
  };

  const handleCancel = () => {
    cancelOperation();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-sm border border-white w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-3 border-b border-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-herm text-white">
              {existingProfile ? `Update ${profileType}` : `Create ${profileType}`}
            </h2>
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors font-herm text-sm"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleFormSubmit} className="p-3 space-y-3">
            <div>
              <label className="block text-xs font-herm text-ama mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-2 py-1.5 bg-black/20 border border-white/30 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-ama focus:border-ama font-herm text-sm"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-2 py-1.5 bg-black/20 border border-white/30 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-ama focus:border-ama resize-none font-herm text-sm"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-herm text-ama mb-1">
                Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-2 py-1.5 bg-black/20 border border-white/30 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-ama focus:border-ama font-herm text-sm"
                placeholder="https://..."
                disabled={loading}
              />
            </div>

            {profileType === "Fulfiller" && (
              <>
                <div>
                  <label className="block text-xs font-herm text-ama mb-1">
                    Base Price *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice || ""}
                    onChange={handleInputChange}
                    min="0"
                    step="0.001"
                    className="w-full px-2 py-1.5 bg-black/20 border border-white/30 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-ama focus:border-ama font-herm text-sm"
                    placeholder="0.01"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-herm text-ama mb-1">
                    VIG Percentage (0-100) *
                  </label>
                  <input
                    type="number"
                    name="vigBasisPoints"
                    value={formData.vigBasisPoints || ""}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-2 py-2 bg-black/20 border border-white/30 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-ama focus:border-ama font-herm text-sm"
                    placeholder="5"
                    disabled={loading}
                    required
                  />
                  <p className="text-xs text-white/60 mt-1 font-herm">
                    e.g., 5 = 5%
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-herm text-ama mb-1">
                Image *
              </label>
              {existingProfile?.metadata?.image && !formData.image && (
                <div className="mb-2 p-2 bg-black/20 border border-white/30 rounded-sm">
                  <div className="flex items-center gap-2">
                    <img 
                      src={getIPFSUrl(existingProfile.metadata.image)} 
                      alt="Current" 
                      className="w-6 h-6 object-cover rounded-sm"
                    />
                    <div className="text-xs">
                      <p className="text-white font-herm">Current</p>
                    </div>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-2 py-1.5 bg-black/20 border border-white/30 rounded-sm text-white focus:outline-none focus:ring-1 focus:ring-ama focus:border-ama file:mr-2 file:py-0.5 file:px-1.5 file:rounded-sm file:border-0 file:bg-white file:text-black file:cursor-pointer hover:file:opacity-70 font-herm text-xs"
                disabled={loading}
                required={!existingProfile}
              />
              {formData.image && typeof formData.image === 'object' && formData.image?.name ? (
                <div className="mt-1 text-xs text-ama font-herm">
                  New: {formData.image.name}
                </div>
              ) : existingProfile?.metadata?.image && (
                <div className="mt-1 text-xs text-white/60 font-herm">
                  Current: {existingProfile.metadata.image.split('/').pop()}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-3 border-t border-white flex-shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-3 py-1.5 bg-white/10 hover:opacity-70 text-white font-herm rounded-sm transition-colors text-xs"
              disabled={false}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="flex-1 px-3 py-1.5 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs"
              disabled={loading || !formData.title.trim() || !formData.description.trim() || (!formData.image && !existingProfile) || (profileType === "Fulfiller" && (!formData.basePrice || !formData.vigBasisPoints))}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                  {existingProfile ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                existingProfile ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};