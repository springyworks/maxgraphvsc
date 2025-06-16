#!/bin/bash
set -e

echo "🦀 Building Neural Network WASM module..."
cd neural-wasm
wasm-pack build --target web --out-dir pkg --dev
cd ..

echo "📦 Compiling TypeScript extension..."
npm run compile

echo "🚀 Extension ready to run!"
echo "Press F5 to launch the extension in VS Code"
