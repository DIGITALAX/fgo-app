import {
  Attachment,
  Child,
  MarketRequests,
  Template,
} from "@/components/Item/types";

export interface MarketContractDetailViewProps {
  marketContract: MarketContract;
  onBack: () => void;
  dict: any;
}

export interface MarketsApprovalTabProps {
  itemData: Child | Template | Parent;
  itemType: "child" | "template" | "parent";
  dict: any;
}

export type AccountTab =
  | "infrastructure"
  | "designer"
  | "supplier"
  | "fulfiller"
  | "settings";

export interface AccountTabsProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

export interface AccountState {
  activeTab: AccountTab;
  isConnected: boolean;
  address: string | null;
  selectedLanguage: string;
}

export type Language = "en" | "es" | "pt";

export const LANGUAGES = {
  en: "English",
  es: "Español",
  pt: "Português",
} as const;

export type InfrastructureDetailTab =
  | "details"
  | "access_controls"
  | "parents"
  | "children"
  | "templates"
  | "markets";

export interface InfrastructureDetailProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  onBack: () => void;
  dict: any;
}

export interface InfrastructureDetailTabsProps {
  activeTab: InfrastructureDetailTab;
  onTabChange: (tab: InfrastructureDetailTab) => void;
  dict: any;
}

export interface InfrastructureMetadata {
  title: string;
  description: string;
  image: string;
}

export interface TemplateContractDetailViewProps {
  templateContract: TemplateContract;
  onBack: () => void;
}

export interface ChildContractDetailViewProps {
  childContract: ChildContract;
  infrastructure: Infrastructure | { infraId: string };
  onBack: () => void;
  dict: any;
}

export interface TemplateContract {
  id: string;
  deployer: string;
  isActive: boolean;
  contractAddress: string;
  childType: string;
  infraId: string;
  scm: string;
  symbol: string;
  title: string;
  transactionHash: string;
  supplierContract: string;
}

export interface MetadataFormData {
  title: string;
  description: string;
  image: File | null;
  prompt: string;
  aiModel: string;
  workflow: string;
  tags: string[];
  loras: string[];
  attachments: File[];
  customFields: Record<string, string>;
}

export interface MetadataFormProps {
  formData: MetadataFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFileChange: (field: string, files: FileList | null) => void;
  onTagsChange: (tags: string[]) => void;
  onLorasChange: (loras: string[]) => void;
  onCustomFieldsChange: (customFields: Record<string, string>) => void;
  loading?: boolean;
  existingImageUrl?: string;
  existingAttachments?: Array<{ uri?: string; type?: string }>;
  dict: any;
}

export interface AccessControlsTabProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  dict: any;
}

export interface UseAccessControlsProps {
  infrastructure: Infrastructure;
  dict: any;
}

export interface DeployParentFormData {
  name: string;
  symbol: string;
  scm: string;
  title: string;
  description: string;
  image: File | null;
}

export interface DeployMarketFormData {
  name: string;
  symbol: string;
  title: string;
  description: string;
  image: File | null;
}

export interface DeployChildFormData {
  name: string;
  symbol: string;
  scm: string;
  childType: number;
}

export interface ChildReference {
  parent?: Parent;
  childContract: string;
  childId: string;
  template?: Template;
  isTemplate?: boolean;
  child?: Child;
  amount: string;
  uri: string;
  metadata: {
    instructions: string;
    customFields: Record<string, string>;
  };
}

export interface CreateItemFormData {
  digitalPrice: string;
  physicalPrice: string;
  version: string;
  maxPhysicalEditions: string;
  maxDigitalEditions: string;
  availability: number;
  printType?: string;
  isImmutable: boolean;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  digitalReferencesOpenToAll: boolean;
  physicalReferencesOpenToAll: boolean;
  standaloneAllowed: boolean;
  authorizedMarkets: MarketContract[];
  childReferences: ChildReference[];
  metadata: {
    title: string;
    description: string;
    image: File | null;
    prompt: string;
    aiModel: string;
    workflow: string;
    tags: string[];
    loras: string[];
    attachments: File[];
    customFields: Record<string, string>;
  };
  fulfillmentWorkflow?: Workflow;
}

export interface DeployParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeployParentFormData) => void;
  onCancel: () => void;
  loading: boolean;
  dict: any;
}

export interface DeployChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeployChildFormData) => void;
  onCancel: () => void;
  loading: boolean;
  dict: any;
}

export interface DeployTemplateFormData {
  name: string;
  symbol: string;
  scm: string;
  childType: number;
}

export interface DeployTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeployTemplateFormData) => void;
  onCancel: () => void;
  loading: boolean;
  dict: any;
}

export type CreateItemMode = "child" | "template" | "parent";

export interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateItemFormData) => Promise<void>;
  loading: boolean;
  mode: CreateItemMode;
  infraId: string;
  isEditMode?: boolean;
  editItem?: Child | Template | Parent;
  dict: any;
}

export interface ChildSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (placement: ChildReference) => void;
  onCancel?: () => void;
  selectedIds?: string[];
  dict: any;
  editingPlacement?: ChildReference;
}

export interface DetailsTabProps {
  infrastructure: Infrastructure;
  dict: any;
}

export interface ChildrenTabProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  dict: any;
}

export interface MarketsTabProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  dict: any;
}

export interface ParentsTabProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  dict: any;
}

export interface TemplatesTabProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  dict: any;
}

export interface Infrastructure {
  isDesignerGated: boolean;
  isSupplierGated: boolean;
  isPaymentTokenLocked: boolean;
  adminControlRevoked: boolean;
  accessControlContract: string;
  designerContract: string;
  fulfillerContract: string;
  paymentToken: string;
  superAdmin: string;
  supplierContract: string;
  uri: string;
  deployer: string;
  transactionHash: string;
  isActive: boolean;
  infraId: string;
  metadata: InfrastructureMetadata;
}

export interface FGOUser {
  id: string;
  ownedInfrastructures: Infrastructure[];
  adminInfrastructures: Infrastructure[];
}

export interface InfrastructureCardProps {
  infrastructure: Infrastructure;
  isOwner: boolean;
  onClick: (infrastructure: Infrastructure, isOwner: boolean) => void;
  dict: any;
}

export interface CreateInfrastructureFormData {
  title: string;
  description: string;
  image: File | null;
  paymentToken: string;
}

export interface CreateInfrastructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInfrastructureFormData) => void;
  onCancel: () => void;
  loading: boolean;
  paymentTokens: PaymentToken[];
  dict: any;
}

export interface PaymentToken {
  address: string;
  name: string;
  symbol: string;
}

export interface ParentItemCardProps {
  parent: Parent;
  onClick?: (parent: Parent) => void;
  dict: any;
}

export interface DeployMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeployMarketFormData) => void;
  onCancel: () => void;
  loading: boolean;
  dict: any;
}

export interface ParentContractMetadata {
  title: string;
  description: string;
  image: string;
}

export interface MarketContract {
  id: string;
  infraId: string;
  deployer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  contractAddress: string;
  title: string;
  isActive: boolean;
  symbol: string;
  marketURI: string;
  marketMetadata?: ParentContractMetadata;
  fulfillerContract: string;
}

export interface ChildContract {
  id: string;
  deployer: string;
  isActive: boolean;
  contractAddress: string;
  childType: string;
  infraId: string;
  scm: string;
  symbol: string;
  title: string;
  transactionHash: string;
  supplierContract: string;
}

export interface TemplateContract {
  id: string;
  deployer: string;
  contractAddress: string;
  childType: string;
  infraId: string;
  scm: string;
  symbol: string;
  title: string;
  transactionHash: string;
  supplierContract: string;
}

export interface ParentContract {
  id: string;
  infraId: string;
  deployer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  contractAddress: string;
  title: string;
  symbol: string;
  scm: string;
  isActive: boolean;
  parentURI: string;
  designerContract: string;
  parentMetadata?: ParentContractMetadata;
}

export interface ContractCardProps {
  contract: ParentContract | MarketContract | ChildContract | TemplateContract;
  onClick?:
    | ((parentContract: ParentContract) => void)
    | ((marketContract: MarketContract) => void)
    | ((childContract: ChildContract) => void)
    | ((templateContract: TemplateContract) => void);
  dict: any;
}

export interface ParentContractDetailViewProps {
  parentContract: ParentContract;
  onBack: () => void;
  dict: any;
}

export interface TemplateContractDetailViewProps {
  templateContract: TemplateContract;
  onBack: () => void;
  dict: any;
}

export interface Parent {
  infraId: string;
  designId: string;
  parentContract: string;
  designer: string;
  designerProfile: Designer;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  printType: string;
  availability: string;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  authorizedMarkets: MarketContract[];
  status: string;
  infraCurrency: string;
  totalPurchases: string;
  maxDigitalEditions: string;
  maxPhysicalEditions: string;
  currentDigitalEditions: string;
  currentPhysicalEditions: string;
  childReferences: ChildReference[];
  tokenIds: string[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  metadata: ParentMetadata;
  marketRequests: MarketRequests[];
  authorizedChildren: Child[];
  authorizedTemplates: Template[];
  workflow: Workflow;
}

export interface Workflow {
  digitalSteps: FulfillmentStep[];
  physicalSteps: FulfillmentStep[];
}

export interface ParentMetadata {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  prompt: string;
  attachments: Attachment[];
  aiModel: string;
  loras: string[];
  workflow: string;
  version: string;
  customFields?: Record<string, string>;
}

export interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  contract: string;
  infraId: string;
  dict: any;
  walletAddress: string;
  profileType: "Designer" | "Supplier" | "Fulfiller";
  userAddress?: string;
}

export interface ProfileFormData {
  title: string;
  description: string;
  link: string;
  image?: File | string | null;
  basePrice?: string;
  vigBasisPoints?: string;
}

export interface UseProfileManagerProps {
  contract: string;
  infraId: string;
  walletAddress: string;
  profileType: "Designer" | "Supplier" | "Fulfiller";
  dict: any;
}

export interface Designer {
  id: string;
  designerId: string;
  designer: string;
  infraId: string;
  blockNumber: string;
  isActive: boolean;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  version: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  accessControlContract: string;
}

export interface Supplier {
  id: string;
  supplierId: string;
  supplier: string;
  infraId: string;
  blockNumber: string;
  isActive: boolean;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  version: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  accessControlContract: string;
}

export interface Fulfiller {
  id: string;
  fulfillerId: string;
  fulfiller: string;
  infraId: string;
  blockNumber: string;
  isActive: boolean;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  version: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  accessControlContract: string;
}

export interface SubPerformer {
  splitBasisPoints: number;
  performer: string;
}

export interface FulfillmentStep {
  primaryPerformer: string;
  instructions: string;
  subPerformers: SubPerformer[];
  fulfiller?: Fulfiller;
}

export interface FulfillmentWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: Workflow) => void;
  onCancel?: () => void;
  availability: number;
  currentWorkflow?: Workflow;
  infraId: string;
  dict: any;
}

export type ApprovalTab = "markets" | "parents" | "templates";

export interface ManualApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "child" | "template" | "parent";
  itemData: Child | Template | Parent;
  dict: any;
}

export interface ApprovalItemCardProps {
  item: MarketContract | Parent | Template;
  isApproved: boolean;
  loading?: boolean;
  isActive: boolean;
  onApprove: () => void;
  onRevoke: () => void;
  itemType: "market" | "parent" | "template";
  dict: any;
}
