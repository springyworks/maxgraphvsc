// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
// kan weg
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

	// Add neural network visualization WebView panel functionality
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

		panel.webview.html = getNeuralNetworkWebviewContent();
		
		return panel;
	}

	function getNeuralNetworkWebviewContent(): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Network Visualization</title>
    <script src="https://unpkg.com/@maxgraph/core@0.20.0/dist/maxgraph.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        #graphContainer {
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
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status.connected {
            background-color: #28a745;
            color: white;
        }
        .status.disconnected {
            background-color: #dc3545;
            color: white;
        }
        .neural-layer {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 20px;
        }
        .neuron {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <h1>🧠 D-LinOSS Neural Network Visualization</h1>
    
    <div class="controls">
        <button onclick="createSampleNetwork()">🔮 Create Sample Network</button>
        <button onclick="createComplexNetwork()">🧠 Complex Neural Network</button>
        <button onclick="animateNetwork()">⚡ Animate Neural Flow</button>
        <button onclick="connectToRustProfiler()">🔗 Connect to Rust Profiler</button>
        <button onclick="clearNetwork()">🧹 Clear Network</button>
        <span class="status disconnected" id="connectionStatus">Disconnected</span>
    </div>

    <div id="graphContainer"></div>

    <div class="info">
        <h3>📊 Real-time Neural Network Dynamics</h3>
        <p><strong>MaxGraph Integration:</strong> Interactive neural network visualization with real-time updates</p>
        <p><strong>D-LinOSS Brain Dynamics:</strong> Ready to receive neural network profiling data from Rust burn profiler</p>
        <div id="networkStats"></div>
    </div>

    <script>
        // MaxGraph neural network visualization
        let graph = null;
        let model = null;
        let parent = null;
        let websocket = null;

        function initializeMaxGraph() {
            const container = document.getElementById('graphContainer');
            
            // Initialize MaxGraph
            const { Graph, InternalEvent } = maxgraph;
            
            // Create graph instance
            graph = new Graph(container);
            model = graph.getModel();
            parent = graph.getDefaultParent();
            
            // Configure graph
            graph.setGridEnabled(true);
            graph.setPanning(true);
            graph.setConnectable(false);
            graph.setCellsEditable(false);
            graph.setCellsResizable(false);
            
            // Custom styles for neurons and connections
            const stylesheet = graph.getStylesheet();
            
            // Neuron styles
            stylesheet.putCellStyle('inputNeuron', {
                fillColor: '#4CAF50',
                strokeColor: '#2E7D32',
                fontColor: 'white',
                fontSize: 12,
                fontStyle: 1
            });
            
            stylesheet.putCellStyle('hiddenNeuron', {
                fillColor: '#2196F3',
                strokeColor: '#1565C0',
                fontColor: 'white',
                fontSize: 12,
                fontStyle: 1
            });
            
            stylesheet.putCellStyle('outputNeuron', {
                fillColor: '#FF9800',
                strokeColor: '#F57C00',
                fontColor: 'white',
                fontSize: 12,
                fontStyle: 1
            });
            
            // Connection styles
            stylesheet.putCellStyle('neuralConnection', {
                strokeColor: '#666',
                strokeWidth: 2,
                endArrow: 'classic'
            });
            
            console.log('MaxGraph initialized successfully');
        }

        function createSampleNetwork() {
            if (!graph) initializeMaxGraph();
            
            model.beginUpdate();
            try {
                // Clear existing graph
                graph.removeCells(graph.getChildVertices(parent));
                
                // Input layer (4 neurons)
                const inputLayer = [];
                for (let i = 0; i < 4; i++) {
                    const neuron = graph.insertVertex(parent, null, \`I\${i+1}\`, 50, 100 + i * 80, 50, 50, 'inputNeuron');
                    inputLayer.push(neuron);
                }
                
                // Hidden layer 1 (6 neurons)
                const hiddenLayer1 = [];
                for (let i = 0; i < 6; i++) {
                    const neuron = graph.insertVertex(parent, null, \`H1-\${i+1}\`, 200, 50 + i * 60, 50, 50, 'hiddenNeuron');
                    hiddenLayer1.push(neuron);
                }
                
                // Hidden layer 2 (4 neurons)
                const hiddenLayer2 = [];
                for (let i = 0; i < 4; i++) {
                    const neuron = graph.insertVertex(parent, null, \`H2-\${i+1}\`, 350, 100 + i * 80, 50, 50, 'hiddenNeuron');
                    hiddenLayer2.push(neuron);
                }
                
                // Output layer (2 neurons)
                const outputLayer = [];
                for (let i = 0; i < 2; i++) {
                    const neuron = graph.insertVertex(parent, null, \`O\${i+1}\`, 500, 150 + i * 80, 50, 50, 'outputNeuron');
                    outputLayer.push(neuron);
                }
                
                // Connect layers
                connectLayers(inputLayer, hiddenLayer1);
                connectLayers(hiddenLayer1, hiddenLayer2);
                connectLayers(hiddenLayer2, outputLayer);
                
                updateNetworkStats({
                    layers: 4,
                    neurons: 16,
                    connections: inputLayer.length * hiddenLayer1.length + hiddenLayer1.length * hiddenLayer2.length + hiddenLayer2.length * outputLayer.length
                });
                
            } finally {
                model.endUpdate();
            }
        }

        function createComplexNetwork() {
            if (!graph) initializeMaxGraph();
            
            model.beginUpdate();
            try {
                // Clear existing graph
                graph.removeCells(graph.getChildVertices(parent));
                
                // More complex neural network architecture
                const layers = [
                    { count: 8, x: 50, style: 'inputNeuron', label: 'I' },
                    { count: 12, x: 180, style: 'hiddenNeuron', label: 'H1' },
                    { count: 10, x: 310, style: 'hiddenNeuron', label: 'H2' },
                    { count: 8, x: 440, style: 'hiddenNeuron', label: 'H3' },
                    { count: 4, x: 570, style: 'outputNeuron', label: 'O' }
                ];
                
                const allLayers = [];
                
                layers.forEach((layerSpec, layerIndex) => {
                    const layer = [];
                    const startY = 50 + (12 - layerSpec.count) * 15; // Center the layer
                    
                    for (let i = 0; i < layerSpec.count; i++) {
                        const neuron = graph.insertVertex(
                            parent, 
                            null, 
                            \`\${layerSpec.label}\${i+1}\`, 
                            layerSpec.x, 
                            startY + i * 40, 
                            40, 
                            40, 
                            layerSpec.style
                        );
                        layer.push(neuron);
                    }
                    allLayers.push(layer);
                });
                
                // Connect all layers
                for (let i = 0; i < allLayers.length - 1; i++) {
                    connectLayers(allLayers[i], allLayers[i + 1]);
                }
                
                const totalNeurons = layers.reduce((sum, layer) => sum + layer.count, 0);
                const totalConnections = layers.slice(0, -1).reduce((sum, layer, i) => 
                    sum + layer.count * layers[i + 1].count, 0);
                
                updateNetworkStats({
                    layers: layers.length,
                    neurons: totalNeurons,
                    connections: totalConnections
                });
                
            } finally {
                model.endUpdate();
            }
        }

        function connectLayers(fromLayer, toLayer) {
            fromLayer.forEach(fromNeuron => {
                toLayer.forEach(toNeuron => {
                    graph.insertEdge(parent, null, '', fromNeuron, toNeuron, 'neuralConnection');
                });
            });
        }

        function animateNetwork() {
            if (!graph) return;
            
            const cells = graph.getChildVertices(parent);
            const neurons = cells.filter(cell => graph.getModel().isVertex(cell));
            
            // Simulate neural activation propagation
            neurons.forEach((neuron, index) => {
                setTimeout(() => {
                    // Temporarily highlight the neuron
                    const originalStyle = graph.getCellStyle(neuron);
                    graph.setCellStyle('fillColor=#FFD700;strokeColor=#FFA000', [neuron]);
                    
                    setTimeout(() => {
                        graph.setCellStyle(originalStyle, [neuron]);
                    }, 200);
                }, index * 100);
            });
        }

        function connectToRustProfiler() {
            const status = document.getElementById('connectionStatus');
            status.textContent = 'Connecting...';
            status.className = 'status';
            status.style.backgroundColor = '#ffc107';
            
            // Simulate WebSocket connection to Rust burn profiler
            try {
                // This will be replaced with actual WebSocket connection
                // websocket = new WebSocket('ws://localhost:8080/neural-profiler');
                
                // Simulate successful connection
                setTimeout(() => {
                    status.textContent = 'Connected to LinossRust';
                    status.className = 'status connected';
                    
                    // Start receiving mock data
                    simulateRealTimeData();
                }, 2000);
                
            } catch (error) {
                status.textContent = 'Connection Failed';
                status.style.backgroundColor = '#dc3545';
            }
        }

        function simulateRealTimeData() {
            // Simulate receiving neural network data from Rust profiler
            setInterval(() => {
                if (graph) {
                    const neurons = graph.getChildVertices(parent).filter(cell => graph.getModel().isVertex(cell));
                    if (neurons.length > 0) {
                        const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
                        
                        // Simulate activation
                        graph.setCellStyle('fillColor=#FF4444;strokeColor=#CC0000', [randomNeuron]);
                        setTimeout(() => {
                            const isInput = randomNeuron.value.startsWith('I');
                            const isOutput = randomNeuron.value.startsWith('O');
                            const style = isInput ? 'inputNeuron' : isOutput ? 'outputNeuron' : 'hiddenNeuron';
                            graph.setCellStyle(style, [randomNeuron]);
                        }, 300);
                    }
                }
            }, 1000);
        }

        function updateNetworkStats(stats) {
            const statsDiv = document.getElementById('networkStats');
            statsDiv.innerHTML = \`
                <strong>Network Statistics:</strong><br>
                Layers: \${stats.layers} | 
                Neurons: \${stats.neurons} | 
                Connections: \${stats.connections}
            \`;
        }

        function clearNetwork() {
            if (graph) {
                model.beginUpdate();
                try {
                    graph.removeCells(graph.getChildVertices(parent));
                } finally {
                    model.endUpdate();
                }
            }
            
            const status = document.getElementById('connectionStatus');
            status.textContent = 'Disconnected';
            status.className = 'status disconnected';
            
            document.getElementById('networkStats').innerHTML = '';
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Neural Network Visualization starting...');
            initializeMaxGraph();
            console.log('Ready for neural network visualization!');
        });
    </script>
</body>
</html>\`;
	}
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Neural Network Visualization</title>
		    <style>
		        body {
		            margin: 0;
		            padding: 20px;
		            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		            background-color: var(--vscode-editor-background);
		            color: var(--vscode-editor-foreground);
		        }
		        #graphContainer {
		            width: 100%;
		            height: 80vh;
		            border: 2px solid var(--vscode-panel-border);
		            border-radius: 8px;
		            background-color: var(--vscode-editor-background);
		            position: relative;
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
		        .status {
		            display: inline-block;
		            padding: 4px 8px;
		            border-radius: 4px;
		            font-size: 12px;
		            font-weight: bold;
		        }
		        .status.connected {
		            background-color: #28a745;
		            color: white;
		        }
		        .status.disconnected {
		            background-color: #dc3545;
		            color: white;
		        }
		    </style>
		</head>
		<body>
		    <h1>🧠 Neural Network Visualization - D-LinOSS Brain Dynamics</h1>
		    
		    <div class="controls">
		        <button onclick="createSampleNetwork()">🔮 Create Sample Network</button>
		        <button onclick="connectToRustProfiler()">🔗 Connect to Rust Profiler</button>
		        <button onclick="startLiveVisualization()">📊 Start Live Visualization</button>
		        <button onclick="clearNetwork()">🧹 Clear Network</button>
		        <span class="status disconnected" id="connectionStatus">Disconnected</span>
		    </div>

		    <div id="graphContainer"></div>

		    <div class="info">
		        <h3>📋 Instructions:</h3>
		        <ul>
		            <li><strong>Sample Network:</strong> Creates a demo neural network to test visualization</li>
		            <li><strong>Connect to Rust Profiler:</strong> Establishes WebSocket connection to LinossRust burn profiler</li>
		            <li><strong>Live Visualization:</strong> Streams real-time neural network data</li>
		            <li><strong>Clear Network:</strong> Resets the visualization</li>
		        </ul>
		        <p><strong>Status:</strong> Ready for MaxGraph neural network visualization!</p>
		    </div>

		    <script>
		        // Initialize the neural network visualization
		        let graph = null;
		        let model = null;
		        let parent = null;

		        function initializeGraph() {
		            const container = document.getElementById('graphContainer');
		            
		            // This will be replaced with actual MaxGraph implementation
		            container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 18px; color: #666;">MaxGraph neural network will be initialized here...</div>';
		        }

		        function createSampleNetwork() {
		            const container = document.getElementById('graphContainer');
		            
		            // Create a sample neural network visualization
		            container.innerHTML = \`
		                <div style="padding: 20px; height: 100%; overflow: auto;">
		                    <h3>🧠 Sample Neural Network Structure</h3>
		                    <div style="margin: 20px 0;">
		                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: var(--vscode-textCodeBlock-background); border-radius: 4px;">
		                            <span>Input Layer</span>
		                            <div style="display: flex; gap: 5px;">
		                                \${[...Array(4)].map((_, i) => \`<div style="width: 20px; height: 20px; background: #4CAF50; border-radius: 50%; display: inline-block;"></div>\`).join('')}
		                            </div>
		                            <span>4 neurons</span>
		                        </div>
		                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: var(--vscode-textCodeBlock-background); border-radius: 4px;">
		                            <span>Hidden Layer 1</span>
		                            <div style="display: flex; gap: 5px;">
		                                \${[...Array(6)].map((_, i) => \`<div style="width: 20px; height: 20px; background: #2196F3; border-radius: 50%; display: inline-block;"></div>\`).join('')}
		                            </div>
		                            <span>6 neurons</span>
		                        </div>
		                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: var(--vscode-textCodeBlock-background); border-radius: 4px;">
		                            <span>Hidden Layer 2</span>
		                            <div style="display: flex; gap: 5px;">
		                                \${[...Array(4)].map((_, i) => \`<div style="width: 20px; height: 20px; background: #FF9800; border-radius: 50%; display: inline-block;"></div>\`).join('')}
		                            </div>
		                            <span>4 neurons</span>
		                        </div>
		                        <div style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 10px; background: var(--vscode-textCodeBlock-background); border-radius: 4px;">
		                            <span>Output Layer</span>
		                            <div style="display: flex; gap: 5px;">
		                                \${[...Array(2)].map((_, i) => \`<div style="width: 20px; height: 20px; background: #F44336; border-radius: 50%; display: inline-block;"></div>\`).join('')}
		                            </div>
		                            <span>2 neurons</span>
		                        </div>
		                    </div>
		                    <p style="color: #666; font-style: italic;">This is a sample network. MaxGraph will render interactive neural networks here.</p>
		                </div>
		            \`;
		        }

		        function connectToRustProfiler() {
		            const status = document.getElementById('connectionStatus');
		            status.textContent = 'Connecting...';
		            status.className = 'status';
		            status.style.backgroundColor = '#ffc107';
		            
		            // Simulate connection attempt
		            setTimeout(() => {
		                // This will be replaced with actual WebSocket connection
		                status.textContent = 'Connected to LinossRust';
		                status.className = 'status connected';
		                
		                const container = document.getElementById('graphContainer');
		                container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 16px; color: #28a745;">🔗 Connected to Rust Burn Profiler!<br>Ready to receive neural network data...</div>';
		            }, 2000);
		        }

		        function startLiveVisualization() {
		            const container = document.getElementById('graphContainer');
		            container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 16px; color: #2196F3;">📊 Live Visualization Started!<br>Streaming neural network dynamics...</div>';
		        }

		        function clearNetwork() {
		            initializeGraph();
		            const status = document.getElementById('connectionStatus');
		            status.textContent = 'Disconnected';
		            status.className = 'status disconnected';
		        }

		        // Initialize when page loads
		        document.addEventListener('DOMContentLoaded', initializeGraph);
		    </script>
		</body>
		</html>`;
	}

	// Command to open the neural network visualization panel
	const openNeuralNetworkVizCommand = vscode.commands.registerCommand('maxgraphvsc.openNeuralNetworkViz', () => {
		createNeuralNetworkPanel(context);
	});

	context.subscriptions.push(openNeuralNetworkVizCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
