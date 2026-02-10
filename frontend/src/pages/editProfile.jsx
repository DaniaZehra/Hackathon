import { useState } from 'react'
import '../App.css'
import { updateUserProfile } from '../api/auth.js'
import Sidebar from '../components/Sidebar.jsx'

function EditProfile({
  user,
  onBack,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
}) {
  const [firstname, setFirstname] = useState(user?.firstname || '')
  const [lastname, setLastname] = useState(user?.lastname || '')
  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [balance, setBalance] = useState(user?.balance ?? 0)
  const [monthlySpends, setMonthlySpends] = useState(user?.monthly_spends ?? 0)
  const [dailyAvgSpend, setDailyAvgSpend] = useState(user?.daily_avg_spend ?? 0)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('')

    if (!user?.username) {
      setStatus('No user loaded. Please log in again.')
      return
    }

    const updates = {
      firstname,
      lastname,
      username,
      balance: Number(balance),
      monthly_spends: Number(monthlySpends),
      daily_avg_spend: Number(dailyAvgSpend),
    }

    if (password.trim()) {
      updates.password = password.trim()
    }

    try {
      setSaving(true)
      const result = await updateUserProfile(user.username, updates)
      setStatus('Profile updated successfully.')
      if (onBack && result?.user) {
        onBack(result.user) // send updated user back to App/dashboard
      }
    } catch (error) {
      setStatus(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
      </header>

      <div className="dashboard-layout">
        {/* Sidebar (same style as dashboard) */}
        <Sidebar
          active="profile"
          onGoToDashboard={() => onBack && onBack(user)}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
        />

        {/* Main edit form */}
        <section className="section edit-profile-section">
          <h2 className="section-title-editProfile" style={{ color: '#2f3131', textAlign: 'left', marginBottom: '1rem' }}>
            Edit Profile
          </h2>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="profile-field">
              <span>First name</span>
              <input
                type="text"
                value={firstname}
                onChange={(event) => setFirstname(event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>Last name</span>
              <input
                type="text"
                value={lastname}
                onChange={(event) => setLastname(event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>Balance</span>
              <input
                type="number"
                value={balance}
                onChange={(event) => setBalance(event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>Monthly spends</span>
              <input
                type="number"
                value={monthlySpends}
                onChange={(event) => setMonthlySpends(event.target.value)}
              />
            </label>

            <label className="profile-field">
              <span>Daily average spend</span>
              <input
                type="number"
                value={dailyAvgSpend}
                onChange={(event) => setDailyAvgSpend(event.target.value)}
              />
            </label>

            {status && <p className="profile-status">{status}</p>}

            <button type="submit" className="profile-save-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default EditProfile