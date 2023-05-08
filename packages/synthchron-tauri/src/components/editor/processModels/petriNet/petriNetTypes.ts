export type PetriNetArcData = {
  multiplicity: number
}

export type PetriNetPlaceData = {
  tokens: number
}

export type PetriNetTransitionData = {
  label: string
  weight: number | string
}
