import { createPublicClient, http } from "viem";
import { ABIS } from "@/abis";
import { chains } from "@lens-chain/sdk/viem";
import { getCurrentNetwork } from "@/constants";

const erc20Cache = new Map<string, { symbol: string; decimals: number }>();

export const getERC20Info = async (
  tokenAddress: string
): Promise<{ symbol: string; decimals: number }> => {
  if (erc20Cache.has(tokenAddress)) {
    return erc20Cache.get(tokenAddress)!;
  }

  const currentNetwork = getCurrentNetwork();
  const publicClient = createPublicClient({
    chain: currentNetwork.chainId === 37111 ? chains.testnet : chains.mainnet,
    transport: http(currentNetwork.rpcUrl),
  });


  try {
    const [symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ABIS.ERC20,
        functionName: "symbol",
      }),
      publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ABIS.ERC20,
        functionName: "decimals",
      }),
    ]);

    const info = { symbol: symbol as string, decimals: decimals as number };
    erc20Cache.set(tokenAddress, info);
    return info;
  } catch (error) {
    console.error((error as any).message);
    return { symbol: "TOKEN", decimals: 18 };
  }
};
