import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";

export const useItemAuthorized = () => {
  const router = useRouter();

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
  };
};