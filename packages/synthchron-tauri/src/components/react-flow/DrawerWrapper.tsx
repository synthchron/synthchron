import { Drawer, Toolbar } from '@mui/material'

interface DrawerProps {
  side: 'left' | 'right'
  children: React.ReactNode
}

export const DrawerWrapper: React.FC<DrawerProps> = ({ children, side }) => {
  const size = 300

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: size,
        flexShrink: size,
        [`& .MuiDrawer-paper`]: { width: size, boxSizing: 'border-box' },
        zIndex: 0, // Make sure the sidebar is behind the top bar
      }}
      anchor={side}
    >
      {/* This is adding a space the size of the top app bar. It is not visible but causes the children to be at the right position. */}
      <Toolbar />
      {children}
    </Drawer>
  )
}
