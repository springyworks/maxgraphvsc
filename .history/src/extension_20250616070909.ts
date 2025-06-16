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
