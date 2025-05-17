// utils/ipfs.js

import { create } from "helia";

let ipfsInstance;

const initIPFS = async () => {
  if (!ipfsInstance) {
    ipfsInstance = await create({ url: 5001 });
  }
  return ipfsInstance;
};

export const uploadFileToIPFS = async (fileBuffer) => {
  try {
    const response = await ipfsInstance.add(fileBuffer);
    return `ipfs://${response.cid.toString()}`;
  } catch (error) {
    console.error("Failed to upload file to IPFS:", error);
    throw new Error("Could not upload file to IPFS");
  }
};

// Additional utility functions can be added here
