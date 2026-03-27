export class DirectedGraph {
  private readonly adjacency = new Map<string, Set<string>>();
  private readonly inDegree = new Map<string, number>();

  addNode(nodeId: string): void {
    if (!this.adjacency.has(nodeId)) {
      this.adjacency.set(nodeId, new Set<string>());
      this.inDegree.set(nodeId, this.inDegree.get(nodeId) ?? 0);
    }
  }

  addEdge(from: string, to: string): void {
    this.addNode(from);
    this.addNode(to);
    const neighbors = this.adjacency.get(from)!;
    if (neighbors.has(to)) {
      return;
    }
    neighbors.add(to);
    this.inDegree.set(to, (this.inDegree.get(to) ?? 0) + 1);
  }

  neighbors(nodeId: string): string[] {
    return Array.from(this.adjacency.get(nodeId) ?? []);
  }

  inDegreeMap(): Map<string, number> {
    return new Map(this.inDegree);
  }

  nodes(): string[] {
    return Array.from(this.adjacency.keys());
  }

  edgesCount(): number {
    let total = 0;
    this.adjacency.forEach((s) => (total += s.size));
    return total;
  }
}
