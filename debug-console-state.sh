#!/bin/bash

# Console State Capture Script
echo "🔍 VS Code Extension Console State Capture"
echo "========================================"
echo "Date: $(date)"
echo ""

echo "📁 Extension Directory:"
echo "$(pwd)"
echo ""

echo "📦 Package Info:"
echo "Extension Name: $(grep '"name"' package.json | head -1)"
echo "Display Name: $(grep '"displayName"' package.json)"
echo "Main File: $(grep '"main"' package.json)"
echo ""

echo "🔨 Build Status:"
echo "Extension JS exists: $(test -f dist/extension.js && echo 'YES' || echo 'NO')"
echo "Extension JS size: $(test -f dist/extension.js && ls -lh dist/extension.js | awk '{print $5}' || echo 'N/A')"
echo "Last modified: $(test -f dist/extension.js && stat -c %y dist/extension.js || echo 'N/A')"
echo ""

echo "🧠 WASM Status:"
echo "WASM file exists: $(test -f neural-wasm/pkg/neural_wasm.js && echo 'YES' || echo 'NO')"
echo "WASM size: $(test -f neural-wasm/pkg/neural_wasm.js && ls -lh neural-wasm/pkg/neural_wasm.js | awk '{print $5}' || echo 'N/A')"
echo ""

echo "🎯 Next Steps:"
echo "1. Open VS Code"
echo "2. Press Ctrl+Shift+P"
echo "3. Search: '🅰️ Neural Network WASM'"
echo "4. Open Developer Tools (F12)"
echo "5. Check Console tab for JavaScript logs"
echo ""

echo "🔍 Expected Console Messages:"
echo "- '🔧 JavaScript started loading...'"
echo "- '🔍 Canvas container found:'"
echo "- '🎉 Visualization created successfully!'"
echo ""

echo "If you see JavaScript errors, copy them to the dump file!"
