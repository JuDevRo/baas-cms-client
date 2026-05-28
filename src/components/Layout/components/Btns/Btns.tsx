import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Btns.css'

const Btns = () => {
    const navigate = useNavigate()

    const handleNavigation = (route: string) => {
        navigate(route)
    }

    const handleLogout = () => {
        alert('logout')
    }

  return (
    <>
        <div className="layout-sidebar-top">
            <button className="btns-btn" onClick={() => handleNavigation('/')}>Projects</button>
            <button className="btns-btn" onClick={() => handleNavigation('/api-keys')}>API Keys</button>
            <button className="btns-btn" onClick={() => handleNavigation('/settings')}>Settings</button>
        </div>
        <div>
            <button onClick={handleLogout}>Log out</button>
        </div>
    </>
  )
}

export default Btns