#!/bin/bash
echo "🚀 Deploying to GitHub Pages..."

# Build WASM if source exists
if [ -f "../neural-wasm/Cargo.toml" ]; then
    echo "🦀 Building Rust WASM..."
    cd ../neural-wasm
    wasm-pack build --target web --out-dir pkg
    cd ../docs
    cp -r ../neural-wasm/pkg .
    echo "✅ WASM built and copied"
fi

echo "📤 Ready for GitHub Pages deployment!"
echo "   1. Commit these files to your repository"
echo "   2. Go to Settings > Pages in GitHub"
echo "   3. Select 'Deploy from a branch'"
echo "   4. Choose 'main' branch and '/docs' folder"
echo "   5. Your site will be live at: https://[username].github.io/[repository]"
