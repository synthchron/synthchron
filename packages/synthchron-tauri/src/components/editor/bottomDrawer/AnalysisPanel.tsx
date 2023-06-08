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

import { PostprocessSimulation } from '@synthchron/postprocessor/src/postprocess'
import {
  exportStringAsFile,
  transformSimulationLogToXESLog,
} from '@synthchron/utils'
import { serialize } from '@synthchron/xes'

import { TablePreview } from '../../common/TablePreview'
import { usePersistentStore } from '../../common/persistentStore'
import { useEditorStore } from '../editorStore/flowStore'
import {
  AggregateToChartData,
  AggregateToTable,
  ChartType,
  TransformToAggregate,
} from './analysisFunctions/AggregateCharts'

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
          x: faker.number.int({ min: i, max: Math.pow(i, 2) }),
          y: faker.number.int({ min: -10 * i, max: 0 }),
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

  const PostProcessedSimulation = result.simulationLog
    ? transformSimulationLogToXESLog(
        PostprocessSimulation(result.simulationLog, configuration)
      )
    : result.log
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
          exportStringAsFile(
            serialize(PostProcessedSimulation),
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
          exportStringAsFile(
            serialize(PostProcessedSimulation, [
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
          exportStringAsFile(
            serialize(PostProcessedSimulation, [
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

  const doughnutData = AggregateToChartData(aggregateOfLog, ChartType.Doughnut)
  const lineData = AggregateToChartData(aggregateOfLog, ChartType.Other)

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
              object={AggregateToTable(aggregateOfLog)}
              columnTitles={['Transition', 'Amount']}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: '16px' }}>
            <Line data={lineData} options={options} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: '16px' }}>
            <Bar data={lineData} options={options} />
          </Paper>
        </Grid>
        {aggregateOfLog.some((log) => log.size > 3) ? (
          <Grid item xs={4}>
            <Paper style={{ padding: '16px' }}>
              <Radar data={lineData} options={options} />
            </Paper>
          </Grid>
        ) : null}
        <Grid item xs={8}>
          <Paper style={{ padding: '16px' }}>
            <Scatter data={highDimensionalData} options={options} />
            Not implemented
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper style={{ padding: '16px' }}>
            <Doughnut data={doughnutData} options={options} />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
