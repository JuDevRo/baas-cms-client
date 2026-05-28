import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { UserPayload } from '../../types/user'
import { LayoutDashboard, Key, Settings, LogOut } from 'lucide-react'
import './Btns.css'

interface BtnsProps {
  onClose?: () => void
}

const Btns = ({ onClose }: BtnsProps) => {
  const navigate = useNavigate()
  const user = useSelector((store: { user: { user: UserPayload } }) => store.user.user)

  const handleNavigation = (route: string) => {
    navigate(route)
    onClose?.()
  }

  const handleLogout = () => {
    alert('logout')
  }

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <>
      <div className="btns-top">
        <button className="btns-nav-btn" onClick={() => handleNavigation('/')}>
          <LayoutDashboard size={18} />
          <span>Projects</span>
        </button>
        <button className="btns-nav-btn" onClick={() => handleNavigation('/api-keys')}>
          <Key size={18} />
          <span>API Keys</span>
        </button>
        <button className="btns-nav-btn" onClick={() => handleNavigation('/settings')}>
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>

      <div className="btns-bottom">
        <div className="btns-user">
          <div className="btns-avatar">{getInitials(user?.name ?? '')}</div>
          <div className="btns-user-info">
            <span className="btns-user-name">{user?.name}</span>
            <span className="btns-user-email">{user?.email}</span>
          </div>
          <button className="btns-logout-btn" onClick={handleLogout} title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

export default Btns
