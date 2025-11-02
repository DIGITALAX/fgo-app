import { Fulfillment } from "@/components/Account/types";
import { INFURA_GATEWAY } from "@/constants";
import { fetchMetadataFromIPFS } from "@/lib/helpers/ipfs";
import { getAllFlows } from "@/lib/subgraph/queries/getMarkets";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const PAGE_SIZE = 10;

const useFulfillerFlow = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flows, setFlows] = useState<Fulfillment[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const fetchFlows = useCallback(
    async (skipCount: number, reset = false) => {
      if (!address) {
        setFlows([]);
        setHasMore(false);
        return;
      }

      try {
        if (reset) {
          setIsLoading(true);
          setError(null);
        }

        const result = await getAllFlows(PAGE_SIZE, skipCount, address);
        if (!result?.data) {
          setHasMore(false);
          return;
        }

        const rawFlows = result.data.fulfillers?.[0]?.fulfillments || [];
        if (rawFlows.length < PAGE_SIZE) {
          setHasMore(false);
        }

        const resolveWorkflowSteps = async (steps: any[]) => {
          if (!steps || steps.length === 0) return [];

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

        let processed = await Promise.all(
          rawFlows.map(async (flow: any) => {
            let resolvedDetails = flow?.order?.fulfillmentData;

            if (
              typeof flow?.order?.fulfillmentData === "string" &&
              flow?.order?.fulfillmentData.trim() !== ""
            ) {
              const cid = flow?.order?.fulfillmentData.includes("ipfs://")
                ? flow?.order?.fulfillmentData.split("ipfs://")?.[1]
                : flow?.order?.fulfillmentData;

              if (cid) {
                const response = await fetch(`${INFURA_GATEWAY}${cid}`);
                if (response.ok) {
                  resolvedDetails = await response.json();
                }
              }
            }

            const steps = await Promise.all(
              flow?.fulfillmentOrderSteps?.map(async (item: any) => {
                let resolvedNotes = item?.notes || "";
                if (
                  item?.notes &&
                  typeof item.notes === "string" &&
                  item.notes.startsWith("ipfs://")
                ) {
                  try {
                    const notesData = await fetchMetadataFromIPFS(item.notes);
                    resolvedNotes = typeof notesData === "string" ? notesData : notesData?.notes || item.notes;
                  } catch (error) {
                    resolvedNotes = item.notes;
                  }
                }
                return {
                  ...item,
                  notes: resolvedNotes,
                };
              })
            );

            const resolvedDigitalSteps = await resolveWorkflowSteps(
              flow?.digitalSteps || []
            );
            const resolvedPhysicalSteps = await resolveWorkflowSteps(
              flow?.physicalSteps || []
            );

            return {
              ...flow,
              fulfillmentOrderSteps: steps,
              digitalSteps: resolvedDigitalSteps,
              physicalSteps: resolvedPhysicalSteps,
              order: {
                ...flow?.order,
                fulfillmentData: resolvedDetails,
              },
            };
          })
        );

        if (reset) {
          setFlows(processed);
        } else {
          setFlows((prev) => [...prev, ...processed]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load fulfillers"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    if (address) {
      fetchFlows(0, true);
    } else {
      setFlows([]);
    }
  }, [fetchFlows, address]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    fetchFlows(nextSkip, false);
  }, [fetchFlows, hasMore, isLoading, skip]);

  const refresh = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchFlows(0, true);
  }, [fetchFlows]);

  return {
    isLoading,
    flows,
    error,
    hasMore,
    refresh,
    loadMore,
    setFlows,
  };
};

export default useFulfillerFlow;
