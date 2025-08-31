import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useItemRequests = () => {
  const router = useRouter();

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

  return {
    handleTemplateClick,
    handleParentClick,
    formatTimestamp,
    getStatusInfo,
  };
};