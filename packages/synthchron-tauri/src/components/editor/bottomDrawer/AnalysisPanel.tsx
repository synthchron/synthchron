import { faker } from '@faker-js/faker'
import { Grid, Paper } from '@mui/material'
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
import { Bar, Line, Radar, Scatter } from 'react-chartjs-2'

import { TablePreview } from '../../common/TablePreview'
import { useEditorStore } from '../editorStore/flowStore'

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

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

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
      text: 'Chart.js Line Chart',
    },
  },
}

interface AnalysisPanelProps {
  nextStep: () => void
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = () => {
  const _configuration = useEditorStore((state) => state.config)
  const result = useEditorStore((state) => state.result)

  if (result === undefined) {
    return <>Hello</>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <Paper style={{ padding: '16px' }}>
          <TablePreview object={result.statistics} />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper style={{ padding: '16px' }}>
          <TablePreview object={result.statistics} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{ padding: '16px' }}>
          <Line data={data} options={options} />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper style={{ padding: '16px' }}>
          <Bar data={data} options={options} />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper style={{ padding: '16px' }}>
          <Radar data={data} options={options} />
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper style={{ padding: '16px' }}>
          <Scatter data={highDimensionalData} options={options} />
        </Paper>
      </Grid>
    </Grid>
  )
}
