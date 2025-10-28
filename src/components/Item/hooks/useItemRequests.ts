import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Child, Template, ParentRequests, TemplateRequests } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemRequests = (item: Child | Template | Parent) => {
  const router = useRouter();
  const [processedParentRequests, setProcessedParentRequests] = useState<ParentRequests[]>([]);
  const [processedTemplateRequests, setProcessedTemplateRequests] = useState<TemplateRequests[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const processRequests = async () => {
      setLoading(true);
      
      try {
        if ("parentRequests" in item && item.parentRequests && item.parentRequests.length > 0) {
          const processedParents = await Promise.all(
            item.parentRequests.map(async (request: ParentRequests) => {
              if (request.parent) {
                const processedParent = await ensureMetadata(request.parent);
                return { ...request, parent: processedParent };
              }
              return request;
            })
          );
          setProcessedParentRequests(processedParents);
        }

        if ("templateRequests" in item && item.templateRequests && item.templateRequests.length > 0) {
          const processedTemplates = await Promise.all(
            item.templateRequests.map(async (request: TemplateRequests) => {
              if (request.template) {
                const processedTemplate = await ensureMetadata(request.template);
                return { ...request, template: processedTemplate };
              }
              return request;
            })
          );
          setProcessedTemplateRequests(processedTemplates);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    processRequests();
  }, [item]);

  const handleTemplateClick = useCallback((templateContract: string, templateId: string) => {
    const path = `/library/template/${templateContract}/${templateId}`;
    router.push(path);
  }, [router]);

  const handleParentClick = useCallback((parentContract: string, parentId: string) => {
    const path = `/library/parent/${parentContract}/${parentId}`;
    router.push(path);
  }, [router]);

  const formatTimestamp = useCallback((timestamp: string): string => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString();
  }, []);

  const getStatusInfo = useCallback((isPending: boolean, approved: boolean) => {
    if (isPending) {
      return {
        text: "Pending",
        className: "px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      };
    }
    
    if (approved) {
      return {
        text: "Approved", 
        className: "px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30"
      };
    }
    
    return {
      text: "Rejected",
      className: "px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30"
    };
  }, []);

  const getImageUrl = useCallback((imageUri: string): string => {
    return getIPFSUrl(imageUri);
  }, []);

  return {
    handleTemplateClick,
    handleParentClick,
    formatTimestamp,
    getStatusInfo,
    getImageUrl,
    processedParentRequests,
    processedTemplateRequests,
    loading,
  };
};