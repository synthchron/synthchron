import { Grid, Paper } from '@mui/material'

import { TablePreview } from '../../common/TablePreview'
import { useEditorStore } from '../editorStore/flowStore'

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
        <TablePreview object={result.statistics} />
      </Grid>
    </Grid>
  )
}
