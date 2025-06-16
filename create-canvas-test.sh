#!/bin/bash

# Simple Canvas Test
echo "🎯 Creating simple canvas test..."

cat > test-canvas.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Canvas Test</title>
</head>
<body style="margin:0;padding:20px;">
    <h1>🧠 Canvas Test</h1>
    <div id="test-canvas" style="width:800px;height:400px;border:2px solid blue;background:white;position:relative;">
        <div style="padding:20px;">Loading...</div>
    </div>
    
    <script>
        console.log('🔧 Test script started');
        
        function createTest() {
            const container = document.getElementById('test-canvas');
            console.log('📍 Container found:', container);
            
            // Create SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.background = 'lightgray';
            
            // Add test circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '100');
            circle.setAttribute('cy', '100');
            circle.setAttribute('r', '30');
            circle.setAttribute('fill', 'red');
            
            svg.appendChild(circle);
            container.innerHTML = '';
            container.appendChild(svg);
            
            console.log('✅ Test visualization created!');
        }
        
        setTimeout(createTest, 500);
    </script>
</body>
</html>
EOF

echo "✅ Created test-canvas.html"
echo "🌐 Open this file in a browser to test if SVG works"
echo "📁 File location: $(pwd)/test-canvas.html"
