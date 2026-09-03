import { 
  BorrowerInputs, 
  CalculatedOutputs, 
  ConfidenceTier, 
  CreditScoreTier, 
  LoanType, 
  O1Verdict, 
  O2Capacity, 
  O3Rate, 
  O4Emi, 
  RiskLevel, 
  TenureOption, 
  VerdictType,
  NegotiationCardData
} from './types';
import { 
  CREDIT_TIER_SPREADS, 
  EMPLOYMENT_TYPE_SPREADS, 
  FEE_BENCHMARKS, 
  FOIR_SLABS, 
  GST_RATE_ON_FEES, 
  LTV_CAPS, 
  PRODUCT_BASE_RATES, 
  PURPOSE_PRODUCTIVITY, 
  getFoirSlab 
} from './rules';

/**
 * Standard EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEmi(principal: number, annualRatePct: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return principal / tenureMonths;
  const monthlyRate = annualRatePct / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

/**
 * Present Value / Loan Capacity Formula: EMI * ((1+r)^n - 1) / (r * (1+r)^n)
 */
export function calculateMaxPrincipalFromEmi(maxEmi: number, annualRatePct: number, tenureMonths: number): number {
  if (maxEmi <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePct <= 0) return maxEmi * tenureMonths;
  const monthlyRate = annualRatePct / 12 / 100;
  const principal = maxEmi * (Math.pow(1 + monthlyRate, tenureMonths) - 1) / 
                    (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
  return Math.round(principal);
}

/**
 * Calculate All-In APR including processing fee, 18% GST, and statutory charges
 */
export function calculateAllInApr(
  principal: number, 
  nominalRatePct: number, 
  tenureMonths: number, 
  loanType: LoanType,
  customPfPct?: number
) {
  const feeBench = FEE_BENCHMARKS[loanType] || FEE_BENCHMARKS.personal;
  const pfPct = customPfPct !== undefined ? customPfPct : feeBench.defaultPfPct;
  const pfAmount = Math.round(principal * (pfPct / 100));
  const gstAmount = Math.round(pfAmount * GST_RATE_ON_FEES);
  const stampDuty = feeBench.stampDutyEst;
  const insuranceAmount = Math.round(principal * (feeBench.insurancePctEst / 100));
  
  const totalUpfrontCharges = pfAmount + gstAmount + stampDuty + insuranceAmount;
  const netDisbursal = principal - totalUpfrontCharges;

  // Approximate effective APR by amortizing upfront costs over loan tenure
  const upfrontCostAnnualizedPct = (totalUpfrontCharges / principal) * (12 / tenureMonths) * 100;
  const effectiveAprPct = Number((nominalRatePct + upfrontCostAnnualizedPct).toFixed(2));

  return {
    baseRatePct: nominalRatePct,
    processingFeePct: pfPct,
    processingFeeAmount: pfAmount,
    gstAmount,
    stampDutyAndDocCharges: stampDuty,
    insurancePremiumAmount: insuranceAmount,
    allInAprPct: effectiveAprPct,
    totalUpfrontCharges,
    netDisbursalAmount: netDisbursal
  };
}

/**
 * Main Evaluation Engine
 */
export function evaluateBorrowerProfile(inputs: BorrowerInputs): CalculatedOutputs {
  const {
    purpose,
    loanAmountWanted,
    loanTypeWanted,
    monthlyNetIncome,
    employmentType,
    existingMonthlyEmi,
    monthlyHouseholdExpenses,
    creditScoreTier,
    creditScoreValue,
    incomeStabilityYears = 1,
    variableIncomeSharePct = 0,
    cashIncomeMonthly = 0,
    itrReportedAnnual = 0,
    pastEmiBouncesLast12M = 0,
    existingHighCostLoanOutstanding = 0,
    emergencySavingsMonths = 1,
    hasCollateral = false,
    collateralType = 'none',
    collateralMarketValue = 0,
    coApplicantMonthlyIncome = 0,
    expectedMonthlyIncomeBoost = 0,
    existingLenderOfferRate,
  } = inputs;

  // -------------------------------------------------------------
  // 1. CONFIDENCE CALCULATION (Tightens with answers)
  // -------------------------------------------------------------
  let confidenceScore = 60; // Base score with Must questions answered
  const answeredTighteners: string[] = [];
  const unansweredKeyTighteners: string[] = [];

  if (inputs.incomeStabilityYears !== undefined) { confidenceScore += 5; answeredTighteners.push('Job/Business Vintage'); }
  else { unansweredKeyTighteners.push('Income vintage / business history'); }

  if (inputs.pastEmiBouncesLast12M !== undefined) { confidenceScore += 5; answeredTighteners.push('Repayment track / Bounces'); }
  else { unansweredKeyTighteners.push('Past 12M EMI bounce history'); }

  if (inputs.emergencySavingsMonths !== undefined) { confidenceScore += 5; answeredTighteners.push('Emergency savings buffer'); }
  else { unansweredKeyTighteners.push('Emergency fund runway'); }

  if (inputs.hasCollateral !== undefined && collateralMarketValue > 0) { confidenceScore += 5; answeredTighteners.push('Collateral asset appraisal'); }
  
  if (inputs.coApplicantMonthlyIncome !== undefined && coApplicantMonthlyIncome > 0) { confidenceScore += 5; answeredTighteners.push('Co-applicant income'); }
  
  if (inputs.creditScoreValue !== undefined || creditScoreTier !== 'unknown_ntc') { confidenceScore += 5; answeredTighteners.push('Bureau verification'); }
  else { unansweredKeyTighteners.push('Exact bureau CIBIL/Experian pull'); }

  if (inputs.expectedMonthlyIncomeBoost !== undefined && expectedMonthlyIncomeBoost > 0) { confidenceScore += 5; answeredTighteners.push('Productive revenue ROI'); }

  confidenceScore = Math.min(confidenceScore, 95);

  let confidenceTier: ConfidenceTier = 'MEDIUM';
  if (confidenceScore >= 80) confidenceTier = 'HIGH';
  else if (confidenceScore < 65) confidenceTier = 'LOW';

  const confidenceBandWidth = confidenceScore >= 80 ? 0.75 : confidenceScore >= 65 ? 1.5 : 2.5;

  // -------------------------------------------------------------
  // 2. INCOME & AFFORDABILITY MATH
  // -------------------------------------------------------------
  // Effective Household Income considers spouse/co-applicant and haircuts unverified cash
  const effectiveRecognizedIncome = monthlyNetIncome + (coApplicantMonthlyIncome * 0.9) + (cashIncomeMonthly * 0.5);
  const foirSlab = getFoirSlab(effectiveRecognizedIncome);

  // Income stability & variable pay adjustments
  let safeFoirMultiplier = foirSlab.borrowerSafeFoir;
  if (variableIncomeSharePct > 30) safeFoirMultiplier -= 0.05; // High variable pay gets lower safe limit
  if (pastEmiBouncesLast12M > 0) safeFoirMultiplier -= 0.08;   // Recent bounce severely reduces safe FOIR
  if (emergencySavingsMonths >= 6) safeFoirMultiplier += 0.03; // Strong emergency buffer gives slight comfort

  // Monthly capacity thresholds
  const lenderMaxMonthlyEmi = Math.max(0, (effectiveRecognizedIncome * foirSlab.lenderMaxFoir) - existingMonthlyEmi);
  const borrowerMonthlyDisposable = Math.max(0, effectiveRecognizedIncome - monthlyHouseholdExpenses - existingMonthlyEmi);
  const borrowerSafeMonthlyEmi = Math.max(0, Math.min(
    effectiveRecognizedIncome * safeFoirMultiplier - existingMonthlyEmi,
    borrowerMonthlyDisposable * 0.70 // Keep at least 30% of free cash for unexpected shocks
  ));

  // Current Debt-to-Income / FOIR
  const currentDtiPct = Number(((existingMonthlyEmi / (effectiveRecognizedIncome || 1)) * 100).toFixed(1));

  // -------------------------------------------------------------
  // 3. RATE BENCHMARK & FAIR BAND CALCULATION (O3)
  // -------------------------------------------------------------
  const baseRateConfig = PRODUCT_BASE_RATES[loanTypeWanted] || PRODUCT_BASE_RATES.personal;
  const creditSpread = CREDIT_TIER_SPREADS[creditScoreTier];
  const empSpread = EMPLOYMENT_TYPE_SPREADS[employmentType];

  let rawMidRate = (baseRateConfig.primeMin + baseRateConfig.primeMax) / 2 + 
                   (creditSpread.spreadMin + creditSpread.spreadMax) / 2 + 
                   (empSpread.spreadMin + empSpread.spreadMax) / 2;

  // Collateral discount if borrower secures loan with property/gold
  if (hasCollateral && (collateralType === 'commercial_property' || collateralType === 'residential_property') && loanTypeWanted !== 'lap_secured') {
    // If borrower is asking for unsecured but has property, note significant discount potential
    rawMidRate -= 1.0;
  }

  // If bounce in past 12m
  if (pastEmiBouncesLast12M > 0) {
    rawMidRate += (pastEmiBouncesLast12M * 1.25);
  }

  const fairRateMin = Number(Math.max(baseRateConfig.primeMin, rawMidRate - confidenceBandWidth).toFixed(2));
  const fairRateMax = Number((rawMidRate + confidenceBandWidth).toFixed(2));
  const benchmarkRate = Number(rawMidRate.toFixed(2));
  const negotiationTargetRate = Number(fairRateMin.toFixed(2));

  // APR for default tenure
  const defaultTenureMonths = baseRateConfig.defaultTenureYrs * 12;
  const allInApr = calculateAllInApr(loanAmountWanted, benchmarkRate, defaultTenureMonths, loanTypeWanted);

  // Overcharge Alert
  let overchargeAlert: string | null = null;
  if (existingLenderOfferRate && existingLenderOfferRate > fairRateMax) {
    const excessSpread = (existingLenderOfferRate - fairRateMax).toFixed(1);
    overchargeAlert = `Lender quote of ${existingLenderOfferRate}% is ${excessSpread}% above the fair ceiling (${fairRateMax}%). You have strong room to counter!`;
  }

  let rateReason = `Based on ${creditSpread.label} bureau tier and ${employmentType} profile, fair market band for ${loanTypeWanted.replace(/_/g, ' ')} is ${fairRateMin}% - ${fairRateMax}%.`;
  if (creditScoreTier === 'unknown_ntc') {
    rateReason += ` (Band is wider by ±${confidenceBandWidth}% because credit score is unrated. Lenders will price with a new-to-credit buffer).`;
  }

  const o3Rate: O3Rate = {
    fairRateMin,
    fairRateMax,
    benchmarkRate,
    apr: allInApr,
    confidenceBandWidth,
    rateReason,
    overchargeAlert,
    negotiationTargetRate,
  };

  // -------------------------------------------------------------
  // 4. LOAN SANCTION & SAFE CAPACITY CALCULATION (O2)
  // -------------------------------------------------------------
  const tenureYrs = baseRateConfig.defaultTenureYrs;
  const tenureMonths = tenureYrs * 12;

  // Lender calculation based on max FOIR
  let lenderLikelySanction = calculateMaxPrincipalFromEmi(lenderMaxMonthlyEmi, benchmarkRate, tenureMonths);

  // Borrower safe carrying capacity based on safe FOIR and actual living expenses
  let borrowerSafeCapacity = calculateMaxPrincipalFromEmi(borrowerSafeMonthlyEmi, benchmarkRate, tenureMonths);

  // Collateral LTV check if applicable
  let collateralLtvCapAmount: number | undefined = undefined;
  let collateralLtvPct: number | undefined = undefined;
  if (hasCollateral && collateralMarketValue > 0) {
    const ltvRatio = LTV_CAPS[collateralType] || 0.50;
    collateralLtvCapAmount = Math.round(collateralMarketValue * ltvRatio);
    collateralLtvPct = ltvRatio * 100;
  }

  // Round numbers to nearest ₹10,000
  lenderLikelySanction = Math.max(0, Math.round(lenderLikelySanction / 10000) * 10000);
  borrowerSafeCapacity = Math.max(0, Math.round(borrowerSafeCapacity / 10000) * 10000);

  let recommendedAmount = borrowerSafeCapacity;
  let recommendedSource: 'SAFE_CAPACITY' | 'LENDER_SANCTION' | 'REDUCED_BUDGET' = 'SAFE_CAPACITY';
  let capacityExplanation = '';

  if (loanAmountWanted <= borrowerSafeCapacity) {
    recommendedAmount = loanAmountWanted;
    recommendedSource = 'SAFE_CAPACITY';
    capacityExplanation = `Your requested amount of ₹${loanAmountWanted.toLocaleString('en-IN')} is within your safe carrying capacity of ₹${borrowerSafeCapacity.toLocaleString('en-IN')}. A lender will sanction up to ₹${lenderLikelySanction.toLocaleString('en-IN')}, but do not stretch beyond what you need.`;
  } else if (loanAmountWanted <= lenderLikelySanction) {
    recommendedAmount = borrowerSafeCapacity;
    recommendedSource = 'SAFE_CAPACITY';
    capacityExplanation = `A lender will likely approve your request of ₹${loanAmountWanted.toLocaleString('en-IN')} (up to ₹${lenderLikelySanction.toLocaleString('en-IN')}), BUT your safe limit is ₹${borrowerSafeCapacity.toLocaleString('en-IN')}. Taking the full lender sanction leaves you with zero buffer for emergencies. Cap your loan at ₹${borrowerSafeCapacity.toLocaleString('en-IN')}.`;
  } else {
    recommendedAmount = Math.min(borrowerSafeCapacity, lenderLikelySanction);
    recommendedSource = 'REDUCED_BUDGET';
    capacityExplanation = `Your requested amount of ₹${loanAmountWanted.toLocaleString('en-IN')} exceeds both safe capacity (₹${borrowerSafeCapacity.toLocaleString('en-IN')}) and lender limits (₹${lenderLikelySanction.toLocaleString('en-IN')}). Reduce the project scope or introduce a co-applicant.`;
  }

  const requestedEmi = calculateEmi(loanAmountWanted, benchmarkRate, tenureMonths);
  const projectedDtiPct = Number((((existingMonthlyEmi + requestedEmi) / (effectiveRecognizedIncome || 1)) * 100).toFixed(1));

  const o2Capacity: O2Capacity = {
    lenderLikelySanction,
    borrowerSafeCapacity,
    recommendedAmount,
    recommendedSource,
    explanation: capacityExplanation,
    lenderFoirLimitPct: Math.round(foirSlab.lenderMaxFoir * 100),
    borrowerSafeFoirLimitPct: Math.round(safeFoirMultiplier * 100),
    currentDtiPct,
    projectedDtiPct,
    collateralLtvCapAmount,
    collateralLtvPct,
  };

  // -------------------------------------------------------------
  // 5. VERDICT FORMULATION (O1)
  // -------------------------------------------------------------
  const purposeMeta = PURPOSE_PRODUCTIVITY[purpose] || PURPOSE_PRODUCTIVITY.other;
  let verdict: VerdictType = 'BORROW';
  let badgeText = 'Borrow Confidently';
  let headline = 'Affordable & within safe risk thresholds.';
  let primaryReason = '';
  const detailedReasons: string[] = [];
  let riskLevel: RiskLevel = 'LOW';
  let suggestedAlternativeProduct: LoanType | undefined = undefined;
  let suggestedAlternativeAmount: number | undefined = undefined;
  let pivotRecommendation: string | undefined = undefined;

  // Condition 1: Extreme distress / Debt trap triggers -> DONT_BORROW
  if (
    (pastEmiBouncesLast12M >= 1 && existingHighCostLoanOutstanding > 20000) ||
    (currentDtiPct > 65) ||
    (borrowerSafeMonthlyEmi <= 0 && purpose !== 'debt_consolidation') ||
    (employmentType === 'informal' && existingHighCostLoanOutstanding > 0 && pastEmiBouncesLast12M > 0 && loanTypeWanted === 'personal')
  ) {
    verdict = 'DONT_BORROW';
    badgeText = 'Do Not Borrow (High Default Risk)';
    riskLevel = 'CRITICAL';
    headline = 'Severe risk of debt spiral and insolvency.';
    primaryReason = 'You already have high-interest loans with recent payment strain/bounces. Taking another loan will push your outflow beyond total income.';
    detailedReasons.push(`Recent EMI bounce (${pastEmiBouncesLast12M}) and ongoing high-interest debt (₹${existingHighCostLoanOutstanding.toLocaleString('en-IN')}) indicate cash-flow deficit.`);
    detailedReasons.push(`Your current debt obligations already consume ${currentDtiPct}% of your income.`);
    detailedReasons.push('Action: Prioritize restructuring existing app loans or seeking an SHG/MFI priority sector loan before taking any fresh commercial credit.');

    if (purpose === 'vehicle_productive' && employmentType === 'informal') {
      pivotRecommendation = 'Do not take an unsecured personal or app loan. Instead, explore direct EV asset-financing with vehicle hypothecation or PM SVANidhi / Mudra Shishu loan at sub-10% interest with government subsidy.';
    }
  }
  // Condition 2: Discretionary / Wedding / Consumption over-borrowing -> BORROW_LESS
  else if (
    (purposeMeta.consumptionRisk && loanAmountWanted > borrowerSafeCapacity) ||
    (purpose === 'wedding_consumption' && loanAmountWanted > (effectiveRecognizedIncome * 6)) ||
    (loanAmountWanted > borrowerSafeCapacity && loanAmountWanted <= lenderLikelySanction)
  ) {
    verdict = 'BORROW_LESS';
    badgeText = 'Borrow Less (Trim Budget)';
    riskLevel = 'MEDIUM';
    headline = `Lenders will over-lend to you, but taking ₹${loanAmountWanted.toLocaleString('en-IN')} for consumption locks in dangerous debt overhang.`;
    primaryReason = `Wedding / consumption loans generate 0% financial return. Even though banks sanction ₹${lenderLikelySanction.toLocaleString('en-IN')}, capping at ₹${borrowerSafeCapacity.toLocaleString('en-IN')} protects your long-term savings.`;
    suggestedAlternativeAmount = borrowerSafeCapacity;
    detailedReasons.push(`A ₹${loanAmountWanted.toLocaleString('en-IN')} loan creates an EMI of ~₹${requestedEmi.toLocaleString('en-IN')}/mo, locking up ${projectedDtiPct}% of your salary for ${tenureYrs} years.`);
    detailedReasons.push(`Capping at ₹${borrowerSafeCapacity.toLocaleString('en-IN')} keeps your debt-to-income at a healthy ${Math.round((borrowerSafeMonthlyEmi / effectiveRecognizedIncome) * 100)}% with ₹${Math.round(borrowerMonthlyDisposable - borrowerSafeMonthlyEmi).toLocaleString('en-IN')}/mo buffer.`);
  }
  // Condition 3: Sub-optimal loan product structure (e.g. Ravi kirana owner wanting ₹15L unsecured vs LAP)
  else if (
    employmentType === 'self_employed' && 
    hasCollateral && 
    collateralType === 'commercial_property' && 
    loanTypeWanted === 'business_unsecured' &&
    loanAmountWanted >= 500000
  ) {
    verdict = 'BORROW';
    badgeText = 'Borrow — But Pivot Product';
    riskLevel = 'LOW';
    headline = `Pivot from Unsecured Business Loan to Secured LAP (Save 8-12% in Interest).`;
    primaryReason = `You own unencumbered property worth ₹${collateralMarketValue.toLocaleString('en-IN')}. Taking an unsecured business loan at 18-24% is throwing money away when LAP is available at 9.5-11.0%.`;
    suggestedAlternativeProduct = 'lap_secured';
    pivotRecommendation = `Switch application to Loan Against Property (LAP) against your shop. This drops your interest rate from ~18-22% down to 9.5-11%, extends tenure up to 10 years, and reduces your monthly EMI by over 40%.`;
    detailedReasons.push(`Unencumbered shop value of ₹${collateralMarketValue.toLocaleString('en-IN')} gives you an LTV cap of ₹${((collateralLtvCapAmount || 0)).toLocaleString('en-IN')}, easily covering your ₹${loanAmountWanted.toLocaleString('en-IN')} requirement.`);
    detailedReasons.push(`Combined household cash flow (₹${effectiveRecognizedIncome.toLocaleString('en-IN')}/mo) comfortably services the secured LAP EMI of ~₹${calculateEmi(loanAmountWanted, 10.0, 10 * 12).toLocaleString('en-IN')}.`);
  }
  // Condition 4: Healthy profile
  else {
    verdict = 'BORROW';
    badgeText = 'Proceed / Strong Profile';
    riskLevel = 'LOW';
    headline = `Loan is well-cushioned within your monthly cash flow and repayment limits.`;
    primaryReason = `Your monthly EMI of ₹${requestedEmi.toLocaleString('en-IN')} represents ${projectedDtiPct}% of income, safely below the ${Math.round(safeFoirMultiplier * 100)}% ceiling.`;
    detailedReasons.push(`Emergency fund buffer (${emergencySavingsMonths} months) and steady employment provide resilience against unexpected shocks.`);
  }

  const o1Verdict: O1Verdict = {
    verdict,
    badgeText,
    headline,
    primaryReason,
    detailedReasons,
    riskLevel,
    suggestedAlternativeProduct,
    suggestedAlternativeAmount,
    pivotRecommendation,
  };

  // -------------------------------------------------------------
  // 6. EMI, TENURE OPTIONS & STRESS TESTING (O4)
  // -------------------------------------------------------------
  const possibleTenures = loanTypeWanted === 'lap_secured' || loanTypeWanted === 'home_loan'
    ? [3, 5, 7, 10, 15]
    : [1, 2, 3, 4, 5];

  const tenureOptions: TenureOption[] = possibleTenures.map((tYears) => {
    const tMonths = tYears * 12;
    const emi = calculateEmi(loanAmountWanted, benchmarkRate, tMonths);
    const totalRepay = emi * tMonths;
    const totalInt = totalRepay - loanAmountWanted;
    const projectedFoir = Number((((existingMonthlyEmi + emi) / (effectiveRecognizedIncome || 1)) * 100).toFixed(1));
    const isSafe = emi <= borrowerSafeMonthlyEmi;
    const isRecommended = tYears === baseRateConfig.defaultTenureYrs;

    return {
      tenureYears: tYears,
      tenureMonths: tMonths,
      monthlyEmi: emi,
      totalInterestPaid: totalInt,
      totalRepayment: totalRepay,
      projectedFoirPct: projectedFoir,
      isSafe,
      isRecommended,
    };
  });

  // Stress Test 1: 20% Income Drop (e.g., job switch, spouse leave, kirana monsoon slump)
  const stressedIncome = Math.round(effectiveRecognizedIncome * 0.80);
  const stressedTotalOutflow = existingMonthlyEmi + requestedEmi + monthlyHouseholdExpenses;
  const stressedFoirPct = Number((((existingMonthlyEmi + requestedEmi) / stressedIncome) * 100).toFixed(1));
  const cushionRemaining = stressedIncome - stressedTotalOutflow;
  const isVulnerableScenario1 = cushionRemaining < 0 || stressedFoirPct > 60;

  const stressScenario1 = {
    title: 'Income Shock (-20% Drop)',
    description: 'Simulates a 20% reduction in net monthly earnings or business margin slump.',
    stressedIncome,
    stressedEmi: requestedEmi,
    stressedFoirPct,
    cushionRemaining,
    isVulnerable: isVulnerableScenario1,
    verdict: isVulnerableScenario1 
      ? `High Vulnerability: A 20% drop creates a monthly deficit of ₹${Math.abs(cushionRemaining).toLocaleString('en-IN')}. You will be forced to borrow to service EMIs.`
      : `Resilient: You still retain a surplus cushion of ₹${cushionRemaining.toLocaleString('en-IN')}/month after all expenses and EMIs.`
  };

  // Stress Test 2: Interest Rate Hike (+200 bps floating or fee inflation)
  const stressedRate = benchmarkRate + 2.0;
  const stressedEmi = calculateEmi(loanAmountWanted, stressedRate, defaultTenureMonths);
  const stressedRateFoir = Number((((existingMonthlyEmi + stressedEmi) / effectiveRecognizedIncome) * 100).toFixed(1));
  const additionalInterestTotal = (stressedEmi - requestedEmi) * defaultTenureMonths;
  const isVulnerableScenario2 = stressedRateFoir > Math.round(safeFoirMultiplier * 100);

  const stressScenario2 = {
    title: 'Interest Rate Shock (+2.00% / 200 bps Hike)',
    description: 'Simulates RBI repo rate tightening or floating reset adding +2.00% to your rate.',
    stressedIncome: effectiveRecognizedIncome,
    stressedEmi,
    stressedFoirPct: stressedRateFoir,
    cushionRemaining: borrowerMonthlyDisposable - stressedEmi,
    isVulnerable: isVulnerableScenario2,
    verdict: isVulnerableScenario2
      ? `Rate hike pushes your EMI from ₹${requestedEmi.toLocaleString('en-IN')} to ₹${stressedEmi.toLocaleString('en-IN')}, adding ₹${additionalInterestTotal.toLocaleString('en-IN')} extra interest.`
      : `Manageable: Additional EMI burden of ₹${(stressedEmi - requestedEmi).toLocaleString('en-IN')}/mo is absorbed by your cash surplus.`
  };

  const o4Emi: O4Emi = {
    maxSafeMonthlyEmi: Math.round(borrowerSafeMonthlyEmi),
    lenderMaxMonthlyEmi: Math.round(lenderMaxMonthlyEmi),
    recommendedTenureYears: baseRateConfig.defaultTenureYrs,
    recommendedEmi: requestedEmi,
    tenureOptions,
    stressTest: {
      incomeShock20Pct: stressScenario1,
      rateHike200Bps: stressScenario2,
      emergencyFundSurvivalMonths: emergencySavingsMonths,
      combinedRiskAssessment: isVulnerableScenario1 
        ? '⚠️ High sensitivity to income fluctuation. Build 3+ months emergency reserves before expanding debt.'
        : '✅ Strong balance sheet cushion. Your cash flow withstands both rate hikes and standard income volatility.'
    },
    explanation: `Your absolute monthly safe EMI ceiling is ₹${Math.round(borrowerSafeMonthlyEmi).toLocaleString('en-IN')}. Agreeing to any EMI higher than this forces you into living paycheck-to-paycheck with zero room for medical or family shocks.`,
  };

  // -------------------------------------------------------------
  // 7. NEGOTIATION BATTLE-CARD GENERATION
  // -------------------------------------------------------------
  let leverageScore = 50;
  if (creditScoreTier === '750_plus') leverageScore += 30;
  else if (creditScoreTier === '700_749') leverageScore += 15;
  else if (creditScoreTier === 'below_650') leverageScore -= 20;

  if (employmentType === 'salaried' && incomeStabilityYears >= 3) leverageScore += 15;
  if (hasCollateral && collateralMarketValue > loanAmountWanted * 2) leverageScore += 20;
  if (pastEmiBouncesLast12M === 0) leverageScore += 10;
  else leverageScore -= 25;

  leverageScore = Math.max(15, Math.min(leverageScore, 98));

  let leverageSummary = '';
  if (leverageScore >= 80) leverageSummary = 'High Leverage: Prime profile with low risk. Multiple PSU & private banks will compete for your file.';
  else if (leverageScore >= 60) leverageSummary = 'Moderate Leverage: Good file. Push hard on processing fee waivers and rate matching.';
  else leverageSummary = 'Selective Leverage: Lender holds underwriting advantage. Focus on asset security or co-applicant backing.';

  const redLines: string[] = [
    'Walk away if the lender charges more than 1.5% Processing Fee + 18% GST.',
    'Walk away if the lender forces mandatory single-premium credit life insurance bundled into the loan principal.',
    'Walk away if there is any Prepayment / Foreclosure penalty on a floating rate loan (RBI prohibits this for individual borrowers).'
  ];

  if (employmentType === 'self_employed' && hasCollateral) {
    redLines.push('Reject any unsecured business loan quote above 16% — demand LAP evaluation at 9.5 - 11.0%.');
  }
  if (employmentType === 'informal' || creditScoreTier === 'below_650') {
    redLines.push('Reject any daily/weekly debit loan with APR exceeding 24% without reducing balance calculation.');
  }

  const counterOfferScript = `“Based on my profile (Debt-to-Income at ${currentDtiPct}%, ${creditSpread.label} track record), the fair benchmark for this facility is ${fairRateMin}% - ${fairRateMax}%. I have quotes from peers at ${fairRateMin}%. If you match ${negotiationTargetRate}% with a 0.5% processing fee cap, I am ready to sign the sanction letter today.”`;

  const essentialBranchQuestions = [
    '“Is this quote on a Reducing Balance method or Flat Rate?” (Never accept flat rate without converting to IRR).',
    '“What is the exact all-in APR including processing fee, doc charges, and stamp duty?”',
    '“Can I prepay partial amounts without penalty after 6 months?”',
    '“Is the credit shield insurance optional or mandatory as per RBI guidelines?” (It is legally optional).'
  ];

  let productPivot: NegotiationCardData['productPivot'] = undefined;
  if (suggestedAlternativeProduct === 'lap_secured') {
    const unsecuredInterestEst = calculateEmi(loanAmountWanted, 18.0, 5 * 12) * 60 - loanAmountWanted;
    const lapInterestEst = calculateEmi(loanAmountWanted, 10.25, 10 * 12) * 120 - loanAmountWanted;
    productPivot = {
      fromProduct: 'Unsecured Business Loan (~18.0% - 22.0%)',
      toProduct: 'Secured Loan Against Property / LAP (~9.5% - 11.0%)',
      interestSavingsEst: Math.round(unsecuredInterestEst - (lapInterestEst * 0.5)), // Substantial cash savings
      rationale: `Pivoting to LAP leverages your ₹${collateralMarketValue.toLocaleString('en-IN')} unencumbered shop, cutting your rate in half and extending tenure.`
    };
  } else if (employmentType === 'informal' && purpose === 'vehicle_productive') {
    productPivot = {
      fromProduct: 'Instant Unsecured App Loan (30.0% - 42.0%)',
      toProduct: 'EV Asset-Backed Finance / PM SVANidhi (9.0% - 13.0%)',
      interestSavingsEst: Math.round(loanAmountWanted * 0.22),
      rationale: 'Hypothecating the electric vehicle directly with an EV NBFC / priority sector lender saves over 20% in interest.'
    };
  }

  const negotiationCard: NegotiationCardData = {
    borrowerTypeSummary: `${employmentType.toUpperCase()} · ${creditSpread.label}`,
    targetLoanType: loanTypeWanted.replace(/_/g, ' ').toUpperCase(),
    targetLoanAmount: loanAmountWanted,
    fairRateRange: `${fairRateMin}% - ${fairRateMax}%`,
    targetAprCeiling: `${allInApr.allInAprPct}% APR`,
    safeEmiCeiling: `₹${Math.round(borrowerSafeMonthlyEmi).toLocaleString('en-IN')}/mo`,
    leverageScore,
    leverageSummary,
    redLines,
    counterOfferScript,
    productPivot,
    essentialBranchQuestions,
  };

  return {
    o1Verdict,
    o2Capacity,
    o3Rate,
    o4Emi,
    confidenceScore,
    confidenceTier,
    confidenceExplanation: confidenceScore >= 80 
      ? 'High Confidence: Complete profile inputs allow narrow rate bands (±0.75%) and precise affordability math.'
      : `Moderate Confidence: Based on core Must inputs. Adding ${unansweredKeyTighteners.slice(0, 2).join(' and ')} will tighten your rate band further.`,
    unansweredKeyTighteners,
    negotiationCard,
    calculatedAt: new Date().toISOString(),
  };
}
