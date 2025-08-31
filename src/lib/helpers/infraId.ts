import { padHex } from "viem";

export const convertInfraIdToBytes32 = (infraId: string): `0x${string}` => {
  const hexString = parseInt(infraId).toString(16);
  const evenHexString = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  return padHex(`0x${evenHexString}`, { size: 32 });
};

export const convertInfraIdToHex = (infraId: string): string => {
  const hexString = parseInt(infraId).toString(16);
  const evenHexString = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  return `0x${evenHexString}`;
};