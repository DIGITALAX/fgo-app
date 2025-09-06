import { CoreContractAddresses } from "@/components/Library/types";

export const DEFAULT_COLORS_ROLES: { [key: string]: string } = {
  superadmin: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  admin: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  designer: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  supplier: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  fulfiller: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
};

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
  1: "Disabled",
  2: "Deleted",
} as const;

export const AVAILABILITY_LABELS = {
  0: "Both",
  1: "Digital Only",
  2: "Physical Only",
} as const;

export const LOCALES: string[] = ["en", "es"];

export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io/ipfs/";

export const AVAILABILITY_OPTIONS = [
  { value: 0, label: "Both Digital & Physical" },
  { value: 1, label: "Digital Only" },
  { value: 2, label: "Physical Only" },
];

export const ROUTES = {
  HOME: "/",
  ACCOUNT: "/account",
} as const;

export const NAV_ITEMS = [
  { label: "Library", href: ROUTES.HOME },
  { label: "Account", href: ROUTES.ACCOUNT },
    { label: "Standard", href: "http://cc0web3fashion.com/dhawu" },
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
    Factory: "0x906b05fb0e297d6c8c1d812ae872d2daa6c4b3c8",
    TestToken: "0xE5E9D4C119a28302EDa029155bF00efd35E06c93",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    Factory: "0x906b05fb0e297d6c8c1d812ae872d2daa6c4b3c8",
    TestToken: "0xE5E9D4C119a28302EDa029155bF00efd35E06c93",
  },
};
