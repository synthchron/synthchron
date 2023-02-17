
type FlowChartProcessModel = {
    type: "flowchart";
    nodes: FlowChartNode[];
    edges: FlowChartEdge[];
    initialNode: string;
}

type FlowChartNode = {
    type: "terminal" | "decision";
    identifier: string;
    name?: string;
}

type FlowChartEdge = {
    source: string;
    target: string;
    weight: number;
    name?: string;
}
