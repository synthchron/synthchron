export type Trace = {
    events: Event[]
}

export type Event = {
    name?: string
    meta: object
}