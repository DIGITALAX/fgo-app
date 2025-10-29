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
    Factory: "0x6b43c0527200792F93717fb0f47da928C667751b",
    SupplyCoord: "0x58D65dbD884A24e9816D3AA8677A337ec819A75f",
    FuturesCoord: "0x08cDDA32055Ca84f728a76ba84c2547041360415",
    TestToken: "0x18921123f3457AD3c974f2edfCb1053FB29450AC",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    Factory: "0x6b43c0527200792F93717fb0f47da928C667751b",
    SupplyCoord: "0x58D65dbD884A24e9816D3AA8677A337ec819A75f",
    FuturesCoord: "0x08cDDA32055Ca84f728a76ba84c2547041360415",
    TestToken: "0x18921123f3457AD3c974f2edfCb1053FB29450AC",
  },
};
