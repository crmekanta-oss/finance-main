import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Set theme attribute before first render to avoid flash
const savedTheme = localStorage.getItem('ekanta-theme') || 'dark'
document.documentElement.setAttribute('data-theme', savedTheme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
