import { Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
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
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2'

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

  const showGraphs = aggregateOfLog.some((log) => log.size > 3)
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
          <TablePreview
            object={result.statistics}
            columnTitles={['Key', 'Value']}
          />
        </Grid>
        <Grid item xs={4}>
          <TablePreview
            object={AggregateToTable(aggregateOfLog)}
            columnTitles={['Transition', 'Amount']}
          />
        </Grid>
        {showGraphs && (
          <>
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
            <Grid item xs={4}>
              <Paper style={{ padding: '16px' }}>
                <Radar data={lineData} options={options} />
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper style={{ padding: '16px' }}>
                <Doughnut data={doughnutData} options={options} />
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
      {!showGraphs && (
        <Divider style={{ margin: '2em 0 2em 0' }}>
          <Typography variant='caption' color='textSecondary'>
            No graphs are shown as there were too few unique events in your
            traces.
          </Typography>
        </Divider>
      )}
    </Stack>
  )
}
