import { Trace } from '@synthchron/simulator/src/types/simulationTypes'
import { XESEvent, XESLog, XESTrace } from '@synthchron/xes/src/types'

export function insertDuplicate(trace: Trace, affectedEntry: number): Trace {
  const duplicatedEvent = trace.events[affectedEntry]
  trace.events.splice(affectedEntry, 0, duplicatedEvent)
  return trace
}

// Legacy insertion method. Can be adapted to postprocess() if desired
export function insertEvent(
  log: XESLog,
  chance: number,
  insertedEvent: XESEvent
): XESLog {
  if (chance > 100 || chance < 0) {
    throw 'Impossible chance: ' + chance + ' at insert duplicate'
  }
  chance = chance / 100

  return {
    traces: log.traces.map((trace: XESTrace) => ({
      events: trace.events.reduce(
        (accumulator: XESEvent[], event: XESEvent) => {
          accumulator.push(event)

          // Randomly decide whether to insert the event
          if (Math.random() <= chance) {
            accumulator.push(insertedEvent)
          }

          return accumulator
        },
        []
      ),
    })),
  }
}

// Legacy insertion method. Can be adapted to postprocess() if desired
export function insertExisting(log: XESLog, chance: number): XESLog {
  if (chance > 100 || chance < 0) {
    throw 'Impossible chance: ' + chance + ' at insert duplicate'
  }
  chance = chance / 100

  let XESEventList: XESEvent[] = []
  log.traces.map((trace: XESTrace) =>
    trace.events.map((event: XESEvent) => XESEventList.push(event))
  )
  XESEventList = [...new Set(XESEventList)]

  return {
    traces: log.traces.map((trace: XESTrace) => ({
      events: trace.events.reduce(
        (accumulator: XESEvent[], event: XESEvent) => {
          accumulator.push(event)

          // Randomly decide whether to insert the event
          if (Math.random() <= chance) {
            const randomEntry = Math.floor(Math.random() * XESEventList.length)
            accumulator.push(XESEventList[randomEntry])
          }

          return accumulator
        },
        []
      ),
    })),
  }
}
