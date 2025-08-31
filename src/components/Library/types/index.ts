import { Child, Template } from "@/components/Item/types";

export interface LibraryCardProps {
  data: Child | Template;
  onClick?: () => void;
}

export interface SearchBarProps {
  searchText: string;
  onSearch: (query: string) => void;
}

export interface CoreContractAddresses {
  Factory: string;
  TestToken: string;
}
