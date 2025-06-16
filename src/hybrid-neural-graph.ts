// MaxGraph Hybrid Neural Network Implementation
// This demonstrates how to use MaxGraph's engine with custom neural rendering

import { Graph, Cell, Point, InternalEvent } from '@maxgraph/core';

export class HybridNeuralGraph {
    private graph: Graph;
    private container: HTMLElement;
    private svgOverlay: SVGElement;
    private neurons: Map<string, NeuralNode> = new Map();
    private wasmModule: any = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.graph = new Graph(container); // Initialize immediately
        this.svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // Initialize immediately
        this.initializeGraph();
        this.createSVGOverlay();
        this.setupEventHandlers();
    }

    private initializeGraph(): void {
        // Initialize MaxGraph with custom configuration
        this.graph = new Graph(this.container);
        
        // Configure graph for neural network use
        this.graph.setPanning(true);
        this.graph.setConnectable(true);
        this.graph.setDropEnabled(true);
        this.graph.setAllowDanglingEdges(false);
        
        // Disable default rendering - we'll use custom SVG
        this.graph.setHtmlLabels(false);
        
        // Set up custom cell renderer
        this.setupCustomRenderer();
    }

    private createSVGOverlay(): void {
        // Create SVG overlay for custom neural rendering
        this.svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgOverlay.style.position = 'absolute';
        this.svgOverlay.style.top = '0';
        this.svgOverlay.style.left = '0';
        this.svgOverlay.style.width = '100%';
        this.svgOverlay.style.height = '100%';
        this.svgOverlay.style.pointerEvents = 'none'; // Let MaxGraph handle events
        this.svgOverlay.style.zIndex = '10';
        
        this.container.appendChild(this.svgOverlay);
    }

    private setupCustomRenderer(): void {
        // Override MaxGraph's cell rendering to use our custom SVG
        // Using type assertion due to MaxGraph API evolution
        const originalDrawCell = (this.graph.view as any).drawCell;
        
        (this.graph.view as any).drawCell = (state: any) => {
            // Don't draw the default cell, we'll handle it in SVG
            if (this.isNeuralCell(state.cell)) {
                this.renderNeuralCell(state);
                return null;
            }
            return originalDrawCell.call(this.graph.view, state);
        };
    }

    private setupEventHandlers(): void {
        // Handle MaxGraph events and sync with our neural visualization
        
        // Cell moved event
        this.graph.addListener(InternalEvent.CELLS_MOVED, (sender, evt) => {
            const cells = evt.getProperty('cells');
            cells.forEach((cell: Cell) => {
                if (this.isNeuralCell(cell)) {
                    this.updateNeuralCellPosition(cell);
                }
            });
        });

        // Cell added event
        this.graph.addListener(InternalEvent.CELLS_ADDED, (sender, evt) => {
            const cells = evt.getProperty('cells');
            cells.forEach((cell: Cell) => {
                if (this.isNeuralCell(cell)) {
                    this.createNeuralCell(cell);
                }
            });
        });

        // Connection created event
        this.graph.addListener(InternalEvent.CELLS_ADDED, (sender, evt) => {
            const cells = evt.getProperty('cells');
            cells.forEach((cell: Cell) => {
                if (cell.isEdge()) {
                    this.createNeuralConnection(cell);
                }
            });
        });
    }

    // Public API for neural network operations
    public addNeuron(type: 'input' | 'hidden' | 'output', x: number, y: number, label: string): string {
        const parent = this.graph.getDefaultParent();
        
        // Create MaxGraph vertex (invisible, for structure)
        const vertex = this.graph.insertVertex({
            parent,
            position: [x, y],
            size: [50, 50],
            value: label,
            style: {
                opacity: 0, // Make MaxGraph cell invisible
                fillColor: 'none',
                strokeColor: 'none'
            }
        });

        // Store neural-specific data
        vertex.setData('neuralType', type);
        vertex.setData('activation', 0);
        vertex.setData('bias', Math.random() - 0.5);

        return vertex.getId();
    }

    public addConnection(sourceId: string, targetId: string, weight: number = Math.random()): string {
        const source = this.graph.getModel().getCell(sourceId);
        const target = this.graph.getModel().getCell(targetId);
        
        if (!source || !target) {
            throw new Error('Source or target neuron not found');
        }

        const parent = this.graph.getDefaultParent();
        const edge = this.graph.insertEdge({
            parent,
            source,
            target,
            value: weight.toFixed(3),
            style: {
                opacity: 0, // Make MaxGraph edge invisible
                strokeColor: 'none'
            }
        });

        edge.setData('weight', weight);
        edge.setData('gradient', 0);

        return edge.getId();
    }

    public runLayout(algorithm: 'hierarchical' | 'circular' | 'organic' = 'hierarchical'): void {
        // Use MaxGraph's built-in layout algorithms
        const { HierarchicalLayout, CircleLayout, FastOrganicLayout } = require('@maxgraph/core');
        
        let layout;
        switch (algorithm) {
            case 'hierarchical':
                layout = new HierarchicalLayout(this.graph);
                break;
            case 'circular':
                layout = new CircleLayout(this.graph);
                break;
            case 'organic':
                layout = new FastOrganicLayout(this.graph);
                break;
        }
        
        layout.execute(this.graph.getDefaultParent());
        
        // Update our SVG rendering after layout
        this.refreshSVGRendering();
    }

    // Custom rendering methods
    private isNeuralCell(cell: Cell): boolean {
        return cell.isVertex() && cell.getData('neuralType') !== undefined;
    }

    private renderNeuralCell(state: any): void {
        const cell = state.cell;
        const type = cell.getData('neuralType');
        const activation = cell.getData('activation') || 0;
        const bounds = state.shape?.bounds || state;

        // Create neural-specific SVG representation
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `neural-${cell.getId()}`);

        // Neuron circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', (bounds.x + bounds.width / 2).toString());
        circle.setAttribute('cy', (bounds.y + bounds.height / 2).toString());
        circle.setAttribute('r', '25');
        
        // Color based on type and activation
        const colors = {
            input: '#2196F3',
            hidden: '#4CAF50',
            output: '#FF5722'
        };
        circle.setAttribute('fill', colors[type]);
        circle.setAttribute('opacity', (0.7 + activation * 0.3).toString());
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', '2');

        // Activation value text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (bounds.x + bounds.width / 2).toString());
        text.setAttribute('y', (bounds.y + bounds.height / 2).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.textContent = activation.toFixed(2);

        group.appendChild(circle);
        group.appendChild(text);
        this.svgOverlay.appendChild(group);
    }

    private createNeuralCell(cell: Cell): void {
        const neuron: NeuralNode = {
            id: cell.getId(),
            type: cell.getData('neuralType'),
            activation: cell.getData('activation') || 0,
            bias: cell.getData('bias') || 0,
            position: new Point(cell.getGeometry()?.x || 0, cell.getGeometry()?.y || 0)
        };
        
        this.neurons.set(cell.getId(), neuron);
    }

    private createNeuralConnection(cell: Cell): void {
        const source = cell.getSource();
        const target = cell.getTarget();
        const weight = cell.getData('weight') || 0;

        // Render custom connection line
        this.renderConnectionLine(source, target, weight);
    }

    private renderConnectionLine(source: Cell, target: Cell, weight: number): void {
        const sourceGeom = source.getGeometry();
        const targetGeom = target.getGeometry();
        
        if (!sourceGeom || !targetGeom) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (sourceGeom.x + sourceGeom.width / 2).toString());
        line.setAttribute('y1', (sourceGeom.y + sourceGeom.height / 2).toString());
        line.setAttribute('x2', (targetGeom.x + targetGeom.width / 2).toString());
        line.setAttribute('y2', (targetGeom.y + targetGeom.height / 2).toString());
        
        // Weight-based styling
        const opacity = Math.abs(weight);
        const color = weight > 0 ? '#4CAF50' : '#F44336';
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', (Math.abs(weight) * 5).toString());
        line.setAttribute('opacity', opacity.toString());

        this.svgOverlay.appendChild(line);
    }

    private updateNeuralCellPosition(cell: Cell): void {
        const neuron = this.neurons.get(cell.getId());
        if (neuron) {
            const geom = cell.getGeometry();
            if (geom) {
                neuron.position = new Point(geom.x, geom.y);
                this.refreshSVGRendering();
            }
        }
    }

    private refreshSVGRendering(): void {
        // Clear and re-render all SVG elements
        this.svgOverlay.innerHTML = '';
        
        // Re-render all neurons and connections
        this.graph.getModel().getChildCells(this.graph.getDefaultParent(), true, false)
            .forEach(cell => {
                if (this.isNeuralCell(cell)) {
                    this.renderNeuralCell({ cell });
                }
            });
        
        this.graph.getModel().getChildCells(this.graph.getDefaultParent(), false, true)
            .forEach(cell => {
                if (cell.isEdge()) {
                    this.createNeuralConnection(cell);
                }
            });
    }

    // WASM Integration
    public async loadWASMModule(wasmPath: string): Promise<void> {
        try {
            // Load the WASM module
            const wasmModule = await import(wasmPath);
            await wasmModule.default();
            this.wasmModule = wasmModule;
            
            console.log('WASM neural engine loaded successfully');
        } catch (error) {
            console.error('Failed to load WASM module:', error);
        }
    }

    public syncToWASM(): void {
        if (!this.wasmModule) {
            throw new Error('WASM module not loaded');
        }

        // Convert MaxGraph structure to WASM-compatible format
        const neurons = Array.from(this.neurons.values());
        const connections = this.graph.getModel()
            .getChildCells(this.graph.getDefaultParent(), false, true)
            .map(edge => ({
                source: edge.getSource()?.getId(),
                target: edge.getTarget()?.getId(),
                weight: edge.getData('weight') || 0
            }));

        // Send to WASM
        this.wasmModule.update_network(neurons, connections);
    }

    public runForwardPass(inputs: number[]): number[] {
        if (!this.wasmModule) {
            throw new Error('WASM module not loaded');
        }

        const outputs = this.wasmModule.forward_pass(inputs);
        
        // Update visual activations
        this.updateActivationDisplay();
        
        return outputs;
    }

    private updateActivationDisplay(): void {
        // Get activations from WASM and update SVG
        if (this.wasmModule) {
            const activations = this.wasmModule.get_activations();
            activations.forEach((activation: number, index: number) => {
                const neuronId = Array.from(this.neurons.keys())[index];
                const neuron = this.neurons.get(neuronId);
                if (neuron) {
                    neuron.activation = activation;
                }
            });
            
            this.refreshSVGRendering();
        }
    }

    // Utility methods
    public exportToJSON(): string {
        return JSON.stringify({
            neurons: Array.from(this.neurons.values()),
            connections: this.graph.getModel()
                .getChildCells(this.graph.getDefaultParent(), false, true)
                .map(edge => ({
                    id: edge.getId(),
                    source: edge.getSource()?.getId(),
                    target: edge.getTarget()?.getId(),
                    weight: edge.getData('weight')
                }))
        }, null, 2);
    }

    public importFromJSON(json: string): void {
        const data = JSON.parse(json);
        
        // Clear existing graph
        this.graph.removeCells(this.graph.getChildCells(this.graph.getDefaultParent()));
        this.neurons.clear();
        
        // Recreate neurons
        data.neurons.forEach((neuron: any) => {
            this.addNeuron(neuron.type, neuron.position.x, neuron.position.y, neuron.id);
        });
        
        // Recreate connections
        data.connections.forEach((conn: any) => {
            this.addConnection(conn.source, conn.target, conn.weight);
        });
    }
}

// Supporting interfaces
interface NeuralNode {
    id: string;
    type: 'input' | 'hidden' | 'output';
    activation: number;
    bias: number;
    position: Point;
}

// Usage example:
/*
const container = document.getElementById('neural-graph-container');
const neuralGraph = new HybridNeuralGraph(container);

// Load WASM module
await neuralGraph.loadWASMModule('./neural-wasm/pkg/neural_wasm.js');

// Add neurons
const input1 = neuralGraph.addNeuron('input', 100, 100, 'Input 1');
const input2 = neuralGraph.addNeuron('input', 100, 200, 'Input 2');
const hidden1 = neuralGraph.addNeuron('hidden', 300, 150, 'Hidden 1');
const output1 = neuralGraph.addNeuron('output', 500, 150, 'Output');

// Add connections
neuralGraph.addConnection(input1, hidden1, 0.8);
neuralGraph.addConnection(input2, hidden1, 0.6);
neuralGraph.addConnection(hidden1, output1, 0.9);

// Apply layout
neuralGraph.runLayout('hierarchical');

// Sync with WASM and run computation
neuralGraph.syncToWASM();
const results = neuralGraph.runForwardPass([0.5, 0.3]);
console.log('Network output:', results);
*/
