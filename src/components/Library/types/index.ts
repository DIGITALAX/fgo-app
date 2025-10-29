import { Child, Template } from "@/components/Item/types";

export interface LibraryCardProps {
  data: Child | Template;
  onClick?: () => void;
  dict: any;
}

export interface AdvancedFiltersProps {
  filters: LibraryFilters;
  onFiltersChange: (filters: LibraryFilters) => void;
  dict: any;
}

export interface SearchBarProps {
  searchText: string;
  onSearch: (query: string) => void;
  dict: any;
}

export interface LibraryFilters {
  searchText: string;
  orderBy: "blockTimestamp" | "digitalPrice" | "physicalPrice" | "availability";
  orderDirection: "asc" | "desc";
  supplierAddress: string;
  availability: number | null;
  scm: string;
  minDigitalPrice: string;
  maxDigitalPrice: string;
  minPhysicalPrice: string;
  maxPhysicalPrice: string;
}

export interface CoreContractAddresses {
  Factory: string;
  TestToken: string;
  SupplyCoord: string;
  FuturesCoord: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  childValidations: Array<{
    childContract: string;
    childId: string;
    required: bigint;
    available: bigint;
    maxEditions: bigint;
    currentEditions: bigint;
    reservedSupply: bigint;
    channel?: "digital" | "physical";
  }>;
}

export interface ChildReferenceInput {
  childContract: string;
  childId: string;
  amount: string;
  isTemplate?: boolean;
}

export interface FuturesCreditsValidationResult {
  isValid: boolean;
  errors: string[];
  creditChecks: Array<{
    childContract: string;
    childId: string;
    required: {
      digital: bigint;
      physical: bigint;
    };
    available: bigint;
  }>;
}
