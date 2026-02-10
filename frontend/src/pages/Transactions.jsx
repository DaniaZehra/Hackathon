import '../App.css'
import './user_dashboard.css'
import Sidebar from '../components/Sidebar.jsx'

function Transactions({
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
}) {
  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
      </header>

      <div className="dashboard-layout">
        {/* Sidebar (same as dashboard) */}
        <Sidebar
          active="transactions"
          onGoToDashboard={onGoToDashboard}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
          onGoToProfile={onGoToProfile}
        />

        {/* Main content */}
        <main className="dashboard-main">
          <section className="section edit-profile-section" style={{ maxWidth: 900 }}>
            <h2 className="section-title-editProfile" style={{ color: '#2f3131' }}>
              Transactions
            </h2>
            <p style={{ maxWidth: 520, color: '#2f3131' }}>
              This page will contain a detailed list of all user transactions with filters,
              search, and export options.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Transactions