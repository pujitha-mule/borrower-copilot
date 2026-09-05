import React, { useState, useEffect } from 'react'
import { getFilteredQuestions } from '../logic/questions'
import { calculateAll } from '../logic/calculations'

function Assessment({ onComplete, onCancel, initialAnswers }) {
  const [answers, setAnswers] = useState(initialAnswers || {})
  const [currentQuestionId, setCurrentQuestionId] = useState(null)
  const [error, setError] = useState('')

  // Get the list of questions based on current answers
  const filteredQuestions = getFilteredQuestions(answers)
  const totalQuestions = filteredQuestions.length

  // Find current question by ID
  const currentQuestion = currentQuestionId
    ? filteredQuestions.find(q => q.id === currentQuestionId)
    : filteredQuestions[0]

  const currentIndex = currentQuestion
    ? filteredQuestions.findIndex(q => q.id === currentQuestion.id)
    : 0

  const progress = totalQuestions > 0
    ? ((currentIndex + 1) / totalQuestions) * 100
    : 0

  // ─── useEffect to handle adaptive navigation ──────────────
  useEffect(() => {
    if (filteredQuestions.length === 0) {
      setCurrentQuestionId(null)
      return
    }

    if (!currentQuestionId) {
      setCurrentQuestionId(filteredQuestions[0].id)
      return
    }

    const stillExists = filteredQuestions.some(
      q => q.id === currentQuestionId
    )

    if (!stillExists) {
      setCurrentQuestionId(filteredQuestions[0].id)
    }
  }, [currentQuestionId, totalQuestions])

  const handleAnswer = (value) => {
    if (!currentQuestion) return

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))

    setError('')
  }

  // ─── FIXED: handleNext with adaptive recalculation ──────────
  const handleNext = () => {
    if (!currentQuestion) return

    const value = answers[currentQuestion.id] ?? ''

    // Required questions cannot be skipped
    if (!currentQuestion.optional && String(value).trim() === '') {
      setError('Please select or enter an answer to continue.')
      return
    }

    setError('')

    // Save the current answer first
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    }

    setAnswers(newAnswers)

    // IMPORTANT: Recalculate the question list using the NEW answers.
    // This makes adaptive questions appear in the correct order.
    const newFilteredQuestions = getFilteredQuestions(newAnswers)

    const newCurrentIndex = newFilteredQuestions.findIndex(
      q => q.id === currentQuestion.id
    )

    // Current question somehow disappeared
    if (newCurrentIndex === -1) {
      if (newFilteredQuestions.length > 0) {
        setCurrentQuestionId(newFilteredQuestions[0].id)
      }
      return
    }

    // There is another question
    if (newCurrentIndex < newFilteredQuestions.length - 1) {
      const nextQuestion = newFilteredQuestions[newCurrentIndex + 1]
      setCurrentQuestionId(nextQuestion.id)
      return
    }

    // ─────────────────────────────────────────
    // FINAL QUESTION → CALCULATE RESULTS
    // ─────────────────────────────────────────

    const hasIncome = newAnswers.netMonthlyIncome &&
      Number(newAnswers.netMonthlyIncome) > 0

    const hasAmount = newAnswers.amountWanted &&
      Number(newAnswers.amountWanted) > 0

    if (!hasIncome || !hasAmount) {
      const missing = []
      if (!hasIncome) missing.push('monthly income')
      if (!hasAmount) missing.push('loan amount')
      setError(`Please enter your ${missing.join(' and ')} before seeing results.`)
      return
    }

    const results = calculateAll(newAnswers)
    onComplete(newAnswers, results)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevQuestion = filteredQuestions[currentIndex - 1]
      setCurrentQuestionId(prevQuestion.id)
      setError('')
    }
  }

  const handleCancel = () => {
    if (Object.keys(answers).length > 0) {
      if (window.confirm('Are you sure? Your assessment progress will be lost.')) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  if (!currentQuestion || filteredQuestions.length === 0) {
    return (
      <div className="assessment">
        <div className="assessment-header">
          <button className="btn btn-outline btn-sm" onClick={handleCancel}>
            ← Home
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p>Loading questions...</p>
        </div>
      </div>
    )
  }

  const value = answers[currentQuestion.id] ?? ''

  const renderInput = () => {
    if (currentQuestion.type === 'select') {
      return (
        <div className="options-grid">
          {currentQuestion.options.map(option => (
            <button
              key={option}
              className={`option-card ${value === option ? 'selected' : ''}`}
              onClick={() => {
                handleAnswer(option)
                // NO auto-advance - user must click Continue
              }}
              type="button"
            >
              <div className="option-main">{option}</div>
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
          value={value}
          onChange={(e) => handleAnswer(e.target.value)}
          placeholder={currentQuestion.placeholder || 'Enter amount'}
          min={currentQuestion.min}
          max={currentQuestion.max}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNext()
            }
          }}
          autoFocus
        />
      )
    }

    return (
      <input
        id="qInput"
        className="input-field"
        type="text"
        value={value}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder={currentQuestion.placeholder || 'Enter your answer'}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleNext()
          }
        }}
        autoFocus
      />
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
        {error && (
          <div style={{
            color: '#c62828',
            marginTop: '12px',
            fontSize: '14px',
            padding: '10px 16px',
            background: '#fde8e8',
            borderRadius: '8px',
            border: '1px solid #f5c6c6'
          }}>
            {error}
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
          <button className="btn btn-teal" onClick={handleNext}>
            {currentIndex === totalQuestions - 1 ? 'See my results →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Assessment