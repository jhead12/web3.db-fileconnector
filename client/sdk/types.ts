// types.ts
// This file is currently not in use and has been replaced with a placeholder to prevent build errors

// Define placeholder interfaces to prevent TypeScript errors
export interface IPFSInstance {
  add: (fileBuffer: Buffer) => Promise<{ cid: { toString: () => string } }>;
}

export interface CeramicClient {
  // Placeholder for Ceramic client methods
}

export interface SDKConfig {
  ceramicUrl: string;
  instance: string;
  apiKey: string;
  ipfsPort?: number;
  sqlitePath?: string;
  wordpressUrl?: string;
  otherApiUrl?: string;
}

export interface WordPressDataSource {
  getPosts: () => Promise<{ id: string; title: string; content: string }[]>;
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
  getStream: (streamId: string) => Promise<any>;
}
