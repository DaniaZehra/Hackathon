import { useState } from 'react'
import ReactMarkdown from 'react-markdown' 
import '../App.css'
import './AiAdvisor.css'
import './user_dashboard.css'
import Sidebar from '../components/Sidebar.jsx'
import DashboardTopbar from '../components/DashboardTopbar.jsx'

function AiAdvisor({
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
  onLogout,
}) {
  // 1. State for Portfolio Inputs & API Response
  const [holdings, setHoldings] = useState([{ ticker: '', value: '', sector: 'Technology' }])
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  // 2. Handle adding/removing stock rows
  const addHolding = () => setHoldings([...holdings, { ticker: '', value: '', sector: 'Technology' }])
  
  const updateHolding = (index, field, val) => {
    const newHoldings = [...holdings]
    newHoldings[index][field] = val
    setHoldings(newHoldings)
  }

  // 3. Trigger the FastAPI Agent
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

  return (
    <div className="landing">
      <DashboardTopbar onGoToProfile={onGoToProfile} onLogout={onLogout} />

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
            <h2 className="section-title-editProfile">AI Wealth Advisor</h2>
            
            {/* INPUT SECTION */}
            <div className="portfolio-card">
              <h3>Enter Your Holdings</h3>
              {holdings.map((h, i) => (
                <div key={i} className="holding-row">
                  <input placeholder="Ticker (e.g. AAPL)" value={h.ticker} onChange={(e) => updateHolding(i, 'ticker', e.target.value.toUpperCase())} />
                  <input type="number" placeholder="Value ($)" value={h.value} onChange={(e) => updateHolding(i, 'value', e.target.value)} />
                  <select value={h.sector} onChange={(e) => updateHolding(i, 'sector', e.target.value)}>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              ))}
              <button onClick={addHolding} className="btn-add" style={{ marginRight: '10px' }}>+ Add Stock</button>
              <button onClick={getAiAnalysis} disabled={loading} className="btn-generate">
                {loading ? "Agent is analyzing..." : "Generate AI Report"}
              </button>
            </div>

            {/* OUTPUT SECTION */}
            {report && (
              <div className="ai-report">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default AiAdvisor