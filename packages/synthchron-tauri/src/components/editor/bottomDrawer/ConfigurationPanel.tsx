import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Button,
  Divider,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'

import { usePersistentStore } from '../../common/persistentStore'
import { useEditorStore } from '../editorStore/flowStore'
import { ConfigPreview } from './ConfigPreview'
import { ConfigurationForm, defaultConfiguration } from './ConfigurationForm'

interface ConfigurationPanelProps {
  nextStep: () => void
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  nextStep,
}) => {
  const configurations = usePersistentStore((state) => state.configurations)
  const setConfigurations = usePersistentStore(
    (state) => state.setConfigurations
  )
  const config = useEditorStore((state) => state.config)
  const setConfig = useEditorStore((state) => state.setConfig)

  const [hoveredConfig, setHoveredConfig] = React.useState<string | null>(null)

  const handleConfigChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === '') {
      let newConfigName = 'New Configuration'
      let i = 1
      while (
        configurations.some((c) => c.configurationName === newConfigName)
      ) {
        newConfigName = `New Configuration (${i})`
        i++
      }
      const newConfig = {
        ...defaultConfiguration,
        configurationName: newConfigName,
      }
      setConfig(newConfig)
      setConfigurations([...configurations, newConfig])
      return
    }

    const selectedConfig = configurations.find(
      (c) => c.configurationName === event.target.value
    )
    if (selectedConfig) {
      setConfig(selectedConfig)
    }
  }

  const handleDelete = (configurationName: string | undefined) => {
    if (configurationName === undefined || configurationName === '') {
      return
    }
    const newConfigurations = configurations.filter(
      (c) => c.configurationName !== configurationName
    )
    setConfigurations(newConfigurations)
    if (config.configurationName === configurationName) {
      setConfig(defaultConfiguration)
    }
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          margin: '6em 0',
        }}
      >
        <Stack spacing={1}>
          <Paper style={{ padding: '16px' }}>
            <Stack style={{ width: '100%' }}>
              <InputLabel id='configurations-label'>
                Load Configuration
              </InputLabel>
              <Select
                label='Load Configuration'
                labelId='configurations-label'
                value={config.configurationName}
                onChange={handleConfigChange}
              >
                <MenuItem key='new-configuration' value=''>
                  <AddIcon style={{ marginRight: '8px' }} />
                  New Configuration
                </MenuItem>
                {configurations.map((c) => (
                  <MenuItem
                    key={c.configurationName}
                    value={c.configurationName}
                    onMouseEnter={() =>
                      setHoveredConfig(c.configurationName || null)
                    }
                    onMouseLeave={() => setHoveredConfig(null)}
                  >
                    {c.configurationName}
                    {c.configurationName !== config.configurationName && (
                      <IconButton
                        aria-label='delete'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(c.configurationName)
                        }}
                        style={{
                          marginLeft: 'auto',
                          display:
                            hoveredConfig === c.configurationName
                              ? 'block'
                              : 'none',
                          padding: '0',
                          verticalAlign: 'middle',
                          lineHeight: '1',
                        }}
                      >
                        <DeleteIcon style={{ fontSize: '20px' }} />
                      </IconButton>
                    )}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant='caption' color='textSecondary'>
                Load an existing configuration or create a new one.
              </Typography>
            </Stack>
          </Paper>
          <Button
            onClick={nextStep}
            disabled={
              config.configurationName == null ||
              !configurations
                .map((c) => c.configurationName)
                .find((val) => val == config.configurationName)
            }
            variant='contained'
          >
            Continue to Simulation
          </Button>
          <Divider style={{ margin: '7em 0 1em 0' }}>
            <Typography variant='caption' color='textSecondary'>
              Continue scrolling to edit your configuration
            </Typography>
          </Divider>
          <Paper style={{ padding: '16px', paddingBottom: '0px' }}>
            <Typography variant='h6' color='grey' gutterBottom>
              Configuration Editor
            </Typography>
            <ConfigurationForm
              config={config}
              setConfig={(newConfig) => {
                setConfigurations(
                  configurations.map((c) =>
                    c.configurationName === config.configurationName
                      ? newConfig
                      : c
                  )
                )
                setConfig(newConfig)
              }}
            />
          </Paper>
          <ConfigPreview config={config} />
          <Button
            onClick={nextStep}
            disabled={
              config.configurationName == null ||
              !configurations
                .map((c) => c.configurationName)
                .find((val) => val == config.configurationName)
            }
            variant='contained'
          >
            Continue to Simulation
          </Button>
        </Stack>
      </div>
    </>
  )
}
