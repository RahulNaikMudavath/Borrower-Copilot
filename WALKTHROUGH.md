# WALKTHROUGH.md · 5-Minute System Review & Product Architecture

> **Lokta Build Challenge Deliverable #4**  
> A structured walkthrough of the Borrower Copilot product, the domain architecture, the 3 persona evaluations, what we would build next, and what we would cut.

---

## 1. Product Thesis & The Asymmetry Gap

Every lender has a proprietary credit score model and algorithmic underwriting engine designed to maximize loan size and interest spread. **The Indian borrower has zero tools.** They walk into a bank or NBFC blind, accept the first pre-approved sanction letter, and end up paying 400 basis points over fair value with an EMI consuming 60% of their net income.

**Borrower Copilot** bridges this asymmetry by acting as a self-assessment assistant that runs 100% locally from what the borrower tells us — **no bureau pulls, no data harvesting, no backend latency**.

It answers the four existential questions before the borrower steps into a branch:
1. **O1: Should I borrow at all?** (`BORROW`, `BORROW_LESS`, or `DONT_BORROW`)
2. **O2: How much am I really eligible for?** (*Lender Max Sanction* vs *Borrower Safe Capacity*)
3. **O3: What is a fair interest rate?** (Fair Band + RBI All-In APR including processing fees and GST)
4. **O4: What EMI should I agree to?** (Safe Monthly Ceiling + Live Stress Tester under income/rate shocks)
5. **Negotiation Card:** A printable 1-page weapon to counter loan officers, reject predatory terms, and demand fair rates.

---

## 2. Architectural Walkthrough

```
                              [ Borrower Inputs ]
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                 [ Must Questions ]        [ Adaptive Tighteners ]
                 (8-10 Core Inputs)         (Collateral, Cash, Vintage)
                         │                           │
                         └─────────────┬─────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │   Deterministic Rule Engine   │
                       │   (Pure TypeScript / Math)    │
                       │                               │
                       │  • FOIR & Affordability Slabs │
                       │  • RBI Benchmark Anchors      │
                       │  • Confidence Degradation     │
                       │  • All-In APR Amortization    │
                       │  • Stress-Testing Matrices    │
                       └───────────────┬───────────────┘
                                       │
     ┌───────────────────┬─────────────┴─────┬───────────────────┐
     ▼                   ▼                   ▼                   ▼
 [ O1 Verdict ]   [ O2 Capacity ]     [ O3 Rate Band ]    [ O4 Safe EMI ]
(Decision/Pivot)  (Sanction vs Safe)   (Fair Range + APR)  (Stress Test)
     │                   │                   │                   │
     └───────────────────┴─────────────┬─────┴───────────────────┘
                                       ▼
                       ┌───────────────────────────────┐
                       │   1-Page Negotiation Card     │
                       │   • Borrower Leverage Score   │
                       │   • Counter-Offer Script      │
                       │   • 3 Hard Red Lines          │
                       │   • 4 Branch Checklist Qs     │
                       └───────────────────────────────┘
```

---

## 3. How the Engine Solves the 3 Borrowers

### 1. Priya (29, Salaried MNC, ₹1.1L net, ₹8L Wedding Loan)
- **The Pitfall:** Banks will happily sanction ₹15.7L+ because she is prime salaried (780 CIBIL).
- **The Copilot Solution:** Flags `BORROW_LESS`. Wedding is 0% ROI consumption. The engine caps safe capacity at ₹8.4L (and recommends trimming to ₹4-5L with savings). Armed with a 11.25% fair rate counter and 85/100 leverage score, she rejects the bank's 13.5% quote.

### 2. Ravi (42, Kirana Store, 14 yrs vintage, ₹45L Shop, Wants ₹15L)
- **The Pitfall:** Low ITR (₹4.2L/yr) and New-to-Credit (NTC) status causes private NBFCs to reject or offer predatory 21% unsecured loans.
- **The Copilot Solution:** Flags `BORROW — BUT PIVOT PRODUCT`. Detects the unencumbered ₹45L commercial shop premises, calculating a 55% LTV cap of ₹24.75L. Pivots him to **Secured LAP** at **9.50% - 11.00%**, cutting interest by more than half and saving ₹6.5 Lakhs over 10 years.

### 3. Anita (35, Informal Delivery Rider, 3 App Loans, 1 Bounce, Wants ₹1.5L EV)
- **The Pitfall:** High default risk and desperate cash need leads directly to 36%+ fintech app loans with daily auto-debits, guaranteeing default.
- **The Copilot Solution:** Flags `DONT_BORROW (Unsecured) / RESTRUCTURE FIRST`. Highlights severe vulnerability under stress testing (-20% income causes a ₹8,926/mo deficit). Pivots her to **Subsidized EV Asset-Financing (85% LTV on scooter directly with dealership)** at 12% with a manageable ₹3,100/mo EMI over 48 months.

---

## 4. What We Would Build Next (Product Roadmap)

1. **Account Aggregator (AA) Zero-Knowledge Consent Flow:**
   - Integrate RBI Account Aggregator (Setu / Finvu / Sahamati) to auto-fetch 12-month bank cashflow statements without storing user data.
   - Converts bank statement PDFs into instant average monthly turnover, EMI bounce verification, and recurring living expense estimates.

2. **Multilingual Vernacular Audio Copilot:**
   - In India, millions of informal and MSME borrowers (like Ravi and Anita) prefer voice-based interactions in Kannada, Hindi, Tamil, Telugu, and Marathi.
   - Text-to-speech audio explanation of the Negotiation Card so borrowers can listen to their counter-offer scripts in their native tongue before walking into the branch.

3. **OCR Document Appraisal for Collateral:**
   - Quick mobile photo upload of property tax receipts (Khata A/B) or Gold purity receipts to instantly calculate precise LTV limits and municipal encumbrance checks.

4. **Lender Matching API (Branch Negotiation Mode):**
   - Live integration with public card rates from top PSU banks (SBI, BoB, Canara), private banks (HDFC, ICICI, Axis), and Small Finance Banks (AU Small Finance, Equitas) to show exact branch contact details offering the benchmark rate.

---

## 5. What We Would Cut (Ruthless Product Simplification)

1. **Over-Parameterized Scoring Models:**
   - Cut out complex 50-variable credit scoring trees. In retail Indian lending, **4 fundamental metrics drive 90% of underwriting variance**:
     1. True net disposable cash flow (Net Income minus true Living Expenses).
     2. Existing debt commitments (Current FOIR/DTI).
     3. Asset security (Unencumbered collateral / LTV).
     4. Recent delinquency (12-month NACH bounce track record).
   - Everything else is marginal noise that creates user drop-off.

2. **Mandatory Login & Bureau Integrations:**
   - Cut hard bureau pull requirements (Experian/CIBIL OTP flows). Bureau pulls create hard inquiries that drop the borrower's credit score and trigger aggressive spam calls from DSA loan brokers. Client-side self-assessment is cleaner, faster, and 100% private.

3. **Multi-Step 20-Page Application Wizards:**
   - Cut long onboarding questionnaires. A 2-tier architecture (8 Must Questions + instant live output, followed by optional tighteners) ensures 100% completion rates.
