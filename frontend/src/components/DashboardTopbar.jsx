import { useState } from 'react'
import '../pages/user_dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBell, faGear } from '@fortawesome/free-solid-svg-icons'

function DashboardTopbar({ onGoToProfile, onLogout }) {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <div className="dashboard-logo-wrap">
          <img src="/logo.png" alt="SecureSpend" className="dashboard-logo" />
        </div>
        <div className="dashboard-search">
          <span className="dashboard-search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input className="dashboard-search-input" placeholder="Search" />
        </div>
      </div>

      <div className="dashboard-topbar-right">
        <button className="icon-button" aria-label="Notifications">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button className="icon-button" aria-label="Settings">
          <FontAwesomeIcon icon={faGear} />
        </button>
        <div className="avatar-wrapper">
          <button
            type="button"
            className="dashboard-avatar"
            onClick={() => setIsAvatarMenuOpen((open) => !open)}
          >
            <img src="/Profile_pic.png" alt="Avatar" />
          </button>
          {isAvatarMenuOpen && (
            <div className="avatar-menu">
              <button
                type="button"
                onClick={() => {
                  setIsAvatarMenuOpen(false)
                  if (onGoToProfile) onGoToProfile()
                }}
              >
                User profile
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout()
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar