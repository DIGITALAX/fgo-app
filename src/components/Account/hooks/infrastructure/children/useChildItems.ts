import { useState, useEffect, useCallback, useContext } from "react";
import { getChildren } from "@/lib/subgraph/queries/getItems";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { getABI } from "@/abis";
import { CreateItemFormData } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Child } from "@/components/Item/types";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { getInfrastructureStatus } from "@/lib/subgraph/queries/getInfrastructureStatus";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

export const useChildItems = (contractAddress: string, infrastructureOrInfraId: any) => {
  const [childItems, setChildItems] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const fetchChildItems = useCallback(async () => {
    if (!contractAddress) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getChildren(contractAddress);
      if (result?.data?.childs) {
        const processedItems: Child[] = await Promise.all(
          result?.data?.childs.map(async (item: any) => {
            const processedItem = await ensureMetadata(item);

            return {
              childId: item.childId,
              childContract: item.childContract,
              supplier: item.supplier || "Unknown",
              supplierProfile: item.supplierProfile || {
                uri: "",
                version: "",
                metadata: { title: "", image: "", description: "", link: "" },
              },
              childType: item.childType || "Unknown",
              scm: item.scm || "Unknown",
              title:
                processedItem.metadata?.title ||
                item.title ||
                `${item.__typename} ${item.childId}`,
              symbol: item.symbol || "",
              digitalPrice: item.digitalPrice,
              physicalPrice: item.physicalPrice,
              version: item.version || "1",
              maxPhysicalEditions: item.maxPhysicalEditions || "0",
              currentPhysicalEditions: item.currentPhysicalEditions || "0",
              uriVersion: item.uriVersion || "1",
              usageCount: item.usageCount || "0",
              supplyCount: item.supplyCount,
              infraCurrency: item.infraCurrency,
              uri: item.uri,
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
              status: item.status,
              availability: getAvailabilityLabel(item.availability || 0),
              isImmutable: item.isImmutable || false,
              digitalMarketsOpenToAll: item.digitalMarketsOpenToAll || false,
              physicalMarketsOpenToAll: item.physicalMarketsOpenToAll || false,
              digitalReferencesOpenToAll:
                item.digitalReferencesOpenToAll || false,
              physicalReferencesOpenToAll:
                item.physicalReferencesOpenToAll || false,
              standaloneAllowed: item.standaloneAllowed || "false",
              authorizedMarkets: item.authorizedMarkets || "",
              createdAt: item.createdAt,
              updatedAt: item.updatedAt || item.createdAt,
              blockNumber: item.blockNumber || "0",
              blockTimestamp: item.blockTimestamp || item.createdAt,
              transactionHash: item.transactionHash || "",
              authorizedParents: item.authorizedParents || [],
              authorizedTemplates: item.authorizedTemplates || [],
              parentRequests: item.parentRequests || [],
              templateRequests: item.templateRequests || [],
              marketRequests: item.marketRequests || [],
              authorizedChildren: item.authorizedChildren || [],
              physicalRights: item.physicalRights || [],
            } as Child;
          })
        );
        setChildItems(processedItems);
      } else {
        setChildItems([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch child items";
      setError(errorMessage);
      setChildItems([]);
    } finally {
      setLoading(false);
    }
  }, [contractAddress]);

  useEffect(() => {
    fetchChildItems();
  }, [fetchChildItems]);

  const refetch = useCallback(() => {
    fetchChildItems();
  }, [fetchChildItems]);

  const createChild = useCallback(
    async (formData: CreateItemFormData, abortController?: AbortController) => {
      if (!walletClient || !publicClient) {
        throw new Error("Wallet not connected");
      }

      const infraId = typeof infrastructureOrInfraId === 'string' 
        ? infrastructureOrInfraId 
        : infrastructureOrInfraId?.infraId;
        
      if (infraId) {
        const isActive = await getInfrastructureStatus(convertInfraIdToBytes32(infraId));
        if (!isActive) {
          throw new Error("Infrastructure is not active");
        }
      }

      setCreateLoading(true);
      try {
        if (abortController?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        let attachmentUris: any[] = [];
        if (formData.metadata.attachments.length > 0) {
          for (const attachment of formData.metadata.attachments) {
            const attachmentHash = await uploadImageToIPFS(attachment);
            const fileType = attachment.type.split("/")[1] || attachment.type;
            attachmentUris.push({
              uri: `ipfs://${attachmentHash}`,
              type: fileType,
            });
          }
        }

        if (abortController?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        let imageHash = "";
        if (formData.metadata.image) {
          imageHash = await uploadImageToIPFS(formData.metadata.image);
        }

        if (abortController?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        const metadata = {
          title: formData.metadata.title,
          description: formData.metadata.description,
          image: imageHash ? `ipfs://${imageHash}` : "",
          attachments: attachmentUris,
          tags: formData.metadata.tags,
          prompt: formData.metadata.prompt,
          aiModel: formData.metadata.aiModel,
          loras: formData.metadata.loras,
          workflow: formData.metadata.workflow,
          version: formData.version,
        };

        const metadataHash = await uploadJSONToIPFS(metadata);

        if (abortController?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        const createChildParams = {
          digitalPrice:
            formData.availability === 1
              ? parseEther("0")
              : parseEther(formData.digitalPrice || "0"),
          physicalPrice:
            formData.availability === 0
              ? parseEther("0")
              : parseEther(formData.physicalPrice || "0"),
          version: BigInt(formData.version || "1"),
          maxPhysicalEditions: BigInt(formData.maxPhysicalEditions || "0"),
          availability: formData.availability,
          isImmutable: formData.isImmutable,
          digitalMarketsOpenToAll:
            formData.availability === 1
              ? false
              : formData.digitalMarketsOpenToAll,
          physicalMarketsOpenToAll:
            formData.availability === 0
              ? false
              : formData.physicalMarketsOpenToAll,
          digitalReferencesOpenToAll:
            formData.availability === 1
              ? false
              : formData.digitalReferencesOpenToAll,
          physicalReferencesOpenToAll:
            formData.availability === 0
              ? false
              : formData.physicalReferencesOpenToAll,
          standaloneAllowed: formData.standaloneAllowed,
          childUri: `ipfs://${metadataHash}`,
          authorizedMarkets: formData.authorizedMarkets as any as `0x${string}`[],
        };
        if (abortController?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI("FGOChild"),
          functionName: "createChild",
          args: [createChildParams],
        });

        if (abortController?.signal.aborted) {
          throw new Error('Operation cancelled');
        }

        await publicClient.waitForTransactionReceipt({
          hash,
        });

        context?.showSuccess("Child created successfully!", hash);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create child";
        context?.showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setCreateLoading(false);
      }
    },
    [contractAddress, walletClient, publicClient]
  );

  return {
    childItems,
    loading,
    error,
    refetch,
    createChild,
    createLoading,
  };
};
