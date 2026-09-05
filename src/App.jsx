import React, { useState } from 'react'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import { DEMO_PROFILES } from './data/borrowerProfiles'
import { calculateAll } from './logic/calculations'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [topic, setTopic] = useState(null)

  const startAssessment = () => {
    setAnswers({})
    setResults(null)
    setTopic(null)
    setCurrentPage('assessment')
  }

  const loadDemo = (profileKey) => {
    const profile = DEMO_PROFILES[profileKey]
    if (!profile) return
    
    const fullAnswers = { ...profile.answers }
    setAnswers(fullAnswers)
    const resultsData = calculateAll(fullAnswers)
    setResults(resultsData)
    setTopic(null)
    setCurrentPage('results')
  }

  const handleTopicSelect = (topicKey) => {
    setTopic(topicKey)
    setAnswers({})
    setResults(null)
    setCurrentPage('assessment')
  }

  const handleComplete = (answersData, resultsData) => {
    setAnswers(answersData)
    setResults(resultsData)
    setCurrentPage('results')
  }

  const goHome = () => {
    setCurrentPage('home')
    setResults(null)
    setAnswers({})
    setTopic(null)
  }

  return (
    <div className="app">
      {currentPage === 'home' && (
        <Home 
          onStart={startAssessment} 
          onLoadDemo={loadDemo}
          onTopicSelect={handleTopicSelect}
        />
      )}
      {currentPage === 'assessment' && (
        <Assessment 
          onComplete={handleComplete} 
          onCancel={goHome}
          initialAnswers={answers}
          topic={topic}
        />
      )}
      {currentPage === 'results' && (
        <Results 
          answers={answers} 
          results={results} 
          onRestart={goHome}
        />
      )}
    </div>
  )
}

export default App