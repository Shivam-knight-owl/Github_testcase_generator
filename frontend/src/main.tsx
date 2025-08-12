import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.ts'
import { AppStateProvider } from './contexts/AppStateContext.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppStateProvider>
          <App />
      </AppStateProvider>
    </AuthProvider>
 
  </StrictMode>,
)
