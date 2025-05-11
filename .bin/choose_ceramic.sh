#!/bin/bash

echo "Choose which Ceramic app to use:"
echo "1. Ceramic App 1"
echo "2. Ceramic App 2"

read -p "Enter your choice (1-2): " choice

case $choice in
    1)
        echo "Ceramic App 1 selected."
        # Add the code to connect to Ceramic App 1 here
        ;;
    2)
        echo "Ceramic App 2 selected."
        # Add the code to connect to Ceramic App 2 here
        ;;
    *)
        echo "Invalid choice. Please try again."
        choose_ceramic_app.sh
        ;;
esac