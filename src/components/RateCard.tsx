import React, { useState } from 'react';
import { O3Rate } from '../engine/types';
import { Percent, AlertTriangle, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface RateCardProps {
  rate: O3Rate;
  loanAmount: number;
}

export const RateCard: React.FC<RateCardProps> = ({ rate, loanAmount }) => {
  const [showAprDetails, setShowAprDetails] = useState(false);

  return (
    <div className="bg-bg2 border border-rule rounded-xl p-5 sm:p-6 shadow-sm">
      {/* Output Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rule mb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent">
            Output 3 · Fair Interest Rate & APR
          </span>
          <span className="text-xs text-muted">A fair band, not a point</span>
        </div>
        <div className="text-xs font-mono text-muted">
          Target Counter-Rate: <b className="text-emerald-600">{rate.negotiationTargetRate}%</b>
        </div>
      </div>

      {/* Overcharge Alert Banner */}
      {rate.overchargeAlert && (
        <div className="mb-5 p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-[11px]">Overcharge Alert</span>
            <p className="m-0 mt-0.5 font-medium">{rate.overchargeAlert}</p>
          </div>
        </div>
      )}

      {/* The Visual Fair Rate Band */}
      <div className="bg-bg border border-rule rounded-xl p-5 mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Fair Rate Band for Your Profile
          </span>
          <span className="text-xs font-mono text-accent bg-accent-soft px-2 py-0.5 rounded">
            Band Width: ±{rate.confidenceBandWidth}%
          </span>
        </div>

        {/* Large Numbers Display */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 py-2">
          <div>
            <span className="text-xs text-muted block">Prime / Best</span>
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-emerald-600 tabular-nums">
              {rate.fairRateMin}%
            </span>
          </div>

          <div className="text-center">
            <span className="text-xs text-muted block">Market Benchmark</span>
            <span className="font-mono text-3xl sm:text-4xl font-bold text-ink tabular-nums">
              {rate.benchmarkRate}%
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted block">Fair Ceiling</span>
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-amber-600 tabular-nums">
              {rate.fairRateMax}%
            </span>
          </div>
        </div>

        {/* Visual Progress Slider Representation */}
        <div className="relative pt-2 pb-1">
          <div className="h-2.5 w-full bg-rule rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 w-1/3" title="Prime Rate Zone" />
            <div className="h-full bg-accent w-1/3" title="Benchmark Zone" />
            <div className="h-full bg-amber-500 w-1/3" title="Upper Fair Zone" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted mt-1.5">
            <span>Aggressive Counter</span>
            <span>Expected Sanction</span>
            <span>Walk-Away Threshold</span>
          </div>
        </div>

        {/* One-Sentence Rate Explanation */}
        <p className="text-xs text-ink/90 leading-relaxed font-medium m-0 pt-2 border-t border-rule/60">
          <b>Why this band:</b> {rate.rateReason}
        </p>
      </div>

      {/* ALL-IN APR & HIDDEN COSTS SECTION */}
      <div className="bg-bg border border-rule rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-display font-semibold text-base text-ink flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-accent" />
              RBI All-In APR Disclosure (Effective Cost)
            </span>
            <p className="text-xs text-muted mt-0.5">
              Nominal rate of {rate.benchmarkRate}% becomes <b>{rate.apr.allInAprPct}% APR</b> after upfront fees.
            </p>
          </div>

          <button
            onClick={() => setShowAprDetails(!showAprDetails)}
            className="flex items-center gap-1 text-xs text-accent font-medium hover:underline"
          >
            <span>{showAprDetails ? 'Hide Details' : 'View Fee Table'}</span>
            {showAprDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* APR Summary Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-bg2 border border-rule">
            <span className="text-muted block text-[10px] uppercase">Nominal Rate</span>
            <b className="text-ink text-sm">{rate.apr.baseRatePct}%</b>
          </div>
          <div className="p-2.5 rounded-lg bg-bg2 border border-rule">
            <span className="text-muted block text-[10px] uppercase">Upfront Fees</span>
            <b className="text-ink text-sm">₹{rate.apr.totalUpfrontCharges.toLocaleString('en-IN')}</b>
          </div>
          <div className="p-2.5 rounded-lg bg-bg2 border border-rule">
            <span className="text-muted block text-[10px] uppercase">Net Disbursal</span>
            <b className="text-emerald-600 text-sm">₹{rate.apr.netDisbursalAmount.toLocaleString('en-IN')}</b>
          </div>
          <div className="p-2.5 rounded-lg bg-accent-soft border border-accent/30">
            <span className="text-accent block text-[10px] uppercase font-bold">All-In APR</span>
            <b className="text-accent text-sm font-bold">{rate.apr.allInAprPct}%</b>
          </div>
        </div>

        {/* Detailed Fees Breakdown Table */}
        {showAprDetails && (
          <div className="mt-4 pt-4 border-t border-rule overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted text-[10px] uppercase border-b border-rule">
                  <th className="pb-2 text-left">Fee Component</th>
                  <th className="pb-2 text-left">Benchmark Rate</th>
                  <th className="pb-2 text-right">Estimated Amount</th>
                  <th className="pb-2 text-left pl-3">Mandatory / Optional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/60">
                <tr>
                  <td className="py-2 font-medium">Processing Fee (PF)</td>
                  <td className="py-2 font-mono">{rate.apr.processingFeePct}%</td>
                  <td className="py-2 font-mono text-right">₹{rate.apr.processingFeeAmount.toLocaleString('en-IN')}</td>
                  <td className="py-2 pl-3 text-muted">Negotiable (Ask for 50% waiver)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">GST on Processing Fee</td>
                  <td className="py-2 font-mono">18.0%</td>
                  <td className="py-2 font-mono text-right">₹{rate.apr.gstAmount.toLocaleString('en-IN')}</td>
                  <td className="py-2 pl-3 text-muted">Statutory (Govt Tax)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Stamp Duty & Doc Charges</td>
                  <td className="py-2 font-mono">Flat / Slab</td>
                  <td className="py-2 font-mono text-right">₹{rate.apr.stampDutyAndDocCharges.toLocaleString('en-IN')}</td>
                  <td className="py-2 pl-3 text-muted">State Statutory Stamp Duty</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Loan Shield Insurance</td>
                  <td className="py-2 font-mono">~0.5% - 1.0%</td>
                  <td className="py-2 font-mono text-right">₹{rate.apr.insurancePremiumAmount.toLocaleString('en-IN')}</td>
                  <td className="py-2 pl-3 text-rose-600 font-medium">OPTIONAL (Reject single-premium bundling)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
