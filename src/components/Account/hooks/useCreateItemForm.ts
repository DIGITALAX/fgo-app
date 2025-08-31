import { useState, useCallback, useEffect } from "react";
import { CreateItemFormData, ChildReference, FulfillmentWorkflow } from "../types";
import { Child, Template } from "@/components/Item/types";
import { Parent } from "../types";
import { formatPrice } from "@/lib/helpers/pricing";
import { parseAvailability } from "@/lib/helpers/availability";
import { fetchMetadataFromIPFS } from "@/lib/helpers/ipfs";

const validateNumberInput = (value: string, fieldType: 'price' | 'edition'): boolean => {
  if (value === '') return true; // Allow empty for user to clear field
  
  if (fieldType === 'price') {
    // Prices: non-negative decimals (0.00 minimum)
    return /^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0;
  } else if (fieldType === 'edition') {
    // Editions: non-negative whole numbers (0 minimum)
    return /^\d+$/.test(value) && parseInt(value) >= 0;
  }
  
  return false;
};


const parsePlacementFromURI = async (placement: any): Promise<ChildReference> => {
  try {
    if (placement.uri) {
      const metadata = await fetchMetadataFromIPFS(placement.uri);
      return {
        childId: placement.childId,
        childContract: placement.childContract,
        amount: placement.amount,
        instructions: metadata.instructions || "",
        customFields: metadata.customFields || {}
      };
    }
  } catch (error) {
    console.error("Failed to parse placement URI:", error);
  }
  
  return {
    childId: placement.childId,
    childContract: placement.childContract,
    amount: placement.amount,
    instructions: "",
    customFields: {}
  };
};

export const useCreateItemForm = (editItem?: Child | Template | Parent, isEditMode?: boolean) => {
  const [parsedChildReferences, setParsedChildReferences] = useState<ChildReference[]>([]);
  
  const initializeFormData = () => {
    if (isEditMode && editItem) {
      const metadata = editItem.metadata;
      
      if ('designId' in editItem) {
        const parent = editItem as Parent;
        const authorizedMarkets = Array.isArray(parent.authorizedMarkets) 
          ? parent.authorizedMarkets as string[]
          : parent.authorizedMarkets && typeof parent.authorizedMarkets === 'object'
            ? Object.values(parent.authorizedMarkets) as string[]
            : [] as string[];

        return {
          digitalPrice: formatPrice(parent.digitalPrice, 18),
          physicalPrice: formatPrice(parent.physicalPrice, 18),
          version: "1",
          maxPhysicalEditions: parent.maxPhysicalEditions || "0",
          maxDigitalEditions: parent.maxDigitalEditions || "0",
          availability: parseAvailability(parent.availability),
          isImmutable: false,
          digitalMarketsOpenToAll: parent.digitalMarketsOpenToAll === "true",
          physicalMarketsOpenToAll: parent.physicalMarketsOpenToAll === "true",
          digitalReferencesOpenToAll: true,
          physicalReferencesOpenToAll: true,
          standaloneAllowed: true,
          authorizedMarkets,
          childReferences: [],
          metadata: {
            title: metadata?.title || "",
            description: metadata?.description || "",
            image: null,
            prompt: metadata?.prompt || "",
            aiModel: metadata?.aiModel || "",
            workflow: metadata?.workflow || "",
            tags: metadata?.tags || [],
            loras: metadata?.loras || [],
            attachments: [],
          },
          fulfillmentWorkflow: undefined,
        };
      } else {
        const childOrTemplate = editItem as Child | Template;
        const authorizedMarkets = Array.isArray(childOrTemplate.authorizedMarkets) 
          ? childOrTemplate.authorizedMarkets 
          : childOrTemplate.authorizedMarkets && typeof childOrTemplate.authorizedMarkets === 'string'
            ? childOrTemplate.authorizedMarkets.split(",").map(m => m.trim()).filter(m => m) 
            : [];
        return {
          digitalPrice: formatPrice(childOrTemplate.digitalPrice, 18),
          physicalPrice: formatPrice(childOrTemplate.physicalPrice, 18),
          version: childOrTemplate.version,
          maxPhysicalEditions: childOrTemplate.maxPhysicalEditions,
          maxDigitalEditions: "0",
          availability: parseAvailability(childOrTemplate.availability),
          isImmutable: childOrTemplate.isImmutable,
          digitalMarketsOpenToAll: childOrTemplate.digitalMarketsOpenToAll,
          physicalMarketsOpenToAll: childOrTemplate.physicalMarketsOpenToAll,
          digitalReferencesOpenToAll: childOrTemplate.digitalReferencesOpenToAll,
          physicalReferencesOpenToAll: childOrTemplate.physicalReferencesOpenToAll,
          standaloneAllowed: childOrTemplate.standaloneAllowed === "true",
          authorizedMarkets,
          childReferences: parsedChildReferences.length > 0 
            ? parsedChildReferences 
            : (childOrTemplate as Template).childReferences?.map(cp => ({
                childId: cp.childId,
                childContract: cp.childContract,
                amount: cp.amount,
                instructions: "",
                customFields: {}
              })) || [],
          metadata: {
            title: metadata?.title || "",
            description: metadata?.description || "",
            image: null,
            prompt: metadata?.prompt || "",
            aiModel: metadata?.aiModel || "",
            workflow: metadata?.workflow || "",
            tags: metadata?.tags || [],
            loras: metadata?.loras || [],
            attachments: [],
          },
          fulfillmentWorkflow: undefined,
        };
      }
    }

    return {
      digitalPrice: "0",
      physicalPrice: "0",
      version: "1",
      maxPhysicalEditions: "0",
      maxDigitalEditions: "0",
      availability: 0,
      isImmutable: false,
      digitalMarketsOpenToAll: true,
      physicalMarketsOpenToAll: true,
      digitalReferencesOpenToAll: true,
      physicalReferencesOpenToAll: true,
      standaloneAllowed: true,
      authorizedMarkets: [],
      childReferences: [],
      metadata: {
        title: "",
        description: "",
        image: null,
        prompt: "",
        aiModel: "",
        workflow: "",
        tags: [],
        loras: [],
        attachments: [],
      },
      fulfillmentWorkflow: undefined,
    };
  };

  const [formData, setFormData] = useState<CreateItemFormData>(initializeFormData());

  useEffect(() => {
    const parseChildReferences = async () => {
      if (isEditMode && editItem && 'childReferences' in editItem && editItem.childReferences && !('templateId' in editItem)) {
        const parsed = await Promise.all(
          editItem.childReferences.map(cp => parsePlacementFromURI(cp))
        );
        setParsedChildReferences(parsed);
        
        setFormData(prev => ({
          ...prev,
          childReferences: parsed
        }));
      }
    };

    if (isEditMode && editItem) {
      setFormData(initializeFormData());
      if (!('templateId' in editItem)) {
        parseChildReferences();
      }
    }
  }, [editItem, isEditMode]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Metadata fields
    if (name === 'title' || name === 'description' || name === 'prompt' || name === 'aiModel' || name === 'workflow') {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [name]: value
        }
      }));
    } 
    // Availability field
    else if (name === "availability") {
      const newAvailability = parseInt(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: newAvailability,
        digitalMarketsOpenToAll: newAvailability === 1 ? false : prev.digitalMarketsOpenToAll,
        digitalReferencesOpenToAll: newAvailability === 1 ? false : prev.digitalReferencesOpenToAll,
        physicalMarketsOpenToAll: newAvailability === 0 ? false : prev.physicalMarketsOpenToAll,
        physicalReferencesOpenToAll: newAvailability === 0 ? false : prev.physicalReferencesOpenToAll,
        maxPhysicalEditions: newAvailability === 0 ? "0" : prev.maxPhysicalEditions,
      }));
    }
    // Price fields - allow decimals, non-negative
    else if (name === 'digitalPrice' || name === 'physicalPrice') {
      if (validateNumberInput(value, 'price')) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value 
        }));
      }
    }
    // Edition fields - whole numbers only, non-negative  
    else if (name === 'maxPhysicalEditions' || name === 'maxDigitalEditions' || name === 'version') {
      if (validateNumberInput(value, 'edition')) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value 
        }));
      }
    }
    // All other fields
    else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  }, []);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: checked 
    }));
  }, []);

  const handleFileChange = useCallback((field: string, files: FileList | null) => {
    if (field === 'image' && files && files[0]) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          image: files[0]
        }
      }));
    } else if (field === 'attachments' && files) {
      const newAttachments = Array.from(files);
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          attachments: newAttachments
        }
      }));
    }
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags
      }
    }));
  }, []);

  const handleLorasChange = useCallback((loras: string[]) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        loras
      }
    }));
  }, []);

  const addChildReference = useCallback((placement: ChildReference) => {
    setFormData(prev => ({
      ...prev,
      childReferences: [...prev.childReferences, placement]
    }));
  }, []);

  const removeChildReference = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      childReferences: prev.childReferences.filter((_, i) => i !== index)
    }));
  }, []);

  const updateChildReference = useCallback((index: number, updatedPlacement: ChildReference) => {
    setFormData(prev => ({
      ...prev,
      childReferences: prev.childReferences.map((placement, i) => 
        i === index ? updatedPlacement : placement
      )
    }));
  }, []);

  const handleWorkflowChange = useCallback((workflow: FulfillmentWorkflow) => {
    setFormData(prev => ({
      ...prev,
      fulfillmentWorkflow: workflow
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initializeFormData());
  }, [isEditMode, editItem]);

  const hasValidImage = isEditMode && editItem?.metadata?.image 
    ? true 
    : formData.metadata.image !== null;

  const isItemImmutable = isEditMode && (editItem as Child)?.isImmutable;
  
  const hasValidMetadata = isItemImmutable 
    ? true 
    : formData.metadata.title.trim() && formData.metadata.description.trim() && hasValidImage;

  const isFormValid = (formData.availability === 1 || formData.digitalPrice.trim()) && 
                    (formData.availability === 0 || formData.physicalPrice.trim()) && 
                    (formData.availability === 0 ? true : formData.maxPhysicalEditions.trim()) &&
                    formData.version.trim() &&
                    hasValidMetadata;

  return {
    formData,
    handleInputChange,
    handleCheckboxChange,
    handleFileChange,
    handleTagsChange,
    handleLorasChange,
    addChildReference,
    removeChildReference,
    updateChildReference,
    handleWorkflowChange,
    resetForm,
    isFormValid,
  };
};