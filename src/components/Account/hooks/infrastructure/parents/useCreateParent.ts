import { useState, useContext } from "react";
import { usePublicClient, useWalletClient, useAccount } from "wagmi";
import { parseEther } from "viem";
import { ABIS } from "@/abis";
import { uploadImageToIPFS, uploadJSONToIPFS } from "@/lib/helpers/ipfs";
import { CreateItemFormData, Parent, FulfillmentStep } from "../../../types";
import { AppContext } from "@/lib/providers/Providers";
import {
  validateDemandForParent,
  validateFuturesCredits,
} from "@/lib/helpers/demandValidation";
import { getFulfiller } from "@/lib/subgraph/queries/getFGOUser";
import { convertInfraIdToBytes32 } from "@/lib/helpers/infraId";

export const useCreateParent = (
  infraId: string,
  contractAddress: string,
  dict: any
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const context = useContext(AppContext);

  const createParent = async (formData: CreateItemFormData) => {
    if (!walletClient || !publicClient) {
      setError(dict?.walletNotConnected);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = "";
      if (formData.metadata.image) {
        imageUrl = await uploadImageToIPFS(formData.metadata.image);
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

      const metadata = {
        title: formData.metadata.title,
        description: formData.metadata.description,
        image: `ipfs://${imageUrl}`,
        tags: formData.metadata.tags,
        prompt: formData.metadata.prompt,
        attachments: attachmentUris,
        aiModel: formData.metadata.aiModel,
        loras: formData.metadata.loras,
        workflow: formData.metadata.workflow,
        customFields: formData.metadata.customFields,
      };

      const metadataUri = await uploadJSONToIPFS(metadata);

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

      const totalEditions =
        (formData.availability === 1
          ? BigInt("0")
          : BigInt(formData.maxDigitalEditions || "0")) +
        (formData.availability === 0
          ? BigInt("0")
          : BigInt(formData.maxPhysicalEditions || "0"));

      const digitalPriceWei =
        formData.availability === 1
          ? BigInt(0)
          : parseEther(formData.digitalPrice || "0");
      const physicalPriceWei =
        formData.availability === 0
          ? BigInt(0)
          : parseEther(formData.physicalPrice || "0");

      const digitalSteps =
        formData.fulfillmentWorkflow?.digitalSteps ?? ([] as FulfillmentStep[]);
      const physicalSteps =
        formData.fulfillmentWorkflow?.physicalSteps ??
        ([] as FulfillmentStep[]);

      const fulfillerBasePriceCache = new Map<string, bigint>();
      const infraIdBytes32 = convertInfraIdToBytes32(infraId);

      const collectFulfillerAddresses = (steps: FulfillmentStep[]) => {
        const addresses = new Set<string>();
        steps.forEach((step) => {
          const primary = step.primaryPerformer?.toLowerCase();
          if (primary?.startsWith("0x")) {
            addresses.add(primary);
          }
          step.subPerformers?.forEach((sub) => {
            const performer = sub.performer?.toLowerCase();
            if (performer?.startsWith("0x")) {
              addresses.add(performer);
            }
          });
        });
        return Array.from(addresses);
      };

      const getFulfillerBasePrice = async (addressLower: string) => {
        if (fulfillerBasePriceCache.has(addressLower)) {
          return fulfillerBasePriceCache.get(addressLower)!;
        }

        try {
          const result = await getFulfiller(infraIdBytes32, addressLower);
          const fulfillerData = result?.data?.fulfillers?.[0];
          const basePrice = fulfillerData?.basePrice
            ? BigInt(fulfillerData.basePrice)
            : BigInt(0);
          fulfillerBasePriceCache.set(addressLower, basePrice);
          return basePrice;
        } catch (err) {
          console.error(
            `Failed to fetch fulfiller base price for ${addressLower}`,
            err
          );
          fulfillerBasePriceCache.set(addressLower, BigInt(0));
          return BigInt(0);
        }
      };

      if (digitalSteps.length > 0 && formData.availability !== 1) {
        const digitalFulfillers = collectFulfillerAddresses(digitalSteps);
        let totalDigitalBase = BigInt(0);
        for (const fulfillerAddress of digitalFulfillers) {
          totalDigitalBase += await getFulfillerBasePrice(fulfillerAddress);
        }

        if (totalDigitalBase > digitalPriceWei) {
          const message =
            dict?.parentDigitalPriceTooLow ||
            "Digital price must cover the combined base prices of all digital fulfillers.";
          context?.showError(message);
          setError(message);
          throw new Error(message);
        }
      }

      if (physicalSteps.length > 0 && formData.availability !== 0) {
        const physicalFulfillers = collectFulfillerAddresses(physicalSteps);
        let totalPhysicalBase = BigInt(0);
        for (const fulfillerAddress of physicalFulfillers) {
          totalPhysicalBase += await getFulfillerBasePrice(fulfillerAddress);
        }

        if (totalPhysicalBase > physicalPriceWei) {
          const message =
            dict?.parentPhysicalPriceTooLow ||
            "Physical price must cover the combined base prices of all physical fulfillers.";
          context?.showError(message);
          setError(message);
          throw new Error(message);
        }
      }

      if (formData.childReferences && formData.childReferences.length > 0) {
        const childRefsInput = formData.childReferences.map((ref) => ({
          childContract: ref.childContract,
          childId: ref.childId,
          amount: ref.amount,
          isTemplate: ref.isTemplate,
        }));

        const validation = await validateDemandForParent(
          childRefsInput,
          {
            maxDigitalEditions: formData.maxDigitalEditions,
            maxPhysicalEditions: formData.maxPhysicalEditions,
            availability: String(formData.availability),
          } as Parent,
          dict
        );

        if (!validation.isValid) {
          const errorMsg = `${
            dict?.insufficientSupply
          }:\n${validation.errors.join("\n")}`;
          setError(errorMsg);
          throw new Error(errorMsg);
        }

        if (address) {
          const futuresValidation = await validateFuturesCredits(
            childRefsInput,
            totalEditions,
            address,
            formData.availability,
            dict
          );

          if (!futuresValidation.isValid) {
            const errorMsg = `${
              dict?.insufficientFuturesCredits || "Insufficient futures credits"
            }:\n${futuresValidation.errors.join("\n")}`;
            setError(errorMsg);
            throw new Error(errorMsg);
          }
        }
      }

      const processWorkflowSteps = async (steps: FulfillmentStep[]) => {
        return Promise.all(
          steps.map(async (step) => {
            let instructionsUri = "";
            if (step.instructions && step.instructions.trim() !== "") {
              const instructionsHash = await uploadJSONToIPFS({
                instructions: step.instructions,
              });
              instructionsUri = `ipfs://${instructionsHash}`;
            }

            return {
              ...step,
              instructions: instructionsUri,
            };
          })
        );
      };

      const processedDigitalSteps = await processWorkflowSteps(digitalSteps);
      const processedPhysicalSteps = await processWorkflowSteps(physicalSteps);

      const processedSupplyRequests = await Promise.all(
        formData.supplyRequests?.map(async (request) => {
          const customSpecHash = await uploadJSONToIPFS({
            spec: request.customSpec,
          });

          const placementData = {
            instructions: request.metadata.instructions || "",
            customFields: request.metadata.customFields || {},
          };
          const placementHash = await uploadJSONToIPFS(placementData);

          if (request.existingChildId !== "0") {
            const childRefsInput = [
              {
                childContract: request.existingChildContract,
                childId: request.existingChildId,
                amount: request.quantity,
                isTemplate: false,
              },
            ];

            const validation = await validateDemandForParent(
              childRefsInput,
              {
                maxDigitalEditions: formData.maxDigitalEditions,
                maxPhysicalEditions: formData.maxPhysicalEditions,
                availability: String(formData.availability),
              } as Parent,

              dict
            );

            if (!validation.isValid) {
              const errorMsg = `${dict?.insufficientSupply}`;
              setError(errorMsg);
              throw new Error(errorMsg);
            }
          }

          return {
            existingChildId: BigInt(request.existingChildId || "0"),
            quantity: BigInt(request.quantity ?? 0),
            preferredMaxPrice: parseEther(request.preferredMaxPrice ?? 0),
            deadline: BigInt(request.deadline ?? 0),
            existingChildContract:
              request.existingChildContract ||
              ("0x0000000000000000000000000000000000000000" as `0x${string}`),
            isPhysical: request.isPhysical,
            fulfilled: false,
            customSpec: `ipfs://${customSpecHash}`,
            placementURI: `ipfs://${placementHash}`,
          };
        }) || []
      );

      const createParentParams = {
        digitalPrice: digitalPriceWei,
        physicalPrice: physicalPriceWei,
        maxDigitalEditions:
          formData.availability === 1
            ? BigInt("0")
            : BigInt(formData.maxDigitalEditions || "0"),
        maxPhysicalEditions:
          formData.availability === 0
            ? BigInt("0")
            : BigInt(formData.maxPhysicalEditions || "0"),
        printType: Number(formData.printType || "0"),
        availability: formData.availability,
        digitalMarketsOpenToAll: formData.digitalMarketsOpenToAll,
        physicalMarketsOpenToAll: formData.physicalMarketsOpenToAll,
        uri: `ipfs://${metadataUri}`,
        childReferences: placements,
        supplyRequests: processedSupplyRequests,
        authorizedMarkets:
          formData.authorizedMarkets || ([] as `0x${string}`[]),
        workflow: {
          estimatedDeliveryDuration: BigInt(
            formData.fulfillmentWorkflow?.estimatedDeliveryDuration ?? 0
          ),
          digitalSteps: processedDigitalSteps,
          physicalSteps: processedPhysicalSteps,
        },
      };

      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: ABIS.FGOParent,
        functionName: "reserveParent",
        args: [createParentParams],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.parentReservedSuccessfully, hash);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : dict?.failedToReserveParent;
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createParent,
    loading,
    error,
  };
};
