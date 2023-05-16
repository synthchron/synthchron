import { useState } from 'react'

import { Box, Tab, Tabs } from '@mui/material'

interface DrawerProps {
  side: 'left' | 'right'
  children: React.ReactNode[]
  tabs: string[]
}

export const TabbedDrawer: React.FC<DrawerProps> = ({ children, tabs }) => {
  const [value, setValue] = useState(0)

  return (
    <div>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs value={value} onChange={(event, value) => setValue(value)}>
          {tabs.map((tab) => (
            <Tab label={tab} key={tab} />
          ))}
        </Tabs>
      </Box>
      {children.map((child, index) => (
        <TabPanel value={value} index={index} key={index}>
          {child}
        </TabPanel>
      ))}
    </div>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
}) => {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <>{children}</>}
    </div>
  )
}
