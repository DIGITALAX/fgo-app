import { createPublicClient, http } from "viem";
import { getCurrentNetwork } from "@/constants";
import { chains } from "@lens-chain/sdk/viem";
import { ABIS } from "@/abis";
import {
  ChildReferenceInput,
  ValidationResult,
  FuturesCreditsValidationResult,
} from "@/components/Library/types";
import { getFGOUser } from "@/lib/subgraph/queries/getFGOUser";
import { Parent } from "@/components/Account/types";

const formatMessage = (
  dict: any,
  key: string,
  fallback: string,
  params: Record<string, string | number | bigint> = {}
) => {
  const template = dict && typeof dict[key] === "string" ? dict[key] : fallback;

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    const pattern = new RegExp(`\\{${paramKey}\\}`, "g");
    return acc.replace(pattern, String(paramValue));
  }, template);
};

const getChildData = async (
  childContract: string,
  childId: string,
  publicClient: any
) => {
  const childData: any = await publicClient.readContract({
    address: childContract as `0x${string}`,
    abi: ABIS.FGOChild,
    functionName: "getChildMetadata",
    args: [BigInt(childId)],
  });

  return {
    maxPhysicalEditions: BigInt(childData.maxPhysicalEditions ?? 0),
    currentPhysicalEditions: BigInt(childData.currentPhysicalEditions ?? 0),
    currentDigitalEditions: BigInt(childData.currentDigitalEditions ?? 0),
    totalReservedSupply: BigInt(childData.totalReservedSupply ?? 0),
    maxDigitalEditions: BigInt(childData.maxDigitalEditions ?? 0),
    availability: Number(childData.availability ?? 0),
  };
};

const getTemplateData = async (
  templateContract: string,
  templateId: string,
  publicClient: any
) => {
  const templateData = await publicClient.readContract({
    address: templateContract as `0x${string}`,
    abi: ABIS.FGOTemplateChild,
    functionName: "getTemplate",
    args: [BigInt(templateId)],
  });

  const childReferences = templateData[10];

  return {
    maxPhysicalEditions: BigInt(templateData[6]),
    currentPhysicalEditions: BigInt(templateData[7]),
    currentDigitalEditions: BigInt(templateData[8]),
    totalReservedSupply: BigInt(templateData[9]),
    childReferences: childReferences,
  };
};

const toBigIntValue = (
  value: string | number | bigint | undefined | null
): bigint => {
  if (value === undefined || value === null) return BigInt(0);
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(value);
  const trimmed = value.toString().trim();
  if (trimmed === "") return BigInt(0);
  return BigInt(trimmed);
};

const getChannelLabel = (dict: any, channel: "digital" | "physical") => {
  if (!dict) {
    return channel === "digital" ? "Digital" : "Physical";
  }

  return channel === "digital"
    ? dict?.digital ?? "Digital"
    : dict?.physical ?? "Physical";
};

export const validateDemandForParent = async (
  childReferences: ChildReferenceInput[],
  parent: Parent,
  dict?: any
): Promise<ValidationResult> => {
  let parentDigitalEditions =
    typeof parent.maxDigitalEditions === "bigint"
      ? parent.maxDigitalEditions
      : toBigIntValue((parent.maxDigitalEditions as any)?.digital);

  let parentPhysicalEditions =
    typeof parent.maxPhysicalEditions === "bigint"
      ? parent.maxPhysicalEditions
      : toBigIntValue((parent.maxPhysicalEditions as any)?.physical);

  if (parentDigitalEditions < BigInt(0)) parentDigitalEditions = BigInt(0);
  if (parentPhysicalEditions < BigInt(0)) parentPhysicalEditions = BigInt(0);

  const parentNeedsDigital =
    Number(parent.availability) === 0 || Number(parent.availability) === 2;
  const parentNeedsPhysical =
    Number(parent.availability) === 1 || Number(parent.availability) === 2;

  const result: ValidationResult = {
    isValid: true,
    errors: [],
    childValidations: [],
  };

  const currentNetwork = getCurrentNetwork();
  const publicClient = createPublicClient({
    chain: currentNetwork.chainId === 37111 ? chains.testnet : chains.mainnet,
    transport: http(currentNetwork.rpcUrl),
  });

  for (const ref of childReferences) {
    try {
      if (ref.isTemplate) {
        const templateValidation = await validateDemandForTemplate(
          [ref],
          parentDigitalEditions > BigInt(0)
            ? parentDigitalEditions
            : parentPhysicalEditions,
          dict
        );

        if (!templateValidation.isValid) {
          result.isValid = false;
          result.errors.push(...templateValidation.errors);
          result.childValidations.push(...templateValidation.childValidations);
        }
      } else {
        const childData = await getChildData(
          ref.childContract,
          ref.childId,
          publicClient
        );

        const amountPerParent = toBigIntValue(ref.amount);
        const childAvailability = childData.availability;

        const digitalAvailableRaw =
          childData.maxDigitalEditions - childData.currentDigitalEditions;
        const digitalAvailable =
          digitalAvailableRaw < BigInt(0) ? BigInt(0) : digitalAvailableRaw;

        const physicalAvailableRaw =
          childData.maxPhysicalEditions -
          childData.currentPhysicalEditions -
          childData.totalReservedSupply;
        const physicalAvailable =
          physicalAvailableRaw < BigInt(0) ? BigInt(0) : physicalAvailableRaw;

        if (parentNeedsDigital) {
          const childSupportsDigital =
            childAvailability === 0 || childAvailability === 2;
          const requiredDigital = amountPerParent * parentDigitalEditions;

          if (requiredDigital > BigInt(0)) {
            result.childValidations.push({
              childContract: ref.childContract,
              childId: ref.childId,
              required: requiredDigital,
              available: digitalAvailable,
              maxEditions: childData.maxDigitalEditions,
              currentEditions: childData.currentDigitalEditions,
              reservedSupply: BigInt(0),
              channel: "digital",
            });
          }

          if (!childSupportsDigital || requiredDigital > digitalAvailable) {
            result.isValid = false;
            result.errors.push(
              formatMessage(
                dict,
                "demandChildInsufficient",
                `Child ${ref.childId} (${getChannelLabel(
                  dict,
                  "digital"
                )}): Requires ${requiredDigital} but only ${digitalAvailable} available (max: ${
                  childData.maxDigitalEditions
                }, current: ${childData.currentDigitalEditions}, reserved: 0)`,
                {
                  childId: ref.childId,
                  required: requiredDigital,
                  available: digitalAvailable,
                  max: childData.maxDigitalEditions,
                  current: childData.currentDigitalEditions,
                  reserved: BigInt(0),
                }
              )
            );
          }
        }

        if (parentNeedsPhysical) {
          const childSupportsPhysical =
            childAvailability === 1 || childAvailability === 2;
          const requiredPhysical = amountPerParent * parentPhysicalEditions;

          if (requiredPhysical > BigInt(0)) {
            result.childValidations.push({
              childContract: ref.childContract,
              childId: ref.childId,
              required: requiredPhysical,
              available: physicalAvailable,
              maxEditions: childData.maxPhysicalEditions,
              currentEditions: childData.currentPhysicalEditions,
              reservedSupply: childData.totalReservedSupply,
              channel: "physical",
            });
          }

          if (!childSupportsPhysical || requiredPhysical > physicalAvailable) {
            result.isValid = false;
            result.errors.push(
              formatMessage(
                dict,
                "demandChildInsufficient",
                `Child ${ref.childId} (${getChannelLabel(
                  dict,
                  "physical"
                )}): Requires ${requiredPhysical} but only ${physicalAvailable} available (max: ${
                  childData.maxPhysicalEditions
                }, current: ${childData.currentPhysicalEditions}, reserved: ${
                  childData.totalReservedSupply
                })`,
                {
                  childId: ref.childId,
                  required: requiredPhysical,
                  available: physicalAvailable,
                  max: childData.maxPhysicalEditions,
                  current: childData.currentPhysicalEditions,
                  reserved: childData.totalReservedSupply,
                }
              )
            );
          }
        }
      }
    } catch (error) {
      result.isValid = false;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      result.errors.push(
        formatMessage(
          dict,
          "demandChildFetchFailed",
          `Child ${ref.childId}: Failed to fetch data - ${errorMessage}`,
          {
            childId: ref.childId,
            error: errorMessage,
          }
        )
      );
    }
  }

  return result;
};

export const validateDemandForTemplate = async (
  childReferences: ChildReferenceInput[],
  templateEditions: bigint,
  dict: any
): Promise<ValidationResult> => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    childValidations: [],
  };

  const currentNetwork = getCurrentNetwork();
  const publicClient = createPublicClient({
    chain: currentNetwork.chainId === 37111 ? chains.testnet : chains.mainnet,
    transport: http(currentNetwork.rpcUrl),
  });

  for (const ref of childReferences) {
    try {
      const templateData = await getTemplateData(
        ref.childContract,
        ref.childId,
        publicClient
      );

      const amountPerTemplate = BigInt(ref.amount);
      const totalTemplateRequired = amountPerTemplate * templateEditions;
      const currentEditions =
        templateData.currentPhysicalEditions +
        templateData.currentDigitalEditions;
      const templateAvailable =
        templateData.maxPhysicalEditions -
        currentEditions -
        templateData.totalReservedSupply;

      result.childValidations.push({
        childContract: ref.childContract,
        childId: ref.childId,
        required: totalTemplateRequired,
        available: templateAvailable,
        maxEditions: templateData.maxPhysicalEditions,
        currentEditions,
        reservedSupply: templateData.totalReservedSupply,
      });

      if (totalTemplateRequired > templateAvailable) {
        result.isValid = false;
        result.errors.push(
          formatMessage(
            dict,
            "demandTemplateInsufficient",
            `Template ${ref.childId}: Requires ${totalTemplateRequired} but only ${templateAvailable} available (max: ${templateData.maxPhysicalEditions}, current: ${currentEditions}, reserved: ${templateData.totalReservedSupply})`,
            {
              templateId: ref.childId,
              required: totalTemplateRequired,
              available: templateAvailable,
              max: templateData.maxPhysicalEditions,
              current: currentEditions,
              reserved: templateData.totalReservedSupply,
            }
          )
        );
      }

      if (
        templateData.childReferences &&
        templateData.childReferences.length > 0
      ) {
        const nestedRefs: ChildReferenceInput[] =
          templateData.childReferences.map((nestedRef: any) => ({
            childContract: nestedRef[0],
            childId: nestedRef[1].toString(),
            amount: nestedRef[2].toString(),
            isTemplate: false,
          }));

        for (const nestedRef of nestedRefs) {
          const childData = await getChildData(
            nestedRef.childContract,
            nestedRef.childId,
            publicClient
          );

          const amountPerNestedChild = BigInt(nestedRef.amount);
          const totalNestedRequired =
            amountPerNestedChild * totalTemplateRequired;
          const nestedCurrentEditions =
            childData.currentPhysicalEditions +
            childData.currentDigitalEditions;
          const nestedAvailable =
            childData.maxPhysicalEditions -
            nestedCurrentEditions -
            childData.totalReservedSupply;

          result.childValidations.push({
            childContract: nestedRef.childContract,
            childId: nestedRef.childId,
            required: totalNestedRequired,
            available: nestedAvailable,
            maxEditions: childData.maxPhysicalEditions,
            currentEditions: nestedCurrentEditions,
            reservedSupply: childData.totalReservedSupply,
          });

          if (totalNestedRequired > nestedAvailable) {
            result.isValid = false;
            result.errors.push(
              formatMessage(
                dict,
                "demandTemplateChildInsufficient",
                `Template ${ref.childId} - Child ${nestedRef.childId}: Requires ${totalNestedRequired} but only ${nestedAvailable} available (max: ${childData.maxPhysicalEditions}, current: ${nestedCurrentEditions}, reserved: ${childData.totalReservedSupply})`,
                {
                  templateId: ref.childId,
                  childId: nestedRef.childId,
                  required: totalNestedRequired,
                  available: nestedAvailable,
                  max: childData.maxPhysicalEditions,
                  current: nestedCurrentEditions,
                  reserved: childData.totalReservedSupply,
                }
              )
            );
          }
        }
      }
    } catch (error) {
      result.isValid = false;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      result.errors.push(
        formatMessage(
          dict,
          "demandTemplateFetchFailed",
          `Template ${ref.childId}: Failed to fetch data - ${errorMessage}`,
          {
            templateId: ref.childId,
            error: errorMessage,
          }
        )
      );
    }
  }

  return result;
};

export const validateFuturesCredits = async (
  childReferences: ChildReferenceInput[],
  editions: bigint,
  userAddress: string,
  availability: number,
  dict: any
): Promise<FuturesCreditsValidationResult> => {
  const result: FuturesCreditsValidationResult = {
    isValid: true,
    errors: [],
    creditChecks: [],
  };

  const currentNetwork = getCurrentNetwork();
  const publicClient = createPublicClient({
    chain: currentNetwork.chainId === 37111 ? chains.testnet : chains.mainnet,
    transport: http(currentNetwork.rpcUrl),
  });

  const userDataResult = await getFGOUser(userAddress.toLowerCase());
  if (!userDataResult?.data?.fgousers?.[0]) {
    return result;
  }

  const futuresCredits = userDataResult.data.fgousers[0].futureCredits || [];

  for (const ref of childReferences) {
    try {
      const childData = await publicClient.readContract({
        address: ref.childContract as `0x${string}`,
        abi: ABIS.FGOChild,
        functionName: "getChildMetadata",
        args: [BigInt(ref.childId)],
      });

      const futures = (childData as any)[11];
      const isFutures = futures[3];

      if (!isFutures) {
        continue;
      }

      const credit = futuresCredits.find(
        (fc: any) =>
          fc.child.childContract.toLowerCase() ===
            ref.childContract.toLowerCase() && fc.child.childId === ref.childId
      );

      if (!credit) {
        result.isValid = false;
        result.errors.push(
          formatMessage(
            dict,
            "demandChildFuturesMissing",
            `Child ${ref.childId}: No futures credits found for this child`,
            {
              childId: ref.childId,
            }
          )
        );
        continue;
      }

      const amountPerEdition = BigInt(ref.amount);
      const totalRequired = amountPerEdition * editions;

      const available = BigInt(
        BigInt(credit.credits) - BigInt(credit.consumed)
      );

      const requiredDigital = availability === 1 ? BigInt(0) : totalRequired;
      const requiredPhysical = availability === 0 ? BigInt(0) : totalRequired;

      result.creditChecks.push({
        childContract: ref.childContract,
        childId: ref.childId,
        required: {
          digital: requiredDigital,
          physical: requiredPhysical,
        },
        available,
      });

      if (requiredPhysical > available) {
        result.isValid = false;
        result.errors.push(
          formatMessage(
            dict,
            "demandChildFuturesInsufficient",
            `Child ${ref.childId}: Requires ${requiredPhysical} credits but only ${available} available`,
            {
              childId: ref.childId,
              required: requiredPhysical,
              available,
            }
          )
        );
      }
    } catch (error) {
      result.isValid = false;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      result.errors.push(
        formatMessage(
          dict,
          "demandChildFuturesValidationFailed",
          `Child ${ref.childId}: Failed to validate futures credits - ${errorMessage}`,
          {
            childId: ref.childId,
            error: errorMessage,
          }
        )
      );
    }
  }

  return result;
};
