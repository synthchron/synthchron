import * as Cheerio from 'cheerio'

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

/**
 * This function serialied a given XES JS object.
 * @param log XESLog object
 * @param comment, and optional list or string of comment(s). May not include -->, which will be replaced by -- >.
 * @returns a string representation of the XESLog object
 */
export const serialize = (
  log: XESLog,
  comment: string | string[] | undefined = undefined
): string => {
  const xml = parseXES(log)
  if (comment === undefined) return xml
  const [head, ...tail] = xml.split('\n')
  if (typeof comment === 'string') {
    // ensure comment does not contain -->
    const commentLine = `<!-- ${comment.replace('-->', '-- >')} -->`
    return [head, commentLine, ...tail].join('\n')
  } else {
    // ensure comment does not contain -->
    const commentLines = comment.map(
      (line) => `<!-- ${line.replace('-->', '-- >')} -->`
    )
    return [head, ...commentLines, ...tail].join('\n')
  }
}

export const deserialize = (xml: string): XESLog => {
  const logObject = parseXML(xml)
  return toXESlog(logObject)
}

const parseXES = (log: XESLog): string => {
  let xesString = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
  xesString += '<log>\n'
  log.traces.forEach((trace) => {
    xesString += '  <trace>\n'
    trace.events.forEach((event) => {
      xesString += '    <event>\n'
      event.attributes.forEach((attribute) => {
        xesString +=
          '      <string key="' +
          attribute.key +
          '" value="' +
          attribute.value +
          '"/>\n'
      })
      xesString += '    </event>\n'
    })
    xesString += '  </trace>\n'
  })
  xesString += '</log>'
  return xesString
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
                          key: $(el).attr('key') as string,
                          value: $(el).attr('value') as string,
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
