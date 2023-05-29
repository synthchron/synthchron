import { Box, Chip, Divider, Paper, Typography } from '@mui/material'

import {
  Event,
  TraceSimulationResult,
  TraceTerminationReason,
} from '@synthchron/simulator'

interface TraceVisualizerProps {
  trace: TraceSimulationResult
  firstN?: number
  lastN?: number
}

export const TraceVisualizer: React.FC<TraceVisualizerProps> = ({
  trace,
  firstN,
  lastN,
}) => {
  const [first, skip, last]: [number, boolean, number] =
    firstN === undefined && lastN === undefined
      ? [trace.trace.events.length, false, 0]
      : firstN !== undefined && lastN === undefined
      ? [
          Math.min(firstN, trace.trace.events.length),
          firstN < trace.trace.events.length,
          0,
        ]
      : firstN === undefined && lastN !== undefined
      ? [
          0,
          lastN < trace.trace.events.length,
          Math.min(lastN, trace.trace.events.length),
        ]
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      firstN! + lastN! > trace.trace.events.length
      ? [trace.trace.events.length, false, 0]
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [firstN!, true, lastN!]

  return (
    <Paper sx={{ padding: '16px' }}>
      <Typography variant='h6' gutterBottom display={'inline'}>
        Trace
      </Typography>
      <Typography
        variant='subtitle1'
        display={'inline'}
        sx={{
          marginLeft: '8px',
        }}
      >
        (showing {first + last}/{trace.trace.events.length} events)
      </Typography>
      {trace.trace.events.slice(0, first).map((event, idx) => (
        <EventLine idx={idx} event={event} key={idx} />
      ))}
      <Box width={'100%'} sx={{ marginBottom: '8px', marginTop: '8px' }}>
        {skip && (
          <Divider>
            <Typography variant='caption' fontWeight={100}>
              Skipped {trace.trace.events.length - first - last} events
            </Typography>
          </Divider>
        )}
      </Box>
      {last !== 0 &&
        trace.trace.events
          .slice(-last, trace.trace.events.length)
          .map((event, idx) => (
            <EventLine
              idx={idx + trace.trace.events.length - last}
              event={event}
              key={idx}
            />
          ))}

      <LastLine
        reason={trace.exitReason}
        acceptingState={trace.acceptingState}
      />
    </Paper>
  )
}

interface EventLineProps {
  idx: number
  event: Event
}

const EventLine: React.FC<EventLineProps> = ({ idx, event }) => (
  <Paper
    sx={{
      marginTop: '8px',
      padding: '8px',
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      height: '32px',
    }}
  >
    <Typography variant='body2' gutterBottom>
      {idx + 1}
    </Typography>
    <Divider
      sx={{
        marginLeft: '8px',
        marginRight: '8px',
      }}
      orientation='vertical'
    />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // flexGrow: 1,
      }}
    >
      <Chip label={'event: ' + event.name} />
      {/* {event.name} */}
      {Object.entries(event.meta).map(([key, value]) => (
        <Chip
          key={key}
          label={key + ': ' + value}
          sx={{
            marginLeft: '8px',
          }}
        />
      ))}
    </Box>
  </Paper>
)

interface LastLineProps {
  reason: TraceTerminationReason
  acceptingState?: string
}

const LastLine: React.FC<LastLineProps> = ({ reason, acceptingState }) => (
  <Paper
    sx={{
      marginTop: '8px',
      padding: '8px',
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.1)',
    }}
  >
    <Typography variant='body2'>
      {reason === 'acceptingStateReached' ? (
        <>
          Accepting state reached: <Chip label={acceptingState} />
        </>
      ) : reason === 'error' ? (
        'Error'
      ) : reason === 'noEnabledActivities' ? (
        'No enabled activities'
      ) : (
        'Max events reached'
      )}
    </Typography>
  </Paper>
)
