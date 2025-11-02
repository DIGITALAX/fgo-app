import { useState, useEffect, useCallback, useContext } from "react";
import { getChildren } from "@/lib/subgraph/queries/getItems";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { getABI } from "@/abis";
import { CreateItemFormData } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Child } from "@/components/Item/types";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { getInfrastructureStatus } from "@/lib/subgraph/queries/getInfrastructureStatus";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

const ITEMS_PER_PAGE = 20;

export const useChildItems = (
  contractAddress: string,
  infrastructureOrInfraId: any,
  dict: any
) => {
  const [childItems, setChildItems] = useState<Child[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);
  const { address } = useAccount();

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const context = useContext(AppContext);

  const fetchChildItems = useCallback(
    async (reset = false) => {
      if (!contractAddress) return;
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const currentSkip = reset ? 0 : skip;
        const result = await getChildren(
          contractAddress,
          ITEMS_PER_PAGE,
          currentSkip
        );

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
                currentDigitalEditions: item.currentDigitalEditions || "0",
                futures: item.futures,
                totalPrepaidAmount: item.totalPrepaidAmount || "0",
                totalPrepaidUsed: item.totalPrepaidUsed || "0",
                totalReservedSupply: item.totalReservedSupply || "0",
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
                  customFields: {},
                },
                status: item.status,
                availability: getAvailabilityLabel(
                  item.availability || 0,
                  dict
                ),
                isImmutable: item.isImmutable || false,
                digitalMarketsOpenToAll: item.digitalMarketsOpenToAll || false,
                physicalMarketsOpenToAll:
                  item.physicalMarketsOpenToAll || false,
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

          if (reset) {
            setChildItems(processedItems);
            setSkip(ITEMS_PER_PAGE);
          } else {
            setChildItems((prev) => [...prev, ...processedItems]);
            setSkip((prev) => prev + ITEMS_PER_PAGE);
          }

          if (processedItems.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          }
        } else {
          if (reset) {
            setChildItems([]);
          }
          setHasMore(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : dict?.failedToFetchChildItems;
        setError(errorMessage);
        if (reset) {
          setChildItems([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [contractAddress, skip, loading, dict]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchChildItems(false);
    }
  }, [fetchChildItems, loading, hasMore]);

  const refetch = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchChildItems(true);
  }, [fetchChildItems]);

  useEffect(() => {
    fetchChildItems(true);
  }, [contractAddress]);

  const createChild = useCallback(
    async (formData: CreateItemFormData, abortController?: AbortController) => {
      if (!walletClient || !publicClient) {
        throw new Error(dict?.walletNotConnected);
      }

      const infraId =
        typeof infrastructureOrInfraId === "string"
          ? infrastructureOrInfraId
          : infrastructureOrInfraId?.infraId;

      if (infraId) {
        const isActive = await getInfrastructureStatus(
          convertInfraIdToBytes32(infraId)
        );
        if (!isActive) {
          throw new Error(dict?.infrastructureIsNotActive);
        }
      }

      setCreateLoading(true);
      try {
        if (abortController?.signal.aborted) {
          throw new Error(dict?.operationCancelled);
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
          throw new Error(dict?.operationCancelled);
        }

        let imageHash = "";
        if (formData.metadata.image) {
          imageHash = await uploadImageToIPFS(formData.metadata.image);
        }

        if (abortController?.signal.aborted) {
          throw new Error(dict?.operationCancelled);
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
          customFields: formData.metadata.customFields,
        };

        const metadataHash = await uploadJSONToIPFS(metadata);

        if (abortController?.signal.aborted) {
          throw new Error(dict?.operationCancelled);
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
          maxPhysicalEditions:
            formData.availability === 0
              ? BigInt("0")
              : BigInt(formData.maxPhysicalEditions || "0"),
          maxDigitalEditions: BigInt("0"),
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
          futures: formData.futures?.isFutures
            ? {
                deadline: BigInt(formData.futures.deadline),
                maxDigitalEditions: BigInt(formData.futures.maxDigitalEditions),
                settlementRewardBPS: BigInt(
                  formData.futures.settlementRewardBPS
                ),
                isFutures: true,
              }
            : {
                deadline: BigInt("0"),
                maxDigitalEditions: BigInt("0"),
                settlementRewardBPS: BigInt("0"),
                isFutures: false,
              },
          childUri: `ipfs://${metadataHash}`,
          authorizedMarkets:
            formData.authorizedMarkets as any as `0x${string}`[],
        };
        if (abortController?.signal.aborted) {
          throw new Error(dict?.operationCancelled);
        }
        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI("FGOChild"),
          functionName: "createChild",
          args: [createChildParams],
          account: address,
        });

        if (abortController?.signal.aborted) {
          throw new Error(dict?.operationCancelled);
        }

        await publicClient.waitForTransactionReceipt({
          hash,
        });

        context?.showSuccess(dict?.childCreatedSuccessfully, hash);

        refetch();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : dict?.failedToCreateChild;
        context?.showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setCreateLoading(false);
      }
    },
    [
      contractAddress,
      walletClient,
      publicClient,
      dict,
      infrastructureOrInfraId,
      context,
      refetch,
    ]
  );

  return {
    childItems,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    createChild,
    createLoading,
  };
};
