export const ALL_QUESTIONS = [
  {
    id: 'purpose',
    label: 'What is your loan purpose?',
    desc: 'This helps us understand if the loan will generate income or is for consumption.',
    type: 'select',
    options: ['Wedding', 'Education', 'Home renovation', 'Business', 'Vehicle', 'Medical', 'Debt consolidation', 'Other'],
    optional: false
  },
  {
    id: 'amountWanted',
    label: 'How much do you want to borrow? (₹)',
    desc: 'Enter the amount you are considering.',
    type: 'number',
    placeholder: 'e.g. 800000',
    optional: false,
    min: 5000
  },
  {
    id: 'loanType',
    label: 'What type of loan are you looking for?',
    desc: 'This affects interest rates and eligibility.',
    type: 'select',
    options: ['Personal loan', 'Business loan', 'Home loan', 'Loan against property', 'Gold loan', 'Vehicle loan'],
    optional: false
  },
  {
    id: 'incomeType',
    label: 'What is your primary income type?',
    desc: 'We adapt questions based on your answer.',
    type: 'select',
    options: ['Salaried', 'Self-employed', 'Informal / Variable'],
    optional: false
  },
  {
    id: 'netMonthlyIncome',
    label: 'What is your net monthly income? (₹)',
    desc: 'After tax, take-home pay. For self-employed, average monthly profit after expenses.',
    type: 'number',
    placeholder: 'e.g. 55000',
    optional: false,
    min: 0
  },
  {
    id: 'documentedAnnualIncome',
    label: 'What is your documented annual income as per ITR? (₹)',
    desc: 'This helps us assess income stability and lender confidence.',
    type: 'number',
    placeholder: 'e.g. 420000',
    optional: true,
    min: 0,
    dependsOn: { incomeType: ['Self-employed'] }
  },
  {
    id: 'incomeStability',
    label: 'How stable is your income?',
    desc: 'This affects lender confidence and our recommendation.',
    type: 'select',
    options: ['Very stable', 'Moderately stable', 'Variable', 'Unstable / irregular'],
    optional: true,
    dependsOn: { incomeType: ['Salaried', 'Self-employed'] }
  },
  {
    id: 'incomeHistory',
    label: 'How many years of consistent income history do you have?',
    desc: 'Lenders prefer 2+ years of stable income.',
    type: 'select',
    options: ['Less than 1 year', '1–2 years', '2–5 years', 'More than 5 years'],
    optional: true,
    dependsOn: { incomeType: ['Salaried', 'Self-employed', 'Informal / Variable'] }
  },
  {
    id: 'existingEmis',
    label: 'What are your total existing monthly EMI obligations? (₹)',
    desc: 'Include all loans, credit card bills, and other fixed monthly payments.',
    type: 'number',
    placeholder: 'e.g. 15000',
    optional: false,
    min: 0
  },
  {
    id: 'householdExpenses',
    label: 'What are your essential monthly household expenses? (₹)',
    desc: 'Rent, food, utilities, transport, children\'s school fees, etc.',
    type: 'number',
    placeholder: 'e.g. 35000',
    optional: false,
    min: 0
  },
  {
    id: 'age',
    label: 'What is your age?',
    desc: 'Lenders typically prefer borrowers aged 21–60.',
    type: 'number',
    placeholder: 'e.g. 32',
    optional: false,
    min: 18,
    max: 80
  },
  {
    id: 'creditScoreKnown',
    label: 'Do you know your CIBIL / credit score?',
    desc: 'If unknown, we\'ll use a wider range — unknown is not treated as bad credit.',
    type: 'select',
    options: ['Yes, I know it', 'No, I don\'t know', 'Not sure'],
    optional: false
  },
  {
    id: 'creditScore',
    label: 'What is your CIBIL score? (300–900)',
    desc: 'Please enter your score if you know it.',
    type: 'number',
    placeholder: 'e.g. 750',
    optional: true,
    min: 300,
    max: 900,
    dependsOn: { creditScoreKnown: ['Yes, I know it'] }
  },
  {
    id: 'creditCardUtilization',
    label: 'What is your average credit card utilization?',
    desc: 'Percentage of total credit limit used across all cards.',
    type: 'select',
    options: ['0–30% (low)', '30–60% (medium)', '60–90% (high)', '90%+ (very high)'],
    optional: true
  },
  {
    id: 'previousBounces',
    label: 'Have you had any EMI bounces in the last 12 months?',
    desc: 'Even one bounce can affect lender perception.',
    type: 'select',
    options: ['No bounces', '1 bounce', '2+ bounces'],
    optional: true
  },
  {
    id: 'emergencySavings',
    label: 'How many months of expenses do you have in emergency savings?',
    desc: 'This is a key safety buffer.',
    type: 'select',
    options: ['0 months', '1–3 months', '3–6 months', '6+ months'],
    optional: true
  },
  {
    id: 'collateralValue',
    label: 'Do you have any collateral to offer? (e.g. property, gold, vehicle)',
    desc: 'If yes, enter approximate value in ₹. If no, leave blank.',
    type: 'number',
    placeholder: 'e.g. 4500000',
    optional: true,
    min: 0
  },
  {
    id: 'coApplicant',
    label: 'Do you have a co-applicant with income?',
    desc: 'A co-applicant can improve eligibility.',
    type: 'select',
    options: ['No co-applicant', 'Yes, spouse', 'Yes, family member', 'Yes, business partner'],
    optional: true
  },
  {
    id: 'coApplicantIncome',
    label: 'What is your co-applicant\'s net monthly income? (₹)',
    desc: 'If you have a co-applicant, enter their income.',
    type: 'number',
    placeholder: 'e.g. 45000',
    optional: true,
    min: 0,
    dependsOn: { coApplicant: ['Yes, spouse', 'Yes, family member', 'Yes, business partner'] }
  },
  {
    id: 'coApplicantContribution',
    label: 'Will the co-applicant contribute to monthly loan repayment?',
    desc: 'This helps us calculate safe affordability more accurately.',
    type: 'select',
    options: ['Yes, fully', 'Partially', 'No'],
    optional: true,
    dependsOn: { coApplicant: ['Yes, spouse', 'Yes, family member', 'Yes, business partner'] }
  },
  {
    id: 'upcomingExpenses',
    label: 'Do you have any large upcoming expenses in the next 12 months?',
    desc: 'This affects your ability to repay.',
    type: 'select',
    options: ['No large expenses expected', 'Yes, planned', 'Yes, uncertain but possible'],
    optional: true
  },
  {
    id: 'loanGeneratesIncome',
    label: 'Will this loan directly help generate income?',
    desc: 'e.g. business expansion, vehicle for work, education for better job.',
    type: 'select',
    options: ['Yes, directly generates income', 'Partly', 'No, pure consumption'],
    optional: true
  },
  {
    id: 'hasHighInterestDebt',
    label: 'Do you currently have high-interest loans or app loans?',
    desc: 'This includes loans with interest rates above 24%, like app-based loans.',
    type: 'select',
    options: ['No', 'Yes'],
    optional: false
  },
  {
    id: 'highInterestDebtAmount',
    label: 'What is the total outstanding amount on high-interest loans? (₹)',
    desc: 'Enter the total amount you owe on high-interest loans.',
    type: 'number',
    placeholder: 'e.g. 35000',
    optional: true,
    min: 0,
    dependsOn: { hasHighInterestDebt: ['Yes'] }
  },
  {
    id: 'highInterestDebtRate',
    label: 'What is the approximate interest rate on these loans? (%)',
    desc: 'For app loans, this is often 24-36% or higher.',
    type: 'number',
    placeholder: 'e.g. 30',
    optional: true,
    min: 0,
    dependsOn: { hasHighInterestDebt: ['Yes'] }
  },
  {
    id: 'highInterestIncludedInEMI',
    label: 'Are these high-interest loan payments already included in your existing EMI amount?',
    desc: 'If yes, we won\'t double-count them but will still consider the risk.',
    type: 'select',
    options: ['Yes, already included', 'No, separate payments'],
    optional: true,
    dependsOn: { hasHighInterestDebt: ['Yes'] }
  }
]

export function getFilteredQuestions(answers) {
  return ALL_QUESTIONS.filter(q => {
    if (!q.dependsOn) return true
    for (const [key, values] of Object.entries(q.dependsOn)) {
      const answer = answers[key]
      if (!answer) return false
      if (!values.includes(answer)) return false
    }
    return true
  })
}