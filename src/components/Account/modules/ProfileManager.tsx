import { useEffect } from "react";
import { ProfileManagerProps } from "../types";
import { useProfileManager } from "../hooks/useProfileManager";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ProfileManager = ({
  isOpen,
  onClose,
  contract,
  infraId,
  walletAddress,
  profileType,
  dict,
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
    cancelOperation,
  } = useProfileManager({
    contract,
    infraId,
    walletAddress,
    profileType,
    dict,
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-awk uppercase text-oro">
              {existingProfile
                ? `${dict?.update} ${profileType}`
                : `${dict?.create} ${profileType}`}
            </h2>
            <div
              onClick={handleClose}
              className="relative cursor-pointer hover:opacity-80 transition-opacity w-4 h-4"
            >
              <Image
                src={"/images/plug.png"}
                draggable={false}
                fill
                objectFit="contain"
                alt="close"
              />
            </div>
          </div>

          <div className="flex-1">
          <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-scroll">
            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.title} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm font-chicago focus:outline-none"
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.description} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm font-chicago focus:outline-none resize-none"
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.link}
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm font-chicago focus:outline-none"
                  placeholder={dict?.linkPlaceholder}
                  disabled={loading}
                />
              </FancyBorder>
            </div>

            {profileType === "Fulfiller" && (
              <>
                <div>
                  <label className="block text-sm font-chicago text-gris mb-2">
                    {dict?.basePrice} *
                  </label>
                  <FancyBorder color="white" type="circle" className="relative">
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice || ""}
                      onChange={handleInputChange}
                      min="0"
                      step="0.001"
                      className="relative z-10 w-full px-3 py-2 text-gris text-sm font-chicago focus:outline-none"
                      placeholder={dict?.basePricePlaceholder}
                      disabled={loading}
                      required
                    />
                  </FancyBorder>
                </div>

                <div>
                  <label className="block text-sm font-chicago text-gris mb-2">
                    {dict?.vigPercentage} *
                  </label>
                  <FancyBorder color="white" type="circle" className="relative">
                    <input
                      type="number"
                      name="vigBasisPoints"
                      value={formData.vigBasisPoints || ""}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="relative z-10 w-full px-3 py-2 text-gris text-sm font-chicago focus:outline-none"
                      placeholder={dict?.vigPercentagePlaceholder}
                      disabled={loading}
                      required
                    />
                  </FancyBorder>
                  <p className="text-xs text-gris mt-1 font-chicago">
                    {dict?.vigPercentageExample}
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.image} *
              </label>
              {existingProfile?.metadata?.image && !formData.image && (
                <div className="mb-2 flex items-center gap-2 text-gris text-sm font-chicago">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      draggable={false}
                      layout="fill"
                      src={getIPFSUrl(existingProfile.metadata.image)}
                      alt="Current"
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <span>{dict?.current}</span>
                </div>
              )}
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm font-chicago focus:outline-none file:mr-2 file:py-1 file:px-3 file:rounded-sm file:border-0 file:bg-white file:text-black file:cursor-pointer hover:file:opacity-70 file:font-chicago file:text-xs"
                  disabled={loading}
                  required={!existingProfile}
                />
              </FancyBorder>
              {formData.image &&
              typeof formData.image === "object" &&
              formData.image?.name ? (
                <div className="mt-2 text-sm text-gris font-chicago">
                  {dict?.new}: {formData.image.name}
                </div>
              ) : (
                existingProfile?.metadata?.image && (
                  <div className="mt-2 text-sm text-gris font-chicago">
                    {existingProfile.metadata.image.split("/").pop()}
                  </div>
                )
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="relative flex-1 px-4 py-2 bg-offNegro text-gris font-chicago rounded-sm transition-colors text-sm uppercase cursor-pointer hover:opacity-70"
                disabled={false}
              >
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                <span className="relative z-10">{dict?.cancel}</span>
              </button>
              <button
                type="submit"
                onClick={handleFormSubmit}
                className="relative flex-1 px-4 py-2 bg-offNegro text-oro font-chicago rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase cursor-pointer hover:opacity-70"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.description.trim() ||
                  (!formData.image && !existingProfile) ||
                  (profileType === "Fulfiller" &&
                    (!formData.basePrice || !formData.vigBasisPoints))
                }
              >
                <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                  <Image
                    src={"/images/borderoro2.png"}
                    draggable={false}
                    objectFit="fill"
                    fill
                    alt="border"
                  />
                </div>
                {loading ? (
                  <>
                    <div className="relative w-fit animate-spin h-fit flex z-10">
                      <div className="relative w-4 h-4 flex">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={"/images/scissors.png"}
                          draggable={false}
                          alt="loader"
                        />
                      </div>
                    </div>
                    <span className="relative z-10">
                      {existingProfile ? dict?.updating : dict?.creating}
                    </span>
                  </>
                ) : (
                  <span className="relative z-10">
                    {existingProfile ? dict?.update : dict?.create}
                  </span>
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};
