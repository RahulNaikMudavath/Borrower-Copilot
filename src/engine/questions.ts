import { BorrowerInputs, CreditScoreTier, EmploymentType, LoanPurpose, LoanType } from './types';

export type QuestionTier = 'must' | 'tightener';

export interface QuestionDefinition {
  id: keyof BorrowerInputs;
  tier: QuestionTier;
  label: string;
  sublabel: string;
  type: 'select' | 'currency' | 'number' | 'radio' | 'boolean';
  options?: Array<{ value: string; label: string; description?: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  impactTag: string; // e.g., "⚡ Tightens interest rate by ±0.75%"
  whyItMatters: string;
  showIf?: (inputs: Partial<BorrowerInputs>) => boolean;
}

export const QUESTIONS_CATALOG: QuestionDefinition[] = [
  // ==========================================
  // MUST QUESTIONS (Core Minimum ~8-10)
  // ==========================================
  {
    id: 'purpose',
    tier: 'must',
    label: 'What is the primary purpose of this loan?',
    sublabel: 'Lenders evaluate productive loans (which generate income) very differently from consumption loans.',
    type: 'select',
    options: [
      { value: 'wedding_consumption', label: 'Wedding / Social Function (Discretionary Consumption)' },
      { value: 'business_expansion', label: 'Business Expansion / Stock / Inventory (Productive)' },
      { value: 'vehicle_productive', label: 'Commercial Vehicle / Electric Scooter / Delivery (Productive)' },
      { value: 'home_renovation', label: 'Home Renovation / Repair (Asset Improvement)' },
      { value: 'medical_emergency', label: 'Medical Emergency / Unforeseen Hospitalization' },
      { value: 'debt_consolidation', label: 'Debt Consolidation (Paying off high-cost loans)' },
      { value: 'general_consumption', label: 'Lifestyle / Travel / Electronics (Personal Consumption)' },
      { value: 'other', label: 'Other General Purpose' },
    ],
    impactTag: '🎯 Drives O1 Verdict (Borrow vs Don’t Borrow)',
    whyItMatters: 'Consumption loans create pure liability with zero financial ROI. Productive loans create cash flow to pay their own EMI.'
  },
  {
    id: 'loanAmountWanted',
    tier: 'must',
    label: 'How much money are you looking to borrow?',
    sublabel: 'Enter the amount in Indian Rupees (₹).',
    type: 'currency',
    placeholder: 'e.g. 800000',
    min: 10000,
    max: 100000000,
    step: 10000,
    impactTag: '📊 Benchmarks against Safe Capacity & Sanction Limits',
    whyItMatters: 'Compares your asked amount with what lenders will approve vs what your cashflow can safely carry.'
  },
  {
    id: 'loanTypeWanted',
    tier: 'must',
    label: 'What type of loan are you currently considering?',
    sublabel: 'You can choose what you had in mind; the Copilot may suggest a cheaper structure.',
    type: 'select',
    options: [
      { value: 'personal', label: 'Personal Loan (Unsecured, standard 1-5 yrs)' },
      { value: 'business_unsecured', label: 'Unsecured Business / Working Capital Loan' },
      { value: 'lap_secured', label: 'Loan Against Property / LAP (Secured by Shop or House)' },
      { value: 'two_wheeler_ev', label: 'Two-Wheeler / Electric Vehicle Loan' },
      { value: 'home_loan', label: 'Home Purchase Loan' },
      { value: 'gold_loan', label: 'Gold Jewellery Loan' },
      { value: 'instant_app_loan', label: 'Instant Digital / Fintech App Loan' },
    ],
    impactTag: '🏷️ Sets Base Interest Rate Band & APR Model',
    whyItMatters: 'Different loan types have vastly different RBI statutory caps, LTVs, and tenure horizons.'
  },
  {
    id: 'employmentType',
    tier: 'must',
    label: 'What is your employment / income structure?',
    sublabel: 'Indian lenders price salaried, self-employed, and gig/informal workers on different risk curves.',
    type: 'radio',
    options: [
      { value: 'salaried', label: 'Salaried (MNC / Corporate / Govt / Steady monthly pay)' },
      { value: 'self_employed', label: 'Self-Employed (Shopkeeper, Trader, MSME, Professional)' },
      { value: 'informal', label: 'Informal / Gig / Daily Earner (Delivery rider, Artisan, Driver)' },
    ],
    impactTag: '🛡️ Adapts FOIR Haircut & Underwriting Path',
    whyItMatters: 'Salaried incomes get 60-65% FOIR; informal/cash incomes face 30-45% lender haircuts.'
  },
  {
    id: 'monthlyNetIncome',
    tier: 'must',
    label: 'What is your net monthly take-home income?',
    sublabel: 'For salaried: in-hand salary. For business/informal: average monthly net profit.',
    type: 'currency',
    placeholder: 'e.g. 110000',
    min: 5000,
    max: 50000000,
    step: 1000,
    impactTag: '💰 Primary Driver of Maximum EMI & Loan Sanction',
    whyItMatters: 'Establishes your total monthly cash envelope for servicing debt and household needs.'
  },
  {
    id: 'existingMonthlyEmi',
    tier: 'must',
    label: 'Total existing EMIs you pay each month',
    sublabel: 'Sum of all ongoing car loans, bike loans, personal loans, consumer durables, etc.',
    type: 'currency',
    placeholder: 'e.g. 14000 (enter 0 if none)',
    min: 0,
    max: 10000000,
    step: 500,
    impactTag: '📉 Reduces Safe Monthly Borrowing Capacity rupee-for-rupee',
    whyItMatters: 'Existing debt directly consumes your FOIR allocation before new loans can be sanctioned.'
  },
  {
    id: 'monthlyHouseholdExpenses',
    tier: 'must',
    label: 'Monthly household living expenses & rent',
    sublabel: 'Rent, groceries, school fees, utilities, medical (excluding loan EMIs).',
    type: 'currency',
    placeholder: 'e.g. 48000',
    min: 1000,
    max: 10000000,
    step: 1000,
    impactTag: '🛡️ Determines Real Disposable Cash Cushion',
    whyItMatters: 'Banks ignore high living expenses (e.g. Indiranagar rent), but your personal cashflow cannot.'
  },
  {
    id: 'creditScoreTier',
    tier: 'must',
    label: 'Do you know your Credit / CIBIL Score?',
    sublabel: 'If unknown, we will use conservative proxy indicators without penalizing you unfairly.',
    type: 'select',
    options: [
      { value: '750_plus', label: '750+ (Prime / Excellent — Clean history)' },
      { value: '700_749', label: '700 - 749 (Good — Minor delays or recent inquiries)' },
      { value: '650_699', label: '650 - 699 (Fair / Subprime — High utilization or past strain)' },
      { value: 'below_650', label: 'Below 650 (High Risk / Past DPDs or Settlements)' },
      { value: 'unknown_ntc', label: 'I Don’t Know / Never Taken a Formal Bank Loan (New to Credit)' },
    ],
    impactTag: '📈 Adjusts Rate Spread by +0.0% to +4.5%',
    whyItMatters: 'Prime borrowers get benchmark repo-linked rates. NTC is modeled with a prudent buffer, not a 300 penalty.'
  },
  {
    id: 'age',
    tier: 'must',
    label: 'Your Age',
    sublabel: 'Determines maximum permissible loan tenure before standard retirement limits.',
    type: 'number',
    placeholder: 'e.g. 29',
    min: 18,
    max: 75,
    step: 1,
    impactTag: '⏳ Sets Max Loan Tenure Horizon',
    whyItMatters: 'Lenders limit tenure so loans mature before age 60 (salaried) or 65 (self-employed).'
  },

  // ==========================================
  // ADDITIONAL QUESTIONS (Range Tighteners)
  // ==========================================
  {
    id: 'incomeStabilityYears',
    tier: 'tightener',
    label: 'How many years have you been in this job / running this business?',
    sublabel: 'e.g. 5 years at MNC or 14 years running the kirana shop.',
    type: 'number',
    placeholder: 'e.g. 5',
    min: 0,
    max: 50,
    impactTag: '⚡ Tightens Confidence by +5% and improves leverage score',
    whyItMatters: '3+ years vintage unlocks tier-1 bank pricing and eliminates employer risk surcharges.'
  },
  {
    id: 'cashIncomeMonthly',
    tier: 'tightener',
    label: 'Unrecorded / Cash monthly profit (Self-Employed / Informal)',
    sublabel: 'Actual cash in hand not yet reflected in bank statements or ITR.',
    type: 'currency',
    placeholder: 'e.g. 40000',
    min: 0,
    max: 10000000,
    impactTag: '⚡ Adds recognized repayment capacity with standard 50% cash haircut',
    whyItMatters: 'Lenders haircut unbanked cash, but self-assessment accounts for true family cashflow.',
    showIf: (inputs) => inputs.employmentType === 'self_employed' || inputs.employmentType === 'informal'
  },
  {
    id: 'pastEmiBouncesLast12M',
    tier: 'tightener',
    label: 'Have you had any NACH / Cheque / EMI bounces in the last 12 months?',
    sublabel: 'Even 1 bounce signals cashflow volatility to automated underwriting engines.',
    type: 'number',
    placeholder: '0 if none',
    min: 0,
    max: 12,
    impactTag: '⚠️ Triggers Default Risk flags and widens rate spread',
    whyItMatters: 'A bounce in the last 6-12 months can disqualify you from prime bank rates or trigger DONT_BORROW.'
  },
  {
    id: 'existingHighCostLoanOutstanding',
    tier: 'tightener',
    label: 'Total outstanding on high-cost instant app loans or credit card rollovers',
    sublabel: 'Enter the principal balance on loans charging > 24% annual interest.',
    type: 'currency',
    placeholder: 'e.g. 35000 (0 if none)',
    min: 0,
    max: 5000000,
    impactTag: '🚨 Detects debt spiral risk and triggers Debt Restructuring pivot',
    whyItMatters: 'Taking new loans while holding 30%+ app debt almost always worsens financial distress.'
  },
  {
    id: 'emergencySavingsMonths',
    tier: 'tightener',
    label: 'How many months of basic expenses do you have saved in liquid funds?',
    sublabel: 'Fixed deposits, savings accounts, or easily sellable gold.',
    type: 'number',
    placeholder: 'e.g. 3 (enter 0 if living month-to-month)',
    min: 0,
    max: 36,
    impactTag: '🛡️ Modifies Stress-Test Resilience and Safe FOIR ceiling',
    whyItMatters: 'Having < 1 month emergency runway makes any new debt high-risk under income shocks.'
  },
  {
    id: 'hasCollateral',
    tier: 'tightener',
    label: 'Do you own any unencumbered property, shop, or gold that can be pledged?',
    sublabel: 'Unencumbered means 100% owned by you with zero existing mortgages or liens.',
    type: 'boolean',
    impactTag: '🔑 Unlocks LAP / Secured pivots (slashing rates from 20% to 9.5%)',
    whyItMatters: 'Securing a loan with property or gold cuts interest rates in half and doubles loan tenure.'
  },
  {
    id: 'collateralType',
    tier: 'tightener',
    label: 'What type of collateral do you own?',
    sublabel: 'Commercial shops, houses, or gold have different statutory LTV caps.',
    type: 'select',
    options: [
      { value: 'commercial_property', label: 'Commercial Property / Shop Premises (50-55% LTV)' },
      { value: 'residential_property', label: 'Residential House / Flat (65% LAP LTV, 80% HL)' },
      { value: 'gold', label: 'Gold Jewellery / Ornaments (75% RBI LTV)' },
      { value: 'vehicle', label: 'Automobile / Vehicle (70-80% LTV)' },
      { value: 'none', label: 'None / Prefer Unsecured' },
    ],
    impactTag: '🏛️ Sets Regulatory LTV Constraint',
    whyItMatters: 'RBI caps LTV at 50-55% for commercial shops and 75% for gold.',
    showIf: (inputs) => Boolean(inputs.hasCollateral)
  },
  {
    id: 'collateralMarketValue',
    tier: 'tightener',
    label: 'Approximate current market value of your collateral',
    sublabel: 'e.g. ₹45,00,000 for Ravi’s commercial shop premises.',
    type: 'currency',
    placeholder: 'e.g. 4500000',
    min: 50000,
    max: 500000000,
    impactTag: '💎 Calculates Maximum Asset-Backed Sanction Cap',
    whyItMatters: 'Directly unlocks huge sanction headroom at ultra-low prime interest rates.',
    showIf: (inputs) => Boolean(inputs.hasCollateral)
  },
  {
    id: 'coApplicantMonthlyIncome',
    tier: 'tightener',
    label: 'Monthly net income of working spouse or co-applicant',
    sublabel: 'e.g. ₹18,000/month from teaching or family business contribution.',
    type: 'currency',
    placeholder: 'e.g. 18000 (0 if none)',
    min: 0,
    max: 10000000,
    impactTag: '👥 Expands Total Household Servicing Capacity',
    whyItMatters: 'Adding a co-applicant pools cash flows, dramatically improving FOIR and sanction odds.'
  },
  {
    id: 'expectedMonthlyIncomeBoost',
    tier: 'tightener',
    label: 'Expected additional monthly profit / income generated by this loan',
    sublabel: 'e.g. Delivery scooter adds ₹12,000/mo; second stock line adds ₹25,000/mo.',
    type: 'currency',
    placeholder: 'e.g. 25000 (0 if purely personal consumption)',
    min: 0,
    max: 10000000,
    impactTag: '📈 Evaluates Productive Loan Self-Repayment ROI',
    whyItMatters: 'If a loan generates more monthly revenue than its EMI, it strengthens the case to BORROW.'
  },
  {
    id: 'existingLenderOfferRate',
    tier: 'tightener',
    label: 'Has a bank or app already quoted you an interest rate (%)?',
    sublabel: 'Enter the interest rate they offered so we can benchmark it against fair market rates.',
    type: 'number',
    placeholder: 'e.g. 14.0 or 21.0',
    min: 5,
    max: 60,
    step: 0.1,
    impactTag: '⚡ Triggers instant Overcharge Warning and Counter-Offer Script',
    whyItMatters: 'Allows immediate side-by-side comparison of the lender’s quote against your fair rate band.'
  }
];
