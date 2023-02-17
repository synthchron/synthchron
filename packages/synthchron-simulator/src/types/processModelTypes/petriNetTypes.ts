
type PetriNetProcessModel = {
    type: "petri-net";
    nodes: PetriNetNode[];
    edges: PetriNetEdge[];
}

type PetriNetPlace = {
    type: "place";
    identifier: string;
    name: string;
    accepting: boolean;
    amountOfTokens: number;
}

type PetriNetTransition = {
    type: "transition";
    identifier: string;
    weight: number;
    name: string;
}

type PetriNetNode = PetriNetPlace | PetriNetTransition;

type PetriNetEdge = {
    multiplicity: number;
    source: string;
    target: string;
}
