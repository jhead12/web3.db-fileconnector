// dataSources/wordpress.ts

import { GraphQLDataSource } from "apollo-datasource-graphql";
import { gql } from "apollo-server";
import { WordPressDataSource } from "../types";

const POSTS_QUERY = gql`
  query GetPosts {
    posts {
      nodes {
        id
        title
        content
      }
    }
  }
`;

export class WordPressAPI
  extends GraphQLDataSource
  implements WordPressDataSource
{
  constructor(baseURL: string) {
    super();
    this.baseURL = baseURL;
  }

  async getPosts() {
    try {
      const response = await this.query(POSTS_QUERY);
      return response.data.posts.nodes;
    } catch (error) {
      console.error("Failed to fetch WordPress posts:", error);
      throw new Error("Could not fetch posts from WordPress");
    }
  }
}
