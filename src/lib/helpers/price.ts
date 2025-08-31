import { getERC20Info } from "./erc20";

export const formatPrice = async (priceInWei: string, tokenAddress: string) => {
  const { symbol, decimals } = await getERC20Info(tokenAddress);
  const wei = BigInt(priceInWei);
  const price = Number(wei) / Math.pow(10, decimals);
  return `${price.toFixed(3)} ${symbol}`;
};