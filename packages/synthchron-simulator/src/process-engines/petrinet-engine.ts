import { ExecuteActivityType, GetEnabledType, IsAcceptingType, ProcessEngine, ResetActivityType } from "../types/general";
import { PetriNetPlace, PetriNetProcessModel, PetriNetTransition } from "../types/processModelTypes/petriNetTypes";

type PetriNetState = Map<string, number>

type ProcessModel = PetriNetProcessModel
type State = PetriNetState
type ActivityIdentifier = string

const isAccepting: IsAcceptingType<ProcessModel, State, ActivityIdentifier> = (model, state) => 
    model.nodes
        // We only care about the places
        .filter((node): node is PetriNetPlace => node.type === "place")
        // Every place that has a token has to be accepting
        .every(place => state.get(place.identifier) || 0 >= 1 === place.accepting)

const getEnabled: GetEnabledType<ProcessModel, State, ActivityIdentifier> = (model, state) => new Set(model.nodes
        // We only care about the transitions
        .filter((node): node is PetriNetTransition => node.type === "transition")
        // Check if the transition is enabled
        .filter(transition => {
            const enabledEdges = model.edges
                // We only care about the edges that have the transition as target
                .filter(edge => edge.target === transition.identifier)
                // We only care about the edges that have enough tokens in the source place
                .filter(edge => state.get(edge.source) || 0 >= edge.multiplicity)
            return enabledEdges.length === model.edges.filter(edge => edge.target === transition.identifier).length
        })
        .map(transition => [transition.identifier, transition.weight]))

const executeActivity: ExecuteActivityType<ProcessModel, State, ActivityIdentifier> = (model, state, activity) => {
    
        const newState = new Map(state)

        // Find activity
        const transition = model.nodes
            .filter((node): node is PetriNetTransition => node.type === "transition")
            .find(node => node.identifier === activity)
    
        // Remove tokens from source places
        model.nodes
            .filter((node): node is PetriNetPlace => node.type === "place") // Only places
            .filter(node => model.edges.some(edge => edge.source === node.identifier && edge.target === activity)) // Only places that are source of the activity
            .forEach(place => {
                const newWeight = (newState.get(place.identifier) || 0) - transition.weight;

                if (newWeight < 0) throw new Error(`Attempted activities ${activity} with not enough tokens in place ${place.identifier}}`)

                newState.set(place.identifier, newWeight)
            }) 

        // Add tokens to target places
        model.nodes
            .filter((node): node is PetriNetPlace => node.type === "place") // Only places
            .filter(node => model.edges.some(edge => edge.target === node.identifier && edge.source === activity)) // Only places that are target of the activity
            .forEach(place => {
                const newWeight = (newState.get(place.identifier) || 0) + transition.weight;
                newState.set(place.identifier, newWeight)
            })

        return newState

}

const resetActivity: ResetActivityType<ProcessModel, State, ActivityIdentifier> = (model) => {
    const newState = new Map<string, number>()
    model.nodes
        .filter((node): node is PetriNetPlace => node.type === "place")
        .forEach(place => newState.set(place.identifier, place.amountOfTokens))
    return newState
}


export const petriNetEngine: ProcessEngine<PetriNetProcessModel, PetriNetState, string> = {

    processModelType: 'petri-net',
    isAccepting: isAccepting,
    getEnabled: getEnabled,
    executeActivity: executeActivity,
    resetActivity: resetActivity

}