import { CreateItemModalProps } from "../../types";
import { useCreateItemForm } from "../../hooks/useCreateItemForm";
import { MetadataForm } from "../MetadataForm";
import { ChildSelectionModal } from "./children/ChildSelectionModal";
import { FulfillmentWorkflowModal } from "./FulfillmentWorkflowModal";
import { useState, useEffect } from "react";
import { Child } from "@/components/Item/types";
import { getIPFSUrl } from "@/lib/helpers/ipfs";

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
  const [isChildSelectionOpen, setIsChildSelectionOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [editingPlacementIndex, setEditingPlacementIndex] = useState<
    number | null
  >(null);
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
    handleWorkflowChange,
    resetForm,
    isFormValid,
  } = useCreateItemForm(editItem, isEditMode);

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

  if (!isOpen) return null;


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
  ];

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-black rounded-sm border border-white w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="p-3 sm:p-4 border-b border-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-herm text-white">
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
            <button
              onClick={handleClose}
              className="text-white hover:text-ama transition-colors font-herm"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4 sm:space-y-6">
            {!(mode === "parent" && isEditMode) && (
              <div>
                <h3 className="text-base font-herm text-white mb-3">
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
                  <div className="p-4 bg-black border border-ama rounded-sm">
                    <p className="text-ama text-sm font-herm">
                      {dict?.metadataCannotModify}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-base font-herm text-white mb-3">
                {dict?.contractConfiguration}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(mode === "parent" && isEditMode) ||
                (mode === "parent" && !isEditMode && (formData.availability === 0 || formData.availability === 2)) ||
                (mode !== "parent" && isEditMode) ||
                (mode !== "parent" &&
                  !isEditMode &&
                  (formData.availability === 0 ||
                    formData.availability === 2)) ? (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      {dict?.digitalPrice} *
                    </label>
                    <input
                      type="text"
                      name="digitalPrice"
                      value={formData.digitalPrice || "0"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                      placeholder="0"
                      disabled={loading}
                      required
                    />
                  </div>
                ) : null}

                {(mode === "parent" && isEditMode) ||
                (mode === "parent" && !isEditMode && (formData.availability === 1 || formData.availability === 2)) ||
                (mode !== "parent" &&
                  (formData.availability === 1 ||
                    formData.availability === 2)) ? (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      {dict?.physicalPrice} *
                    </label>
                    <input
                      type="text"
                      name="physicalPrice"
                      value={formData.physicalPrice || "0"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                      placeholder="0"
                      disabled={loading}
                      required
                    />
                  </div>
                ) : null}

                {mode !== "parent" &&
                  (!isEditMode || !(editItem as Child)?.isImmutable) && (
                    <div>
                      <label className="block text-sm font-herm text-ama mb-2">
                        {dict?.version} *
                      </label>
                      <input
                        type="number"
                        name="version"
                        value={formData.version || "1"}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                        placeholder="1"
                        min="1"
                        disabled={loading}
                        required
                      />
                    </div>
                  )}

                {(mode === "parent" && isEditMode) ||
                (mode === "parent" && !isEditMode && (formData.availability === 1 || formData.availability === 2)) ||
                (mode !== "parent" &&
                  (formData.availability === 1 ||
                    formData.availability === 2)) ? (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      {dict?.maxPhysicalEditions} *
                    </label>
                    <input
                      type="number"
                      name="maxPhysicalEditions"
                      value={formData.maxPhysicalEditions || "0"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                      placeholder="0"
                      min={
                        isEditMode && editItem?.currentPhysicalEditions
                          ? editItem.currentPhysicalEditions
                          : "0"
                      }
                      disabled={loading}
                      required
                    />
                  </div>
                ) : null}

                {mode === "parent" && (formData.availability === 0 || formData.availability === 2) && (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      {dict?.maxDigitalEditions} *
                    </label>
                    <input
                      type="number"
                      name="maxDigitalEditions"
                      value={formData.maxDigitalEditions || "0"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                      placeholder="0"
                      min="0"
                      disabled={loading}
                      required
                    />
                  </div>
                )}

                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      {dict?.availability} *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                      disabled={loading}
                      required
                    >
                      {availabilityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {mode === "parent" && !isEditMode && (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      {dict?.printType} *
                    </label>
                    <input
                      type="number"
                      name="printType"
                      value={formData.printType || "0"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                      placeholder="0"
                      min="0"
                      disabled={loading}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="mt-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-herm text-ama">{dict?.settings}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mode !== "parent" &&
                      (!isEditMode || !(editItem as Child)?.isImmutable) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isImmutable"
                            checked={formData.isImmutable}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-ama focus:ring-ama focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-white font-herm">
                            {dict?.makeImmutable}
                          </span>
                        </label>
                      )}
                    {!isEditMode && (formData.availability === 0 ||
                      formData.availability === 2) && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="digitalMarketsOpenToAll"
                          checked={formData.digitalMarketsOpenToAll}
                          onChange={handleCheckboxChange}
                          className="rounded border-white text-ama focus:ring-ama focus:ring-offset-black"
                          disabled={loading}
                        />
                        <span className="ml-2 text-sm text-white font-herm">
                          {dict?.anyMarketCanListDigital}
                        </span>
                      </label>
                    )}
                    {!isEditMode && (formData.availability === 1 ||
                      formData.availability === 2) && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="physicalMarketsOpenToAll"
                          checked={formData.physicalMarketsOpenToAll}
                          onChange={handleCheckboxChange}
                          className="rounded border-white text-ama focus:ring-ama focus:ring-offset-black"
                          disabled={loading}
                        />
                        <span className="ml-2 text-sm text-white font-herm">
                          {dict?.anyMarketCanListPhysical}
                        </span>
                      </label>
                    )}
                    {!isEditMode && mode !== "parent" &&
                      (formData.availability === 0 ||
                        formData.availability === 2) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="digitalReferencesOpenToAll"
                            checked={formData.digitalReferencesOpenToAll}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-ama focus:ring-ama focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-white font-herm">
                            {dict?.anyoneCanUseDigital}
                          </span>
                        </label>
                      )}
                    {!isEditMode && mode !== "parent" &&
                      (formData.availability === 1 ||
                        formData.availability === 2) && (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="physicalReferencesOpenToAll"
                            checked={formData.physicalReferencesOpenToAll}
                            onChange={handleCheckboxChange}
                            className="rounded border-white text-ama focus:ring-ama focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-white font-herm">
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
                            className="rounded border-white text-ama focus:ring-ama focus:ring-offset-black"
                            disabled={loading}
                          />
                          <span className="ml-2 text-sm text-white font-herm">
                            {dict?.standaloneAllowed}
                          </span>
                        </label>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {((mode === "parent") ||
              (mode === "template" && !isEditMode)) && (
                <div>
                  <h3 className="text-base font-herm text-white mb-3">
                    {dict?.childPlacements}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <p className="text-sm text-white font-herm">
                        {dict?.addChildren} (0-50) {mode === "parent" ? dict?.design : dict?.template}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsChildSelectionOpen(true)}
                        disabled={
                          loading || formData.childReferences.length >= 50
                        }
                        className="px-3 py-2 bg-white hover:opacity-70 disabled:opacity-50 text-black text-sm font-herm rounded-sm transition-colors whitespace-nowrap"
                      >
                        {dict?.addChildren} ({formData.childReferences.length}/50)
                      </button>
                    </div>

                    {formData.childReferences.length > 0 ? (
                      <div className="space-y-3">
                        {formData.childReferences.map((placement, index) => (
                          <div
                            key={index}
                            className="bg-black rounded-sm p-3 border border-white"
                          >
                            <div className="flex items-center  mb-3">
                              <div className="text-sm">
                                <div className="text-white font-herm">
                                  Child ID: {placement.childId}
                                </div>
                                <div className="text-ama font-mono text-xs truncate">
                                  {placement.childContract}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-white font-herm">
                                  Amount: {placement.amount}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditChildReference(index)
                                  }
                                  className="px-3 py-1 text-mar hover:text-ama text-xs font-herm"
                                  disabled={loading}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeChildReference(index)}
                                  className="px-3 py-1 text-fresa hover:text-ama text-xs font-herm"
                                  disabled={loading}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-black rounded-sm p-4 border border-white text-center">
                        <p className="text-ama text-sm font-herm">
                          {dict?.noChildrenAdded} {mode === "parent" ? dict?.design : dict?.template}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {mode === "parent" && !isEditMode && (
              <div>
                <h3 className="text-base font-herm text-white mb-3">
                  {dict?.fulfillmentWorkflow}
                </h3>
                <div className="bg-black rounded-sm p-4 border border-white">
                  {formData.fulfillmentWorkflow &&
                  (formData.fulfillmentWorkflow.digitalSteps.length > 0 ||
                    formData.fulfillmentWorkflow.physicalSteps.length > 0) ? (
                    <div className="text-sm text-white font-herm mb-3 space-y-1">
                      {(formData.availability === 0 ||
                        formData.availability === 2) &&
                        formData.fulfillmentWorkflow.digitalSteps.length >
                          0 && (
                          <p>
                            {dict?.digitalSteps} {formData.fulfillmentWorkflow.digitalSteps.length}
                          </p>
                        )}
                      {(formData.availability === 1 ||
                        formData.availability === 2) &&
                        formData.fulfillmentWorkflow.physicalSteps.length >
                          0 && (
                          <p>
                            {dict?.physicalSteps} {formData.fulfillmentWorkflow.physicalSteps.length}
                          </p>
                        )}
                    </div>
                  ) : (
                    <p className="text-sm text-white font-herm mb-3">
                      {dict?.configureCustomSteps}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsWorkflowModalOpen(true)}
                    className="px-3 py-2 bg-white hover:opacity-70 text-black text-sm font-herm rounded-sm transition-colors"
                    disabled={loading}
                  >
                    {dict?.configureWorkflow}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-4 border-t border-white flex-shrink-0">
          <div className="flex gap-2">
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
              form="create-child-form"
              onClick={handleSubmit}
              className="flex-1 px-3 py-2 bg-white hover:opacity-70 text-black font-herm rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black"></div>
                  {isEditMode ? dict?.updating : dict?.creating}
                </>
              ) : isEditMode ? (
                `${dict?.update} ${
                  mode === "parent"
                    ? dict?.parent
                    : mode === "template"
                    ? dict?.template
                    : dict?.child
                }`
              ) : mode === "parent" ? (
                dict?.createParent
              ) : mode === "template" ? (
                dict?.createTemplate
              ) : (
                dict?.createChild
              )}
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
