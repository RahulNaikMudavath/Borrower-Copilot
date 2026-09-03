import { PersonaProfile } from './types';

export const PERSONAS: Record<'priya' | 'ravi' | 'anita', PersonaProfile> = {
  priya: {
    id: 'priya',
    name: 'Priya',
    age: 29,
    location: 'Bengaluru',
    employmentType: 'salaried',
    tagline: 'MNC Software Engineer · Prime Credit · Wedding Loan',
    story: 'Software engineer at a large MNC for 5 years. Net ₹1,10,000/month. One car loan (EMI ₹14,000, 2 years left). Credit score 780. Rents at ₹28,000/month in Indiranagar. Looking to fund her upcoming wedding.',
    ask: 'Wants ₹8,00,000 personal loan for wedding expenses.',
    inputs: {
      purpose: 'wedding_consumption',
      loanAmountWanted: 800000,
      loanTypeWanted: 'personal',
      monthlyNetIncome: 110000,
      employmentType: 'salaried',
      existingMonthlyEmi: 14000,
      monthlyHouseholdExpenses: 48000, // 28k rent + 20k living
      age: 29,
      creditScoreTier: '750_plus',
      creditScoreValue: 780,
      incomeStabilityYears: 5,
      variableIncomeSharePct: 10,
      creditCardUtilizationPct: 15,
      pastEmiBouncesLast12M: 0,
      emergencySavingsMonths: 4,
      hasCollateral: false,
      existingLenderOfferRate: 13.5, // Common private bank overcharge quote
      existingLenderOfferPfPct: 2.0,
    },
    expectedTakeaways: {
      o1Expectation: 'Borrow Less / Trim Budget. Wedding is 0% ROI consumption. Banks will approve ₹15L+, but taking ₹8L locks in ₹26k/mo EMI for 3 years.',
      o2Expectation: 'Lender will sanction up to ₹16,50,000 (FOIR 60%), but borrower safe capacity is ₹8,40,000. Recommend capping loan at ₹4-5L and co-funding with savings.',
      o3Expectation: 'Fair rate band is 10.50% - 11.75%. Bank quote of 13.5% is an overcharge. Fair APR ~11.8%.',
      o4Expectation: 'Safe EMI ceiling is ~₹28,500/mo. At 3 years, ₹8L EMI is ₹26,000/mo, which is tight alongside car EMI. Stress test is resilient, but limits wealth creation.',
      keyStrategy: 'Leverage 780 CIBIL and 5-yr MNC tenure to demand 10.75% interest and 0.5% processing fee waiver, or borrow ₹5L to maintain high monthly savings.'
    }
  },

  ravi: {
    id: 'ravi',
    name: 'Ravi',
    age: 42,
    location: 'Mysuru',
    employmentType: 'self_employed',
    tagline: 'Kirana Store Owner · 14 Yrs Vintage · ₹45L Unencumbered Shop',
    story: 'Runs a successful kirana store for 14 years in Mysuru. Monthly cash turnover generates ₹40,000 - ₹80,000 profit (avg ₹60,000). Official ITR shows ₹4,20,000/year (~₹35,000/mo). Owns the commercial shop premises worth ₹45,00,000 free of debt. Never taken a formal bank loan (No credit score / NTC). Wife earns ₹18,000/mo teaching.',
    ask: 'Wants ₹15,00,000 for a second stock line and delivery vehicle.',
    inputs: {
      purpose: 'business_expansion',
      loanAmountWanted: 1500000,
      loanTypeWanted: 'business_unsecured', // What he thought he needed
      monthlyNetIncome: 35000,              // Official ITR
      cashIncomeMonthly: 40000,             // Unofficial cash surplus
      employmentType: 'self_employed',
      existingMonthlyEmi: 0,
      monthlyHouseholdExpenses: 35000,
      age: 42,
      creditScoreTier: 'unknown_ntc',
      incomeStabilityYears: 14,
      variableIncomeSharePct: 25,
      pastEmiBouncesLast12M: 0,
      emergencySavingsMonths: 3,
      hasCollateral: true,
      collateralType: 'commercial_property',
      collateralMarketValue: 4500000,       // ₹45 Lakhs shop
      coApplicantMonthlyIncome: 18000,      // Wife teaching
      expectedMonthlyIncomeBoost: 25000,    // New stock adds ₹25k/mo margin
      existingLenderOfferRate: 21.0,        // NBFC unsecured quote
      existingLenderOfferPfPct: 3.0,
    },
    expectedTakeaways: {
      o1Expectation: 'Borrow — BUT Pivot Product! Do NOT take an unsecured business loan at 18-24%. Use unencumbered shop for Secured LAP at 9.5-11.0%.',
      o2Expectation: 'Unsecured sanction based on ITR is only ₹3.5L - ₹5L. LAP sanction based on 50% LTV of ₹45L shop is ₹22,50,000. Safe capacity is ₹15,00,000.',
      o3Expectation: 'Fair rate for Secured LAP is 9.50% - 11.25% (vs 21% quoted by NBFC). Saves over ₹6,00,000 in interest over 10 years.',
      o4Expectation: 'Safe EMI ceiling is ~₹38,000/mo (backed by household ₹75k cash flow). 10-year LAP EMI on ₹15L is only ~₹19,800/mo.',
      keyStrategy: 'Present shop ownership deed + 14-year vintage to PSU bank / Small Finance Bank for Secured MSME LAP loan at 10.0%, rejecting all high-cost unsecured NBFC offers.'
    }
  },

  anita: {
    id: 'anita',
    name: 'Anita',
    age: 35,
    location: 'Hubballi',
    employmentType: 'informal',
    tagline: 'Delivery Rider & Tailor · Stressed Cashflow · Productive EV Scooter',
    story: 'Works as a delivery-platform rider and runs home tailoring in Hubballi, earning ₹26,000 - ₹30,000/month. Mother of two; husband has been unemployed for 8 months. Currently burdened with three high-cost instant app loans totaling ₹35,000 at 30%+ interest (paying ₹4,500/mo). One EMI bounced last month due to irregular delivery earnings.',
    ask: 'Wants ₹1,50,000 for a commercial electric scooter to double delivery runs.',
    inputs: {
      purpose: 'vehicle_productive',
      loanAmountWanted: 150000,
      loanTypeWanted: 'personal',            // Seeking emergency cash loan
      monthlyNetIncome: 28000,
      employmentType: 'informal',
      existingMonthlyEmi: 4500,
      existingHighCostLoanOutstanding: 35000,
      existingLoanCount: 3,
      monthlyHouseholdExpenses: 21000,       // Food, rent, 2 kids schooling
      age: 35,
      creditScoreTier: 'below_650',
      incomeStabilityYears: 2,
      variableIncomeSharePct: 40,
      pastEmiBouncesLast12M: 1,
      emergencySavingsMonths: 0.5,
      hasCollateral: false,
      expectedMonthlyIncomeBoost: 12000,     // EV scooter doubles delivery runs
      existingLenderOfferRate: 36.0,         // App loan offer
      existingLenderOfferPfPct: 5.0,
    },
    expectedTakeaways: {
      o1Expectation: 'Do Not Borrow Unsecured / Restructure First. Taking another 30%+ app loan will lead to debt spiral. Must pivot to EV asset finance or SHG loan.',
      o2Expectation: 'Unsecured lenders will sanction ₹0 to ₹30k predatory payday credit. Safe borrowing capacity for general credit is only ₹40,000.',
      o3Expectation: 'Unsecured commercial rate is 26% - 36%. Subsidized EV asset financing or PM SVANidhi is 9.0% - 12.5%.',
      o4Expectation: 'Safe EMI ceiling is strictly ₹3,200/mo. Stress test indicates extreme vulnerability if husband remains unemployed or emergency arises.',
      keyStrategy: 'Do NOT take an app personal loan. Use EV dealership tie-up for priority-sector vehicle hypothecation (85% LTV, 12% interest, ₹3,100 EMI over 48 months) and consolidate the 35k app loans.'
    }
  }
};
