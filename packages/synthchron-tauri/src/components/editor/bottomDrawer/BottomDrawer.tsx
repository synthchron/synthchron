import React, { useState } from 'react'

import { BarChart, PlayArrow, Settings } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogContent,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'

import { AnalysisPanel } from './AnalysisPanel'
import { ConfigurationPanel } from './ConfigurationPanel'
import { SimulationPanel } from './SimulationPanel'

export interface BottomDrawerProps {
  open: boolean
  onClose: () => void
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  open,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const _handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const primaryColor = '#1976d2'

  const steps = [
    {
      label: 'Configure',
      description: 'Configure the settings for the simulation',
      icon: <Settings color='primary' />,
      component: <ConfigurationPanel nextStep={handleNext} />,
    },
    {
      label: 'Simulate',
      description:
        'Verify the model and configuration, and start your simulation',
      icon: <PlayArrow color='primary' />,
      component: <SimulationPanel nextStep={handleNext} />,
    },
    {
      label: 'Analyze',
      description: 'Analyze the results of the simulation',
      icon: <BarChart color='primary' />,
      component: <AnalysisPanel nextStep={handleNext} />,
    },
  ]

  return (
    <Dialog open={open} maxWidth='lg' onClose={onClose} fullWidth>
      <DialogContent style={{ minHeight: '80vh', minWidth: '800px' }}>
        <Stepper activeStep={activeStep}>
          {steps.map(({ label, icon }, index) => (
            <Step key={label}>
              <StepLabel
                icon={icon}
                style={{
                  color: primaryColor,
                  cursor: index < activeStep ? 'pointer' : 'default',
                }}
                onClick={() => index < activeStep && setActiveStep(index)}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              <div>
                <h2>{steps[activeStep].label}</h2>
                <Typography variant='body2' color='textSecondary'>
                  {steps[activeStep].description}
                </Typography>
              </div>
              <div>{steps[activeStep].component}</div>
              {/* <div>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant='contained'
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Box>
              </div> */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
