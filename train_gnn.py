"""
AtmoGraph - PyTorch GNN Training Script (Week 3 Deliverable)
Trains the SupplyChainGNN model on synthetic disruption propagation scenarios
using Multi-Horizon Mean Squared Error and Binary Cross-Entropy losses.
"""
import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from gnn_model import SupplyChainGNN
def generate_synthetic_training_batch(batch_size: int = 16, num_nodes: int = 64):
    """Generates synthetic supply chain graphs and ground truth delay/risk tensors."""
    feature_batches = []
    adj_batches = []
    target_delays = []
    target_risks = []
    for _ in range(batch_size):
        # Node features: [N, 8]
        X = np.random.uniform(0.05, 0.95, size=(num_nodes, 8)).astype(np.float32)
        # Random disruption shock on 1-3 nodes
        shock_nodes = np.random.choice(num_nodes, size=np.random.randint(1, 4), replace=False)
        X[:, 6] = 0.0 # shock severity
        for sn in shock_nodes:
            X[sn, 6] = np.random.uniform(0.6, 1.0)
        # Adjacency matrix: Directed DAG-like structure with random cross edges
        adj = np.zeros((num_nodes, num_nodes), dtype=np.float32)
        for i in range(num_nodes):
            adj[i, i] = 1.0
            # Connect to downstream nodes
            for j in range(i + 1, min(i + 6, num_nodes)):
                if np.random.rand() > 0.4:
                    adj[j, i] = np.random.uniform(0.4, 0.9) # upstream -> downstream
        # Normalize
        row_sum = np.sum(adj, axis=1, keepdims=True)
        row_sum[row_sum == 0] = 1.0
        adj_norm = adj / row_sum
        # Ground truth physics calculation
        y_delays = np.zeros((num_nodes, 3), dtype=np.float32)
        y_risks = np.zeros((num_nodes, 2), dtype=np.float32)
