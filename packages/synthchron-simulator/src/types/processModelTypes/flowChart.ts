
export type FlowchartProcessModel = {
    type: "flowchart";
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
    initialNode: string;
}

export type FlowchartNode = {
    type: "terminal" | "decision";
    identifier: string;
    name?: string;
}

export type FlowchartEdge = {
    source: string;
    target: string;
    weight: number;
    name?: string;
}
