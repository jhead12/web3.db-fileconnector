#!/bin/bash

source ./.bin/port_utils.sh

PORT=$1  # Port number passed as the first argument
FALLBACK_PORT=$2  # Fallback port if the first one is in use

if [ -z "$PORT" ]; then
    echo "No port number provided."
    exit 1
fi

# First try to clear the port
PID=$(lsof -i :$PORT -t)

if [ ! -z "$PID" ]; then
    echo "Port $PORT is in use by process $PID"
    if [ ! -z "$FALLBACK_PORT" ]; then
        NEW_PORT=$(get_next_port $FALLBACK_PORT)
        if [ $? -eq 0 ]; then
            echo "Using alternative port: $NEW_PORT"
            echo $NEW_PORT
            exit 0
        fi
    fi
    echo "Attempting to kill process $PID..."
    kill $PID
    if [ $? -eq 0 ]; then
        echo "Process $PID has been successfully terminated."
        echo $PORT
    else
        echo "Failed to terminate process $PID."
        if [ -z "$FALLBACK_PORT" ]; then
            NEW_PORT=$(get_next_port $((PORT + 1)))
            if [ $? -eq 0 ]; then
                echo "Using next available port: $NEW_PORT"
                echo $NEW_PORT
                exit 0
            fi
        fi
        exit 1
    fi
else
    echo "Port $PORT is available"
    echo $PORT
fi
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