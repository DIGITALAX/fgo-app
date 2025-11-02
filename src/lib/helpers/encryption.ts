import { EncryptedData } from "@/components/Account/types";
import { SigningKey, getBytes } from "ethers";

const hexToBytes = (hex: string): Uint8Array => {
  return getBytes(hex);
};

const deriveAESKey = async (sharedSecret: Uint8Array): Promise<CryptoKey> => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new Uint8Array(sharedSecret)
  );
  return await crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const decryptData = async (
  encryptedData: EncryptedData,
  privateKey: string,
  address: string
): Promise<any> => {
  const encrypted = encryptedData[address.toLowerCase()];
  if (!encrypted) {
    throw new Error("No encrypted data found for this address");
  }

  const signingKey = new SigningKey(privateKey);

  const sharedSecret = signingKey.computeSharedSecret(encrypted.ephemPublicKey);
  const sharedSecretBytes = hexToBytes(sharedSecret);

  const aesKey = await deriveAESKey(sharedSecretBytes);

  const iv = hexToBytes(encrypted.iv);
  const ciphertext = hexToBytes(encrypted.ciphertext);

  const ivArray = Uint8Array.from(iv);
  const ciphertextArray = Uint8Array.from(ciphertext);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivArray,
    },
    aesKey,
    ciphertextArray
  );

  const decryptedString = new TextDecoder().decode(decrypted);
  return JSON.parse(decryptedString);
};
