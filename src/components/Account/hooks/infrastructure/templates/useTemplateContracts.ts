import { useState, useEffect, useCallback } from "react";
import { getTemplateContracts } from "@/lib/subgraph/queries/getContracts";
import { TemplateContract } from "../../../types";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";
import { ensureMetadata } from "@/lib/helpers/metadata";

export const useTemplateContracts = (infraId: string) => {
  const [templateContracts, setTemplateContracts] = useState<
    TemplateContract[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplateContracts = useCallback(async () => {
    if (!infraId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getTemplateContracts(
        convertInfraIdToBytes32(infraId)
      );
      if (result?.data?.templateContracts) {
        const processedContracts = await Promise.all(
          result.data.templateContracts.map(async (contract: any) => {
            const processedContract = await ensureMetadata(contract);
            return {
              ...processedContract,
              infraId: contract.infraId,
            };
          })
        );
        setTemplateContracts(processedContracts);
      } else {
        setTemplateContracts([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch template contracts";
      setError(errorMessage);
      setTemplateContracts([]);
    } finally {
      setLoading(false);
    }
  }, [infraId]);

  useEffect(() => {
    fetchTemplateContracts();
  }, [fetchTemplateContracts]);

  const refetch = useCallback(() => {
    fetchTemplateContracts();
  }, [fetchTemplateContracts]);

  return {
    templateContracts,
    loading,
    error,
    refetch,
  };
};
