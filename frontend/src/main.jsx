import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2800,
          style: {
            background: 'var(--c-card)',
            color: '#FFC627',
            border: '1px solid rgba(255,198,39,0.3)',
            borderRadius: '14px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: '500',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
