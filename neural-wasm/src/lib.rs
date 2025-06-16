use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Neuron {
    pub id: usize,
    pub position: Position,
    pub neuron_type: String,
    pub activation: f64,
    pub bias: f64,
    pub color: String,
    pub symbol: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Connection {
    pub id: usize,
    pub from_id: usize,
    pub to_id: usize,
    pub weight: f64,
    pub active: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NetworkState {
    pub neurons: Vec<Neuron>,
    pub connections: Vec<Connection>,
    pub stats: NetworkStats,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct NetworkStats {
    pub total_neurons: usize,
    pub total_connections: usize,
    pub input_neurons: usize,
    pub hidden_neurons: usize,
    pub output_neurons: usize,
    pub average_activation: f64,
}

#[wasm_bindgen]
pub struct NeuralNetwork {
    neurons: HashMap<usize, Neuron>,
    connections: HashMap<usize, Connection>,
    next_neuron_id: usize,
    next_connection_id: usize,
    animation_time: f64,
}

#[wasm_bindgen]
impl NeuralNetwork {
    #[wasm_bindgen(constructor)]
    pub fn new() -> NeuralNetwork {
        console_log!("🦀 Rust Neural Network Engine initialized!");
        
        NeuralNetwork {
            neurons: HashMap::new(),
            connections: HashMap::new(),
            next_neuron_id: 1,
            next_connection_id: 1,
            animation_time: 0.0,
        }
    }

    #[wasm_bindgen]
    pub fn add_neuron(&mut self, x: f64, y: f64, neuron_type: &str) -> usize {
        let id = self.next_neuron_id;
        self.next_neuron_id += 1;

        let (color, symbol) = match neuron_type {
            "input" => ("#4CAF50".to_string(), "I".to_string()),
            "hidden" => ("#2196F3".to_string(), "H".to_string()),
            "output" => ("#FF9800".to_string(), "O".to_string()),
            _ => ("#9E9E9E".to_string(), "?".to_string()),
        };

        let neuron = Neuron {
            id,
            position: Position { x, y },
            neuron_type: neuron_type.to_string(),
            activation: 0.0,
            bias: (js_sys::Math::random() - 0.5) * 2.0,
            color,
            symbol,
        };

        console_log!("🧠 Added {} neuron at ({}, {}) with ID: {}", neuron_type, x, y, id);
        self.neurons.insert(id, neuron);
        id
    }

    #[wasm_bindgen]
    pub fn add_connection(&mut self, from_id: usize, to_id: usize) -> Option<usize> {
        if !self.neurons.contains_key(&from_id) || !self.neurons.contains_key(&to_id) {
            console_log!("⚠️ Cannot connect: neuron {} or {} doesn't exist", from_id, to_id);
            return None;
        }

        let id = self.next_connection_id;
        self.next_connection_id += 1;

        let connection = Connection {
            id,
            from_id,
            to_id,
            weight: (js_sys::Math::random() - 0.5) * 2.0,
            active: false,
        };

        console_log!("🔗 Connected neuron {} to {} with weight: {:.2}", from_id, to_id, connection.weight);
        self.connections.insert(id, connection);
        Some(id)
    }

    #[wasm_bindgen]
    pub fn clear_network(&mut self) {
        self.neurons.clear();
        self.connections.clear();
        self.next_neuron_id = 1;
        self.next_connection_id = 1;
        console_log!("🧹 Network cleared");
    }

    #[wasm_bindgen]
    pub fn create_sample_network(&mut self) {
        self.clear_network();
        
        let input1 = self.add_neuron(100.0, 150.0, "input");
        let input2 = self.add_neuron(100.0, 250.0, "input");
        
        let hidden1 = self.add_neuron(300.0, 100.0, "hidden");
        let hidden2 = self.add_neuron(300.0, 200.0, "hidden");
        let hidden3 = self.add_neuron(300.0, 300.0, "hidden");
        
        let output = self.add_neuron(500.0, 200.0, "output");
        
        self.add_connection(input1, hidden1);
        self.add_connection(input1, hidden2);
        self.add_connection(input2, hidden2);
        self.add_connection(input2, hidden3);
        
        self.add_connection(hidden1, output);
        self.add_connection(hidden2, output);
        self.add_connection(hidden3, output);
        
        console_log!("🎯 Created sample network: 2-3-1 architecture");
    }

    #[wasm_bindgen]
    pub fn animate_step(&mut self, delta_time: f64) {
        self.animation_time += delta_time;
        
        for neuron in self.neurons.values_mut() {
            let base_freq = match neuron.neuron_type.as_str() {
                "input" => 1.0,
                "hidden" => 2.0,
                "output" => 0.5,
                _ => 1.0,
            };
            
            neuron.activation = ((self.animation_time * base_freq + neuron.id as f64).sin() + 1.0) / 2.0;
        }
        
        for connection in self.connections.values_mut() {
            if let (Some(from_neuron), Some(to_neuron)) = 
                (self.neurons.get(&connection.from_id), self.neurons.get(&connection.to_id)) {
                connection.active = from_neuron.activation > 0.5 && to_neuron.activation > 0.3;
            }
        }
    }

    #[wasm_bindgen]
    pub fn get_network_state(&self) -> JsValue {
        let stats = NetworkStats {
            total_neurons: self.neurons.len(),
            total_connections: self.connections.len(),
            input_neurons: self.neurons.values().filter(|n| n.neuron_type == "input").count(),
            hidden_neurons: self.neurons.values().filter(|n| n.neuron_type == "hidden").count(),
            output_neurons: self.neurons.values().filter(|n| n.neuron_type == "output").count(),
            average_activation: if self.neurons.is_empty() { 
                0.0 
            } else { 
                self.neurons.values().map(|n| n.activation).sum::<f64>() / self.neurons.len() as f64 
            },
        };

        let state = NetworkState {
            neurons: self.neurons.values().cloned().collect(),
            connections: self.connections.values().cloned().collect(),
            stats,
        };

        serde_wasm_bindgen::to_value(&state).unwrap()
    }

    #[wasm_bindgen]
    pub fn orbital_dance(&mut self, time: f64) {
        let center_x = 400.0;
        let center_y = 300.0;
        let radius = 200.0;
        let count = self.neurons.len();
        
        for (i, neuron) in self.neurons.values_mut().enumerate() {
            let angle = time * 0.001 + (i as f64 * 2.0 * std::f64::consts::PI / count as f64);
            neuron.position.x = center_x + radius * angle.cos();
            neuron.position.y = center_y + radius * angle.sin();
        }
        
        console_log!("🌌 Orbital dance at time: {:.2}", time);
    }

    #[wasm_bindgen]
    pub fn dump_console_log(&self) -> String {
        let network_state = format!(
            "🦀 Neural Network Console Dump\n\
            =====================================\n\
            Total Neurons: {}\n\
            Total Connections: {}\n\
            Next Neuron ID: {}\n\
            Next Connection ID: {}\n\
            Animation Time: {:.2}\n\n\
            📊 NEURON DETAILS:\n",
            self.neurons.len(),
            self.connections.len(),
            self.next_neuron_id,
            self.next_connection_id,
            self.animation_time
        );

        let mut neurons_info = String::new();
        for neuron in self.neurons.values() {
            neurons_info.push_str(&format!(
                "  🧠 Neuron {} [{}]: pos({:.1}, {:.1}), activation={:.3}, bias={:.3}\n",
                neuron.id,
                neuron.neuron_type,
                neuron.position.x,
                neuron.position.y,
                neuron.activation,
                neuron.bias
            ));
        }

        let mut connections_info = String::new();
        connections_info.push_str("\n🔗 CONNECTION DETAILS:\n");
        for connection in self.connections.values() {
            connections_info.push_str(&format!(
                "  ⚡ Connection {}: {} → {} (weight={:.3}, active={})\n",
                connection.id,
                connection.from_id,
                connection.to_id,
                connection.weight,
                connection.active
            ));
        }

        let timestamp = js_sys::Date::new_0().to_iso_string().as_string().unwrap();
        let footer = format!(
            "\n⏰ Dump generated at: {}\n\
            =====================================\n",
            timestamp
        );

        format!("{}{}{}{}", network_state, neurons_info, connections_info, footer)
    }

    #[wasm_bindgen]
    pub fn save_console_dump_to_file(&self) -> js_sys::Promise {
        let dump_content = self.dump_console_log();
        
        // Return a promise that the JavaScript side can handle
        let promise = js_sys::Promise::new(&mut |resolve, _reject| {
            resolve.call1(&JsValue::NULL, &JsValue::from_str(&dump_content)).unwrap();
        });
        
        console_log!("📁 Console dump prepared for file save");
        promise
    }

    #[wasm_bindgen]
    pub fn predict(&mut self, inputs: Vec<f64>) -> Vec<f64> {
        console_log!("🔮 Starting prediction with {} inputs", inputs.len());
        
        // Get input neuron IDs sorted by ID
        let mut input_ids: Vec<_> = self.neurons.iter()
            .filter(|(_, n)| n.neuron_type == "input")
            .map(|(id, _)| *id)
            .collect();
        input_ids.sort();
        
        // Set input values
        for (i, input_val) in inputs.iter().enumerate() {
            if i < input_ids.len() {
                let neuron_id = input_ids[i];
                if let Some(neuron) = self.neurons.get_mut(&neuron_id) {
                    neuron.activation = *input_val;
                    console_log!("📝 Set input neuron {} to {:.3}", neuron_id, input_val);
                }
            }
        }
        
        // Get hidden neuron IDs sorted by ID
        let mut hidden_ids: Vec<_> = self.neurons.iter()
            .filter(|(_, n)| n.neuron_type == "hidden")
            .map(|(id, _)| *id)
            .collect();
        hidden_ids.sort();
        
        // Forward propagation through hidden layers
        for hidden_id in hidden_ids {
            let bias = self.neurons.get(&hidden_id).unwrap().bias;
            let mut sum = bias;
            
            // Sum weighted inputs from connected neurons
            for connection in self.connections.values() {
                if connection.to_id == hidden_id {
                    if let Some(from_neuron) = self.neurons.get(&connection.from_id) {
                        sum += from_neuron.activation * connection.weight;
                    }
                }
            }
            
            // Apply sigmoid activation
            let activation = 1.0 / (1.0 + (-sum).exp());
            self.neurons.get_mut(&hidden_id).unwrap().activation = activation;
            console_log!("🧠 Hidden neuron {} activated: {:.3}", hidden_id, activation);
        }
        
        // Get output neuron IDs sorted by ID
        let mut output_ids: Vec<_> = self.neurons.iter()
            .filter(|(_, n)| n.neuron_type == "output")
            .map(|(id, _)| *id)
            .collect();
        output_ids.sort();
        
        let mut outputs = Vec::new();
        
        // Calculate outputs
        for output_id in output_ids {
            let bias = self.neurons.get(&output_id).unwrap().bias;
            let mut sum = bias;
            
            // Sum weighted inputs from connected neurons
            for connection in self.connections.values() {
                if connection.to_id == output_id {
                    if let Some(from_neuron) = self.neurons.get(&connection.from_id) {
                        sum += from_neuron.activation * connection.weight;
                    }
                }
            }
            
            // Apply sigmoid activation
            let activation = 1.0 / (1.0 + (-sum).exp());
            self.neurons.get_mut(&output_id).unwrap().activation = activation;
            
            outputs.push(activation);
            console_log!("🎯 Output neuron {} result: {:.3}", output_id, activation);
        }
        
        console_log!("✅ Prediction complete! {} outputs generated", outputs.len());
        outputs
    }
}

#[wasm_bindgen(start)]
pub fn main() {
    console_log!("🦀 Neural Network WASM module loaded!");
}
