import { PetriNetProcessModel } from "../types/processModelTypes/petriNetTypes"

// This petri net should simulate as follows:
// ["t1"]
export const petriNet1: PetriNetProcessModel = ({
    type: "petri-net",
    nodes: [
        {
            type: "place",
            identifier: "p1",
            name: "p1",
            accepting: (numOfTokens: number) => (numOfTokens >= 1),
            amountOfTokens: 2
        },
        {
            type: "place",
            identifier: "p2",
            name: "p2",
            accepting: (numOfTokens: number) => (numOfTokens >= 1),
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

// This petri Net should simulate as follows:
// ["t1"]
export const petriNet2: PetriNetProcessModel = ({
    type: "petri-net",
    nodes: [
        {
            type: "place",
            identifier: "p1",
            name: "p1",
            accepting: (numOfTokens: number) => (numOfTokens >= 1),
            amountOfTokens: 2
        },
        {
            type: "place",
            identifier: "p2",
            name: "p2",
            accepting: (numOfTokens: number) => (numOfTokens >= 1),
            amountOfTokens: 0
        },
        {
            type: "place",
            identifier: "p3",
            name: "p3",
            accepting: (numOfTokens: number) => (numOfTokens >= 1),
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

export const petriNet3: PetriNetProcessModel = ({
    type: "petri-net",
    nodes: [
        {
            type: "place",
            identifier: "p1",
            name: "p1",
            accepting: (numOfTokens: number) => ((numOfTokens & 1) === 0), // isEven
            amountOfTokens: 2
        },
        {
            type: "place",
            identifier: "p2",
            name: "p2",
            accepting: (numOfTokens: number) => ((numOfTokens & 1) === 1), // isOdd
            amountOfTokens: 1
        },
        {
            type: "transition",
            identifier: "t1",
            weight: 1,
            name: "t1"
        }]
    ,
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


