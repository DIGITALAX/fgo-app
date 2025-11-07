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
    rpcUrl: "https://rpc.lens.xyz",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  process.env.NODE_ENV === "production"
    ? NETWORKS.LENS_MAINNET
    : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  const isMainnet = true;
  return isMainnet ? NETWORKS.LENS_MAINNET : NETWORKS.LENS_TESTNET;
};

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    Factory: "0x85dE01C2f16Bb12Ab19D16AEfd9ee11e970e7769",
    SupplyCoord: "0x71Fb058745f58691B933C1EBddA6Eaf55E890f5e",
    FuturesCoord: "0xbA5267B9e0E764Cb703f406C43b8d6d97efFbDb6",
    Mona: "0x3D7f4Fc4E17Ead2ABBcf282A38F209D683e03835",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    Factory: "0x6575d8045e4421E4E7B6540C2D733a839E6a367A",
    SupplyCoord: "0xD8e8Eb733Beb1e1602DAc23AAAd20401a192b061",
    FuturesCoord: "0x403Fd2D23D0467e0255aA37AFC06AEC178AF9983",
    Mona: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
  },
};
