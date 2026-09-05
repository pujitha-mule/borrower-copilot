import React from 'react'

function Home({ onStart, onLoadDemo, onTopicSelect }) {
  return (
    <div className="home">
      {/* ─── HEADER ──────────────────────────────────────────── */}
      <header className="home-header">
        <div className="logo">
          <div className="logo-icon">📊</div>
          <span className="logo-text">Borrower Copilot</span>
          <span className="logo-badge">BETA</span>
        </div>
        <div className="header-right-label">A CLEARER LENDER CONVERSATION</div>
      </header>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-left">
          <span className="mono-label">A CALMER WAY TO BORROW</span>
          <h1>
            Know your<br />
            <span className="highlight">number</span> first.
          </h1>
          <p>
            Borrower Copilot turns the loan conversation into plain language.
            Understand what may be comfortable, what a lender may ask, and what to say next.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-teal" onClick={onStart}>
              Start my assessment →
            </button>
            <button className="btn btn-outline" onClick={onStart}>
              See how it works  &gt;
            </button>
          </div>
          <div className="hero-security">
            🔒 Your answers stay in this browser. No bank account access.
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-card">
            <span className="badge">🛡 Safe zone</span>
            <div className="card-title">YOUR PLAN</div>
            <div className="card-line"></div>
            <div className="card-line medium"></div>
            <div className="card-line short"></div>
            <div className="card-line"></div>
            <div className="card-line medium"></div>
          </div>
        </div>
      </section>

      {/* ─── INFO BANNER ──────────────────────────────────────── */}
      <div className="info-banner">
        <span className="icon">ⓘ</span>
        <p>
          <strong>Rule-based, not a bank or ML model.</strong>
          We use the details you share and transparent affordability rules.
          This is a planning tool, not a sanction or financial advice.
        </p>
      </div>

      {/* ─── START ANYWHERE ──────────────────────────────────── */}
      <section className="start-anywhere">
        <div className="section-header">
          <div>
            <span className="mono-label">START ANYWHERE</span>
            <h2>Bring one good<br />question.</h2>
          </div>
          <p>
            Choose a question to jump into the part of borrowing you want to
            understand first. We will still cover the full picture.
          </p>
        </div>

        <div className="topic-grid">
          <button 
            className="topic-card teal" 
            onClick={() => onTopicSelect('affordability')}
          >
            <span className="icon">💳</span>
            <h3>How much can I safely borrow?</h3>
            <p>Start with affordability</p>
            <span className="arrow">→</span>
          </button>

          <button 
            className="topic-card" 
            onClick={() => onTopicSelect('rate')}
          >
            <span className="icon">📊</span>
            <h3>Is this lender quote fair?</h3>
            <p>Compare the real cost</p>
            <span className="arrow">→</span>
          </button>

          <button 
            className="topic-card" 
            onClick={() => onTopicSelect('stress')}
          >
            <span className="icon">📉</span>
            <h3>What if my income drops?</h3>
            <p>Plan for a harder month</p>
            <span className="arrow">→</span>
          </button>

          <button 
            className="topic-card teal" 
            onClick={() => onTopicSelect('negotiate')}
          >
            <span className="icon">💞</span>
            <h3>How do I negotiate?</h3>
            <p>Go in prepared</p>
            <span className="arrow">→</span>
          </button>
        </div>
      </section>

      {/* ─── DEMO SECTION ────────────────────────────────────── */}
      <section className="demo-section">
        <div className="section-header">
          <div>
            <span className="mono-label">SEE THE SHAPE OF IT</span>
            <h2>Try a demo<br />borrower.</h2>
          </div>
          <p>
            These examples show the kind of honest answer the Copilot gives.
            Use one as a starting point, then run your own.
          </p>
        </div>

        <div className="demo-grid">
          <button className="demo-card" onClick={() => onLoadDemo('priya')}>
            <div className="initials">PS</div>
            <div className="name">Priya Sharma</div>
            <div className="desc">Salaried • Bengaluru • stable income</div>
            <div className="load-link">Load profile →</div>
          </button>

          <button className="demo-card" onClick={() => onLoadDemo('ravi')}>
            <div className="initials">RM</div>
            <div className="name">Ravi Menon</div>
            <div className="desc">Self-employed • Kochi • growing business</div>
            <div className="load-link">Load profile →</div>
          </button>

          <button className="demo-card" onClick={() => onLoadDemo('anita')}>
            <div className="initials">AK</div>
            <div className="name">Anita Kumari</div>
            <div className="desc">Variable income • Jaipur • careful planning</div>
            <div className="load-link">Load profile →</div>
          </button>
        </div>
      </section>

      {/* ─── FOOTNOTE ────────────────────────────────────────── */}
      <div className="footnote">
        <span className="icon">ⓘ</span>
        Borrower Copilot is an educational, rule-based planning tool.
        It is not a lender, broker, credit bureau, or substitute for professional advice.
        Lenders make their own decisions and may use different policies.
      </div>
    </div>
  )
}

export default Home