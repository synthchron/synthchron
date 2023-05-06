import * as Cheerio from 'cheerio'
import * as xml2js from 'xml2js'

import { XESAttribute, XESEvent, XESLog, XESTrace } from './types'

export type XESAttributeObject = {
  string: {
    $: {
      key: string
      value: string
    }
  }
}

export type XESEventObject = {
  event: XESAttributeObject[]
}

export type XESTraceObject = {
  trace: XESEventObject[]
}

export type XESLogObject = {
  log: XESTraceObject[]
}

export const serialize = (log: XESLog): string => {
  const builder = new xml2js.Builder()
  const xml = builder.buildObject(toXESobj(log))
  return xml
}

export const deserialize = (xml: string): XESLog => {
  const logObject = parseXML(xml)
  return toXESlog(logObject)
}

const parseXML = (xml: string): XESLogObject => {
  const $ = Cheerio.load(xml, {
    xmlMode: true,
  })

  const xmlLog: XESLogObject = {
    log: $.root()
      .children('log')
      .first()
      .children('trace')
      .map((_i, el) => {
        const trace: XESTraceObject = {
          trace: $(el)
            .children('event')
            .map((_i, el) => {
              const event: XESEventObject = {
                event: $(el)
                  .children('string')
                  .map((_i, el) => {
                    const attribute: XESAttributeObject = {
                      string: {
                        $: {
                          key: $(el).attr('key'),
                          value: $(el).attr('value'),
                        },
                      },
                    }
                    return attribute
                  })
                  .get(),
              }
              return event
            })
            .get(),
        }
        return trace
      })
      .get(),
  }

  return xmlLog
}

export const toXESobj = (log: XESLog): XESLogObject => {
  return {
    log: log.traces.map(
      (trace: XESTrace): XESTraceObject => ({
        trace: trace.events.map(
          (event: XESEvent): XESEventObject => ({
            event: event.attributes.map(
              (attribute: XESAttribute): XESAttributeObject => ({
                string: {
                  $: {
                    key: attribute.key,
                    value: attribute.value,
                  },
                },
              })
            ),
          })
        ),
      })
    ),
  }
}

export const toXESlog = (obj: XESLogObject): XESLog => {
  return {
    traces: obj.log.map((trace) => ({
      events: trace.trace.map((event) => ({
        attributes: event.event.map((attribute) => ({
          key: attribute.string.$.key,
          value: attribute.string.$.value,
        })),
      })),
    })),
  }
}
