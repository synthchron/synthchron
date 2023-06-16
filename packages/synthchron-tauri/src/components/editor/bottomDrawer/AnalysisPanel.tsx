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
import { Bar, Doughnut, Radar } from 'react-chartjs-2'

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
      text: 'Unnamed Chart',
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

        <Grid item xs={4}>
          <Paper style={{ padding: '16px' }}>
            {(() => {
              const doughnutOptions = JSON.parse(JSON.stringify(options))
              doughnutOptions.plugins.title.text =
                'Transition distribution (Doughnut chart) in %'
              return <Doughnut data={doughnutData} options={doughnutOptions} />
            })()}
          </Paper>
        </Grid>

        <Grid item xs={8}>
          <Paper style={{ padding: '16px' }}>
            {(() => {
              const barOptions = JSON.parse(JSON.stringify(options))
              barOptions.plugins.title.text =
                'Transition distribution (Bar chart) in %'
              barOptions.plugins.legend.display = false
              return <Bar data={lineData} options={barOptions} />
            })()}
          </Paper>
        </Grid>
        {showGraphs && (
          <Grid item xs={4}>
            <Paper style={{ padding: '16px' }}>
              {(() => {
                const radarOptions = JSON.parse(JSON.stringify(options))
                radarOptions.plugins.title.text =
                  'Transition distribution (Radar chart) in %'
                radarOptions.plugins.legend.display = false
                return <Radar data={lineData} options={radarOptions} />
              })()}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}
