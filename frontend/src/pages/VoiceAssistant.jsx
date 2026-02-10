import '../App.css'
import './user_dashboard.css'
import Sidebar from '../components/Sidebar.jsx'

function VoiceAssistant({
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
          active="voice"
          onGoToDashboard={onGoToDashboard}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
          onGoToProfile={onGoToProfile}
        />

        {/* Main content */}
        <main className="dashboard-main">
          <section className="section edit-profile-section" style={{ maxWidth: 700 }}>
            <h2 className="section-title-editProfile" style={{ color: '#2f3131' }}>
              Voice Assistant
            </h2>
            <p style={{ maxWidth: 520, color: '#2f3131' }}>
              This is where your conversational banking assistant UI will live. You can show
              microphone controls, chat history, and quick actions here.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default VoiceAssistant