import { useState, useEffect, useCallback } from "react";
import { Child, Template } from "@/components/Item/types";
import { ChildSelectionModalProps } from "../../../types";

const validateAmountInput = (value: string): boolean => {
  if (value === '') return true;
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
  const [selectedType, setSelectedType] = useState<"children" | "templates">("children");
  const [configuring, setConfiguring] = useState<Child | Template | null>(null);
  const [amount, setAmount] = useState("1");
  const [instructions, setInstructions] = useState("");
  const [customFields, setCustomFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && editingPlacement) {
      setAmount(editingPlacement.amount);
      setInstructions(editingPlacement.instructions);
      setCustomFields(editingPlacement.customFields);
      setConfiguring({
        childId: editingPlacement.childId,
        childContract: editingPlacement.childContract,
      } as any);
    } else if (isOpen && !editingPlacement) {
      setConfiguring(null);
      setAmount("1");
      setInstructions("");
      setCustomFields({});
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
    setCustomFields({});
  }, []);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    setConfiguring(null);
    setAmount("1");
    setInstructions("");
    setCustomFields({});
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
      instructions,
      customFields,
    });

    setConfiguring(null);
  }, [configuring, amount, instructions, customFields, onSelect]);

  const addCustomField = useCallback(() => {
    const key = `field_${Object.keys(customFields).length + 1}`;
    setCustomFields((prev) => ({ ...prev, [key]: "" }));
  }, [customFields]);

  const updateCustomField = useCallback((oldKey: string, newKey: string, value: string) => {
    setCustomFields((prev) => {
      const updated = { ...prev };
      if (oldKey !== newKey && updated[oldKey] !== undefined) {
        delete updated[oldKey];
      }
      updated[newKey] = value;
      return updated;
    });
  }, []);

  const removeCustomField = useCallback((key: string) => {
    setCustomFields((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const getFilteredItems = useCallback((items: (Child | Template)[]) => {
    return items.filter((item) => {
      const isTemplate = "templateId" in item;
      const matchesType = selectedType === "children" ? !isTemplate : isTemplate;

      if (!matchesType) return false;

      const itemId = isTemplate
        ? (item as Template).templateId
        : (item as Child).childId;
      const itemContract = isTemplate
        ? (item as Template).templateContract
        : (item as Child).childContract;
      const itemKey = `${itemId}-${itemContract}`;

      return !selectedIds.includes(itemKey);
    });
  }, [selectedType, selectedIds]);

  const getCounts = useCallback((items: (Child | Template)[]) => {
    const childrenCount = items.filter((item) => !("templateId" in item)).length;
    const templatesCount = items.filter((item) => "templateId" in item).length;
    return { childrenCount, templatesCount };
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateAmountInput(value)) {
      setAmount(value);
    }
  }, []);

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