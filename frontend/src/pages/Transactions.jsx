import '../App.css'
import './user_dashboard.css'
import Sidebar from '../components/Sidebar.jsx'

function Transactions({
  user,
  onGoToDashboard,
  onGoToVoiceAssistant,
  onGoToAiAdvisor,
  onGoToTransactions,
  onGoToProfile,
}) {
  const transactions = user?.transaction_history || []

  return (
    <div className="landing">
      <header className="header">
        <img className="header-logo" src="/logo.png" alt="SecureSpend" />
      </header>

      <div className="dashboard-layout">
        {/* Sidebar (same as dashboard) */}
        <Sidebar
          active="transactions"
          onGoToDashboard={onGoToDashboard}
          onGoToVoiceAssistant={onGoToVoiceAssistant}
          onGoToAiAdvisor={onGoToAiAdvisor}
          onGoToTransactions={onGoToTransactions}
          onGoToProfile={onGoToProfile}
        />

        {/* Main content */}
        <main className="dashboard-main">
          <section className="transactions-shell">
            <header className="transactions-header">
              <div>
                <h2>All Transactions</h2>
                <p>History of your past transfers.</p>
              </div>
            </header>

            {transactions.length === 0 ? (
              <p className="transactions-empty">
                No transactions yet. Once you send money, they will appear here.
              </p>
            ) : (
              <div className="transactions-table-wrapper">
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
                    {transactions
                      .slice()
                      .reverse()
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
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Transactions