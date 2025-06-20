import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NotificationProvider } from './context/NotificationContext'
import { OnlineStatusProvider } from './context/OnlineStatusContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OnlineStatusProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </OnlineStatusProvider>
  </StrictMode>,
)
