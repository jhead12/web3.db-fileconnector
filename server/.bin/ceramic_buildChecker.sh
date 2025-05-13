#!/bin/bash

# Check if IPFS system is running
ipfs_running=$(pgrep ipfs)
if [ -z "$ipfs_running" ]; then
  echo "IPFS system is not running"
  exit 1
fi

# Create ceramic category folder if it doesn't exist
ceramic_folder="server/ceramic_apps"
mkdir -p "$ceramic_folder"

# Get list of ceramic files in serve file
ceramic_files=$(find server/ -name "*.ceramic")

# Display list of ceramic apps and allow user to select one
echo "Select a ceramic app to load:"
select ceramic_app in $ceramic_files; do
  if [ -z "$ceramic_app" ]; then
    echo "Invalid selection"
  else
    echo "Loading $ceramic_app..."
    # Start ceramic daemon command for selected ceramic app
    ceramic_daemon_command="ceramic daemon --data-dir=$ceramic_folder/$ceramic_app"
    $ceramic_daemon_command &
    echo "$ceramic_app is running in the background."
  fi
done