import { useState } from 'react'
import './Layout.css'
import { useSelector } from "react-redux";
import type { UserPayload } from '../../types/user';
import { useScreenType } from '../../hooks/useScreenType';
import Btns from './components/Btns/Btns'
import { Menu } from 'lucide-react'

const Layout = ({ children }: { children: React.ReactNode }) => {

  const user = useSelector((store: { user: { user: UserPayload } }) => store.user.user)
  const [menuOpen, setMenuOpen] = useState(false)

  const screenType = useScreenType();

  const isDesktop = screenType === 'desktop'

  return (
    <div className="layout">
      {isDesktop && (
        <div className="layout-sidebar">
          <Btns />
        </div>
      )}

      {!isDesktop && (
        <>
          <button
            className="layout-menu-btn"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(true) }}
          >
            <Menu size={20} />
          </button>

          {menuOpen && <div className="layout-backdrop" onClick={() => setMenuOpen(false)} />}

          <div
            onClick={(e) => e.stopPropagation()}
            className={`layout-sidebar layout-sidebar-mobile ${menuOpen ? 'sidebar-open' : ''}`}
          >
            <Btns onClose={() => setMenuOpen(false)} />
          </div>
        </>
      )}

      <div className={`layout-content ${!isDesktop ? 'layout-content--pushed' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default Layout
