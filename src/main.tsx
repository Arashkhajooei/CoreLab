import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Definitions from './pages/Definitions'
import Records from './pages/Records'
import RecordDetail from './pages/RecordDetail'

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'definitions', element: <Definitions /> },
      { path: 'records', element: <Records /> },
      { path: 'records/:ownerKey', element: <Records /> },
      { path: 'records/:ownerKey/:recordId', element: <RecordDetail /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
