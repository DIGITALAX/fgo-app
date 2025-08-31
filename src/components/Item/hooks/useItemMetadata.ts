import { useMemo } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { Child, Template } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemMetadata = (item: Child | Template | Parent) => {
  const attachmentUrls: string[] = useMemo(() => {
    if (!item.metadata?.attachments) {
      return [];
    }
    
    return item.metadata.attachments.map((attachment) => 
      attachment.uri ? getIPFSUrl(attachment.uri) : ""
    );
  }, [item.metadata?.attachments]);

  return {
    attachmentUrls,
  };
};