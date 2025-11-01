import { useState, useEffect, useCallback, useContext } from "react";
import { getTemplates } from "@/lib/subgraph/queries/getItems";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { parseEther } from "viem";
import { getABI } from "@/abis";
import { CreateItemFormData } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";
import { Template } from "@/components/Item/types";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import {
  validateDemandForTemplate,
  validateFuturesCredits,
} from "@/lib/helpers/demandValidation";

const ITEMS_PER_PAGE = 20;

export const useTemplateItems = (contractAddress: string, dict: any) => {
  const [templateItems, setTemplateItems] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const context = useContext(AppContext);

  const fetchTemplateItems = useCallback(
    async (reset = false) => {
      if (!contractAddress) return;
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const currentSkip = reset ? 0 : skip;
        const result = await getTemplates(
          contractAddress,
          ITEMS_PER_PAGE,
          currentSkip
        );

        if (result?.data?.templates) {
          const processedItems: Template[] = await Promise.all(
            result?.data?.templates.map(async (item: any) => {
              const processedItem = await ensureMetadata(item);

              return {
                templateId: item.templateId,
                templateContract: item.templateContract,
                maxDigitalEditions: item.maxDigitalEditions || "0",
                currentDigitalEditions: item.currentDigitalEditions || "0",
                supplier: item.supplier || "Unknown",
                supplierProfile: item.supplierProfile || {
                  uri: "",
                  version: "",
                  metadata: { title: "", image: "", description: "", link: "" },
                },
                isTemplate: true,
                childType: item.childType || "Unknown",
                scm: item.scm || "Unknown",
                title:
                  processedItem.metadata?.title ||
                  item.title ||
                  `${item.__typename} ${item.templateId}`,
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
                  customFields: {},
                },
                infraId: item.infraId,
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
                childReferences: item.childReferences || [],
              } as Template;
            })
          );

          if (reset) {
            setTemplateItems(processedItems);
            setSkip(ITEMS_PER_PAGE);
          } else {
            setTemplateItems((prev) => [...prev, ...processedItems]);
            setSkip((prev) => prev + ITEMS_PER_PAGE);
          }

          if (processedItems.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          }
        } else {
          if (reset) {
            setTemplateItems([]);
          }
          setHasMore(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : dict?.failedToFetchTemplateItems;
        setError(errorMessage);
        if (reset) {
          setTemplateItems([]);
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
      fetchTemplateItems(false);
    }
  }, [fetchTemplateItems, loading, hasMore]);

  const refetch = useCallback(() => {
    setSkip(0);
    setHasMore(true);
    fetchTemplateItems(true);
  }, [fetchTemplateItems]);

  useEffect(() => {
    fetchTemplateItems(true);
  }, [contractAddress]);

  const createTemplate = useCallback(
    async (formData: CreateItemFormData) => {
      if (!walletClient || !publicClient) {
        throw new Error(dict?.walletNotConnected);
      }

      setCreateLoading(true);
      try {
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

        let imageHash = "";
        if (formData.metadata.image) {
          imageHash = await uploadImageToIPFS(formData.metadata.image);
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

        const createTemplateParams = {
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
          childUri: `ipfs://${metadataHash}`,
          authorizedMarkets:
            formData.authorizedMarkets as any as `0x${string}`[],
          futures: {
            deadline: BigInt("0"),
            maxDigitalEditions: BigInt("0"),
            settlementRewardBPS: BigInt("0"),
            isFutures: false,
          },
        };

        const placements = await Promise.all(
          formData.childReferences?.map(async (ref) => {
            const placementData = {
              instructions: ref.metadata.instructions || "",
              customFields: ref.metadata.customFields || {},
            };
            const placementHash = await uploadJSONToIPFS(placementData);

            return {
              childId: BigInt(ref.childId),
              amount: BigInt(ref.amount),
              prepaidAmount: BigInt("0"),
              prepaidUsed: BigInt("0"),
              childContract: ref.childContract as `0x${string}`,
              placementURI: `ipfs://${placementHash}`,
            };
          }) || []
        );

        const templateEditions = BigInt(formData.maxPhysicalEditions || "0");

        if (formData.childReferences && formData.childReferences.length > 0) {
          const childRefsInput = formData.childReferences.map((ref) => ({
            childContract: ref.childContract,
            childId: ref.childId,
            amount: ref.amount,
            isTemplate: false,
          }));

          const validation = await validateDemandForTemplate(
            childRefsInput,
            templateEditions,
            dict
          );

          if (!validation.isValid) {
            const errorMsg = `${
              dict?.insufficientSupply
            }:\n${validation.errors.join("\n")}`;
            throw new Error(errorMsg);
          }

          if (address) {
            const futuresValidation = await validateFuturesCredits(
              childRefsInput,
              templateEditions,
              address,
              formData.availability,
              dict
            );

            if (!futuresValidation.isValid) {
              const errorMsg = `${
                dict?.insufficientFuturesCredits
              }:\n${futuresValidation.errors.join("\n")}`;
              throw new Error(errorMsg);
            }
          }
        }

        const hash = await walletClient.writeContract({
          address: contractAddress as `0x${string}`,
          abi: getABI("FGOTemplateChild"),
          functionName: "reserveTemplate",
          args: [createTemplateParams, placements],
        });

        await publicClient.waitForTransactionReceipt({
          hash,
        });

        context?.showSuccess(dict?.templateCreatedSuccessfully, hash);

        refetch();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : dict?.failedToCreateTemplate;
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
      address,
      dict,
      context,
      refetch,
    ]
  );

  return {
    templateItems,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    createTemplate,
    createLoading,
  };
};
