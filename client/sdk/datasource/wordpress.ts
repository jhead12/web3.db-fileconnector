// dataSources/wordpress.ts
// This file is currently not in use and has been replaced with a placeholder to prevent build errors

// Export a dummy class to prevent TypeScript errors
export class WordPressAPI {
  constructor(baseURL: string) {
    // Placeholder constructor
  }

  async getPosts() {
    return [
      {
        id: "placeholder-id",
        title: "Placeholder Title",
        content: "Placeholder Content",
      },
    ];
  }
}
