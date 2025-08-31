import { fetchMetadataFromIPFS } from "./ipfs";

export const ensureMetadata = async (item: any) => {
  if (!item.metadata && item.uri) {
    const ipfsMetadata = await fetchMetadataFromIPFS(item.uri);
    item.metadata = ipfsMetadata;
  }
  return item;
};