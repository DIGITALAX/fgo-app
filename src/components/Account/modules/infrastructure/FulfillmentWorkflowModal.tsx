import { useFulfillmentWorkflow } from "../../hooks/useFulfillmentWorkflow";
import { FulfillmentWorkflowModalProps } from "../../types";
import { validateWorkflowSteps } from "@/lib/helpers/validation";
import { getFulfiller } from "@/lib/subgraph/queries/getFGOUser";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { useState, useContext, useRef, useCallback } from "react";
import { AppContext } from "@/lib/providers/Providers";

export const FulfillmentWorkflowModal = ({
  isOpen,
  onClose,
  onSave,
  onCancel,
  availability,
  currentWorkflow,
  infraId,
  dict,
}: FulfillmentWorkflowModalProps) => {
  const [validating, setValidating] = useState(false);
  const cancelledRef = useRef<boolean>(false);
  const context = useContext(AppContext);

  const cancelOperation = useCallback(() => {
    cancelledRef.current = true;
    setValidating(false);
  }, []);
  const {
    digitalSteps,
    physicalSteps,
    addDigitalStep,
    addPhysicalStep,
    removeDigitalStep,
    removePhysicalStep,
    updateDigitalStep,
    updatePhysicalStep,
    addSubPerformer,
    removeSubPerformer,
    updateSubPerformer,
    calculatePrimaryPerformerSplit,
    resetWorkflow,
  } = useFulfillmentWorkflow(currentWorkflow);

  if (!isOpen) return null;

  const handleSave = async () => {
    setValidating(true);
    cancelledRef.current = false;
    
    if (cancelledRef.current) {
      setValidating(false);
      return;
    }
    
    const stepsToValidate = [
      ...(availability !== 1 ? digitalSteps : []),
      ...(availability !== 0 ? physicalSteps : [])
    ];
    
    const validation = validateWorkflowSteps(stepsToValidate);
    if (!validation.isValid) {
      context?.showError(dict?.workflowValidationFailedErrors?.replace('{errors}', validation.errors.join('\n')) || `Workflow validation failed:\n${validation.errors.join('\n')}`);
      setValidating(false);
      return;
    }
    
    if (cancelledRef.current) {
      setValidating(false);
      return;
    }
    
    const primaryPerformers = stepsToValidate.map(step => step.primaryPerformer).filter(Boolean);
    
    for (const performer of primaryPerformers) {
      if (cancelledRef.current) {
        setValidating(false);
        return;
      }
      
      try {
        const result = await getFulfiller(convertInfraIdToBytes32(infraId), performer);
        
        if (cancelledRef.current) {
          setValidating(false);
          return;
        }
  
        if (!result?.data?.fulfillers?.[0]) {
          if (!cancelledRef.current) {
            context?.showError(dict?.primaryPerformerNotRegistered?.replace('{performer}', performer) || `Primary performer ${performer} is not registered as a fulfiller in this infrastructure. Please add them as a fulfiller first.`);
          }
          setValidating(false);
          return;
        }
      } catch (error) {
        if (!cancelledRef.current) {
          context?.showError(dict?.failedToValidateFulfiller?.replace('{performer}', performer) || `Failed to validate fulfiller ${performer}. Please try again.`);
        }
        setValidating(false);
        return;
      }
    }
    
    const cleanSteps = (steps: any[]) => {
      return steps.map(step => ({
        ...step,
        subPerformers: step.subPerformers.filter((sub: any) => sub.splitBasisPoints > 0)
      }));
    };

    const workflow = {
      digitalSteps: availability === 1 ? [] : cleanSteps(digitalSteps),
      physicalSteps: availability === 0 ? [] : cleanSteps(physicalSteps),
    };
    
    if (!cancelledRef.current) {
      onSave(workflow);
      setValidating(false);
      onClose();
    } else {
      setValidating(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      cancelOperation();
    }
  };

  const handleClose = () => {
    resetWorkflow();
    onClose();
  };

  const showDigital = availability === 0 || availability === 2;
  const showPhysical = availability === 1 || availability === 2;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-black rounded-sm border border-white w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-herm text-white">
              Fulfillment Workflow Configuration
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-ama transition-colors font-herm"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-ama mt-2 font-herm">
            Define the steps required to fulfill orders for this design.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {showDigital && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-herm text-white">
                  Digital Steps
                </h3>
                <button
                  type="button"
                  onClick={addDigitalStep}
                  className="px-4 py-2 bg-white hover:opacity-70 text-black text-sm font-herm rounded-sm transition-colors"
                >
                  Add Step
                </button>
              </div>

              {digitalSteps.length === 0 ? (
                <div className="bg-black rounded-sm p-6 border border-white text-center">
                  <p className="text-ama text-sm font-herm">
                    {dict?.noDigitalStepsConfigured}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {digitalSteps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-black rounded-sm p-4 border border-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-herm text-white">
                          Step {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeDigitalStep(index)}
                          className="text-fresa hover:text-ama text-sm font-herm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-herm text-ama mb-1">
                            Primary Performer Address
                          </label>
                          <input
                            type="text"
                            value={step.primaryPerformer}
                            onChange={(e) =>
                              updateDigitalStep(index, {
                                ...step,
                                primaryPerformer: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                            placeholder="0x..."
                          />
                          <div className="mt-1 text-xs text-ama font-herm">
                            Primary share: {(calculatePrimaryPerformerSplit(step) / 100).toFixed(2)}%
                            {calculatePrimaryPerformerSplit(step) === 0 && " (Coordinator)"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-herm text-ama mb-1">
                            Instructions
                          </label>
                          <textarea
                            value={step.instructions}
                            onChange={(e) =>
                              updateDigitalStep(index, {
                                ...step,
                                instructions: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-black border border-white rounded-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama resize-none font-herm"
                            placeholder={dict?.stepInstructionsPlaceholder}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-herm text-ama">
                              Sub-Performers
                            </label>
                            <button
                              type="button"
                              onClick={() => addSubPerformer(index, true)}
                              className="px-2 py-1 bg-white hover:opacity-70 text-black text-xs font-herm rounded-sm"
                            >
                              Add Sub-Performer
                            </button>
                          </div>
                          
                          {step.subPerformers.length === 0 ? (
                            <div className="text-xs text-ama italic font-herm">
                              No sub-performers added
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {step.subPerformers.map((sub, subIndex) => (
                                <div key={subIndex} className="bg-black rounded-sm p-3 border border-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-ama font-herm">
                                      Sub-Performer {subIndex + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeSubPerformer(index, subIndex, true)}
                                      className="text-fresa hover:text-ama text-xs font-herm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-ama font-herm mb-1">
                                        Address
                                      </label>
                                      <input
                                        type="text"
                                        value={sub.performer}
                                        onChange={(e) =>
                                          updateSubPerformer(index, subIndex, {
                                            ...sub,
                                            performer: e.target.value,
                                          }, true)
                                        }
                                        className="w-full px-2 py-1 bg-black border border-white rounded-sm text-white text-xs focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                                        placeholder="0x..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs text-ama font-herm mb-1">
                                        Split (%)
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={sub.splitBasisPoints / 100}
                                        onChange={(e) =>
                                          updateSubPerformer(index, subIndex, {
                                            ...sub,
                                            splitBasisPoints: Math.round((parseFloat(e.target.value) || 0) * 100),
                                          }, true)
                                        }
                                        className="w-full px-2 py-1 bg-black border border-white rounded-sm text-white text-xs focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama font-herm"
                                        placeholder="10.00"
                                      />
                                      <div className="text-xs text-ama mt-1 font-herm">
                                        {sub.splitBasisPoints / 100}% split
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showPhysical && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-herm text-white">
                  Physical Steps
                </h3>
                <button
                  type="button"
                  onClick={addPhysicalStep}
                  className="px-4 py-2 bg-white hover:opacity-70 text-black text-sm font-herm rounded-sm transition-colors"
                >
                  Add Step
                </button>
              </div>

              {physicalSteps.length === 0 ? (
                <div className="bg-black rounded-sm p-6 border border-white text-center">
                  <p className="text-ama text-sm font-herm">
                    {dict?.noPhysicalStepsConfigured}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {physicalSteps.map((step, index) => (
                    <div
                      key={index}
                      className="bg-black rounded-sm p-4 border border-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-herm text-white">
                          Step {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removePhysicalStep(index)}
                          className="text-fresa hover:text-ama text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-herm text-ama mb-1">
                            Primary Performer Address
                          </label>
                          <input
                            type="text"
                            value={step.primaryPerformer}
                            onChange={(e) =>
                              updatePhysicalStep(index, {
                                ...step,
                                primaryPerformer: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-black border border-white rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama"
                            placeholder="0x..."
                          />
                          <div className="mt-1 text-xs text-ama">
                            Primary share: {(calculatePrimaryPerformerSplit(step) / 100).toFixed(2)}%
                            {calculatePrimaryPerformerSplit(step) === 0 && " (Coordinator)"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-herm text-ama mb-1">
                            Instructions
                          </label>
                          <textarea
                            value={step.instructions}
                            onChange={(e) =>
                              updatePhysicalStep(index, {
                                ...step,
                                instructions: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-black border border-white rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama resize-none"
                            placeholder={dict?.stepInstructionsPlaceholder}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-herm text-ama">
                              Sub-Performers
                            </label>
                            <button
                              type="button"
                              onClick={() => addSubPerformer(index, false)}
                              className="px-2 py-1 bg-white hover:opacity-70 text-black text-xs font-herm rounded-sm"
                            >
                              Add Sub-Performer
                            </button>
                          </div>
                          
                          {step.subPerformers.length === 0 ? (
                            <div className="text-xs text-ama italic">
                              No sub-performers added
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {step.subPerformers.map((sub, subIndex) => (
                                <div key={subIndex} className="bg-black rounded p-3 border border-white">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-ama font-herm">
                                      Sub-Performer {subIndex + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeSubPerformer(index, subIndex, false)}
                                      className="text-fresa hover:text-ama text-xs"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-ama mb-1">
                                        Address
                                      </label>
                                      <input
                                        type="text"
                                        value={sub.performer}
                                        onChange={(e) =>
                                          updateSubPerformer(index, subIndex, {
                                            ...sub,
                                            performer: e.target.value,
                                          }, false)
                                        }
                                        className="w-full px-2 py-1 bg-black border border-white rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama"
                                        placeholder="0x..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs text-ama mb-1">
                                        Split (%)
                                      </label>
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={sub.splitBasisPoints / 100}
                                        onChange={(e) =>
                                          updateSubPerformer(index, subIndex, {
                                            ...sub,
                                            splitBasisPoints: Math.round((parseFloat(e.target.value) || 0) * 100),
                                          }, false)
                                        }
                                        className="w-full px-2 py-1 bg-black border border-white rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-ama focus:border-ama"
                                        placeholder="10.00"
                                      />
                                      <div className="text-xs text-ama mt-1">
                                        {sub.splitBasisPoints / 100}% split
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 border border-white hover:bg-white hover:text-black text-white font-herm rounded-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={validating}
              className="flex-1 px-4 py-3 bg-white hover:opacity-70 disabled:opacity-50 text-black font-herm rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {validating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  Validating...
                </>
              ) : (
                dict?.saveWorkflow
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};