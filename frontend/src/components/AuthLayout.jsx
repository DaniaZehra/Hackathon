function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-overlay" />

      <div className="auth-content">
        <header className="auth-header">
        </header>
        <main className="auth-main single">{children}</main>
      </div>
    </div>
  )
}

export default AuthLayout