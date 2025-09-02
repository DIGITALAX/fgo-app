import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Child,  Template } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemAuthorized = (item: Child | Parent | Template) => {
  const router = useRouter();
  const [processedAuthorizedChildren, setProcessedAuthorizedChildren] = useState<any[]>([]);
  const [processedAuthorizedParents, setProcessedAuthorizedParents] = useState<any[]>([]);
  const [processedAuthorizedTemplates, setProcessedAuthorizedTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processAuthorizedItems = async () => {
      setLoading(true);
      
      try {
        if (item.authorizedChildren && item.authorizedChildren.length > 0) {
          const processedChildren = await Promise.all(
            item.authorizedChildren.map(async (child: any) => {
              const processedChild = await ensureMetadata(child);
              return processedChild;
            })
          );
          setProcessedAuthorizedChildren(processedChildren);
        }

        if ("authorizedParents" in item && item.authorizedParents && item.authorizedParents.length > 0) {
          const processedParents = await Promise.all(
            item.authorizedParents.map(async (parent: any) => {
              const processedParent = await ensureMetadata(parent);
              return processedParent;
            })
          );
          setProcessedAuthorizedParents(processedParents);
        }

        if (item.authorizedTemplates && item.authorizedTemplates.length > 0) {
          const processedTemplates = await Promise.all(
            item.authorizedTemplates.map(async (template: any) => {
              const processedTemplate = await ensureMetadata(template);
              return processedTemplate;
            })
          );
          setProcessedAuthorizedTemplates(processedTemplates);
        }
      } catch (error) {
        console.error("Error processing authorized items metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    processAuthorizedItems();
  }, [item]);

  const handleChildClick = useCallback((childContract: string, childId: string) => {
    const path = `/library/child/${childContract}/${childId}`;
    router.push(path);
  }, [router]);

  const handleParentClick = useCallback((parentContract: string, parentId: string) => {
    const path = `/library/parent/${parentContract}/${parentId}`;
    router.push(path);
  }, [router]);

  const handleTemplateClick = useCallback((templateContract: string, templateId: string) => {
    const path = `/library/template/${templateContract}/${templateId}`;
    router.push(path);
  }, [router]);

  const getImageUrl = useCallback((imageUri: string): string => {
    return getIPFSUrl(imageUri);
  }, []);

  return {
    handleChildClick,
    handleParentClick,
    handleTemplateClick,
    getImageUrl,
    processedAuthorizedChildren,
    processedAuthorizedParents,
    processedAuthorizedTemplates,
    loading,
  };
};