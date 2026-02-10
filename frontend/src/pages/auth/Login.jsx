import { useState } from 'react'
import AuthLayout from '../../components/AuthLayout.jsx'
import { loginUser } from '../../api/auth.js'

function Login({ onGoToSignup, onGoHome, onLoginSuccess }) {
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
          style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}
        >
          <img src="/arrow-left.svg" alt="Back" /> to home
        </button>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to continue.</p>

        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError('')
            setLoading(true)
            try {
              const result = await loginUser({ username, password })
              console.log('Logged in user', result.user)
              if (onLoginSuccess) {
                onLoginSuccess(result.user)
              }
            } catch (err) {
              setError(err.message)
            } finally {
              setLoading(false)
            }
          }}
        >
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
            <div className="auth-label-row">
              <span className="auth-label">Password</span>
              <button type="button" className="auth-link-button">
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="auth-error-text">{error}</p>}

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="auth-link-button"
            onClick={onGoToSignup}
          >
            Sign up
          </button>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login