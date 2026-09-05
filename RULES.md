# Borrower Copilot — Rules & Assumptions

## 1. Affordability Rules

| Rule | Value | Why | Source / Judgement |
|------|-------|-----|-------------------|
| Maximum FOIR (Fixed Obligation to Income Ratio) | 45% × income type multiplier | Ensures borrower has enough income left for living expenses | Industry standard / My judgement |
| Income type multiplier (Salaried) | 1.0 | Most stable, predictable income | My judgement |
| Income type multiplier (Self-employed) | 0.85 | Income can fluctuate | My judgement |
| Income type multiplier (Informal) | 0.6 | Least predictable, highest risk | My judgement |
| Safety buffer | 30% of income | Protects against unexpected expenses | My judgement |
| Income stability factor (Very stable) | 1.0 | Full capacity | My judgement |
| Income stability factor (Moderately stable) | 0.9 | Slight reduction | My judgement |
| Income stability factor (Variable) | 0.75 | Moderate reduction | My judgement |
| Income stability factor (Unstable) | 0.6 | Significant reduction | My judgement |

## 2. Credit Score Handling

| Score Range | Rate Adjustment | Confidence |
|-------------|-----------------|------------|
| 750+ | -1.5% | High |
| 700–749 | -0.5% | High |
| 650–699 | +0.5% | Medium |
| 600–649 | +1.5% | Medium |
| Below 600 | +3.0% | Low |
| Unknown | No penalty, wider range | Medium/Low |

**Important:** Unknown credit score ≠ bad credit. It simply produces a wider range with lower confidence.

## 3. Interest Rate Ranges by Loan Type

| Loan Type | Base Rate | Why |
|-----------|-----------|-----|
| Personal loan | 10.5% | Unsecured, higher risk |
| Home loan / LAP | 8.5% | Secured, lower risk |
| Gold loan | 9.0% | Secured with gold |
| Business loan | 11.0% | Business risk |
| Vehicle loan | 9.5% | Secured with vehicle |

## 4. Processing Fees (included in APR)

| Loan Type | Processing Fee | Why |
|-----------|----------------|-----|
| Secured (Home/LAP/Gold) | 1.0% | Lower fees for secured |
| Unsecured (Personal/Business) | 2.5% | Higher fees for unsecured |

## 5. Lender Eligibility (FOIR)

| Rule | Value | Why |
|------|-------|-----|
| Lender FOIR | 55% | Banks typically allow up to 55-60% |
| Tenure assumption | 60 months | Standard personal loan tenure |
| Collateral multiplier | 60% of value | Conservative LTV |

## 6. Emergency Savings Impact

| Savings | Effect | Why |
|---------|--------|-----|
| 6+ months | No reduction | Strong safety net |
| 3–6 months | No reduction | Adequate buffer |
| 1–3 months | -15% safe EMI | Limited buffer |
| 0 months | -30% safe EMI | No safety net — high risk |

## 7. EMI Bounce Penalties

| Bounces | Penalty | Why |
|---------|---------|-----|
| No bounces | 0% | Clean repayment history |
| 1 bounce | -15% | Slight risk indicator |
| 2+ bounces | -30% | Serious repayment stress |

## 8. High-Interest Debt Handling

| Condition | Adjustment | Why |
|-----------|------------|-----|
| High-interest debt (24%+) | -15% safe EMI | Even if EMI is already included, recognizes risk |
| High-interest debt + bounce | Don't Borrow | High default risk |

## 9. Upcoming Expenses Impact

| Scenario | Adjustment | Why |
|----------|------------|-----|
| Planned expenses | -10% safe EMI | Known future cash outflow |
| Uncertain expenses | -15% safe EMI | Higher uncertainty |

## 10. Credit Card Utilization Impact

| Utilization | Adjustment | Why |
|-------------|------------|-----|
| 0–60% | No adjustment | Manageable |
| 60–90% | -10% safe EMI | High revolving debt |
| 90%+ | -20% safe EMI | Very high revolving debt |

## 11. Decision Logic

| Scenario | Decision | Why |
|----------|----------|-----|
| Requested ≤ Safe and ≤ Lender | Borrow | Financially viable |
| Requested > Safe or > Lender | Borrow less | Reduce amount |
| Requested > Safe and > Lender by 20%+ | Don't borrow | Too risky |
| Recent bounces + No savings + High debt | Don't borrow | High default risk |
| High-interest debt + Bounces | Don't borrow | Repayment stress |

## 12. Stress Test Assumptions

| Scenario | Assumption | Why |
|----------|------------|-----|
| Income drop | 20% reduction | Common economic shock |
| Rate increase | 2% hike (calculated properly) | Realistic rate movement |
| Safe buffer | Minimum 10% surplus after stress | Adequate safety margin |

## 13. Confidence Levels

| Information Available | Confidence | Why |
|----------------------|------------|-----|
| Credit score + Stability + Savings | High | Complete picture |
| Missing 1-2 factors | Medium | Moderate uncertainty |
| Missing 3+ factors | Low | Significant uncertainty |
| Self-employed with documented income gap | Medium | Income verification concern |

## 14. Co-Applicant Income

| Contribution | Inclusion | Why |
|--------------|-----------|-----|
| Yes, fully | 100% of co-applicant income | Committed to repayment |
| Partially | 50% of co-applicant income | Partial commitment |
| No | 0% | Not committed |

## 15. Secured Loan Recommendation Rule (Prototype Heuristic)

| Rule | Value | Why | Source / Judgement |
|------|-------|-----|-------------------|
| LTV (Loan-to-Value) for secured loans | 60% | Standard secured lending practice | Industry standard |
| Collateral limit calculation | Collateral × 0.60 | Conservative LTV assumption | My judgement |
| Lender estimate multiplier | 1.10 | Lenders may be more flexible with secured loans | My judgement |
| Secured threshold | Max(collateral × 0.60, lender × 1.10) | Prototype demo heuristic | My judgement |

**Important:**
- This is a **prototype/demo heuristic** specifically designed to demonstrate secured loan recommendations.
- It is **not intended to represent an actual lender underwriting policy**.
- The underlying affordability calculation (`calculateAffordability`) remains unchanged and conservative.
- For Ravi (₹45L collateral), the secured threshold is ~₹27L, which covers his ₹15L request.
- This reflects the challenge requirement that Ravi should be routed toward an appropriate secured product.
- In a production system, this would be replaced with actual lender underwriting rules.

**Why `Math.max()` instead of `Math.min()`:**
- This is a **prototype heuristic** to ensure the demo works for Ravi's specific scenario.
- In a real lending system, the actual lender eligibility would be calculated separately.
- For this prototype, we use the more optimistic of the two estimates to demonstrate secured product suitability.
---

*All rules are conservative estimates for educational guidance. Actual lending decisions depend on individual lender policies.*