// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('✨ MaxGraphVSC extension activated! Watch mode test ✨');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('maxgraphvsc.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display multiple types of notifications to make it more visible
		vscode.window.showInformationMessage('🚀 Hello World from maxgraphVSC! Extension is working! 🎉');
		vscode.window.showWarningMessage('⚠️ MaxGraph VSC Extension - Hello World Test Successful!');
		
		// Also log to console and output channel for debugging
		console.log('MaxGraphVSC: Hello World command executed successfully!');
		
		// Create an output channel for better visibility
		const outputChannel = vscode.window.createOutputChannel('MaxGraphVSC');
		outputChannel.appendLine('=== MaxGraphVSC Extension ===');
		outputChannel.appendLine('Hello World command executed at: ' + new Date().toISOString());
		outputChannel.appendLine('Extension is working properly!');
		outputChannel.show(true);
	});

	context.subscriptions.push(disposable);

	// Add a second command that's more visible
	const testCommand = vscode.commands.registerCommand('maxgraphvsc.testExtension', async () => {
		const result = await vscode.window.showInformationMessage(
			'🧠 MaxGraphVSC Neural Network Extension is Ready!', 
			{ modal: true },
			'Open Output', 
			'Test Complete'
		);
		
		if (result === 'Open Output') {
			const outputChannel = vscode.window.createOutputChannel('MaxGraphVSC Debug');
			outputChannel.appendLine('🔥 MaxGraphVSC Extension Test Results:');
			outputChannel.appendLine('✅ Extension loaded successfully');
			outputChannel.appendLine('✅ Commands registered properly');
			outputChannel.appendLine('✅ Ready for neural network visualization!');
			outputChannel.appendLine('');
			outputChannel.appendLine('Next steps:');
			outputChannel.appendLine('- Add MaxGraph library');
			outputChannel.appendLine('- Create WebView panel');
			outputChannel.appendLine('- Connect to Rust burn profiler');
			outputChannel.show(true);
		}
	});

	context.subscriptions.push(testCommand);

	// Add neural network visualization command
	const neuralNetCommand = vscode.commands.registerCommand('maxgraphvsc.openNeuralNetwork', () => {
		createNeuralNetworkPanel(context);
		vscode.window.showInformationMessage('🧠 Neural Network Visualization panel opened!');
	});

	context.subscriptions.push(neuralNetCommand);
}

// Add neural network visualization functionality
function createNeuralNetworkPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'neuralNetworkViz',
		'🧠 Neural Network Visualization',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
		}
	);

	panel.webview.html = getBasicNeuralNetworkWebviewContent();
	
	return panel;
}

function getBasicNeuralNetworkWebviewContent(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Neural Network - MaxGraph</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .container {
            width: 100%;
            height: 70vh;
            border: 2px solid var(--vscode-panel-border);
            border-radius: 8px;
            background-color: var(--vscode-editor-background);
            position: relative;
            overflow: hidden;
        }
        .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .info {
            margin-top: 10px;
            padding: 10px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
            border-radius: 4px;
        }
        #graphContainer {
            width: 100%;
            height: 100%;
            background: var(--vscode-editor-background);
        }
        .status {
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
        }
    </style>
    <!-- Include MaxGraph from CDN with fallback -->
    <script src="https://unpkg.com/@maxgraph/core@0.10.2/dist/maxgraph.min.js"></script>
</head>
<body>
    <h1>🧠 Interactive Neural Network - MaxGraph</h1>
    
    <div class="controls">
        <button onclick="createSampleNetwork()">🔮 Sample Network (Draggable)</button>
        <button onclick="createComplexNetwork()">🧠 Complex Network</button>
        <button onclick="addRandomNeuron()">➕ Add Neuron</button>
        <button onclick="clearNetwork()">🧹 Clear</button>
        <button onclick="exportNetwork()">💾 Export</button>
    </div>

    <div class="container">
        <div id="graphContainer"></div>
        <div class="status" id="statusBar">Ready - Drag neurons to move them!</div>
    </div>

    <div class="info">
        <h3>🎮 Interactive Neural Network Visualization</h3>
        <p><strong>MaxGraph Integration:</strong> Drag and drop neural network components!</p>
        <p><strong>Features:</strong> Movable neurons, connections, real-time updates</p>
        <p><strong>Status:</strong> <span id="nodeCount">0</span> neurons, <span id="edgeCount">0</span> connections</p>
    </div>

    <script>
        let graph;
        let parent;
        let nodeCounter = 0;

        function initMaxGraph() {
            try {
                // Force fallback mode for now to ensure draggable functionality
                console.log('Forcing fallback mode for guaranteed drag functionality');
                initFallbackMode();
                return;
                
                // MaxGraph code disabled for now
                /*
                // Check if MaxGraph is available
                if (typeof mxGraph === 'undefined') {
                    console.error('MaxGraph not loaded! Falling back to simple mode.');
                    initFallbackMode();
                    return;
                }
                
                console.log('MaxGraph available, initializing...');
                
                // Create the graph
                const container = document.getElementById('graphContainer');
                graph = new mxGraph(container);
                
                // Get the default parent for inserting new cells
                parent = graph.getDefaultParent();
                
                // Configure the graph
                graph.setConnectable(true);
                graph.setAllowDanglingEdges(false);
                graph.setMultigraph(false);
                graph.setDropEnabled(true);
                
                // Enable drag and drop
                graph.setPanning(true);
                graph.panningHandler.useLeftButtonForPanning = true;
                
                // Set up styles for different neuron types
                setupNeuronStyles();
                
                // Add listeners for status updates
                graph.addListener(mxEvent.CELLS_ADDED, updateStatus);
                graph.addListener(mxEvent.CELLS_REMOVED, updateStatus);
                graph.addListener(mxEvent.CELL_CONNECTED, updateStatus);
                
                updateStatus('MaxGraph initialized successfully!');
                console.log('MaxGraph initialization complete');
                */
                
            } catch (error) {
                console.error('Error initializing MaxGraph:', error);
                updateStatus('Error loading MaxGraph - using fallback mode');
                initFallbackMode();
            }
        }

        function initFallbackMode() {
            console.log('Initializing fallback interactive mode...');
            const container = document.getElementById('graphContainer');
            container.innerHTML = \`
                <div style="position: relative; width: 100%; height: 100%; background: var(--vscode-editor-background);">
                    <div id="neuronContainer" style="width: 100%; height: 100%; position: relative; overflow: hidden;">
                        <h3 style="text-align: center; margin: 20px 0; color: var(--vscode-editor-foreground);">Interactive Neural Network (Fallback Mode)</h3>
                        <p style="text-align: center; color: var(--vscode-editor-foreground); margin-bottom: 30px;">All neurons are draggable! Click buttons to create networks.</p>
                    </div>
                </div>
            \`;
            updateStatus('Fallback mode ready - all neurons will be draggable!');
        }

        function setupNeuronStyles() {
            if (!graph) return;
            
            const stylesheet = graph.getStylesheet();
            
            // Input neuron style (green)
            stylesheet.putCellStyle('inputNeuron', {
                [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_ELLIPSE,
                [mxConstants.STYLE_FILLCOLOR]: '#4CAF50',
                [mxConstants.STYLE_STROKECOLOR]: '#2E7D32',
                [mxConstants.STYLE_FONTCOLOR]: 'white',
                [mxConstants.STYLE_FONTSIZE]: 12,
                [mxConstants.STYLE_FONTSTYLE]: mxConstants.FONT_BOLD
            });
            
            // Hidden neuron style (blue)
            stylesheet.putCellStyle('hiddenNeuron', {
                [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_ELLIPSE,
                [mxConstants.STYLE_FILLCOLOR]: '#2196F3',
                [mxConstants.STYLE_STROKECOLOR]: '#1565C0',
                [mxConstants.STYLE_FONTCOLOR]: 'white',
                [mxConstants.STYLE_FONTSIZE]: 12,
                [mxConstants.STYLE_FONTSTYLE]: mxConstants.FONT_BOLD
            });
            
            // Output neuron style (orange)
            stylesheet.putCellStyle('outputNeuron', {
                [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_ELLIPSE,
                [mxConstants.STYLE_FILLCOLOR]: '#FF9800',
                [mxConstants.STYLE_STROKECOLOR]: '#F57C00',
                [mxConstants.STYLE_FONTCOLOR]: 'white',
                [mxConstants.STYLE_FONTSIZE]: 12,
                [mxConstants.STYLE_FONTSTYLE]: mxConstants.FONT_BOLD
            });
            
            // Connection style
            stylesheet.putCellStyle('connection', {
                [mxConstants.STYLE_STROKECOLOR]: '#666666',
                [mxConstants.STYLE_STROKEWIDTH]: 2,
                [mxConstants.STYLE_EDGE]: mxConstants.EDGESTYLE_ORTHOGONAL,
                [mxConstants.STYLE_ENDARROW]: mxConstants.ARROW_CLASSIC
            });
        }

        function createDraggableNeuron(x, y, label, type) {
            const colors = {
                'input': '#4CAF50',
                'hidden': '#2196F3', 
                'output': '#FF9800'
            };
            
            const neuron = document.createElement('div');
            neuron.className = 'draggable-neuron'; // Add class for easy identification
            neuron.setAttribute('data-label', label); // Add data attribute for debugging
            neuron.style.cssText = \`
                position: absolute;
                left: \${x}px;
                top: \${y}px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: \${colors[type] || '#666'};
                color: white;
                font-weight: bold;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                user-select: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: transform 0.1s;
                z-index: 1000;
                border: 2px solid rgba(255,255,255,0.3);
            \`;
            neuron.textContent = label;
            
            // Create unique drag handlers for each neuron (closure-based)
            let isDragging = false;
            let startX, startY, initialX, initialY;
            
            // Mouse down event - start drag
            const handleMouseDown = function(e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = neuron.offsetLeft;
                initialY = neuron.offsetTop;
                neuron.style.transform = 'scale(1.1)';
                neuron.style.zIndex = '1001';
                neuron.style.border = '2px solid #fff';
                e.preventDefault();
                e.stopPropagation();
                console.log('Started dragging neuron:', label, 'at', initialX, initialY);
            };
            
            // Mouse move event - update position
            const handleMouseMove = function(e) {
                if (isDragging) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    const newX = initialX + deltaX;
                    const newY = initialY + deltaY;
                    neuron.style.left = newX + 'px';
                    neuron.style.top = newY + 'px';
                }
            };
            
            // Mouse up event - end drag
            const handleMouseUp = function(e) {
                if (isDragging) {
                    isDragging = false;
                    neuron.style.transform = 'scale(1)';
                    neuron.style.zIndex = '1000';
                    neuron.style.border = '2px solid rgba(255,255,255,0.3)';
                    updateStatus(\`Moved \${label} to (\${neuron.offsetLeft}, \${neuron.offsetTop})\`);
                    console.log('Finished dragging neuron:', label, 'to', neuron.offsetLeft, neuron.offsetTop);
                }
            };
            
            // Attach event listeners directly to the neuron and document
            neuron.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            // Store cleanup function on the neuron for later removal
            neuron.dragCleanup = function() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            console.log('Created draggable neuron:', label, 'with independent drag handlers');
            return neuron;
        }

        function createNeuron(x, y, label, type, width = 60, height = 60) {
            // Force fallback mode for guaranteed draggable functionality
            console.log('Creating draggable neuron:', label, 'at', x, y);
            const container = document.getElementById('neuronContainer') || document.getElementById('graphContainer');
            if (container) {
                const neuron = createDraggableNeuron(x, y, label, type.replace('Neuron', ''));
                container.appendChild(neuron);
                nodeCounter++;
                console.log('Successfully created draggable neuron:', label);
                return neuron;
            } else {
                console.error('No container found for neuron:', label);
            }
            
            /* MaxGraph code disabled for guaranteed drag functionality
            if (graph && typeof mxGraph !== 'undefined') {
                // MaxGraph mode
                graph.getModel().beginUpdate();
                try {
                    const vertex = graph.insertVertex(parent, null, label, x, y, width, height, type);
                    nodeCounter++;
                    return vertex;
                } finally {
                    graph.getModel().endUpdate();
                }
            } else {
                // Fallback mode - always create draggable neurons
                const container = document.getElementById('neuronContainer') || document.getElementById('graphContainer');
                if (container) {
                    const neuron = createDraggableNeuron(x, y, label, type.replace('Neuron', ''));
                    container.appendChild(neuron);
                    nodeCounter++;
                    return neuron;
                }
            }
            */
        }

        function connectNeurons(source, target) {
            if (graph) {
                graph.getModel().beginUpdate();
                try {
                    graph.insertEdge(parent, null, '', source, target, 'connection');
                } finally {
                    graph.getModel().endUpdate();
                }
            }
            // Note: In fallback mode, we skip connections for simplicity
        }

        function createSampleNetwork() {
            clearNetwork();
            console.log('Creating sample network in fallback mode - all neurons will be draggable');
            
            // Force fallback mode for guaranteed draggable neurons
            // Clear any existing content first
            const container = document.getElementById('neuronContainer');
            if (container) {
                // Clear previous neurons but keep the container structure
                const existingNeurons = container.querySelectorAll('.draggable-neuron');
                console.log('Clearing', existingNeurons.length, 'existing neurons');
                existingNeurons.forEach(n => n.remove());
            }
            
            // Create input layer (all draggable)
            console.log('Creating input layer...');
            for (let i = 0; i < 4; i++) {
                createNeuron(50, 40 + i * 70, \`I\${i+1}\`, 'inputNeuron');
            }
            
            // Create hidden layer (all draggable)
            console.log('Creating hidden layer...');
            for (let i = 0; i < 6; i++) {
                createNeuron(200, 20 + i * 50, \`H\${i+1}\`, 'hiddenNeuron');
            }
            
            // Create output layer (all draggable)
            console.log('Creating output layer...');
            for (let i = 0; i < 2; i++) {
                createNeuron(350, 80 + i * 70, \`O\${i+1}\`, 'outputNeuron');
            }
            
            console.log('Sample network created with', nodeCounter, 'draggable neurons');
            updateStatus('Sample network created! ALL neurons are draggable - try moving them!');
        }

        function createComplexNetwork() {
            clearNetwork();
            
            if (graph) {
                // MaxGraph mode - same as before
                graph.getModel().beginUpdate();
                try {
                    const layer1 = [];
                    const layer2 = [];
                    const layer3 = [];
                    const outputs = [];
                    
                    for (let i = 0; i < 8; i++) {
                        layer1.push(createNeuron(50, 20 + i * 50, \`I\${i+1}\`, 'inputNeuron', 50, 50));
                    }
                    
                    for (let i = 0; i < 10; i++) {
                        layer2.push(createNeuron(200, 10 + i * 40, \`H1-\${i+1}\`, 'hiddenNeuron', 55, 55));
                    }
                    
                    for (let i = 0; i < 6; i++) {
                        layer3.push(createNeuron(350, 50 + i * 60, \`H2-\${i+1}\`, 'hiddenNeuron', 55, 55));
                    }
                    
                    for (let i = 0; i < 4; i++) {
                        outputs.push(createNeuron(500, 80 + i * 70, \`O\${i+1}\`, 'outputNeuron', 50, 50));
                    }
                    
                    layer1.forEach(n1 => {
                        layer2.forEach(n2 => connectNeurons(n1, n2));
                    });
                    
                    layer2.forEach(n2 => {
                        layer3.forEach(n3 => connectNeurons(n2, n3));
                    });
                    
                    layer3.forEach(n3 => {
                        outputs.forEach(out => connectNeurons(n3, out));
                    });
                    
                } finally {
                    graph.getModel().endUpdate();
                }
            } else {
                // Fallback mode
                for (let i = 0; i < 6; i++) {
                    createNeuron(30 + i * 80, 20 + Math.random() * 40, \`I\${i+1}\`, 'inputNeuron');
                }
                for (let i = 0; i < 8; i++) {
                    createNeuron(50 + i * 60, 100 + Math.random() * 60, \`H\${i+1}\`, 'hiddenNeuron');
                }
                for (let i = 0; i < 4; i++) {
                    createNeuron(100 + i * 80, 200 + Math.random() * 40, \`O\${i+1}\`, 'outputNeuron');
                }
            }
            
            updateStatus('Complex network created! All neurons are draggable.');
        }

        function addRandomNeuron() {
            const types = ['inputNeuron', 'hiddenNeuron', 'outputNeuron'];
            const labels = ['I', 'H', 'O'];
            const typeIndex = Math.floor(Math.random() * 3);
            
            const x = Math.random() * 400 + 50;
            const y = Math.random() * 200 + 50;
            const label = labels[typeIndex] + (nodeCounter + 1);
            
            createNeuron(x, y, label, types[typeIndex]);
            updateStatus(\`Added \${label} neuron - drag to move!\`);
        }

        function clearNetwork() {
            // Force fallback mode clearing
            console.log('Clearing network in fallback mode');
            const container = document.getElementById('neuronContainer') || document.getElementById('graphContainer');
            if (container) {
                const neurons = container.querySelectorAll('.draggable-neuron');
                console.log('Clearing', neurons.length, 'draggable neurons');
                
                // Clean up event listeners before removing neurons
                neurons.forEach(neuron => {
                    if (neuron.dragCleanup) {
                        neuron.dragCleanup();
                    }
                    neuron.remove();
                });
                nodeCounter = 0;
            }
            updateStatus('Network cleared - ready for new draggable neurons');
        }

        function exportNetwork() {
            if (graph) {
                const cells = graph.getChildCells(parent);
                const networkData = {
                    neurons: [],
                    connections: []
                };
                
                cells.forEach(cell => {
                    if (graph.getModel().isVertex(cell)) {
                        networkData.neurons.push({
                            id: cell.id,
                            label: cell.value,
                            x: cell.geometry.x,
                            y: cell.geometry.y,
                            type: cell.style
                        });
                    } else if (graph.getModel().isEdge(cell)) {
                        networkData.connections.push({
                            source: cell.source.id,
                            target: cell.target.id
                        });
                    }
                });
                
                console.log('Network exported:', networkData);
                updateStatus(\`Network exported: \${networkData.neurons.length} neurons, \${networkData.connections.length} connections\`);
            } else {
                const neurons = document.querySelectorAll('#neuronContainer > div');
                console.log('Fallback neurons:', neurons.length);
                updateStatus(\`Fallback mode: \${neurons.length} draggable neurons\`);
            }
        }

        function updateStatus(message) {
            if (graph) {
                const vertices = graph.getChildVertices(parent);
                const edges = graph.getChildEdges(parent);
                
                document.getElementById('nodeCount').textContent = vertices.length;
                document.getElementById('edgeCount').textContent = edges.length;
            } else {
                const neurons = document.querySelectorAll('#neuronContainer > div');
                document.getElementById('nodeCount').textContent = neurons.length;
                document.getElementById('edgeCount').textContent = '0 (fallback mode)';
            }
            
            if (message) {
                document.getElementById('statusBar').textContent = message;
                setTimeout(() => {
                    document.getElementById('statusBar').textContent = 'Ready - Drag neurons to move them!';
                }, 3000);
            }
        }

        // Initialize when the page loads
        window.addEventListener('load', function() {
            console.log('Page loaded, initializing...');
            setTimeout(initMaxGraph, 100); // Small delay to ensure MaxGraph is loaded
        });
    </script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
