
export type DcrGraphProcessModel = {
    type: "dcr-graph";
    nodes: DcrGraphNode[];
    edges: DcrGraphEdge[];
}

export type DcrGraphNode = {
    label: string;
    included: boolean;
    pending: boolean;
    executed: boolean;
    weight: number;
}

export type DcrGraphEdge = {
    type: "condition" | "exclude" | "include" | "response" | "milestone" | "no-response" | "spawn" | "precondition" | "logical-inclusion";
    source: string;
    target: string;
}
