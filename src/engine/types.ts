export type EmploymentType = 'salaried' | 'self_employed' | 'informal';

export type LoanPurpose = 
  | 'wedding_consumption'
  | 'business_expansion'
  | 'vehicle_productive'
  | 'home_renovation'
  | 'medical_emergency'
  | 'debt_consolidation'
  | 'general_consumption'
  | 'other';

export type LoanType = 
  | 'personal'
  | 'business_unsecured'
  | 'lap_secured'
  | 'gold_loan'
  | 'two_wheeler_ev'
  | 'home_loan'
  | 'microfinance_shg'
  | 'instant_app_loan';

export type CreditScoreTier = 
  | '750_plus'     // Excellent / Prime
  | '700_749'      // Good / Near Prime
  | '650_699'      // Average / Subprime
  | 'below_650'    // High Risk / Stressed
  | 'unknown_ntc'; // New-to-Credit / Unknown

export interface BorrowerInputs {
  // --- MUST QUESTIONS (Core Minimum ~8-10) ---
  purpose: LoanPurpose;
  loanAmountWanted: number;
  loanTypeWanted: LoanType;
  monthlyNetIncome: number;
  employmentType: EmploymentType;
  existingMonthlyEmi: number;
  monthlyHouseholdExpenses: number;
  age: number;
  creditScoreTier: CreditScoreTier;
  creditScoreValue?: number; // Exact score if known (e.g., 780)

  // --- ADDITIONAL QUESTIONS (Range Tighteners) ---
  incomeStabilityYears?: number;           // Years in current job/business
  variableIncomeSharePct?: number;         // % of income that is variable/incentives
  cashIncomeMonthly?: number;              // Unofficial/cash earnings (self-employed/informal)
  itrReportedAnnual?: number;              // Official ITR reported income
  existingLoanCount?: number;              // Total number of ongoing loans
  existingHighCostLoanOutstanding?: number;// e.g., app loans at 30%+
  pastEmiBouncesLast12M?: number;          // Recent check/NACH bounces
  creditCardUtilizationPct?: number;       // > 40% hurts risk profile
  emergencySavingsMonths?: number;         // Liquid emergency fund in months of expenses
  hasCollateral?: boolean;
  collateralType?: 'commercial_property' | 'residential_property' | 'gold' | 'vehicle' | 'none';
  collateralMarketValue?: number;          // e.g. Shop worth ₹45,00,000
  coApplicantMonthlyIncome?: number;       // e.g. Wife earning ₹18,000
  upcomingLargeExpenses12M?: number;       // Medical/education/family commitments
  expectedMonthlyIncomeBoost?: number;     // e.g. EV scooter adds ₹10,000/mo net earnings
  existingLenderOfferRate?: number;        // Quote received from bank/app (e.g. 14%, 36%)
  existingLenderOfferPfPct?: number;       // Processing fee quoted by lender
}

export type VerdictType = 'BORROW' | 'BORROW_LESS' | 'DONT_BORROW';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ConfidenceTier = 'LOW' | 'MEDIUM' | 'HIGH';

export interface O1Verdict {
  verdict: VerdictType;
  badgeText: string;
  headline: string;
  primaryReason: string;
  detailedReasons: string[];
  riskLevel: RiskLevel;
  suggestedAlternativeProduct?: LoanType;
  suggestedAlternativeAmount?: number;
  pivotRecommendation?: string;
}

export interface O2Capacity {
  lenderLikelySanction: number;
  borrowerSafeCapacity: number;
  recommendedAmount: number;
  recommendedSource: 'SAFE_CAPACITY' | 'LENDER_SANCTION' | 'REDUCED_BUDGET';
  explanation: string;
  lenderFoirLimitPct: number;
  borrowerSafeFoirLimitPct: number;
  currentDtiPct: number;
  projectedDtiPct: number;
  collateralLtvCapAmount?: number;
  collateralLtvPct?: number;
}

export interface APRBreakdown {
  baseRatePct: number;
  processingFeePct: number;
  processingFeeAmount: number;
  gstAmount: number; // 18% on Processing Fee
  stampDutyAndDocCharges: number;
  insurancePremiumAmount: number;
  allInAprPct: number;
  totalUpfrontCharges: number;
  netDisbursalAmount: number;
}

export interface O3Rate {
  fairRateMin: number;
  fairRateMax: number;
  benchmarkRate: number;
  apr: APRBreakdown;
  confidenceBandWidth: number; // in percentage points, e.g. +/- 1.5%
  rateReason: string;
  overchargeAlert: string | null;
  negotiationTargetRate: number;
}

export interface TenureOption {
  tenureYears: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterestPaid: number;
  totalRepayment: number;
  projectedFoirPct: number;
  isSafe: boolean;
  isRecommended: boolean;
}

export interface StressScenarioResult {
  title: string;
  description: string;
  stressedIncome: number;
  stressedEmi: number;
  stressedFoirPct: number;
  cushionRemaining: number;
  isVulnerable: boolean;
  verdict: string;
}

export interface O4Emi {
  maxSafeMonthlyEmi: number;
  lenderMaxMonthlyEmi: number;
  recommendedTenureYears: number;
  recommendedEmi: number;
  tenureOptions: TenureOption[];
  stressTest: {
    incomeShock20Pct: StressScenarioResult;
    rateHike200Bps: StressScenarioResult;
    emergencyFundSurvivalMonths: number;
    combinedRiskAssessment: string;
  };
  explanation: string;
}

export interface NegotiationTalkingPoint {
  topic: string;
  whatLenderSays: string;
  whatYouSay: string;
  leverageFact: string;
}

export interface NegotiationCardData {
  borrowerName?: string;
  borrowerTypeSummary: string;
  targetLoanType: string;
  targetLoanAmount: number;
  
  // Power Metrics
  fairRateRange: string;
  targetAprCeiling: string;
  safeEmiCeiling: string;
  leverageScore: number; // 1-100
  leverageSummary: string;

  // The 3 Red Lines (Walk away if...)
  redLines: string[];

  // Recommended Branch Script / Pitch
  counterOfferScript: string;
  
  // Strategic Product Pivot (if any)
  productPivot?: {
    fromProduct: string;
    toProduct: string;
    interestSavingsEst: number;
    rationale: string;
  };

  // 4 Branch Manager Questions
  essentialBranchQuestions: string[];
}

export interface CalculatedOutputs {
  o1Verdict: O1Verdict;
  o2Capacity: O2Capacity;
  o3Rate: O3Rate;
  o4Emi: O4Emi;
  confidenceScore: number; // 0 to 100
  confidenceTier: ConfidenceTier;
  confidenceExplanation: string;
  unansweredKeyTighteners: string[];
  negotiationCard: NegotiationCardData;
  calculatedAt: string;
}

export interface PersonaProfile {
  id: 'priya' | 'ravi' | 'anita';
  name: string;
  age: number;
  location: string;
  employmentType: EmploymentType;
  tagline: string;
  story: string;
  ask: string;
  inputs: BorrowerInputs;
  expectedTakeaways: {
    o1Expectation: string;
    o2Expectation: string;
    o3Expectation: string;
    o4Expectation: string;
    keyStrategy: string;
  };
}
