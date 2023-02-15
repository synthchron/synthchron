import { useState } from 'react'
import isElectron from 'is-electron'

function Versions(): JSX.Element {
  const [versions] = useState(isElectron() ? window.electron.process.versions : {electron: '0.0.0', chrome: '0.0.0', node: '0.0.0', v8: '0.0.0'})

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
      <li className="v8-version">V8 v{versions.v8}</li>
    </ul>
  )
}

export default Versions
