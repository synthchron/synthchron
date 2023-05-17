import { compileExpression } from 'filtrex'

import { ProcessModelType } from '../types/processModelTypes'
import {
  PetriNetPlace,
  PetriNetProcessModel,
  PetriNetTransition,
} from '../types/processModelTypes/petriNetTypes'
import {
  ExecuteActivityType,
  GetEnabledType,
  IsAcceptingType,
  ProcessEngine,
  ResetActivityType,
} from '../types/simulationTypes'

type PetriNetState = Map<string, [string, number]> //ID, Label, weight

type ProcessModel = PetriNetProcessModel
type State = PetriNetState
type ActivityIdentifier = string

const isAccepting: IsAcceptingType<ProcessModel, State, ActivityIdentifier> = (
  model,
  state
) => {
  const errorStore: string[] = []

  const reason = model.acceptingExpressions.find(({ expression }) => {
    const exp = compileExpression(expression)
    const resultReason = exp(
      Object.fromEntries(
        Array.from(state.entries()).map(([_key, [name, value]]) => [
          `${name}`,
          value,
        ])
      )
    )
    if (resultReason.toString().startsWith('ReferenceError:')) {
      errorStore.push(resultReason.toString())
    } else {
      return resultReason
    }
  })

  if (errorStore.length !== 0) {
    throw errorStore
  }

  if (reason === undefined) {
    return { isAccepting: false }
  }
  return { isAccepting: true, reason: reason.name }
}

const getEnabled: GetEnabledType<ProcessModel, State, ActivityIdentifier> = (
  model,
  state
) =>
  new Set(
    model.nodes
      // We only care about the transitions
      .filter((node): node is PetriNetTransition => node.type === 'transition')
      // Check if the transition is enabled
      .filter((transition) => {
        const enabledEdges = model.edges
          // We only care about the edges that have the transition as target
          .filter((edge) => edge.target === transition.identifier)
          // We only care about the edges that have enough tokens in the source place
          .filter(
            (edge) => (state.get(edge.source)[1] || 0) >= edge.multiplicity
            //[1] gets the value of the node
          )
        return (
          enabledEdges.length ===
          model.edges.filter((edge) => edge.target === transition.identifier)
            .length
        )
      })
      .map((transition) => [
        transition.identifier,
        transition.name,
        transition.weight,
      ])
  )

const executeActivity: ExecuteActivityType<
  ProcessModel,
  State,
  ActivityIdentifier
> = (model, state, activity) => {
  const newState = new Map(state)

  // Find activity
  const transition = model.nodes
    .filter((node): node is PetriNetTransition => node.type === 'transition')
    .find((node) => node.identifier === activity)

  if (transition == undefined) {
    throw new Error('No such transition')
  }

  // Remove tokens from source places
  model.nodes
    .filter((node): node is PetriNetPlace => node.type === 'place') // Only places
    .filter((node) =>
      model.edges.some(
        (edge) => edge.source === node.identifier && edge.target === activity
      )
    ) // Only places that are source of the activity
    .forEach((place) => {
      const newWeight =
        //[1] gets the value of the node
        (newState.get(place.identifier)[1] || 0) -
        model.edges.filter(
          (edge) => edge.source === place.identifier && edge.target === activity
        )[0].multiplicity

      if (newWeight < 0)
        throw new Error(
          `Attempted activities ${activity} with not enough tokens in place ${place.identifier}}`
        )

      newState.set(place.identifier, [place.name, newWeight])
    })

  // Add tokens to target places
  model.nodes
    .filter((node): node is PetriNetPlace => node.type === 'place') // Only places
    .filter((node) =>
      model.edges.some(
        (edge) => edge.target === node.identifier && edge.source === activity
      )
    ) // Only places that are target of the activity
    .forEach((place) => {
      const edgeMultiplicity = model.edges.filter(
        (edge) => edge.target === place.identifier && edge.source === activity
      )[0].multiplicity
      const newWeight =
        //[1] gets the value of the node
        (newState.get(place.identifier)[1] || 0) + edgeMultiplicity
      newState.set(place.identifier, [place.name, newWeight])
    })
  return newState
}

const resetActivity: ResetActivityType<
  ProcessModel,
  State,
  ActivityIdentifier
> = (model) => {
  const newState: Map<string, [string, number]> = new Map() // PetriNetState
  model.nodes
    .filter((node): node is PetriNetPlace => node.type === 'place')
    .forEach((place) =>
      newState.set(place.identifier, [place.name, place.amountOfTokens])
    )
  return newState
}

export const petriNetEngine: ProcessEngine<
  PetriNetProcessModel,
  PetriNetState,
  string
> = {
  processModelType: ProcessModelType.PetriNet,
  isAccepting: isAccepting,
  getEnabled: getEnabled,
  executeActivity: executeActivity,
  resetActivity: resetActivity,
}
