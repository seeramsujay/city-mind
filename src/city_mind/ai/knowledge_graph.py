"""CityMind - Causal Knowledge Graph Engine."""

from typing import Dict, List, Set, Any, Optional


class CausalKnowledgeGraph:
    def __init__(self):
        # Graph structure: node_id -> dict of properties
        self.nodes: Dict[str, Dict[str, Any]] = {}
        # Adjacency list: source_node -> list of (target_node, relationship_type, metadata)
        self.edges: Dict[str, List[Dict[str, Any]]] = {}
        self._seed_default_graph()

    def _seed_default_graph(self):
        # Seed core causal nodes & relationships for smart city memory
        causal_triples = [
            ("HeavyRain", "CAUSES", "WaterAccumulation", {"domain": "environment"}),
            ("WaterAccumulation", "LEADS_TO", "DrainageClog", {"domain": "infrastructure"}),
            ("DrainageClog", "EXACERBATES", "FlashFlood", {"domain": "environment"}),
            ("FlashFlood", "TRIGGERS", "TrafficReroute", {"domain": "traffic"}),
            ("TrafficReroute", "INCREASES", "CongestionBottleneck", {"domain": "traffic"}),
            ("CongestionBottleneck", "GENERATES", "CitizenComplaints", {"domain": "citizen"}),
            ("FlashFlood", "REQUIRES", "EmergencyDispatch", {"domain": "emergency"}),
            ("HighGridLoad", "RISKS", "TransformerOverheat", {"domain": "infrastructure"}),
            ("TransformerOverheat", "CAUSES", "PowerOutage", {"domain": "infrastructure"}),
            ("PowerOutage", "DISRUPTS", "TrafficSignals", {"domain": "traffic"}),
        ]

        for source, rel, target, meta in causal_triples:
            self.add_edge(source, rel, target, meta)

    def add_node(self, node_id: str, label: str, node_type: str, properties: Optional[Dict[str, Any]] = None):
        self.nodes[node_id] = {
            "id": node_id,
            "label": label,
            "type": node_type,
            "properties": properties or {}
        }
        if node_id not in self.edges:
            self.edges[node_id] = []

    def add_edge(self, source: str, relationship: str, target: str, metadata: Optional[Dict[str, Any]] = None):
        if source not in self.nodes:
            self.add_node(source, source, "Event")
        if target not in self.nodes:
            self.add_node(target, target, "Outcome")
        
        self.edges[source].append({
            "target": target,
            "relationship": relationship,
            "metadata": metadata or {}
        })

    def find_causal_chain(self, start_node: str, max_depth: int = 3) -> List[List[Dict[str, Any]]]:
        paths = []

        def dfs(current: str, current_path: List[Dict[str, Any]], visited: Set[str], depth: int):
            if depth >= max_depth:
                return
            for edge in self.edges.get(current, []):
                target = edge["target"]
                if target not in visited:
                    new_step = {
                        "from": current,
                        "relationship": edge["relationship"],
                        "to": target,
                        "metadata": edge["metadata"]
                    }
                    new_path = current_path + [new_step]
                    paths.append(new_path)
                    dfs(target, new_path, visited | {target}, depth + 1)

        if start_node in self.nodes:
            dfs(start_node, [], {start_node}, 0)
        return paths

    def get_full_graph(self) -> Dict[str, Any]:
        node_list = list(self.nodes.values())
        edge_list = []
        for src, targets in self.edges.items():
            for t in targets:
                edge_list.append({
                    "source": src,
                    "target": t["target"],
                    "relationship": t["relationship"],
                    "metadata": t["metadata"]
                })
        return {"nodes": node_list, "edges": edge_list}


knowledge_graph = CausalKnowledgeGraph()
