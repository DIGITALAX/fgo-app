import { INFURA_GATEWAY } from "@/constants";

export const uploadImageToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/ipfs", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.hash;
};

export const uploadJSONToIPFS = async (json: object): Promise<string> => {
  const response = await fetch("/api/ipfs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result.hash;
};

export const fetchMetadataFromIPFS = async (uri: string): Promise<any> => {
  try {
    let metadataUrl = uri;
    if (uri.startsWith("ipfs://")) {
      metadataUrl = `${INFURA_GATEWAY}${uri.replace(
        "ipfs://",
        ""
      )}`;
    }

    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    return null;
  }
};

export const getIPFSUrl = (ipfsHash: string): string => {
  if (ipfsHash.startsWith("ipfs://")) {
    return `${INFURA_GATEWAY}${ipfsHash.replace("ipfs://", "")}`;
  }
  return ipfsHash;
};
