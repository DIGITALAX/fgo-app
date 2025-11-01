import { CreateItemModalProps } from "../../types";
import { useCreateItemForm } from "../../hooks/useCreateItemForm";
import { MetadataForm } from "../MetadataForm";
import { ChildSelectionModal } from "./children/ChildSelectionModal";
import { SupplyRequestModal } from "./parents/SupplyRequestModal";
import { FulfillmentWorkflowModal } from "./FulfillmentWorkflowModal";
import { useState, useEffect } from "react";
import { Child } from "@/components/Item/types";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const CreateItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  mode,
  infraId,
  isEditMode = false,
  editItem,
  dict,
}: CreateItemModalProps) => {
  const [isChildSelectionOpen, setIsChildSelectionOpen] =
    useState<boolean>(false);
  const [isSupplyRequestModalOpen, setIsSupplyRequestModalOpen] =
    useState<boolean>(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] =
    useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [editingPlacementIndex, setEditingPlacementIndex] = useState<
    number | null
  >(null);
  const [editingSupplyRequestIndex, setEditingSupplyRequestIndex] = useState<
    number | null
  >(null);
  const [isAvailabilityDropdownOpen, setIsAvailabilityDropdownOpen] =
    useState<boolean>(false);

  const {
    formData,
    handleInputChange,
    handleCheckboxChange,
    handleFileChange,
    handleTagsChange,
    handleLorasChange,
    handleCustomFieldsChange,
    addChildReference,
    removeChildReference,
    updateChildReference,
    addSupplyRequest,
    removeSupplyRequest,
    updateSupplyRequest,
    handleWorkflowChange,
    handleFuturesToggle,
    handleFuturesInputChange,
    resetForm,
    isFormValid,
  } = useCreateItemForm(dict, editItem, isEditMode);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleEditChildReference = (index: number) => {
    setEditingPlacementIndex(index);
    setIsChildSelectionOpen(true);
  };

  const handleUpdatePlacement = (updatedPlacement: any) => {
    if (editingPlacementIndex !== null) {
      updateChildReference(editingPlacementIndex, updatedPlacement);
      setEditingPlacementIndex(null);
    }
    setIsChildSelectionOpen(false);
  };

  const handleEditSupplyRequest = (index: number) => {
    setEditingSupplyRequestIndex(index);
    setIsSupplyRequestModalOpen(true);
  };

  const handleUpdateSupplyRequest = (updatedRequest: any) => {
    if (editingSupplyRequestIndex !== null) {
      updateSupplyRequest(editingSupplyRequestIndex, updatedRequest);
      setEditingSupplyRequestIndex(null);
    }
    setIsSupplyRequestModalOpen(false);
  };

  if (!isOpen) return null;

  const hasDigitalFuturesChild = formData.childReferences?.some((ref) => {
    if (ref.child && "futures" in ref.child) {
      return ref.child.futures?.isActive && formData.availability !== 1;
    }
    return false;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsCancelled(false);

    try {
      await onSubmit(formData);
      if (!isCancelled) {
        resetForm();
      }
    } catch (error) {
      if (!isCancelled) {
        throw error;
      }
    }
  };

  const handleCancel = () => {
    setIsCancelled(true);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const availabilityOptions = [
    { value: 0, label: dict?.digitalOnly },
    { value: 1, label: dict?.physicalOnly },
    { value: 2, label: dict?.digitalPhysicalBoth },
  ].filter((opt) => {
    if (mode === "child" && formData.futures?.isFutures && opt.value === 2) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="relative w-full max-w-4xl bg-black"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>

        <div className="relative z-10 p-6" style={{ flexShrink: 0 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-awk uppercase text-oro">
              {isEditMode
                ? `${dict?.edit} ${
                    mode === "parent"
                      ? dict?.parentDesign
                      : mode === "template"
                      ? dict?.templateItem
                      : dict?.childItem
                  }`
                : `${dict?.create} ${
                    mode === "parent"
                      ? dict?.parentDesign
                      : mode === "template"
                      ? dict?.templateItem
                      : dict?.childItem
                  }`}
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
        </div>

        <div
          className="relative z-10"
          style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {!(mode === "parent" && isEditMode) && (
              <div>
                <h3 className="text-xl font-awk uppercase text-oro mb-4">
                  {dict?.metadata}
                </h3>
                {(!isEditMode || !(editItem as Child)?.isImmutable) && (
                  <MetadataForm
                    formData={formData.metadata}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    onTagsChange={handleTagsChange}
                    onLorasChange={handleLorasChange}
                    onCustomFieldsChange={handleCustomFieldsChange}
                    loading={loading}
                    existingImageUrl={
                      isEditMode && editItem?.metadata?.image
                        ? getIPFSUrl(editItem.metadata.image)
                        : undefined
                    }
                    existingAttachments={
                      isEditMode && editItem?.metadata?.attachments
                        ? editItem.metadata.attachments
                        : []
                    }
                    dict={dict}
                  />
                )}
                {isEditMode && (editItem as Child)?.isImmutable && (
                  <FancyBorder type="diamond" color="oro" className="relative">
                    <div className="relative z-10 p-4">
                      <p className="text-white text-sm font-chicago">
                        {dict?.metadataCannotModify}
                      </p>
                    </div>
                  </FancyBorder>
                )}
              </div>
            )}

            <div>
              <h3 className="text-xl font-awk uppercase text-oro mb-4">
                {dict?.contractConfiguration}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(mode === "parent" && isEditMode) ||
                (mode === "parent" &&
                  !isEditMode &&
                  (formData.availability === 0 ||
                    formData.availability === 2)) ||
                (mode !== "parent" && isEditMode) ||
                (mode !== "parent" &&
                  !isEditMode &&
                  (formData.availability === 0 ||
                    formData.availability === 2)) ? (
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.digitalPrice} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <input
                        type="text"
                        name="digitalPrice"
                        value={formData.digitalPrice || "0"}
                        onChange={handleInputChange}
                        className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                        placeholder="0"
                        disabled={loading}
                        required
                      />
                    </FancyBorder>
                  </div>
                ) : null}

                {(mode === "parent" && isEditMode) ||
                (mode === "parent" &&
                  !isEditMode &&
                  (formData.availability === 1 ||
                    formData.availability === 2)) ||
                (mode !== "parent" &&
                  (formData.availability === 1 ||
                    formData.availability === 2)) ? (
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.physicalPrice} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <input
                        type="text"
                        name="physicalPrice"
                        value={formData.physicalPrice || "0"}
                        onChange={handleInputChange}
                        className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                        placeholder="0"
                        disabled={loading}
                        required
                      />
                    </FancyBorder>
                  </div>
                ) : null}

                {mode !== "parent" &&
                  (!isEditMode || !(editItem as Child)?.isImmutable) && (
                    <div>
                      <label className="block text-sm font-chicago text-gris mb-2">
                        {dict?.version} *
                      </label>
                      <FancyBorder
                        color="white"
                        type="circle"
                        className="relative"
                      >
                        <input
                          type="number"
                          name="version"
                          value={formData.version || "1"}
                          onChange={handleInputChange}
                          className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                          placeholder="1"
                          min="1"
                          disabled={loading}
                          required
                        />
                      </FancyBorder>
                    </div>
                  )}

                {(mode === "parent" && isEditMode) ||
                (mode === "parent" &&
                  !isEditMode &&
                  (formData.availability === 1 ||
                    formData.availability === 2)) ||
                (mode !== "parent" &&
                  (formData.availability === 1 ||
                    formData.availability === 2)) ? (
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.maxPhysicalEditions} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <input
                        type="number"
                        name="maxPhysicalEditions"
                        value={formData.maxPhysicalEditions || "0"}
                        onChange={handleInputChange}
                        className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                        placeholder="0"
                        min={
                          isEditMode && editItem?.currentPhysicalEditions
                            ? editItem.currentPhysicalEditions
                            : "0"
                        }
                        disabled={loading}
                        required
                      />
                    </FancyBorder>
                  </div>
                ) : null}

                {mode === "parent" &&
                  (formData.availability === 0 ||
                    formData.availability === 2) && (
                    <div>
                      <label className="block text-sm font-chicago text-gris mb-2">
                        {dict?.maxDigitalEditions} *
                      </label>
                      <FancyBorder
                        color="white"
                        type="circle"
                        className="relative"
                      >
                        <input
                          type="number"
                          name="maxDigitalEditions"
                          value={formData.maxDigitalEditions || "0"}
                          onChange={handleInputChange}
                          className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                          placeholder="0"
                          min="0"
                          disabled={loading}
                          required
                        />
                      </FancyBorder>
                    </div>
                  )}

                {mode === "child" &&
                  formData.futures?.isFutures &&
                  formData.availability === 0 && (
                    <div>
                      <label className="block text-sm font-chicago text-gris mb-2">
                        {dict?.futuresMaxDigital} *
                      </label>
                      <FancyBorder
                        color="white"
                        type="circle"
                        className="relative"
                      >
                        <input
                          type="number"
                          name="maxDigitalEditions"
                          value={formData.futures.maxDigitalEditions}
                          onChange={handleFuturesInputChange}
                          className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                          placeholder="0"
                          min="1"
                          disabled={loading}
                          required
                        />
                      </FancyBorder>
                    </div>
                  )}

                {mode === "template" &&
                  hasDigitalFuturesChild &&
                  !isEditMode && (
                    <div>
                      <label className="block text-sm font-chicago text-gris mb-2">
                        {dict?.maxDigitalEditions} *
                      </label>
                      <FancyBorder
                        color="white"
                        type="circle"
                        className="relative"
                      >
                        <input
                          type="number"
                          name="maxDigitalEditions"
                          value={formData.maxDigitalEditions || "0"}
                          onChange={handleInputChange}
                          className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                          placeholder="0"
                          min="1"
                          disabled={loading}
                          required
                        />
                      </FancyBorder>
                    </div>
                  )}

                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.availability} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <div
                        onClick={() =>
                          setIsAvailabilityDropdownOpen(
                            !isAvailabilityDropdownOpen
                          )
                        }
                        className="relative z-10 w-full px-3 py-2 text-gris text-sm cursor-pointer flex items-center justify-between font-chicago"
                      >
                        <span>
                          {
                            availabilityOptions.find(
                              (opt) => opt.value === formData.availability
                            )?.label
                          }
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
                      {isAvailabilityDropdownOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-black border border-white font-chicago">
                          {availabilityOptions.map((option) => (
                            <div
                              key={option.value}
                              onClick={() => {
                                handleInputChange({
                                  target: {
                                    name: "availability",
                                    value: option.value,
                                  },
                                } as any);
                                setIsAvailabilityDropdownOpen(false);
                              }}
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-white hover:text-black text-gris"
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </FancyBorder>
                  </div>
                )}

                {mode === "parent" && !isEditMode && (
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.printType} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <input
                        type="number"
                        name="printType"
                        value={formData.printType || "0"}
                        onChange={handleInputChange}
                        className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                        placeholder="0"
                        min="0"
                        disabled={loading}
                        required
                      />
                    </FancyBorder>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-chicago text-oro">
                    {dict?.settings}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mode !== "parent" &&
                      (!isEditMode || !(editItem as Child)?.isImmutable) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isImmutable"
                            checked={formData.isImmutable}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gris font-chicago">
                            {dict?.makeImmutable}
                          </span>
                        </label>
                      )}
                    {!isEditMode &&
                      (formData.availability === 0 ||
                        formData.availability === 2) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="digitalMarketsOpenToAll"
                            checked={formData.digitalMarketsOpenToAll}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gris font-chicago">
                            {dict?.anyMarketCanListDigital}
                          </span>
                        </label>
                      )}
                    {!isEditMode &&
                      (formData.availability === 1 ||
                        formData.availability === 2) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="physicalMarketsOpenToAll"
                            checked={formData.physicalMarketsOpenToAll}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gris font-chicago">
                            {dict?.anyMarketCanListPhysical}
                          </span>
                        </label>
                      )}
                    {!isEditMode &&
                      mode !== "parent" &&
                      (formData.availability === 0 ||
                        formData.availability === 2) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="digitalReferencesOpenToAll"
                            checked={formData.digitalReferencesOpenToAll}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gris font-chicago">
                            {dict?.anyoneCanUseDigital}
                          </span>
                        </label>
                      )}
                    {!isEditMode &&
                      mode !== "parent" &&
                      (formData.availability === 1 ||
                        formData.availability === 2) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="physicalReferencesOpenToAll"
                            checked={formData.physicalReferencesOpenToAll}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gris font-chicago">
                            {dict?.anyoneCanUsePhysical}
                          </span>
                        </label>
                      )}
                    {mode !== "parent" &&
                      (!isEditMode || !(editItem as Child)?.isImmutable) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="standaloneAllowed"
                            checked={formData.standaloneAllowed}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-gris font-chicago">
                            {dict?.standaloneAllowed}
                          </span>
                        </label>
                      )}
                    {mode === "child" && !isEditMode && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.futures?.isFutures || false}
                          onChange={handleFuturesToggle}
                          className="rounded border-white text-oro focus:ring-oro focus:ring-offset-black"
                          disabled={loading}
                        />
                        <span className="ml-2 text-sm text-gris font-chicago">
                          {dict?.enableFutures}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {mode === "child" && formData.futures?.isFutures && (
              <div>
                <h3 className="text-xl font-awk uppercase text-oro mb-4">
                  {dict?.futuresSettings}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.deadline} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <input
                        type="number"
                        name="deadline"
                        value={formData.futures.deadline}
                        onChange={handleFuturesInputChange}
                        className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                        placeholder={dict?.deadlinePlaceholder}
                        disabled={loading}
                        required
                      />
                    </FancyBorder>
                  </div>
                  <div>
                    <label className="block text-sm font-chicago text-gris mb-2">
                      {dict?.settlementRewardBPS} *
                    </label>
                    <FancyBorder
                      color="white"
                      type="circle"
                      className="relative"
                    >
                      <input
                        type="number"
                        name="settlementRewardBPS"
                        value={formData.futures.settlementRewardBPS}
                        onChange={handleFuturesInputChange}
                        className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                        placeholder="100"
                        min="100"
                        max="300"
                        disabled={loading}
                        required
                      />
                    </FancyBorder>
                  </div>
                </div>
              </div>
            )}

            {(mode === "parent" || (mode === "template" && !isEditMode)) && (
              <div>
                <h3 className="text-xl font-awk uppercase text-oro mb-4">
                  {dict?.childPlacements}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gris font-chicago">
                      {dict?.addChildren} (0-50){" "}
                      {mode === "parent" ? dict?.design : dict?.template}
                    </p>
                    <div
                      onClick={() =>
                        !loading &&
                        formData.childReferences.length < 50 &&
                        setIsChildSelectionOpen(true)
                      }
                      className={`relative cursor-pointer hover:opacity-80 transition-opacity ${
                        loading || formData.childReferences.length >= 50
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
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
                        <span className="relative z-10">
                          {dict?.addChildren} ({formData.childReferences.length}
                          /50)
                        </span>
                      </div>
                    </div>
                  </div>

                  {formData.childReferences.length > 0 ? (
                    <div className="space-y-3">
                      {formData.childReferences.map((placement, index) => (
                        <div key={index} className="relative">
                          <div className="relative z-10 p-4">
                            <div className="flex items-center mb-3">
                              <div className="text-sm">
                                <div className="text-gris font-chicago">
                                  Child ID: {placement.childId}
                                </div>
                                <div className="text-oro font-chicago text-xs truncate">
                                  {placement.childContract}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gris font-chicago">
                                Amount: {placement.amount}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditChildReference(index)
                                  }
                                  className="text-xs text-gris hover:text-oro font-chicago"
                                  disabled={loading}
                                >
                                  {dict?.edit}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeChildReference(index)}
                                  className="text-xs text-fresa hover:text-oro font-chicago"
                                  disabled={loading}
                                >
                                  {dict?.remove}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative z-10 p-4 text-center">
                        <p className="text-white text-sm font-chicago">
                          {dict?.noChildrenAdded}{" "}
                          {mode === "parent" ? dict?.design : dict?.template}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {mode === "parent" && !isEditMode && (
              <div>
                <h3 className="text-xl font-awk uppercase text-oro mb-4">
                  {dict?.supplyRequests}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gris font-chicago">
                      {dict?.addSupplyRequestDescription ||
                        "Request custom components from suppliers"}
                    </p>
                    <div
                      onClick={() =>
                        !loading && setIsSupplyRequestModalOpen(true)
                      }
                      className={`relative cursor-pointer hover:opacity-80 transition-opacity ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
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
                        <span className="relative z-10">
                          {dict?.addSupplyRequest } (
                          {formData.supplyRequests.length})
                        </span>
                      </div>
                    </div>
                  </div>

                  {formData.supplyRequests.length > 0 ? (
                    <div className="space-y-3">
                      {formData.supplyRequests.map((request, index) => (
                        <div key={index} className="relative">
                          <div className="relative z-10 p-4">
                            <div className="flex items-center mb-3">
                              <div className="text-sm">
                                <div className="text-gris font-chicago">
                                  {request.isPhysical
                                    ? dict?.physical
                                    : dict?.digital}
                                  {request.child &&
                                    ` - Child ID: ${request.existingChildId}`}
                                </div>
                                <div className="text-oro font-chicago text-xs">
                                  {dict?.quantity}:{" "}
                                  {request.quantity} |{" "}
                                  {dict?.maxPrice}:{" "}
                                  {request.preferredMaxPrice}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gris font-chicago truncate">
                                {request.customSpec.substring(0, 50)}...
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditSupplyRequest(index)}
                                  className="text-xs text-gris hover:text-oro font-chicago"
                                  disabled={loading}
                                >
                                  {dict?.edit}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSupplyRequest(index)}
                                  className="text-xs text-fresa hover:text-oro font-chicago"
                                  disabled={loading}
                                >
                                  {dict?.remove}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative z-10 p-4 text-center">
                        <p className="text-white text-sm font-chicago">
                          {dict?.noSupplyRequestsAdded ||
                            "No supply requests added"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {mode === "parent" && !isEditMode && (
              <div>
                <h3 className="text-xl font-awk uppercase text-oro mb-4">
                  {dict?.fulfillmentWorkflow}
                </h3>
                <div className="relative">
                  <div className="relative z-10 p-4">
                    {formData.fulfillmentWorkflow &&
                    (formData.fulfillmentWorkflow.digitalSteps.length > 0 ||
                      formData.fulfillmentWorkflow.physicalSteps.length > 0) ? (
                      <div className="text-sm text-gris font-chicago mb-3 space-y-1">
                        {(formData.availability === 0 ||
                          formData.availability === 2) &&
                          formData.fulfillmentWorkflow.digitalSteps.length >
                            0 && (
                            <p>
                              {dict?.digitalSteps}{" "}
                              {formData.fulfillmentWorkflow.digitalSteps.length}
                            </p>
                          )}
                        {(formData.availability === 1 ||
                          formData.availability === 2) &&
                          formData.fulfillmentWorkflow.physicalSteps.length >
                            0 && (
                            <p>
                              {dict?.physicalSteps}{" "}
                              {
                                formData.fulfillmentWorkflow.physicalSteps
                                  .length
                              }
                            </p>
                          )}
                      </div>
                    ) : (
                      <p className="text-sm text-gris font-chicago mb-3">
                        {dict?.configureCustomSteps}
                      </p>
                    )}
                    <div
                      onClick={() => setIsWorkflowModalOpen(true)}
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
                        <span className="relative z-10">
                          {dict?.configureWorkflow}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="relative z-10 p-6 flex-shrink-0">
          <div className="flex gap-3">
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
              onClick={handleSubmit}
              className="relative flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !isFormValid}
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
                    <span className="relative z-10">
                      {isEditMode ? dict?.updating : dict?.creating}...
                    </span>
                  </>
                ) : (
                  <span className="relative z-10">
                    {isEditMode
                      ? `${dict?.update} ${
                          mode === "parent"
                            ? dict?.parent
                            : mode === "template"
                            ? dict?.template
                            : dict?.child
                        }`
                      : mode === "parent"
                      ? dict?.createParent
                      : mode === "template"
                      ? dict?.createTemplate
                      : dict?.createChild}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <ChildSelectionModal
        isOpen={isChildSelectionOpen}
        onClose={() => {
          setIsChildSelectionOpen(false);
          setEditingPlacementIndex(null);
        }}
        onSelect={
          editingPlacementIndex !== null
            ? handleUpdatePlacement
            : (placement) => {
                addChildReference(placement);
                setIsChildSelectionOpen(false);
              }
        }
        selectedIds={formData.childReferences.map(
          (p) => `${p.childId}-${p.childContract}`
        )}
        editingPlacement={
          editingPlacementIndex !== null
            ? formData.childReferences[editingPlacementIndex]
            : undefined
        }
        dict={dict}
      />

      <SupplyRequestModal
        isOpen={isSupplyRequestModalOpen}
        onClose={() => {
          setIsSupplyRequestModalOpen(false);
          setEditingSupplyRequestIndex(null);
        }}
        onSelect={
          editingSupplyRequestIndex !== null
            ? handleUpdateSupplyRequest
            : (request) => {
                addSupplyRequest(request);
                setIsSupplyRequestModalOpen(false);
              }
        }
        editingRequest={
          editingSupplyRequestIndex !== null
            ? formData.supplyRequests[editingSupplyRequestIndex]
            : undefined
        }
        dict={dict}
      />

      <FulfillmentWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSave={handleWorkflowChange}
        availability={formData.availability}
        currentWorkflow={formData.fulfillmentWorkflow}
        infraId={infraId}
        dict={dict}
      />
    </div>
  );
};
