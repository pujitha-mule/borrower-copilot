import React, { useState } from 'react'
import { getFilteredQuestions } from '../logic/questions'
import { calculateAll } from '../logic/calculations'

function Assessment({ onComplete, onCancel, initialAnswers, topic }) {
  const [answers, setAnswers] = useState(initialAnswers || {})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  
  const filteredQuestions = getFilteredQuestions(answers)
  const totalQuestions = filteredQuestions.length
  const currentQuestion = filteredQuestions[currentIndex]
  
  const progress = totalQuestions > 0 ? ((currentIndex) / totalQuestions) * 100 : 0

  const handleAnswer = (value) => {
    if (currentQuestion) {
      setAnswers({ ...answers, [currentQuestion.id]: value })
    }
  }

  const handleNext = () => {
    if (!currentQuestion) return
    
    // Get the value based on question type
    let value = answers[currentQuestion.id] || ''
    
    // If it's a select type and no value is selected, show error
    if (currentQuestion.type === 'select' && !value) {
      // Highlight the options to show user needs to select
      const options = document.querySelectorAll('.option-card')
      options.forEach(el => {
        el.style.borderColor = '#e74c3c'
        setTimeout(() => {
          el.style.borderColor = ''
        }, 1500)
      })
      return
    }
    
    // For number/text types, get value from input
    if (currentQuestion.type === 'number' || currentQuestion.type === 'text') {
      const input = document.getElementById('qInput')
      if (input) {
        value = input.value
      }
    }
    
    if (!currentQuestion.optional && !value) {
      return
    }
    
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)
    
    if (currentIndex < totalQuestions - 1) {
      const newFiltered = getFilteredQuestions(newAnswers)
      const currentId = currentQuestion.id
      const newIndex = newFiltered.findIndex(q => q.id === currentId)
      if (newIndex === -1) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(Math.min(newIndex + 1, newFiltered.length - 1))
      }
    } else {
      const results = calculateAll(newAnswers)
      onComplete(newAnswers, results)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleCancel = () => {
    if (Object.keys(answers).length > 0) {
      setShowCancelConfirm(true)
    } else {
      onCancel()
    }
  }

  const confirmCancel = () => {
    setShowCancelConfirm(false)
    onCancel()
  }

  if (!currentQuestion) {
    return <div className="assessment"><p>Loading...</p></div>
  }

  const renderInput = () => {
    const val = answers[currentQuestion.id] || ''
    
    if (currentQuestion.type === 'select') {
      return (
        <div className="options-grid">
          {currentQuestion.options.map(opt => (
            <button
              key={opt}
              className={`option-card ${val === opt ? 'selected' : ''}`}
              onClick={() => {
                handleAnswer(opt)
                // Auto-advance after selection for better UX
                setTimeout(handleNext, 300)
              }}
              type="button"
            >
              <div className="option-main">{opt}</div>
            </button>
          ))}
        </div>
      )
    }
    
    if (currentQuestion.type === 'number') {
      return (
        <input
          id="qInput"
          className="input-field"
          type="number"
          value={val}
          onChange={(e) => handleAnswer(e.target.value)}
          placeholder="e.g. 450000"
          min={currentQuestion.min}
          max={currentQuestion.max}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          autoFocus
        />
      )
    }
    
    return (
      <input
        id="qInput"
        className="input-field"
        type="text"
        value={val}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder={currentQuestion.placeholder}
        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
        autoFocus
      />
    )
  }

  // ─── CANCEL CONFIRMATION ──────────────────────────────────
  if (showCancelConfirm) {
    return (
      <div className="assessment">
        <div className="assessment-header">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text" style={{ fontSize: '18px' }}>Borrower Copilot</span>
          </div>
        </div>
        <div style={{ 
          maxWidth: '480px', 
          margin: '80px auto',
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #CFDCE6'
        }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', marginBottom: '8px' }}>
            Are you sure?
          </h2>
          <p style={{ color: '#60778F', marginBottom: '24px' }}>
            Your assessment progress will be lost.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => setShowCancelConfirm(false)}>
              Stay
            </button>
            <button className="btn btn-teal" onClick={confirmCancel}>
              Leave assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="assessment">
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="assessment-header">
        <button className="btn btn-outline btn-sm" onClick={handleCancel}>
          ← Home
        </button>
        <div className="assessment-progress">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* ─── QUESTION ─────────────────────────────────────────── */}
      <div className="question-area">
        <span className="mono-label">YOUR BORROWING PICTURE</span>
        <div className="question-label">{currentQuestion.label}</div>
        {currentQuestion.desc && (
          <div className="question-desc">{currentQuestion.desc}</div>
        )}
        {renderInput()}
        {currentQuestion.optional && (
          <div style={{ color: '#60778F', fontSize: '14px', marginTop: '8px' }}>
            Optional — skip if not sure
          </div>
        )}
      </div>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <div className="assessment-footer">
        <div className="footer-left">
          <span className="security-icon">🛡</span>
          <span className="security-text">No credit check. No lender connection.</span>
        </div>
        <div className="footer-right">
          <button className="btn btn-outline btn-sm" onClick={handleCancel}>
            Cancel
          </button>
          {currentIndex > 0 && (
            <button className="btn btn-outline btn-sm" onClick={handleBack}>
              ← Back
            </button>
          )}
          <button 
            className="btn btn-teal" 
            onClick={handleNext}
            disabled={currentQuestion.type === 'select' && !answers[currentQuestion.id]}
          >
            {currentIndex === totalQuestions - 1 ? 'See my results →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Assessment