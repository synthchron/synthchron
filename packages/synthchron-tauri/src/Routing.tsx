import { Route, Routes } from 'react-router-dom'
import { Debug } from './components/Debug'
import { EditorPage } from './pages/EditorPage'
import { MainMenuPage } from './pages/MainMenuPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const Routing: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MainMenuPage />} />
      <Route path='editor/' element={<EditorPage />}>
        <Route path=':projectId/' element={<EditorPage />} />
      </Route>
      <Route path='debug/' element={<Debug />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}
