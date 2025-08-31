import { useState, useCallback } from "react";
import { FulfillmentStep, Workflow, SubPerformer } from "../types";

export const useFulfillmentWorkflow = (initialWorkflow?: Workflow) => {
  const [digitalSteps, setDigitalSteps] = useState<FulfillmentStep[]>(
    initialWorkflow?.digitalSteps || []
  );
  const [physicalSteps, setPhysicalSteps] = useState<FulfillmentStep[]>(
    initialWorkflow?.physicalSteps || []
  );

  const createEmptyStep = (): FulfillmentStep => ({
    primaryPerformer: "",
    instructions: "",
    subPerformers: [],
  });

  const addDigitalStep = useCallback(() => {
    setDigitalSteps((prev) => [...prev, createEmptyStep()]);
  }, []);

  const addPhysicalStep = useCallback(() => {
    setPhysicalSteps((prev) => [...prev, createEmptyStep()]);
  }, []);

  const removeDigitalStep = useCallback((index: number) => {
    setDigitalSteps((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const removePhysicalStep = useCallback((index: number) => {
    setPhysicalSteps((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateDigitalStep = useCallback(
    (index: number, step: FulfillmentStep) => {
      setDigitalSteps((prev) => prev.map((s, i) => (i === index ? step : s)));
    },
    []
  );

  const updatePhysicalStep = useCallback(
    (index: number, step: FulfillmentStep) => {
      setPhysicalSteps((prev) => prev.map((s, i) => (i === index ? step : s)));
    },
    []
  );

  const addSubPerformer = useCallback(
    (stepIndex: number, isDigital: boolean) => {
      const newSubPerformer: SubPerformer = {
        splitBasisPoints: 0,
        performer: "",
      };

      if (isDigital) {
        setDigitalSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? {
                  ...step,
                  subPerformers: [...step.subPerformers, newSubPerformer],
                }
              : step
          )
        );
      } else {
        setPhysicalSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? {
                  ...step,
                  subPerformers: [...step.subPerformers, newSubPerformer],
                }
              : step
          )
        );
      }
    },
    []
  );

  const removeSubPerformer = useCallback(
    (stepIndex: number, subIndex: number, isDigital: boolean) => {
      if (isDigital) {
        setDigitalSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? {
                  ...step,
                  subPerformers: step.subPerformers.filter(
                    (_, j) => j !== subIndex
                  ),
                }
              : step
          )
        );
      } else {
        setPhysicalSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? {
                  ...step,
                  subPerformers: step.subPerformers.filter(
                    (_, j) => j !== subIndex
                  ),
                }
              : step
          )
        );
      }
    },
    []
  );

  const updateSubPerformer = useCallback(
    (
      stepIndex: number,
      subIndex: number,
      subPerformer: SubPerformer,
      isDigital: boolean
    ) => {
      if (isDigital) {
        setDigitalSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? {
                  ...step,
                  subPerformers: step.subPerformers.map((sub, j) =>
                    j === subIndex ? subPerformer : sub
                  ),
                }
              : step
          )
        );
      } else {
        setPhysicalSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? {
                  ...step,
                  subPerformers: step.subPerformers.map((sub, j) =>
                    j === subIndex ? subPerformer : sub
                  ),
                }
              : step
          )
        );
      }
    },
    []
  );

  const calculatePrimaryPerformerSplit = useCallback(
    (step: FulfillmentStep): number => {
      const totalSubSplit = step.subPerformers.reduce(
        (total, sub) => total + sub.splitBasisPoints,
        0
      );
      return Math.max(0, 10000 - totalSubSplit);
    },
    []
  );

  const resetWorkflow = useCallback(() => {
    setDigitalSteps(initialWorkflow?.digitalSteps || []);
    setPhysicalSteps(initialWorkflow?.physicalSteps || []);
  }, [initialWorkflow]);

  return {
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
  };
};
