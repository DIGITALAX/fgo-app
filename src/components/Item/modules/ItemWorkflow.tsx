import { ItemWorkflowProps } from "../types";

export const ItemWorkflow = ({ item }: ItemWorkflowProps) => {
  const workflow = (item as any).workflow;

  if (
    !workflow ||
    (!workflow.digitalSteps?.length && !workflow.physicalSteps?.length)
  ) {
    return null;
  }

  return (
    <div className="bg-black rounded-sm border border-white p-4">
      <h3 className="text-base font-herm text-white mb-4">
        Fulfillment Workflow
      </h3>

      <div className="space-y-6">
        {workflow.digitalSteps?.length > 0 && (
          <div>
            <h4 className="text-sm font-herm text-ama mb-3">
              Digital Steps ({workflow.digitalSteps.length})
            </h4>
            <div className="space-y-3">
              {workflow.digitalSteps.map((step: any, index: number) => (
                <div
                  key={index}
                  className="bg-black border border-white rounded-sm p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-herm text-ama">
                      Step {index + 1}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-ama font-herm">
                        Primary Performer:{" "}
                      </span>
                      <div className="text-white font-herm">
                        <div className="font-mono text-xs">
                          {step.fulfiller?.metadata?.title ??
                            step.fulfiller.fulfiller}
                        </div>
                      </div>
                    </div>

                    {step.instructions && (
                      <div>
                        <span className="text-ama font-herm">
                          Instructions:{" "}
                        </span>
                        <span className="text-white font-herm">
                          {step.instructions}
                        </span>
                      </div>
                    )}

                    {step.subPerformers?.length > 0 && (
                      <div>
                        <span className="text-ama font-herm">
                          Sub-Performers ({step.subPerformers.length}):{" "}
                        </span>
                        <div className="mt-2 space-y-1">
                          {step.subPerformers.map(
                            (sub: any, subIndex: number) => (
                              <div
                                key={subIndex}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-white font-mono">
                                  {sub.performer}
                                </span>
                                <span className="text-mar font-herm">
                                  {sub.splitBasisPoints / 100}%
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {workflow.physicalSteps?.length > 0 && (
          <div>
            <h4 className="text-sm font-herm text-ama mb-3">
              Physical Steps ({workflow.physicalSteps.length})
            </h4>
            <div className="space-y-3">
              {workflow.physicalSteps.map((step: any, index: number) => (
                <div
                  key={index}
                  className="bg-black border border-white rounded-sm p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-herm text-ama">
                      Step {index + 1}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-ama font-herm">
                        Primary Performer:{" "}
                      </span>
                      <div className="text-white font-herm">
                        <div className="font-mono text-xs">
                          {step.fulfiller?.metadata?.title ??
                            step.fulfiller.fulfiller}
                        </div>
                      </div>
                    </div>

                    {step.instructions && (
                      <div>
                        <span className="text-ama font-herm">
                          Instructions:{" "}
                        </span>
                        <span className="text-white font-herm">
                          {step.instructions}
                        </span>
                      </div>
                    )}

                    {step.subPerformers?.length > 0 && (
                      <div>
                        <span className="text-ama font-herm">
                          Sub-Performers ({step.subPerformers.length}):{" "}
                        </span>
                        <div className="mt-2 space-y-1">
                          {step.subPerformers.map(
                            (sub: any, subIndex: number) => (
                              <div
                                key={subIndex}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-white font-mono">
                                  {sub.performer}
                                </span>
                                <span className="text-mar font-herm">
                                  {sub.splitBasisPoints / 100}%
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
