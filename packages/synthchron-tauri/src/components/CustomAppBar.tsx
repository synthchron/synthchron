import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import { Container } from '@mui/material'

export const CustomAppBar: React.FC = () => {
  const pages = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Editor',
      href: '/editor',
    },
    {
      name: 'Collaborate',
      href: '/collaborate',
    },
    {
      name: 'Debug',
      href: '/debug',
    },
  ]

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar variant='dense' disableGutters>
          <AccountTreeRoundedIcon sx={{ mr: 1 }} />
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SYN
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  // Do nothing
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={page.href}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
