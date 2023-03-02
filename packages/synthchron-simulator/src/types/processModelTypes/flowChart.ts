
export interface FlowchartProcessModel {
    type: "flowchart";
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
    initialNode: string;
}

export interface FlowchartNode {
    type: "terminal" | "decision";
    identifier: string;
    name?: string;
}

export interface FlowchartEdge {
    source: string;
    target: string;
    weight: number;
    name?: string;
}
