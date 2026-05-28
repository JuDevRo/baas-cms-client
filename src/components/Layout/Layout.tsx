import { useEffect, useState } from 'react'
import './Layout.css'
import { useSelector } from "react-redux";
import type { UserPayload } from '../../types/user';
import { useScreenType } from '../../hooks/useScreenType';
import Btns from './components/Btns/Btns'

const Layout = ({ children }: { children: React.ReactNode }) => {

  const user = useSelector((store: { user: { user: UserPayload } }) => store.user.user)
  const [menuOpen, setMenuOpen] = useState(false)

    useEffect(( ) => {
        console.log(user, 'user in layout')
    }, [user])

    const screenType = useScreenType();
    
  return (
    <div className="layout" onClick={() => setMenuOpen(false)}>
      {
        screenType === 'desktop' && (
          <div className="layout-sidebar">
            <Btns />
          </div>
        )
      }
      {
        screenType !== 'desktop' && (
          <div className="layout-header">
            {
              !menuOpen && (
                <button onClick={(e) => {setMenuOpen(!menuOpen); e.stopPropagation()}}>
                  Menu
                </button>
              )
            }
            {menuOpen && (
              <div onClick={(e) => e.stopPropagation()} className={`layout-sidebar mobile-sidebar ${menuOpen ? "mobile-sidebar-open" : "mobile-sidebar-closed"}`}>
                <Btns />
              </div>
            )}
          </div>

        )
      }
      <div className="layout-content">
        {children}
      </div>
    </div>
  )
}

export default Layout