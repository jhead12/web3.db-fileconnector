import { create } from "helia";

let ipfs;

/** Start IPFS if not already initialized */
export const initIPFS = async () => {
  if (!ipfs) {
    ipfs = await create({ url: 5001 });
  }
  return ipfs;
};
