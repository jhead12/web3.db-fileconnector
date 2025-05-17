#!/bin/bash

# Configuration
LOG_FILE="/var/log/system_check.log"  # Adjust as needed
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Logging function
log_message() {
  echo "$TIMESTAMP - $1" >> "$LOG_FILE"
  echo "$TIMESTAMP - $1"  # Also print to console
}

# Function to check IPFS server status
ipfs_check() {
  log_message "Checking IPFS status..."
  if ipfs ping | grep -q "connected"; then
    log_message "IPFS server is running."
    return 0  # Success
  else
    log_message "IPFS server is NOT running. Please start the IPFS daemon."
    return 1  # Failure
  fi
}

# Function to check Ceramic health
ceramic_check() {
  log_message "Checking Ceramic health..."
  if ceramic status | grep -q "healthy"; then
    log_message "Ceramic service is healthy."
    return 0
  else
    log_message "Ceramic service is UNHEALTHY. Please verify Ceramic configuration and connectivity."
    return 1
  fi
}

# Function to check Lotus presence
lotus_check() {
  log_message "Checking Lotus presence..."
  if lotus version > /dev/null 2>&1; then
    log_message "Lotus client is present."
    return 0
  else
    log_message "Lotus client is NOT present. Please install the Lotus client."
    return 1
  fi
}

# Perform checks and store results
ipfs_check
IPFS_STATUS=$?

ceramic_check
CERAMIC_STATUS=$?

lotus_check
LOTUS_STATUS=$?

# Update terminal message and log
if [ "$IPFS_STATUS" -eq 0 ] && [ "$CERAMIC_STATUS" -eq 0 ] && [ "$LOTUS_STATUS" -eq 0 ]; then
  log_message "All checks passed."
  echo "All checks passed."
else
  log_message "One or more checks failed. Please check the status of your IPFS, Ceramic, and Lotus services."
  echo "One or more checks failed. Please check the status of your IPFS, Ceramic, and Lotus services."
fi