import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/helpers/price";
import { getIPFSUrl } from "@/lib/helpers/ipfs";
import { ensureMetadata } from "@/lib/helpers/metadata";
import { truncateAddress } from "@/lib/helpers/address";
import { Child, Template } from "@/components/Item/types";

export const useLibraryCard = (data: Child | Template) => {
  const [detalles, setDetalles] = useState<{
    titulo: string;
    proveedorT: string;
    imageURL: string | null;
    precioP: string | null;
    precioD: string | null;
    itemT: string;
  }>({
    titulo: "",
    proveedorT: "",
    precioD: "",
    precioP: "",
    itemT: "",
    imageURL: null,
  });

  const isTemplate = "templateId" in data;
  const contractAddress = isTemplate
    ? data.templateContract
    : (data as Child).childContract;
  const itemId = isTemplate ? data.templateId : (data as Child).childId;

  useEffect(() => {
    const processData = async () => {
      let dets: {
        titulo: string;
        proveedorT: string;
        imageURL: string | null;
        precioP: string | null;
        precioD: string | null;
        itemT: string;
      } = {
        titulo: "",
        proveedorT: "",
        precioD: "",
        precioP: "",
        itemT: "",
        imageURL: null,
      };
      if (data.digitalPrice && data.digitalPrice !== "0") {
        const digital = await formatPrice(
          data.digitalPrice,
          data.infraCurrency
        );
        dets = {
          ...dets,
          precioD: digital,
        };
      } else {
        dets = {
          ...dets,
          precioD: "Free",
        };
      }

      if (data.physicalPrice && data.physicalPrice !== "0") {
        const physical = await formatPrice(
          data.physicalPrice,
          data.infraCurrency
        );

        dets = {
          ...dets,
          precioP: physical,
        };
      }

      let image = data.metadata?.image;
      const processedData = await ensureMetadata(data);
      image = processedData.metadata?.image;
      if (image) {
        dets = {
          ...dets,
          imageURL: getIPFSUrl(image),
        };
      }

      let supplier = data.supplierProfile?.metadata?.title;
      if (!supplier && data.supplierProfile?.uri) {
        const processedSupplier = await ensureMetadata(data.supplierProfile);
        supplier = processedSupplier.metadata?.title;
      }
      const supplierAddress = data.supplier;

      dets = {
        ...dets,
        proveedorT:
          supplier ||
          (supplierAddress
            ? truncateAddress(supplierAddress)
            : "Unknown Supplier"),
        titulo:
          processedData.metadata?.title ||
          data.title ||
          `${isTemplate ? "Template" : "Child"} ${itemId}`,
      };

      setDetalles(dets);
    };

    processData();
  }, [data, isTemplate, itemId]);

  const formattedDate = new Date(
    parseInt(data.createdAt) * 1000
  ).toLocaleDateString();

  return {
    detalles,
    formattedDate,
    isTemplate,
    contractAddress,
    itemId,
  };
};
