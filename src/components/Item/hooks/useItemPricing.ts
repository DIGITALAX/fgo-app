import { useState, useEffect, useCallback } from "react";
import { formatPrice } from "@/lib/helpers/price";
import { getStatusLabel } from "@/lib/helpers/status";
import { Child, Template } from "../types";
import { Parent } from "@/components/Account/types";

export const useItemPricing = (item: Child | Template | Parent, dict: any) => {
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
        setFormattedDigitalPrice(dict?.free || "Free");
      }

      if (item.physicalPrice && item.physicalPrice !== "0") {
        const physical = await formatPrice(item.physicalPrice, currency);
        setFormattedPhysicalPrice(physical);
      } else {
        setFormattedPhysicalPrice(dict?.free || "Free");
      }
    };

    formatPrices();
  }, [item.digitalPrice, item.physicalPrice]);

  const statusLabel = getStatusLabel(item.status, dict);

  const statusColor =
    Number(item.status) === 1
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : Number(item.status) === 0
      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      : "bg-red-500/20 text-red-400 border border-red-500/30";

  const getAvailabilityType = useCallback(() => {
    const availability = item.availability;
    
    const availabilityStr = typeof availability === "string" ? availability.toLowerCase() : "";
    const availabilityNum = typeof availability === "number" ? availability : parseInt(availability);
    
    const showDigital = !isNaN(availabilityNum) ? (availabilityNum === 0 || availabilityNum === 2) : 
                       availabilityStr.includes("digital") || availabilityStr.includes("both");
                       
    const showPhysical = !isNaN(availabilityNum) ? (availabilityNum === 1 || availabilityNum === 2) :
                        availabilityStr.includes("physical") || availabilityStr.includes("both");
    
    return {
      showDigital,
      showPhysical,
    };
  }, [item.availability]);

  const formatEditionLimit = useCallback((value: string | number) => {
    if (!value) return dict?.unlimited || "UNLIMITED";
    const numValue = typeof value === 'string' ? parseInt(value, 10) : Number(value);
    if (isNaN(numValue) || numValue === 0) return dict?.unlimited || "UNLIMITED";
    return numValue.toString();
  }, []);

  return {
    formattedDigitalPrice,
    formattedPhysicalPrice,
    statusLabel,
    statusColor,
    getAvailabilityType,
    formatEditionLimit,
  };
};
