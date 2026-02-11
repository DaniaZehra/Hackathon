function Landing({ onGetStarted, onLoginClick }) {
  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
        <nav className="nav">
          <a href="#menu">Menu</a>
          <a href="#how-it-works">How it works</a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onGetStarted}
          >
            Get started
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-bg" />
      </section>

      <footer className="footer">
        <div className="footer-top" />
        <div className="footer-inner">
          <div className="footer-brand">
            <img className="footer-logo" src="/logo.png" alt="SecureSpend" />
            <p className="footer-tagline">Spend smarter.</p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} SecureSpend</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing

