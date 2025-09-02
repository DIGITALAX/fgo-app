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
    { value: 0, label: "Digital Only" },
    { value: 1, label: "Physical Only" },
    { value: 2, label: "Digital & Physical" },
  ];

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-black rounded-sm border border-white w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="p-3 sm:p-4 border-b border-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-herm text-white">
              {isEditMode
                ? `Edit ${
                    mode === "parent"
                      ? "Parent Design"
                      : mode === "template"
                      ? "Template Item"
                      : "Child Item"
                  }`
                : `Create ${
                    mode === "parent"
                      ? "Parent Design"
                      : mode === "template"
                      ? "Template Item"
                      : "Child Item"
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
                  Metadata
                </h3>
                {(!isEditMode || !(editItem as Child)?.isImmutable) && (
                  <MetadataForm
                    formData={formData.metadata}
                    onInputChange={handleInputChange}
                    onFileChange={handleFileChange}
                    onTagsChange={handleTagsChange}
                    onLorasChange={handleLorasChange}
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
                  />
                )}
                {isEditMode && (editItem as Child)?.isImmutable && (
                  <div className="p-4 bg-black border border-ama rounded-sm">
                    <p className="text-ama text-sm font-herm">
                      Metadata cannot be modified because this item is immutable
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-base font-herm text-white mb-3">
                Contract Configuration
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
                      Digital Price *
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
                      Physical Price *
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
                        Version *
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
                      Max Physical Editions *
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
                      Max Digital Editions *
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

                {(!isEditMode || (mode !== "parent" && !(editItem as Child)?.isImmutable)) && (
                  <div>
                    <label className="block text-sm font-herm text-ama mb-2">
                      Availability *
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
              </div>

              <div className="mt-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-herm text-ama">Settings</h4>
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
                            Make Immutable
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
                          Any market can list for sale (Digital)
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
                          Any market can list for sale (Physical)
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
                            Anyone template or parent can use (Digital)
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
                            Anyone template or parent can use (Physical)
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
                            Standalone Allowed
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
                    Child Placements
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <p className="text-sm text-white font-herm">
                        Add up to 50 children to this{" "}
                        {mode === "parent" ? "design" : "template"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsChildSelectionOpen(true)}
                        disabled={
                          loading || formData.childReferences.length >= 50
                        }
                        className="px-3 py-2 bg-white hover:opacity-70 disabled:opacity-50 text-black text-sm font-herm rounded-sm transition-colors whitespace-nowrap"
                      >
                        Add Children ({formData.childReferences.length}/50)
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
                          No children added yet. Click "Add Children" to start
                          building your{" "}
                          {mode === "parent" ? "design" : "template"}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {mode === "parent" && !isEditMode && (
              <div>
                <h3 className="text-base font-herm text-white mb-3">
                  Fulfillment Workflow (Optional)
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
                            Digital steps:{" "}
                            {formData.fulfillmentWorkflow.digitalSteps.length}
                          </p>
                        )}
                      {(formData.availability === 1 ||
                        formData.availability === 2) &&
                        formData.fulfillmentWorkflow.physicalSteps.length >
                          0 && (
                          <p>
                            Physical steps:{" "}
                            {formData.fulfillmentWorkflow.physicalSteps.length}
                          </p>
                        )}
                    </div>
                  ) : (
                    <p className="text-sm text-white font-herm mb-3">
                      Configure custom fulfillment steps for your design. This
                      is optional and can be set up later.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsWorkflowModalOpen(true)}
                    className="px-3 py-2 bg-white hover:opacity-70 text-black text-sm font-herm rounded-sm transition-colors"
                    disabled={loading}
                  >
                    Configure Workflow
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
              Cancel
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
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                `Update ${
                  mode === "parent"
                    ? "Parent"
                    : mode === "template"
                    ? "Template"
                    : "Child"
                }`
              ) : mode === "parent" ? (
                "Create Parent"
              ) : mode === "template" ? (
                "Create Template"
              ) : (
                "Create Child"
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
      />

      <FulfillmentWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSave={handleWorkflowChange}
        availability={formData.availability}
        currentWorkflow={formData.fulfillmentWorkflow}
        infraId={infraId}
      />
    </div>
  );
};
