
export type PetriNetProcessModel = {
    type: "petri-net";
    nodes: PetriNetNode[];
    edges: PetriNetEdge[];
}

export type PetriNetPlace = {
    type: "place";
    identifier: string;
    name: string;
    accepting: boolean;
    amountOfTokens: number;
}

export type PetriNetTransition = {
    type: "transition";
    identifier: string;
    weight: number;
    name: string;
}

export type PetriNetNode = PetriNetPlace | PetriNetTransition;

export type PetriNetEdge = {
    multiplicity: number;
    source: string;
    target: string;
}
