import {
  ChildReference,
  ChildSupplyRequest,
  MarketContract,
  Parent,
} from "@/components/Account/types";

export interface TemplateDetailsProps {
  contractAddress: string;
  templateId: number;
  dict: any;
}

export interface ItemSupplyRequestsProps {
  supplyRequests: ChildSupplyRequest[];
  dict: any;
}

export interface ChildDetailsProps {
  contractAddress: string;
  childId: number;
  dict: any;
}

export interface ParentDetailsProps {
  contractAddress: string;
  designId: number;
  dict: any;
}

export interface ItemHeaderProps {
  item: Child | Template | Parent;
  isTemplate: boolean;
  dict: any;
}

export interface ItemPricingProps {
  item: Child | Template | Parent;
  dict: any;
}

export interface ItemMetadataProps {
  item: Child | Template | Parent;
  dict: any;
}

export interface ItemBlockchainInfoProps {
  item: Child | Template | Parent;
  dict: any;
}

export interface ItemRequestsProps {
  item: Child | Template | Parent;
  dict: any;
}

export interface ItemAuthorizedProps {
  item: Child | Template | Parent;
  dict: any;
}

export interface ItemWorkflowProps {
  item: Parent;
  dict: any;
}

export interface ParentChildReferencesProps {
  parent: Parent;
  dict: any;
}

export enum Status {
  RESERVED = "0",
  SUPPLY_PENDING = "1",
  ACTIVE = "2",
  DISABLED = "3",
}

export interface Template {
  templateId: string;
  templateContract: string;
  supplier: string;
  supplierProfile: Supplier;
  childType: string;
  infraId: string;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  version: string;
  maxPhysicalEditions: string;
  maxDigitalEditions: string;
  currentDigitalEditions: string;
  currentPhysicalEditions: string;
  uriVersion: string;
  usageCount: string;
  supplyCount: string;
  infraCurrency: string;
  uri: string;
  metadata: ChildMetadata;
  status: string;
  availability: string;
  isImmutable: boolean;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  digitalReferencesOpenToAll: boolean;
  physicalReferencesOpenToAll: boolean;
  standaloneAllowed: string;
  authorizedMarkets: MarketContract[];
  childReferences: ChildReference[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  authorizedParents: AuthorizedParents[];
  authorizedTemplates: AuthorizedTemplates[];
  parentRequests: ParentRequests[];
  templateRequests: TemplateRequests[];
  marketRequests: MarketRequests[];
  authorizedChildren: AuthorizedChildren[];
  physicalRights: PhysicalRights[];
}

export interface Futures {
  supplier: string;
  totalAmount: string;
  soldAmount: string;
  pricePerUnit: string;
  deadline: string;
  isSettled: boolean;
  isActive: boolean;
  purchases: PurchaseRecord[];
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  settlements: Settlement[];
  closed: boolean;
  closedBlockNumber: string;
  closedBlockTimestamp: string;
  closedTransactionHash: string;
}

export interface Settlement {
  buyer: string;
  credits: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface PurchaseRecord {
  amount: string;
  totalCost: string;
  buyer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface Attachment {
  uri: string;
  type: string;
}

export interface AuthorizedParents {
  parentContract: string;
  parentId: string;
  uri: string;
  isPhysical: boolean;
  metadata: {
    title: string;
    image: string;
  };
}

export interface AuthorizedTemplates {
  templateContract: string;
  templateId: string;
  uri: string;
  isPhysical: boolean;
  metadata: {
    title: string;
    image: string;
  };
}

export interface ApprovalAmountInputProps {
  requestedAmount: string;
  onApprove: (amount: string) => void;
  onReject: () => void;
  loading: boolean;
  rejecting: boolean;
  isSupplier: boolean;
  dict: any;
  hasBothAvailability?: boolean;
  onApprovePhysical?: (amount: string) => void;
  onApproveDigital?: (amount: string) => void;
  onRejectPhysical?: () => void;
  onRejectDigital?: () => void;
  loadingPhysical?: boolean;
  loadingDigital?: boolean;
  rejectingPhysical?: boolean;
  rejectingDigital?: boolean;
}

export interface ParentRequests {
  childId: string;
  requestedAmount: string;
  parentId: string;
  parentContract: string;
  isPending: boolean;
  approved: boolean;
  approvedAmount: string;
  timestamp: string;
  isPhysical: boolean;
  parent?: {
    uri: string;
    availability: string;
    metadata: {
      image: string;
      title: string;
    };
  };
}

export interface TemplateRequests {
  childId: string;
  requestedAmount: string;
  templateId: string;
  templateContract: string;
  isPending: boolean;
  approved: boolean;
  approvedAmount: string;
  timestamp: string;
  isPhysical: boolean;
  template?: {
    uri: string;
    availability: string;
    metadata: {
      image: string;
      title: string;
    };
  };
}

export interface MarketRequests {
  tokenId: string;
  marketContract: string;
  isPending: boolean;
  approved: boolean;
  timestamp: string;
}

export interface AuthorizedChildren {
  childContract: string;
  childId: string;
  uri: string;
  futures: {
    id: string;
  };
  metadata: {
    title: string;
    image: string;
  };
}

export interface PhysicalRights {
  buyer: string;
  child: {
    childId: string;
    childContract: string;
    uri: string;
    metadata: {
      title: string;
      image: string;
    };
  };
}

export interface Supplier {
  uri: string;
  version: string;
  metadata: {
    image: string;
    title: string;
    description: string;
    link: string;
  };
}

export interface Child {
  childId: string;
  childContract: string;
  supplier: string;
  infraId: string;
  supplierProfile: Supplier;
  childType: string;
  scm: string;
  title: string;
  symbol: string;
  futures: Futures;
  totalPrepaidAmount: string;
  totalReservedSupply: string;
  totalPrepaidUsed: string;
  digitalPrice: string;
  physicalPrice: string;
  version: string;
  currentDigitalEditions: string;
  maxPhysicalEditions: string;
  currentPhysicalEditions: string;
  uriVersion: string;
  usageCount: string;
  supplyCount: string;
  infraCurrency: string;
  uri: string;
  metadata: ChildMetadata;
  status: string;
  availability: string;
  isImmutable: boolean;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  digitalReferencesOpenToAll: boolean;
  physicalReferencesOpenToAll: boolean;
  standaloneAllowed: boolean;
  authorizedMarkets: MarketContract[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  authorizedParents: AuthorizedParents[];
  authorizedTemplates: AuthorizedTemplates[];
  parentRequests: ParentRequests[];
  templateRequests: TemplateRequests[];
  marketRequests: MarketRequests[];
  authorizedChildren: AuthorizedChildren[];
  physicalRights: PhysicalRights[];
}

export interface ChildMetadata {
  title: string;
  description: string;
  image: string;
  attachments: Attachment[];
  tags: string[];
  prompt: string;
  aiModel: string;
  loras: string[];
  workflow: string;
  version: string;
  customFields?: Record<string, string>;
}

export interface PlacementData {
  instructions?: string;
  [key: string]: string | undefined;
}

export interface ChildReferencesProps {
  childData: ChildReference[];
  dict: any;
}
