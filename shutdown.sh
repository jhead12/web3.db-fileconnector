#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}Shutting down Web3DB-FileConnector stack${NC}"
echo -e "${BLUE}=========================================${NC}"

# Shutdown server
if [ -f server.pid ]; then
    PID=$(cat server.pid)
    echo -e "${YELLOW}Shutting down main API server (PID: $PID)...${NC}"
    kill -15 $PID 2>/dev/null || echo -e "${RED}Failed to stop server${NC}"
    rm server.pid
    echo -e "${GREEN}Main API server stopped.${NC}"
fi

# Shutdown Next.js app
if [ -f server/ceramic-app/ceramic-app-app/nextjs.pid ]; then
    PID=$(cat server/ceramic-app/ceramic-app-app/nextjs.pid)
    echo -e "${YELLOW}Shutting down Next.js API app (PID: $PID)...${NC}"
    kill -15 $PID 2>/dev/null || echo -e "${RED}Failed to stop Next.js app${NC}"
    rm server/ceramic-app/ceramic-app-app/nextjs.pid
    echo -e "${GREEN}Next.js API app stopped.${NC}"
fi

# Shutdown Ceramic
if [ -f ceramic.pid ]; then
    PID=$(cat ceramic.pid)
    echo -e "${YELLOW}Shutting down Ceramic daemon (PID: $PID)...${NC}"
    kill -15 $PID 2>/dev/null || echo -e "${RED}Failed to stop Ceramic${NC}"
    rm ceramic.pid
    echo -e "${GREEN}Ceramic daemon stopped.${NC}"
fi

# Shutdown IPFS
if [ -f ipfs.pid ]; then
    PID=$(cat ipfs.pid)
    echo -e "${YELLOW}Shutting down IPFS daemon (PID: $PID)...${NC}"
    kill -15 $PID 2>/dev/null || echo -e "${RED}Failed to stop IPFS${NC}"
    rm ipfs.pid
    echo -e "${GREEN}IPFS daemon stopped.${NC}"
fi

echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}All services have been shut down${NC}"
echo -e "${BLUE}=========================================${NC}"
