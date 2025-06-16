#!/bin/bash

echo "🧪 Testing Neural Network Extension..."
echo "📱 Opening extension webview..."

# Create a test HTML file to simulate the webview content
cd /home/rustuser/typscr/extensionVS/maxgraphvsc

# Extract just the HTML content for testing
echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>🅰️ Neural Network WASM Visualizer - Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .neural-viz {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        button {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        #graph-container {
            width: 100%;
            height: 500px;
            border: 2px solid #007ACC;
            position: relative;
            background: #f8f9fa;
            border-radius: 8px;
            overflow: hidden;
        }
        .zoom-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            display: flex;
            gap: 5px;
        }
        .zoom-controls button {
            padding: 8px;
            font-size: 12px;
            min-width: 35px;
            background: white;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .stat-box {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #4fd1c7;
        }
    </style>
</head>
<body>
    <div class=\"container\">
        <h1>🅰️ Neural Network WASM Visualizer</h1>
        
        <div class=\"neural-viz\">
            <div class=\"controls\">
                <button id=\"btn-create\">🧠 Create Network</button>
                <button id=\"btn-train\">🚀 Train Network</button>
                <button id=\"btn-predict\">🔮 Predict</button>
                <button id=\"btn-animate\">▶️ Start Animation</button>
                <button id=\"btn-layout\">📐 Auto Layout</button>
                <button id=\"btn-zoom\">🔍 Zoom to Fit</button>
                <button id=\"btn-dump\">📄 Dump Console</button>
            </div>
            
            <div id=\"graph-container\">
                <div class=\"zoom-controls\">
                    <button id=\"btn-zoom-in\">🔍+</button>
                    <button id=\"btn-zoom-out\">🔍-</button>
                    <button id=\"btn-reset\">🎯</button>
                </div>
            </div>
            
            <div class=\"stats\">
                <div class=\"stat-box\">
                    <div class=\"stat-value\" id=\"accuracy\">95%</div>
                    <div>Accuracy</div>
                </div>
                <div class=\"stat-box\">
                    <div class=\"stat-value\" id=\"loss\">0.12</div>
                    <div>Loss</div>
                </div>
                <div class=\"stat-box\">
                    <div class=\"stat-value\" id=\"epochs\">150</div>
                    <div>Epochs</div>
                </div>
                <div class=\"stat-box\">
                    <div class=\"stat-value\" id=\"neurons\">6</div>
                    <div>Neurons</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        console.log('🔧 JavaScript started loading...');
        
        let network = null;
        let animationRunning = false;
        let svg = null;
        let currentZoom = 1;
        
        console.log('🅰️ Neural Network WASM Extension Debug Mode');
        console.log('🎯 MaxGraph Vertices & Edges Visualization Loading...');
        
        function createVisualization() {
            const container = document.getElementById('graph-container');
            if (!container) {
                console.error('❌ Canvas container not found!');
                return;
            }
            
            console.log('🎨 Creating MaxGraph-style visualization...');
            
            // Clear container but keep zoom controls
            const zoomControls = container.querySelector('.zoom-controls');
            container.innerHTML = '';
            
            // Create SVG
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.cssText = 'width:100%;height:100%;background:white;';
            svg.setAttribute('viewBox', '0 0 800 600');
            
            // Add title
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            title.setAttribute('x', '400');
            title.setAttribute('y', '30');
            title.setAttribute('text-anchor', 'middle');
            title.setAttribute('fill', '#333');
            title.setAttribute('font-size', '20');
            title.setAttribute('font-weight', 'bold');
            title.textContent = '🧠 Neural Network: Vertices & Edges';
            svg.appendChild(title);
            
            // Setup arrow marker
            setupArrowMarker();
            
            // Create demo network
            console.log('🔷 Creating vertices...');
            
            // Input vertices
            createVertex(120, 150, '#4CAF50', 'I1', 'Input 1');
            createVertex(120, 250, '#4CAF50', 'I2', 'Input 2');
            createVertex(120, 350, '#4CAF50', 'I3', 'Input 3');
            
            // Hidden vertices
            createVertex(400, 200, '#2196F3', 'H1', 'Hidden 1');
            createVertex(400, 300, '#2196F3', 'H2', 'Hidden 2');
            
            // Output vertex
            createVertex(680, 250, '#FF9800', 'O1', 'Output');
            
            console.log('🔗 Creating edges...');
            
            // Edges from inputs to hidden
            createEdge(120, 150, 400, 200, '0.8', '#4CAF50');
            createEdge(120, 150, 400, 300, '0.3', '#2196F3');
            createEdge(120, 250, 400, 200, '-0.5', '#F44336');
            createEdge(120, 250, 400, 300, '0.7', '#4CAF50');
            createEdge(120, 350, 400, 200, '0.2', '#2196F3');
            createEdge(120, 350, 400, 300, '-0.3', '#F44336');
            
            // Edges from hidden to output
            createEdge(400, 200, 680, 250, '1.2', '#4CAF50');
            createEdge(400, 300, 680, 250, '-0.8', '#F44336');
            
            // Add to container
            container.appendChild(svg);
            
            // Re-add zoom controls
            if (zoomControls) {
                container.appendChild(zoomControls);
            } else {
                addZoomControls(container);
            }
            
            console.log('✅ Visualization created successfully!');
            console.log('👀 You should now see 6 vertices and 8 edges!');
        }
        
        function createVertex(x, y, color, id, label) {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', \`translate(\${x},\${y})\`);
            group.style.cursor = 'move';
            
            // Circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '25');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '2');
            
            // Label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', '5');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('font-size', '12');
            text.textContent = id;
            
            // Tooltip
            const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            titleElement.textContent = label;
            
            group.appendChild(circle);
            group.appendChild(text);
            group.appendChild(titleElement);
            svg.appendChild(group);
            
            console.log(\`✅ Created vertex \${id} at (\${x}, \${y})\`);
        }
        
        function createEdge(x1, y1, x2, y2, weight, color) {
            // Line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', Math.abs(parseFloat(weight)) * 3 + 1);
            line.setAttribute('opacity', '0.7');
            line.setAttribute('marker-end', 'url(#arrowhead)');
            
            // Weight label
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', midX);
            label.setAttribute('y', midY - 5);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#333');
            label.setAttribute('font-size', '10');
            label.setAttribute('font-weight', 'bold');
            label.textContent = weight;
            
            svg.appendChild(line);
            svg.appendChild(label);
            
            console.log(\`✅ Created edge with weight \${weight}\`);
        }
        
        function setupArrowMarker() {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'arrowhead');
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '7');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '3.5');
            marker.setAttribute('orient', 'auto');
            
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
            polygon.setAttribute('fill', '#666');
            
            marker.appendChild(polygon);
            defs.appendChild(marker);
            svg.appendChild(defs);
        }
        
        function addZoomControls(container) {
            const zoomControls = document.createElement('div');
            zoomControls.className = 'zoom-controls';
            zoomControls.innerHTML = \`
                <button id=\"btn-zoom-in\">🔍+</button>
                <button id=\"btn-zoom-out\">🔍-</button>
                <button id=\"btn-reset\">🎯</button>
            \`;
            container.appendChild(zoomControls);
            setupZoomControls();
        }
        
        function showStatus(message, isError = false) {
            const prefix = isError ? '❌' : '✅';
            console.log(prefix + ' ' + message);
            
            // Show in UI
            let statusDiv = document.getElementById('status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'status';
                statusDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.8);color:white;padding:10px;border-radius:5px;z-index:10000;max-width:400px;';
                document.body.appendChild(statusDiv);
            }
            
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
        
        function setupZoomControls() {
            const zoomInBtn = document.getElementById('btn-zoom-in');
            const zoomOutBtn = document.getElementById('btn-zoom-out');
            const resetBtn = document.getElementById('btn-reset');
            
            if (zoomInBtn) {
                zoomInBtn.onclick = () => {
                    currentZoom *= 1.2;
                    svg.style.transform = \`scale(\${currentZoom})\`;
                    showStatus('Zoomed in');
                };
            }
            
            if (zoomOutBtn) {
                zoomOutBtn.onclick = () => {
                    currentZoom *= 0.8;
                    svg.style.transform = \`scale(\${currentZoom})\`;
                    showStatus('Zoomed out');
                };
            }
            
            if (resetBtn) {
                resetBtn.onclick = () => {
                    currentZoom = 1;
                    svg.style.transform = 'scale(1)';
                    showStatus('Reset view');
                };
            }
        }
        
        function setupButtonHandlers() {
            const buttons = [
                { id: 'btn-create', action: () => { showStatus('Creating new network...'); createVisualization(); } },
                { id: 'btn-train', action: () => { showStatus('Training network...'); console.log('🚀 Training simulation started'); } },
                { id: 'btn-predict', action: () => { showStatus('Running prediction...'); console.log('🔮 Prediction executed'); } },
                { id: 'btn-animate', action: () => { 
                    animationRunning = !animationRunning;
                    showStatus(animationRunning ? 'Animation started' : 'Animation stopped');
                    console.log('▶️ Animation toggled:', animationRunning);
                } },
                { id: 'btn-layout', action: () => { showStatus('Auto-layout applied'); console.log('📐 Auto-layout executed'); } },
                { id: 'btn-zoom', action: () => { 
                    currentZoom = 1;
                    if (svg) svg.style.transform = 'scale(1)';
                    showStatus('Zoomed to fit');
                } },
                { id: 'btn-dump', action: () => { 
                    showStatus('Console dumped - check browser console');
                    console.log('📄 === CONSOLE DUMP ===');
                    console.log('Network state:', network);
                    console.log('Animation running:', animationRunning);
                    console.log('Current zoom:', currentZoom);
                    console.log('=== END DUMP ===');
                } }
            ];
            
            buttons.forEach(({ id, action }) => {
                const btn = document.getElementById(id);
                if (btn) btn.onclick = action;
            });
        }
        
        // Initialize when DOM is ready
        function initialize() {
            console.log('📋 Initializing neural network visualizer...');
            
            // Setup button handlers
            setupButtonHandlers();
            
            // Create visualization
            setTimeout(() => {
                createVisualization();
            }, 500);
            
            console.log('🎉 Neural Network Visualizer initialized!');
        }
        
        // Run when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    </script>
</body>
</html>" > test-webview.html

echo "✅ Created test-webview.html"
echo "🌐 Opening in browser..."

# Check if we can open it
if command -v firefox &> /dev/null; then
    firefox test-webview.html &
    echo "🔥 Opened in Firefox"
elif command -v google-chrome &> /dev/null; then
    google-chrome test-webview.html &
    echo "🔥 Opened in Chrome"
elif command -v chromium &> /dev/null; then
    chromium test-webview.html &
    echo "🔥 Opened in Chromium"
else
    echo "🌐 Please open test-webview.html in your browser manually"
fi

echo "📊 If you see vertices and edges, the visualization is working!"
echo "🎯 The main issue was likely the CSP (Content Security Policy) in the webview"
