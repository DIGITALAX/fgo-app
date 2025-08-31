import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/helpers/price";
import { getStatusLabel } from "@/lib/helpers/status";
import { Child, Template } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemPricing = (item: Child | Template | Parent) => {
  const [formattedDigitalPrice, setFormattedDigitalPrice] =
    useState<string>("");
  const [formattedPhysicalPrice, setFormattedPhysicalPrice] =
    useState<string>("");

  useEffect(() => {
    const formatPrices = async () => {
      const currency = (item as Child | Template).infraCurrency;
      if (item.digitalPrice && item.digitalPrice !== "0") {
        const digital = await formatPrice(item.digitalPrice, currency);
        setFormattedDigitalPrice(digital);
      } else {
        setFormattedDigitalPrice("Free");
      }

      if (item.physicalPrice && item.physicalPrice !== "0") {
        const physical = await formatPrice(item.physicalPrice, currency);
        setFormattedPhysicalPrice(physical);
      } else {
        setFormattedPhysicalPrice("Free");
      }
    };

    formatPrices();
  }, [item.digitalPrice, item.physicalPrice]);

  const statusLabel = getStatusLabel(item.status);

  const statusColor =
    Number(item.status) === 1
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : Number(item.status) === 0
      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      : "bg-red-500/20 text-red-400 border border-red-500/30";

  return {
    formattedDigitalPrice,
    formattedPhysicalPrice,
    statusLabel,
    statusColor,
  };
};
