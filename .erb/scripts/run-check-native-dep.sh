#!/bin/bash

# Ensure ts-node is installed
npm install ts-node -g

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  npm install ts-node-esm --legacy-peer-deps -g
  # Run the check-native-dep.mjs script with the required loader
  ts-node-esm ./.erb/scripts/check-native-dep.mjs
fi

# Check the exit status of the previous command and exit if it failed
if [ $? -ne 0 ]; then
  echo "Failed to run check-native-dep script"
  exit 1
fi

# Run other postinstall commands
electron-builder install-app-deps
cross-env NODE_ENV=development TS_NODE_TRANSPILE_ONLY=true webpack --config ./.erb/configs/webpack.config.renderer.dev.dll.ts
