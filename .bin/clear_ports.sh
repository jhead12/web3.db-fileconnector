#!/bin/bash

PORT=$1  # Port number passed as the first argument

if [ -z "$PORT" ]; then
    echo "No port number provided."
    exit 1
fi

# Find the process ID using lsof
PID=$(lsof -i :$PORT -t)

if [ -z "$PID" ]; then
  echo "No process found running on port $PORT."
else
  echo "Killing process $PID running on port $PORT..."
  kill $PID
  if [ $? -eq 0 ]; then
    echo "Process $PID has been successfully terminated."
  else
    echo "Failed to terminate process $PID."
  fi
fi

# Generate different ports based on the provided information
if [ "$PORT" = "12345" ]; then
    PORTS=(12346 12347 12348)
elif [ "$PORT" = "67890" ]; then
    PORTS=(67891 67892 67893)
else
    echo "Invalid port number provided."
    exit 1
fi

for PORT in "${PORTS[@]}"; do
    ./clear_ports.sh $PORT
done