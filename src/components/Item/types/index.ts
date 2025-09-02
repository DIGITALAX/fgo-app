import { MarketContract, Parent } from "@/components/Account/types";

export interface TemplateDetailsProps {
  contractAddress: string;
  templateId: number;
}

export interface ChildDetailsProps {
  contractAddress: string;
  childId: number;
}

export interface ParentDetailsProps {
  contractAddress: string;
  designId: number;
}

export interface ItemHeaderProps {
  item: Child | Template | Parent;
  isTemplate: boolean;
}

export interface ItemPricingProps {
  item: Child | Template | Parent;
}

export interface ItemMetadataProps {
  item: Child | Template | Parent;
}

export interface ItemBlockchainInfoProps {
  item: Child | Template | Parent;
}

export interface ItemRequestsProps {
  item: Child | Template | Parent;
}

export interface ItemAuthorizedProps {
  item: Child | Template | Parent;
}

export interface ItemWorkflowProps {
  item: Parent;
}

export interface ParentChildReferencesProps {
  parent: Parent;
}

export enum Status {
  RESERVED = "0",
  ACTIVE = "1",
  DISABLED = "2",
}

export interface Template {
  templateId: string;
  templateContract: string;
  supplier: string;
  supplierProfile: Supplier;
  childType: string;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  version: string;
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
  standaloneAllowed: string;
  authorizedMarkets: MarketContract[];
  childReferences: ChildReferences[];
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

export interface Attachment {
  uri: string;
  type: string;
}

export interface ChildReferences {
  childContract: string;
  childId: string;
  uri: string;
  amount: string;
}

export interface AuthorizedParents {
  parentContract: string;
  parentId: string;
  uri: string;
  metadata: {
    title: string;
    image: string;
  };
}

export interface AuthorizedTemplates {
  templateContract: string;
  templateId: string;
  uri: string;
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
  parent?: {
    uri: string;
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
  template?: {
    uri: string;
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
  supplierProfile: Supplier;
  childType: string;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  version: string;
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
  standaloneAllowed: string;
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
}

export interface PlacementData {
  instructions?: string;
  [key: string]: string | undefined;
}

export interface ChildReferencesProps {
  childData: any[];
}
