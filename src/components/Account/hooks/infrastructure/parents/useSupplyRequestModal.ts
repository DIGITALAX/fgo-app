import { useState, useEffect, useCallback } from "react";
import { Child } from "@/components/Item/types";
import {
  SupplyRequestFormData,
  UseSupplyRequestModalProps,
} from "../../../types";

export const useSupplyRequestModal = ({
  isOpen,
  onClose,
  onSelect,
  onCancel,
  dict,
  editingRequest,
}: UseSupplyRequestModalProps) => {
  const [configuring, setConfiguring] = useState<Child | null>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [preferredMaxPrice, setPreferredMaxPrice] = useState<string>("0");
  const [deadline, setDeadline] = useState<string>("");
  const [customSpec, setCustomSpec] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [customFields, setCustomFields] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [isPhysical, setIsPhysical] = useState<boolean>(true);

  const minDeadline = useCallback(() => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now.toISOString().slice(0, 16);
  }, []);

  useEffect(() => {
    if (isOpen && editingRequest) {
      setConfiguring(editingRequest.child || null);
      setQuantity(editingRequest.quantity);
      setPreferredMaxPrice(editingRequest.preferredMaxPrice);

      if (editingRequest.deadline) {
        const date = new Date(Number(editingRequest.deadline) * 1000);
        setDeadline(date.toISOString().slice(0, 16));
      }

      setCustomSpec(editingRequest.customSpec);
      setInstructions(editingRequest.metadata.instructions);
      setIsPhysical(editingRequest.isPhysical);

      const fieldsArray = Object.entries(
        editingRequest.metadata.customFields || {}
      ).map(([key, value]) => ({ key, value: value as string }));
      setCustomFields(fieldsArray);
    } else if (isOpen) {
      resetForm();
      setDeadline(minDeadline());
    }
  }, [isOpen, editingRequest, minDeadline]);

  const resetForm = useCallback(() => {
    setConfiguring(null);
    setQuantity("1");
    setPreferredMaxPrice("0");
    setDeadline(minDeadline());
    setCustomSpec("");
    setInstructions("");
    setCustomFields([]);
    setIsPhysical(true);
  }, [minDeadline]);

  const handleSelectChild = useCallback((child: Child | null) => {
    if (child) {
      setConfiguring(child);
    } else {
      setConfiguring({ childId: "0", childContract: "0x" } as Child);
    }
  }, []);

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || parseInt(value) >= 1) {
        setQuantity(value);
      }
    },
    []
  );

  const handlePreferredMaxPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || parseFloat(value) >= 0) {
        setPreferredMaxPrice(value);
      }
    },
    []
  );

  const handleDeadlineChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDeadline(e.target.value);
    },
    []
  );

  const addCustomField = useCallback(() => {
    setCustomFields((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const updateCustomField = useCallback(
    (index: number, field: "key" | "value", value: string) => {
      setCustomFields((prev) => {
        const newFields = [...prev];
        newFields[index][field] = value;
        return newFields;
      });
    },
    []
  );

  const removeCustomField = useCallback((index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  }, [onCancel, onClose, resetForm]);

  const handleConfirmSelection = useCallback(() => {
    if (!configuring) return;

    if (!quantity || parseInt(quantity) < 1) {
      return;
    }

    if (!preferredMaxPrice || parseFloat(preferredMaxPrice) < 0) {
      return;
    }

    if (!deadline) {
      return;
    }

    const deadlineDate = new Date(deadline);
    const minDeadlineDate = new Date(minDeadline());
    if (deadlineDate < minDeadlineDate) {
      return;
    }

    if (!customSpec.trim()) {
      return;
    }

    const customFieldsObj: Record<string, string> = {};
    customFields.forEach((field) => {
      if (field.key.trim() && field.value.trim()) {
        customFieldsObj[field.key] = field.value;
      }
    });

    const deadlineTimestamp = Math.floor(
      deadlineDate.getTime() / 1000
    ).toString();

    const supplyRequest: SupplyRequestFormData = {
      existingChildId: configuring.childId || "0",
      existingChildContract:
        configuring.childContract ||
        "0x0000000000000000000000000000000000000000",
      quantity,
      preferredMaxPrice,
      deadline: deadlineTimestamp,
      isPhysical,
      customSpec,
      child: configuring.childId !== "0" ? configuring : undefined,
      metadata: {
        instructions,
        customFields: customFieldsObj,
      },
    };

    onSelect(supplyRequest);
    resetForm();
    onClose();
  }, [
    configuring,
    quantity,
    preferredMaxPrice,
    deadline,
    customSpec,
    instructions,
    customFields,
    isPhysical,
    onSelect,
    onClose,
    resetForm,
    minDeadline,
  ]);

  const getFilteredItems = useCallback((items: (Child)[]) => {
    return items.filter((item) => !("isTemplate" in item && item.isTemplate));
  }, []);

  const getItemTitle = useCallback(
    (item: Child | null) => {
      if (!item || item.childId === "0") {
        return dict?.noChildSelected || "No existing child selected";
      }
      return item.metadata?.title || item.title || `Child ${item.childId}`;
    },
    [dict]
  );

  return {
    configuring,
    quantity,
    handleQuantityChange,
    preferredMaxPrice,
    handlePreferredMaxPriceChange,
    deadline,
    handleDeadlineChange,
    customSpec,
    setCustomSpec,
    instructions,
    setInstructions,
    customFields,
    isPhysical,
    setIsPhysical,
    handleSelectChild,
    handleCancel,
    handleConfirmSelection,
    addCustomField,
    updateCustomField,
    removeCustomField,
    getFilteredItems,
    getItemTitle,
    minDeadline: minDeadline(),
  };
};
