import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material'

interface ConfirmationDialogProps {
  text: string
  open: boolean
  closeDialog: () => void
  onConfirm: () => void
  useErrorColor?: boolean
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  text,
  open,
  closeDialog,
  onConfirm,
  useErrorColor = false,
}) => {
  const theme = useTheme()

  const handleConfirm = () => {
    onConfirm()
    closeDialog()
  }

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>
        {useErrorColor ? 'Confirm Delete' : 'Confirmation'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          autoFocus
          style={{
            color: useErrorColor
              ? theme.palette.error.main
              : theme.palette.text.primary,
          }}
        >
          {useErrorColor ? 'Delete' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
