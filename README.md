# web3.db-fileconnector

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-1.8.0-blue)
![npm](https://img.shields.io/npm/v/web3.db-fileconnector)
![Security](https://img.shields.io/badge/Security-Audited-green)

Web3.db-fileconnector connects you to the GraphQL system that manages your Web3 data using the Ceramic network. It's a decentralized, open-source database built on top of web3 technologies with Helia IPFS integration, offering secure, efficient storage and query capabilities for your data.

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

// Initialize IPFS with Helia (new in v1.8.0)
const ipfs = await initIPFS();
const cid = await ipfs.add("Hello from your app!");
console.log('Content stored with CID:', cid);

// Use GraphQL API
import { OrbisDB } from 'web3.db-fileconnector/server/orbisdb';
const orbis = new OrbisDB({
  ceramic: 'http://localhost:7007',
  node: 'http://localhost:7008'
});

// Use in React components
import { Button } from 'web3.db-fileconnector/client/components/Button';

function MyApp() {
  return (
    <GlobalContext.Provider>
      <div>
        <Button>My Web3 App</Button>
        {/* Your app content */}
      </div>
    </GlobalContext.Provider>
  );
}
```

### NPM Package Features

- **🔐 Secure IPFS Integration**: Helia-powered decentralized storage (migrated from ipfs-http-client)
- **📊 GraphQL API**: Ready-to-use data management system with Ceramic Network
- **🎨 UI Components**: Pre-built React components for Web3 apps
- **🔧 Utilities**: Helper functions for DID authentication, data syncing
- **📱 Responsive**: Mobile-friendly components and layouts
- **⚡ Production Ready**: Optimized for enterprise applications with security auditing
- **🛡️ Security Focused**: v1.8.0 removes eval() usage and updates vulnerable dependencies
- **🔄 Modern Dependencies**: Uses latest Helia, multiformats, and blockstore technologies

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
- **npm**: v8.6.0 or later
- **Docker**: v20.10 or later (optional, for containerized setup)

### Option 1: Quick Local Setup (Recommended for First-Time Users)

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector/orbisdb.git
cd web3db-fileconnector

# 2. Create and configure environment variables
yarn create-env
# Edit the .env file with your values

# 3. Install dependencies
yarn install

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

### Option 2: Docker Setup (Recommended for Production)

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector/orbisdb.git
cd web3db-fileconnector

# 2. Create and configure environment variables
yarn create-env
# Edit the .env file with your values

# 3. Build and start all services
docker-compose up -d

# 4. Check that all services are running
docker-compose ps
```

Your containerized application is now running:

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:7008](http://localhost:7008)
- Ceramic: [http://localhost:3001](http://localhost:3001)
- PostgreSQL: localhost:5432

---

## Table of Contents

- [Available Scripts](#available-scripts)
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

> **🛡️ Security Note**: Version 1.8.0 includes major security improvements including removal of eval() usage and migration from deprecated ipfs-http-client to secure Helia implementation.

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
[https://github.com/jhead12/web3db-fileconnector/orbisdb](https://github.com/jhead12/web3db-fileconnector/orbisdb)

**Bugs**:  
[https://github.com/jhead12/web3db-fileconnector/orbisdb/issues](https://github.com/jhead12/web3db-fileconnector/orbisdb/issues)

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
