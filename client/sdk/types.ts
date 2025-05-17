// types.ts

import { IPFSInstance } from "helia";
import { Ceramic } from "@ceramicnetwork/core";

export interface SDKConfig {
  ceramicUrl: string;
  instance: string;
  apiKey: string;
  ipfsPort?: number;
  sqlitePath?: string;
  wordpressUrl?: string; // WPGraphQL endpoint
  otherApiUrl?: string; // Example for other REST APIs
}

export interface CeramicClient {
  // Placeholder for Ceramic client methods
}

export interface WordPressDataSource {
  getPosts: () => Promise<{ id: string; title: string; content: string }[]>;
  // Add other WPGraphQL queries as needed
}

export interface ApolloContext {
  dataSources: {
    wordpress: WordPressDataSource;
    ipfs: IPFSDataSource;
    ceramic: CeramicDataSource;
  };
}

export interface IPFSDataSource {
  uploadFile: (fileBuffer: Buffer) => Promise<string>;
}

export interface CeramicDataSource {
  // Define Ceramic-specific methods
  getStream: (streamId: string) => Promise<any>;
}
