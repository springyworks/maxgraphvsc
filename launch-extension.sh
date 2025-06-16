#!/bin/bash

# Launch VS Code Extension Development Host
echo "🚀 Launching MaxGraphVSC Extension Development Host..."

cd /home/rustuser/typscr/extensionVS/maxgraphvsc

# Ensure watch processes are running
if ! pgrep -f "esbuild.js --watch" > /dev/null; then
    echo "📦 Starting esbuild watch..."
    npm run watch:esbuild &
fi

if ! pgrep -f "tsc.*--watch" > /dev/null; then
    echo "🔍 Starting TypeScript watch..."
    npm run watch:tsc &
fi

# Wait a moment for watchers to start
sleep 2

# Launch extension development host
echo "🎯 Opening VS Code Extension Development Host..."
code --extensionDevelopmentPath=. --new-window

echo "✅ Extension Development Host launched!"
echo ""
echo "📋 Next steps in the new VS Code window:"
echo "1. Press Ctrl+Shift+P to open Command Palette"
echo "2. Type '🧠 Open Neural Network Visualization'"
echo "3. The neural network panel should auto-open"
echo "4. Click '🔮 Create Sample Network' to test neurons"
echo ""
echo "🔧 Debug info:"
echo "- Watch processes should be running in background"
echo "- Check Developer Tools (Help > Toggle Developer Tools) for errors"
echo "- Extension logs appear in Debug Console"
