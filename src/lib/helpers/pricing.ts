import { getERC20Info } from "./erc20";

export const formatPrice = (
  priceInWei: string | number,
  decimals: number = 18
): string => {
  const wei =
    typeof priceInWei === "string" ? BigInt(priceInWei) : BigInt(priceInWei);
  const price = Number(wei) / Math.pow(10, decimals);
  return price.toFixed(3);
};


export const formatPriceDisplay = async (
  priceInWei: string | number,
  tokenAddress?: string
): Promise<string> => {
  if (!tokenAddress) {
    const price = formatPrice(priceInWei);
    return `${price} TOKEN`;
  }
  const { symbol, decimals } = await getERC20Info(tokenAddress);
  const price = formatPrice(priceInWei, decimals);
  return `${price} ${symbol}`;
};

export const formatPriceSync = (
  priceInWei: string | number,
  symbol: string,
  decimals: number
): string => {
  const wei =
    typeof priceInWei === "string" ? BigInt(priceInWei) : BigInt(priceInWei);
  const price = Number(wei) / Math.pow(10, decimals);
  return `${price.toFixed(3)} ${symbol}`;
};
