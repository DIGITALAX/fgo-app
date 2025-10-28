import { Child, Futures, Template } from "@/components/Item/types";
import { Parent, FutureCredit } from "@/components/Account/types";

export interface SupplyRequestProps {
  dict: any;
}

export interface FuturePosition {
  supplier: string;
  supplierProfile?: {
    metadata?: {
      title?: string;
    };
  };
  pricePerUnit: string;
  deadline: string;
  isSettled: boolean;
  isActive: boolean;
  child: {
    childId: string;
    childContract: string;
    infraCurrency: string;
    metadata?: {
      title?: string;
      image?: string;
    };
  };
  blockTimestamp: string;
  closed: boolean;
}

export interface SupplyRequest {
  id: string;
  existingChildId: string;
  existingChild: Child;
  quantity: string;
  preferredMaxPrice: string;
  deadline: string;
  existingChildContract: string;
  isPhysical: boolean;
  expired: boolean;
  customSpec: string;
  placementURI: string;
  parent: Parent;
  proposals: SupplierProposal[];
  matchedChildId: string;
  matchedSupplier: string;
  matchedChildContract: string;
  matchedChild: Child;
  paid: boolean;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  paidBlockNumber: string;
  paidBlockTimestamp: string;
  paidTransactionHash: string;
}

export interface SupplierProposal {
  id: string;
  childId: string;
  timestamp: string;
  childContract: string;
  supplier: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  positionId: string;
  child: Child;
}

export type MarketItem =
  | FuturePosition
  | SupplyRequest
  | Child
  | Template
  | Parent;

export interface MarketFilterState {
  searchText: string;
  itemType: string;
  availability: string;
  orderBy: string;
  orderDirection: string;
}

export type MarketFiltersProps = {
  filters: MarketFilterState;
  onFiltersChange: (filters: Partial<MarketFilterState>) => void;
  dict: any;
};

export type MarketSearchBarProps = {
  searchText: string;
  onSearch: (text: string) => void;
  dict: any;
};

export interface SupplyRequestCardProps {
  supplyRequest: SupplyRequest;
  dict: any;
}

export interface FuturePositionCardProps {
  futurePosition?: FuturePosition;
  futureCredit?: FutureCredit;
  dict: any;
}

export interface FuturesSectionProps {
  futures: Futures;
  infraCurrency: string;
  dict: any;
  availability: string;
}

export interface SupplierChildSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (child: SupplierChild) => void;
  childrenList: SupplierChild[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  dict: any;
  searchText: string;
  setSearchText: (value: string) => void;
  proposingChildId: string | null;
}

export interface SupplierChild {
  childId: string;
  childContract: string;
  availability: string;
  availabilityValue: number;
  metadata: {
    title?: string;
    image?: string;
  };
  supplyCount?: string;
  digitalPrice?: string;
  physicalPrice?: string;
  infraCurrency?: string;
  supplier: string;
}

export interface UseSupplierChildrenResult {
  children: SupplierChild[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  searchText: string;
  setSearchText: (value: string) => void;
  refresh: () => void;
}
