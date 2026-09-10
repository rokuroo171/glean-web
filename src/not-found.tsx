import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './head'
import NotFound from './pages/NotFound'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
