import { useState } from 'react'
import './user_dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillWave, faWallet, faPlus } from '@fortawesome/free-solid-svg-icons'
import Sidebar from '../components/Sidebar.jsx'
import DashboardTopbar from '../components/DashboardTopbar.jsx'
import { sendMoney, addFunds, payBill } from '../api/auth.js'

function UserDashboard({
  user,
  onLogout,
  onGoToProfile,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onUserUpdate,
}) {
  const displayName = user?.firstname || 'Hira'
  const balance = user?.balance ?? 0
  const monthlySpends = user?.monthly_spends ?? 0
  const dailyAvgSpend = user?.daily_avg_spend ?? 0
  const transactions = user?.transaction_history || []
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('bill_payment')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addAmount, setAddAmount] = useState('')
  const [addSource, setAddSource] = useState('debit_card')
  const [addPurpose, setAddPurpose] = useState('savings')
  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
  const [billCategory, setBillCategory] = useState('electricity')
  const [billRef, setBillRef] = useState('')
  const [billProvider, setBillProvider] = useState('')
  const [billAmount, setBillAmount] = useState('')
  const [billSource, setBillSource] = useState('savings')
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [paySuccess, setPaySuccess] = useState('')

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg" />
      <div className="dashboard-overlay" />

      <div className="dashboard-shell">
        {/* Top bar */}
        <DashboardTopbar onGoToProfile={onGoToProfile} onLogout={onLogout} />

        <div className="dashboard-layout">
          {/* Sidebar */}
          <Sidebar
            active="dashboard"
            onGoToVoiceAssistant={onGoToVoiceAssistant}
            onGoToAiAdvisor={onGoToAiAdvisor}
            onGoToTransactions={onGoToTransactions}
            onGoToProfile={onGoToProfile}
          />

          {/* Main content */}
          <main className="dashboard-main">
          <h2 className="balance-title">Good Afternoon, {displayName}</h2>
            {/* Balance hero card */}
            <section className="balance-hero-card">
              <div className="balance-hero-bg" />
              <div className="balance-hero-overlay" />
              <div className="balance-hero-content">
                <p className="balance-label">Total Balance</p>
                <h1 className="balance-amount">
                  {balance.toLocaleString('en-PK', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  Rs
                </h1>

                <div className="dashboard-balance-pills">
                  <div className="balance-pill">
                    <span className="pill-label">Monthly Spends</span>
                    <span className="pill-value">
                      {monthlySpends.toLocaleString('en-PK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Rs
                    </span>
                  </div>
                  <div className="balance-pill">
                    <span className="pill-label">Average Spend</span>
                    <span className="pill-value">
                      {dailyAvgSpend.toLocaleString('en-PK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Rs
                    </span>
                  </div>
                  <div className="balance-pill">
                    <span className="pill-label">Credit</span>
                    <span className="pill-value">570.50 Rs</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="dashboard-cta-row">
              <button
                type="button"
                className="dashboard-cta primary"
                onClick={() => {
                  setSendError('')
                  setSendSuccess('')
                  setIsSendModalOpen(true)
                }}
              >
                <span className="nav-icon">
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                </span>
                <span className="nav-label">Send Money</span>
              </button>
              <button
                type="button"
                className="dashboard-cta primary"
                onClick={() => {
                  setPayError('')
                  setPaySuccess('')
                  setIsPayModalOpen(true)
                }}
              >
                <span className="nav-icon">
                  <FontAwesomeIcon icon={faWallet} />
                </span>
                <span className="nav-label">Pay Bills</span>
              </button>
              <button
                type="button"
                className="dashboard-cta primary"
                onClick={() => {
                  setAddError('')
                  setAddSuccess('')
                  setIsAddModalOpen(true)
                }}
              >
                <span className="nav-icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span className="nav-label">Add Funds</span>
              </button>
            </div>

            {/* Middle Grid */}
            <section className="dashboard-grid">
              {/* AI Feature Cards */}
              <div className="feature-cards">
                <div className="feature-card">
                  <img
                    src="/chatbot.png"
                    alt="Voice Assistant"
                    className="feature-icon feature-icon-image"
                  />
                  <h3>Voice Assistant</h3>
                  <p>Talk to your bank in real time</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📈</div>
                  <h3>AI Financial Advisor</h3>
                  <p>Smart insights for your spending</p>
                </div>
              </div>

              <aside className="dashboard-panel">
                <header className="panel-header">
                  <h3>Recent Transactions</h3>
                  <button
                    type="button"
                    className="panel-link"
                    onClick={() => {
                      if (onGoToTransactions) onGoToTransactions()
                    }}
                  >
                    View All
                  </button>
                </header>

                {transactions.length === 0 ? (
                  <p className="panel-highlight">
                    No transactions yet. Use <strong>Send Money</strong> to create your first
                    transfer.
                  </p>
                ) : (
                  <>
                    <p className="panel-highlight">
                      Latest activity shown below. Amounts are in PKR.
                    </p>
                    <ul className="transaction-list">
                      {transactions
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .map((tx, index) => {
                          const isDebit = tx.type === 'debit'
                          const total = Number(tx.total || tx.amount || 0)

                          let title = tx.recipient_name
                          if (!title) {
                            if (tx.type === 'credit') {
                              title = 'Added Funds'
                            } else if (
                              tx.category === 'electricity' ||
                              tx.category === 'gas' ||
                              tx.category === 'water' ||
                              tx.category === 'internet' ||
                              tx.category === 'mobile'
                            ) {
                              title = 'Bill Payment'
                            } else {
                              title = 'Transfer'
                            }
                          }

                          return (
                            <li key={index} className="transaction-item">
                              <div>
                                <p className="transaction-merchant">{title}</p>
                                <p className="transaction-meta">
                                  {tx.purpose?.replace('_', ' ') || 'Transfer'} ·{' '}
                                  {tx.created_at
                                    ? new Date(tx.created_at).toLocaleString()
                                    : ''}
                                </p>
                              </div>
                              <span
                                className={`transaction-amount ${
                                  isDebit ? 'negative' : 'positive'
                                }`}
                              >
                                {isDebit ? '- ' : '+ '}
                                {total.toLocaleString('en-PK', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{' '}
                                Rs
                              </span>
                            </li>
                          )
                        })}
                    </ul>
                  </>
                )}
              </aside>
            </section>
          </main>
        </div>
      </div>

      {isSendModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <h3>Send Money</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  if (!sending) setIsSendModalOpen(false)
                }}
              >
                ×
              </button>
            </header>

            <form
              className="send-form"
              onSubmit={async (event) => {
                event.preventDefault()
                setSendError('')
                setSendSuccess('')

                const numericAmount = Number(amount)
                if (Number.isNaN(numericAmount)) {
                  setSendError('Please enter a valid amount.')
                  return
                }
                if (numericAmount < 100 || numericAmount > 20000) {
                  setSendError('Amount must be between 100 and 20,000 PKR.')
                  return
                }

                const fee = 50
                try {
                  setSending(true)
                  const result = await sendMoney(user.username, {
                    recipient_name: recipientName,
                    account_id: accountId,
                    amount: numericAmount,
                    purpose,
                  })
                  if (onUserUpdate && result.user) {
                    onUserUpdate(result.user)
                  }
                  setSendSuccess('Transaction completed successfully.')
                  setRecipientName('')
                  setAccountId('')
                  setAmount('')
                  setPurpose('bill_payment')
                } catch (err) {
                  setSendError(err.message)
                } finally {
                  setSending(false)
                }
              }}
            >
              <div className="send-grid">
                <div>
                  <h4 className="send-section-title">Recipient</h4>
                  <label className="send-field">
                    <span>Recipient Name</span>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </label>
                  <label className="send-field">
                    <span>Account Number / Wallet ID</span>
                    <input
                      type="text"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div>
                  <h4 className="send-section-title">Transfer</h4>
                  <label className="send-field">
                    <span>Amount (in PKR)</span>
                    <input
                      type="number"
                      min="100"
                      max="20000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </label>
                  <label className="send-field">
                    <span>Purpose</span>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    >
                      <option value="bill_payment">Bill / Utilities</option>
                      <option value="shopping">Shopping</option>
                      <option value="food">Food & Dining</option>
                      <option value="family_support">Family Support</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <div>
                  <h4 className="send-section-title">Summary</h4>
                  <div className="send-summary-row">
                    <span>Transfer Amount</span>
                    <span>
                      {Number(amount || 0).toLocaleString('en-PK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Rs
                    </span>
                  </div>
                  <div className="send-summary-row">
                    <span>Transfer Fee</span>
                    <span>50.00 Rs</span>
                  </div>
                  <div className="send-summary-row total">
                    <span>Total Deducted</span>
                    <span>
                      {(Number(amount || 0) + 50).toLocaleString('en-PK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Rs
                    </span>
                  </div>
                </div>
              </div>

              {sendError && <p className="send-error">{sendError}</p>}
              {sendSuccess && <p className="send-success">{sendSuccess}</p>}

              <div className="send-actions">
                <button
                  type="button"
                  className="send-secondary"
                  onClick={() => {
                    if (!sending) setIsSendModalOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="send-primary" disabled={sending}>
                  {sending ? 'Sending...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPayModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <h3>Pay Bills</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  if (!paying) setIsPayModalOpen(false)
                }}
              >
                ×
              </button>
            </header>

            <form
              className="send-form"
              onSubmit={async (event) => {
                event.preventDefault()
                setPayError('')
                setPaySuccess('')

                const numericAmount = Number(billAmount)
                if (Number.isNaN(numericAmount) || numericAmount <= 0) {
                  setPayError('Please enter a valid bill amount.')
                  return
                }

                if (!billRef) {
                  setPayError('Please enter a bill reference or account number.')
                  return
                }

                try {
                  setPaying(true)
                  const payload = {
                    category: billCategory,
                    reference_number: billRef,
                    provider: billProvider || undefined,
                    amount: numericAmount,
                    account_source: billSource,
                  }
                  const result = await payBill(user.username, payload)
                  if (onUserUpdate && result.user) {
                    onUserUpdate(result.user)
                  }
                  setPaySuccess('Bill paid successfully.')
                  setBillAmount('')
                  setBillRef('')
                  setBillProvider('')
                  setBillCategory('electricity')
                  setBillSource('savings')
                } catch (err) {
                  setPayError(err.message)
                } finally {
                  setPaying(false)
                }
              }}
            >
              <div className="send-grid">
                <div>
                  <h4 className="send-section-title">Bill Details</h4>
                  <label className="send-field">
                    <span>Bill Category</span>
                    <select
                      value={billCategory}
                      onChange={(e) => setBillCategory(e.target.value)}
                    >
                      <option value="electricity">Electricity</option>
                      <option value="gas">Gas</option>
                      <option value="water">Water</option>
                      <option value="internet">Internet</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </label>
                  <label className="send-field">
                    <span>Bill Reference / Account Number</span>
                    <input
                      type="text"
                      value={billRef}
                      onChange={(e) => setBillRef(e.target.value)}
                      required
                    />
                  </label>
                  <label className="send-field">
                    <span>Provider (optional)</span>
                    <input
                      type="text"
                      value={billProvider}
                      onChange={(e) => setBillProvider(e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <h4 className="send-section-title">Payment</h4>
                  <label className="send-field">
                    <span>Bill Amount (PKR)</span>
                    <input
                      type="number"
                      min="1"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      required
                    />
                  </label>
                  <label className="send-field">
                    <span>Pay From</span>
                    <select
                      value={billSource}
                      onChange={(e) => setBillSource(e.target.value)}
                    >
                      <option value="savings">Savings Account</option>
                      <option value="current">Current Account</option>
                    </select>
                  </label>
                </div>

                <div>
                  <h4 className="send-section-title">Summary</h4>
                  <div className="send-summary-row">
                    <span>Bill Type</span>
                    <span>
                      {billCategory.charAt(0).toUpperCase() + billCategory.slice(1)}
                    </span>
                  </div>
                  <div className="send-summary-row">
                    <span>Amount</span>
                    <span>
                      {Number(billAmount || 0).toLocaleString('en-PK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Rs
                    </span>
                  </div>
                  <div className="send-summary-row">
                    <span>Account</span>
                    <span>
                      {billSource === 'savings' ? 'Savings Account' : 'Current Account'}
                    </span>
                  </div>
                </div>
              </div>

              {payError && <p className="send-error">{payError}</p>}
              {paySuccess && <p className="send-success">{paySuccess}</p>}

              <div className="send-actions">
                <button
                  type="button"
                  className="send-secondary"
                  onClick={() => {
                    if (!paying) setIsPayModalOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="send-primary" disabled={paying}>
                  {paying ? 'Paying...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <header className="modal-header">
              <h3>Add Funds</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  if (!adding) setIsAddModalOpen(false)
                }}
              >
                ×
              </button>
            </header>

            <form
              className="send-form"
              onSubmit={async (event) => {
                event.preventDefault()
                setAddError('')
                setAddSuccess('')

                const numericAmount = Number(addAmount)
                if (Number.isNaN(numericAmount) || numericAmount <= 0) {
                  setAddError('Please enter a valid amount greater than 0.')
                  return
                }

                // Basic required fields by source
                if (addSource === 'debit_card' || addSource === 'credit_card') {
                  if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
                    setAddError('Please fill all card details.')
                    return
                  }
                } else if (addSource === 'bank_transfer') {
                  if (!bankName || !bankAccount) {
                    setAddError('Please provide bank name and account/IBAN.')
                    return
                  }
                }

                try {
                  setAdding(true)
                  const payload = {
                    amount: numericAmount,
                    source: addSource,
                    purpose: addPurpose,
                    cardholder_name: cardholderName || undefined,
                    card_number: cardNumber || undefined,
                    expiry_date: expiryDate || undefined,
                    cvv: cvv || undefined,
                    bank_name: bankName || undefined,
                    bank_account: bankAccount || undefined,
                  }
                  const result = await addFunds(user.username, payload)
                  if (onUserUpdate && result.user) {
                    onUserUpdate(result.user)
                  }
                  setAddSuccess('Funds added successfully.')
                  setAddAmount('')
                  setCardholderName('')
                  setCardNumber('')
                  setExpiryDate('')
                  setCvv('')
                  setBankName('')
                  setBankAccount('')
                  setAddSource('debit_card')
                  setAddPurpose('savings')
                } catch (err) {
                  setAddError(err.message)
                } finally {
                  setAdding(false)
                }
              }}
            >
              <div className="send-grid">
                <div>
                  <h4 className="send-section-title">Amount</h4>
                  <label className="send-field">
                    <span>Amount (in PKR)</span>
                    <input
                      type="number"
                      min="1"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      required
                    />
                  </label>

                  <label className="send-field">
                    <span>Purpose (optional)</span>
                    <select
                      value={addPurpose}
                      onChange={(e) => setAddPurpose(e.target.value)}
                    >
                      <option value="savings">Savings</option>
                      <option value="expenses">Expenses</option>
                      <option value="investment">Investment</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>

                <div>
                  <h4 className="send-section-title">Funding Source</h4>
                  <label className="send-field">
                    <span>Source</span>
                    <select
                      value={addSource}
                      onChange={(e) => setAddSource(e.target.value)}
                    >
                      <option value="debit_card">Debit Card</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </label>

                  {(addSource === 'debit_card' || addSource === 'credit_card') && (
                    <>
                      <label className="send-field">
                        <span>Cardholder Name</span>
                        <input
                          type="text"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                        />
                      </label>
                      <label className="send-field">
                        <span>Card Number</span>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <label className="send-field" style={{ flex: 1 }}>
                          <span>Expiry (MM/YY)</span>
                          <input
                            type="text"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                          />
                        </label>
                        <label className="send-field" style={{ flex: 1 }}>
                          <span>CVV</span>
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                          />
                        </label>
                      </div>
                    </>
                  )}

                  {addSource === 'bank_transfer' && (
                    <>
                      <label className="send-field">
                        <span>Bank Name</span>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                      </label>
                      <label className="send-field">
                        <span>Account / IBAN</span>
                        <input
                          type="text"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                        />
                      </label>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="send-section-title">Summary</h4>
                  <div className="send-summary-row">
                    <span>Amount to add</span>
                    <span>
                      {Number(addAmount || 0).toLocaleString('en-PK', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Rs
                    </span>
                  </div>
                  <div className="send-summary-row">
                    <span>Source</span>
                    <span>
                      {addSource === 'debit_card'
                        ? 'Debit Card'
                        : addSource === 'credit_card'
                        ? 'Credit Card'
                        : 'Bank Transfer'}
                    </span>
                  </div>
                </div>
              </div>

              {addError && <p className="send-error">{addError}</p>}
              {addSuccess && <p className="send-success">{addSuccess}</p>}

              <div className="send-actions">
                <button
                  type="button"
                  className="send-secondary"
                  onClick={() => {
                    if (!adding) setIsAddModalOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="send-primary" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
