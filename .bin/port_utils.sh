#!/bin/bash

find_available_port() {
    local start_port=$1
    local max_attempts=100
    local port=$start_port

    for (( i=0; i<max_attempts; i++ )); do
        if ! lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return 0
        fi
        ((port++))
    done
    
    echo "No available ports found between $start_port and $((start_port + max_attempts - 1))" >&2
    return 1
}

get_next_port() {
    local base_port=$1
    local new_port=$(find_available_port $base_port)
    if [ $? -eq 0 ]; then
        echo $new_port
    else
        return 1
    fi
}
