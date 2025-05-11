import { config } from 'dotenv';

// Load environment variables from .env file
config();
// Export configuration object
// with default values
// for ceramicUrl, instance, and apiKey
// if not provided in .env file
// or environment variables
// This is a simple configuration file for a Node.js application
// that uses the dotenv package to load environment variables

// from a .env file. It exports an object with three properties:
// MCP Server URL: The URL of the MCP server.
// API Key: The API key for accessing the MCP server.
// Instance: The URL of the instance.
// API Key: The API key for accessing the Ceramic network.
// MCP Server URL: The URL of the MCP server.

// ceramicUrl: The URL of the Ceramic network.

module.exports = {
  ceramicUrl: process.env.CERAMIC_URL || 'https://ceramic-clay.3boxlabs.com',
  instance: process.env.INSTANCE || 'https://ceramic-clay.3boxlabs.com',
  apiKey: process.env.API_KEY || 'ceramic-clay.3boxlabs.com'  
};