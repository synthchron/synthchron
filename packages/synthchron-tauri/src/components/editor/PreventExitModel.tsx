import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

import { useEditorStore } from './editorStore/flowStore'

export interface PreventExitModelProps {
  open: boolean
  onClose: () => void
}

export const PreventExitModel: React.FC<PreventExitModelProps> = ({
  open,
  onClose,
}) => {
  const disconnectRoom = useEditorStore((state) => state.disconnectRoom)

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Running Collaboration</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You are currently collaborating with other users. To leave this
          project, you must first leave the collaboration. You will be able to
          rejoin the collaboration as long as at least one collaborator remains.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            disconnectRoom()
            onClose()
          }}
        >
          Leave Collaboration
        </Button>
      </DialogActions>
    </Dialog>
  )
}
