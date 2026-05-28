import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home/Home'
import LogIn from './Pages/LogIn/LogIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
