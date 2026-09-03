# Borrower Copilot · Indian Borrower Self-Assessment & Negotiation Assistant

[![Lokta Challenge](https://img.shields.io/badge/Lokta-Build_Challenge_v1.0-4B2440)](https://github.com/RahulNaikMudavath/Borrower-Copilot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Zero Backend](https://img.shields.io/badge/Architecture-100%25_Client_Side-success)](https://github.com/RahulNaikMudavath/Borrower-Copilot)

> **"What we are really testing: can you turn lending judgement into rules a borrower can see and a machine can run? That is the whole company."**

**Borrower Copilot** is a personal financial assistant that empowers Indian borrowers before stepping into a bank or NBFC branch. It runs 100% locally from what the borrower provides — **no login, no bureau pull, no personal data harvested**.

It answers the four existential questions and equips the borrower with a 1-page Negotiation Battle-Card:
1. **O1: Should I borrow at all?** (`BORROW`, `BORROW_LESS`, `DONT_BORROW` with clear rationale).
2. **O2: How much am I really eligible for?** (*Lender Likely Sanction* vs *Borrower Safe Capacity*).
3. **O3: What is a fair interest rate?** (Fair Band + RBI All-In APR disclosure including PF, GST, and stamp duty).
4. **O4: What EMI should I agree to?** (Monthly safe ceiling + Live Stress-Testing for income drops & rate hikes).
5. **Negotiation Card:** One printable/shareable battle-card to hold up in the branch with counter-offers, red lines, and negotiation scripts.

---

## 🚀 Quick Start (Under 1 Minute)

```bash
# 1. Clone repository
git clone https://github.com/RahulNaikMudavath/Borrower-Copilot.git
cd Borrower-Copilot

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To run the automated engine test suite:
```bash
npm run test:engine
```

---

## 📦 Four Deliverables at Root

| Deliverable | File | Summary |
| :--- | :--- | :--- |
| **1. The Working App** | `src/` | Interactive web application with adaptive questionnaire, live 4-outputs dashboard, 1-page printable negotiation card, rule inspector, and 1-click persona switchers. |
| **2. RULES.md** | [`RULES.md`](./RULES.md) | Exhaustive table of every rule, threshold, band, and assumption: *what · value · why · source or "my judgement"*. |
| **3. Three Run-Throughs** | [`PERSONAS.md`](./PERSONAS.md) | Complete step-by-step trace of questions asked, four outputs (O1-O4), negotiation cards, and domain analysis for **Priya**, **Ravi**, and **Anita**. |
| **4. 5-Minute Walkthrough** | [`WALKTHROUGH.md`](./WALKTHROUGH.md) | Architectural review, persona resolutions, **what we would build next**, and **what we would cut**. |

---

## 🎯 The 5 Cardinal Rules We Built By

1. **Adaptive Question Flow:** Salaried MNC workers, self-employed kirana shop owners, and informal gig workers see tailored question paths. Irrelevant questions are automatically bypassed.
2. **Confidence Widens with Silence:** Answering only the 8 Must Questions produces wider rate bands (±2.5%) and 60% confidence. Answering tighteners narrows the band (±0.75%) and elevates confidence up to 95%.
3. **Unknown is Never Zero:** "I don't know my credit score" is treated as an unrated New-to-Credit (NTC) profile with a prudent buffer, not an automatic 300 penalty.
4. **Every Number Has a "Why":** Every ceiling, rate band, and verdict includes a plain-English, one-sentence explanation.
5. **India, in Rupees:** Grounded in real Indian banking standards — FOIR (32%-65%), RBI repo rate linkage, statutory LTV limits (55% shop, 65% house, 75% gold), and transparent RBI all-in APR disclosure (Base Rate + PF + 18% GST + Stamp Duty + Insurance).

---

## 👥 The Three Benchmark Personas

Try them instantly with 1-click buttons in the app header:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1-Click Persona Pre-Loaders                                                │
│ 👩‍💻 Priya, 29 (Salaried MNC · 780 CIBIL · ₹8L Wedding Loan)               │
│    ➜ Verdict: BORROW LESS (Consumption caution; cap at safe capacity)      │
│ 🏪 Ravi, 42 (Kirana Owner · 14y Vintage · ₹45L Shop · ₹15L Stock Loan)     │
│    ➜ Verdict: BORROW — BUT PIVOT (Pivot from 21% Unsecured to 10% LAP)     │
│ 🛵 Anita, 35 (Informal Rider · Stressed Cashflow · ₹1.5L EV Scooter Loan)  │
│    ➜ Verdict: DONT BORROW UNSECURED (Pivot to Subsidized EV Asset Finance) │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture & Code Organization

The domain logic is 100% decoupled from the UI:

```
src/
├── engine/                       # Pure TypeScript Rule Engine (Zero UI dependencies)
│   ├── types.ts                  # Domain models, outputs, and persona types
│   ├── rules.ts                  # FOIR tables, benchmark rates, LTV caps, fee matrices
│   ├── calculator.ts             # Mathematical evaluation engine (O1-O4 & APR)
│   ├── questions.ts              # Adaptive question schema with impact tags
│   ├── personas.ts               # Ground truth datasets for Priya, Ravi, and Anita
│   └── test-engine.ts            # Automated console test suite for verification
├── components/                   # React UI Components
│   ├── Header.tsx                # Top bar with 1-click persona loaders & confidence meter
│   ├── Questionnaire.tsx         # Adaptive wizard with Must vs Deep-Dive toggle
│   ├── OutputsDashboard.tsx      # Main dashboard container
│   ├── VerdictCard.tsx           # O1: Borrow / Don't borrow / Borrow less
│   ├── CapacityCard.tsx          # O2: Lender Sanction vs Safe Capacity
│   ├── RateCard.tsx              # O3: Fair Rate Band & All-In APR Breakdown
│   ├── EmiStressCard.tsx         # O4: Safe Monthly EMI Ceiling & Stress Testing
│   ├── NegotiationCard.tsx       # 1-Page Printable Lender Negotiation Battle-Card
│   ├── RuleInspectorModal.tsx    # Interactive RULES.md viewer
│   └── PersonasRunthroughModal.tsx # Side-by-side persona comparative review
├── App.tsx                       # State orchestration & reactive evaluation
├── main.tsx                      # Entry point
└── index.css                     # Design tokens, typography & print stylesheets
```

---

## 📄 License & Attribution

Built for the **Lokta Borrower Copilot Challenge**.  
All domain logic, underwriting heuristics, and negotiation frameworks are open and documented.
