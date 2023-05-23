import { faker } from '@faker-js/faker'
import { Button, Divider, Grid, Paper, Stack } from '@mui/material'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js/auto'
import { Bar, Doughnut, Line, Radar, Scatter } from 'react-chartjs-2'

import { serialize } from '@synthchron/xes'

import { TablePreview } from '../../common/TablePreview'
import { usePersistentStore } from '../../common/persistentStore'
import { useEditorStore } from '../editorStore/flowStore'
import {
  AggregateToData,
  TransformToAggregate,
  aggregateToTable,
  chartType,
} from './analysisFunctions/aggregateCharts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

const highDimensionalData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [...labels, ...labels, ...labels, ...labels, ...labels].map(
        (_l, i) => ({
          x: faker.datatype.number({ min: i, max: Math.pow(i, 2) }),
          y: faker.datatype.number({ min: -10 * i, max: 0 }),
        })
      ),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Trace Chart',
    },
  },
}

const downloadString = (str: string, filename: string) => {
  const element = document.createElement('a')
  const file = new Blob([str], {
    type: 'text/plain',
  })
  element.href = URL.createObjectURL(file)
  element.download = filename
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}

interface AnalysisPanelProps {
  nextStep: () => void
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = () => {
  const configuration = useEditorStore((state) => state.config)
  const result = useEditorStore((state) => state.result)
  const projects = usePersistentStore((state) => state.projects)
  const projectId = useEditorStore((state) => state.projectId)

  if (result === undefined) {
    return <>Hello</>
  }

  const exportButtons = (
    <Stack
      direction={'row'}
      spacing={1}
      style={{
        marginLeft: 'auto',
      }}
    >
      <Button
        variant='contained'
        onClick={() => {
          downloadString(
            serialize(result.log),
            `trace-${
              (projectId &&
                projectId in projects &&
                projects[projectId].projectName?.replace(/ /g, '_')) ||
              'model'
            }-${
              configuration.configurationName?.replace(/ /g, '_') || 'default'
            }.xes`
          )
        }}
      >
        Export as XES
      </Button>
      <Button
        variant='contained'
        onClick={() => {
          downloadString(
            serialize(result.log, [
              'This log was generated using the following model and configuration.',
              `Model: ${
                (projectId &&
                  projectId in projects &&
                  projects[projectId].projectName) ||
                'unknown'
              }`,
              `Configuration: ${configuration.configurationName || 'unknown'}`,
            ]),
            `trace-${
              (projectId &&
                projectId in projects &&
                projects[projectId].projectName?.replace(/ /g, '_')) ||
              'model'
            }-${
              configuration.configurationName?.replace(/ /g, '_') || 'default'
            }.xes`
          )
        }}
      >
        Export as XES with Model
      </Button>
      <Button
        variant='contained'
        onClick={() => {
          downloadString(
            serialize(result.log, [
              'This log was generated using the following model and configuration.',
              `Model: ${
                (projectId &&
                  projectId in projects &&
                  JSON.stringify(projects[projectId].projectModel)) ||
                'unknown'
              }`,
              `Configuration: ${JSON.stringify(configuration) || 'unknown'}`,
            ]),
            `trace-${
              (projectId &&
                projectId in projects &&
                projects[projectId].projectName?.replace(/ /g, '_')) ||
              'model'
            }-${
              configuration.configurationName?.replace(/ /g, '_') || 'default'
            }.xes`
          )
        }}
      >
        Export as XES with fully serialized Model
      </Button>
    </Stack>
  )

  const aggregateOfLog = TransformToAggregate(result.log)

  const DoughnotData = AggregateToData(aggregateOfLog, chartType.Doughnot)
  const LineData = AggregateToData(aggregateOfLog, chartType.Other)

  return (
    <Stack>
      {exportButtons}
      <Divider
        style={{
          marginTop: '16px',
          marginBottom: '16px',
        }}
      >
        Log Statistics
      </Divider>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Paper style={{ padding: '16px' }}>
            <TablePreview
              object={result.statistics}
              columnTitles={['Key', 'Value']}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ padding: '16px' }}>
            <TablePreview
              object={aggregateToTable(aggregateOfLog)}
              columnTitles={['Transition', 'Amount']}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: '16px' }}>
            <Line data={LineData} options={options} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: '16px' }}>
            <Bar data={LineData} options={options} />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ padding: '16px' }}>
            <Radar data={LineData} options={options} />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper style={{ padding: '16px' }}>
            <Scatter data={highDimensionalData} options={options} />
            Not implemented
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ padding: '16px' }}>
            <Doughnut data={DoughnotData} options={options} />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
