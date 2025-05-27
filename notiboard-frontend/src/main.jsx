// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LearnFeed from './LearnFeed.jsx'  // 👈 import the new page
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/learn" element={<LearnFeed />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
