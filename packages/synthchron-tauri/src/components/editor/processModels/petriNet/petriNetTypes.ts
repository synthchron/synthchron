export type PetriNetArcData = {
  multiplicity: number
}

export type PetriNetPlaceData = {
  tokens: number
  label: string
}

export type PetriNetTransitionData = {
  label: string
  weight: number | string
}
