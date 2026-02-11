import { useState } from 'react'
import ReactMarkdown from 'react-markdown' 
import '../App.css'
import './AiAdvisor.css'
import Sidebar from '../components/Sidebar.jsx'

function AiAdvisor({
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
}) {
  // 1. State for Portfolio Inputs & API Response
  const [holdings, setHoldings] = useState([{ ticker: '', value: '', sector: 'Technology' }])
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  // 2. State for Financial Advisor (backend-advisor)
  const [faLoading, setFaLoading] = useState(false)
  const [faText, setFaText] = useState('')
  const [faActions, setFaActions] = useState([])
  const [faHistory, setFaHistory] = useState([])
  const [faError, setFaError] = useState('')
  const [language, setLanguage] = useState('en')
  
  // Constant user ID
  const userId = '698b1e99f6ef2d305232b680'

  // 3. Handle adding/removing stock rows
  const addHolding = () => setHoldings([...holdings, { ticker: '', value: '', sector: 'Technology' }])
  
  const updateHolding = (index, field, val) => {
    const newHoldings = [...holdings]
    newHoldings[index][field] = val
    setHoldings(newHoldings)
  }

  // 4. Trigger the Wealth Management Agent (/analyze)
  const getAiAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdings: holdings.map(h => ({ ...h, value: parseFloat(h.value) }))
        })
      })
      const data = await response.json()
      setReport(data.report)
    } catch (error) {
      console.error("Error fetching analysis:", error)
      setReport("Failed to generate report. Please ensure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // 5. Trigger the Financial Advisor Agent (/financial-advisor from backend-advisor)
  const getFinancialAdvice = async () => {
    setFaLoading(true)
    setFaError('')

    try {
      // NOTE: adjust the base URL/port if your backend-advisor runs elsewhere
      const response = await fetch(
        `http://localhost:8001/financial-advisor?user_id=${encodeURIComponent(
          userId
        )}&language=${encodeURIComponent(language)}`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()
      console.log(data)

      if (data.error) {
        setFaError(data.error)
        setFaText('')
        setFaActions([])
        setFaHistory([])
        return
      }

      setFaText(data.text_response || '')
      setFaActions(data.actions_taken || [])
      setFaHistory(data.past_history || [])
    } catch (error) {
      console.error('Error fetching financial advice:', error)
      setFaError('Failed to fetch financial advice. Please ensure the advisor backend is running.')
    } finally {
      setFaLoading(false)
    }
  }

  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
      </header>

      <div className="dashboard-layout">
        <Sidebar
          active="advisor"
          onGoToDashboard={onGoToDashboard}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
          onGoToProfile={onGoToProfile}
        />

        <main className="dashboard-main">
          <section className="section advisor-section advisor-container" style={{ maxWidth: 900 }}>
            <h2 className="section-title-editProfile">AI Advisors Dashboard</h2>

            <div className="advisor-grid">
              {/* LEFT COLUMN: INPUTS */}
              <div className="advisor-column">
                {/* PORTFOLIO INPUT SECTION */}
                <div className="portfolio-card">
                  <h3>Enter Your Holdings</h3>
                  {holdings.map((h, i) => (
                    <div key={i} className="holding-row">
                      <input
                        placeholder="Ticker (e.g. AAPL)"
                        value={h.ticker}
                        onChange={(e) =>
                          updateHolding(i, 'ticker', e.target.value.toUpperCase())
                        }
                      />
                      <input
                        type="number"
                        placeholder="Value ($)"
                        value={h.value}
                        onChange={(e) => updateHolding(i, 'value', e.target.value)}
                      />
                      <select
                        value={h.sector}
                        onChange={(e) => updateHolding(i, 'sector', e.target.value)}
                      >
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  ))}
                  <button onClick={addHolding} className="btn-add" style={{ marginRight: '10px' }}>
                    + Add Stock
                  </button>
                  <button onClick={getAiAnalysis} disabled={loading} className="btn-generate">
                    {loading ? 'Agent is analyzing...' : 'Generate AI Report'}
                  </button>
                </div>

                {/* FINANCIAL ADVISOR INPUTS */}
                <div className="advisor-input-card">
                  <h3>Personal Financial Advisor</h3>
                  <p className="advisor-helper-text">
                    Get personalized insights based on your SecureSpend profile.
                  </p>
                  <div className="advisor-input-row">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{ gridColumn: 'span 2' }}
                    >
                      <option value="en">English</option>
                      <option value="ur">Urdu</option>
                    </select>
                    <button
                      onClick={getFinancialAdvice}
                      disabled={faLoading}
                      className="btn-generate"
                    >
                      {faLoading ? 'Advisor is thinking...' : 'Get Financial Advice'}
                    </button>
                  </div>
                  {faError && <p className="advisor-error">{faError}</p>}
                </div>
              </div>

              {/* RIGHT COLUMN: OUTPUTS */}
              <div className="advisor-column">
                {/* WEALTH ANALYSIS OUTPUT */}
                {report && (
                  <div className="ai-report">
                    <h3 className="ai-report-title">AI Wealth Advisor Report</h3>
                    <ReactMarkdown>{report}</ReactMarkdown>
                  </div>
                )}

                {/* FINANCIAL ADVISOR OUTPUT */}
                {faText && (
                  <div className="ai-report">
                    <h3 className="ai-report-title">Personal Financial Coach</h3>
                    <ReactMarkdown>{faText}</ReactMarkdown>

                    {faActions?.length > 0 && (
                      <div className="advisor-actions">
                        <h4>Actions Taken</h4>
                        <ul>
                          {faActions.map((action, idx) => (
                            <li key={idx}>
                              {typeof action === 'string'
                                ? action
                                : JSON.stringify(action)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {faHistory?.length > 0 && (
                      <details className="advisor-history">
                        <summary>View past advisor history</summary>
                        <div className="advisor-history-list">
                          {faHistory.map((item, idx) => (
                            <div key={idx} className="advisor-history-item">
                              {typeof item === 'string'
                                ? item
                                : JSON.stringify(item)}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AiAdvisor