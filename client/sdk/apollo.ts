// apollo.ts

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLDataSource } from "apollo-datasource-graphql";
import { RESTDataSource } from "apollo-datasource-rest";
import { createIPFS, IPFSInstance } from "./ipfs";
import { createModelContextualProtocol } from "./model-contextual-protocol";
import {
  SDKConfig,
  ApolloContext,
  WordPressDataSource,
  IPFSDataSource,
  CeramicDataSource,
} from "./types";
import { WordPressAPI } from "./dataSources/wordpress";
import { IPFSDataSource as IPFSDataSourceImpl } from "./dataSources/ipfsDataSource";
import { CeramicDataSource as CeramicDataSourceImpl } from "./dataSources/ceramic";

// GraphQL Schema
const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type IPFSResponse {
    cid: String!
  }

  type CeramicStream {
    id: String!
    content: String!
  }

  type Query {
    posts: [Post!]!
    ipfsFile(cid: String!): IPFSResponse!
    ceramicStream(streamId: String!): CeramicStream!
  }

  type Mutation {
    uploadToIPFS(file: String!): IPFSResponse!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    posts: async (_: any, __: any, { dataSources }: ApolloContext) => {
      return dataSources.wordpress.getPosts();
    },
    ipfsFile: async (
      _: any,
      { cid }: { cid: string },
      { dataSources }: ApolloContext
    ) => {
      // Example: Fetch file metadata from IPFS
      return { cid };
    },
    ceramicStream: async (
      _: any,
      { streamId }: { streamId: string },
      { dataSources }: ApolloContext
    ) => {
      return dataSources.ceramic.getStream(streamId);
    },
  },
  Mutation: {
    uploadToIPFS: async (
      _: any,
      { file }: { file: string },
      { dataSources }: ApolloContext
    ) => {
      const buffer = Buffer.from(file);
      const cid = await dataSources.ipfs.uploadFile(buffer);
      return { cid };
    },
  },
};

export async function startApolloServer(config: SDKConfig) {
  try {
    // Initialize IPFS and Ceramic
    const { ipfs, ceramic } = await createModelContextualProtocol(config);

    // Create data sources
    const dataSources = {
      wordpress: new WordPressAPI(
        config.wordpressUrl || "https://your-wordpress-site.com/graphql"
      ),
      ipfs: new IPFSDataSourceImpl(ipfs),
      ceramic: new CeramicDataSourceImpl(ceramic),
    };

    // Create Apollo Server
    const server = new ApolloServer<ApolloContext>({
      schema: makeExecutableSchema({ typeDefs, resolvers }),
      dataSources: () => dataSources,
    });

    // Start server
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    console.log(`🚀 Apollo Server ready at ${url}`);

    return server;
  } catch (error) {
    console.error("Failed to start Apollo Server:", error);
    throw new Error("Could not start Apollo Server");
  }
}
