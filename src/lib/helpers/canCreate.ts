import { ABIS } from "@/abis";
import { Parent } from "@/components/Account/types";
import { Template } from "@/components/Item/types";
import { getCurrentNetwork } from "@/constants";
import { chains } from "@lens-chain/sdk/viem";
import { createPublicClient, http } from "viem";
import { getTemplate } from "../subgraph/queries/getItems";
import { getAvailabilityLabel } from "./availability";

const AVAILABILITY = {
  DIGITAL: 0,
  PHYSICAL: 1,
  BOTH: 2,
} as const;

const hasPhysicalAvailability = (availability: string, dict: any) =>
  availability === dict?.digitalPhysical || availability === dict?.physicalOnly;

const hasDigitalAvailability = (availability: string, dict: any) =>
  availability === dict?.digitalPhysical || availability === dict?.digitalOnly;

const toBigInt = (value?: string | number | bigint | null) => {
  if (value === undefined || value === null) return BigInt(0);
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(value);
  const trimmed = value.trim();
  if (trimmed === "") return BigInt(0);
  return BigInt(trimmed);
};

export const checkCreate = async (
  item: Template | Parent,
  dict: any
): Promise<boolean> => {
  const currentNetwork = getCurrentNetwork();
  const publicClient = createPublicClient({
    chain: currentNetwork.chainId === 37111 ? chains.testnet : chains.mainnet,
    transport: http(currentNetwork.rpcUrl),
  });

  const childReferences = item.childReferences ?? [];

  const isTemplate = "templateContract" in item;

  for (const childRef of childReferences) {
    if (Number(childRef.child?.status) !== 2) {
      return false;
    }
    const childAvailability = Number(childRef.child?.availability ?? 0);
    const requiredAmount = toBigInt(childRef.amount);

    const childSupportsPhysical =
      childAvailability === AVAILABILITY.PHYSICAL ||
      childAvailability === AVAILABILITY.BOTH;
    const childSupportsDigital =
      childAvailability === AVAILABILITY.DIGITAL ||
      childAvailability === AVAILABILITY.BOTH;

    const itemRequiresPhysical = hasPhysicalAvailability(
      item.availability,
      dict
    );
    const itemRequiresDigital = hasDigitalAvailability(item.availability, dict);

    if (childRef.isTemplate) {
      const data = await getTemplate(
        Number(childRef.childId),
        childRef.childContract
      );
      const childTemplate = data?.data?.templates?.[0];
      if (!childTemplate) {
        return false;
      } else {
        const cleaned = cleanTemplate(childTemplate, dict);
        const res = await checkCreate(cleaned, dict);
        if (!res) {
          return false;
        }
      }
    }

    try {
      if (isTemplate) {
        const template = item as Template;
        const templateId = toBigInt(template.templateId);
        const templateAddress = template.templateContract as `0x${string}`;

        if (itemRequiresPhysical && childSupportsPhysical) {
          let maxPhysical = toBigInt(template.maxPhysicalEditions);
          if (maxPhysical === BigInt(0)) {
            maxPhysical = BigInt(1);
          }

          const approvedPhysical = await publicClient.readContract({
            address: childRef.childContract as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "getTemplateApprovedAmount",
            args: [
              toBigInt(childRef.childId),
              templateId,
              templateAddress,
              true,
            ],
          });

          const requiredPhysical = requiredAmount * maxPhysical;
          if (toBigInt(Number(approvedPhysical)) < requiredPhysical) {
            return false;
          }
        }

        if (itemRequiresDigital && childSupportsDigital) {
          const approvedDigital = await publicClient.readContract({
            address: childRef.childContract as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "getTemplateApprovedAmount",
            args: [
              toBigInt(childRef.childId),
              templateId,
              templateAddress,
              false,
            ],
          });

          if (toBigInt(Number(approvedDigital)) < requiredAmount) {
            return false;
          }
        }
      } else {
        const parent = item as Parent;
        const parentId = toBigInt(parent.designId);
        const parentAddress = parent.parentContract as `0x${string}`;

        if (itemRequiresPhysical && childSupportsPhysical) {
          let maxPhysical = toBigInt(parent.maxPhysicalEditions);
          if (maxPhysical === BigInt(0)) {
            maxPhysical = BigInt(1);
          }

          const approvedPhysical = await publicClient.readContract({
            address: childRef.childContract as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "getParentApprovedAmount",
            args: [toBigInt(childRef.childId), parentId, parentAddress, true],
          });

          const requiredPhysical = requiredAmount * maxPhysical;
          if (toBigInt(Number(approvedPhysical)) < requiredPhysical) {
            return false;
          }
        }

        if (itemRequiresDigital && childSupportsDigital) {
          let maxDigital = toBigInt(parent.maxDigitalEditions);
          if (maxDigital === BigInt(0)) {
            maxDigital = BigInt(1);
          }

          const approvedDigital = await publicClient.readContract({
            address: childRef.childContract as `0x${string}`,
            abi: ABIS.FGOChild,
            functionName: "getParentApprovedAmount",
            args: [toBigInt(childRef.childId), parentId, parentAddress, false],
          });

          const requiredDigital = requiredAmount * maxDigital;
          if (toBigInt(Number(approvedDigital)) < requiredDigital) {
            return false;
          }
        }
      }
    } catch (error) {
      console.error("Failed to validate child approvals", error);
      return false;
    }
  }

  return true;
};

const cleanTemplate = (templateData: Template, dict: any): Template => {
  if (templateData.childReferences) {
    templateData.childReferences = templateData.childReferences.map(
      (childRef: any) => ({
        ...childRef,
        child: childRef.isTemplate ? childRef.childTemplate : childRef.child,
      })
    );
  }

  return {
    ...templateData,
    maxDigitalEditions: templateData.maxDigitalEditions || "0",
    maxPhysicalEditions: templateData.maxPhysicalEditions || "0",
    currentDigitalEditions: templateData.currentDigitalEditions || "0",
    currentPhysicalEditions: templateData.currentPhysicalEditions || "0",
    status: templateData.status,
    availability: getAvailabilityLabel(templateData.availability || 0, dict),
  };
};
