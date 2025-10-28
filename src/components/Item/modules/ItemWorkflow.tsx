import { FulfillmentStep, SubPerformer } from "@/components/Account/types";
import { ItemWorkflowProps } from "../types";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ItemWorkflow = ({ item, dict }: ItemWorkflowProps) => {
  const workflow = item.workflow;

  if (
    !workflow ||
    (!workflow.digitalSteps?.length && !workflow.physicalSteps?.length)
  ) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "Not specified";

    const weeks = Math.floor(seconds / 604800);
    const days = Math.floor((seconds % 604800) / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    if (minutes > 0)
      parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

    return parts.length > 0 ? parts.join(", ") : `${seconds} seconds`;
  };

  return (
    <FancyBorder type="diamond" color="oro" className="bg-black p-6 space-y-4">
      <h3 className="text-lg font-agency uppercase text-white mb-4">
        {dict?.fulfillmentWorkflow}
      </h3>

      <div className="space-y-6">
        {workflow.estimatedDeliveryDuration > 0 && (
          <div className="space-y-2">
            <span className="text-oro font-agency">
              {dict?.estimatedDeliveryDuration}
            </span>
            <p className="text-white font-slim text-sm">
              {formatDuration(workflow.estimatedDeliveryDuration)}
            </p>
          </div>
        )}
        {workflow.digitalSteps?.length > 0 && (
          <div className="space-y-3">
            <span className="text-oro font-agency">
              {dict?.digitalSteps} ({workflow.digitalSteps.length})
            </span>
            <div className="space-y-3">
              {workflow.digitalSteps.map((step: FulfillmentStep, index: number) => (
                <div key={index} className="bg-black/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-oro font-agency text-sm">
                      {dict?.step} {index + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-oro font-agency text-sm">
                        {dict?.primaryPerformer}:
                      </span>
                      <p className="text-white break-all font-pixel text-xs">
                        {step.fulfiller?.metadata?.title ??
                          step.fulfiller?.fulfiller}
                      </p>
                    </div>

                    {step.instructions && (
                      <div className="space-y-1">
                        <span className="text-oro font-agency text-sm">
                          {dict?.instructions}:
                        </span>
                        <p className="text-white font-slim text-sm">
                          {step.instructions}
                        </p>
                      </div>
                    )}

                    {step.subPerformers?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-oro font-agency text-sm">
                          {dict?.subPerformers} ({step.subPerformers.length}):
                        </span>
                        <div className="space-y-1">
                          {step.subPerformers.map(
                            (sub: SubPerformer, subIndex: number) => (
                              <div
                                key={subIndex}
                                className="flex items-center justify-between"
                              >
                                <span className="text-white break-all font-pixel text-xs">
                                  {sub.performer}
                                </span>
                                <span className="text-mar font-slim text-xs">
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
          <div className="space-y-3">
            <span className="text-oro font-agency">
              {dict?.physicalSteps} ({workflow.physicalSteps.length})
            </span>
            <div className="space-y-3">
              {workflow.physicalSteps.map((step: FulfillmentStep, index: number) => (
                <div key={index} className="bg-black/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-oro font-agency text-sm">
                      {dict?.step} {index + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-oro font-agency text-sm">
                        {dict?.primaryPerformer}:
                      </span>
                      <p className="text-white font-pixel break-all text-xs">
                        {step.fulfiller?.metadata?.title ??
                          step.fulfiller?.fulfiller}
                      </p>
                    </div>

                    {step.instructions && (
                      <div className="space-y-1">
                        <span className="text-oro font-agency text-sm">
                          {dict?.instructions}:
                        </span>
                        <p className="text-white font-slim text-sm">
                          {step.instructions}
                        </p>
                      </div>
                    )}

                    {step.subPerformers?.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-oro font-agency text-sm">
                          {dict?.subPerformers} ({step.subPerformers.length}):
                        </span>
                        <div className="space-y-1">
                          {step.subPerformers.map(
                            (sub: SubPerformer, subIndex: number) => (
                              <div
                                key={subIndex}
                                className="flex items-center justify-between"
                              >
                                <span className="text-white break-all font-pixel text-xs">
                                  {sub.performer}
                                </span>
                                <span className="text-mar font-slim text-xs">
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
    </FancyBorder>
  );
};
