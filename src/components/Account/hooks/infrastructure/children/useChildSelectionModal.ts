import { useState, useEffect, useCallback } from "react";
import { Child, Template } from "@/components/Item/types";
import { ChildSelectionModalProps } from "../../../types";

const validateAmountInput = (value: string): boolean => {
  if (value === "") return true;
  return /^\d+$/.test(value) && parseInt(value) > 0;
};

export const useChildSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  onCancel,
  selectedIds = [],
  editingPlacement,
}: ChildSelectionModalProps) => {
  const [selectedType, setSelectedType] = useState<"children" | "templates">(
    "children"
  );
  const [configuring, setConfiguring] = useState<Child | Template | null>(null);
  const [amount, setAmount] = useState<string>("1");
  const [instructions, setInstructions] = useState<string>("");
  const [customFields, setCustomFields] = useState<
    Array<{ id: string; key: string; value: string }>
  >([]);

  useEffect(() => {
    if (isOpen && editingPlacement) {
      setAmount(editingPlacement.amount);
      setInstructions(editingPlacement.metadata.instructions);
      const fieldsArray = Object.entries(
        editingPlacement.metadata.customFields || {}
      ).map(([key, value], index) => ({
        id: `field_${Date.now()}_${index}`,
        key,
        value,
      }));
      setCustomFields(fieldsArray);
      setConfiguring({
        childId: editingPlacement.childId,
        childContract: editingPlacement.childContract,
      } as any);
    } else if (isOpen && !editingPlacement) {
      setConfiguring(null);
      setAmount("1");
      setInstructions("");
      setCustomFields([]);
    }
  }, [isOpen, editingPlacement]);

  const handleSelect = useCallback((item: Child | Template | null) => {
    if (item === null) {
      setConfiguring(null);
      return;
    }
    setConfiguring(item);
    setAmount("1");
    setInstructions("");
    setCustomFields([]);
  }, []);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    setConfiguring(null);
    setAmount("1");
    setInstructions("");
    setCustomFields([]);
    if (!onCancel) {
      onClose();
    }
  }, [onCancel, onClose]);

  const handleConfirmSelection = useCallback(() => {
    if (!configuring) return;

    const isTemplate = "templateId" in configuring;
    onSelect({
      childId: isTemplate
        ? (configuring as Template).templateId
        : (configuring as Child).childId,
      childContract: isTemplate
        ? (configuring as Template).templateContract
        : (configuring as Child).childContract,
      amount,
      placementURI: "",
      prepaidAmount: "0",
      prepaidUsed: "0",
      metadata: {
        instructions,
        customFields: customFields.reduce((acc, field) => {
          acc[field.key] = field.value;
          return acc;
        }, {} as Record<string, string>),
      },
    });

    setConfiguring(null);
  }, [configuring, amount, instructions, customFields, onSelect]);

  const addCustomField = useCallback(() => {
    const newField = {
      id: `field_${Date.now()}`,
      key: `field_${customFields.length + 1}`,
      value: "",
    };
    setCustomFields((prev) => [...prev, newField]);
  }, [customFields.length]);

  const updateCustomField = useCallback(
    (id: string, key: string, value: string) => {
      setCustomFields((prev) =>
        prev.map((field) =>
          field.id === id ? { ...field, key, value } : field
        )
      );
    },
    []
  );

  const removeCustomField = useCallback((id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
  }, []);

  const getFilteredItems = useCallback(
    (items: (Child | Template)[]) => {
      return items.filter((item) => {
        const isTemplate = "templateId" in item;
        const matchesType =
          selectedType === "children" ? !isTemplate : isTemplate;

        if (!matchesType) return false;

        if (isTemplate) {
          const template = item as Template;
          const templateStatus = Number(template.status);
          if (templateStatus !== 0 && templateStatus !== 2) return false;
        } else {
          const child = item as Child;
          const childStatus = Number(child.status);
          if (childStatus !== 2) return false;
        }

        const itemId = isTemplate
          ? (item as Template).templateId
          : (item as Child).childId;
        const itemContract = isTemplate
          ? (item as Template).templateContract
          : (item as Child).childContract;
        const itemKey = `${itemId}-${itemContract}`;

        return !selectedIds.includes(itemKey);
      });
    },
    [selectedType, selectedIds]
  );

  const getCounts = useCallback((items: (Child | Template)[]) => {
    const childrenCount = items.filter((item) => {
      if ("templateId" in item) return false;
      const child = item as Child;
      return Number(child.status) === 2;
    }).length;

    const templatesCount = items.filter((item) => {
      if (!("templateId" in item)) return false;
      const template = item as Template;
      const templateStatus = Number(template.status);
      return templateStatus === 0 || templateStatus === 2;
    }).length;

    return { childrenCount, templatesCount };
  }, []);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (validateAmountInput(value)) {
        setAmount(value);
      }
    },
    []
  );

  const getItemTitle = useCallback((configuring: Child | Template) => {
    const isTemplate = "templateId" in configuring;
    return (
      configuring.metadata?.title ||
      configuring.title ||
      `${isTemplate ? "Template" : "Child"} ${
        isTemplate
          ? (configuring as Template).templateId
          : (configuring as Child).childId
      }`
    );
  }, []);

  return {
    selectedType,
    setSelectedType,
    configuring,
    amount,
    handleAmountChange,
    instructions,
    setInstructions,
    customFields,
    handleSelect,
    handleCancel,
    handleConfirmSelection,
    addCustomField,
    updateCustomField,
    removeCustomField,
    getFilteredItems,
    getCounts,
    getItemTitle,
  };
};
