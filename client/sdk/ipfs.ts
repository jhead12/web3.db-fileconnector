// ipfs.js

import { initIPFS } from "./utils/ipfs";

export const createIPFS = async () => {
  try {
    const ipfs = await initIPFS();
    return ipfs;
  } catch (error) {
    console.error("Failed to initialize IPFS:", error);
    throw new Error("Could not initialize IPFS");
  }
};

// Additional utility methods can be added here
