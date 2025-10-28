import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { AuthorizedChildren, AuthorizedParents, AuthorizedTemplates, Child,  Template } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemAuthorized = (item: Child | Parent | Template) => {
  const router = useRouter();
  const [processedAuthorizedChildren, setProcessedAuthorizedChildren] = useState<AuthorizedChildren[]>([]);
  const [processedAuthorizedParents, setProcessedAuthorizedParents] = useState<AuthorizedParents[]>([]);
  const [processedAuthorizedTemplates, setProcessedAuthorizedTemplates] = useState<AuthorizedTemplates[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const processAuthorizedItems = async () => {
      setLoading(true);
      
      try {
        if (item.authorizedChildren && item.authorizedChildren.length > 0) {
          const processedChildren = await Promise.all(
            item.authorizedChildren.map(async (child: AuthorizedChildren | Child) => {
              const processedChild = await ensureMetadata(child);
              return processedChild as AuthorizedChildren;
            })
          );
          setProcessedAuthorizedChildren(processedChildren);
        }

        if ("authorizedParents" in item && item.authorizedParents && item.authorizedParents.length > 0) {
          const processedParents = await Promise.all(
            item.authorizedParents.map(async (parent: AuthorizedParents) => {
              const processedParent = await ensureMetadata(parent);
              return processedParent;
            })
          );
          setProcessedAuthorizedParents(processedParents);
        }

        if (item.authorizedTemplates && item.authorizedTemplates.length > 0) {
          const processedTemplates = await Promise.all(
            item.authorizedTemplates.map(async (template: AuthorizedTemplates | Template) => {
              const processedTemplate = await ensureMetadata(template);
              return processedTemplate;
            })
          );
          setProcessedAuthorizedTemplates(processedTemplates);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    processAuthorizedItems();
  }, [item]);

  const handleChildClick = useCallback((childContract: string, childId: string, isFutures?: boolean) => {
    if (isFutures) {
      router.push(`/market/future/${childContract}/${childId}`);
    } else {
      router.push(`/library/child/${childContract}/${childId}`);
    }
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