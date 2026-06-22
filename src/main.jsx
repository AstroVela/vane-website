import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pages.css'
import App from './App.jsx'
import { RouterProvider } from './router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
)
