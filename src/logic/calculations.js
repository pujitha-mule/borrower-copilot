// Helper functions
function getCreditScore(answers) {
  const known = answers.creditScoreKnown
  if (known === 'Yes, I know it' && answers.creditScore) {
    return Number(answers.creditScore)
  }
  return null
}

function getCollateral(answers) {
  const val = answers.collateralValue
  if (val && Number(val) > 0) return Number(val)
  return null
}

function getCoApplicantIncome(answers) {
  const val = answers.coApplicantIncome
  if (val && Number(val) > 0) return Number(val)
  return 0
}

function getCoApplicantMultiplier(answers) {
  const contribution = answers.coApplicantContribution || ''
  if (contribution === 'Yes, fully') return 1.0
  if (contribution === 'Partially') return 0.5
  return 0
}

function getEffectiveIncome(answers) {
  const base = Number(answers.netMonthlyIncome) || 0
  const co = getCoApplicantIncome(answers)
  const multiplier = getCoApplicantMultiplier(answers)
  return base + (co * multiplier)
}

function getIncomeStabilityFactor(answers) {
  const stable = answers.incomeStability || ''
  if (stable === 'Very stable') return 1.0
  if (stable === 'Moderately stable') return 0.9
  if (stable === 'Variable') return 0.75
  if (stable === 'Unstable / irregular') return 0.6
  return 0.7
}

function getEmergencySavingsMonths(answers) {
  const val = answers.emergencySavings || ''
  if (val === '6+ months') return 6
  if (val === '3–6 months') return 4.5
  if (val === '1–3 months') return 2
  return 0
}

function getBouncePenalty(answers) {
  const bounces = answers.previousBounces || ''
  if (bounces === 'No bounces') return 0
  if (bounces === '1 bounce') return 0.15
  if (bounces === '2+ bounces') return 0.30
  return 0
}

function getIncomeTypeMultiplier(answers) {
  const type = answers.incomeType || ''
  if (type === 'Salaried') return 1.0
  if (type === 'Self-employed') return 0.85
  if (type === 'Informal / Variable') return 0.6
  return 0.8
}

function getHighInterestDebt(answers) {
  const hasHighInterest = answers.hasHighInterestDebt || 'No'
  if (hasHighInterest === 'Yes') {
    return {
      amount: Number(answers.highInterestDebtAmount) || 0,
      rate: Number(answers.highInterestDebtRate) || 0,
      includedInEMI: answers.highInterestIncludedInEMI === 'Yes, already included'
    }
  }
  return null
}

function getDocumentedIncome(answers) {
  const val = answers.documentedAnnualIncome
  if (val && Number(val) > 0) return Number(val)
  return null
}

export function calculateAffordability(answers) {
  const income = Number(answers.netMonthlyIncome) || 0
  const coIncome = getCoApplicantIncome(answers)
  const coMultiplier = getCoApplicantMultiplier(answers)
  const effectiveCoIncome = coIncome * coMultiplier
  const totalIncome = income + effectiveCoIncome
  
  const emis = Number(answers.existingEmis) || 0
  const expenses = Number(answers.householdExpenses) || 0

  const highInterestDebt = getHighInterestDebt(answers)
  let highInterestEmi = 0
  let hasHighInterestDebtRisk = false
  
  if (highInterestDebt && highInterestDebt.amount > 0 && highInterestDebt.rate > 0) {
    if (highInterestDebt.rate >= 24) {
      hasHighInterestDebtRisk = true
    }
    if (!highInterestDebt.includedInEMI) {
      const monthlyRate = highInterestDebt.rate / 100 / 12
      const tenure = 36
      highInterestEmi = highInterestDebt.amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1)
    }
  }

  const totalEmis = emis + highInterestEmi

  const typeMultiplier = getIncomeTypeMultiplier(answers)
  const maxSafeFOIR = 0.45 * typeMultiplier
  const maxTotalEmi = totalIncome * maxSafeFOIR
  const availableForNewEmi = Math.max(0, maxTotalEmi - totalEmis)

  const surplus = totalIncome - totalEmis - expenses
  const safeSurplus = totalIncome * 0.30
  const surplusAfterBuffer = surplus - safeSurplus

  let safeEmi = Math.min(availableForNewEmi, Math.max(0, surplusAfterBuffer))

  const stabilityFactor = getIncomeStabilityFactor(answers)
  safeEmi = safeEmi * stabilityFactor

  const emMonths = getEmergencySavingsMonths(answers)
  if (emMonths === 0) safeEmi = safeEmi * 0.7
  else if (emMonths < 2) safeEmi = safeEmi * 0.85

  const bouncePenalty = getBouncePenalty(answers)
  safeEmi = safeEmi * (1 - bouncePenalty)

  if (hasHighInterestDebtRisk) {
    safeEmi = safeEmi * 0.85
  }

  const upcomingExpenses = answers.upcomingExpenses || ''
  if (upcomingExpenses === 'Yes, planned') {
    safeEmi = safeEmi * 0.9
  } else if (upcomingExpenses === 'Yes, uncertain but possible') {
    safeEmi = safeEmi * 0.85
  }

  const utilization = answers.creditCardUtilization || ''
  if (utilization === '60–90% (high)') {
    safeEmi = safeEmi * 0.9
  } else if (utilization === '90%+ (very high)') {
    safeEmi = safeEmi * 0.8
  }

  const absoluteCap = totalIncome * 0.40
  safeEmi = Math.min(safeEmi, absoluteCap)

  const ageNum = Number(answers.age) || 30
  const MAX_AGE_AT_MATURITY = 60
  const MAX_LOAN_TENURE_MONTHS = 60
  
  const monthsUntilMaxAge = (MAX_AGE_AT_MATURITY - ageNum) * 12
  const tenureMonths = Math.max(12, Math.min(MAX_LOAN_TENURE_MONTHS, monthsUntilMaxAge))

  const rate = 0.10
  let maxLoan = 0
  if (rate > 0 && tenureMonths > 0 && safeEmi > 0) {
    const monthlyRate = rate / 12
    maxLoan = safeEmi * (1 - Math.pow(1 + monthlyRate, -tenureMonths)) / monthlyRate
  }

  return {
    safeEmi: Math.round(Math.max(0, safeEmi) * 100) / 100,
    maxLoan: Math.round(Math.max(0, maxLoan)),
    tenureMonths: tenureMonths,
    tenureYears: Math.round((tenureMonths / 12) * 10) / 10,
    totalIncome: totalIncome,
    disposableIncome: Math.max(0, totalIncome - totalEmis - expenses),
    highInterestEmi: Math.round(highInterestEmi * 100) / 100,
    maxSafeFOIR: Math.round(maxSafeFOIR * 100)
  }
}

export function calculateLenderEligibility(answers) {
  const totalIncome = getEffectiveIncome(answers)
  const emis = Number(answers.existingEmis) || 0
  const loanTypeRaw = answers.loanType || 'Personal loan'
  const loanType = loanTypeRaw.toLowerCase()
  const creditScore = getCreditScore(answers)
  const collateral = getCollateral(answers)
  const documentedIncome = getDocumentedIncome(answers)
  const incomeType = answers.incomeType || ''

  const lenderFOIR = 0.55
  const maxEmi = totalIncome * lenderFOIR
  const availableEmi = Math.max(0, maxEmi - emis)

  let rate = 0.11
  if (loanType.includes('loan against property') || loanType.includes('home loan')) rate = 0.085
  else if (loanType.includes('gold loan')) rate = 0.09
  else if (loanType.includes('business loan')) rate = 0.12
  else if (loanType.includes('vehicle loan')) rate = 0.095
  else rate = 0.11

  if (creditScore) {
    if (creditScore >= 750) rate -= 0.005
    else if (creditScore >= 700) rate -= 0.002
    else if (creditScore >= 650) rate += 0.005
    else rate += 0.015
  }

  // Documented income adjustment for self-employed borrowers
  if (documentedIncome && incomeType === 'Self-employed') {
    const documentedMonthly = documentedIncome / 12
    const statedIncome = Number(answers.netMonthlyIncome) || 0
    if (documentedMonthly < statedIncome * 0.6) {
      rate += 0.01
    } else if (documentedMonthly >= statedIncome * 0.9) {
      rate -= 0.005
    }
  }

  let collateralLoan = 0
  if (collateral && collateral > 0) {
    rate -= 0.01
    collateralLoan = collateral * 0.60
  }

  const tenure = 60
  const monthlyRate = rate / 12
  let pv = 0
  if (rate > 0 && tenure > 0 && availableEmi > 0) {
    pv = availableEmi * (1 - Math.pow(1 + monthlyRate, -tenure)) / monthlyRate
  }

  const lenderLoan = collateral && collateral > 0 ? Math.min(pv, collateralLoan) : pv

  return {
    lenderLoan: Math.round(Math.max(0, lenderLoan)),
    lenderRate: Math.round(rate * 100 * 10) / 10,
    availableEmi: Math.round(availableEmi * 100) / 100
  }
}

export function getFairRateRange(answers) {
  const creditScore = getCreditScore(answers)
  const loanTypeRaw = answers.loanType || 'Personal loan'
  const loanType = loanTypeRaw.toLowerCase()
  const incomeType = answers.incomeType || ''
  const collateral = getCollateral(answers)
  const incomeStability = answers.incomeStability || ''
  const emis = Number(answers.existingEmis) || 0
  const income = Number(answers.netMonthlyIncome) || 0
  const documentedIncome = getDocumentedIncome(answers)

  let base = 10.5
  if (loanType.includes('loan against property') || loanType.includes('home loan')) base = 8.5
  else if (loanType.includes('gold loan')) base = 9.0
  else if (loanType.includes('business loan')) base = 11.0
  else if (loanType.includes('vehicle loan')) base = 9.5
  else base = 10.5

  let adj = 0
  if (creditScore) {
    if (creditScore >= 750) adj = -1.5
    else if (creditScore >= 700) adj = -0.5
    else if (creditScore >= 650) adj = 0.5
    else if (creditScore >= 600) adj = 1.5
    else adj = 3.0
  }

  if (incomeType === 'Informal / Variable') adj += 1.5
  else if (incomeType === 'Self-employed') adj += 0.5

  if (incomeStability === 'Very stable') adj -= 0.5
  else if (incomeStability === 'Unstable / irregular') adj += 1.5
  else if (incomeStability === 'Variable') adj += 0.5

  if (collateral && collateral > 0) adj -= 1.0

  // Documented income adjustment for self-employed
  if (documentedIncome && incomeType === 'Self-employed') {
    const documentedMonthly = documentedIncome / 12
    const statedIncome = Number(income) || 0
    if (documentedMonthly < statedIncome * 0.6) {
      adj += 0.5
    } else if (documentedMonthly >= statedIncome * 0.9) {
      adj -= 0.25
    }
  }

  const monthlyIncome = Number(income) || 0
  const foir = monthlyIncome > 0 ? (emis / monthlyIncome) * 100 : 0
  if (foir > 50) adj += 1.5
  else if (foir > 40) adj += 0.5

  let low = base + adj - 1.0
  let high = base + adj + 1.5
  
  if (!creditScore) {
    low = low - 0.5
    high = high + 0.5
  }
  
  if (low < 6) low = 6
  if (high < 8) high = 8
  if (high > 28) high = 28
  if (low > 26) low = 26

  const procFeePct = loanType.includes('loan against property') || loanType.includes('home loan') ? 1.0 : 2.5
  const aprLow = low + procFeePct * 0.7
  const aprHigh = high + procFeePct * 1.0

  let confidence = 'High'
  let confidenceReason = 'Complete information provided.'
  
  if (!creditScore) {
    confidence = 'Medium'
    confidenceReason = 'Credit score unknown — range is wider.'
  }
  if (!answers.incomeStability) {
    confidence = 'Medium'
    confidenceReason = 'Income stability unknown.'
  }
  if (!answers.emergencySavings) {
    confidence = 'Medium'
    confidenceReason = 'Emergency savings unknown.'
  }
  if (documentedIncome && incomeType === 'Self-employed' && documentedIncome / 12 < (Number(answers.netMonthlyIncome) || 0) * 0.6) {
    confidence = 'Medium'
    confidenceReason = 'Documented income significantly lower than stated income.'
  }
  if (!creditScore && !answers.incomeStability && !answers.emergencySavings) {
    confidence = 'Low'
    confidenceReason = 'Multiple key factors unknown — range is conservative.'
  }

  return {
    rateLow: Math.round(low * 10) / 10,
    rateHigh: Math.round(high * 10) / 10,
    aprLow: Math.round(aprLow * 10) / 10,
    aprHigh: Math.round(aprHigh * 10) / 10,
    procFeePct: procFeePct,
    confidence: confidence,
    explanation: confidenceReason
  }
}

export function calculateStressTest(answers, safeEmi) {
  const income = Number(answers.netMonthlyIncome) || 0
  const coIncome = getCoApplicantIncome(answers)
  const coMultiplier = getCoApplicantMultiplier(answers)
  const effectiveCoIncome = coIncome * coMultiplier
  const totalIncome = income + effectiveCoIncome
  
  const emis = Number(answers.existingEmis) || 0
  const expenses = Number(answers.householdExpenses) || 0
  
  const highInterestDebt = getHighInterestDebt(answers)
  let highInterestEmi = 0
  if (highInterestDebt && highInterestDebt.amount > 0 && highInterestDebt.rate > 0) {
    if (!highInterestDebt.includedInEMI) {
      const monthlyRate = highInterestDebt.rate / 100 / 12
      const tenure = 36
      highInterestEmi = highInterestDebt.amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1)
    }
  }
  const totalEmis = emis + highInterestEmi

  const stressedIncome = totalIncome * 0.8
  const stressedSurplus = stressedIncome - totalEmis - expenses - safeEmi
  const stressedSurplusPct = stressedIncome > 0 ? (stressedSurplus / stressedIncome) * 100 : 0

  const currentRate = 0.10
  const newRate = currentRate + 0.02
  const tenureMonths = 60
  let newEmi = safeEmi
  if (newRate > 0 && tenureMonths > 0 && safeEmi > 0) {
    const monthlyRate = newRate / 12
    const currentMonthlyRate = currentRate / 12
    const loanAmount = safeEmi * (1 - Math.pow(1 + currentMonthlyRate, -tenureMonths)) / currentMonthlyRate
    newEmi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  }

  return {
    newIncome: Math.round(stressedIncome),
    surplus: Math.round(stressedSurplus),
    surplusPct: Math.round(stressedSurplusPct * 10) / 10,
    newEmi: Math.round(newEmi * 100) / 100,
    additionalBurden: Math.round((newEmi - safeEmi) * 100) / 100,
    explanation: stressedSurplusPct < 10 ? 
      '⚠️ A 20% income drop would make this EMI risky. Consider a smaller loan or building emergency savings.' :
      '✅ Even with a 20% income drop, you would have some buffer.'
  }
}

// ─── FIXED: RECOMMENDATION WITH SECURED ROUTE FIRST ─────────────

export function getRecommendation(answers, affordability, lenderEligibility) {
  const wanted = Number(answers.amountWanted) || 0
  const safe = affordability.maxLoan || 0
  const lender = lenderEligibility.lenderLoan || 0

  const loanTypeRaw = answers.loanType || ''
  const loanType = loanTypeRaw.toLowerCase()

  const hasBounces =
    answers.previousBounces === '1 bounce' ||
    answers.previousBounces === '2+ bounces'

  const hasNoSavings =
    answers.emergencySavings === '0 months'

  const hasHighInterestDebt =
    answers.hasHighInterestDebt === 'Yes'

  const highExistingDebt =
    (Number(answers.existingEmis) || 0) >
    (Number(answers.netMonthlyIncome) || 0) * 0.4

  const isSecured =
    loanType.includes('loan against property') ||
    loanType.includes('home loan') ||
    loanType.includes('gold loan') ||
    loanType.includes('vehicle loan')

  const collateral =
    Number(answers.collateralValue) || 0

  const generatesIncome =
    answers.loanGeneratesIncome === 'Yes, directly generates income' ||
    answers.loanGeneratesIncome === 'Partly'

  // ──────────────────────────────────────────────────────────────
  // 1. HARD DON'T-BORROW SAFETY FLAGS
  // ──────────────────────────────────────────────────────────────

  if (hasBounces && hasNoSavings && highExistingDebt) {
    return {
      decision: "Don't borrow",
      reason:
        '⚠️ Recent EMI bounces, no emergency savings, and high existing debt make new borrowing risky.'
    }
  }

  if (hasHighInterestDebt && hasBounces) {
    return {
      decision: "Don't borrow",
      reason:
        '⚠️ High-interest debt combined with EMI bounces suggests you should stabilize existing debt before borrowing more.'
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 2. SECURED PRODUCT ROUTE (MOVED EARLIER)
  // ──────────────────────────────────────────────────────────────
  // Collateral gives the lender additional security.
  // For a productive business loan against property,
  // allow the secured route when the requested amount
  // is within the lender's estimated secured capacity.

  if (isSecured && collateral > 0) {
    const collateralLimit = collateral * 0.60
    const securedLenderLimit = Math.min(
      lender > 0 ? lender : Infinity,
      collateralLimit
    )

    if (wanted <= securedLenderLimit && generatesIncome && !hasBounces) {
      return {
        decision: 'Borrow',
        reason:
          `✅ A secured ${answers.loanType} is appropriate for your profile. ` +
          `Your ₹${wanted.toLocaleString()} request is within the estimated ` +
          `secured lending capacity of ~₹${Math.round(securedLenderLimit).toLocaleString()}. ` +
          `The loan is intended to generate income, which supports the borrowing case.`
      }
    }

    // Fallback: even if slightly above safe, but within lender limit
    if (wanted <= lender && generatesIncome && !hasBounces) {
      return {
        decision: 'Borrow',
        reason:
          `✅ The secured loan route is reasonable because you have collateral and the borrowing is intended to generate income. ` +
          `Estimated lender capacity is ~₹${Math.round(lender).toLocaleString()}.`
      }
    }

    // Secured but requested too high
    if (wanted > securedLenderLimit) {
      return {
        decision: 'Borrow less',
        reason:
          `While a secured loan is appropriate, your requested amount of ₹${wanted.toLocaleString()} ` +
          `exceeds the estimated secured lending capacity of ~₹${Math.round(securedLenderLimit).toLocaleString()}. ` +
          `Consider reducing your request or increasing collateral.`
      }
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 3. LARGE GAP BETWEEN REQUEST AND BOTH LIMITS
  // ──────────────────────────────────────────────────────────────

  if (wanted > lender * 1.2 && wanted > safe * 1.2) {
    return {
      decision: "Don't borrow",
      reason:
        `You want significantly more than both the estimated lender sanction ` +
        `(₹${lender.toLocaleString()}) and the conservative safe amount ` +
        `(₹${Math.round(safe).toLocaleString()}).`
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 4. NORMAL BORROW-LESS RULES
  // ──────────────────────────────────────────────────────────────

  if (wanted > lender && wanted > safe) {
    return {
      decision: 'Borrow less',
      reason:
        `You want ₹${wanted.toLocaleString()}, but lenders may sanction ` +
        `~₹${lender.toLocaleString()} and you can safely afford ` +
        `~₹${Math.round(safe).toLocaleString()}. Consider reducing your request.`
    }
  }

  if (wanted > safe) {
    return {
      decision: 'Borrow less',
      reason:
        `You can safely afford about ₹${Math.round(safe).toLocaleString()}. ` +
        `Your requested amount of ₹${wanted.toLocaleString()} may stretch your finances.`
    }
  }

  if (wanted > lender) {
    return {
      decision: 'Borrow less',
      reason:
        `Lenders may sanction only ~₹${lender.toLocaleString()} based on your profile.`
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 5. CONSUMPTION BORROWING
  // ──────────────────────────────────────────────────────────────

  if (
    answers.loanGeneratesIncome === 'No, pure consumption' &&
    wanted > safe * 0.7
  ) {
    return {
      decision: 'Borrow less',
      reason:
        `Since this is consumption borrowing rather than income-generating borrowing, ` +
        `a smaller amount of about ₹${Math.round(safe * 0.7).toLocaleString()} would be safer.`
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 6. DEFAULT - BORROW
  // ──────────────────────────────────────────────────────────────

  return {
    decision: 'Borrow',
    reason:
      `✅ Based on your income, obligations, and borrowing profile, ` +
      `the requested amount fits within the estimated lending and affordability limits.`
  }
}

export function calculateTenureTradeoff(loanAmount, safeEmi, rate) {
  const tenures = [36, 48, 60]
  const result = []
  
  const avgRate = rate || 0.10
  
  for (const tenure of tenures) {
    const monthlyRate = avgRate / 12
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1)
    const totalPayment = emi * tenure
    const totalInterest = totalPayment - loanAmount
    result.push({
      tenure: tenure / 12,
      tenureMonths: tenure,
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      isWithinSafe: emi <= safeEmi
    })
  }
  
  return result
}

export function calculateAll(answers) {
  // ─── SAFETY CHECK ──────────────────────────────────────────────
  const income = Number(answers.netMonthlyIncome) || 0
  const amount = Number(answers.amountWanted) || 0

  if (income <= 0) {
    return {
      error: 'Missing monthly income',
      message: 'Please enter a valid monthly income before calculating your assessment.',
      affordability: { safeEmi: 0, maxLoan: 0, tenureYears: 5, totalIncome: 0, disposableIncome: 0 },
      lenderEligibility: { lenderLoan: 0, lenderRate: 0, availableEmi: 0 },
      rateRange: { rateLow: 0, rateHigh: 0, aprLow: 0, aprHigh: 0, procFeePct: 0, confidence: 'Low', explanation: 'Insufficient data' },
      stressTest: { newIncome: 0, surplus: 0, surplusPct: 0, newEmi: 0, additionalBurden: 0, explanation: 'No data' },
      decision: { decision: 'Don\'t borrow', reason: 'Please enter your monthly income first.' },
      tenureTradeoff: [],
      requestedAmount: amount,
      loanType: answers.loanType || 'Not specified'
    }
  }

  if (amount <= 0) {
    return {
      error: 'Missing loan amount',
      message: 'Please enter the amount you want to borrow.',
      affordability: { safeEmi: 0, maxLoan: 0, tenureYears: 5, totalIncome: income, disposableIncome: 0 },
      lenderEligibility: { lenderLoan: 0, lenderRate: 0, availableEmi: 0 },
      rateRange: { rateLow: 0, rateHigh: 0, aprLow: 0, aprHigh: 0, procFeePct: 0, confidence: 'Low', explanation: 'Insufficient data' },
      stressTest: { newIncome: income * 0.8, surplus: 0, surplusPct: 0, newEmi: 0, additionalBurden: 0, explanation: 'No data' },
      decision: { decision: 'Don\'t borrow', reason: 'Please enter the amount you want to borrow.' },
      tenureTradeoff: [],
      requestedAmount: 0,
      loanType: answers.loanType || 'Not specified'
    }
  }
  // ─── END SAFETY CHECK ──────────────────────────────────────────

  const affordability = calculateAffordability(answers)
  const lenderEligibility = calculateLenderEligibility(answers)
  const rateRange = getFairRateRange(answers)
  const stressTest = calculateStressTest(answers, affordability.safeEmi)
  const decision = getRecommendation(answers, affordability, lenderEligibility)
  
  const avgRate = (rateRange.rateLow + rateRange.rateHigh) / 2 / 100
  const loanAmount = Math.min(affordability.maxLoan, Number(answers.amountWanted) || affordability.maxLoan)
  const tenureTradeoff = calculateTenureTradeoff(
    loanAmount > 0 ? loanAmount : affordability.maxLoan,
    affordability.safeEmi,
    avgRate
  )

  return {
    affordability,
    lenderEligibility,
    rateRange,
    stressTest,
    decision,
    tenureTradeoff,
    requestedAmount: Number(answers.amountWanted) || 0,
    loanType: answers.loanType || 'Not specified'
  }
}