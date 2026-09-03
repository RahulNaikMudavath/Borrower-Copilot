import { evaluateBorrowerProfile } from './calculator';
import { PERSONAS } from './personas';

console.log('================================================================');
console.log('       BORROWER COPILOT - AUTOMATED RULE ENGINE TEST SUITE       ');
console.log('================================================================\n');

// 1. TEST PRIYA (Salaried MNC SWE, Wedding Loan ₹8L)
console.log('--- TEST 1: PRIYA (Bengaluru, Salaried, ₹1.10L/mo, 780 CIBIL) ---');
const priyaResult = evaluateBorrowerProfile(PERSONAS.priya.inputs);
console.log(`[O1 Verdict]        : ${priyaResult.o1Verdict.verdict} (${priyaResult.o1Verdict.badgeText})`);
console.log(`[O1 Reason]         : ${priyaResult.o1Verdict.primaryReason}`);
console.log(`[O2 Sanction vs Safe]: Lender Sanction = ₹${priyaResult.o2Capacity.lenderLikelySanction.toLocaleString('en-IN')} | Safe Capacity = ₹${priyaResult.o2Capacity.borrowerSafeCapacity.toLocaleString('en-IN')}`);
console.log(`[O3 Fair Rate Band] : ${priyaResult.o3Rate.fairRateMin}% - ${priyaResult.o3Rate.fairRateMax}% (Benchmark: ${priyaResult.o3Rate.benchmarkRate}%, All-In APR: ${priyaResult.o3Rate.apr.allInAprPct}%)`);
console.log(`[O3 Overcharge Alert]: ${priyaResult.o3Rate.overchargeAlert || 'None'}`);
console.log(`[O4 Safe EMI]       : ₹${priyaResult.o4Emi.maxSafeMonthlyEmi.toLocaleString('en-IN')}/mo (3-Yr Wedding EMI on ₹8L: ₹${priyaResult.o4Emi.recommendedEmi.toLocaleString('en-IN')}/mo)`);
console.log(`[Confidence]        : ${priyaResult.confidenceScore}% (${priyaResult.confidenceTier})`);
console.log(`[Negotiation Script]: ${priyaResult.negotiationCard.counterOfferScript.slice(0, 100)}...\n`);

// 2. TEST RAVI (Kirana Owner, Shop ₹45L, ₹15L Business Loan)
console.log('--- TEST 2: RAVI (Mysuru, Self-Employed Kirana, NTC, ₹45L Shop) ---');
const raviResult = evaluateBorrowerProfile(PERSONAS.ravi.inputs);
console.log(`[O1 Verdict]        : ${raviResult.o1Verdict.verdict} (${raviResult.o1Verdict.badgeText})`);
console.log(`[O1 Pivot Product]  : ${raviResult.o1Verdict.suggestedAlternativeProduct || 'None'} -> ${raviResult.o1Verdict.pivotRecommendation}`);
console.log(`[O2 Sanction vs Safe]: Lender Sanction = ₹${raviResult.o2Capacity.lenderLikelySanction.toLocaleString('en-IN')} | Collateral LTV Cap = ₹${(raviResult.o2Capacity.collateralLtvCapAmount || 0).toLocaleString('en-IN')} | Safe Capacity = ₹${raviResult.o2Capacity.borrowerSafeCapacity.toLocaleString('en-IN')}`);
console.log(`[O3 Fair Rate Band] : ${raviResult.o3Rate.fairRateMin}% - ${raviResult.o3Rate.fairRateMax}% (Secured LAP Benchmark vs 21% NBFC quote)`);
console.log(`[O3 Overcharge Alert]: ${raviResult.o3Rate.overchargeAlert}`);
console.log(`[O4 Safe EMI]       : ₹${raviResult.o4Emi.maxSafeMonthlyEmi.toLocaleString('en-IN')}/mo`);
console.log(`[Confidence]        : ${raviResult.confidenceScore}% (${raviResult.confidenceTier})`);
console.log(`[Pivot Benefit]     : ${raviResult.negotiationCard.productPivot?.rationale}\n`);

// 3. TEST ANITA (Informal Delivery/Tailoring, ₹28k/mo, 3 App Loans, 1 Bounce)
console.log('--- TEST 3: ANITA (Hubballi, Informal, ₹28k/mo, 3 App Loans, 1 Bounce) ---');
const anitaResult = evaluateBorrowerProfile(PERSONAS.anita.inputs);
console.log(`[O1 Verdict]        : ${anitaResult.o1Verdict.verdict} (${anitaResult.o1Verdict.badgeText})`);
console.log(`[O1 Headline]       : ${anitaResult.o1Verdict.headline}`);
console.log(`[O1 Primary Reason] : ${anitaResult.o1Verdict.primaryReason}`);
console.log(`[O2 Sanction vs Safe]: Lender Sanction = ₹${anitaResult.o2Capacity.lenderLikelySanction.toLocaleString('en-IN')} | Safe Capacity = ₹${anitaResult.o2Capacity.borrowerSafeCapacity.toLocaleString('en-IN')}`);
console.log(`[O3 Fair Rate Band] : ${anitaResult.o3Rate.fairRateMin}% - ${anitaResult.o3Rate.fairRateMax}%`);
console.log(`[O4 Stress Test]    : ${anitaResult.o4Emi.stressTest.incomeShock20Pct.verdict}`);
console.log(`[Confidence]        : ${anitaResult.confidenceScore}% (${anitaResult.confidenceTier})`);
console.log(`[Red Lines]         : ${anitaResult.negotiationCard.redLines[0]}\n`);

// 4. TEST MUST-ONLY QUESTIONS (Testing confidence degradation & wide bands)
console.log('--- TEST 4: MUST-ONLY QUESTIONS (Minimal input, silence test) ---');
const mustOnlyResult = evaluateBorrowerProfile({
  purpose: 'general_consumption',
  loanAmountWanted: 500000,
  loanTypeWanted: 'personal',
  monthlyNetIncome: 50000,
  employmentType: 'salaried',
  existingMonthlyEmi: 5000,
  monthlyHouseholdExpenses: 25000,
  age: 30,
  creditScoreTier: 'unknown_ntc', // Unknown credit score test
});
console.log(`[Confidence Score]  : ${mustOnlyResult.confidenceScore}% (${mustOnlyResult.confidenceTier})`);
console.log(`[Band Width]        : ±${mustOnlyResult.o3Rate.confidenceBandWidth}% (Wide band due to missing signals)`);
console.log(`[Unanswered Signals]: ${mustOnlyResult.unansweredKeyTighteners.join(', ')}`);
console.log(`[Rate Band]         : ${mustOnlyResult.o3Rate.fairRateMin}% - ${mustOnlyResult.o3Rate.fairRateMax}% (Unknown score modeled with prudent risk buffer)`);

console.log('\n================================================================');
console.log('                 ALL ENGINE TESTS EXECUTED!                     ');
console.log('================================================================');
