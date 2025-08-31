import { useState, useEffect } from "react";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { Child, Template } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemHeader = (item: Child | Template | Parent, isTemplate: boolean) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [supplierTitle, setSupplierTitle] = useState<string>("");

  const isParent = 'designId' in item;
  const contractAddress = isParent
    ? (item as Parent).parentContract
    : isTemplate
    ? (item as Template).templateContract
    : (item as Child).childContract;
  const itemId = isParent
    ? (item as Parent).designId
    : isTemplate
    ? (item as Template).templateId
    : (item as Child).childId;

  useEffect(() => {
    const processData = async () => {
      const processedItem = await ensureMetadata(item);

      if (processedItem.metadata?.image) {
        setImageUrl(getIPFSUrl(processedItem.metadata.image));
      }

      setTitle(
        processedItem.metadata?.title ||
          item.title ||
          `${isParent ? "Parent" : isTemplate ? "Template" : "Child"} ${itemId}`
      );

      if (isParent) {
        const parentItem = item as Parent;
        let designer = parentItem.designerProfile?.metadata?.title;
        if (!designer && parentItem.designerProfile?.uri) {
          const processedDesigner = await ensureMetadata(parentItem.designerProfile);
          designer = processedDesigner.metadata?.title;
        }
        setSupplierTitle(designer || "Unknown Designer");
      } else {
        let supplier = (item as Child | Template).supplierProfile?.metadata?.title;
        if (!supplier && (item as Child | Template).supplierProfile?.uri) {
          const processedSupplier = await ensureMetadata((item as Child | Template).supplierProfile);
          supplier = processedSupplier.metadata?.title;
        }
        setSupplierTitle(supplier || "Unknown Supplier");
      }
    };

    processData();
  }, [item, isTemplate, itemId]);

  return {
    imageUrl,
    title,
    supplierTitle,
    contractAddress,
    itemId,
  };
};
