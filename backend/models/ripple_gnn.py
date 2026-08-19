# backend/models/ripple_gnn.py

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
from torch_geometric.data import Data
import pandas as pd

# -----------------------------
# Graph Neural Network Model
# -----------------------------
class RippleGCN(nn.Module):
    def __init__(self, num_node_features, hidden_channels, num_classes):
        super(RippleGCN, self).__init__()
        self.conv1 = GCNConv(num_node_features, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, num_classes)

    def forward(self, x, edge_index):
        # First GCN layer
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        # Second GCN layer
        x = self.conv2(x, edge_index)
        return F.log_softmax(x, dim=1)

# -----------------------------
# Dataset Loader
# -----------------------------
def load_ripple_dataset(csv_path):
    """
    Load synthetic ripple dataset from CSV.
    Expected columns: node_id, feature1, feature2, ..., label
    """
    df = pd.read_csv(csv_path)

    # Features (all numeric columns except node_id and label)
    feature_cols = [c for c in df.columns if c not in ["node_id", "label"]]
    x = torch.tensor(df[feature_cols].values, dtype=torch.float)

    # Labels
    y = torch.tensor(df["label"].values, dtype=torch.long)

    # Example edge_index (for demo, connect sequential nodes)
    # In practice, build from Neo4j graph export
    edge_index = torch.tensor(
        [[i for i in range(len(df)-1)], [i+1 for i in range(len(df)-1)]],
        dtype=torch.long
    )

    data = Data(x=x, edge_index=edge_index, y=y)
    return data

# -----------------------------
# Training Function
# -----------------------------
def train_model(data, num_features, num_classes, epochs=50):
    model = RippleGCN(num_node_features=num_features,
                      hidden_channels=16,
                      num_classes=num_classes)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=5e-4)

    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        out = model(data.x, data.edge_index)
        loss = F.nll_loss(out, data.y)
        loss.backward()
        optimizer.step()
        if epoch % 10 == 0:
            print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

    return model
