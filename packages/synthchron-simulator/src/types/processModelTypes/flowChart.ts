
type FlowchartProcessModel = {
    type: "flowchart";
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
    initialNode: string;
}

type FlowchartNode = {
    type: "terminal" | "decision";
    identifier: string;
    name?: string;
}

type FlowchartEdge = {
    source: string;
    target: string;
    weight: number;
    name?: string;
}
