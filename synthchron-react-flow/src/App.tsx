import { useState } from 'react'
import reactLogo from './assets/react.svg'
//import './App.css'
import { Flow } from './Flow'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
    }}>
      <Flow />
    </div>
  )
}

export default App
