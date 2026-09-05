import React from 'react'

function NegotiationCard({ answers, results }) {
  const { decision, affordability, lenderEligibility, rateRange } = results
  
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="result-card" style={{ 
      background: '#14283D', 
      borderColor: '#243B50',
      color: 'white'
    }}>
      <span className="mono-label" style={{ color: '#8AB4C0' }}>How do I negotiate?</span>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
        <div>
          <div style={{ color: '#9ABAC2', fontSize: '13px' }}>Borrowing recommendation</div>
          <div style={{ fontWeight: '700', fontSize: '18px', color: '#ffd966' }}>
            {decision.decision === 'Borrow' ? '🟢 Borrow' :
             decision.decision === 'Borrow less' ? '🟡 Borrow Less' : '🔴 Don\'t Borrow'}
          </div>
        </div>
        <div>
          <div style={{ color: '#9ABAC2', fontSize: '13px' }}>Requested amount</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            ₹{(Number(answers.amountWanted) || 0).toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: '#9ABAC2', fontSize: '13px' }}>Recommended maximum</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            ₹{(affordability.maxLoan || 0).toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: '#9ABAC2', fontSize: '13px' }}>Maximum EMI</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            ₹{(affordability.safeEmi || 0).toLocaleString()}/month
          </div>
        </div>
        <div>
          <div style={{ color: '#9ABAC2', fontSize: '13px' }}>Fair interest rate</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            {rateRange.rateLow || '?'}% – {rateRange.rateHigh || '?'}%
          </div>
        </div>
        <div>
          <div style={{ color: '#9ABAC2', fontSize: '13px' }}>All-in annualized cost</div>
          <div style={{ fontWeight: '700', fontSize: '18px' }}>
            {rateRange.aprLow || '?'}% – {rateRange.aprHigh || '?'}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ color: '#9ABAC2', fontSize: '13px' }}>Ask the lender:</div>
        <p style={{ color: 'white', fontSize: '15px', fontStyle: 'italic' }}>
          "Please explain all processing fees and charges so I can compare the all-in cost."
        </p>
        <p style={{ color: '#8AB4C0', fontSize: '13px', marginTop: '8px' }}>
          <strong>Why?</strong> Based on my income, current obligations, and financial safety buffer.
          {answers.loanGeneratesIncome && answers.loanGeneratesIncome.includes('generates income') && 
            ' This loan helps generate income.'}
        </p>
      </div>

      <div className="btn-group" style={{ marginTop: '18px' }}>
        <button className="btn btn-sm" style={{ 
          background: 'rgba(255,255,255,0.15)', 
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)'
        }} onClick={handlePrint}>
          🖨️ Print / Save
        </button>
      </div>
    </div>
  )
}

export default NegotiationCard