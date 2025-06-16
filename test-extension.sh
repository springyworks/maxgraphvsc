#!/bin/bash
echo "🔍 Testing Neural Network Extension..."
echo "📂 Checking files..."

if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
fi

if [ -f "dist/extension.js" ]; then
    echo "✅ dist/extension.js exists"
else
    echo "❌ dist/extension.js missing"
fi

echo ""
echo "📋 Package.json main field:"
grep -A1 "main" package.json

echo ""
echo "📋 Extension name and displayName:"
grep -A1 "name\|displayName" package.json

echo ""
echo "🔧 Rebuilding extension..."
npm run compile

echo ""
echo "✅ Test complete. Now try launching with F5"
