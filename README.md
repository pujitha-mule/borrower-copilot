# Borrower Copilot

A borrowing decision assistant for Indian borrowers. Understand your borrowing position before talking to a lender with transparent, rule-based guidance.

**Status:** Beta

---

## Overview

Borrower Copilot helps borrowers make informed borrowing decisions by analyzing their financial situation and providing clear, actionable recommendations.

It answers four critical questions:

1. Should I borrow? — Borrow / Borrow Less / Don't Borrow
2. How much can I borrow? — Compare a lender sanction estimate with a safe borrowing amount
3. What is a fair interest rate? — See an estimated rate range and all-in annualized cost
4. What EMI should I agree to? — Understand a comfortable monthly payment and stress scenarios

The app also generates a Negotiation Card that can be used when speaking with lenders.

---

## Features

### Adaptive Questionnaire

- Questions adapt based on income type
- Supports Salaried, Self-employed, and Informal / Variable income
- Only shows relevant follow-up questions
- Unknown credit score is treated as uncertainty rather than automatically being treated as bad credit
- Secured loans can collect collateral information

### Smart Calculations

- Safe affordability — conservative estimate of what the borrower can afford
- Lender eligibility — estimate of what a lender may potentially approve
- Fair interest-rate range — profile-based range rather than a single number
- All-in annualized cost — incorporates applicable processing fees and charges
- Documented-income consideration for self-employed borrowers

### Stress Testing

- Income drops by 20% — evaluates whether the EMI remains manageable
- Interest rate rises by 2% — shows the impact on monthly payment

### Tenure Trade-Off

- Compare 3, 4, and 5-year tenures
- Compare EMI
- Compare total interest
- See whether the EMI is within the safe limit

### Negotiation Card

- One-page summary for lender conversations
- Borrowing recommendation
- Requested amount
- Recommended maximum
- Maximum comfortable EMI
- Fair interest-rate range
- All-in annualized cost
- Suggested question to ask the lender
- Print / Save functionality

### Demo Profiles

- Priya — Salaried borrower, ₹1.1L/month, wants ₹8L
- Ravi — Self-employed borrower, ₹60K/month, wants ₹15L through a Loan Against Property
- Anita — Informal / Variable income, ₹28K/month, wants ₹1.5L

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and development server |
| JavaScript ES6+ | Application logic and calculations |
| Vanilla CSS | Styling |

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm v7 or higher

### Installation

```bash
git clone https://github.com/pujitha-mule/borrower-copilot.git
cd borrower-copilot
npm install
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```text
borrower-copilot/
├── src/
│   ├── components/
│   │   ├── ResultCard.jsx
│   │   └── NegotiationCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Assessment.jsx
│   │   └── Results.jsx
│   ├── logic/
│   │   ├── questions.js
│   │   └── calculations.js
│   ├── data/
│   │   └── borrowerProfiles.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── RULES.md
├── SUBMISSION.md
└── README.md
```

---

## Demo Profiles

| Profile | Income Type | Monthly Income | Requested Amount | Loan Type |
|---|---|---:|---:|---|
| Priya | Salaried | ₹1,10,000 | ₹8,00,000 | Personal Loan |
| Ravi | Self-employed | ₹60,000 | ₹15,00,000 | Loan Against Property |
| Anita | Informal / Variable | ₹28,000 | ₹1,50,000 | Personal Loan |

### Expected Outcomes

- **Priya → Borrow**
- **Ravi → Borrow with secured Loan Against Property recommendation**
- **Anita → Don't Borrow**

Click **"Load profile →"** on a demo profile to populate the assessment with the corresponding borrower information.

### Tested Results

| Profile | Decision | Requested | Safe Amount | Lender Estimate |
|---|---|---:|---:|---:|
| Priya | Borrow | ₹8,00,000 | ₹16,47,288 | ₹21,63,404 |
| Ravi | Borrow — Secured LAP | ₹15,00,000 | ₹7,47,210 | ₹20,90,997 |
| Anita | Don't Borrow | ₹1,50,000 | — | — |

Ravi is routed to a secured **Loan Against Property** path because he has ₹45 lakh of unencumbered collateral and the requested borrowing is intended to support income-generating business activity.

The app deliberately keeps Ravi's conservative safe borrowing amount separate from the higher estimated lender capacity.

---

## Calculation Rules

All calculation rules, thresholds, bands, and assumptions are documented in `RULES.md`.

The application intentionally separates:

- **Lender sanction estimate** — an estimate of what a lender may potentially approve
- **Safe borrowing amount** — an affordability-focused estimate for the borrower
- **Fair rate range** — an estimated range based on borrower characteristics
- **Safe EMI** — a conservative monthly EMI limit
- **All-in annualized cost** — includes applicable processing fees
- **Stress-tested affordability** — checks the effect of income reduction and rate increases

The prototype uses transparent, rule-based calculations rather than a machine-learning approval model.

See `RULES.md` for the complete rules and assumptions.

---

## Design

Borrower Copilot uses a clean, editorial-style interface designed to make financial information easier to understand.

The design includes:

- Responsive mobile layout
- Clear financial result cards
- Distinct lender versus borrower numbers
- Visual stress-test results
- Negotiation Card
- Print-friendly results
- Clear warning and recommendation states
- Adaptive question flow
- Calm cream, navy, teal, and coral visual system

---

## How to Use

### For Borrowers

1. Open the homepage.
2. Click **"Start my assessment"** or select a topic.
3. Answer the questions honestly.
4. Review your recommendation.
5. Compare the lender estimate with the safe borrowing amount.
6. Review the fair rate range and all-in annualized cost.
7. Check the EMI and tenure trade-offs.
8. Review the stress tests.
9. Open the **Negotiation Card** before speaking with a lender.
10. Print or save the result if required.

### For Demo Profiles

1. Select a demo borrower.
2. The assessment is populated with the profile data.
3. Complete the assessment flow.
4. Review the final recommendation.
5. Compare Priya, Ravi, and Anita's outcomes.

---

## Documentation

### RULES.md

Contains:

- Every calculation rule
- Thresholds
- Rate bands
- Affordability assumptions
- Secured-loan assumptions
- Stress-test assumptions
- Processing-fee assumptions
- Explanation of why each rule exists
- Source or prototype judgement for each assumption

### SUBMISSION.md

Contains:

- Priya run-through
- Ravi run-through
- Anita run-through
- Questions asked for each borrower
- Four required outputs
- Negotiation Card for each borrower
- Five-minute walkthrough
- What should be built next
- What should be cut
- Limitations and assumptions

---

## Disclaimer

Borrower Copilot is an educational, rule-based planning tool.

It is not a lender, broker, credit bureau, or substitute for professional financial advice.

Lenders make their own decisions and may use different policies.

All calculations are estimates based on the information provided.

Actual loan offers, rates, fees, approval decisions, and eligibility may vary.

This prototype should not be treated as a guarantee of loan approval or financial advice.

---

## Privacy

- No bank account access
- No real credit-bureau connection
- No real lender application submission
- No lender underwriting integration
- Calculations are performed by the application
- The prototype does not make real loan approval decisions

---

## Known Limitations

- No real credit-bureau integration
- No real-time lender offers
- No guaranteed loan approval
- No backend/database
- No user authentication
- No real lender underwriting model
- Rule-based estimates only
- Market interest rates and lender policies may differ
- User-entered information may be incomplete or inaccurate
- Secured-loan calculations are prototype heuristics and should not be treated as actual lender LTV policy

---

## Testing

Run:

```bash
npm run build
```

Then manually test:

1. **Priya**
   - Expected: Borrow

2. **Ravi**
   - Expected: Borrow with secured-loan recommendation

3. **Anita**
   - Expected: Don't Borrow

Also verify:

- Homepage loads correctly
- Demo profiles load correctly
- Assessment questions work
- Adaptive questions appear correctly
- Back navigation works
- Cancel confirmation works
- Stay / Continue assessment works
- Start Over works
- Results display correctly
- Lender estimate and safe amount are clearly separated
- Don't Borrow outcome is reachable
- Stress tests display correctly
- Tenure comparison works
- Negotiation Card displays correctly
- Print / Save functionality works
- Mobile layout works
- Production build completes without errors

---

## Product Principles

### 1. Separate lender power from borrower safety

A lender may approve more than a borrower should comfortably borrow.

Therefore the app clearly separates:

**Likely lender sanction**

from

**Safe borrowing amount**

### 2. Don't punish unknown information automatically

An unknown credit score should create uncertainty rather than automatically being treated as poor credit.

### 3. Show the real cost

The borrower should consider more than the headline interest rate.

The app therefore considers:

- Interest rate
- Processing fees
- Annualized cost
- EMI
- Total repayment
- Tenure

### 4. Stress test the decision

A loan that works only when everything goes perfectly is not necessarily a safe loan.

The app therefore tests scenarios such as:

- Income falling by 20%
- Interest rate increasing by 2%

### 5. Explain every recommendation

The user should understand why the application recommends borrowing, borrowing less, or not borrowing.

The rules are documented separately in `RULES.md` rather than hidden inside the UI.

---

## Engineering Approach

Borrower Copilot deliberately uses a transparent rule-based approach.

The application does not claim to predict loan approval using machine learning.

The calculation flow is:

```text
Borrower answers
      ↓
Profile normalization
      ↓
Income and expense analysis
      ↓
Existing EMI analysis
      ↓
Credit and payment-history factors
      ↓
Loan-type analysis
      ↓
Lender sanction estimate
      ↓
Safe affordability calculation
      ↓
Rate and cost calculation
      ↓
Stress testing
      ↓
Borrow / Borrow Less / Don't Borrow
      ↓
Negotiation Card
```

This makes the recommendation easier to inspect, explain, and modify.

---

## What I Would Build Next

If this prototype were developed further, the next priorities would be:

1. Real lender/product comparison
2. More accurate market-rate data
3. Real credit-report integration with user consent
4. More detailed secured-loan valuation logic
5. Better fee and APR calculation across lenders
6. Historical cash-flow analysis
7. Personalized repayment planning
8. More detailed financial-goal analysis
9. Accessibility improvements and broader device testing
10. Automated test coverage for calculation rules

---

## What I Would Cut

To keep the product focused, I would avoid:

- Pretending to provide guaranteed loan approval
- Unexplainable ML-based credit scores
- Excessive financial jargon
- Too many optional questions
- Complex dashboards that do not improve the borrowing decision
- Fake real-time lender offers
- Features that create a false impression of financial certainty

---

## License

MIT License.

---

## Acknowledgments

Built for the **Borrower Copilot Challenge**.

The project focuses on transparent and explainable borrowing guidance rather than pretending to provide guaranteed lender decisions.

All calculation rules and assumptions are documented in `RULES.md`.

**Made for Indian borrowers.**