import { Button, Typography } from '@mui/material'

import {
  XESAttribute,
  XESEvent,
  XESLog,
  XESTrace,
} from '@synthchron/xes/src/types'

import { CustomAppBar } from './CustomAppBar'

export const PostProcessing = () => {
  return (
    <>
      <CustomAppBar />
      <Typography
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '48px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          color: 'white',
          background: 'black',
        }}
      >
        This is my post-processing playground!
      </Typography>
      <div style={{ display: 'flex', height: '100vh', color: 'white' }}>
        <div style={{ flex: 1, backgroundColor: 'red', padding: '20px' }}>
          {exampleTrace.traces.map((trace: XESTrace, id1: number) =>
            trace.events.map((event: XESEvent, id2: number) =>
              event.attributes.map((attribute: XESAttribute, id3: number) => (
                <pre key={id1 + id2 + id3}>
                  {'{\n  key: '}
                  {attribute.key}
                  {'\n  value: '}
                  {attribute.value}
                  {'\n}'}
                </pre>
              ))
            )
          )}
        </div>
        <div style={{ flex: 3, backgroundColor: 'green', padding: '20px' }}>
          {/* Content for the second column */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <Button variant='contained' color='primary'>
              Centered Button
            </Button>
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'blue', padding: '20px' }}>
          {/* Content for the third column */}
          Third Column
        </div>
      </div>
    </>
  )
}

export const exampleTrace: XESLog = {
  traces: [
    {
      events: [
        {
          attributes: [
            {
              key: 'name',
              value: 'Event 1',
            },
          ],
        },
        {
          attributes: [
            {
              key: 'name',
              value: 'Event 2',
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
              key: 'name',
              value: 'Event 3',
            },
          ],
        },
      ],
    },
  ],
}
