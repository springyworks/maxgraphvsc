// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Security: Debug flag for logging - set to false for production
const DEBUG = false;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	if (DEBUG) {
		console.log('🧠 Neural Network Visualizer extension activated!');
	}

	// Create output channel for logging
	const outputChannel = vscode.window.createOutputChannel('Neural Network Visualizer');
	outputChannel.appendLine('🚀 Extension activated successfully');

	// Main neural network visualizer command
	const neuralNetCommand = vscode.commands.registerCommand('maxgraphvsc.openNeuralNetwork', () => {
		createNeuralNetworkPanel(context);
		vscode.window.showInformationMessage('🧠 Neural Network Visualizer opened!');
		outputChannel.appendLine('Neural Network panel created');
	});

	// Academic demo command - loads the full enhanced demo
	const academicDemoCommand = vscode.commands.registerCommand('maxgraphvsc.openAcademicDemo', () => {
		createAcademicDemoPanel(context);
		vscode.window.showInformationMessage('🎓 Academic Neural Network Demo opened!');
		outputChannel.appendLine('Academic demo panel created');
	});

	// Create new neural model command
	const createModelCommand = vscode.commands.registerCommand('maxgraphvsc.createNeuralModel', async () => {
		const modelName = await vscode.window.showInputBox({
			prompt: 'Enter neural network model name',
			placeHolder: 'my-neural-model'
		});
		
		if (modelName) {
			createNeuralModelTemplate(context, modelName);
			vscode.window.showInformationMessage(`🚀 Neural model "${modelName}" created!`);
			outputChannel.appendLine(`Created neural model template: ${modelName}`);
		}
	});

	context.subscriptions.push(neuralNetCommand, academicDemoCommand, createModelCommand);
}

// Add neural network visualization functionality
function createNeuralNetworkPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'neuralNetworkViz',
		'🧠 Neural Network Visualizer',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
		}
	);

	panel.webview.html = getInteractiveNeuralNetworkWebviewContent(panel.webview, context);
	
	// Handle messages from webview
	panel.webview.onDidReceiveMessage(
		message => {
			switch (message.command) {
				case 'openAcademicDemo':
					createAcademicDemoPanel(context);
					break;
			}
		},
		undefined,
		context.subscriptions
	);
	
	return panel;
}

// Create academic demo panel with full enhanced demo
function createAcademicDemoPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'academicNeuralDemo',
		'🎓 Academic Neural Network Demo',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
		}
	);

	// Load the enhanced academic demo HTML
	const demoPath = path.join(context.extensionPath, 'media', 'neural-demo.html');
	try {
		let demoContent = fs.readFileSync(demoPath, 'utf8');
		// Update relative paths to work with VS Code webview
		demoContent = demoContent.replace(/src="pkg\//g, `src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'pkg')).toString()}/`);
		demoContent = demoContent.replace(/href="pkg\//g, `href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'pkg')).toString()}/`);
		panel.webview.html = demoContent;
	} catch (error) {
		panel.webview.html = getBasicDemoFallback();
		vscode.window.showWarningMessage('Could not load enhanced demo, showing basic version');
	}
	
	return panel;
}

// Create neural model template
async function createNeuralModelTemplate(context: vscode.ExtensionContext, modelName: string) {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('Please open a workspace first');
		return;
	}

	const modelPath = path.join(workspaceFolder.uri.fsPath, `${modelName}.neural.json`);
	const templateContent = {
		name: modelName,
		type: "feedforward",
		layers: [
			{ type: "input", neurons: 3, activation: "linear" },
			{ type: "hidden", neurons: 4, activation: "relu" },
			{ type: "output", neurons: 2, activation: "softmax" }
		],
		metadata: {
			created: new Date().toISOString(),
			description: "Neural network model created with MaxGraph VSC extension",
			version: "1.0.0"
		}
	};

	try {
		fs.writeFileSync(modelPath, JSON.stringify(templateContent, null, 2));
		const document = await vscode.workspace.openTextDocument(modelPath);
		await vscode.window.showTextDocument(document);
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to create model template: ${error}`);
	}
}

function getInteractiveNeuralNetworkWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext): string {
	const wasmUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'pkg'));
	
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Network Visualizer</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: var(--vscode-font-family);
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
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .primary-button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-weight: bold;
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
            position: relative;
        }
        .demo-preview {
            text-align: center;
            padding: 40px;
        }
        .demo-preview svg {
            max-width: 400px;
            margin: 20px auto;
        }
        .demo-preview button {
            margin-top: 20px;
            padding: 12px 24px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="controls">
        <button class="primary-button" onclick="openAcademicDemo()">🎓 Open Academic Demo</button>
        <button onclick="createRandomNetwork()">🎲 Random Network</button>
        <button onclick="startTraining()">🚀 Start Training</button>
        <button onclick="resetNetwork()">🔄 Reset</button>
    </div>

    <div class="container">
        <div id="graphContainer">
            <div class="demo-preview">
                <h2>🧠 Neural Network Visualizer</h2>
                <p>Interactive neural network visualization powered by Rust/WASM and MaxGraph</p>
                <svg width="100%" height="200" viewBox="0 0 400 200">
                    <!-- Input layer -->
                    <circle cx="60" cy="50" r="12" fill="#6f42c1" opacity="0.8"/>
                    <circle cx="60" cy="100" r="12" fill="#6f42c1" opacity="0.8"/>
                    <circle cx="60" cy="150" r="12" fill="#6f42c1" opacity="0.8"/>
                    
                    <!-- Hidden layer -->
                    <circle cx="200" cy="35" r="12" fill="#0969da" opacity="0.8"/>
                    <circle cx="200" cy="75" r="12" fill="#0969da" opacity="0.8"/>
                    <circle cx="200" cy="125" r="12" fill="#0969da" opacity="0.8"/>
                    <circle cx="200" cy="165" r="12" fill="#0969da" opacity="0.8"/>
                    
                    <!-- Output layer -->
                    <circle cx="340" cy="75" r="12" fill="#cf222e" opacity="0.8"/>
                    <circle cx="340" cy="125" r="12" fill="#cf222e" opacity="0.8"/>
                    
                    <!-- Connections -->
                    <g stroke="currentColor" stroke-width="1" opacity="0.4">
                        <line x1="72" y1="50" x2="188" y2="35"/>
                        <line x1="72" y1="50" x2="188" y2="75"/>
                        <line x1="72" y1="100" x2="188" y2="75"/>
                        <line x1="72" y1="100" x2="188" y2="125"/>
                        <line x1="72" y1="150" x2="188" y2="125"/>
                        <line x1="72" y1="150" x2="188" y2="165"/>
                        
                        <line x1="212" y1="35" x2="328" y2="75"/>
                        <line x1="212" y1="75" x2="328" y2="75"/>
                        <line x1="212" y1="125" x2="328" y2="125"/>
                        <line x1="212" y1="165" x2="328" y2="125"/>
                    </g>
                    
                    <!-- Labels -->
                    <text x="60" y="180" text-anchor="middle" font-size="12" fill="currentColor">Input</text>
                    <text x="200" y="180" text-anchor="middle" font-size="12" fill="currentColor">Hidden</text>
                    <text x="340" y="180" text-anchor="middle" font-size="12" fill="currentColor">Output</text>
                </svg>
                <button class="primary-button" onclick="openAcademicDemo()">🎓 Launch Full Academic Demo</button>
            </div>
        </div>
    </div>

    <div class="info">
        <strong>🧠 Neural Network Visualizer (VS Code Extension)</strong><br>
        • Click "Launch Full Academic Demo" for the complete interactive experience<br>
        • Create neural model templates with the Command Palette<br>
        • Powered by Rust/WASM and MaxGraph technology<br>
        • Professional-quality visualization for ML education and research
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function openAcademicDemo() {
            // Send message to extension to open academic demo
            vscode.postMessage({ command: 'openAcademicDemo' });
        }

        function createRandomNetwork() {
            if (DEBUG) {
                console.log('Creating random network...');
            }
            // Future: Add random network generation
            vscode.postMessage({ command: 'createRandomNetwork' });
        }

        function startTraining() {
            if (DEBUG) {
                console.log('Starting training...');
            }
            // Future: Add training visualization
            vscode.postMessage({ command: 'startTraining' });
        }

        function resetNetwork() {
            if (DEBUG) {
                console.log('Resetting network...');
            }
            // Future: Add reset functionality
            vscode.postMessage({ command: 'resetNetwork' });
        }

        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'updateNetwork':
                    if (DEBUG) {
                        console.log('Updating network visualization');
                    }
                    break;
            }
        });
    </script>
</body>
</html>`;
}

function getBasicDemoFallback(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Neural Demo</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            padding: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>🧠 Basic Neural Network Demo</h1>
    <p>Enhanced demo could not be loaded. This is a fallback version.</p>
    <p>The full enhanced demo includes:</p>
    <ul style="text-align: left; max-width: 500px; margin: 0 auto;">
        <li>Interactive draggable neurons</li>
        <li>Real-time training visualization</li>
        <li>Rust/WASM powered computations</li>
        <li>Professional academic-quality animations</li>
    </ul>
</body>
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
