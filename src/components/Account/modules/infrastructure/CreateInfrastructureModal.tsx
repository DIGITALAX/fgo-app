import { FancyBorder } from "@/components/Layout/modules/FancyBorder";
import { useCreateInfrastructureForm } from "../../hooks/infrastructure/useCreateInfrastructureForm";
import { CreateInfrastructureModalProps } from "../../types";
import Image from "next/image";
import { useState } from "react";

export const CreateInfrastructureModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  loading,
  paymentTokens,
  dict,
}: CreateInfrastructureModalProps) => {
  const {
    formData,
    showCustomToken,
    fileInputRef,
    handleInputChange,
    handleImageChange,
    resetForm,
    isFormValid,
  } = useCreateInfrastructureForm(paymentTokens);

  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit(formData);
      resetForm();
    } catch (error) {}
  };

  const handleCancel = () => {
    onCancel();
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
              {dict?.createInfrastructure}
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
                {dict?.paymentToken}
              </label>
              <FancyBorder color="white" type="circle" className="relative">
                <div
                  onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                  className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between font-chicago"
                >
                  <span>
                    {showCustomToken
                      ? dict?.customERC20Token
                      : paymentTokens.find(
                          (t) => t.address === formData.paymentToken
                        )?.name || paymentTokens[0]?.name}{" "}
                    {!showCustomToken &&
                      `(${
                        paymentTokens.find(
                          (t) => t.address === formData.paymentToken
                        )?.symbol || paymentTokens[0]?.symbol
                      })`}
                  </span>
                  <div className="relative w-3 h-3 rotate-90">
                    <Image
                      src={"/images/arrow.png"}
                      draggable={false}
                      fill
                      alt="arrow"
                    />
                  </div>
                </div>
                {isTokenDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-black border border-white font-chicago">
                    {paymentTokens.map((token) => (
                      <div
                        key={token.address}
                        onClick={() => {
                          handleInputChange({
                            target: {
                              name: "paymentToken",
                              value: token.address,
                            },
                          } as any);
                          setIsTokenDropdownOpen(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black text-gris"
                      >
                        {token.name} ({token.symbol})
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        handleInputChange({
                          target: { name: "paymentToken", value: "custom" },
                        } as any);
                        setIsTokenDropdownOpen(false);
                      }}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black text-gris"
                    >
                      {dict?.customERC20Token}
                    </div>
                  </div>
                )}
              </FancyBorder>

              {showCustomToken && (
                <FancyBorder
                  color="white"
                  type="circle"
                  className="relative mt-2"
                >
                  <input
                    type="text"
                    name="paymentToken"
                    value={formData.paymentToken}
                    onChange={handleInputChange}
                    className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                    placeholder="0x..."
                    disabled={loading}
                  />
                </FancyBorder>
              )}
              <div className="mt-2 text-xs text-gris font-chicago space-y-1">
                <p>
                  •{" "}
                  <span className="text-oro">
                    {dict?.privateInfrastructure}:
                  </span>{" "}
                  {dict?.anyERC20TokenSuitable}
                </p>
                <p>
                  •{" "}
                  <span className="text-oro">
                    {dict?.crossDesignerCollaboration}:
                  </span>{" "}
                  {dict?.monaDefaultToken}
                </p>
                <p>• {dict?.customERC20AddressInfo}</p>
              </div>
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
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                  placeholder={dict?.infrastructureName}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.description} *
              </label>
              <FancyBorder type="diamond" color="oro" className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none resize-none"
                  placeholder={dict?.describeInfrastructure}
                  disabled={loading}
                  required
                />
              </FancyBorder>
            </div>

            <div>
              <label className="block text-sm font-chicago text-gris mb-2">
                {dict?.image}
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
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
                  <span className="relative z-10">{dict?.selectImage}</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <div
                onClick={handleCancel}
                className="relative cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center">
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
              </div>
              <button
                type="submit"
                className="relative flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center gap-2">
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
                      <div className="relative w-3 h-3 animate-spin">
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={"/images/scissors.png"}
                          draggable={false}
                          alt="loader"
                        />
                      </div>
                      <span className="relative z-10">{dict?.creating}...</span>
                    </>
                  ) : (
                    <span className="relative z-10">{dict?.create}</span>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
