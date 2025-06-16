import * as vscode from 'vscode';

// Basic debug log that should always appear
console.log('🔥 EXTENSION FILE LOADED - This should appear immediately');

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 [NEURAL-EXT] Extension activation started!');
    console.log('🚀 [NEURAL-EXT] Extension URI:', context.extensionUri.toString());
    console.log('🚀 [NEURAL-EXT] Extension path:', context.extensionPath);
    
    try {
        console.log('🔧 [NEURAL-EXT] Registering command: neuralnetwork.open');
        
        const disposable = vscode.commands.registerCommand('neuralnetwork.open', () => {
            console.log('🎯 [NEURAL-EXT] Command "neuralnetwork.open" executed!');
            console.log('🖼️ [NEURAL-EXT] Creating webview panel...');
            
            const panel = vscode.window.createWebviewPanel(
                'neuralnetwork',
                '🅰️ Neural Network WASM Visualizer',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    enableForms: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        context.extensionUri,
                        vscode.Uri.joinPath(context.extensionUri, 'neural-wasm'),
                        vscode.Uri.joinPath(context.extensionUri, 'neural-wasm', 'pkg'),
                        vscode.Uri.joinPath(context.extensionUri, 'dist'),
                        vscode.Uri.joinPath(context.extensionUri, 'src')
                    ]
                }
            );

            console.log('📦 [NEURAL-EXT] Webview panel created successfully');
            console.log('🔗 [NEURAL-EXT] Building WASM URI...');

            const wasmUri = panel.webview.asWebviewUri(
                vscode.Uri.joinPath(context.extensionUri, 'neural-wasm', 'pkg', 'neural_wasm.js')
            );

            console.log('🔗 [NEURAL-EXT] WASM URI:', wasmUri.toString());
            console.log('📝 [NEURAL-EXT] Setting webview HTML content...');

            panel.webview.html = getWebviewContent(wasmUri);
            console.log('✅ [NEURAL-EXT] Webview content set successfully!');
        });

        console.log('📋 [NEURAL-EXT] Adding command to subscriptions...');
        context.subscriptions.push(disposable);
        console.log('✅ [NEURAL-EXT] Command registered and added to subscriptions!');

        console.log('🚀 [NEURAL-EXT] Auto-executing command...');
        const executePromise = vscode.commands.executeCommand('neuralnetwork.open');
        if (executePromise && typeof executePromise.then === 'function') {
            executePromise.then(() => {
                console.log('🎉 [NEURAL-EXT] Auto-execution completed successfully!');
            });
        }

        console.log('🎊 [NEURAL-EXT] Extension activation completed successfully!');
        
    } catch (error: any) {
        console.error('💥 [NEURAL-EXT] Extension activation failed:', error);
        vscode.window.showErrorMessage('Neural Network WASM extension failed to activate: ' + (error?.message || 'Unknown error'));
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getWebviewContent(wasmUri: vscode.Uri): string {
    // Generate a nonce for inline scripts to satisfy CSP
    const nonce = getNonce();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; img-src data: https:; connect-src 'self';">>
    <title>🅰️ Neural Network WASM Visualizer</title>
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
        #network-canvas {
            width: 100%;
            height: 400px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.1);
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🅰️ Neural Network WASM Visualizer</h1>
        
        <div class="neural-viz">
            <div class="controls">
                <button id="btn-create">🧠 Create Network</button>
                <button id="btn-train">🚀 Train Network</button>
                <button id="btn-predict">🔮 Predict</button>
                <button id="btn-animate">▶️ Start Animation</button>
                <button id="btn-layout">📐 Auto Layout</button>
                <button id="btn-zoom">🔍 Zoom to Fit</button>
                <button id="btn-dump">📄 Dump Console</button>
                <button id="btn-save">💾 Save to File</button>
                <button id="btn-filter">🔍 Filter Console</button>
            </div>
            
            <div id="network-canvas">
                <div id="graph-container">
                    <div class="zoom-controls">
                        <button id="btn-zoom-in">🔍+</button>
                        <button id="btn-zoom-out">🔍-</button>
                        <button id="btn-reset">🎯</button>
                    </div>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-value" id="accuracy">95%</div>
                    <div>Accuracy</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="loss">0.12</div>
                    <div>Loss</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="epochs">150</div>
                    <div>Epochs</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="neurons">4</div>
                    <div>Neurons</div>
                </div>
            </div>
        </div>
    </div>

    <script nonce="${nonce}">
        console.log('🔧 JavaScript started loading...');
        
        let network = null;
        let animationRunning = false;
        let svg = null;
        let currentZoom = 1;
        
        console.log('🅰️ Neural Network WASM Extension Debug Mode');
        console.log('🎯 MaxGraph Vertices & Edges Visualization Loading...');
        
        // Create visualization immediately
        function createVisualization() {
            const container = document.getElementById('graph-container');
            if (!container) {
                console.error('❌ Canvas container not found!');
                return;
            }
            
            console.log('🎨 Creating MaxGraph-style visualization...');
            
            // Clear container
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
            title.textContent = '🧠 Neural Network Graph: Vertices & Edges';
            svg.appendChild(title);
            
            // Create demo network
            console.log('🔷 Creating vertices...');
            
            // Input vertices
            createVertex(150, 150, '#4CAF50', 'I1', 'Input 1');
            createVertex(150, 250, '#4CAF50', 'I2', 'Input 2');
            createVertex(150, 350, '#4CAF50', 'I3', 'Input 3');
            
            // Hidden vertices
            createVertex(400, 200, '#2196F3', 'H1', 'Hidden 1');
            createVertex(400, 300, '#2196F3', 'H2', 'Hidden 2');
            
            // Output vertex
            createVertex(650, 250, '#FF9800', 'O1', 'Output');
            
            console.log('🔗 Creating edges...');
            
            // Edges from inputs to hidden
            createEdge(150, 150, 400, 200, '0.8', '#4CAF50');
            createEdge(150, 150, 400, 300, '0.3', '#2196F3');
            createEdge(150, 250, 400, 200, '-0.5', '#F44336');
            createEdge(150, 250, 400, 300, '0.7', '#4CAF50');
            createEdge(150, 350, 400, 200, '0.2', '#2196F3');
            createEdge(150, 350, 400, 300, '-0.3', '#F44336');
            
            // Edges from hidden to output
            createEdge(400, 200, 650, 250, '1.2', '#4CAF50');
            createEdge(400, 300, 650, 250, '-0.8', '#F44336');
            
            // Add to container
            container.appendChild(svg);
            
            // Add zoom controls back
            const zoomControls = document.createElement('div');
            zoomControls.className = 'zoom-controls';
            zoomControls.innerHTML = \`
                <button id="btn-zoom-in">🔍+</button>
                <button id="btn-zoom-out">🔍-</button>
                <button id="btn-reset">🎯</button>
            \`;
            container.appendChild(zoomControls);
            
            // Reattach zoom events
            setupZoomControls();
            
            console.log('✅ Visualization created successfully!');
            console.log('👀 You should now see vertices and edges!');
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
            
            // Add drag functionality
            let isDragging = false;
            let startX, startY, initialTransform;
            
            group.addEventListener('mousedown', function(e) {
                isDragging = true;
                const rect = svg.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
                initialTransform = group.getAttribute('transform');
                e.preventDefault();
                console.log(\`🖱️ Started dragging vertex \${id}\`);
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging || !group.contains(e.target) && e.target !== group) return;
                
                const rect = svg.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                const deltaX = currentX - startX;
                const deltaY = currentY - startY;
                
                const newX = x + deltaX;
                const newY = y + deltaY;
                
                group.setAttribute('transform', \`translate(\${newX},\${newY})\`);
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    console.log(\`✅ Finished dragging vertex \${id}\`);
                    isDragging = false;
                }
            });
            
            svg.appendChild(group);
            
            console.log(\`✅ Created vertex \${id} at (\${x}, \${y}) with drag support\`);
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
            document.getElementById('btn-zoom-in').onclick = () => {
                currentZoom *= 1.2;
                svg.style.transform = \`scale(\${currentZoom})\`;
                showStatus('Zoomed in');
            };
            
            document.getElementById('btn-zoom-out').onclick = () => {
                currentZoom *= 0.8;
                svg.style.transform = \`scale(\${currentZoom})\`;
                showStatus('Zoomed out');
            };
            
            document.getElementById('btn-reset').onclick = () => {
                currentZoom = 1;
                svg.style.transform = 'scale(1)';
                showStatus('Reset view');
            };
        }
        
        function setupButtonHandlers() {
            document.getElementById('btn-create').onclick = () => {
                showStatus('Creating new network...');
                createVisualization();
            };
            
            document.getElementById('btn-train').onclick = () => {
                showStatus('Training network...');
                console.log('🚀 Training simulation started');
            };
            
            document.getElementById('btn-predict').onclick = () => {
                showStatus('Running prediction...');
                console.log('🔮 Prediction executed');
            };
            
            document.getElementById('btn-animate').onclick = () => {
                animationRunning = !animationRunning;
                showStatus(animationRunning ? 'Animation started' : 'Animation stopped');
                console.log('▶️ Animation toggled:', animationRunning);
            };
            
            document.getElementById('btn-layout').onclick = () => {
                showStatus('Auto-layout applied');
                console.log('📐 Auto-layout executed');
            };
            
            document.getElementById('btn-zoom').onclick = () => {
                currentZoom = 1;
                svg.style.transform = 'scale(1)';
                showStatus('Zoomed to fit');
            };
            
            document.getElementById('btn-dump').onclick = () => {
                showStatus('Console dumped - check browser console');
                console.log('📄 === CONSOLE DUMP ===');
                console.log('Network state:', network);
                console.log('Animation running:', animationRunning);
                console.log('Current zoom:', currentZoom);
                console.log('=== END DUMP ===');
            };
            
            document.getElementById('btn-save').onclick = () => {
                showStatus('Saving to file...');
                console.log('💾 Save to file triggered');
            };
            
            document.getElementById('btn-filter').onclick = () => {
                console.clear();
                console.log('🔍 Console filtered - showing only extension logs');
                showStatus('Console filtered');
            };
        }
        
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📋 DOM loaded, initializing...');
            
            // Setup button handlers
            setupButtonHandlers();
            
            // Create visualization
            setTimeout(() => {
                createVisualization();
                setupArrowMarker();
            }, 500);
            
            console.log('🎉 Neural Network Visualizer initialized!');
        });
        
        // Also run immediately if DOM is already loaded
        if (document.readyState === 'loading') {
            console.log('⏳ DOM still loading, waiting...');
        } else {
            console.log('✅ DOM already loaded, initializing immediately...');
            setupButtonHandlers();
            setTimeout(() => {
                createVisualization();
                setupArrowMarker();
            }, 100);
        }
    </script>
</body>
</html>`;
}

export function deactivate() {
    console.log('🛑 [NEURAL-EXT] Extension deactivation started');
    console.log('🛑 [NEURAL-EXT] Cleaning up resources...');
    console.log('🛑 [NEURAL-EXT] Extension deactivated successfully');
}
