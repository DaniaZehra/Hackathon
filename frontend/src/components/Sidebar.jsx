import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGauge,
  faMicrophone,
  faChartLine,
  faListUl,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

function Sidebar({
  active, // 'dashboard' | 'voice' | 'advisor' | 'transactions' | 'profile'
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
}) {
  return (
    <aside className="dashboard-sidebar">
      <nav className="dashboard-nav">
        <button
          type="button"
          className={`nav-item ${active === 'dashboard' ? 'active' : ''}`}
          onClick={onGoToDashboard}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faGauge} />
          </span>
          <span className="nav-label">Dashboard</span>
        </button>

        <button
          type="button"
          className={`nav-item ${active === 'voice' ? 'active' : ''}`}
          onClick={onGoToVoiceAssistant}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faMicrophone} />
          </span>
          <span className="nav-label">Voice Assistant</span>
        </button>

        <button
          type="button"
          className={`nav-item ${active === 'advisor' ? 'active' : ''}`}
          onClick={onGoToAiAdvisor}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </span>
          <span className="nav-label">AI Advisor</span>
        </button>

        <button
          type="button"
          className={`nav-item ${active === 'transactions' ? 'active' : ''}`}
          onClick={onGoToTransactions}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faListUl} />
          </span>
          <span className="nav-label">Transactions</span>
        </button>

        <button
          type="button"
          className={`nav-item ${active === 'profile' ? 'active' : ''}`}
          onClick={onGoToProfile}
        >
          <span className="nav-icon">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      <footer className="dashboard-sidebar-footer">
        <p>© {new Date().getFullYear()} SecureSpend</p>
      </footer>
    </aside>
  )
}

export default Sidebar

