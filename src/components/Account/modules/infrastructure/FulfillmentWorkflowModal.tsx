import { useFulfillmentWorkflow } from "../../hooks/useFulfillmentWorkflow";
import { FulfillmentWorkflowModalProps } from "../../types";
import { validateWorkflowSteps } from "@/lib/helpers/validation";
import { getFulfiller } from "@/lib/subgraph/queries/getFGOUser";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { useState, useContext, useRef, useCallback } from "react";
import { AppContext } from "@/lib/providers/Providers";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

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
    estimatedDeliveryDuration,
    setEstimatedDeliveryDuration,
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
      ...(availability !== 0 ? physicalSteps : []),
    ];

    const validation = validateWorkflowSteps(stepsToValidate);
    if (!validation.isValid) {
      context?.showError(
        dict?.workflowValidationFailedErrors?.replace(
          "{errors}",
          validation.errors.join("\n")
        ) || `Workflow validation failed:\n${validation.errors.join("\n")}`
      );
      setValidating(false);
      return;
    }

    if (cancelledRef.current) {
      setValidating(false);
      return;
    }

    const primaryPerformers = stepsToValidate
      .map((step) => step.primaryPerformer)
      .filter(Boolean);

    for (const performer of primaryPerformers) {
      if (cancelledRef.current) {
        setValidating(false);
        return;
      }

      try {
        const result = await getFulfiller(
          convertInfraIdToBytes32(infraId),
          performer
        );

        if (cancelledRef.current) {
          setValidating(false);
          return;
        }

        if (!result?.data?.fulfillers?.[0]) {
          if (!cancelledRef.current) {
            context?.showError(
              dict?.primaryPerformerNotRegistered?.replace(
                "{performer}",
                performer
              ) ||
                `Primary performer ${performer} is not registered as a fulfiller in this infrastructure. Please add them as a fulfiller first.`
            );
          }
          setValidating(false);
          return;
        }
      } catch (error) {
        if (!cancelledRef.current) {
          context?.showError(
            dict?.failedToValidateFulfiller?.replace(
              "{performer}",
              performer
            ) || `Failed to validate fulfiller ${performer}. Please try again.`
          );
        }
        setValidating(false);
        return;
      }
    }

    const cleanSteps = (steps: any[]) => {
      return steps.map((step) => ({
        ...step,
        subPerformers: step.subPerformers.filter(
          (sub: any) => sub.splitBasisPoints > 0
        ),
      }));
    };

    const workflow = {
      estimatedDeliveryDuration,
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
          <Image
            src={"/images/borderblue.png"}
            draggable={false}
            objectFit="fill"
            fill
            alt="border"
          />
        </div>
        <div className="relative z-10 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-awk uppercase text-oro">
                {dict?.fulfillmentWorkflowConfiguration ||
                  "Fulfillment Workflow Configuration"}
              </h2>
              <p className="text-sm text-gris mt-2 font-chicago">
                {dict?.defineStepsForFulfillment ||
                  "Define the steps required to fulfill orders for this design."}
              </p>
            </div>
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

        <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-6">
            {showPhysical && (
              <FancyBorder type="diamond" color="oro" className="relative mb-6">
                <div className="relative z-10 p-4 space-y-3">
                  <label className="block text-sm font-chicago text-gris">
                    {dict?.estimatedDeliveryDuration ||
                      "Estimated Delivery Duration (seconds)"}
                  </label>
                  <FancyBorder color="white" type="circle" className="relative">
                    <input
                      type="number"
                      min="0"
                      value={estimatedDeliveryDuration}
                      onChange={(e) =>
                        setEstimatedDeliveryDuration(parseInt(e.target.value))
                      }
                      className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none bg-transparent"
                      placeholder="3600"
                    />
                  </FancyBorder>
                  <div className="text-xs text-gris font-chicago">
                    {dict?.exampleDurations ||
                      "Examples: 3600 = 1 hour, 86400 = 1 day, 604800 = 1 week"}
                  </div>
                </div>
              </FancyBorder>
            )}
            {showDigital && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-awk uppercase text-oro">
                    {dict?.digitalSteps}
                  </h3>
                  <div
                    onClick={addDigitalStep}
                    className="relative cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
                      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                        <Image
                          src={"/images/borderoro2.png"}
                          draggable={false}
                          objectFit="fill"
                          fill
                          alt="border"
                        />
                      </div>
                      <span className="relative z-10">{dict?.addStep}</span>
                    </div>
                  </div>
                </div>

                {digitalSteps.length === 0 ? (
                  <div className="relative">
                    <div className="relative z-10 p-6 text-center">
                      <p className="text-gris text-sm font-chicago">
                        {dict?.noDigitalStepsConfigured}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {digitalSteps.map((step, index) => (
                      <div key={index} className="relative">
                        <div className="relative z-10 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-awk uppercase text-oro text-sm">
                              {dict?.step} {index + 1}
                            </h4>
                            <div
                              onClick={() => removeDigitalStep(index)}
                              className="text-fresa hover:text-white text-sm font-chicago cursor-pointer transition-colors"
                            >
                              {dict?.remove}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-chicago text-gris mb-2">
                                {dict?.primaryPerformerAddress ||
                                  "Primary Performer Address"}
                              </label>
                              <FancyBorder
                                color="white"
                                type="circle"
                                className="relative"
                              >
                                <input
                                  type="text"
                                  value={step.primaryPerformer}
                                  onChange={(e) =>
                                    updateDigitalStep(index, {
                                      ...step,
                                      primaryPerformer: e.target.value,
                                    })
                                  }
                                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none bg-transparent"
                                  placeholder="0x..."
                                />
                              </FancyBorder>
                              <div className="mt-1 text-xs text-gris font-chicago">
                                {dict?.primaryShare}:{" "}
                                {(
                                  calculatePrimaryPerformerSplit(step) / 100
                                ).toFixed(2)}
                                %
                                {calculatePrimaryPerformerSplit(step) === 0 &&
                                  ` (${dict?.coordinator})`}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-chicago text-gris mb-2">
                                {dict?.instructions}
                              </label>
                              <FancyBorder
                                type="diamond"
                                color="oro"
                                className="relative"
                              >
                                <textarea
                                  value={step.instructions}
                                  onChange={(e) =>
                                    updateDigitalStep(index, {
                                      ...step,
                                      instructions: e.target.value,
                                    })
                                  }
                                  rows={3}
                                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm resize-none focus:outline-none bg-transparent"
                                  placeholder={
                                    dict?.stepInstructionsPlaceholder
                                  }
                                />
                              </FancyBorder>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-chicago text-gris">
                                  {dict?.subPerformers}
                                </label>
                                <div
                                  onClick={() => addSubPerformer(index, true)}
                                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
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
                                      {dict?.addSubPerformer ||
                                        "add sub-performer"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {step.subPerformers.length === 0 ? (
                                <div className="text-xs text-gris italic font-chicago">
                                  {dict?.noSubPerformersAdded ||
                                    "No sub-performers added"}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {step.subPerformers.map((sub, subIndex) => (
                                    <div key={subIndex} className="relative">
                                      <div className="relative z-10 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-gris font-chicago">
                                            {dict?.subPerformer ||
                                              "Sub-Performer"}{" "}
                                            {subIndex + 1}
                                          </span>
                                          <div
                                            onClick={() =>
                                              removeSubPerformer(
                                                index,
                                                subIndex,
                                                true
                                              )
                                            }
                                            className="text-fresa hover:text-white text-xs font-chicago cursor-pointer transition-colors"
                                          >
                                            {dict?.remove}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-xs text-gris font-chicago mb-1">
                                              {dict?.address}
                                            </label>
                                            <FancyBorder
                                              color="white"
                                              type="circle"
                                              className="relative"
                                            >
                                              <input
                                                type="text"
                                                value={sub.performer}
                                                onChange={(e) =>
                                                  updateSubPerformer(
                                                    index,
                                                    subIndex,
                                                    {
                                                      ...sub,
                                                      performer: e.target.value,
                                                    },
                                                    true
                                                  )
                                                }
                                                className="relative z-10 w-full px-2 py-1 text-gris font-chicago text-xs focus:outline-none bg-transparent"
                                                placeholder="0x..."
                                              />
                                            </FancyBorder>
                                          </div>

                                          <div>
                                            <label className="block text-xs text-gris font-chicago mb-1">
                                              {dict?.splitPercent ||
                                                "Split (%)"}
                                            </label>
                                            <FancyBorder
                                              color="white"
                                              type="circle"
                                              className="relative"
                                            >
                                              <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={
                                                  sub.splitBasisPoints / 100
                                                }
                                                onChange={(e) =>
                                                  updateSubPerformer(
                                                    index,
                                                    subIndex,
                                                    {
                                                      ...sub,
                                                      splitBasisPoints:
                                                        Math.round(
                                                          (parseFloat(
                                                            e.target.value
                                                          ) || 0) * 100
                                                        ),
                                                    },
                                                    true
                                                  )
                                                }
                                                className="relative z-10 w-full px-2 py-1 text-gris font-chicago text-xs focus:outline-none bg-transparent"
                                                placeholder="10.00"
                                              />
                                            </FancyBorder>
                                            <div className="text-xs text-gris mt-1 font-chicago">
                                              {sub.splitBasisPoints / 100}%{" "}
                                              {dict?.split}
                                            </div>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showPhysical && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-awk uppercase text-oro">
                    {dict?.physicalSteps}
                  </h3>
                  <div
                    onClick={addPhysicalStep}
                    className="relative cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="text-xs text-gris font-chicago relative lowercase flex px-3 py-1 bg-offNegro">
                      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                        <Image
                          src={"/images/borderoro2.png"}
                          draggable={false}
                          objectFit="fill"
                          fill
                          alt="border"
                        />
                      </div>
                      <span className="relative z-10">{dict?.addStep}</span>
                    </div>
                  </div>
                </div>

                {physicalSteps.length === 0 ? (
                  <FancyBorder color="oro" type="diamond" className="relative">
                    <div className="relative z-10 p-6 text-center">
                      <p className="text-gris text-sm font-chicago">
                        {dict?.noPhysicalStepsConfigured ||
                          "No physical steps configured"}
                      </p>
                    </div>
                  </FancyBorder>
                ) : (
                  <div className="space-y-4">
                    {physicalSteps.map((step, index) => (
                      <div key={index} className="relative">
                        <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                          <Image
                            src={"/images/borderpurple.png"}
                            draggable={false}
                            objectFit="fill"
                            fill
                            alt="border"
                          />
                        </div>
                        <div className="relative z-10 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-awk uppercase text-oro text-sm">
                              {dict?.step} {index + 1}
                            </h4>
                            <div
                              onClick={() => removePhysicalStep(index)}
                              className="text-fresa hover:text-white text-sm font-chicago cursor-pointer transition-colors"
                            >
                              {dict?.remove}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-chicago text-gris mb-2">
                                {dict?.primaryPerformerAddress ||
                                  "Primary Performer Address"}
                              </label>
                              <FancyBorder
                                color="white"
                                type="circle"
                                className="relative"
                              >
                                <input
                                  type="text"
                                  value={step.primaryPerformer}
                                  onChange={(e) =>
                                    updatePhysicalStep(index, {
                                      ...step,
                                      primaryPerformer: e.target.value,
                                    })
                                  }
                                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none bg-transparent"
                                  placeholder="0x..."
                                />
                              </FancyBorder>
                              <div className="mt-1 text-xs text-gris font-chicago">
                                {dict?.primaryShare}:{" "}
                                {(
                                  calculatePrimaryPerformerSplit(step) / 100
                                ).toFixed(2)}
                                %
                                {calculatePrimaryPerformerSplit(step) === 0 &&
                                  ` (${dict?.coordinator})`}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-chicago text-gris mb-2">
                                {dict?.instructions}
                              </label>
                              <FancyBorder
                                color="oro"
                                type="diamond"
                                className="relative"
                              >
                                <textarea
                                  value={step.instructions}
                                  onChange={(e) =>
                                    updatePhysicalStep(index, {
                                      ...step,
                                      instructions: e.target.value,
                                    })
                                  }
                                  rows={3}
                                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm resize-none focus:outline-none bg-transparent"
                                  placeholder={
                                    dict?.stepInstructionsPlaceholder
                                  }
                                />
                              </FancyBorder>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-chicago text-gris">
                                  {dict?.subPerformers}
                                </label>
                                <div
                                  onClick={() => addSubPerformer(index, false)}
                                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  <div className="text-xs text-gris font-chicago relative lowercase flex px-2 py-1 bg-offNegro">
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
                                      {dict?.addSubPerformer ||
                                        "add sub-performer"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {step.subPerformers.length === 0 ? (
                                <div className="text-xs text-gris italic font-chicago">
                                  {dict?.noSubPerformersAdded ||
                                    "No sub-performers added"}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {step.subPerformers.map((sub, subIndex) => (
                                    <div key={subIndex} className="relative">
                                      <div className="relative z-10 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-gris font-chicago">
                                            {dict?.subPerformer ||
                                              "Sub-Performer"}{" "}
                                            {subIndex + 1}
                                          </span>
                                          <div
                                            onClick={() =>
                                              removeSubPerformer(
                                                index,
                                                subIndex,
                                                false
                                              )
                                            }
                                            className="text-fresa hover:text-white text-xs font-chicago cursor-pointer transition-colors"
                                          >
                                            {dict?.remove}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-xs text-gris font-chicago mb-1">
                                              {dict?.address}
                                            </label>
                                            <FancyBorder
                                              color="white"
                                              type="circle"
                                              className="relative"
                                            >
                                              <input
                                                type="text"
                                                value={sub.performer}
                                                onChange={(e) =>
                                                  updateSubPerformer(
                                                    index,
                                                    subIndex,
                                                    {
                                                      ...sub,
                                                      performer: e.target.value,
                                                    },
                                                    false
                                                  )
                                                }
                                                className="relative z-10 w-full px-2 py-1 text-gris font-chicago text-xs focus:outline-none bg-transparent"
                                                placeholder="0x..."
                                              />
                                            </FancyBorder>
                                          </div>

                                          <div>
                                            <label className="block text-xs text-gris font-chicago mb-1">
                                              {dict?.splitPercent ||
                                                "Split (%)"}
                                            </label>
                                            <FancyBorder
                                              color="white"
                                              type="circle"
                                              className="relative"
                                            >
                                              <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={
                                                  sub.splitBasisPoints / 100
                                                }
                                                onChange={(e) =>
                                                  updateSubPerformer(
                                                    index,
                                                    subIndex,
                                                    {
                                                      ...sub,
                                                      splitBasisPoints:
                                                        Math.round(
                                                          (parseFloat(
                                                            e.target.value
                                                          ) || 0) * 100
                                                        ),
                                                    },
                                                    false
                                                  )
                                                }
                                                className="relative z-10 w-full px-2 py-1 text-gris font-chicago text-xs focus:outline-none bg-transparent"
                                                placeholder="10.00"
                                              />
                                            </FancyBorder>
                                            <div className="text-xs text-gris mt-1 font-chicago">
                                              {sub.splitBasisPoints / 100}%{" "}
                                              {dict?.split}
                                            </div>
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 p-6 flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={validating}
              className="relative flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro justify-center items-center">
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
              type="button"
              onClick={handleSave}
              disabled={validating}
              className="relative flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                {validating ? (
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
                    <span className="relative z-10">{dict?.validating}...</span>
                  </>
                ) : (
                  <span className="relative z-10">{dict?.saveWorkflow}</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
