export const truncateAddress = (address: string, start = 6, end = 4): string => {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};