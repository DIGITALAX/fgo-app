import { useEffect } from "react";
import { useDeployParentForm } from "@/components/Account/hooks/infrastructure/parents/useDeployParentForm";
import { DeployParentModalProps } from "../../../types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const DeployParentModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  loading,
  dict,
}: DeployParentModalProps) => {
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
              {dict?.deployParentContract}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.contractName} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                  placeholder={dict?.enterContractName}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.symbol} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                  placeholder={dict?.parentSymbolPlaceholder}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.scm} *
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <input
                  type="text"
                  name="scm"
                  value={formData.scm}
                  onChange={handleInputChange}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                  placeholder={dict?.enterSCM}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

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
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50"
                  placeholder={dict?.enterParentTitle}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.description} *
              </label>
              <FancyBorder className="relative" type="diamond" color="oro">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm focus:outline-none font-chicago placeholder:text-gris/50 resize-none"
                  placeholder={dict?.enterParentDescription}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.image}
              </label>
              <div className="space-y-2">
                {formData.image && (
                  <div className="text-xs text-gris font-chicago p-2 border border-gris/30">
                    {dict?.selected}: {formData.image.name}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 text-gris text-sm font-chicago file:mr-4 file:py-1 file:px-2 file:border-0 file:text-xs file:bg-gris file:text-black hover:file:opacity-70"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="relative flex-1"
                disabled={false}
              >
                <div className="text-xs text-fresa font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
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
                </div>
              </button>
              <button
                type="submit"
                className="relative flex-1"
                disabled={loading || !isFormValid}
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center disabled:opacity-50">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="relative w-fit animate-spin h-fit flex">
                          <div className="relative w-3 h-3 flex">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              src={"/images/scissors.png"}
                              draggable={false}
                              alt="loader"
                            />
                          </div>
                        </div>
                        {dict?.deploying}...
                      </>
                    ) : (
                      dict?.deploy
                    )}
                  </span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
