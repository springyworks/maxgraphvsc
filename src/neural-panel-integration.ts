/**
 * Integration of Hybrid Neural Graph into VS Code Extension
 * This shows how to integrate the hybrid approach into your existing extension
 */

import * as vscode from 'vscode';
import { HybridNeuralNetworkDemo } from './hybrid-neural-demo';

export class NeuralNetworkPanel {
    public static currentPanel: NeuralNetworkPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private neuralNetwork: HybridNeuralNetworkDemo | undefined;

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (NeuralNetworkPanel.currentPanel) {
            NeuralNetworkPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'neuralNetworkVisualizer',
            'Neural Network Visualizer',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'dist'),
                    vscode.Uri.joinPath(extensionUri, 'neural-wasm', 'pkg')
                ]
            }
        );

        NeuralNetworkPanel.currentPanel = new NeuralNetworkPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._update(extensionUri);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(
            message => this._handleMessage(message),
            null,
            this._disposables
        );
    }

    private _handleMessage(message: any) {
        switch (message.type) {
            case 'neuralNetworkReady':
                this._initializeNeuralNetwork();
                break;
            case 'addNeuron':
                this._addNeuron(message.neuronType, message.label);
                break;
            case 'addConnection':
                this._addConnection(message.source, message.target, message.weight);
                break;
            case 'runLayout':
                this._runLayout();
                break;
            case 'runForwardPass':
                this._runForwardPass(message.inputs);
                break;
            case 'exportNetwork':
                this._exportNetwork();
                break;
            default:
                console.warn('Unknown message type:', message.type);
        }
    }

    private _initializeNeuralNetwork() {
        // This would be called from the webview once the DOM is ready
        this._panel.webview.postMessage({
            type: 'loadWASM',
            wasmPath: './neural-wasm/pkg/neural_wasm.js'
        });
    }

    private _addNeuron(type: string, label: string) {
        this._panel.webview.postMessage({
            type: 'addNeuronToGraph',
            neuronType: type,
            label: label
        });
    }

    private _addConnection(source: string, target: string, weight: number) {
        this._panel.webview.postMessage({
            type: 'addConnectionToGraph',
            source: source,
            target: target,
            weight: weight
        });
    }

    private _runLayout() {
        this._panel.webview.postMessage({
            type: 'runAutoLayout'
        });
    }

    private _runForwardPass(inputs: number[]) {
        this._panel.webview.postMessage({
            type: 'executeForwardPass',
            inputs: inputs
        });
    }

    private _exportNetwork() {
        this._panel.webview.postMessage({
            type: 'exportNetworkStructure'
        });
    }

    private _update(extensionUri: vscode.Uri) {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview, extensionUri);
    }

    private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri) {
        // Get paths to resources
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'dist', 'webview.js')
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'dist', 'webview.css')
        );
        const wasmUri = webview.asWebviewUri(
            vscode.Uri.joinPath(extensionUri, 'neural-wasm', 'pkg')
        );

        // Generate nonce for security
        const nonce = this._getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
        style-src ${webview.cspSource} 'unsafe-inline'; 
        script-src 'nonce-${nonce}' ${webview.cspSource}; 
        wasm-src ${webview.cspSource};">
    <link href="${styleUri}" rel="stylesheet">
    <title>Neural Network Visualizer</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .toolbar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            padding: 10px;
            background: var(--vscode-panel-background);
            border-radius: 5px;
            border: 1px solid var(--vscode-panel-border);
        }
        .toolbar button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
        }
        .toolbar button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .toolbar select {
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            border: 1px solid var(--vscode-dropdown-border);
            padding: 6px;
            border-radius: 3px;
        }
        .graph-container {
            width: 100%;
            height: 600px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
            position: relative;
            overflow: hidden;
        }
        .status-bar {
            margin-top: 10px;
            padding: 10px;
            background: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-foreground);
            border-radius: 3px;
            font-size: 12px;
        }
        .neural-controls {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .control-group label {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 Hybrid Neural Network Visualizer</h1>
        <p>MaxGraph Engine + Custom SVG Rendering + Rust/WASM Backend</p>
        
        <div class="toolbar">
            <div class="neural-controls">
                <div class="control-group">
                    <label>Neuron Type:</label>
                    <select id="neuronType">
                        <option value="input">Input</option>
                        <option value="hidden">Hidden</option>
                        <option value="output">Output</option>
                    </select>
                </div>
                <button onclick="addNeuron()">Add Neuron</button>
                <button onclick="addConnection()">Add Connection</button>
                <button onclick="runAutoLayout()">Auto Layout</button>
                <button onclick="runForwardPass()">Forward Pass</button>
                <button onclick="exportNetwork()">Export</button>
            </div>
        </div>

        <div id="neuralGraphContainer" class="graph-container">
            <!-- Hybrid neural graph will be rendered here -->
        </div>

        <div id="statusBar" class="status-bar">
            Ready - WASM: Not loaded, Neurons: 0, Connections: 0
        </div>
    </div>

    <script nonce="${nonce}" src="${scriptUri}"></script>
    <script nonce="${nonce}">
        // Initialize the hybrid neural network system
        let hybridNeuralNet = null;
        let wasmLoaded = false;
        let neuronCount = 0;
        let connectionCount = 0;

        // VS Code API for communication with extension
        const vscode = acquireVsCodeApi();

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('neuralGraphContainer');
            
            // Create the hybrid neural network instance
            hybridNeuralNet = new HybridNeuralNetworkDemo(container);
            
            // Notify extension that we're ready
            vscode.postMessage({ type: 'neuralNetworkReady' });
            
            updateStatus();
        });

        // Control functions
        function addNeuron() {
            const type = document.getElementById('neuronType').value;
            const label = prompt('Enter neuron label:', \`\${type.charAt(0).toUpperCase() + type.slice(1)} \${neuronCount + 1}\`);
            
            if (label && hybridNeuralNet) {
                const neuronId = hybridNeuralNet.addNeuron(type, label);
                neuronCount++;
                updateStatus();
                
                // Notify extension
                vscode.postMessage({ 
                    type: 'addNeuron', 
                    neuronType: type, 
                    label: label 
                });
            }
        }

        function addConnection() {
            const sourceId = prompt('Enter source neuron ID:');
            const targetId = prompt('Enter target neuron ID:');
            const weight = parseFloat(prompt('Enter connection weight (-1 to 1):', '0.5') || '0.5');
            
            if (sourceId && targetId && hybridNeuralNet) {
                try {
                    hybridNeuralNet.addConnection(sourceId, targetId, weight);
                    connectionCount++;
                    updateStatus();
                    
                    // Notify extension
                    vscode.postMessage({ 
                        type: 'addConnection', 
                        source: sourceId, 
                        target: targetId, 
                        weight: weight 
                    });
                } catch (error) {
                    alert('Error adding connection: ' + error.message);
                }
            }
        }

        function runAutoLayout() {
            if (hybridNeuralNet) {
                hybridNeuralNet.runAutoLayout();
                
                // Notify extension
                vscode.postMessage({ type: 'runLayout' });
            }
        }

        async function runForwardPass() {
            if (!wasmLoaded) {
                alert('WASM module not loaded. Click "Load WASM" first.');
                return;
            }
            
            const inputsStr = prompt('Enter input values (comma-separated):', '0.5,0.3');
            if (inputsStr && hybridNeuralNet) {
                const inputs = inputsStr.split(',').map(x => parseFloat(x.trim()));
                
                try {
                    const outputs = hybridNeuralNet.runForwardPass(inputs);
                    alert(\`Forward pass complete!\\nInputs: [\${inputs.join(', ')}]\\nOutputs: [\${outputs.join(', ')}]\`);
                    
                    // Notify extension
                    vscode.postMessage({ 
                        type: 'runForwardPass', 
                        inputs: inputs 
                    });
                } catch (error) {
                    alert('Error running forward pass: ' + error.message);
                }
            }
        }

        function exportNetwork() {
            if (hybridNeuralNet) {
                const networkJSON = hybridNeuralNet.exportNetwork();
                console.log('Network JSON:', networkJSON);
                
                // Copy to clipboard
                navigator.clipboard.writeText(networkJSON).then(() => {
                    alert('Network structure copied to clipboard!');
                });
                
                // Notify extension
                vscode.postMessage({ type: 'exportNetwork' });
            }
        }

        function updateStatus() {
            const statusBar = document.getElementById('statusBar');
            const wasmStatus = wasmLoaded ? 'Loaded ✅' : 'Not loaded ❌';
            statusBar.textContent = \`Ready - WASM: \${wasmStatus}, Neurons: \${neuronCount}, Connections: \${connectionCount}\`;
        }

        // Handle messages from VS Code extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'loadWASM':
                    loadWASMModule(message.wasmPath);
                    break;
                case 'addNeuronToGraph':
                    // Handle neuron addition from extension
                    break;
                case 'addConnectionToGraph':
                    // Handle connection addition from extension
                    break;
                case 'runAutoLayout':
                    runAutoLayout();
                    break;
                case 'executeForwardPass':
                    // Handle forward pass execution
                    break;
                case 'exportNetworkStructure':
                    exportNetwork();
                    break;
            }
        });

        async function loadWASMModule(wasmPath) {
            try {
                if (hybridNeuralNet) {
                    await hybridNeuralNet.loadWASMModule(wasmPath);
                    wasmLoaded = true;
                    updateStatus();
                    
                    // Sync initial network structure
                    hybridNeuralNet.syncToWASM();
                }
            } catch (error) {
                console.error('Failed to load WASM:', error);
                alert('Failed to load WASM module: ' + error.message);
            }
        }

        // Load WASM module automatically
        setTimeout(() => {
            loadWASMModule('${wasmUri}/neural_wasm.js');
        }, 1000);
    </script>
</body>
</html>`;
    }

    private _getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public dispose() {
        NeuralNetworkPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

// Command registration function to be called from extension.ts
export function registerNeuralNetworkCommands(context: vscode.ExtensionContext) {
    // Register the main command
    const showNeuralNetworkCommand = vscode.commands.registerCommand(
        'maxgraphvsc.showNeuralNetwork',
        () => {
            NeuralNetworkPanel.createOrShow(context.extensionUri);
        }
    );

    // Register additional commands for neural network operations
    const addNeuronCommand = vscode.commands.registerCommand(
        'maxgraphvsc.addNeuron',
        async () => {
            const neuronType = await vscode.window.showQuickPick(
                ['input', 'hidden', 'output'],
                { placeHolder: 'Select neuron type' }
            );
            
            if (neuronType) {
                const label = await vscode.window.showInputBox({
                    prompt: 'Enter neuron label',
                    value: `${neuronType.charAt(0).toUpperCase() + neuronType.slice(1)} Neuron`
                });
                
                if (label && NeuralNetworkPanel.currentPanel) {
                    // Use public method instead of private _handleMessage
                    const panel = NeuralNetworkPanel.currentPanel as any;
                    panel._handleMessage({
                        type: 'addNeuron',
                        neuronType: neuronType,
                        label: label
                    });
                }
            }
        }
    );

    const runLayoutCommand = vscode.commands.registerCommand(
        'maxgraphvsc.runNeuralLayout',
        () => {
            if (NeuralNetworkPanel.currentPanel) {
                // Use type assertion to access private method
                const panel = NeuralNetworkPanel.currentPanel as any;
                panel._handleMessage({
                    type: 'runLayout'
                });
            } else {
                vscode.window.showWarningMessage('Neural Network Visualizer is not open.');
            }
        }
    );

    context.subscriptions.push(
        showNeuralNetworkCommand,
        addNeuronCommand,
        runLayoutCommand
    );

    // Register keyboard shortcuts and context menu items
    vscode.commands.executeCommand('setContext', 'maxgraphvsc.neuralNetworkEnabled', true);
}

// Command registration and panel management for neural network visualization
