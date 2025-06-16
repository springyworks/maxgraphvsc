// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "maxgraphvsc" is now active!');

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
            
            updateStatus();
        }

        function setupNeuronStyles() {
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

        function createNeuron(x, y, label, type, width = 60, height = 60) {
            graph.getModel().beginUpdate();
            try {
                const vertex = graph.insertVertex(parent, null, label, x, y, width, height, type);
                nodeCounter++;
                return vertex;
            } finally {
                graph.getModel().endUpdate();
            }
        }

        function connectNeurons(source, target) {
            graph.getModel().beginUpdate();
            try {
                graph.insertEdge(parent, null, '', source, target, 'connection');
            } finally {
                graph.getModel().endUpdate();
            }
        }

        function createSampleNetwork() {
            clearNetwork();
            
            graph.getModel().beginUpdate();
            try {
                // Create input layer
                const inputs = [];
                for (let i = 0; i < 4; i++) {
                    inputs.push(createNeuron(50, 50 + i * 80, \`I\${i+1}\`, 'inputNeuron'));
                }
                
                // Create hidden layer
                const hidden = [];
                for (let i = 0; i < 6; i++) {
                    hidden.push(createNeuron(250, 30 + i * 60, \`H\${i+1}\`, 'hiddenNeuron'));
                }
                
                // Create output layer
                const outputs = [];
                for (let i = 0; i < 2; i++) {
                    outputs.push(createNeuron(450, 100 + i * 80, \`O\${i+1}\`, 'outputNeuron'));
                }
                
                // Connect input to hidden
                inputs.forEach(input => {
                    hidden.forEach(h => {
                        connectNeurons(input, h);
                    });
                });
                
                // Connect hidden to output
                hidden.forEach(h => {
                    outputs.forEach(output => {
                        connectNeurons(h, output);
                    });
                });
                
            } finally {
                graph.getModel().endUpdate();
            }
            
            updateStatus('Sample network created! Drag neurons to move them.');
        }

        function createComplexNetwork() {
            clearNetwork();
            
            graph.getModel().beginUpdate();
            try {
                // Create a more complex network with multiple hidden layers
                const layer1 = [];
                const layer2 = [];
                const layer3 = [];
                const outputs = [];
                
                // Input layer (8 neurons)
                for (let i = 0; i < 8; i++) {
                    layer1.push(createNeuron(50, 20 + i * 50, \`I\${i+1}\`, 'inputNeuron', 50, 50));
                }
                
                // Hidden layer 1 (10 neurons)
                for (let i = 0; i < 10; i++) {
                    layer2.push(createNeuron(200, 10 + i * 40, \`H1-\${i+1}\`, 'hiddenNeuron', 55, 55));
                }
                
                // Hidden layer 2 (6 neurons)
                for (let i = 0; i < 6; i++) {
                    layer3.push(createNeuron(350, 50 + i * 60, \`H2-\${i+1}\`, 'hiddenNeuron', 55, 55));
                }
                
                // Output layer (4 neurons)
                for (let i = 0; i < 4; i++) {
                    outputs.push(createNeuron(500, 80 + i * 70, \`O\${i+1}\`, 'outputNeuron', 50, 50));
                }
                
                // Connect layers
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
            
            updateStatus('Complex network created! All neurons are draggable.');
        }

        function addRandomNeuron() {
            const types = ['inputNeuron', 'hiddenNeuron', 'outputNeuron'];
            const labels = ['I', 'H', 'O'];
            const typeIndex = Math.floor(Math.random() * 3);
            
            const x = Math.random() * 400 + 50;
            const y = Math.random() * 300 + 50;
            const label = labels[typeIndex] + (nodeCounter + 1);
            
            createNeuron(x, y, label, types[typeIndex]);
            updateStatus(\`Added \${label} neuron - drag to move!\`);
        }

        function clearNetwork() {
            graph.getModel().beginUpdate();
            try {
                graph.removeCells(graph.getChildVertices(parent));
                nodeCounter = 0;
            } finally {
                graph.getModel().endUpdate();
            }
            updateStatus('Network cleared');
        }

        function exportNetwork() {
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
        }

        function updateStatus(message) {
            const vertices = graph.getChildVertices(parent);
            const edges = graph.getChildEdges(parent);
            
            document.getElementById('nodeCount').textContent = vertices.length;
            document.getElementById('edgeCount').textContent = edges.length;
            
            if (message) {
                document.getElementById('statusBar').textContent = message;
                setTimeout(() => {
                    document.getElementById('statusBar').textContent = 'Ready - Drag neurons to move them!';
                }, 3000);
            }
        }

        // Initialize MaxGraph when the page loads
        window.addEventListener('load', initMaxGraph);
    </script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
