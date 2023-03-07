import { XMLBuilder } from 'fast-xml-parser'
import { XESAttribute, XESEvent, XESLog, XESTrace } from './types'

export const generateXES = (xesLog: XESLog, prettyPrint = true): string => {
  const xml = generateLog(xesLog)

  const builder = new XMLBuilder({
    format: prettyPrint,
    attributeNamePrefix: '@',
    ignoreAttributes: false,
    attributesGroupName: '',
    suppressEmptyNode: true,
  })
  return builder.build(xml)
}

const generateLog = (xesLog: XESLog): object => {
  return {
    log: {
      trace: xesLog.traces.map(generateTrace),
    },
  }
}

const generateTrace = (trace: XESTrace): object => {
  return {
    event: trace.events.map(generateEvent),
  }
}

const generateEvent = (event: XESEvent): object => {
  return {
    string: event.attributes.map(generateAttribute),
  }
}

const generateAttribute = (attribute: XESAttribute): object => {
  return {
    '@key': attribute.key,
    '@value': attribute.value,
  }
}
