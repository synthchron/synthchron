export type XESLog = {
  traces: XESTrace[]
}

export type XESTrace = {
  events: XESEvent[]
}

export type XESEvent = {
  attributes: XESAttribute[]
}

export type XESAttribute = {
  key: string
  value: string
}

// TODO: Add full XES specs
