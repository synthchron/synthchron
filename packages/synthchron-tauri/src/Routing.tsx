import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Debug } from './components/Debug'
import { PostProcessing } from './components/PostProcessing'
import { BatchPage } from './pages/BatchPage'
import { CollaborationPage } from './pages/CollaborationPage'
import { EditorPage } from './pages/EditorPage'
import { MainMenuPage } from './pages/MainMenuPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PostProcessingPage } from './pages/PostProcessingPage'

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
    path: 'postprocessing',
    element: <PostProcessingPage />,
  },
  {
    path: 'batch',
    element: <BatchPage />,
  },
  {
    path: 'debug',
    element: <Debug />,
  },
  {
    path: 'debug_postprocessing',
    element: <PostProcessing />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export const Routing: React.FC = () => <RouterProvider router={router} />
