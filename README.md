# web3.db-fileconnector

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![npm](https://img.shields.io/npm/v/web3.db-fileconnector)
![Security](https://img.shields.io/badge/Security-Audited-green)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)
![Build](https://img.shields.io/badge/Build-Passing-green)

OrbisDB connects you to the GraphQL system that manages your Web3 data using the Ceramic network. It's a decentralized, open-source database built on top of web3 technologies with Helia IPFS integration, offering secure, efficient storage and query capabilities for your data.

## 🆕 What's New in v2.0.0

- **🐳 Enhanced Docker Support**: Complete containerization with multi-platform builds (ARM64/AMD64)
- **🔧 Improved Build Process**: Optimized Docker builds with proper layer caching and .next directory handling
- **🚀 Production Ready**: Streamlined deployment with automated health checks and security improvements
- **📦 Updated Dependencies**: Latest versions of Next.js, React, and other core dependencies
- **🛡️ Security Hardening**: Enhanced security auditing and vulnerability management
- **⚡ Performance Optimizations**: Faster builds and reduced container size

## 📦 NPM Package Installation

Use web3.db-fileconnector as an NPM package in your existing application:

```bash
# Install via npm
npm install web3.db-fileconnector

# Install via pnpm  
pnpm add web3.db-fileconnector

# Install via yarn
yarn add web3.db-fileconnector
```

### Quick Integration Example

```javascript
import { initIPFS } from 'web3.db-fileconnector/server/ipfs/config.js';
import { GlobalContext } from 'web3.db-fileconnector/client/contexts/Global';

// Initialize IPFS with Helia (enhanced in v2.0.0)
const ipfs = await initIPFS();
const cid = await ipfs.add("Hello from your app!");
console.log('Content stored with CID:', cid);

// Use GraphQL API
import { OrbisDB } from 'web3.db-fileconnector/server/orbisdb';
const orbis = new OrbisDB({
  ceramic: 'http://localhost:7007',
  node: 'http://localhost:7008'
});

// Query data using GraphQL
const query = `
  query GetPosts($limit: Int) {
    posts(limit: $limit) {
      id
      title
      content
      author
      createdAt
    }
  }
`;

const result = await orbis.query(query, { limit: 10 });
console.log('Posts:', result.data.posts);

// Use in React components
import { Button } from 'web3.db-fileconnector/client/components/Button';
import { Header } from 'web3.db-fileconnector/client/components/Header';

function MyApp() {
  return (
    <GlobalContext.Provider>
      <div>
        <Header />
        <Button>My Web3 App</Button>
        {/* Your app content */}
      </div>
    </GlobalContext.Provider>
  );
}
```

### Advanced Usage Examples

```javascript
// File upload with progress tracking
import { uploadFile } from 'web3.db-fileconnector/sdk';

async function handleFileUpload(file) {
  try {
    const result = await uploadFile(file, {
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress}%`);
      },
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['image/*', 'application/pdf']
    });
    
    console.log('File uploaded:', result.cid);
    return result;
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

// Working with Ceramic streams
import { createStream, updateStream } from 'web3.db-fileconnector/server/ceramic';

async function createPost(data) {
  const stream = await createStream('Post', {
    title: data.title,
    content: data.content,
    author: data.author,
    timestamp: new Date().toISOString()
  });
  
  return stream.id;
}
```

### NPM Package Features

- **🔐 Secure IPFS Integration**: Helia-powered decentralized storage (migrated from ipfs-http-client)
- **📊 GraphQL API**: Ready-to-use data management system with Ceramic Network
- **🎨 UI Components**: Pre-built React components for Web3 apps
- **🔧 Utilities**: Helper functions for DID authentication, data syncing
- **📱 Responsive**: Mobile-friendly components and layouts
- **⚡ Production Ready**: Optimized for enterprise applications with security auditing
- **🛡️ Security Focused**: v2.0.0 includes comprehensive security improvements and Docker optimization
- **🔄 Modern Dependencies**: Uses latest Helia, multiformats, and blockstore technologies
- **🐳 Docker Native**: Full containerization support with multi-platform builds

## ⏱️ 5-Minute Local Development Setup

### Option 1: Automatic Setup Script (Recommended)

Get a complete Web3 stack running in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector.git
cd web3db-fileconnector

# 2. Run the automatic setup script
npm run setup
# OR
./setup.sh
```

**What the setup script does:**
1. ✅ Installs yarn if not available
2. ✅ Installs project dependencies (including Helia IPFS)
3. ✅ Installs IPFS daemon if not already installed
4. ✅ Installs Ceramic CLI if not already installed
5. ✅ Creates environment variables (.env file)
6. ✅ Starts IPFS daemon in background
7. ✅ Starts Ceramic network with ComposeDB
8. ✅ Initializes API server and sample app
9. ✅ Opens your browser to the running application

**Stack URLs after setup:**
- 🌐 **Main App**: http://localhost:3001
- 🔧 **API Server**: http://localhost:7008  
- 📊 **GraphQL Playground**: http://localhost:7008/graphql
- 🗄️ **IPFS Web UI**: http://localhost:5001/webui
- 🏺 **Ceramic Node**: http://localhost:7007

**Shutdown all services:**
```bash
npm run shutdown
# OR
./shutdown.sh
```

### Option 2: Manual Setup

If you prefer to set up each component individually:

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector.git
cd web3db-fileconnector

# 2. Install dependencies for the main project
yarn install

# 3. Start local IPFS (in a separate terminal)
npx ipfs daemon

# 4. Start Ceramic with ComposeDB (in a separate terminal)
npx ceramic-one daemon --network inmemory

# 5. Setup and start the sample API app (in a separate terminal)
cd server/ceramic-app/ceramic-app-app
yarn install
yarn generate         # Generates admin credentials and configuration
yarn composites       # Deploys ComposeDB models
yarn nextDev          # Starts the sample Next.js API app

# 6. Start the main API server (in a separate terminal)
cd /workspaces/web3db-connector  # Return to project root if needed
yarn dev
```

**Your complete stack is now running:**
- IPFS node: http://localhost:5001/webui
- Ceramic node: http://localhost:7007
- Sample API app: http://localhost:3000
- Main API server: http://localhost:7008
- GraphQL playground: http://localhost:7008/graphql

**Key features available:**
- Decentralized data storage with IPFS
- Structured data with Ceramic and ComposeDB
- GraphQL API with DID authentication
- Next.js sample application

For troubleshooting or advanced configuration, see the [Detailed Installation](#detailed-installation) section below.

## 🚀 Quick Start Guide

Get up and running with web3.db-fileconnector in minutes:

### Prerequisites

- **Node.js**: v18.17.0 or later
- **npm**: v8.6.0 or later (or pnpm for faster installs)
- **Docker**: v20.10 or later (optional, for containerized setup)

### System Requirements & File Size Recommendations

#### Disk Space Requirements
- **Minimum**: 15GB free disk space for basic installation
- **Recommended**: 35GB+ free disk space for development with build processes
- **Production**: 60GB+ for optimal performance with full Docker stack

#### File Upload Limits
- **IPFS File Size**: Up to 100MB per file recommended for optimal performance
- **Large Files**: Files >100MB may experience slower upload/retrieval times
- **Batch Operations**: Recommended batch size of 50 files or 500MB total per operation
- **Database Records**: No strict limits, but pagination recommended for >1000 records

#### Performance Considerations
- **Memory**: 8GB+ RAM recommended (16GB+ for heavy development workloads)
- **Network**: Stable internet connection for IPFS and Ceramic network synchronization
- **Storage**: SSD preferred for faster build times and database operations

> ⚠️ **Important**: The project requires significant disk space due to:
> - Node.js dependencies (~4-5GB in node_modules)
> - Docker images and containers (~3-4GB)
> - IPFS data storage and pinning
> - Ceramic network data and indexing
> - Build artifacts and logs

### Option 1: Quick Local Setup (Recommended for First-Time Users)

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector.git
cd web3db-fileconnector

# 2. Create and configure environment variables
npm run create-env
# Edit the .env file with your values

# 3. Install dependencies (use pnpm for faster installs)
pnpm install
# OR
npm install

# 4. Start Ceramic network (in-memory mode for testing)
npx ceramic-one daemon --network inmemory

# 4a. To see available Ceramic options, run:
ceramic daemon -h

# Alternatively, you may use:
npm run ceramic:start

# 5. In a new terminal, start the development server
npm run dev
```

Your application is now running:

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:7008](http://localhost:7008)
- GraphQL Playground: [http://localhost:7008/graphql](http://localhost:7008/graphql)

## 📁 Project Structure

The project is organized into several key directories:

```
web3db-connector/
├── client/                 # Next.js frontend application
│   ├── components/        # Reusable React components
│   ├── pages/            # Next.js pages and API routes
│   ├── styles/           # CSS and styling files
│   ├── sdk/              # Client-side SDK for IPFS, GraphQL, etc.
│   └── public/           # Static assets
├── server/                # Backend API server
│   ├── routes/           # API route handlers
│   ├── ceramic/          # Ceramic network integration
│   ├── ipfs/             # IPFS/Helia configuration
│   ├── db/               # Database connections (PostgreSQL, Supabase)
│   ├── indexing/         # Data indexing services
│   └── utils/            # Server utilities
├── scripts/               # Build and deployment scripts
├── Dockerfile            # Production Docker configuration
├── docker-compose.yaml   # Multi-service Docker setup
└── package.json          # Project dependencies and scripts
```

### Key Components

- **Client**: Next.js React application with Web3 components
- **Server**: Fastify-based API server with GraphQL support
- **Ceramic**: Decentralized data network integration
- **IPFS**: Distributed file storage using Helia
- **Database**: PostgreSQL with vector extensions for advanced queries

## 🔧 Architecture Overview

```mermaid
graph TB
    A[Client App] --> B[API Server]
    B --> C[Ceramic Network]
    B --> D[IPFS/Helia]
    B --> E[PostgreSQL]
    C --> F[ComposeDB]
    D --> G[Distributed Storage]
    E --> H[Vector Extensions]
```

### Option 2: Docker Setup (Recommended for Production)

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector.git
cd web3db-fileconnector

# 2. Create and configure environment variables
npm run create-env
# Edit the .env file with your values

# 3. Build and start all services
docker-compose up -d

# 4. Check that all services are running
docker-compose ps
```

**New in v2.0.0**: Enhanced Docker support with:
- ✅ Multi-platform builds (ARM64/AMD64)
- ✅ Optimized build process with proper layer caching
- ✅ Fixed .next directory handling in containers
- ✅ Reduced image size and faster builds
- ✅ Production-ready health checks
- ✅ Improved security with non-root user

Your containerized application is now running:

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:7008](http://localhost:7008)
- Ceramic: [http://localhost:3001](http://localhost:3001)
- PostgreSQL: localhost:5432

---

## 🚀 Production Deployment

### Docker Production Build

```bash
# Build for production
docker build -t web3db-connector:production .

# Run in production mode
docker run -d \
  --name web3db-prod \
  -p 3000:3000 \
  -e NODE_ENV=production \
  web3db-connector:production

# Or use Docker Compose for full stack
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

Create a production `.env` file:

```bash
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Ceramic Production Network
CERAMIC_URL=https://ceramic-prod.3boxlabs.com
CERAMIC_NETWORK=mainnet

# IPFS Production Gateway
IPFS_GATEWAY=https://ipfs.io/ipfs/
IPFS_API_URL=https://ipfs.infura.io:5001/api/v0

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/web3db_prod
POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
POSTGRES_DB=web3db_prod
POSTGRES_USER=web3db_user
POSTGRES_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-jwt-secret-key
ADMIN_SECRET=your-admin-secret
```

### Performance Optimizations

```javascript
// Enable production optimizations in next.config.mjs
const nextConfig = {
  // ...existing code...
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['ipfs.io', 'gateway.ipfs.io'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable SWC minification
  swcMinify: true,
};
```

### Health Checks and Monitoring

The application includes built-in health checks:

```bash
# Check application health
curl http://localhost:3000/health

# Response format:
{
  "status": "healthy",
  "timestamp": "2025-05-27T10:00:00Z",
  "services": {
    "database": "connected",
    "ceramic": "connected",
    "ipfs": "connected"
  }
}
```

---

- [Available Scripts](#available-scripts)
- [File Handling Best Practices](#file-handling-best-practices)
- [Development Workflow](#development-workflow)
- [Detailed Installation](#detailed-installation)
  - [Ceramic Setup](#ceramic-setup)
  - [OrbisDB Configuration](#orbisdb-configuration)
- [Docker Integration](#docker-integration)
- [Environment Variables](#environment-variables)
- [Integrating PostgreSQL with Airtable](#integrating-postgresql-with-airtable)
- [Troubleshooting](#troubleshooting)
- [License & Contact](#license--contact)

---

## Table of Contents

- [🆕 What's New in v2.0.0](#-whats-new-in-v200)
- [📦 NPM Package Installation](#-npm-package-installation)
- [⏱️ 5-Minute Local Development Setup](#️-5-minute-local-development-setup)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [📁 Project Structure](#-project-structure)
- [🔧 Architecture Overview](#-architecture-overview)
- [🚀 Production Deployment](#-production-deployment)
- [Available Scripts](#available-scripts)
- [File Handling Best Practices](#file-handling-best-practices)
- [Development Workflow](#development-workflow)
- [Detailed Installation](#detailed-installation)
  - [Ceramic Setup](#ceramic-setup)
  - [OrbisDB Configuration](#orbisdb-configuration)
- [Docker Integration](#docker-integration)
- [Environment Variables](#environment-variables)
- [Integrating PostgreSQL with Airtable](#integrating-postgresql-with-airtable)
- [Troubleshooting](#troubleshooting)
- [⚠️ CRITICAL: Database Permissions Setup](#️-critical-database-permissions-setup)
- [License & Contact](#license--contact)

---

## Available Scripts

### Core Development Scripts

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the development server                 |
| `npm run build`      | Build the Next.js client application        |
| `npm run start`      | Run the application in production mode       |
| `npm run dev:docker` | Start with Docker and run development server |
| `npm run dev:watch`  | Start with auto-restart on file changes     |
| `npm run dev:debug`  | Start with debug logging enabled            |

### Setup & Maintenance

| Script                    | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `npm run setup`           | Complete automated setup (IPFS + Ceramic + app)     |
| `npm run shutdown`        | Stop all running services                           |
| `npm run create-env`      | Create a `.env` file from template                  |
| `npm run system:check`    | Verify server dependencies and configuration        |
| `npm run helia:test`      | Test IPFS/Helia configuration                       |
| `npm run clean`           | Remove build cache and dependencies                 |
| `npm run clean:all`       | Remove all build artifacts for a fresh start        |
| `npm run format`          | Format code using Prettier                          |
| `npm run lint`            | Check code quality with ESLint                      |
| `npm run permissions`     | Fix shell script permissions                        |

### Ceramic & Database

| Script                      | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `npm run ceramic:build`     | Set up and manage Ceramic DB                    |
| `npm run ceramic:start`     | Start Ceramic daemon (local network)            |
| `npm run ceramic:start:dev` | Start Ceramic with dev environment              |
| `npm run wheel:build`       | Build Ceramic configuration                     |
| `npm run wheel:build:watch` | Build Ceramic config with file watching         |

### Docker Management

| Script                     | Description                  |
| -------------------------- | ---------------------------- |
| `npm run docker:build`     | Build the Docker image       |
| `npm run docker:start`     | Start the Docker container   |
| `npm run docker:stop`      | Stop the Docker container    |
| `npm run docker:restart`   | Restart the Docker container |
| `npm run docker:remove`    | Remove the Docker container  |
| `npm run docker:status`    | Show Docker container status |

### Security & Testing

| Script                    | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `npm run test:security`   | Run security audit on production dependencies |
| `npm run validate`        | Run security audit + linting                  |
| `npm run permissions`     | Fix shell script permissions                  |

> **🛡️ Security Note**: Version 2.0.0 includes major security improvements including comprehensive dependency updates, Docker security hardening with non-root users, and enhanced permission management.

### Release Management

| Script                      | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `npm run changelog`         | Generate changelog from conventional commits       |
| `npm run sync-versions`     | Sync version across all package.json files        |
| `npm run prepare-release`   | Prepare release (run validation + setup)          |
| `npm run version:major`     | Bump major version and create release             |
| `npm run version:minor`     | Bump minor version and create release             |
| `npm run version:patch`     | Bump patch version and create release             |
| `npm run release:major`     | Full major release workflow                       |
| `npm run release:minor`     | Full minor release workflow                       |
| `npm run release:patch`     | Full patch release workflow                       |

> **📦 Release Workflow**: Our automated release system includes security validation, version bumping, changelog generation, and npm publishing with conventional commit standards.

### Publishing & Distribution

| Script                     | Description                               |
| -------------------------- | ----------------------------------------- |
| `npm run publish:npm`      | Publish to npm with public access        |
| `npm run publish:docker`   | Build and push Docker image              |
| `npm run publish:github`   | Publish to npm and Docker                |
| `npm run publish:release`  | Full release: validate + build + publish |

### Git Branch Management

| Script                       | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `npm run release:prepare`    | Checkout main, pull, and merge develop      |
| `npm run branch:feature`     | Create new feature branch from develop      |
| `npm run branch:hotfix`      | Create new hotfix branch from main          |
| `npm run branch:cleanup`     | Delete merged branches                      |

---

## File Handling Best Practices

### IPFS File Upload Guidelines

#### Recommended File Sizes
- **Small Files** (< 1MB): Optimal for metadata, configurations, and JSON documents
- **Medium Files** (1MB - 25MB): Good for images, documents, and small media files
- **Large Files** (25MB - 100MB): Acceptable but may experience slower upload times
- **Very Large Files** (> 100MB): Not recommended, consider breaking into chunks

#### Supported File Types
```javascript
// Recommended file types for optimal performance
const recommendedTypes = {
  documents: ['.json', '.txt', '.md', '.pdf'],
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  media: ['.mp3', '.mp4', '.webm'],
  data: ['.csv', '.json', '.xml'],
  archives: ['.zip', '.tar.gz'] // Use sparingly
};

// Example file upload with size validation
async function uploadToIPFS(file) {
  const maxSize = 100 * 1024 * 1024; // 100MB
  
  if (file.size > maxSize) {
    throw new Error(`File too large: ${file.size} bytes. Maximum: ${maxSize} bytes`);
  }
  
  const ipfs = await initIPFS();
  const result = await ipfs.add(file);
  return result.cid;
}
```

#### Database Record Limits
- **Single Query**: Limit to 1000 records per query
- **Batch Operations**: Process in chunks of 100-500 records
- **Pagination**: Always implement for user-facing lists
- **Indexing**: Use appropriate indexes for large datasets

#### Storage Optimization Tips
```javascript
// Compress large JSON before storage
import { deflate, inflate } from 'pako';

async function storeCompressedData(data) {
  const compressed = deflate(JSON.stringify(data));
  const ipfs = await initIPFS();
  return await ipfs.add(compressed);
}

// Implement file chunking for large files
async function uploadLargeFile(file) {
  const chunkSize = 10 * 1024 * 1024; // 10MB chunks
  const chunks = [];
  
  for (let i = 0; i < file.size; i += chunkSize) {
    const chunk = file.slice(i, i + chunkSize);
    const cid = await ipfs.add(chunk);
    chunks.push(cid);
  }
  
  // Store chunk manifest
  const manifest = { chunks, originalSize: file.size };
  return await ipfs.add(JSON.stringify(manifest));
}
```

#### Performance Monitoring
```javascript
// Monitor upload performance
async function monitoredUpload(file) {
  const startTime = Date.now();
  const maxTimeout = 60000; // 1 minute
  
  try {
    const result = await Promise.race([
      uploadToIPFS(file),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), maxTimeout)
      )
    ]);
    
    const duration = Date.now() - startTime;
    console.log(`Upload completed in ${duration}ms`);
    return result;
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}
```

#### Error Handling & Retry Logic
```javascript
async function robustUpload(file, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToIPFS(file);
    } catch (error) {
      console.warn(`Upload attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Upload failed after ${maxRetries} attempts`);
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

### File System Best Practices

#### Project File Organization
```
recommended-project-structure/
├── uploads/           # Temporary upload storage (< 1GB)
├── cache/            # Build and runtime cache (< 2GB)
├── logs/             # Application logs (rotate daily)
├── data/             # Persistent data storage
│   ├── ipfs/         # IPFS repository data
│   ├── ceramic/      # Ceramic network data
│   └── postgres/     # Database files (if local)
└── backups/          # Regular data backups
```

#### Cleanup & Maintenance
```bash
# Regular cleanup script (add to cron)
#!/bin/bash
# Clean old logs (keep 7 days)
find logs/ -name "*.log" -mtime +7 -delete

# Clean upload cache (keep 1 day)
find uploads/ -type f -mtime +1 -delete

# Clean build cache periodically
npm run clean

# Monitor disk usage
df -h . | awk 'NR==2 {print "Disk usage: " $5}'
```

---

## Development Workflow

### Local Development

Choose the development mode that best suits your needs:

```bash
# Standard development
yarn dev

# Auto-restart on changes
yarn dev:watch

# Debug mode with detailed logging
yarn dev:debug

# Development with Docker
yarn dev:docker
```

### Building for Production

```bash
# Build the client application
yarn build

# Start in production mode
yarn start
```

### Code Quality

```bash
# Format code
yarn format

# Lint code
yarn lint
```

---

## Detailed Installation

### Ceramic Setup

#### Automated Ceramic DB Setup

Our project includes an automated setup script to quickly configure and manage your Ceramic DB.

**Prerequisites**:

- Operating system: Linux, Mac, or Windows (with WSL2)
- Node.js v20 (use nvm to install if needed)
- npm v10 (installed automatically with Node.js v20)
- A running ceramic-one node (see below)

**Setting up ceramic-one**:

```bash
# MacOS (using Homebrew)
brew install ceramicnetwork/tap/ceramic-one
ceramic-one daemon --network inmemory

# For other networks:
# ceramic-one daemon --network testnet-clay
```

_Note: To view all available options and flags for the Ceramic daemon, run:_

```bash
ceramic daemon -h
```

**Running the Wheel Script**:

```bash
cd server
./wheel
```

During execution, you'll configure:

- Project name and directory
- Network selection (choose `inmemory` for local testing)
- Ceramic & ComposeDB integration options
- Sample application inclusion
- DID secret key path

After configuration, start Ceramic:

```bash
./ceramic daemon --config /path/to/project/ceramic-app/daemon_config.json
```

#### Manual Ceramic CLI Installation

**On MacOS**:

```bash
brew install ceramicnetwork/tap/ceramic-one
ceramic-one daemon --network inmemory
```

**On Windows** (with Node.js v18+):

```bash
npm install -g @ceramicnetwork/cli
ceramic did:generate  # Optional: initialize your Ceramic identity
ceramic daemon --network inmemory
```

### OrbisDB Configuration

Once Ceramic is running, connect it to OrbisDB:

```bash
# Get your Ceramic ID
ceramic id

# Initialize OrbisDB with your Ceramic ID
pnpm run init --ceramic-id <ceramic-id>
```

---

## Docker Integration

### Prerequisites

- Docker v20.10+
- Docker Compose v1.29+
- Windows users: WSL2 enabled with Docker Desktop

### Quick Docker Start

```bash
# Build and run the application
docker build -t web3db-connector:latest .
docker run -p 3000:3000 web3db-connector:latest

# Or use the NPM scripts
npm run docker:build
npm run docker:start
```

### Multi-Platform Build (New in v2.0.0)

```bash
# Build for multiple architectures
docker buildx build --platform linux/arm64,linux/amd64 -t web3db-connector:latest .

# Use the automated script for publishing
npm run publish:docker:latest
```

### Container Structure

The project uses multiple containers:

- **js-client**: Next.js frontend (port 3000)
- **js-server**: Main application server (port 7008)
- **ts-ceramic-mcp-app**: Ceramic integration (port 3001)
- **postgres**: PostgreSQL database with pgvector (port 5432)

### Basic Docker Commands

```bash
# Start all services
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs

# Stop all services
docker-compose down
```

### Using Docker Scripts

```bash
# Start the pgvector Docker container
npm run docker:start

# Check Docker status
npm run docker:status

# Stop Docker container
npm run docker:stop
```

---

## Environment Variables

Create a `.env` file at the project root (use `npm run create-env` to create from template):

### Required Variables

```bash
# Ceramic Configuration
CERAMIC_URL='http://localhost:7007'
CERAMIC_INSTANCE='<YOUR_INSTANCE_URL>'
CERAMIC_APIKey='<YOUR_API_KEY>'

# OrbisDB Configuration
ORBISDB_API_URL=https://rpc.ankr.com/eth_holesky/
ORBISDB_API_KEY=https://rpc.ankr.com/multichain/
ORBISDB_CHAIN_ID=17000
ORBISDB_CONTRACT_ADDRESS=0xYourOrbisDBContractAddresc

# IPFS Configuration
IPFS_PATH='/ipfs'
IPFS_GATEWAY='https://ipfs.io/ipfs/'
IPFS_API_URL='https://ipfs.infura.io:5001/api/v0'
IPFS_API_KEY='<YOUR_INFURA_IPFS_API_KEY>'
IPFS_API_SECRET='<YOUR_INFURA_IPFS_API_SECRET>'
IPFS_PROJECT_ID='<YOUR_INFURA_IPFS_PROJECT_ID>'
```

---

## Integrating PostgreSQL with Airtable

While Airtable doesn’t support direct PostgreSQL connections, you can set up a data integration between the two using third-party tools. One robust method is to use **Airbyte**, an open-source data integration platform that supports both PostgreSQL and Airtable.

### Using Airbyte for Real-Time Sync

1. **Install Airbyte on Your Server**  
   Download and install Airbyte from [Airbyte's website](https://airbyte.com/) or run it via Docker:

   ```bash
   docker run -d --name airbyte_server -p 8000:8000 airbyte/airbyte:latest
   ```

   This command starts the Airbyte server, typically accessible at [http://localhost:8000](http://localhost:8000).

2. **Configure PostgreSQL as the Source Connector**

   - Open the Airbyte UI.
   - Add a new source and select **PostgreSQL**.
   - Provide the necessary connection details (host, port, database name, username, and password).
   - Test the connection to verify access.

3. **Set Up Airtable as the Destination Connector**

   - In the Airbyte UI, add a new destination.
   - Choose **Airtable** and enter the required details: API key, Base ID, and the target table.
   - Test this connection as well.

4. **Schedule Automatic Sync**

   - Create a new connection in Airbyte linking your PostgreSQL source to your Airtable destination.
   - Configure the synchronization schedule (e.g., every 15 minutes, hourly, or daily) based on your needs.
   - Save your connection to enable automated data transfers.

5. **Monitor Operation**
   - Use the Airbyte UI to view sync logs and ensure the data flows smoothly.
   - Address any errors promptly based on the log feedback.

Other integration options (like Zapier or manual CSV export/import) are available, but Airbyte provides a robust, automated solution for real-time sync between PostgreSQL and Airtable.

---

## Troubleshooting

### Common Issues

#### Ceramic Connection Issues

**Problem**: Cannot connect to Ceramic network  
**Solution**:

```bash
# Check if Ceramic is running
ceramic-one status

# Restart Ceramic daemon
ceramic-one daemon --network inmemory
```

#### Docker Issues

**Problem**: Container fails to start  
**Solution**:

```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Problem**: `.next` directory not found in container (Fixed in v2.0.0)  
**Solution**:
This issue has been resolved in v2.0.0. The Docker build now properly handles the Next.js build output. If you're still experiencing issues:

```bash
# Ensure you're using the latest version
git pull origin main
docker build --no-cache -t web3db-connector:latest .
```

**Problem**: Multi-platform build fails  
**Solution**:

```bash
# Set up Docker buildx for multi-platform builds
docker buildx create --use
docker buildx build --platform linux/arm64,linux/amd64 -t web3db-connector:latest .
```

**Problem**: Container build takes too long  
**Solution**:

```bash
# Use Docker layer caching (automatically optimized in v2.0.0)
docker build --build-arg BUILDKIT_INLINE_CACHE=1 -t web3db-connector:latest .

# Clean Docker cache if needed
docker system prune -a
```

#### Port Conflicts

**Problem**: Port already in use  
**Solution**:

```bash
# Clear ports
yarn clear-port

# Or manually kill the process using the port (e.g., for port 7008):
lsof -i :7008
kill -9 <PID>
```

#### File Size & Disk Space Issues

**Problem**: "No space left on device" during build or upload  
**Solution**:

```bash
# Check disk usage
df -h

# Clean up project dependencies
npm run clean:all

# Clear Docker cache
docker system prune -a

# Clean npm/pnpm cache
npm cache clean --force
pnpm store prune
```

**Problem**: File upload fails with "File too large" error  
**Solution**:

```javascript
// Check file size before upload
const maxSize = 100 * 1024 * 1024; // 100MB
if (file.size > maxSize) {
  console.error(`File size ${(file.size/1024/1024).toFixed(2)}MB exceeds limit of 100MB`);
  // Consider file compression or chunking
}
```

**Problem**: IPFS upload times out or is very slow  
**Solution**:

```bash
# Check IPFS daemon status
ipfs swarm peers | wc -l  # Should show connected peers

# Restart IPFS with more aggressive settings
ipfs shutdown
ipfs daemon --enable-gc --routing=dhtclient
```

**Problem**: Build process consumes too much memory  
**Solution**:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"  # 8GB
npm run build

# Alternative: Use Docker for builds
npm run docker:build
```

**Problem**: PostgreSQL connection errors due to disk space  
**Solution**:

```bash
# Check PostgreSQL logs
docker logs orbisdb-pgvector

# Clean old PostgreSQL data (⚠️ Will lose data)
docker volume rm web3db-connector_postgres_data

# Or increase disk space and restart
docker restart orbisdb-pgvector
```

### Platform-Specific Issues

#### Windows Troubleshooting

- **Path Issues**: Ensure Node.js, Ceramic CLI, and other tools are in your system PATH.
- **Permission Errors**: Run PowerShell or Command Prompt as Administrator.
- **WSL Integration**: For optimal performance, run Ceramic within WSL2:
  ```bash
  wsl
  cd /path/to/your/project
  ceramic daemon --network inmemory
  ```
- **Docker Connection**: Verify that Docker Desktop is active with WSL2 integration enabled.

#### MacOS Troubleshooting

- **Homebrew Issues**: Update Homebrew before installing Ceramic:
  ```bash
  brew update
  brew upgrade
  ```
- **Permission Issues**: Check folder permissions:
  ```bash
  chmod -R 755 ./server
  ```

---

## License & Contact

This project is licensed under the MIT License.

**Repository**:  
[https://github.com/jhead12/web3db-fileconnector](https://github.com/jhead12/web3db-fileconnector)

**Bugs**:  
[https://github.com/jhead12/web3db-fileconnector/issues](https://github.com/jhead12/web3db-fileconnector/issues)

## ⚠️ CRITICAL: Database Permissions Setup

**🔒 SECURITY NOTICE: Proper database permissions are ESSENTIAL for web3.db-fileconnector to function correctly and securely.**

### Why Permissions Matter

1. **Data Integrity**: Without proper permissions, the application cannot create, read, update, or delete data
2. **Security**: Incorrect permissions can expose your database to unauthorized access
3. **Functionality**: Many features will fail silently or throw cryptic errors without proper permissions
4. **Ceramic Integration**: The Ceramic network requires specific database permissions to store and sync data

### Required PostgreSQL Permissions

Before running web3.db-fileconnector, you **MUST** configure PostgreSQL permissions:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Connect to the ceramic database
\c ceramic

-- Grant essential permissions to admin user
GRANT USAGE ON SCHEMA public TO admin;
GRANT CREATE ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Apply to future tables (CRITICAL)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin;

-- Set database ownership (recommended)
ALTER DATABASE ceramic OWNER TO admin;
```

### Quick Permission Setup

We provide automated scripts for permission setup:

```bash
# Option 1: Use the SQL script
psql -U postgres -d ceramic -f fix-postgres-permissions.sql

# Option 2: Manual setup (see PostgreSQL-Permissions.md)
cat PostgreSQL-Permissions.md
```

### Permission-Related Errors

If you see these errors, check your database permissions:

- `permission denied for schema public`
- `must be owner of relation [table_name]`
- `permission denied for database ceramic`
- `role "admin" does not exist`
- Ceramic network sync failures
- Silent data corruption or missing records

### 🚨 Common Permission Mistakes

1. **Forgetting future table permissions**: Use `ALTER DEFAULT PRIVILEGES`
2. **Wrong database context**: Ensure you're connected to the 'ceramic' database
3. **Case sensitivity**: PostgreSQL role names are case-sensitive
4. **Missing extensions**: Ensure vector extensions have proper permissions

**📚 For detailed permission setup, see:** [`PostgreSQL-Permissions.md`](PostgreSQL-Permissions.md)
