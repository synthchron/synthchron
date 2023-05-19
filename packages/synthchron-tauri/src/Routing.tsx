import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Debug } from './components/Debug'
import { PostProcessing } from './components/PostProcessing'
import { CollaborationPage } from './pages/CollaborationPage'
import { EditorPage } from './pages/EditorPage'
import { MainMenuPage } from './pages/MainMenuPage'
import { NotFoundPage } from './pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainMenuPage />,
  },
  {
    path: 'editor/',
    element: <EditorPage />,
    children: [
      {
        path: ':projectId',
        element: <EditorPage />,
      },
    ],
  },
  {
    path: 'collaborate',
    element: <CollaborationPage />,
  },
  {
    path: 'debug',
    element: <Debug />,
  },
  {
    path: 'postprocessing',
    element: <PostProcessing />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export const Routing: React.FC = () => <RouterProvider router={router} />
