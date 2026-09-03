# RULES.md · Borrower Copilot Domain Engine & Policy Specification

> **Lokta Build Challenge Deliverable #2**  
> Every rule, threshold, band, and assumption used by the Borrower Copilot engine is documented below in the exact required schema:  
> `What · Value · Why · Source or "My Judgement"`

---

## 1. Regulatory Anchors & Benchmark Rates

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **RBI Repo Rate Anchor** | `6.50%` | Acts as the foundational cost-of-funds benchmark for all floating repo-linked retail loans (EBLR). | RBI Monetary Policy Committee (MPC) Benchmark Rate |
| **Prime Home Loan Band** | `8.40% - 8.95%` | Lowest-risk secured retail product backed by first-charge residential mortgage. | SBI, HDFC Bank, ICICI Bank Card Rates (CIBIL 750+) |
| **Secured LAP (Commercial Shop/Premises)** | `9.25% - 10.75%` | Prime secured MSME facility against unencumbered commercial properties with 10-15 yr tenure. | Bank of Baroda / Bajaj Housing Finance MSME LAP Schedules |
| **Prime Personal Loan (Unsecured)** | `10.50% - 12.50%` | Tier-1 corporate salaried prime borrowers with 750+ CIBIL and zero collateral. | HDFC Bank & Axis Bank Corporate Salary Loan Cards |
| **Unsecured Business / Working Capital** | `14.00% - 17.50%` | Unsecured lending for retail trade and MSMEs based on audited ITR and GST turnover. | NBFC & PSU Bank MSME Lending Matrices |
| **Two-Wheeler / Electric Vehicle Loan** | `10.50% - 13.00%` | Hypothecated asset-backed finance on ex-showroom vehicle invoice with priority sector subsidy. | Hero Fincorp / Tata Capital EV Retail Policy |
| **Gold Jewellery Loan** | `8.75% - 10.50%` | High-liquidity physical collateral loan with 75% LTV statutory ceiling. | Muthoot Finance / Manappuram Gold Loan Policy |
| **Microfinance / SHG Group Lending** | `18.00% - 22.00%` | Priority sector qualifying assets for low-income women / informal households under RBI MFI framework. | RBI Master Direction – Regulatory Framework for Microfinance Loans |
| **Instant Fintech App Loans (Payday)** | `30.00% - 42.00%+` | High-risk, short-tenure, unsecured digital loans characterized by aggressive algorithmic collections. | Market Surveys of Fintech NBFC Disclosures (Fair Practice Code) |

---

## 2. Credit Score Spreads & "Unknown is Never Zero"

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **Prime Tier Spread (750+)** | `+0.00% to +0.50%` | Lowest default probability (&lt; 1.2%); banks compete aggressively for these profiles. | TransUnion CIBIL Prime Risk Surcharge Grid |
| **Near-Prime Spread (700-749)** | `+1.00% to +2.00%` | Minor historical delinquency or high recent bureau inquiries. | PSU Bank Risk-Based Pricing Policies |
| **Subprime Spread (650-699)** | `+2.50% to +4.50%` | Moderate risk of 30+ DPD; pushed to NBFCs or higher bank risk bands. | NBFC Risk Tiering Schedule |
| **High Risk / Stressed (&lt;650)** | `+5.50% to +9.00%` | Past write-offs, settlements, or multiple active app loan bounces. | NBFC Stressed Asset Pricing Guidelines |
| **Unknown / NTC (New-to-Credit)** | `+1.50% to +3.50%` | **Rule 3 Compliance:** "Unknown is never 300". Unrated borrowers are priced with a prudent risk buffer, not an automatic rejection. | **My Judgement**: Industry standard for unrated cashflow borrowers with banking vintage |
| **Bounce Penalty (Past 12M)** | `+1.25% per bounce` | Even a single NACH / Cheque bounce signals immediate cash flow vulnerability. | Automated Rule: Haircut on automated scoring matrices |

---

## 3. FOIR (Fixed Obligation to Income Ratio) & Affordability Slabs

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **FOIR Slab: Income &lt; ₹35k/mo** | Lender: `45%`<br>Safe: `32%` | Low earners spend 65%+ on essential food, rent, and school fees; exceeding 32% debt leads to malnutrition/distress. | **My Judgement** grounded in RBI Household Debt Guidelines |
| **FOIR Slab: Income ₹35k - ₹75k/mo** | Lender: `55%`<br>Safe: `40%` | Moderate income allows 40% debt while leaving a ₹15k-₹20k discretionary monthly cushion. | Indian Banking Code / SBI Home Loan Underwriting Policy |
| **FOIR Slab: Income ₹75k - ₹1.5L/mo** | Lender: `60%`<br>Safe: `45%` | High salaried earners can safely allocate 45% of income to debt without compromising lifestyle. | HDFC Bank Retail Underwriting Circular |
| **FOIR Slab: Income &gt; ₹1.5L/mo** | Lender: `65%`<br>Safe: `50%` | High absolute surplus cash flow permits 50% debt servicing. | Private Wealth Retail Lending Norms |
| **High Variable Pay Haircut** | `-5% Safe FOIR` | If &gt;30% of income is variable incentives/bonuses, debt must be serviceable on fixed base salary alone. | **My Judgement**: Standard conservative financial planning principle |
| **Emergency Buffer Bonus** | `+3% Safe FOIR` | If liquid savings &gt; 6 months, borrower has resilient shock absorption. | **My Judgement**: Rewards cash liquidity |
| **Informal Cash Haircut** | `50% Discount` | Unbanked / unrecorded cash profits cannot be legally verified by credit teams; haircut by 50%. | Standard Bank Cashflow Assessment Policies |

---

## 4. Statutory LTV (Loan-to-Value) Limits

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **Commercial Shop Premises (LAP)** | `50% - 55% LTV` | Commercial properties carry resale liquidity risk in down markets; lenders cap at 50-55% of distress value. | HDFC / Axis Bank Commercial LAP Credit Policy |
| **Residential Property (LAP)** | `60% - 65% LTV` | Standard residential property mortgage limit for non-housing purposes. | RBI Master Circular on Housing Finance |
| **Gold Jewellery Loans** | `75% LTV Cap` | Statutory RBI ceiling to prevent systemic retail gold default during commodity dips. | RBI Notification: Loan to Value (LTV) Ratio for Gold Loans |
| **Electric / Two-Wheeler Vehicle** | `80% - 85% LTV` | Hypothecation over vehicle with down payment ensuring borrower equity skin-in-the-game. | NBFC Auto Finance Underwriting Manual |

---

## 5. All-In APR & Statutory Cost Disclosures

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **Processing Fee (Personal/Business)** | `1.0% - 2.5%` | Standard upfront loan administration fee charged by banks. | Bank Schedule of Charges |
| **GST on Bank Fees** | `18.0%` | Mandatory Central & State GST levied on all banking processing fees. | Indian Goods & Services Tax (GST) Act |
| **Stamp Duty & Documentation** | `₹500 to ₹4,000` | State-level statutory legal stamp duty for loan agreements and hypothecation. | Karnataka / Maharashtra Stamp Duty Acts |
| **Loan Shield Insurance** | `0.5% - 1.0%` | Single-premium credit life cover. **Optional** per RBI, but often illegally forced by branches. | RBI Fair Practice Code & IRDAI Guidelines |
| **All-In APR Amortization Formula** | `Nominal + (Upfront Fees / Principal) * (12 / Tenure) * 100` | Exposes the true annualized borrowing cost so the borrower can compare honest net outflow. | RBI Circular on Display of Key Fact Statement (KFS) & APR |

---

## 6. Output Logic (O1, O2, O3, O4) & Decision Rules

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **O1: DONT_BORROW Trigger** | `Bounces >= 1 AND High-Cost Debt > ₹20k` OR `DTI > 65%` | Adding debt to an already defaulting or high-cost stressed cash flow causes immediate insolvency. | **My Judgement**: Protects vulnerable borrowers from predatory debt spirals |
| **O1: BORROW_LESS Trigger** | `Purpose == Wedding/Consumption AND Loan > Safe Capacity` | Discretionary consumption generates 0% financial return. Even if banks over-sanction, borrowing less protects savings. | **My Judgement**: Behavioral economics & wealth preservation |
| **O1: PRODUCT_PIVOT Trigger** | `Self-Employed AND Has Shop Collateral AND Unsecured Asked` | Taking a 20%+ unsecured loan when unencumbered ₹45L shop qualifies for 10% LAP wastes ₹6L+ in interest. | **My Judgement**: Smart debt restructuring |
| **O2: Sanction vs Safe Gap** | `Lender Sanction` vs `Safe Capacity` | Banks calculate sanction based on maximum permissible DTI; borrower safe capacity accounts for real living costs. | **My Judgement**: Core thesis of Borrower Copilot |
| **O4: Stress Test Scenarios** | `-20% Income` & `+200 bps Rate` | Tests if borrower cash surplus remains positive under realistic economic shocks. | RBI Stress Testing Guidelines for Retail Portfolios |

---

## 7. Confidence Scoring & Band Widening Algorithm

| What | Value | Why | Source or "My Judgement" |
| :--- | :--- | :--- | :--- |
| **Baseline Confidence (Must Only)** | `60% (Band: ±2.50%)` | **Rule 2 Compliance:** Silence widens bands. 8 core questions provide basic solvency but lack track record depth. | **My Judgement**: Transparent uncertainty modeling |
| **Tightener: Job/Business Vintage** | `+5% Confidence` | 3+ years at company or shop proves revenue stability across business cycles. | Verification metric |
| **Tightener: 12M Bounce Record** | `+5% Confidence` | 0 NACH bounces proves disciplined bank account management. | Repayment discipline metric |
| **Tightener: Emergency Savings** | `+5% Confidence` | 3+ months liquid reserve ensures buffer against illness or temporary job loss. | Shock absorption metric |
| **Tightener: Collateral Valuation** | `+5% Confidence` | Physical asset deed provides 100%+ secondary recovery cover for the lender. | Security backing metric |
| **Tightener: Bureau Verification** | `+5% Confidence` | Validated CIBIL track record narrows rate band to prime ±0.75%. | Credit bureau verification |
| **Max Confidence Ceiling** | `95% (Band: ±0.75%)` | Prevents over-promising absolute certainty before formal branch title search and field inspection. | Realistic underwriting ceiling |

---

## 8. What We Do NOT Know & Where We Are Guessing

1. **Title & Encumbrance Verification:** We assume collateral (e.g. Ravi’s shop) has clean title deeds without hidden family disputes or municipal tax arrears.
2. **Platform Gig Volatility:** For informal workers (Anita), delivery algorithms fluctuate weekly; our model uses 3-month trailing averages.
3. **Internal Bank Negative Area Lists:** Certain pin codes or specific unorganized industries may face automated red-lining by specific private banks regardless of merit.
