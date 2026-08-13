import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import { PrivateRoute } from './components/PrivateRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to = "/login" />} />
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoute /> }>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path='/register' element={<Register />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
