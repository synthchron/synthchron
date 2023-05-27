import seedrandom from 'seedrandom'

export const weightedRandom = <T>(
  activities: Iterable<[T, number]>,
  randomGenerator: seedrandom.PRNG
): T | undefined => {
  const cumulativeWeights: [T, number][] = []
  let cumulativeWeight = 0
  for (const [activity, weight] of activities) {
    cumulativeWeight += weight
    cumulativeWeights.push([activity, cumulativeWeight])
  }
  if (cumulativeWeights.length === 0) return undefined
  const random = randomGenerator() * cumulativeWeight
  for (const [activity, cumulativeWeight] of cumulativeWeights) {
    if (random <= cumulativeWeight) return activity
  }
  throw new Error('Weighted random failed')
}
