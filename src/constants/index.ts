import { CoreContractAddresses } from "@/components/Library/types";

export const getCoreContractAddresses = (
  chainId: number
): CoreContractAddresses => {
  const addresses = CORE_CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(
      `Core contract addresses not found for chain ID: ${chainId}`
    );
  }
  return addresses;
};

export const STATUS_LABELS = {
  0: "Active",
  1: "Supply Pending",
  2: "Disabled",
  3: "Deleted",
} as const;

export const AVAILABILITY_LABELS = {
  0: "Both",
  1: "Digital Only",
  2: "Physical Only",
} as const;

export const LOCALES: string[] = ["en", "es", "pt"];

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io/ipfs/";

export const AVAILABILITY_OPTIONS = [
  { value: 0, label: "Both Digital & Physical" },
  { value: 1, label: "Digital Only" },
  { value: 2, label: "Physical Only" },
];

export const ROUTES = {
  HOME: "/",
  ACCOUNT: "/account",
  MARKET: "/market",
} as const;

export const NAV_ITEMS = [
  { label: "Library", href: ROUTES.HOME },
  { label: "Account", href: ROUTES.ACCOUNT },
  { label: "Market", href: ROUTES.MARKET },
  { label: "Standard", href: "http://cc0web3fashion.com/dhawu" },
  {
    label: "Contracts",
    href: "https://github.com/DIGITALAX/fractional-garment-ownership",
  },
] as const;

export const PARENT_TYPE_LABELS = {
  0: "Digital Only",
  1: "Physical Only",
  2: "Both",
} as const;

export const MARKET_SUBGROUPS = [
  { id: "all", label: "All Designs", parentType: null },
  { id: "digital", label: "Digital Only", parentType: 0 },
  { id: "physical", label: "Physical Only", parentType: 1 },
  { id: "both", label: "Digital + Physical", parentType: 2 },
] as const;

export const NETWORKS = {
  LENS_TESTNET: {
    chainId: 37111,
    name: "Lens Network Testnet",
    rpcUrl: "https://rpc.testnet.lens.dev",
    blockExplorer: "https://block-explorer.testnet.lens.dev",
  },
  LENS_MAINNET: {
    chainId: 232,
    name: "Lens Network",
    rpcUrl: "https://rpc.lens.dev",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  process.env.NODE_ENV === "production"
    ? NETWORKS.LENS_MAINNET
    : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";
  return isMainnet ? NETWORKS.LENS_MAINNET : NETWORKS.LENS_TESTNET;
};

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    Factory: "0xf0434751a063F57D98CABe88620515DAB0895CeA",
    SupplyCoord: "0x8d37280916C56a15EB06bbdE06F2DEdEea21d866",
    FuturesCoord: "0xa9E055bec825D0D27b15dD4cF78BEB6C89c5Db7E",
    Mona: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    Factory: "0xf0434751a063F57D98CABe88620515DAB0895CeA",
    SupplyCoord: "0x8d37280916C56a15EB06bbdE06F2DEdEea21d866",
    FuturesCoord: "0xa9E055bec825D0D27b15dD4cF78BEB6C89c5Db7E",
    Mona: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
  },
};
