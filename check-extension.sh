#!/bin/bash

# Extension Status Check
echo "🔍 Extension Status Check"
echo "========================"

echo "📁 Workspace: $(pwd)"
echo "📦 Package info:"
cat package.json | grep -E '"name"|"displayName"|"main"|"activationEvents"' | head -4

echo ""
echo "🔨 Build status:"
if [ -f "dist/extension.js" ]; then
    echo "✅ dist/extension.js exists"
    echo "📊 Size: $(ls -lh dist/extension.js | awk '{print $5}')"
    echo "🕒 Modified: $(stat -c %y dist/extension.js)"
    
    # Check if our debug code is in the built file
    if grep -q "EXTENSION FILE LOADED" dist/extension.js; then
        echo "✅ Debug code found in built file"
    else
        echo "❌ Debug code NOT found in built file"
    fi
else
    echo "❌ dist/extension.js missing"
fi

echo ""
echo "🎯 To test the extension:"
echo "1. Restart VS Code or run 'Developer: Reload Window'"
echo "2. Open Developer Tools (Help > Toggle Developer Tools)"
echo "3. Check Console for '🔥 EXTENSION FILE LOADED'"
echo "4. Run Command Palette (Ctrl+Shift+P) and search for '🅰️ Neural'"
echo "5. If command appears, the extension is registered correctly"
