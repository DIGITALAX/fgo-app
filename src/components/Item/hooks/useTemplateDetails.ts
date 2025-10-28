import { useState, useEffect } from "react";
import { getTemplate } from "@/lib/subgraph/queries/getItems";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Template } from "../types";
import { getAvailabilityLabel } from "@/lib/helpers/availability";
import { ChildReference, Parent } from "@/components/Account/types";

export const useTemplateDetails = (
  contractAddress: string,
  templateId: number,
  dict: any
) => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getTemplate(templateId, contractAddress);
        if (!result?.data?.templates || result.data.templates.length === 0) {
          setError(dict?.templateNotFound);
          return;
        }

        const templateData = result.data.templates[0];

        if (templateData.childReferences) {
          templateData.childReferences = templateData.childReferences.map(
            (childRef: any) => ({
              ...childRef,
              child: childRef.isTemplate
                ? childRef.childTemplate
                : childRef.child,
            })
          );
        }

        const processedItem = await ensureMetadata(templateData);

        let finalAuthorizedChildren = [
          ...(templateData.authorizedChildren || []),
        ];
        if (Number(templateData.status) === 2 && templateData.childReferences) {
          const childRefsToAdd = await Promise.all(
            templateData.childReferences
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
                };
              })
          );
          finalAuthorizedChildren = [
            ...finalAuthorizedChildren,
            ...childRefsToAdd,
          ];
        }

        setTemplate({
          templateId: templateData.templateId,
          templateContract: templateData.templateContract,
          supplier: templateData.supplier || "Unknown",
          infraId: templateData.infraId,
          supplierProfile: templateData.supplierProfile || {
            uri: "",
            version: "",
            metadata: { title: "", image: "", description: "", link: "" },
          },
          childType: templateData.childType || "Unknown",
          scm: templateData.scm || "Unknown",
          title:
            processedItem.metadata?.title ||
            templateData.title ||
            `${templateData.__typename} ${templateData.templateId}`,
          symbol: templateData.symbol || "",
          maxDigitalEditions: templateData.maxDigitalEditions || "0",
          digitalPrice: templateData.digitalPrice,
          physicalPrice: templateData.physicalPrice,
          version: templateData.version || "1",
          maxPhysicalEditions: templateData.maxPhysicalEditions || "0",
          currentDigitalEditions: templateData.currentDigitalEditions || "0",
          currentPhysicalEditions: templateData.currentPhysicalEditions || "0",
          uriVersion: templateData.uriVersion || "1",
          usageCount: templateData.usageCount || "0",
          supplyCount: templateData.supplyCount,
          infraCurrency: templateData.infraCurrency,
          uri: templateData.uri,
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
          status: templateData.status,
          availability: getAvailabilityLabel(
            templateData.availability || 0,
            dict
          ),
          isImmutable: templateData.isImmutable || false,
          digitalMarketsOpenToAll:
            templateData.digitalMarketsOpenToAll || false,
          physicalMarketsOpenToAll:
            templateData.physicalMarketsOpenToAll || false,
          digitalReferencesOpenToAll:
            templateData.digitalReferencesOpenToAll || false,
          physicalReferencesOpenToAll:
            templateData.physicalReferencesOpenToAll || false,
          standaloneAllowed: templateData.standaloneAllowed || "false",
          authorizedMarkets: templateData.authorizedMarkets || "",
          createdAt: templateData.createdAt,
          updatedAt: templateData.updatedAt || templateData.createdAt,
          blockNumber: templateData.blockNumber || "0",
          blockTimestamp: templateData.blockTimestamp || templateData.createdAt,
          transactionHash: templateData.transactionHash || "",
          authorizedParents:
            templateData.authorizedParents.map((item: Parent) => {
              return {
                ...item,
                isPhysical:
                  Number(templateData.availability) > 0 &&
                  Number(item.availability) > 0,
              };
            }) || [],
          authorizedTemplates:
            templateData.authorizedTemplates.map((item: Template) => {
              return {
                ...item,
                isPhysical:
                  Number(templateData.availability) > 0 &&
                  Number(item.availability) > 0,
              };
            }) || [],
          parentRequests: templateData.parentRequests || [],
          templateRequests: templateData.templateRequests || [],
          marketRequests: templateData.marketRequests || [],
          authorizedChildren: finalAuthorizedChildren,
          physicalRights: templateData.physicalRights || [],
          childReferences: templateData.childReferences || [],
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : dict?.unknownError);
      } finally {
        setIsLoading(false);
      }
    };

    if (contractAddress && templateId) {
      fetchTemplate();
    }
  }, [contractAddress, templateId]);

  return {
    template,
    isLoading,
    error,
  };
};
