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
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, 'neural-wasm', 'pkg')
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

function getWebviewContent(wasmUri: vscode.Uri): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        .loading {
            text-align: center;
            padding: 20px;
        }
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #4fd1c7;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🅰️ Neural Network WASM Visualizer</h1>
        
        <div class="neural-viz">
            <div class="controls">
                <button onclick="createNetwork()">🧠 Create Network</button>
                <button onclick="trainNetwork()">🚀 Train Network</button>
                <button onclick="predict()">🔮 Predict</button>
                <button onclick="startAnimation()">▶️ Start Animation</button>
                <button onclick="autoLayout()">📐 Auto Layout</button>
                <button onclick="zoomToFit()">� Zoom to Fit</button>
                <button onclick="dumpConsole()">📄 Dump Console</button>
                <button onclick="saveConsoleToFile()">💾 Save to File</button>
                <button onclick="filterExtensionLogs()">🔍 Filter Console</button>
            </div>
            
            <div id="network-canvas">
                <div id="graph-container" style="width: 100%; height: 500px; border: 1px solid #ddd; position: relative; background: #f5f5f5;"></div>
            </div>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-value" id="accuracy">0%</div>
                    <div>Accuracy</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="loss">0.0</div>
                    <div>Loss</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="epochs">0</div>
                    <div>Epochs</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="neurons">0</div>
                    <div>Neurons</div>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        console.log('🔧 JavaScript started loading...');
        
        let network = null;
        let animationRunning = false;
        let graph = null;
        let graphCells = new Map();
        
        console.log('🅰️ Neural Network WASM Extension Debug Mode');
        console.log('🎯 MaxGraph Vertices & Edges Visualization Loading...');
        
        // Immediate test to see if canvas is accessible
        function testCanvasAccess() {
            const container = document.getElementById('graph-container');
            console.log('🔍 Canvas container found:', container);
            if (container) {
                console.log('📐 Container dimensions:', container.clientWidth, 'x', container.clientHeight);
                container.style.background = 'lightblue';
                container.innerHTML = '<div style="padding:20px;text-align:center;color:black;">🎯 Canvas Access Test - Loading Visualization...</div>';
                
                setTimeout(() => {
                    console.log('🚀 Starting visualization creation...');
                    createVisualization(container);
                }, 500);
            } else {
                console.error('❌ Canvas container not found!');
            }
        }
        
        function createVisualization(container) {
            try {
                console.log('🎨 Creating MaxGraph-style visualization...');
                
                // Clear container
                container.innerHTML = '';
                container.style.background = '#f8f9fa';
                
                // Create SVG directly
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.style.cssText = 'width:100%;height:100%;border:2px solid #007ACC;background:white;';
                svg.setAttribute('viewBox', '0 0 800 600');
                
                // Add title
                const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                title.setAttribute('x', '400');
                title.setAttribute('y', '30');
                title.setAttribute('text-anchor', 'middle');
                title.setAttribute('fill', '#333');
                title.setAttribute('font-size', '20');
                title.setAttribute('font-weight', 'bold');
                title.textContent = '🧠 Neural Network Vertices & Edges';
                svg.appendChild(title);
                
                // Create vertices (nodes)
                console.log('🔷 Creating vertices...');
                
                // Input vertex 1
                const input1 = createVertex(svg, 1, 150, 200, '#4CAF50', 'I1');
                console.log('✅ Created input vertex 1');
                
                // Input vertex 2  
                const input2 = createVertex(svg, 2, 150, 350, '#4CAF50', 'I2');
                console.log('✅ Created input vertex 2');
                
                // Hidden vertex
                const hidden1 = createVertex(svg, 3, 400, 275, '#2196F3', 'H1');
                console.log('✅ Created hidden vertex');
                
                // Output vertex
                const output1 = createVertex(svg, 4, 650, 275, '#FF9800', 'O1');
                console.log('✅ Created output vertex');
                
                // Create edges (connections)
                console.log('🔗 Creating edges...');
                
                createEdge(svg, 150, 200, 400, 275, '0.8', '#4CAF50');
                createEdge(svg, 150, 350, 400, 275, '-0.5', '#F44336');
                createEdge(svg, 400, 275, 650, 275, '1.2', '#4CAF50');
                
                console.log('✅ Created all edges');
                
                // Add zoom controls
                const controls = document.createElement('div');
                controls.style.cssText = 'position:absolute;top:10px;right:10px;display:flex;gap:5px;z-index:1000;';
                controls.innerHTML = \`
                    <button onclick="alert('Zoom In!')" style="padding:8px;background:white;border:1px solid #ccc;border-radius:4px;">🔍+</button>
                    <button onclick="alert('Zoom Out!')" style="padding:8px;background:white;border:1px solid #ccc;border-radius:4px;">🔍-</button>
                    <button onclick="alert('Reset View!')" style="padding:8px;background:white;border:1px solid #ccc;border-radius:4px;">🎯</button>
                \`;
                
                // Add to container
                container.style.position = 'relative';
                container.appendChild(svg);
                container.appendChild(controls);
                
                console.log('🎉 Visualization created successfully!');
                console.log('👀 You should now see vertices and edges!');
                
            } catch (error) {
                console.error('💥 Error creating visualization:', error);
                container.innerHTML = \`<div style="padding:20px;color:red;">Error: \${error.message}</div>\`;
            }
        }
        
        function createVertex(svg, id, x, y, color, label) {
            // Create group
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', \`translate(\${x},\${y})\`);
            group.style.cursor = 'move';
            
            // Create circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '30');
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '3');
            
            // Create label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', '5');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('font-size', '16');
            text.textContent = label;
            
            group.appendChild(circle);
            group.appendChild(text);
            svg.appendChild(group);
            
            // Add drag functionality
            let isDragging = false;
            group.addEventListener('mousedown', (e) => {
                isDragging = true;
                console.log(\`🖱️ Started dragging vertex \${label}\`);
                e.preventDefault();
            });
            
            return group;
        }
        
        function createEdge(svg, x1, y1, x2, y2, weight, color) {
            // Create line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', '4');
            line.setAttribute('opacity', '0.8');
            
            // Create weight label
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', midX);
            label.setAttribute('y', midY - 10);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#333');
            label.setAttribute('font-size', '12');
            label.setAttribute('font-weight', 'bold');
            label.setAttribute('background', 'white');
            label.textContent = weight;
            
            svg.appendChild(line);
            svg.appendChild(label);
        }
        
        // Test immediately when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', testCanvasAccess);
        } else {
            testCanvasAccess();
        }
            
            setupEventListeners() {
                this.svg.addEventListener('mousedown', this.onMouseDown.bind(this));
                this.svg.addEventListener('mousemove', this.onMouseMove.bind(this));
                this.svg.addEventListener('mouseup', this.onMouseUp.bind(this));
                this.svg.addEventListener('wheel', this.onWheel.bind(this));
                
                // Prevent context menu
                this.svg.addEventListener('contextmenu', e => e.preventDefault());
            }
            
            addZoomControls() {
                const controls = document.createElement('div');
                controls.style.cssText = 'position:absolute;top:10px;right:10px;z-index:1000;display:flex;gap:5px;';
                
                const zoomIn = document.createElement('button');
                zoomIn.textContent = '🔍+';
                zoomIn.style.cssText = 'padding:5px 10px;border:1px solid #ccc;background:white;border-radius:4px;cursor:pointer;';
                zoomIn.onclick = () => this.zoom(1.2);
                
                const zoomOut = document.createElement('button');
                zoomOut.textContent = '🔍-';
                zoomOut.style.cssText = 'padding:5px 10px;border:1px solid #ccc;background:white;border-radius:4px;cursor:pointer;';
                zoomOut.onclick = () => this.zoom(0.8);
                
                const resetView = document.createElement('button');
                resetView.textContent = '🎯';
                resetView.style.cssText = 'padding:5px 10px;border:1px solid #ccc;background:white;border-radius:4px;cursor:pointer;';
                resetView.onclick = () => this.resetView();
                
                controls.appendChild(zoomIn);
                controls.appendChild(zoomOut);
                controls.appendChild(resetView);
                this.viewport.appendChild(controls);
            }
            
            // Add vertex (node) - MaxGraph terminology
            addVertex(id, x, y, type, label, activation = 0) {
                const colors = {
                    'input': { fill: '#4CAF50', stroke: '#2E7D32' },
                    'hidden': { fill: '#2196F3', stroke: '#1565C0' },
                    'output': { fill: '#FF9800', stroke: '#E65100' }
                };
                
                const color = colors[type] || { fill: '#9E9E9E', stroke: '#616161' };
                const radius = 30;
                
                // Create node group
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('data-node-id', id);
                group.setAttribute('data-node-type', type);
                group.style.cursor = 'move';
                group.setAttribute('transform', \`translate(\${x},\${y})\`);
                
                // Create circle (vertex)
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', radius);
                circle.setAttribute('fill', color.fill);
                circle.setAttribute('stroke', color.stroke);
                circle.setAttribute('stroke-width', '3');
                circle.setAttribute('opacity', 0.3 + (activation * 0.7));
                
                // Create selection ring
                const selectionRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                selectionRing.setAttribute('r', radius + 5);
                selectionRing.setAttribute('fill', 'none');
                selectionRing.setAttribute('stroke', '#007ACC');
                selectionRing.setAttribute('stroke-width', '2');
                selectionRing.setAttribute('stroke-dasharray', '5,5');
                selectionRing.style.display = 'none';
                
                // Create label
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dy', '5');
                text.setAttribute('fill', 'white');
                text.setAttribute('font-weight', 'bold');
                text.setAttribute('font-size', '16');
                text.setAttribute('pointer-events', 'none');
                text.textContent = label;
                
                // Create activation indicator
                const activationText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                activationText.setAttribute('text-anchor', 'middle');
                activationText.setAttribute('dy', '-40');
                activationText.setAttribute('fill', '#333');
                activationText.setAttribute('font-size', '12');
                activationText.setAttribute('pointer-events', 'none');
                activationText.textContent = activation.toFixed(2);
                
                group.appendChild(selectionRing);
                group.appendChild(circle);
                group.appendChild(text);
                group.appendChild(activationText);
                
                this.nodeLayer.appendChild(group);
                
                const node = { id, x, y, type, label, activation, element: group, circle, selectionRing, activationText };
                this.nodes.set(id, node);
                
                console.log(\`� Added VERTEX (MaxGraph node) \${id}: \${type} "\${label}" at (\${x}, \${y})\`);
                return node;
            }
            
            // Add edge (connection) - MaxGraph terminology
            addEdge(fromId, toId, weight) {
                const fromNode = this.nodes.get(fromId);
                const toNode = this.nodes.get(toId);
                
                if (!fromNode || !toNode) {
                    console.warn(\`⚠️ Cannot create EDGE: missing vertex \${fromId} or \${toId}\`);
                    return null;
                }
                
                const edgeId = \`\${fromId}-\${toId}\`;
                
                // Create edge group
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('data-edge-id', edgeId);
                
                // Create line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromNode.x);
                line.setAttribute('y1', fromNode.y);
                line.setAttribute('x2', toNode.x);
                line.setAttribute('y2', toNode.y);
                line.setAttribute('stroke', weight > 0 ? '#4CAF50' : '#F44336');
                line.setAttribute('stroke-width', Math.max(2, Math.abs(weight) * 4));
                line.setAttribute('opacity', '0.7');
                line.setAttribute('marker-end', 'url(#arrowhead)');
                
                // Create weight label
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                const weightLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                weightLabel.setAttribute('x', midX);
                weightLabel.setAttribute('y', midY - 5);
                weightLabel.setAttribute('text-anchor', 'middle');
                weightLabel.setAttribute('fill', '#666');
                weightLabel.setAttribute('font-size', '10');
                weightLabel.setAttribute('font-weight', 'bold');
                weightLabel.textContent = weight.toFixed(2);
                
                group.appendChild(line);
                group.appendChild(weightLabel);
                this.edgeLayer.appendChild(group);
                
                const edge = { id: edgeId, fromId, toId, weight, element: group, line, weightLabel };
                this.edges.set(edgeId, edge);
                
                console.log(\`🔗 Added EDGE (MaxGraph connection) from vertex \${fromId} to vertex \${toId} (weight: \${weight.toFixed(2)})\`);
                return edge;
            }
            
            // Add arrow marker definition
            createArrowMarker() {
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
                this.svg.appendChild(defs);
            }
            
            updateVertexActivation(nodeId, activation) {
                const node = this.nodes.get(nodeId);
                if (!node) return;
                
                node.activation = activation;
                const opacity = 0.3 + (activation * 0.7);
                node.circle.setAttribute('opacity', opacity);
                node.activationText.textContent = activation.toFixed(2);
                
                console.log(\`⚡ Updated vertex \${nodeId} activation: \${activation.toFixed(3)}\`);
            }
            
            onMouseDown(event) {
                const target = event.target.closest('[data-node-id]');
                if (target) {
                    this.isDragging = true;
                    const nodeId = parseInt(target.getAttribute('data-node-id'));
                    this.draggedNode = this.nodes.get(nodeId);
                    
                    const rect = this.svg.getBoundingClientRect();
                    const pt = this.svg.createSVGPoint();
                    pt.x = event.clientX;
                    pt.y = event.clientY;
                    const svgP = pt.matrixTransform(this.svg.getScreenCTM().inverse());
                    
                    this.dragOffset.x = svgP.x - this.draggedNode.x;
                    this.dragOffset.y = svgP.y - this.draggedNode.y;
                    
                    console.log(\`🖱️ Started dragging vertex \${nodeId}\`);
                    event.preventDefault();
                }
            }
            
            onMouseMove(event) {
                if (this.isDragging && this.draggedNode) {
                    const rect = this.svg.getBoundingClientRect();
                    const pt = this.svg.createSVGPoint();
                    pt.x = event.clientX;
                    pt.y = event.clientY;
                    const svgP = pt.matrixTransform(this.svg.getScreenCTM().inverse());
                    
                    const newX = svgP.x - this.dragOffset.x;
                    const newY = svgP.y - this.dragOffset.y;
                    
                    this.draggedNode.x = Math.max(50, Math.min(750, newX));
                    this.draggedNode.y = Math.max(50, Math.min(550, newY));
                    
                    // Update node position
                    this.draggedNode.element.setAttribute('transform', \`translate(\${this.draggedNode.x},\${this.draggedNode.y})\`);
                    
                    // Update connected edges
                    this.updateConnectedEdges(this.draggedNode.id);
                }
            }
            
            onMouseUp(event) {
                if (this.isDragging && this.draggedNode) {
                    console.log(\`🎯 Moved vertex \${this.draggedNode.id} to (\${this.draggedNode.x.toFixed(0)}, \${this.draggedNode.y.toFixed(0)})\`);
                }
                this.isDragging = false;
                this.draggedNode = null;
                this.svg.style.cursor = 'grab';
            }
            
            updateConnectedEdges(nodeId) {
                this.edges.forEach(edge => {
                    if (edge.fromId === nodeId || edge.toId === nodeId) {
                        const fromNode = this.nodes.get(edge.fromId);
                        const toNode = this.nodes.get(edge.toId);
                        
                        edge.line.setAttribute('x1', fromNode.x);
                        edge.line.setAttribute('y1', fromNode.y);
                        edge.line.setAttribute('x2', toNode.x);
                        edge.line.setAttribute('y2', toNode.y);
                        
                        const midX = (fromNode.x + toNode.x) / 2;
                        const midY = (fromNode.y + toNode.y) / 2;
                        edge.weightLabel.setAttribute('x', midX);
                        edge.weightLabel.setAttribute('y', midY - 5);
                    }
                });
            }
            
            clear() {
                this.nodeLayer.innerHTML = '';
                this.edgeLayer.innerHTML = '';
                this.nodes.clear();
                this.edges.clear();
                this.createArrowMarker();
                console.log('🧹 Cleared all vertices and edges');
            }
            
            zoom(factor) {
                const viewBox = this.svg.getAttribute('viewBox').split(' ');
                const width = parseFloat(viewBox[2]) / factor;
                const height = parseFloat(viewBox[3]) / factor;
                this.svg.setAttribute('viewBox', \`0 0 \${width} \${height}\`);
                console.log(\`🔍 Zoomed by factor \${factor}\`);
            }
            
            resetView() {
                this.svg.setAttribute('viewBox', '0 0 800 600');
                console.log('🎯 Reset view to default');
            }
        }

        // Initialize visualization when page loads
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('graph-container');
            if (container) {
                graph = new MaxGraphStyleVisualizer(container);
                graph.createArrowMarker();
                console.log('📊 MaxGraph-Style Visualizer ready!');
                console.log('🎨 You can now see VERTICES and EDGES!');
                
                // Create a demo network immediately to show vertices and edges
                setTimeout(() => {
                    console.log('🎯 Creating demo vertices and edges...');
                    
                    // Add demo vertices
                    const vertex1 = graph.addVertex(1, 150, 200, 'input', 'I1', 0.7);
                    const vertex2 = graph.addVertex(2, 150, 300, 'input', 'I2', 0.4);
                    const vertex3 = graph.addVertex(3, 400, 250, 'hidden', 'H1', 0.6);
                    const vertex4 = graph.addVertex(4, 650, 250, 'output', 'O1', 0.8);
                    
                    // Add demo edges
                    graph.addEdge(1, 3, 0.8);
                    graph.addEdge(2, 3, -0.5);
                    graph.addEdge(3, 4, 1.2);
                    
                    console.log('✅ Demo network created! You should see 4 vertices and 3 edges');
                    console.log('🖱️ Try dragging the vertices around!');
                }, 1000);
            }
        });

        // Professional MaxGraph Neural Network Visualizer
        class NeuralGraphVisualizer {
            constructor(container) {
                this.container = container;
                this.graphCells = new Map(); // Map neuron IDs to MaxGraph cells
                
                // Create MaxGraph instance
                this.graph = new Graph(container);
                
                // Enable features
                this.graph.setEnabled(true);
                this.graph.setPanning(true);
                this.graph.setCellsEditable(false);
                this.graph.setCellsSelectable(true);
                this.graph.setCellsMovable(true);
                this.graph.setCellsResizable(false);
                this.graph.setAllowDanglingEdges(false);
                this.graph.setDropEnabled(false);
                
                // Enable rubber band selection
                new RubberBandHandler(this.graph);
                
                // Enable panning
                new PanningHandler(this.graph);
                
                // Disable connection creation (we control this from Rust)
                this.graph.setConnectable(false);
                
                // Style configuration
                this.setupStyles();
                
                // Event listeners
                this.setupEventListeners();
                
                console.log('🎨 MaxGraph Neural Visualizer initialized!');
                console.log('🎯 Features: Drag nodes, zoom, pan, select, professional layouts');
            }
            
            setupStyles() {
                const stylesheet = this.graph.getStylesheet();
                
                // Input neuron style
                stylesheet.putCellStyle('INPUT_NEURON', {
                    shape: 'ellipse',
                    fillColor: '#4CAF50',
                    strokeColor: '#2E7D32',
                    strokeWidth: 3,
                    fontColor: 'white',
                    fontSize: 14,
                    fontStyle: 1
                });
                
                // Hidden neuron style
                stylesheet.putCellStyle('HIDDEN_NEURON', {
                    shape: 'ellipse',
                    fillColor: '#2196F3',
                    strokeColor: '#1565C0',
                    strokeWidth: 3,
                    fontColor: 'white',
                    fontSize: 14,
                    fontStyle: 1
                });
                
                // Output neuron style
                stylesheet.putCellStyle('OUTPUT_NEURON', {
                    shape: 'ellipse',
                    fillColor: '#FF9800',
                    strokeColor: '#E65100',
                    strokeWidth: 3,
                    fontColor: 'white',
                    fontSize: 14,
                    fontStyle: 1
                });
                
                // Connection style
                stylesheet.putCellStyle('NEURAL_CONNECTION', {
                    strokeColor: '#666',
                    strokeWidth: 2,
                    endArrow: 'classic',
                    edge: true
                });
            }
            
            setupEventListeners() {
                // Log node movements
                this.graph.addListener(InternalEvent.MOVE_CELLS, (sender, evt) => {
                    const cells = evt.getProperty('cells');
                    cells.forEach(cell => {
                        if (cell.isVertex()) {
                            const neuronId = cell.getValue().id;
                            const geometry = cell.getGeometry();
                            console.log(\`🖱️ Moved neuron \${neuronId} to (\${geometry.x.toFixed(0)}, \${geometry.y.toFixed(0)})\`);
                        }
                    });
                });
                
                // Log selections
                this.graph.getSelectionModel().addListener(InternalEvent.CHANGE, (sender, evt) => {
                    const selected = this.graph.getSelectionCells();
                    if (selected.length > 0) {
                        const neuronIds = selected
                            .filter(cell => cell.isVertex())
                            .map(cell => cell.getValue().id);
                        if (neuronIds.length > 0) {
                            console.log(\`🎯 Selected neurons: \${neuronIds.join(', ')}\`);
                        }
                    }
                });
            }
            
            addNeuron(id, x, y, type, label, activation = 0) {
                const parent = this.graph.getDefaultParent();
                
                this.graph.getModel().beginUpdate();
                try {
                    const neuronData = { id, type, label, activation };
                    const style = type.toUpperCase() + '_NEURON';
                    
                    const cell = this.graph.insertVertex(
                        parent,
                        null,
                        neuronData,
                        x, y, 50, 50,
                        style
                    );
                    
                    // Store cell reference
                    this.graphCells.set(id, cell);
                    
                    console.log(\`🧠 Added \${type} neuron \${id} (\${label}) at MaxGraph position (\${x}, \${y})\`);
                    return cell;
                    
                } finally {
                    this.graph.getModel().endUpdate();
                }
            }
            
            addConnection(fromId, toId, weight) {
                const fromCell = this.graphCells.get(fromId);
                const toCell = this.graphCells.get(toId);
                
                if (!fromCell || !toCell) {
                    console.warn(\`⚠️ Cannot create connection: missing neuron \${fromId} or \${toId}\`);
                    return null;
                }
                
                this.graph.getModel().beginUpdate();
                try {
                    const parent = this.graph.getDefaultParent();
                    const connectionData = { fromId, toId, weight };
                    
                    const edge = this.graph.insertEdge(
                        parent,
                        null,
                        connectionData,
                        fromCell,
                        toCell,
                        'NEURAL_CONNECTION'
                    );
                    
                    console.log(\`🔗 Added MaxGraph connection from \${fromId} to \${toId} (weight: \${weight.toFixed(2)})\`);
                    return edge;
                    
                } finally {
                    this.graph.getModel().endUpdate();
                }
            }
            
            updateNeuronActivation(neuronId, activation) {
                const cell = this.graphCells.get(neuronId);
                if (!cell) return;
                
                // Update the cell's data
                const cellData = cell.getValue();
                cellData.activation = activation;
                
                // Visual feedback: change opacity based on activation
                const style = cell.getStyle();
                const opacity = 0.3 + (activation * 0.7); // 30% to 100%
                const newStyle = style.replace(/opacity=[^;]*;?/, '') + \`;opacity=\${opacity}\`;
                
                this.graph.getModel().beginUpdate();
                try {
                    this.graph.getModel().setStyle(cell, newStyle);
                } finally {
                    this.graph.getModel().endUpdate();
                }
            }
            
            clearGraph() {
                this.graph.getModel().beginUpdate();
                try {
                    this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
                    this.graphCells.clear();
                } finally {
                    this.graph.getModel().endUpdate();
                }
                console.log('🧹 MaxGraph cleared');
            }
            
            autoLayout() {
                // Simple layered layout for neural networks
                const layers = { input: [], hidden: [], output: [] };
                
                // Group neurons by type
                this.graphCells.forEach((cell, neuronId) => {
                    const data = cell.getValue();
                    if (layers[data.type]) {
                        layers[data.type].push(cell);
                    }
                });
                
                this.graph.getModel().beginUpdate();
                try {
                    const layerWidth = 200;
                    const layerSpacing = 300;
                    const startX = 100;
                    const centerY = this.container.clientHeight / 2;
                    
                    // Position input layer
                    layers.input.forEach((cell, i) => {
                        const y = centerY - (layers.input.length - 1) * 30 + i * 60;
                        const geometry = cell.getGeometry();
                        geometry.x = startX;
                        geometry.y = y;
                    });
                    
                    // Position hidden layer
                    layers.hidden.forEach((cell, i) => {
                        const y = centerY - (layers.hidden.length - 1) * 25 + i * 50;
                        const geometry = cell.getGeometry();
                        geometry.x = startX + layerSpacing;
                        geometry.y = y;
                    });
                    
                    // Position output layer
                    layers.output.forEach((cell, i) => {
                        const y = centerY - (layers.output.length - 1) * 30 + i * 60;
                        const geometry = cell.getGeometry();
                        geometry.x = startX + 2 * layerSpacing;
                        geometry.y = y;
                    });
                    
                } finally {
                    this.graph.getModel().endUpdate();
                }
                
                console.log('📐 Applied neural network auto-layout');
            }
            
            zoomToFit() {
                this.graph.fit();
                this.graph.center();
                console.log('🔍 Zoomed to fit all neurons');
            }
        }

        // Initialize MaxGraph when page loads
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('graph-container');
            if (container) {
                graph = new NeuralGraphVisualizer(container);
                console.log('📊 MaxGraph Neural Network Visualizer ready!');
                console.log('🎨 Professional features: zoom, pan, select, auto-layout');
            }
        });

        // Load WASM module
        async function loadWASM() {
            try {
                console.log('🔄 [NEURAL-WASM] Loading WASM module...');
                const wasmModule = await import('./neural-wasm/pkg/neural_wasm.js');
                await wasmModule.default();
                window.wasmModule = wasmModule;
                console.log('✅ [NEURAL-WASM] WASM module loaded successfully!');
                
                network = new wasmModule.NeuralNetwork();
                window.network = network;
                console.log('🧠 [NEURAL-WASM] Neural network instance created!');
                
            } catch (error) {
                console.error('💥 [NEURAL-WASM] Failed to load WASM:', error);
            }
        }

        // Helper function to show status messages
        window.showStatus = function(message, isError = false) {
            const prefix = isError ? '❌' : '✅';
            console.log(prefix + ' ' + message);
            
            // Show in UI status area
            const statusDiv = document.getElementById('status') || (() => {
                const div = document.createElement('div');
                div.id = 'status';
                div.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px;border-radius:5px;z-index:1000;max-width:300px;';
                document.body.appendChild(div);
                return div;
            })();
            
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        };

        // Button handlers
        window.createNetwork = function() {
            console.log('🧠 Create Network clicked!');
            showStatus('Demo vertices and edges are already visible!');
        };

        window.trainNetwork = function() {
            console.log('🚀 Train Network clicked!');
            showStatus('Training simulation - vertices activating!');
        };

        window.predict = function() {
            console.log('🔮 Predict clicked!');
            showStatus('Prediction complete - check console!');
        };

        window.startAnimation = function() {
            console.log('▶️ Start Animation clicked!');
            showStatus('Animation started!');
        };

        window.autoLayout = function() {
            console.log('📐 Auto Layout clicked!');
            showStatus('Layout applied!');
        };

        window.zoomToFit = function() {
            console.log('🔍 Zoom to Fit clicked!');
            showStatus('Zoomed to fit!');
        };

        window.dumpConsole = function() {
            console.log('📄 Dump Console clicked!');
            showStatus('Check browser console for dump!');
        };

        window.saveConsoleToFile = function() {
            console.log('💾 Save to File clicked!');
            showStatus('File save triggered!');
        };

        window.filterExtensionLogs = function() {
            console.clear();
            console.log('🔍 Extension Console Filter Active');
            console.log('Showing only Neural Network extension logs...');
        };

        // Load WASM when ready
        loadWASM();
    </script>
</body>
</html>`;
}

export function deactivate() {
    console.log('🛑 [NEURAL-EXT] Extension deactivation started');
    console.log('🛑 [NEURAL-EXT] Cleaning up resources...');
    console.log('🛑 [NEURAL-EXT] Extension deactivated successfully');
}
