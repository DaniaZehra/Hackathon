import { useState } from 'react'
import './user_dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillWave, faSearch, faBell, faGear, faWallet, faPlus } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../components/Sidebar.jsx'

function UserDashboard({
  user,
  onLogout,
  onGoToProfile,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
}) {
  const displayName = user?.firstname || 'Hira'
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg" />
      <div className="dashboard-overlay" />

      <div className="dashboard-shell">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <div className="dashboard-logo-wrap">
              <img src="/logo.png" alt="SecureSpend" className="dashboard-logo" />
            </div>
            <div className="dashboard-search">
              <span className="dashboard-search-icon"><FontAwesomeIcon icon={faSearch} /></span>
              <input
                className="dashboard-search-input"
                placeholder="Search"
              />
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

        <div className="dashboard-layout">
          {/* Sidebar */}
          <Sidebar
            active="dashboard"
            onGoToVoiceAssistant={onGoToVoiceAssistant}
            onGoToAiAdvisor={onGoToAiAdvisor}
            onGoToTransactions={onGoToTransactions}
            onGoToProfile={onGoToProfile}
          />

          {/* Main content */}
          <main className="dashboard-main">
          <h2 className="balance-title">Good Afternoon, {displayName}</h2>
            {/* Balance hero card */}
            <section className="balance-hero-card">
              <div className="balance-hero-bg" />
              <div className="balance-hero-overlay" />
              <div className="balance-hero-content">
                <p className="balance-label">Total Balance</p>
                <h1 className="balance-amount">8,250.50 Rs</h1>

                <div className="dashboard-balance-pills">
                  <div className="balance-pill">
                    <span className="pill-label">Savings</span>
                    <span className="pill-value">4,200.25 Rs</span>
                  </div>
                  <div className="balance-pill">
                    <span className="pill-label">Checking</span>
                    <span className="pill-value">3,480.25 Rs</span>
                  </div>
                  <div className="balance-pill">
                    <span className="pill-label">Credit</span>
                    <span className="pill-value">570.50 Rs</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="dashboard-cta-row">
              <button className="dashboard-cta primary">
                <span className="nav-icon">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                </span>
                <span className="nav-label">Send Money</span>
              </button>
              <button className="dashboard-cta primary">
                <span className="nav-icon">
                  <FontAwesomeIcon icon={faWallet} />
                </span>
                <span className="nav-label">Pay Bills</span>
              </button>
              <button className="dashboard-cta primary">
                <span className="nav-icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span className="nav-label">Add Funds</span>
              </button>
            </div>

            {/* Middle Grid */}
            <section className="dashboard-grid">
              {/* AI Feature Cards */}
              <div className="feature-cards">
                <div className="feature-card">
                  <img
                    src="/chatbot.png"
                    alt="Voice Assistant"
                    className="feature-icon feature-icon-image"
                  />
                  <h3>Voice Assistant</h3>
                  <p>Talk to your bank in real time</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📈</div>
                  <h3>AI Financial Advisor</h3>
                  <p>Smart insights for your spending</p>
                </div>
              </div>

              <aside className="dashboard-panel">
                <header className="panel-header">
                  <h3>Recent Transactions</h3>
                  <button className="panel-link">View All</button>
                </header>

                <p className="panel-highlight">
                  You spent <strong>18% more on food this week</strong>. You could save 95 Rs this month
                  by reducing extra food expenses.
                </p>

                <ul className="transaction-list">
                  <li className="transaction-item">
                    <div>
                      <p className="transaction-merchant">Melbrew Coffee</p>
                      <p className="transaction-meta">Apr 22 · Food</p>
                    </div>
                    <span className="transaction-amount negative">- 14.75 Rs</span>
                  </li>
                  <li className="transaction-item">
                    <div>
                      <p className="transaction-merchant">Khaadi Shopping</p>
                      <p className="transaction-meta">Apr 21 · Shopping</p>
                    </div>
                    <span className="transaction-amount negative">- 89.99 Rs</span>
                  </li>
                  <li className="transaction-item">
                    <div>
                      <p className="transaction-merchant">Electricity Bill</p>
                      <p className="transaction-meta">Apr 19 · Bills</p>
                    </div>
                    <span className="transaction-amount negative">- 120.00 Rs</span>
                  </li>
                </ul>
              </aside>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
