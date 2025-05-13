skip to:contentpackage searchsign in
❤
Pro
Teams
Pricing
Documentation
npm
Search packages
Search
web3.db-fileconnector
1.4.0 • Public • Published 2 days ago
/web3.db-fileconnector/README.md
/
web3.db-fileconnector
/
README.md


Back
456 LOC
12.9 kB
# web3.db-fileconnector

OrbisDB connects you to the GraphQL system that manages your Web3 data using the Ceramic network.

## Table of Contents

- [Available Scripts](#available-scripts)
  - [Script Descriptions](#script-descriptions)
- [Development Workflow](#development-workflow)
  - [Local Development](#local-development)
  - [Building and Deployment](#building-and-deployment)
  - [Maintenance Tasks](#maintenance-tasks)
- [Getting Started](#getting-started)
  - [Setting Up Ceramic DB](#setting-up-ceramic-db)
  - [Configuration Process](#configuration-process)
  - [Database Connection](#database-connection)
  - [Configuration Files](#configuration-files)
  - [Dependency Installation](#dependency-installation)
- [Docker-Based Development](#docker-based-development)
  - [Using Docker Scripts](#using-docker-scripts)
  - [Windows Docker Commands](#windows-docker-commands)
- [Prerequisites](#prerequisites)
  - [Windows-Specific Requirements](#windows-specific-requirements)
- [Build and Run Instructions](#build-and-run-instructions)
- [Ceramic Installation](#ceramic-installation)
  - [MacOS](#macos)
  - [Windows](#windows)
- [Exposed Ports](#exposed-ports)
- [Starting the Server](#starting-the-server)
  - [Expected Output](#expected-output)
  - [Connecting to Ceramic](#connecting-to-ceramic)
- [Connecting to the Ceramic Network](#connecting-to-the-ceramic-network)
  - [Troubleshooting Windows Installation](#troubleshooting-windows-installation)

## Available Scripts

```json
{
  "build": "cd client && next build",
  "start": "cross-env NODE_ENV=production node index.js",
  "dev": "node index.js",
  "clean": "rm -rf client/.next",
  "clear-port": ".bin/clear_ports.sh",
  "publish:npm": "npm publish --access public",
  "publish:docker": "docker buildx build --platform linux/arm64,linux/amd64 -t orbisdb-fileconnector:latest . && docker push orbisdb-fileconnector:latest",
  "lint": "eslint .",
  "clean:all": "rm -rf client/.next client/node_modules",
  "publish": "npm run build && npm run docker:restart",
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev:docker": "npm run docker:start && node index.js",
  "dev:debug": "cross-env LOG_LEVEL=debug node index.js",
  "dev:watch": "nodemon --ignore '*.json' index.js",
  "format": "prettier . --write",
  "docker:start": "docker start orbisdb-pgvector || docker run -d --name orbisdb-pgvector -e POSTGRES_PASSWORD=postgres -p 5432:5431 pgvector/pgvector:0.7.4-pg16",
  "docker:stop": "docker stop orbisdb-pgvector",
  "docker:restart": "npm run docker:stop && npm run docker:start || npm run docker:start",
  "docker:remove": "docker rm orbisdb-pgvector || docker stop orbisdb-pgvector && docker rm orbisdb-pgvector",
  "docker:status": "docker ps"
}
```

### Script Descriptions

- **`build`**: Builds the Next.js client application
- **`start`**: Runs the application in production mode
- **`dev`**: Starts the development server
- **`clean`**: Removes the Next.js build cache
- **`clear-port`**: Executes a script to free up ports used by the application
- **`publish:npm`**: Publishes the package to npm with public access
- **`publish:docker`**: Builds and publishes a multi-architecture Docker image
- **`lint`**: Runs ESLint to check code quality
- **`clean:all`**: Removes both the Next.js build cache and node_modules
- **`publish`**: Builds the application and restarts the Docker container
- **`test`**: Placeholder for running tests (currently not implemented)
- **`dev:docker`**: Starts the Docker container and runs the development server
- **`dev:debug`**: Runs the development server with debug logging enabled
- **`dev:watch`**: Runs the development server with file watching (auto-restart)
- **`format`**: Formats code using Prettier
- **`docker:start`**: Starts the pgvector Docker container or creates it if it doesn't exist
- **`docker:stop`**: Stops the pgvector Docker container
- **`docker:restart`**: Restarts the pgvector Docker container
- **`docker:remove`**: Removes the pgvector Docker container
- **`docker:status`**: Shows the status of Docker containers

## Getting Started

### Setting Up Ceramic DB

```bash
cd server
./wheel
```

This command executes the `wheel` script which is a utility for setting up and managing a Ceramic-based application.

### Configuration Process

When running the setup script, you'll be prompted to confirm several configuration settings:

1. **Project Name**: Confirm or change the default project name (default: "ceramic-app")
2. **Project Directory**: Confirm if the directory exists or create it
3. **Network**: Choose whether to use the `InMemory` network for testing
4. **Ceramic Integration**: Confirm if Ceramic should be included in the setup
5. **ComposeDB Integration**: Confirm if ComposeDB should be included
6. **Sample Application**: Choose whether to include a ComposeDB sample application
7. **DID Secret Key Path**: Provide a path to save the DID secret key
8. **Configuration Review**: Final confirmation of all settings

### Database Connection

The script verifies the connection to the SQLite database:

```bash
Verifying database connection using connection string sqlite:///path/to/project/ceramic-app/ceramic-indexing/ceramic.db
```

### Configuration Files

Configuration files are saved to your project directory:

```bash
Saving config to /path/to/project/ceramic-app/ceramic.json
Saving daemon file to /path/to/project/ceramic-app/daemon_config.json
```

### Dependency Installation

The script installs required dependencies:

```bash
+ Installing dependencies for @ceramicnetwork/cli
```

After installation, you can run Ceramic with:

```bash
./ceramic daemon --config /path/to/project/ceramic-app/daemon_config.json
```

Run this from the project directory (e.g., `/path/to/project/ceramic-app`).

### Setting Up Ceramic DB

```bash
cd server
./wheel
```

This command executes the `wheel` script which is a utility for setting up and managing a Ceramic-based application.

### Configuration Process

When running the setup script, you'll be prompted to confirm several configuration settings:

1. **Project Name**: Confirm or change the default project name (default: "ceramic-app")
2. **Project Directory**: Confirm if the directory exists or create it
3. **Network**: Choose whether to use the `InMemory` network for testing
4. **Ceramic Integration**: Confirm if Ceramic should be included in the setup
5. **ComposeDB Integration**: Confirm if ComposeDB should be included
6. **Sample Application**: Choose whether to include a ComposeDB sample application
7. **DID Secret Key Path**: Provide a path to save the DID secret key
8. **Configuration Review**: Final confirmation of all settings

### Database Connection

The script verifies the connection to the SQLite database:

```bash
Verifying database connection using connection string sqlite:///path/to/project/ceramic-app/ceramic-indexing/ceramic.db
```

### Configuration Files

Configuration files are saved to your project directory:

```bash
Saving config to /path/to/project/ceramic-app/ceramic.json
Saving daemon file to /path/to/project/ceramic-app/daemon_config.json
```

### Dependency Installation

The script installs required dependencies:

```bash
+ Installing dependencies for @ceramicnetwork/cli
```

After installation, you can run Ceramic with:

```bash
./ceramic daemon --config /path/to/project/ceramic-app/daemon_config.json
```

Run this from the project directory (e.g., `/path/to/project/ceramic-app`).

## Development Workflow

The OrbisDB project uses Next.js for the client application and supports various development workflows.

### Local Development

1. **Standard development**:

   ```bash
   npm run dev
   ```

   This starts the server in development mode.

2. **Development with auto-restart**:

   ```bash
   npm run dev:watch
   ```

   This uses nodemon to watch for file changes and restart the server automatically.

3. **Debug mode**:
   ```bash
   npm run dev:debug
   ```
   This enables detailed logging for troubleshooting.

### Building and Deployment

1. **Build the client application**:

   ```bash
   npm run build
   ```

2. **Start in production mode**:

   ```bash
   npm run start
   ```

3. **Publish to npm**:

   ```bash
   npm run publish:npm
   ```

4. **Build and publish Docker image**:
   ```bash
   npm run publish:docker
   ```
   This builds a multi-architecture Docker image (arm64 and amd64) and pushes it to your Docker repository.

### Maintenance Tasks

1. **Clean Next.js build cache**:

   ```bash
   npm run clean
   ```

2. **Clean all build artifacts and dependencies**:

   ```bash
   npm run clean:all
   ```

3. **Format code**:

   ```bash
   npm run format
   ```

4. **Lint code**:

   ```bash
   npm run lint
   ```

5. **Clear ports**:
   ```bash
   npm run clear-port
   ```
   This runs a script to free up ports that might be in use.

## Environment Variables

Set the following in a `.env` file or export in your shell:

- `POSTGRES_USER`: Database username (default: `user`)
- `POSTGRES_PASSWORD`: Database password (default: `password`)

## Prerequisites

Ensure you have installed:

- Docker version 20.10 or later
- Docker Compose version 1.29 or later
- Node.js version 18.0.0 or later

### Windows-Specific Requirements

- Windows 10/11 with WSL2 (Windows Subsystem for Linux) enabled
- Docker Desktop for Windows with WSL2 backend
- Git Bash or PowerShell for running commands

## Build and Run Instructions

1. Clone the repository and navigate to the project directory:

   **Linux/MacOS**:

   ```bash
   git clone https://github.com/your-repo/project.git
   cd project
   ```

   **Windows (PowerShell)**:

   ```powershell
   git clone https://github.com/your-repo/project.git
   cd project
   ```

   **Windows (Command Prompt)**:

   ```cmd
   git clone https://github.com/your-repo/project.git
   cd project
   ```

## Ceramic Installation

### MacOS

```bash
brew install ceramicnetwork/tap/ceramic-one
ceramic-one daemon --network in-memory
```

### Windows

1. **Install Node.js and npm**:
   Download and install from [Node.js official website](https://nodejs.org/) (version 18.0.0 or later)

2. **Install Ceramic CLI**:

   ```bash
   npm install -g @ceramicnetwork/cli
   ```

3. **Generate a DID (Decentralized Identifier)**:

   ```bash
   ceramic did:generate
   ```

4. **Start the Ceramic daemon**:

   ```bash
   ceramic daemon --network inmemory
   ```

   For persistent storage, configure a state store:

   ```bash
   ceramic daemon --network mainnet --state-store=<path-to-state-store>
   ```

## Exposed Ports

- Application: `7008`
- Database: Not externally exposed

## Starting the Server

Navigate to the project directory and run:

```bash
cd docker/core/
docker-compose up -d
```

This starts the services in detached mode.

### Expected Output

```bash
[INFO] Starting ceramic-one daemon...
[INFO] Ceramic Node started: /path/to/project/ceramic/node-12700
[INFO] Listening for incoming connections on port 3001...
```

### Connecting to Ceramic

Access the Ceramic container shell:

```bash
cd docker/core/
docker-compose exec -it ceramic-one /bin/bash
```

## Connecting to the Ceramic Network

1. **Install `ceramic-cli`**:
   Follow the [installation instructions](https://github.com/ceramicnetwork/cli)

2. **Generate a Ceramic ID**:

   **Linux/MacOS**:

   ```bash
   ceramic id
   ```

   **Windows**:

   ```powershell
   ceramic id
   ```

3. **Initialize OrbisDB**:

   **Linux/MacOS**:

   ```bash
   pnpm run init --ceramic-id <ceramic-id>
   ```

   **Windows**:

   ```powershell
   pnpm run init --ceramic-id <ceramic-id>
   ```

   If you don't have pnpm installed, you can install it first:

   ```powershell
   npm install -g pnpm
   ```

4. **Start the Application**:
   Follow the server startup instructions above

### Troubleshooting Windows Installation

1. **Path Issues**: If you encounter "command not found" errors, ensure the installation directory is in your PATH environment variable.

2. **Permission Errors**: Run PowerShell or Command Prompt as Administrator if you encounter permission issues.

3. **WSL Integration**: For optimal performance on Windows, consider running Ceramic within WSL2:

   ```bash
   wsl
   cd /path/to/project
   ceramic daemon --network inmemory
   ```

4. **Docker Connection Issues**: Ensure Docker Desktop is running with WSL2 integration enabled in settings.
Package Sidebar
Install
npm i web3.db-fileconnector@1.4.0

Repository
github.com/jhead12/web3db-fileconnector/orbisdb.git

Homepage
github.com/jhead12/web3db-fileconnector/orbisdb#readme

Version
1.4.0

License
MIT

Unpacked Size
21.3 MB

Total Files
224

Last publish
2 hours ago

Collaborators
jhead12
Try on RunKit
Report malware
Footer
Support
Help
Advisories
Status
Contact npm
Company
About
Blog
Press
Terms & Policies
Policies
Terms of Use
Code of Conduct
Privacy



## Running the Project with Docker

This project provides Dockerfiles for both the client (Next.js app) and server components, along with a `docker-compose.yml` for easy orchestration.

### Project-Specific Requirements
- **Node.js Versions:**
  - Client: Uses `node:20-alpine`
  - Server: Uses `node:22.13.1-slim` (set via `ARG NODE_VERSION=22.13.1`)
- **Dependencies:**
  - Both services install dependencies via `npm ci` or `npm install` as defined in their respective Dockerfiles.

### Environment Variables
- The Docker Compose file includes commented `env_file` lines for both services. If you have environment variables, place them in `.env` files in the respective `./client` and `./server` directories and uncomment the relevant lines in `docker-compose.yml`.
- Example environment files are present: `./.env`, `./.env.sample`, and `./client/config.env`.

### Build and Run Instructions
1. **(Optional) Configure Environment Variables:**
   - Copy `.env.sample` to `.env` and adjust as needed for your environment.
   - If you have service-specific environment variables, place them in `./client/.env` and/or `./server/.env`.
2. **Build and Start the Services:**
   ```sh
   docker compose up --build
   ```
   This will build and start both the client and server containers.

### Ports Exposed
- **Client (`js-client`):**
  - Exposes port **3000** (Next.js default)
  - Accessible at [http://localhost:3000](http://localhost:3000)
- **Server (`js-server`):**
  - Exposes port **7008**
  - Accessible at [http://localhost:7008](http://localhost:7008)

### Special Configuration
- Both containers run as non-root users for improved security.
- The client build uses a multi-stage Dockerfile for optimized image size.
- The server build prunes dev dependencies after build for a leaner production image.
- Both services are connected via a custom Docker network `appnet`.
- The client service depends on the server service and will wait for it to be available.

---

*For more details on contributing or advanced configuration, see the rest of this README and the `Contribute.md` file.*
