import { useState } from 'react'
import './App.css'
import Landing from './pages/Landing.jsx'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import UserDashboard from './pages/user_dashboard.jsx'
import EditProfile from './pages/editProfile.jsx'
import VoiceAssistant from './pages/VoiceAssistant.jsx'
import AiAdvisor from './pages/AiAdvisor.jsx'
import Transactions from './pages/Transactions.jsx'

function App() {
  const [screen, setScreen] = useState('landing') // 'landing' | 'login' | 'signup' | 'user_dashboard' | 'edit_profile' | 'voice_assistant' | 'ai_advisor' | 'transactions'
  const [currentUser, setCurrentUser] = useState(null)

  const showLanding = () => {
    setCurrentUser(null)
    setScreen('landing')
  }
  const showLogin = () => setScreen('login')
  const showSignup = () => setScreen('signup')
  const showDashboard = (user) => {
    setCurrentUser(user)
    setScreen('user_dashboard')
  }
  const showProfile = () => setScreen('edit_profile')
  const showVoiceAssistant = () => setScreen('voice_assistant')
  const showAiAdvisor = () => setScreen('ai_advisor')
  const showTransactions = () => setScreen('transactions')
  const handleLogout = () => {
    setCurrentUser(null)
    setScreen('landing')
  }

  if (screen === 'login') {
    return (
      <Login
        onGoToSignup={showSignup}
        onGoHome={showLanding}
        onLoginSuccess={showDashboard}
      />
    )
  }

  if (screen === 'signup') {
    return <Signup onGoToLogin={showLogin} onGoHome={showLanding} />
  }

  if (screen === 'user_dashboard') {
    return (
      <UserDashboard
        user={currentUser}
        onLogout={handleLogout}
        onGoToProfile={showProfile}
        onGoToVoiceAssistant={showVoiceAssistant}
        onGoToAiAdvisor={showAiAdvisor}
        onGoToTransactions={showTransactions}
      />
    )
  }

  if (screen === 'edit_profile') {
    return (
      <EditProfile
        user={currentUser}
        onBack={showDashboard}
        onGoToVoiceAssistant={showVoiceAssistant}
        onGoToAiAdvisor={showAiAdvisor}
        onGoToTransactions={showTransactions}
      />
    )
  }

  if (screen === 'voice_assistant') {
    return (
      <VoiceAssistant
        user={currentUser}
        onGoToDashboard={() => showDashboard(currentUser)}
        onGoToVoiceAssistant={showVoiceAssistant}
        onGoToAiAdvisor={showAiAdvisor}
        onGoToTransactions={showTransactions}
        onGoToProfile={showProfile}
      />
    )
  }

  if (screen === 'ai_advisor') {
    return (
      <AiAdvisor
        user={currentUser}
        onGoToDashboard={() => showDashboard(currentUser)}
        onGoToVoiceAssistant={showVoiceAssistant}
        onGoToAiAdvisor={showAiAdvisor}
        onGoToTransactions={showTransactions}
        onGoToProfile={showProfile}
      />
    )
  }

  if (screen === 'transactions') {
    return (
      <Transactions
        user={currentUser}
        onGoToDashboard={() => showDashboard(currentUser)}
        onGoToVoiceAssistant={showVoiceAssistant}
        onGoToAiAdvisor={showAiAdvisor}
        onGoToTransactions={showTransactions}
        onGoToProfile={showProfile}
      />
    )
  }

  return <Landing onGetStarted={showSignup} onLoginClick={showLogin} />
}

export default App