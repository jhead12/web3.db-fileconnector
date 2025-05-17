# web3.db-fileconnector

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-1.6.0-blue)

OrbisDB connects you to the GraphQL system that manages your Web3 data using the Ceramic network. It's a decentralized, open-source database built on top of web3 technologies, offering secure, efficient storage and query capabilities for your data.

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
npm run create-env
# Edit the .env file with your values

# 3. Install dependencies
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

### Option 2: Docker Setup (Recommended for Production)

```bash
# 1. Clone the repository
git clone https://github.com/jhead12/web3db-fileconnector/orbisdb.git
cd web3db-fileconnector

# 2. Create and configure environment variables
npm run create-env
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

### Core Scripts

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the development server                 |
| `npm run build`      | Build the Next.js client application         |
| `npm run start`      | Run the application in production mode       |
| `npm run dev:docker` | Start with Docker and run development server |
| `npm run dev:watch`  | Start with auto-restart on file changes      |
| `npm run dev:debug`  | Start with debug logging enabled             |

### Setup & Maintenance

| Script                  | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `npm run create-env`    | Create a `.env` file from template                   |
| `npm run ceramic:build` | Set up and manage Ceramic DB (runs the wheel script) |
| `npm run system:check`  | Verify server dependencies and configuration         |
| `npm run clean`         | Remove build cache and dependencies                  |
| `npm run clean:all`     | Remove all build artifacts for a fresh start         |
| `npm run format`        | Format code using Prettier                           |
| `npm run lint`          | Check code quality with ESLint                       |

### Docker Management

| Script                   | Description                  |
| ------------------------ | ---------------------------- |
| `npm run docker:build`   | Build the Docker image       |
| `npm run docker:start`   | Start the Docker container   |
| `npm run docker:stop`    | Stop the Docker container    |
| `npm run docker:restart` | Restart the Docker container |
| `npm run docker:remove`  | Remove the Docker container  |
| `npm run docker:status`  | Show Docker container status |

### Publishing

| Script                   | Description                        |
| ------------------------ | ---------------------------------- |
| `npm run publish:npm`    | Publish to npm with public access  |
| `npm run publish:docker` | Build and push Docker image        |
| `npm run publish:github` | Publish to npm and Docker          |
| `npm run publish`        | Build and restart Docker container |

---

## Development Workflow

### Local Development

Choose the development mode that best suits your needs:

```bash
# Standard development
npm run dev

# Auto-restart on changes
npm run dev:watch

# Debug mode with detailed logging
npm run dev:debug

# Development with Docker
npm run dev:docker
```

### Building for Production

```bash
# Build the client application
npm run build

# Start in production mode
npm run start
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint
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
npm run clear-port

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
