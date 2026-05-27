import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import LogIn from './Pages/LogIn/LogIn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
    </Routes>
  )
}

export default App
