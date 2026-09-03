import { CreditScoreTier, EmploymentType, LoanPurpose, LoanType } from './types';

/**
 * LOKTA BORROWER COPILOT - REGULATORY & BENCHMARK RULES
 * All rules documented here are cross-referenced in RULES.md
 */

// 1. BASE REPO RATE & SPREADS (RBI Benchmark: Repo Rate ~6.50% standard anchor)
export const REPO_RATE_BENCHMARK = 6.50;

// 2. PRODUCT BENCHMARK BASELINE RATES (Prime Tier: 750+ CIBIL)
export const PRODUCT_BASE_RATES: Record<LoanType, { primeMin: number; primeMax: number; defaultTenureYrs: number; maxTenureYrs: number }> = {
  home_loan: { primeMin: 8.40, primeMax: 8.95, defaultTenureYrs: 20, maxTenureYrs: 30 },
  lap_secured: { primeMin: 9.25, primeMax: 10.75, defaultTenureYrs: 10, maxTenureYrs: 15 },
  personal: { primeMin: 10.50, primeMax: 12.50, defaultTenureYrs: 3, maxTenureYrs: 5 },
  business_unsecured: { primeMin: 14.00, primeMax: 17.50, defaultTenureYrs: 3, maxTenureYrs: 5 },
  two_wheeler_ev: { primeMin: 10.50, primeMax: 13.00, defaultTenureYrs: 3, maxTenureYrs: 4 },
  gold_loan: { primeMin: 8.75, primeMax: 10.50, defaultTenureYrs: 1, maxTenureYrs: 2 },
  microfinance_shg: { primeMin: 18.00, primeMax: 22.00, defaultTenureYrs: 2, maxTenureYrs: 3 },
  instant_app_loan: { primeMin: 30.00, primeMax: 42.00, defaultTenureYrs: 1, maxTenureYrs: 2 },
};

// 3. CREDIT SCORE TIER SPREAD ADJUSTMENTS (Added to Base Rate)
export const CREDIT_TIER_SPREADS: Record<CreditScoreTier, { spreadMin: number; spreadMax: number; confidenceModifier: number; label: string }> = {
  '750_plus': { spreadMin: 0.0, spreadMax: 0.5, confidenceModifier: 1.0, label: 'Prime (750+)' },
  '700_749': { spreadMin: 1.0, spreadMax: 2.0, confidenceModifier: 0.95, label: 'Near-Prime (700-749)' },
  '650_699': { spreadMin: 2.5, spreadMax: 4.5, confidenceModifier: 0.85, label: 'Subprime (650-699)' },
  'below_650': { spreadMin: 5.5, spreadMax: 9.0, confidenceModifier: 0.70, label: 'High Risk / Stressed (<650)' },
  'unknown_ntc': { spreadMin: 1.5, spreadMax: 3.5, confidenceModifier: 0.80, label: 'New-to-Credit / Unknown (NTC)' },
};

// 4. EMPLOYMENT TYPE RISK SPREADS
export const EMPLOYMENT_TYPE_SPREADS: Record<EmploymentType, { spreadMin: number; spreadMax: number; foirHaircut: number }> = {
  salaried: { spreadMin: 0.0, spreadMax: 0.5, foirHaircut: 1.0 },
  self_employed: { spreadMin: 0.75, spreadMax: 1.75, foirHaircut: 0.85 }, // Cash flows have variance
  informal: { spreadMin: 2.0, spreadMax: 4.5, foirHaircut: 0.70 },      // Unbanked / Gig daily risk
};

// 5. MAXIMUM FOIR (Fixed Obligation to Income Ratio) SLABS
// Standard Indian Banking Underwriting vs Prudent Borrower Safe Limit
export interface FoirSlab {
  minIncome: number;
  maxIncome: number;
  lenderMaxFoir: number;   // What the lender stretches to
  borrowerSafeFoir: number; // What the borrower can comfortably service without living on the edge
}

export const FOIR_SLABS: FoirSlab[] = [
  { minIncome: 0, maxIncome: 35000, lenderMaxFoir: 0.45, borrowerSafeFoir: 0.32 },
  { minIncome: 35001, maxIncome: 75000, lenderMaxFoir: 0.55, borrowerSafeFoir: 0.40 },
  { minIncome: 75001, maxIncome: 150000, lenderMaxFoir: 0.60, borrowerSafeFoir: 0.45 },
  { minIncome: 150001, maxIncome: Infinity, lenderMaxFoir: 0.65, borrowerSafeFoir: 0.50 },
];

// 6. RBI REGULATORY LTV (Loan-To-Value) CAPS
export const LTV_CAPS = {
  commercial_property: 0.55, // 50-55% for commercial shops / premises (e.g., Ravi's shop)
  residential_property: 0.65, // 65% for LAP, 75-85% for standard Home Loan
  gold: 0.75,                // RBI statutory cap 75% for gold jewellery loans
  vehicle: 0.80,             // 80% on ex-showroom invoice for 2-wheeler / EV
  none: 0.0,
};

// 7. PURPOSE PRODUCTIVITY CLASSIFICATION
export const PURPOSE_PRODUCTIVITY: Record<LoanPurpose, { isProductive: boolean; roiExpectation: string; consumptionRisk: boolean; verdictBias: 'encourage' | 'neutral' | 'caution' | 'discourage' }> = {
  wedding_consumption: { isProductive: false, roiExpectation: 'Negative / Zero (pure consumption event)', consumptionRisk: true, verdictBias: 'caution' },
  general_consumption: { isProductive: false, roiExpectation: 'Negative / Zero (lifestyle / discretionary)', consumptionRisk: true, verdictBias: 'caution' },
  business_expansion: { isProductive: true, roiExpectation: 'Positive (>20% IRR on working capital/stock)', consumptionRisk: false, verdictBias: 'encourage' },
  vehicle_productive: { isProductive: true, roiExpectation: 'Positive (enables or doubles daily delivery income)', consumptionRisk: false, verdictBias: 'encourage' },
  home_renovation: { isProductive: false, roiExpectation: 'Neutral (lifestyle / asset upkeep)', consumptionRisk: false, verdictBias: 'neutral' },
  medical_emergency: { isProductive: false, roiExpectation: 'Survival / Emergency (unavoidable)', consumptionRisk: false, verdictBias: 'neutral' },
  debt_consolidation: { isProductive: true, roiExpectation: 'High (replaces 30-40% debt with 12-14% debt)', consumptionRisk: false, verdictBias: 'encourage' },
  other: { isProductive: false, roiExpectation: 'Varies', consumptionRisk: false, verdictBias: 'neutral' },
};

// 8. PROCESSING FEE & STATUTORY CHARGES BENCHMARKS (RBI Transparent Disclosure Standard)
export const FEE_BENCHMARKS: Record<LoanType, { pfPctMin: number; pfPctMax: number; defaultPfPct: number; stampDutyEst: number; insurancePctEst: number }> = {
  home_loan: { pfPctMin: 0.25, pfPctMax: 0.50, defaultPfPct: 0.35, stampDutyEst: 2500, insurancePctEst: 0.40 },
  lap_secured: { pfPctMin: 0.50, pfPctMax: 1.00, defaultPfPct: 0.75, stampDutyEst: 4000, insurancePctEst: 0.50 },
  personal: { pfPctMin: 1.00, pfPctMax: 2.50, defaultPfPct: 1.50, stampDutyEst: 750, insurancePctEst: 0.80 },
  business_unsecured: { pfPctMin: 1.50, pfPctMax: 3.00, defaultPfPct: 2.00, stampDutyEst: 1500, insurancePctEst: 0.80 },
  two_wheeler_ev: { pfPctMin: 1.00, pfPctMax: 2.00, defaultPfPct: 1.50, stampDutyEst: 500, insurancePctEst: 1.00 },
  gold_loan: { pfPctMin: 0.25, pfPctMax: 0.75, defaultPfPct: 0.50, stampDutyEst: 200, insurancePctEst: 0.00 },
  microfinance_shg: { pfPctMin: 1.00, pfPctMax: 2.00, defaultPfPct: 1.00, stampDutyEst: 100, insurancePctEst: 0.50 },
  instant_app_loan: { pfPctMin: 3.00, pfPctMax: 8.00, defaultPfPct: 5.00, stampDutyEst: 250, insurancePctEst: 0.00 },
};

export const GST_RATE_ON_FEES = 0.18; // 18% GST on all bank processing fees

// Helper to find applicable FOIR slab
export function getFoirSlab(income: number): FoirSlab {
  for (const slab of FOIR_SLABS) {
    if (income >= slab.minIncome && income <= slab.maxIncome) {
      return slab;
    }
  }
  return FOIR_SLABS[FOIR_SLABS.length - 1];
}
