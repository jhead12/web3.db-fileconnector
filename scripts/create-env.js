#!/usr/bin/env node

import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const envContent = `# Base configuration
PORT=7008
API_PORT=7008
CLIENT_PORT=3000
LOG_LEVEL=info

# IPFS Configuration
IPFS_API_PORT=5001
IPFS_GATEWAY_PORT=8080
IPFS_HOST=http://localhost

# Ceramic Configuration
CERAMIC_HOST=http://localhost
CERAMIC_PORT=7007
CERAMIC_NETWORK=inmemory

# Authentication 
# Generate a random seed with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ADMIN_SEED=YOUR_ADMIN_SEED

# ComposeDB
CERAMIC_ENABLE_EXPERIMENTAL_COMPOSE_DB=true

# Database (optional)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
`;

const envPath = join(rootDir, ".env");

if (existsSync(envPath)) {
  console.log(
    "⚠️  .env file already exists. Rename or delete it if you want to create a new one."
  );
} else {
  try {
    writeFileSync(envPath, envContent);
    console.log(
      "✅ .env file created successfully! Edit it with your custom values."
    );
  } catch (error) {
    console.error("❌ Error creating .env file:", error);
  }
}
