#!/bin/bash

echo "Installing IPFS..."
if ! command -v ipfs &> /dev/null; then
    wget https://dist.ipfs.tech/kubo/v0.26.0/kubo_v0.26.0_linux-amd64.tar.gz
    tar -xvzf kubo_v0.26.0_linux-amd64.tar.gz
    cd kubo
    sudo bash install.sh
    cd ..
    rm -rf kubo kubo_v0.26.0_linux-amd64.tar.gz
fi

echo "Initializing IPFS..."
ipfs init || true
