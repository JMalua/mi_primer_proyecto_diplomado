import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { DetalleConsultaPage } from './pages/DetalleConsultaPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/consultas/:id" element={<App><DetalleConsultaPage /></App>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
