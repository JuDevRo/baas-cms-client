import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './Pages/Home/Home'
import LogIn from './Pages/LogIn/LogIn'
import Settings from './Pages/Settings/Settings'
import Project from './Pages/Project/Project'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
