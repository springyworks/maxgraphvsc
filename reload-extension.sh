#!/bin/bash

# Reload Extension Script
echo "🔄 Reloading VS Code Extension..."

# Build the extension first
echo "🔨 Building extension..."
node esbuild.js

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Extension built to: $(pwd)/dist/extension.js"
    echo "📊 Built file size: $(ls -lh dist/extension.js | awk '{print $5}')"
    
    echo ""
    echo "🔄 Next steps:"
    echo "1. In VS Code, press Ctrl+Shift+P"
    echo "2. Run: 'Developer: Reload Window' to reload the extension host"
    echo "3. Or restart VS Code completely"
    echo "4. Check Developer Console: Help > Toggle Developer Tools > Console"
    echo "5. Look for: '🔥 EXTENSION FILE LOADED' message"
    echo ""
    echo "📋 Extension details:"
    echo "   Name: a-neural-network-wasm"
    echo "   Command: 'neuralnetwork.open'"
    echo "   Main: ./dist/extension.js"
    
else
    echo "❌ Build failed!"
    exit 1
fi
