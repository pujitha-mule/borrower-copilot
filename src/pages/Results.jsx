import React from 'react'
import { ResultCard } from '../components/ResultCard'
import NegotiationCard from '../components/NegotiationCard'

function Results({ answers, results, onRestart }) {
  if (!results) return null

  // ─── ERROR CHECK ────────────────────────────────────────────
  if (results.error) {
    return (
      <div className="results">
        <div className="results-header">
          <div className="logo">
            <span className="logo-icon">⚠️</span>
            <span className="logo-text" style={{ fontSize: '18px' }}>Error</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onRestart}>
            ↻ Start Over
          </button>
        </div>
        <div className="result-card" style={{ background: '#fff6f0', borderColor: '#e8c0b0' }}>
          <h3>{results.error}</h3>
          <p style={{ marginTop: '8px' }}>{results.message}</p>
        </div>
      </div>
    )
  }

  const { 
    affordability, 
    lenderEligibility, 
    rateRange,
    stressTest,
    decision,
    tenureTradeoff
  } = results

  const getBadgeClass = () => {
    if (decision.decision === 'Borrow') return 'badge-green'
    if (decision.decision === 'Borrow less') return 'badge-yellow'
    return 'badge-red'
  }

  const getBadgeText = () => {
    if (decision.decision === 'Borrow') return '🟢 Borrow'
    if (decision.decision === 'Borrow less') return '🟡 Borrow Less'
    return '🔴 Don\'t Borrow'
  }

  return (
    <div className="results">
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="results-header">
        <div className="logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text" style={{ fontSize: '18px' }}>Your borrowing picture</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onRestart}>
          Start over
        </button>
      </div>

      {/* ─── RECOMMENDATION ───────────────────────────────────── */}
      <div className="result-card">
        <span className="mono-label">Should you borrow?</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
          <span className={`badge ${getBadgeClass()}`}>
            {getBadgeText()}
          </span>
        </div>
        <div className="explain">{decision.reason}</div>
      </div>

      {/* ─── AMOUNTS ───────────────────────────────────────────── */}
      <div className="grid-2">
        <div className="result-card">
          <span className="mono-label">LIKELY LENDER SANCTION</span>
          <div className="value-large">
            ₹{(lenderEligibility.lenderLoan || 0).toLocaleString()}
          </div>
          <div className="sub">Estimated rate: {lenderEligibility.lenderRate || '?'}%</div>
          <div className="explain">Based on your income, credit profile, and EMI obligations.</div>
        </div>
        <div className="result-card">
          <span className="mono-label">SAFE BORROWING AMOUNT</span>
          <div className="value-large">
            ₹{(affordability.maxLoan || 0).toLocaleString()}
          </div>
          <div className="sub">Safe EMI: ₹{(affordability.safeEmi || 0).toLocaleString()}/month</div>
          <div className="explain">Keeps your repayment within conservative affordability limits.</div>
        </div>
      </div>

      {/* ─── FAIR RATE ─────────────────────────────────────────── */}
      <div className="result-card">
        <span className="mono-label">Is this lender quote fair?</span>
        <h3>Fair rate</h3>
        <div className="value-large" style={{ fontSize: '36px' }}>
          {rateRange.rateLow || '?'}% – {rateRange.rateHigh || '?'}%
        </div>
        <div className="sub">
          Confidence: {rateRange.confidence || 'Medium'}
        </div>
        <div className="sub" style={{ marginTop: '4px' }}>
          All-in annualized cost: {rateRange.aprLow || '?'}% – {rateRange.aprHigh || '?'}%
        </div>
        <div className="explain">{rateRange.explanation || ''}</div>
      </div>

      {/* ─── SAFE EMI ──────────────────────────────────────────── */}
      <div className="result-card">
        <span className="mono-label">What EMI is comfortable?</span>
        <div className="value-large">
          ₹{(affordability.safeEmi || 0).toLocaleString()}
          <span style={{ fontSize: '20px', color: '#60778F' }}> / month</span>
        </div>
        <div className="sub">Based on {affordability.tenureYears || 5} years tenure</div>
        <div className="explain">Do not exceed this payment to maintain a healthy financial buffer.</div>
      </div>

      {/* ─── TENURE TRADE-OFF ──────────────────────────────────── */}
      {tenureTradeoff && tenureTradeoff.length > 0 && (
        <div className="result-card">
          <span className="mono-label">Tenure trade-off</span>
          <p style={{ color: '#60778F', fontSize: '14px', marginBottom: '12px' }}>
            Shorter tenure = higher EMI, lower total interest
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="tenure-table">
              <thead>
                <tr>
                  <th>Tenure</th>
                  <th>Monthly EMI</th>
                  <th>Total Interest</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenureTradeoff.map((t, i) => (
                  <tr key={i}>
                    <td><strong>{t.tenure} years</strong></td>
                    <td>₹{t.emi.toLocaleString()}</td>
                    <td>₹{t.totalInterest.toLocaleString()}</td>
                    <td>
                      {t.isWithinSafe ? (
                        <span className="tag tag-green">✅ Within safe</span>
                      ) : (
                        <span className="tag tag-red">⚠️ Above safe</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── STRESS TEST ───────────────────────────────────────── */}
      <div className="result-card">
        <span className="mono-label">What if my income drops?</span>
        
        <div className="stress-box">
          <p><strong>Income drops 20%</strong></p>
          <p>
            New income: ₹{stressTest?.newIncome?.toLocaleString() || '?'}/month
          </p>
          <p>
            EMI becomes{' '}
            {stressTest?.surplusPct < 10 ? (
              <span className="danger">risky</span>
            ) : (
              <span className="safe">manageable</span>
            )}
          </p>
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#60778F' }}>
            {stressTest?.explanation || 'Consider building an emergency fund before taking on new debt.'}
          </p>
        </div>

        <div className="stress-box" style={{ marginTop: '12px' }}>
          <p><strong>What if rates rise?</strong></p>
          <p>Rate +2%</p>
          <p>
            New EMI: ₹{stressTest?.newEmi?.toLocaleString() || '?'}/month<br />
            Additional burden: ₹{stressTest?.additionalBurden?.toLocaleString() || '?'}/month
          </p>
        </div>
      </div>

      {/* ─── NEGOTIATION CARD ──────────────────────────────────── */}
      <NegotiationCard 
        answers={answers}
        results={results}
      />
    </div>
  )
}

export default Results