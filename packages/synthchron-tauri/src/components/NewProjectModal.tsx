import { useState } from 'react'

import { Box, Modal, Tab, Tabs } from '@mui/material'

import NewProjectDefault from './NewProjectDefault'
import NewProjectFile from './NewProjectFile'

const modal_style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '.3rem',
  boxShadow: 14,
  p: 4,
}

const tab_style = {
  fontSize: '0.8rem',
}

interface NewProjectModalProps {
  open: boolean
  onClose: () => void
  redirect?: boolean
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  open,
  onClose,
  redirect = false,
}) => {
  const [value, setValue] = useState(0)

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={modal_style}>
        <Tabs value={value} onChange={(_event, value) => setValue(value)}>
          <Tab sx={tab_style} label={'Create empty project'} />
          <Tab sx={tab_style} label={'Create project from file'} />
        </Tabs>
        {value == 0 && (
          <NewProjectDefault onClose={onClose} redirect={redirect} />
        )}
        {value == 1 && <NewProjectFile onClose={onClose} redirect={redirect} />}
      </Box>
    </Modal>
  )
}

export default NewProjectModal
