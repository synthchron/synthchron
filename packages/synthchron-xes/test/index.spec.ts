// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import { XESLog, deserialize, main, serialize } from '../src'
import { example } from '../src/exampleTrace'
import { XESLogObject, toXESlog, toXESobj } from '../src/transformer'

const logObject: XESLogObject = {
  log: [
    {
      trace: [
        {
          event: [
            {
              string: {
                $: {
                  key: 'concept:name',
                  value: 'A',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
const log: XESLog = {
  traces: [
    {
      events: [
        {
          attributes: [
            {
              key: 'concept:name',
              value: 'A',
            },
          ],
        },
      ],
    },
  ],
}

describe('Index module', function () {
  describe('expected behavior', function () {
    it('should return hello world', function () {
      expect(main()).to.equal('Hello World')
    })
  })

  describe('(de)serialization', () => {
    it('should serialize to the same object', () => {
      const serial = serialize(example)
      const deserial = deserialize(serial)
      expect(deserial).to.deep.equal(example)
    })
  })

  describe('deserialization', () => {
    it('should deserialize to the same object', () => {
      const serial = `
            <log>
        <trace>
          <event>
            <string key="Activity" value="register request"/>
          </event>
        </trace>
      </log>`
      const deserial = deserialize(serial)
      const result: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'Activity',
                    value: 'register request',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserial).to.deep.equal(result)
    })

    it('should deserialize to the same object', () => {
      const serial = `
            <log>
        <trace>
          <event>
            <string key="Activity" value="register request"/>
          </event>
          <event>
            <string key="Activity" value="something else"/>
          </event>
        </trace>
      </log>`
      const deserial = deserialize(serial)
      const result: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'Activity',
                    value: 'register request',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'Activity',
                    value: 'something else',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserial).to.deep.equal(result)
    })
  })

  describe('to xes transformer', () => {
    it('provide expected value', () => {
      const actual = toXESobj(log)
      expect(actual).to.deep.equal(logObject)
    })
  })

  describe('to log transformer', () => {
    it('provide expected value', () => {
      const actual = toXESlog(logObject)
      expect(actual).to.deep.equal(log)
    })
  })

  describe('log=>object=>log', () => {
    it('should be equal', () => {
      const actual = toXESlog(toXESobj(log))
      expect(actual).to.deep.equal(log)
    })
  })

  describe('object=>log=>object', () => {
    it('should be equal', () => {
      const actual = toXESobj(toXESlog(logObject))
      expect(actual).to.deep.equal(logObject)
    })
  })

  describe('empty log', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('single trace', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('single event', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('single attribute', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('multiple traces', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [],
          },
          {
            events: [],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('multiple events', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [],
              },
              {
                attributes: [],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('multiple attributes', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('multiple traces, events, attributes', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('multiple traces, events, attributes with different keys and values', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key2',
                    value: 'value2',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'key3',
                    value: 'value3',
                  },
                  {
                    key: 'key4',
                    value: 'value4',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key5',
                    value: 'value5',
                  },
                  {
                    key: 'key6',
                    value: 'value6',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'key7',
                    value: 'value7',
                  },
                  {
                    key: 'key8',
                    value: 'value8',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('multiple traces, events, attributes with different keys and values and different types', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key',
                    value: 'value',
                  },
                  {
                    key: 'key2',
                    value: 'value2',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'key3',
                    value: 'value3',
                  },
                  {
                    key: 'key4',
                    value: 'value4',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'key5',
                    value: 'value5',
                  },
                  {
                    key: 'key6',
                    value: 'value6',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'key7',
                    value: 'value7',
                  },
                  {
                    key: 'key8',
                    value: 'value8',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe('a complex log', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      expect(deserialize(serialize(xesLog))).to.deep.equal(xesLog)
    })
  })

  describe("comments don't change the result", () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      const comment = 'This is a comment'
      expect(deserialize(serialize(xesLog, comment))).to.deep.equal(xesLog)
    })
  })

  describe('A comment with control characters', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      const comment =
        'This is a comment with control characters: \n \r \t \b \f'
      expect(deserialize(serialize(xesLog, comment))).to.deep.equal(xesLog)
    })
  })

  describe('A comment with special characters', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },

                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      const comment = 'This is a comment with special characters: " \' & < >'
      expect(deserialize(serialize(xesLog, comment))).to.deep.equal(xesLog)
    })
  })

  describe('A comment with xml control sequences (e.g. -->, <!--, <html/>, <div>, <div/>)', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },

                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      const comment =
        'This is a comment with xml control sequences (e.g. -->, <!--, <html/>, <div>, <div/>)'
      expect(deserialize(serialize(xesLog, comment))).to.deep.equal(xesLog)
    })
  })

  describe('A comment with invalid xml control sequences (e.g. --!>, <!-, <html, <div, <div/)', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      const comment =
        'This is a comment with invalid xml control sequences (e.g. --!>, <!-, <html, <div, <div/)'
      expect(deserialize(serialize(xesLog, comment))).to.deep.equal(xesLog)
    })
  })

  describe('A comment with multiple comments', () => {
    it('should return itself', () => {
      const xesLog: XESLog = {
        traces: [
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'A',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'B',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                  {
                    key: 'key',
                    value: 'value',
                  },
                ],
              },
            ],
          },
          {
            events: [
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'C',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
              {
                attributes: [
                  {
                    key: 'concept:name',
                    value: 'D',
                  },
                  {
                    key: 'time:timestamp',
                    value: '1970-01-01T00:00:00.000+01:00',
                  },
                ],
              },
            ],
          },
        ],
      }
      const comment = [
        'This is a comment with multiple comments <!-- --> <!-- -->',
        '<!-- --> <!-- -->',
        'hellp world',
        'synthchron is a nice application',
      ]
      expect(deserialize(serialize(xesLog, comment))).to.deep.equal(xesLog)
    })
  })
})
