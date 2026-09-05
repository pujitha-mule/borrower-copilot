import React from 'react'

export function ResultCard({ title, value, badge, sub, explain }) {
  return (
    <div className="result-card">
      {title && <span className="mono-label">{title}</span>}
      {badge && <span className="badge">{badge}</span>}
      {value && <div className="value-large">{value}</div>}
      {sub && <div className="sub">{sub}</div>}
      {explain && <div className="explain">{explain}</div>}
    </div>
  )
}