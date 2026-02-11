import { useState, useMemo } from 'react'
import '../App.css'
import './user_dashboard.css'
import Sidebar from '../components/Sidebar.jsx'

const BILL_CATEGORIES = ['electricity', 'gas', 'water', 'internet', 'mobile']

function getTxCategory(tx) {
  if (tx.type === 'credit') return 'add_funds'
  if (BILL_CATEGORIES.includes(tx.category)) return 'bills'
  const p = (tx.purpose || '').toLowerCase()
  if (['bill_payment', 'utilities'].includes(p)) return 'utilities'
  if (['shopping'].includes(p)) return 'shopping'
  if (['savings'].includes(p)) return 'savings'
  if (['food'].includes(p)) return 'food'
  if (['family_support', 'other'].includes(p)) return 'transfers'
  if (tx.recipient_name && tx.type === 'debit') return 'transfers'
  return 'other'
}

function getDateRange(dateRangeKey) {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  if (dateRangeKey === 'today') {
    return { start, end }
  }
  if (dateRangeKey === 'last_7') {
    start.setDate(start.getDate() - 6)
    return { start, end }
  }
  if (dateRangeKey === 'this_month') {
    start.setDate(1)
    return { start, end }
  }
  if (dateRangeKey === 'last_month') {
    start.setMonth(start.getMonth() - 1)
    start.setDate(1)
    end.setDate(0)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  }
  return { start: null, end: null }
}

function getAmountBounds(preset, minInput, maxInput) {
  if (minInput !== '' && maxInput !== '') {
    const min = Number(minInput)
    const max = Number(maxInput)
    if (!Number.isNaN(min) && !Number.isNaN(max)) return { min, max }
  }
  if (preset === 'below_1000') return { min: 0, max: 999.99 }
  if (preset === '1000_5000') return { min: 1000, max: 5000 }
  if (preset === 'above_5000') return { min: 5001, max: Infinity }
  return { min: 0, max: Infinity }
}

function Transactions({
  user,
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
}) {
  const rawTransactions = user?.transaction_history || []

  const [typeFilter, setTypeFilter] = useState('all')
  const [dateRangeFilter, setDateRangeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [amountPreset, setAmountPreset] = useState('all')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')

  const filteredTransactions = useMemo(() => {
    let list = rawTransactions.slice().reverse()

    if (typeFilter === 'credit') {
      list = list.filter((tx) => tx.type === 'credit')
    } else if (typeFilter === 'debit') {
      list = list.filter((tx) => tx.type === 'debit')
    }

    if (dateRangeFilter !== 'all') {
      const { start, end } = getDateRange(dateRangeFilter)
      if (start && end) {
        list = list.filter((tx) => {
          if (!tx.created_at) return false
          const d = new Date(tx.created_at)
          return d >= start && d <= end
        })
      }
    }

    if (categoryFilter !== 'all') {
      list = list.filter((tx) => getTxCategory(tx) === categoryFilter)
    }

    const { min: amountMinVal, max: amountMaxVal } = getAmountBounds(
      amountPreset,
      amountMin,
      amountMax
    )
    list = list.filter((tx) => {
      const total = Number(tx.total ?? tx.amount ?? 0)
      return total >= amountMinVal && total <= amountMaxVal
    })

    return list
  }, [
    rawTransactions,
    typeFilter,
    dateRangeFilter,
    categoryFilter,
    amountPreset,
    amountMin,
    amountMax,
  ])

  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
      </header>

      <div className="dashboard-layout">
        <Sidebar
          active="transactions"
          onGoToDashboard={onGoToDashboard}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
          onGoToProfile={onGoToProfile}
        />

        <main className="dashboard-main">
          <section className="transactions-shell">
            <header className="transactions-header">
              <div>
                <h2>All Transactions</h2>
                <p>History of your past transfers. Use filters to narrow down.</p>
              </div>
            </header>

            {rawTransactions.length === 0 ? (
              <p className="transactions-empty">
                No transactions yet. Once you send money, add funds, or pay bills, they will appear
                here.
              </p>
            ) : (
              <>
                <div className="transactions-filters">
                  <div className="transactions-filter-row">
                    <label className="transactions-filter-group">
                      <span className="transactions-filter-label">Type</span>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="transactions-filter-select"
                      >
                        <option value="all">All</option>
                        <option value="credit">Credit (money added)</option>
                        <option value="debit">Debit (money spent)</option>
                      </select>
                    </label>

                    <label className="transactions-filter-group">
                      <span className="transactions-filter-label">Date range</span>
                      <select
                        value={dateRangeFilter}
                        onChange={(e) => setDateRangeFilter(e.target.value)}
                        className="transactions-filter-select"
                      >
                        <option value="all">All time</option>
                        <option value="today">Today</option>
                        <option value="last_7">Last 7 days</option>
                        <option value="this_month">This month</option>
                        <option value="last_month">Last month</option>
                      </select>
                    </label>

                    <label className="transactions-filter-group">
                      <span className="transactions-filter-label">Category</span>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="transactions-filter-select"
                      >
                        <option value="all">All</option>
                        <option value="bills">Bills</option>
                        <option value="shopping">Shopping</option>
                        <option value="savings">Savings</option>
                        <option value="transfers">Transfers</option>
                        <option value="food">Food</option>
                        <option value="utilities">Utilities</option>
                        <option value="add_funds">Add Funds</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                  </div>

                  <div className="transactions-filter-row">
                    <label className="transactions-filter-group">
                      <span className="transactions-filter-label">Amount range</span>
                      <select
                        value={amountPreset}
                        onChange={(e) => setAmountPreset(e.target.value)}
                        className="transactions-filter-select"
                      >
                        <option value="all">All amounts</option>
                        <option value="below_1000">Below 1,000</option>
                        <option value="1000_5000">1,000 – 5,000</option>
                        <option value="above_5000">Above 5,000</option>
                      </select>
                    </label>
                    <label className="transactions-filter-group transactions-filter-amounts">
                      <span className="transactions-filter-label">Min (PKR)</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Min"
                        value={amountMin}
                        onChange={(e) => setAmountMin(e.target.value)}
                        className="transactions-filter-input"
                      />
                    </label>
                    <label className="transactions-filter-group transactions-filter-amounts">
                      <span className="transactions-filter-label">Max (PKR)</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Max"
                        value={amountMax}
                        onChange={(e) => setAmountMax(e.target.value)}
                        className="transactions-filter-input"
                      />
                    </label>
                  </div>
                </div>

                <p className="transactions-filter-result">
                  Showing {filteredTransactions.length} of {rawTransactions.length} transaction
                  {rawTransactions.length !== 1 ? 's' : ''}.
                </p>

                <div className="transactions-table-wrapper">
                  {filteredTransactions.length === 0 ? (
                    <p className="transactions-empty">
                      No transactions match the current filters. Try changing or clearing filters.
                    </p>
                  ) : (
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Date &amp; Time</th>
                          <th>Recipient</th>
                          <th>Purpose</th>
                          <th>Amount (PKR)</th>
                          <th>Fee (PKR)</th>
                          <th>Net Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx, index) => {
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
                            <tr key={index}>
                              <td>
                                {tx.created_at
                                  ? new Date(tx.created_at).toLocaleString()
                                  : '-'}
                              </td>
                              <td>{title}</td>
                              <td>{tx.purpose?.replace('_', ' ') || 'Transfer'}</td>
                              <td>
                                {Number(tx.amount || 0).toLocaleString('en-PK', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td>
                                {Number(tx.fee || 0).toLocaleString('en-PK', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td
                                className={
                                  isDebit
                                    ? 'transactions-total-debit'
                                    : 'transactions-total-credit'
                                }
                              >
                                {isDebit ? '- ' : '+ '}
                                {total.toLocaleString('en-PK', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Transactions
