"""
AtmoGraph - PyTorch Graph Neural Network (GNN) Engine
Spatio-Temporal Graph Neural Network for multi-horizon node delay regression
and multi-hop supply chain ripple effect propagation.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple
class SupplyChainGraphConv(nn.Module):
    """
    Directional Graph Convolution layer with Edge Dependency Weighting
    and Inventory Absorption Gating.
    """
    def __init__(self, in_features: int, out_features: int):
        super(SupplyChainGraphConv, self).__init__()
        self.linear_self = nn.Linear(in_features, out_features)
        self.linear_neigh = nn.Linear(in_features, out_features)
        self.gate = nn.Linear(out_features * 2, out_features)
        self.layer_norm = nn.LayerNorm(out_features)
    def forward(self, x: torch.Tensor, adj_weighted: torch.Tensor) -> torch.Tensor:
        """
        x: [N, in_features] - Node feature matrix
        adj_weighted: [N, N] - Weighted adjacency matrix representing supply dependencies
        """
        # Self transformation [N, out_features]
        h_self = self.linear_self(x)
        
        # Neighbor message aggregation (directed upstream -> downstream ripple)
        # [N, N] @ [N, in_features] -> [N, in_features]
        h_agg = torch.matmul(adj_weighted, x)
        h_neigh = self.linear_neigh(h_agg) # [N, out_features]
        # Gated fusion to model inventory buffering capacity: [N, out_features * 2] -> [N, out_features]
        gate_weights = torch.sigmoid(self.gate(torch.cat([h_self, h_neigh], dim=-1)))
        out = gate_weights * h_neigh + (1.0 - gate_weights) * h_self
        out = self.layer_norm(F.leaky_relu(out, negative_slope=0.1))
        return out
class SupplyChainGNN(nn.Module):
    """
    Complete Multi-Hop Spatio-Temporal GNN for Supply Chain Delay Regression.
