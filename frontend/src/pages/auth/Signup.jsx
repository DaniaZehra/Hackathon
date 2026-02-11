import { useState } from 'react'
import AuthLayout from '../../components/AuthLayout.jsx' 
import { signupUser } from '../../api/auth.js'

function Signup({ onGoToLogin, onGoHome }) {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <AuthLayout>
      <div className="auth-card">
        <button
          type="button"
          className="auth-link-button"
          onClick={onGoHome}
          style={{ alignSelf: 'flex-start', marginBottom: '0.25rem' }}
        >
         <img src="/arrow-left.svg" alt="Back" /> to home
        </button>

        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Sign up.</p>

        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')
            setLoading(true)
            try {
              await signupUser({ firstname, lastname, username, password })
              onGoToLogin()
            } catch (err) {
              setError(err.message)
            } finally {
              setLoading(false)
            }
          }}
        >
          <label className="auth-field">
            <span className="auth-label">First Name</span>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your first name"
              value={firstname}
              onChange={(event) => setFirstname(event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Last Name</span>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your last name"
              value={lastname}
              onChange={(event) => setLastname(event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Username</span>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Password</span>
            <input
              type="password"
              className="auth-input"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="auth-error-text">{error}</p>}

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link-button"
            onClick={onGoToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}
export default Signup