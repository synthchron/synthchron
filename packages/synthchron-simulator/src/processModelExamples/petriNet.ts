import { PetriNetProcessModel } from "../types/processModelTypes/petriNetTypes"

export const petriNet1 = (): PetriNetProcessModel => ({
    type: "petri-net",
    nodes: [
        {
            type: "place",
            identifier: "p1",
            name: "p1",
            accepting: false,
            amountOfTokens: 1
        },
        {
            type: "place",
            identifier: "p2",
            name: "p2",
            accepting: true,
            amountOfTokens: 0
        },
        {
            type: "transition",
            identifier: "t1",
            weight: 1,
            name: "t1"
        }
    ],
    edges: [
        {
            multiplicity: 1,
            source: "p1",
            target: "t1"
        },
        {
            multiplicity: 1,
            source: "t1",
            target: "p2"
        }
    ]
})

export const petriNet2 = (): PetriNetProcessModel => ({
    type: "petri-net",
    nodes: [
        {
            type: "place",
            identifier: "p1",
            name: "p1",
            accepting: false,
            amountOfTokens: 1
        },
        {
            type: "place",
            identifier: "p2",
            name: "p2",
            accepting: true,
            amountOfTokens: 0
        },
        {
            type: "place",
            identifier: "p3",
            name: "p3",
            accepting: true,
            amountOfTokens: 0
        },
        {
            type: "transition",
            identifier: "t1",
            weight: 1,
            name: "t1"
        }
    ],
    edges: [
        {
            multiplicity: 1,
            source: "p1",
            target: "t1"
        },
        {
            multiplicity: 1,
            source: "t1",
            target: "p2"
        },
        {
            multiplicity: 1,
            source: "t1",
            target: "p3"
        }
    ]
})


