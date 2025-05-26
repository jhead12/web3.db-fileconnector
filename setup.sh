#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Web3DB-FileConnector 5-Minute Setup${NC}"
echo -e "${BLUE}=========================================${NC}"

# Current directory
CURRENT_DIR=$(pwd)

# Check if yarn is installed
echo -e "\n${YELLOW}Checking for yarn...${NC}"
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}yarn could not be found! Installing yarn...${NC}"
    npm install -g yarn
fi

# Install dependencies
echo -e "\n${YELLOW}Installing project dependencies...${NC}"
yarn install

# Install IPFS if not already installed
echo -e "\n${YELLOW}Checking for IPFS...${NC}"
if ! command -v ipfs &> /dev/null; then
    echo -e "${RED}IPFS could not be found! Installing IPFS...${NC}"
    
    # First try using NPX (which is often easier in containerized environments)
    echo "Installing IPFS via NPX (will use for this session)..."
    yarn global add ipfs
    
    # Add yarn global bin to PATH if not already there
    YARN_BIN=$(yarn global bin)
    if [[ ":$PATH:" != *":$YARN_BIN:"* ]]; then
        echo -e "${YELLOW}Adding yarn global bin to PATH...${NC}"
        export PATH="$PATH:$YARN_BIN"
        echo 'export PATH="$PATH:'$YARN_BIN'"' >> ~/.bashrc
    fi
    
    # Still check if it's available after installing via npm/yarn
    if ! command -v ipfs &> /dev/null; then
        # Detect OS and install natively if NPX approach didn't work
        OS=$(uname)
        if [[ "$OS" == "Darwin" ]]; then
            # macOS
            echo "Installing IPFS for macOS via brew..."
            brew install ipfs
        elif [[ "$OS" == "Linux" ]]; then
            # Linux
            echo "Installing IPFS for Linux..."
            wget https://dist.ipfs.tech/kubo/v0.22.0/kubo_v0.22.0_linux-amd64.tar.gz
            tar -xzf kubo_v0.22.0_linux-amd64.tar.gz
            cd kubo
            sudo bash install.sh
            cd "$CURRENT_DIR"
            rm -rf kubo_v0.22.0_linux-amd64.tar.gz kubo
        else
            echo -e "${RED}Unsupported OS for automatic installation. Please install IPFS manually:${NC}"
            echo -e "${BLUE}https://docs.ipfs.tech/install/command-line/${NC}"
            exit 1
        fi
    fi
fi

# Check for Ceramic
echo -e "\n${YELLOW}Checking for Ceramic...${NC}"
if ! command -v ceramic-one &> /dev/null; then
    echo -e "${RED}Ceramic could not be found! Installing Ceramic...${NC}"
    yarn global add @ceramicnetwork/cli
    yarn global add ceramic-one
    
    # Add yarn global bin to PATH if not already there
    YARN_BIN=$(yarn global bin)
    if [[ ":$PATH:" != *":$YARN_BIN:"* ]]; then
        echo -e "${YELLOW}Adding yarn global bin to PATH...${NC}"
        export PATH="$PATH:$YARN_BIN"
        echo 'export PATH="$PATH:'$YARN_BIN'"' >> ~/.bashrc
    fi
fi

# Create environment variables
echo -e "\n${YELLOW}Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    node ./scripts/create-env.js
    echo -e "${GREEN}Created .env file. Please edit it with your custom values if needed.${NC}"
else
    echo -e "${GREEN}.env file already exists.${NC}"
fi

# Try starting IPFS in a separate process
echo -e "\n${YELLOW}Starting IPFS daemon...${NC}"
if command -v ipfs &> /dev/null; then
    ipfs daemon &
    IPFS_PID=$!
else
    # Fallback to npx if the command isn't directly available
    echo "Using npx to run IPFS..."
    npx ipfs daemon &
    IPFS_PID=$!
fi

echo -e "${GREEN}IPFS daemon started with PID: $IPFS_PID${NC}"
echo $IPFS_PID > ipfs.pid
sleep 5

# Try starting Ceramic in a separate process
echo -e "\n${YELLOW}Starting Ceramic daemon...${NC}"
if command -v ceramic-one &> /dev/null; then
    ceramic-one daemon --network inmemory &
    CERAMIC_PID=$!
else
    # Fallback to npx if the command isn't directly available
    echo "Using npx to run Ceramic..."
    npx ceramic-one daemon --network inmemory &
    CERAMIC_PID=$!
fi

echo -e "${GREEN}Ceramic daemon started with PID: $CERAMIC_PID${NC}"
echo $CERAMIC_PID > ceramic.pid
sleep 5

# Setup and start the sample API app
echo -e "\n${YELLOW}Setting up the sample API app...${NC}"
cd server/ceramic-app/ceramic-app-app
yarn install
yarn generate
echo -e "${GREEN}Admin credentials and configuration generated.${NC}"
yarn composites
echo -e "${GREEN}ComposeDB models deployed.${NC}"

# Start the sample Next.js API app in a separate process
echo -e "\n${YELLOW}Starting the sample Next.js API app...${NC}"
yarn nextDev &
NEXTJS_PID=$!
echo -e "${GREEN}Next.js API app started with PID: $NEXTJS_PID${NC}"
echo $NEXTJS_PID > nextjs.pid
sleep 5

# Return to project root and start the main API server
echo -e "\n${YELLOW}Starting the main API server...${NC}"
cd "$CURRENT_DIR"
yarn dev &
SERVER_PID=$!
echo -e "${GREEN}Main API server started with PID: $SERVER_PID${NC}"
echo $SERVER_PID > server.pid

echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}Your complete stack is now running:${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "IPFS node: http://localhost:5001/webui"
echo -e "Ceramic node: http://localhost:7007"
echo -e "Sample API app: http://localhost:3000"
echo -e "Main API server: http://localhost:7008"
echo -e "GraphQL playground: http://localhost:7008/graphql"
echo -e "${BLUE}=========================================${NC}"
echo -e "${YELLOW}Note: To shut down all processes, run: ./shutdown.sh${NC}"
echo -e "${BLUE}=========================================${NC}"
