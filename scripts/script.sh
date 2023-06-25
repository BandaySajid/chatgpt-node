#!/bin/bash

url="https://github.com/lwthiker/curl-impersonate/releases/download/v0.5.4/curl-impersonate-v0.5.4.x86_64-linux-gnu.tar.gz"
dir=${0%/*}
outputFile="$dir/../curl-impersonate.tar.gz"
extractedFolder="$dir/../bypass/linux"


# Create the output folder if it doesn't exist
mkdir -p "$extractedFolder"

# Download the tar.gz file using curl
curl -L -o "$outputFile" "$url"

# Check if the download was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to download the tar.gz file."
  exit 1
fi

# Extract the contents of the tar.gz file to the desired folder
tar -xzf "$outputFile" -C "$extractedFolder"

# Check if the extraction was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to extract the tar.gz file."
  exit 1
fi

# Remove the archive file
rm "$outputFile"

echo "Tar.gz file downloaded and extracted successfully."
exit 0
