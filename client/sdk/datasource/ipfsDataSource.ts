// dataSources/ipfsDataSource.ts

import { DataSource } from "apollo-datasource";
import { IPFSInstance } from "helia";
import { IPFSDataSource } from "../types";

export class IPFSDataSource extends DataSource implements IPFSDataSource {
  private ipfs: IPFSInstance;

  constructor(ipfs: IPFSInstance) {
    super();
    this.ipfs = ipfs;
  }

  async uploadFile(fileBuffer: Buffer): Promise<string> {
    try {
      const response = await this.ipfs.add(fileBuffer);
      return `ipfs://${response.cid.toString()}`;
    } catch (error) {
      console.error("Failed to upload to IPFS:", error);
      throw new Error("Could not upload to IPFS");
    }
  }
}
