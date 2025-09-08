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
}
