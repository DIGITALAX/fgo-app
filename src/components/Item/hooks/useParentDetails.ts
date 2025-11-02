import { useState, useEffect, useCallback } from "react";
import { getParent } from "@/lib/subgraph/queries/getItems";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { fetchMetadataFromIPFS } from "@/lib/helpers/ipfs";
import { ChildReference, Parent, FulfillmentStep } from "@/components/Account/types";

export const useParentDetails = (
  contractAddress: string,
  designId: string | number,
  dict: any
) => {
  const [parent, setParent] = useState<Parent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParent = useCallback(async () => {
    if (!designId || !contractAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getParent(Number(designId), contractAddress);
      if (result?.data?.parents && result.data.parents.length > 0) {
        const parentData = result.data.parents[0];

        if (parentData.childReferences) {
          parentData.childReferences = parentData.childReferences.map(
            (childRef: any) => ({
              ...childRef,
              child: childRef.isTemplate
                ? childRef.childTemplate
                : childRef.child,
            })
          );
        }

        const processedParent = await ensureMetadata(parentData);

        if (processedParent.workflow) {
          const resolveWorkflowSteps = async (steps: FulfillmentStep[]) => {
            return Promise.all(
              steps.map(async (step) => {
                let resolvedInstructions = step.instructions || "";
                if (
                  step.instructions &&
                  typeof step.instructions === "string" &&
                  step.instructions.startsWith("ipfs://")
                ) {
                  try {
                    const instructionsData = await fetchMetadataFromIPFS(
                      step.instructions
                    );
                    resolvedInstructions =
                      instructionsData?.instructions || step.instructions;
                  } catch (error) {
                    resolvedInstructions = step.instructions;
                  }
                }

                return {
                  ...step,
                  instructions: resolvedInstructions,
                };
              })
            );
          };

          const resolvedDigitalSteps = await resolveWorkflowSteps(
            processedParent.workflow.digitalSteps || []
          );
          const resolvedPhysicalSteps = await resolveWorkflowSteps(
            processedParent.workflow.physicalSteps || []
          );

          processedParent.workflow = {
            ...processedParent.workflow,
            digitalSteps: resolvedDigitalSteps,
            physicalSteps: resolvedPhysicalSteps,
          };
        }

        let finalAuthorizedChildren = [
          ...(processedParent.authorizedChildren || []),
        ];

        if (
          Number(processedParent.status) === 2 &&
          processedParent.childReferences
        ) {
          const childRefsToAdd = await Promise.all(
            processedParent.childReferences
              .filter((childRef: ChildReference) => {
                const childKey = `${childRef.childContract}-${childRef.childId}`;
                return !finalAuthorizedChildren.some(
                  (authChild: any) =>
                    `${authChild.childContract}-${authChild.childId}` ===
                    childKey
                );
              })
              .map(async (childRef: ChildReference) => {
                let metadata = { title: "", image: "" };
                if (childRef.placementURI) {
                  try {
                    const childMetadata = await ensureMetadata({
                      uri: childRef?.child?.uri,
                    });
                    metadata = {
                      title:
                        childMetadata.metadata?.title ||
                        `Child ${childRef.childId}`,
                      image: childMetadata.metadata?.image || "",
                    };
                  } catch (error) {}
                }

                return {
                  childContract: childRef.childContract,
                  childId: childRef.childId,
                  placementURI: childRef.placementURI,
                  isTemplate: childRef?.isTemplate,
                  metadata,
                  futures: childRef?.child?.futures,
                };
              })
          );
          finalAuthorizedChildren = [
            ...finalAuthorizedChildren,
            ...childRefsToAdd,
          ];
        }

        setParent({
          ...processedParent,
          authorizedChildren: finalAuthorizedChildren,
        });
      } else {
        setParent(null);
        setError(dict?.parentNotFound);
      }
    } catch (err) {
      setError(dict?.failedToLoadParentDetails);
      setParent(null);
    } finally {
      setIsLoading(false);
    }
  }, [designId, contractAddress]);

  useEffect(() => {
    fetchParent();
  }, [fetchParent]);

  const refetch = useCallback(() => {
    fetchParent();
  }, [fetchParent]);

  return {
    parent,
    isLoading,
    error,
    refetch,
  };
};
