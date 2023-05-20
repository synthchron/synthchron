import { XESEvent, XESLog, XESTrace } from '@synthchron/xes/src/types'

export function insertDuplicate(log: XESLog, chance: number): XESLog {
  if (chance > 100 || chance < 0) {
    throw 'Impossible chance: ' + chance + ' at insert duplicate'
  }
  chance = chance / 100

  /*  
  //Duplicate Attribute
  return {
    traces: log.traces.map((trace: XESTrace) => ({
      events: trace.events.map((event: XESEvent) => ({
        //Build new attributes with reduce
        attributes: event.attributes.reduce(
          (accumulator: XESAttribute[], attribute: XESAttribute) => {
            accumulator.push(attribute)

            // Randomly decide whether to duplicate the attribute
            if (Math.random() <= chance) {
              accumulator.push(attribute)
            }

            return accumulator
          },
          []
        ),
      })),
    })),
  }*/

  //Duplicate event
  return {
    traces: log.traces.map((trace: XESTrace) => ({
      events: trace.events.reduce(
        (accumulator: XESEvent[], event: XESEvent) => {
          accumulator.push(event)

          // Randomly decide whether to duplicate the event
          if (Math.random() <= chance) {
            accumulator.push(event)
          }

          return accumulator
        },
        []
      ),
    })),
  }
}

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
