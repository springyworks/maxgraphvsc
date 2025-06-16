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
	panel.webview.html = getNeuralNetworkWebviewContent();
	
	// Watch for file changes and auto-refresh webview
	const watcher = vscode.workspace.createFileSystemWatcher('**/src/extension.ts');
	watcher.onDidChange(() => {
		console.log('🔄 File change detected, refreshing webview...');
		panel.webview.html = getNeuralNetworkWebviewContent();
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
</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
