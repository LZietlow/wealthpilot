import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to = "/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
