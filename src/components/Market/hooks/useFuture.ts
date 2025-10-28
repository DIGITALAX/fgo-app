import { useState, useEffect } from "react";
import { getChild } from "@/lib/subgraph/queries/getItems";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Child } from "@/components/Item/types";
import { getAvailabilityLabel } from "@/lib/helpers/availability";

export const useFuture = (contractAddress: string, childId: number, dict: any) => {
  const [child, setChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getChild(childId, contractAddress);
        if (!result?.data?.childs || result.data.childs.length === 0) {
          setError(dict?.childNotFound);
          return;
        }

        const childData = result.data.childs[0];

        const processedItem = await ensureMetadata(childData);

        setChild({
          childId: childData.childId,
          childContract: childData.childContract,
          supplier: childData.supplier || "Unknown",
          infraId: childData.infraId,
          supplierProfile: childData.supplierProfile || {
            uri: "",
            version: "",
            metadata: { title: "", image: "", description: "", link: "" },
          },
          futures: childData.futures,
          totalPrepaidUsed: childData.totalPrepaidUsed || "0",
          totalPrepaidAmount: childData.totalPrepaidAmount || "0",
          totalReservedSupply: childData.totalReservedSupply || "0",
          currentDigitalEditions: childData.currentDigitalEditions || "0",
          childType: childData.childType || "Unknown",
          scm: childData.scm || "Unknown",
          title:
            processedItem.metadata?.title ||
            childData.title ||
            `${childData.__typename} ${childData.childId}`,
          symbol: childData.symbol || "",
          digitalPrice: childData.digitalPrice,
          physicalPrice: childData.physicalPrice,
          version: childData.version || "1",
          maxPhysicalEditions: childData.maxPhysicalEditions || "0",
          currentPhysicalEditions: childData.currentPhysicalEditions || "0",
          uriVersion: childData.uriVersion || "1",
          usageCount: childData.usageCount || "0",
          supplyCount: childData.supplyCount,
          infraCurrency: childData.infraCurrency,
          uri: childData.uri,
          metadata: processedItem.metadata || {
            title: "",
            description: "",
            image: "",
            attachments: [],
            tags: [],
            prompt: "",
            aiModel: "",
            loras: [],
            workflow: "",
            version: "",
          },
          status: childData.status,
          availability: getAvailabilityLabel(childData.availability || 0, dict),
          isImmutable: childData.isImmutable || false,
          digitalMarketsOpenToAll: childData.digitalMarketsOpenToAll || false,
          physicalMarketsOpenToAll: childData.physicalMarketsOpenToAll || false,
          digitalReferencesOpenToAll:
            childData.digitalReferencesOpenToAll || false,
          physicalReferencesOpenToAll:
            childData.physicalReferencesOpenToAll || false,
          standaloneAllowed: childData.standaloneAllowed || "false",
          authorizedMarkets: childData.authorizedMarkets || "",
          createdAt: childData.createdAt,
          updatedAt: childData.updatedAt || childData.createdAt,
          blockNumber: childData.blockNumber || "0",
          blockTimestamp: childData.blockTimestamp || childData.createdAt,
          transactionHash: childData.transactionHash || "",
          authorizedParents: childData.authorizedParents || [],
          authorizedTemplates: childData.authorizedTemplates || [],
          parentRequests: childData.parentRequests || [],
          templateRequests: childData.templateRequests || [],
          marketRequests: childData.marketRequests || [],
          authorizedChildren: childData.authorizedChildren || [],
          physicalRights: childData.physicalRights || [],
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : dict?.unknownError);
      } finally {
        setIsLoading(false);
      }
    };

    if (contractAddress && childId) {
      fetchChild();
    }
  }, [contractAddress, childId, dict]);

  return {
    child,
    isLoading,
    error,
  };
};

export default useFuture;
