// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('✨ MaxGraphVSC extension activated! Sidebar version with rubberbanding! ✨');
	console.log('🔧 Extension Context:', {
		extensionPath: context.extensionPath,
		subscriptions: context.subscriptions.length,
		timestamp: new Date().toISOString()
	});

	// Create persistent output channel for better logging
	const outputChannel = vscode.window.createOutputChannel('MaxGraphVSC Debug');
	outputChannel.appendLine('=== MaxGraphVSC Extension Activation ===');
	outputChannel.appendLine(`✅ Activated at: ${new Date().toISOString()}`);
	outputChannel.appendLine(`📁 Extension Path: ${context.extensionPath}`);
	outputChannel.appendLine('🚀 Ready for neural network visualization!');
	
	// AUTO-OPEN: Automatically open the neural network visualization
	setTimeout(() => {
		console.log('🎯 Auto-opening neural network panel...');
		outputChannel.appendLine('🎯 Auto-opening neural network panel...');
		
		createNeuralNetworkPanel(context);
		vscode.window.showInformationMessage('🎯 SIDEBAR EDITION: Neural Network with MaxGraph-inspired toolbar!');
		
		console.log('✅ Neural network panel opened successfully');
		outputChannel.appendLine('✅ Neural network panel opened successfully');
	}, 1000); // Small delay to ensure extension is fully loaded

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('maxgraphvsc.helloWorldGreeting', () => {
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
	const testCommand = vscode.commands.registerCommand('maxgraphvsc.testExtensionFunctionality', async () => {
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
	const neuralNetCommand = vscode.commands.registerCommand('maxgraphvsc.openNeuralNetworkVisualizationPanel', () => {
		createNeuralNetworkPanel(context);
		vscode.window.showInformationMessage('🧠 Neural Network Visualization panel opened!');
	});

	context.subscriptions.push(neuralNetCommand);
}

// Add neural network visualization functionality
function createNeuralNetworkPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
	console.log('🧠 Creating neural network panel...');
	
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

	console.log('🔧 Panel created, setting up webview content...');
	panel.webview.html = getNeuralNetworkWebviewContent(panel.webview, context.extensionUri);
	
	// Watch for file changes and auto-refresh webview
	const watcher = vscode.workspace.createFileSystemWatcher('**/src/extension.ts');
	watcher.onDidChange(() => {
		console.log('🔄 File change detected, refreshing webview...');
		panel.webview.html = getNeuralNetworkWebviewContent(panel.webview, context.extensionUri);
		console.log('🔄 Neural Network panel auto-refreshed!');
	});
	
	// Clean up watcher when panel is disposed
	panel.onDidDispose(() => {
		console.log('🧹 Neural network panel disposed, cleaning up...');
		watcher.dispose();
	});
	
	console.log('✅ Neural network panel setup complete!');
	return panel;
}

function getNeuralNetworkWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
	const nonce = Math.random().toString(36).substring(2, 15);
	
	// Get paths to WASM files
	const wasmUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'neural-wasm', 'pkg', 'neural_wasm_bg.wasm'));
	const wasmJsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'neural-wasm', 'pkg', 'neural_wasm.js'));
	
	return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
        style-src 'unsafe-inline' ${webview.cspSource}; 
        script-src 'nonce-${nonce}' 'unsafe-eval' ${webview.cspSource}; 
        wasm-src ${webview.cspSource};">
    <title>🦀 Neural Network (WASM)</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            background: var(--vscode-editor-background); 
            color: var(--vscode-editor-foreground); 
            font-family: var(--vscode-font-family);
        }
        .container { display: flex; height: 80vh; gap: 20px; }
        .sidebar { width: 200px; background: var(--vscode-sideBar-background); padding: 15px; border-radius: 8px; }
        .main { flex: 1; background: var(--vscode-editor-background); border: 1px solid var(--vscode-panel-border); border-radius: 8px; }
        .btn { 
            display: block; 
            width: 100%; 
            margin: 5px 0; 
            padding: 8px; 
            background: var(--vscode-button-background); 
            color: var(--vscode-button-foreground); 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
        }
        .btn:hover { background: var(--vscode-button-hoverBackground); }
        .status { 
            margin-top: 20px; 
            padding: 10px; 
            background: var(--vscode-statusBar-background); 
            color: var(--vscode-statusBar-foreground); 
            border-radius: 4px; 
        }
        #output { 
            margin-top: 20px; 
            padding: 15px; 
            background: var(--vscode-textCodeBlock-background); 
            border-radius: 4px; 
            font-family: monospace; 
            white-space: pre-wrap; 
        }
    </style>
</head>
<body>
    <h1>🦀 Neural Network WASM Engine + MaxGraph</h1>
    
    <div class="container">
        <div class="sidebar">
            <h3>🧠 Actions</h3>
            <button class="btn" onclick="createSample()">🎯 Create Sample Network</button>
            <button class="btn" onclick="addRandomNeuron()">➕ Add Random Neuron</button>
            <button class="btn" onclick="clearNetwork()">🧹 Clear Network</button>
            <button class="btn" onclick="startAnimation()">⚡ Start Animation</button>
            <button class="btn" onclick="orbitalDance()">🌌 Orbital Dance</button>
            <button class="btn" onclick="exportNetwork()">💾 Export Network</button>
        </div>
        
        <div class="main" id="graphContainer">
            <div style="padding: 20px; text-align: center;">
                <h3>🔄 Loading WASM Neural Network Engine...</h3>
                <p>Initializing Rust-powered neural network</p>
            </div>
        </div>
    </div>
    
    <div class="status">
        <strong>Status:</strong> <span id="status">Initializing...</span> | 
        <strong>Stats:</strong> <span id="stats">Nodes: 0, Connections: 0</span>
    </div>
    
    <div id="output"></div>

    <script type="module" nonce="${nonce}">
        import init, { NeuralNetwork } from '${wasmJsUri}';
        
        let wasmNetwork = null;
        let animationId = null;
        
        function log(message) {
            const output = document.getElementById('output');
            output.textContent += new Date().toLocaleTimeString() + ': ' + message + '\\n';
            output.scrollTop = output.scrollHeight;
            console.log(message);
        }
        
        async function initWasm() {
            try {
                log('🦀 Initializing WASM module...');
                await init('${wasmUri}');
                
                log('🧠 Creating neural network instance...');
                wasmNetwork = new NeuralNetwork();
                
                document.getElementById('status').textContent = '🚀 WASM Engine Ready!';
                log('✅ Neural Network WASM Engine initialized successfully!');
                
                updateStats();
                
            } catch (error) {
                log('❌ Failed to initialize WASM: ' + error.message);
                document.getElementById('status').textContent = '❌ WASM Failed';
            }
        }
        
        function updateStats() {
            if (!wasmNetwork) return;
            try {
                const state = wasmNetwork.get_network_state();
                document.getElementById('stats').textContent = 
                    \`Nodes: \${state.stats.total_neurons}, Connections: \${state.stats.total_connections}\`;
            } catch (error) {
                log('⚠️ Error updating stats: ' + error.message);
            }
        }
        
        window.createSample = function() {
            if (!wasmNetwork) return;
            try {
                log('🎯 Creating sample network...');
                wasmNetwork.create_sample_network();
                updateStats();
                log('✅ Sample network created!');
            } catch (error) {
                log('❌ Error creating sample: ' + error.message);
            }
        };
        
        window.addRandomNeuron = function() {
            if (!wasmNetwork) return;
            try {
                const types = ['input', 'hidden', 'output'];
                const type = types[Math.floor(Math.random() * types.length)];
                const x = Math.random() * 500 + 50;
                const y = Math.random() * 300 + 50;
                
                const id = wasmNetwork.add_neuron(x, y, type);
                log(\`🧠 Added \${type} neuron at (\${x.toFixed(0)}, \${y.toFixed(0)}) with ID: \${id}\`);
                updateStats();
            } catch (error) {
                log('❌ Error adding neuron: ' + error.message);
            }
        };
        
        window.clearNetwork = function() {
            if (!wasmNetwork) return;
            try {
                log('🧹 Clearing network...');
                wasmNetwork.clear_network();
                updateStats();
                log('✅ Network cleared!');
            } catch (error) {
                log('❌ Error clearing network: ' + error.message);
            }
        };
        
        window.startAnimation = function() {
            if (!wasmNetwork) return;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
                log('⏸️ Animation stopped');
                return;
            }
            
            log('⚡ Starting animation...');
            function animate() {
                try {
                    wasmNetwork.animate_step(16.67);
                    updateStats();
                    animationId = requestAnimationFrame(animate);
                } catch (error) {
                    log('❌ Animation error: ' + error.message);
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
            animate();
        };
        
        window.orbitalDance = function() {
            if (!wasmNetwork) return;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
                log('⏸️ Orbital dance stopped');
                return;
            }
            
            log('🌌 Starting orbital dance...');
            function dance() {
                try {
                    wasmNetwork.orbital_dance(Date.now());
                    updateStats();
                    animationId = requestAnimationFrame(dance);
                } catch (error) {
                    log('❌ Orbital dance error: ' + error.message);
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
            dance();
        };
        
        window.exportNetwork = function() {
            if (!wasmNetwork) return;
            try {
                const state = wasmNetwork.get_network_state();
                const json = JSON.stringify(state, null, 2);
                
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'neural-network-wasm.json';
                a.click();
                URL.revokeObjectURL(url);
                
                log('💾 Network exported to JSON file');
            } catch (error) {
                log('❌ Export error: ' + error.message);
            }
        };
        
        // Initialize on load
        initWasm();
    </script>
</body>
</html>\`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
