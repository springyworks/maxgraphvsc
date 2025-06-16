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
    <title>Neural Network Visualization</title>
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
            display: flex;
            align-items: center;
            justify-content: center;
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
        .network-display {
            text-align: center;
            padding: 40px;
            font-size: 18px;
        }
        .layer {
            display: inline-block;
            margin: 0 20px;
            vertical-align: middle;
        }
        .neuron {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin: 5px;
            display: inline-block;
            color: white;
            font-weight: bold;
            font-size: 12px;
            line-height: 40px;
            text-align: center;
        }
        .input { background-color: #4CAF50; }
        .hidden { background-color: #2196F3; }
        .output { background-color: #FF9800; }
    </style>
</head>
<body>
    <h1>🧠 D-LinOSS Neural Network Visualization</h1>
    
    <div class="controls">
        <button onclick="showSampleNetwork()">🔮 Show Sample Network</button>
        <button onclick="showComplexNetwork()">🧠 Complex Network</button>
        <button onclick="clearDisplay()">🧹 Clear</button>
    </div>

    <div class="container" id="networkContainer">
        <div class="network-display">
            <p>Click "Show Sample Network" to create a neural network visualization</p>
        </div>
    </div>

    <div class="info">
        <h3>📊 Neural Network Visualization Ready</h3>
        <p><strong>Status:</strong> Extension loaded successfully. Ready for MaxGraph integration!</p>
        <p><strong>Next:</strong> We'll integrate MaxGraph library for interactive neural networks.</p>
    </div>

    <script>
        function showSampleNetwork() {
            const container = document.getElementById('networkContainer');
            container.innerHTML = \`
                <div class="network-display">
                    <h3>Sample Neural Network</h3>
                    <div class="layer">
                        <div>Input Layer</div>
                        <div class="neuron input">I1</div>
                        <div class="neuron input">I2</div>
                        <div class="neuron input">I3</div>
                        <div class="neuron input">I4</div>
                    </div>
                    <div class="layer">
                        <div>Hidden Layer</div>
                        <div class="neuron hidden">H1</div>
                        <div class="neuron hidden">H2</div>
                        <div class="neuron hidden">H3</div>
                        <div class="neuron hidden">H4</div>
                        <div class="neuron hidden">H5</div>
                        <div class="neuron hidden">H6</div>
                    </div>
                    <div class="layer">
                        <div>Output Layer</div>
                        <div class="neuron output">O1</div>
                        <div class="neuron output">O2</div>
                    </div>
                </div>
            \`;
        }

        function showComplexNetwork() {
            const container = document.getElementById('networkContainer');
            container.innerHTML = \`
                <div class="network-display">
                    <h3>Complex Neural Network</h3>
                    <div class="layer">
                        <div>Input</div>
                        <div class="neuron input">I1</div>
                        <div class="neuron input">I2</div>
                        <div class="neuron input">I3</div>
                        <div class="neuron input">I4</div>
                        <div class="neuron input">I5</div>
                        <div class="neuron input">I6</div>
                        <div class="neuron input">I7</div>
                        <div class="neuron input">I8</div>
                    </div>
                    <div class="layer">
                        <div>Hidden 1</div>
                        <div class="neuron hidden">H1</div>
                        <div class="neuron hidden">H2</div>
                        <div class="neuron hidden">H3</div>
                        <div class="neuron hidden">H4</div>
                        <div class="neuron hidden">H5</div>
                        <div class="neuron hidden">H6</div>
                        <div class="neuron hidden">H7</div>
                        <div class="neuron hidden">H8</div>
                        <div class="neuron hidden">H9</div>
                        <div class="neuron hidden">H10</div>
                    </div>
                    <div class="layer">
                        <div>Hidden 2</div>
                        <div class="neuron hidden">H1</div>
                        <div class="neuron hidden">H2</div>
                        <div class="neuron hidden">H3</div>
                        <div class="neuron hidden">H4</div>
                        <div class="neuron hidden">H5</div>
                        <div class="neuron hidden">H6</div>
                    </div>
                    <div class="layer">
                        <div>Output</div>
                        <div class="neuron output">O1</div>
                        <div class="neuron output">O2</div>
                        <div class="neuron output">O3</div>
                        <div class="neuron output">O4</div>
                    </div>
                </div>
            \`;
        }

        function clearDisplay() {
            const container = document.getElementById('networkContainer');
            container.innerHTML = \`
                <div class="network-display">
                    <p>Click "Show Sample Network" to create a neural network visualization</p>
                </div>
            \`;
        }
    </script>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
