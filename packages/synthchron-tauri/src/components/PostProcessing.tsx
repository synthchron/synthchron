import { useState } from 'react'

import { Button, Stack, Typography } from '@mui/material'

import {
  insertDuplicate,
  insertEvent,
  insertExisting,
} from '@synthchron/postprocessor/src/insert'
import { example } from '@synthchron/xes/src/exampleTrace'
import {
  XESAttribute,
  XESEvent,
  XESLog,
  XESTrace,
} from '@synthchron/xes/src/types'

import { CustomAppBar } from './CustomAppBar'

export function XESLogToString(log: XESLog) {
  return log.traces
    .map((trace: XESTrace) =>
      trace.events.map((event: XESEvent) =>
        event.attributes.map(
          (attribute: XESAttribute) =>
            '{\n  key: ' +
            attribute.key +
            '\n  value: ' +
            attribute.value +
            '\n}'
        )
      )
    )
    .flat()
    .join('\n')
}

export const PostProcessing = () => {
  const [processingResult, setProcessingResult] = useState('')

  const exampleEvent: XESEvent = {
    attributes: [{ value: 'Chungus', key: 'Big' }],
  }

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
          <pre>{XESLogToString(example)}</pre>
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
            <Stack direction='column' spacing={2}>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setProcessingResult(
                    XESLogToString(insertDuplicate(example, 20))
                  )
                }}
              >
                Insert Duplicate
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setProcessingResult(
                    XESLogToString(insertEvent(example, 20, exampleEvent))
                  )
                }}
              >
                Insert Event {'{'}key: Big, value: Chungus {'}'}
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  setProcessingResult(
                    XESLogToString(insertExisting(example, 20))
                  )
                }}
              >
                Insert Existing
              </Button>
            </Stack>
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'blue', padding: '20px' }}>
          {/* Content for the third column */}
          <pre>{processingResult}</pre>
        </div>
      </div>
    </>
  )
}
