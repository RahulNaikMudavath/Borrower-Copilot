import React, { useState } from 'react';
import { O4Emi } from '../engine/types';
import { Shield, AlertCircle, Activity, CheckCircle2, TrendingDown, Clock } from 'lucide-react';

interface EmiStressCardProps {
  emiData: O4Emi;
  loanAmount: number;
}

export const EmiStressCard: React.FC<EmiStressCardProps> = ({ emiData, loanAmount }) => {
  const [selectedTenure, setSelectedTenure] = useState<number>(emiData.recommendedTenureYears);

  const activeTenureOption = emiData.tenureOptions.find(t => t.tenureYears === selectedTenure) || emiData.tenureOptions[0];

  return (
    <div className="bg-bg2 border border-rule rounded-xl p-5 sm:p-6 shadow-sm">
      {/* Output Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rule mb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent">
            Output 4 · Safe EMI & Stress Test
          </span>
          <span className="text-xs text-muted">Monthly ceiling & shock resilience</span>
        </div>
        <div className="text-xs font-mono text-muted">
          Recommended Tenure: <b>{emiData.recommendedTenureYears} Years</b>
        </div>
      </div>

      {/* Primary Metric: Safe Monthly EMI Ceiling */}
      <div className="bg-bg border-2 border-emerald-500/40 rounded-xl p-5 mb-5 bg-gradient-to-r from-emerald-50/20 to-transparent dark:from-emerald-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Maximum Safe Monthly EMI Ceiling
          </span>
          <span className="text-xs font-mono text-muted">
            Lender Stretched Cap: ₹{emiData.lenderMaxMonthlyEmi.toLocaleString('en-IN')}/mo
          </span>
        </div>

        <div className="font-mono text-3xl sm:text-4xl font-bold text-emerald-700 dark:text-emerald-300 tracking-tight tabular-nums">
          ₹{emiData.maxSafeMonthlyEmi.toLocaleString('en-IN')}
          <span className="text-sm font-sans font-normal text-muted ml-2">/ month</span>
        </div>

        <p className="text-xs text-ink/90 leading-relaxed font-medium mt-2 pt-2 border-t border-rule/60 m-0">
          <b>Why this ceiling:</b> {emiData.explanation}
        </p>
      </div>

      {/* TENURE TRADE-OFF MATRIX */}
      <div className="bg-bg border border-rule rounded-xl p-4 sm:p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-semibold text-base text-ink flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-accent" />
            Tenure Trade-Off Analysis
          </span>
          <span className="text-xs text-muted">
            Click tenure to inspect total cost
          </span>
        </div>

        {/* Tenure Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {emiData.tenureOptions.map((opt) => (
            <button
              key={opt.tenureYears}
              onClick={() => setSelectedTenure(opt.tenureYears)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedTenure === opt.tenureYears
                  ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent'
                  : 'border-rule hover:border-accent/40 bg-bg2 text-ink'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs">{opt.tenureYears} Yrs</span>
                {opt.isSafe ? (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                    SAFE
                  </span>
                ) : (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold">
                    TIGHT
                  </span>
                )}
              </div>
              <div className="font-mono text-sm font-semibold mt-1 tabular-nums">
                ₹{opt.monthlyEmi.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-muted">/mo</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Tenure Details Summary */}
        {activeTenureOption && (
          <div className="p-3.5 rounded-lg bg-bg2 border border-rule text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div>
              <span className="text-muted block text-[10px] uppercase">Monthly EMI</span>
              <b className="text-ink text-sm">₹{activeTenureOption.monthlyEmi.toLocaleString('en-IN')}</b>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Total Interest Paid</span>
              <b className="text-amber-600 text-sm">₹{activeTenureOption.totalInterestPaid.toLocaleString('en-IN')}</b>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Total Repayment</span>
              <b className="text-ink text-sm">₹{activeTenureOption.totalRepayment.toLocaleString('en-IN')}</b>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase">Projected FOIR</span>
              <b className={`text-sm ${activeTenureOption.isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                {activeTenureOption.projectedFoirPct}%
              </b>
            </div>
          </div>
        )}
      </div>

      {/* STRESS TESTING SCENARIOS */}
      <div className="bg-bg border border-rule rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-display font-semibold text-base text-ink flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-accent" />
            Live Stress-Test Resilience
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg2 border border-rule text-muted">
            Emergency Runway: {emiData.stressTest.emergencyFundSurvivalMonths} Months
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Stress Scenario 1: Income Shock */}
          <div className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
            emiData.stressTest.incomeShock20Pct.isVulnerable
              ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
              : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                {emiData.stressTest.incomeShock20Pct.title}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Stressed FOIR: {emiData.stressTest.incomeShock20Pct.stressedFoirPct}%
              </span>
            </div>
            <p className="m-0 leading-relaxed font-medium">
              {emiData.stressTest.incomeShock20Pct.verdict}
            </p>
          </div>

          {/* Stress Scenario 2: Rate Hike Shock */}
          <div className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
            emiData.stressTest.rateHike200Bps.isVulnerable
              ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[11px]">
                {emiData.stressTest.rateHike200Bps.title}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                Stressed EMI: ₹{emiData.stressTest.rateHike200Bps.stressedEmi.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="m-0 leading-relaxed font-medium">
              {emiData.stressTest.rateHike200Bps.verdict}
            </p>
          </div>
        </div>

        {/* Overall Shock Resilience Callout */}
        <div className="pt-2 border-t border-rule/60 text-xs font-medium text-ink/90 flex items-center gap-2">
          <span><b>Resilience Summary:</b> {emiData.stressTest.combinedRiskAssessment}</span>
        </div>
      </div>
    </div>
  );
};
