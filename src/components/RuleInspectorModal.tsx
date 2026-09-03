import React from 'react';
import { X, BookOpen, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { FOIR_SLABS, PRODUCT_BASE_RATES, CREDIT_TIER_SPREADS, EMPLOYMENT_TYPE_SPREADS, LTV_CAPS, FEE_BENCHMARKS } from '../engine/rules';

interface RuleInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleInspectorModal: React.FC<RuleInspectorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-bg border border-rule rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-rule flex items-center justify-between bg-bg2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl font-semibold m-0 text-ink">
              RULES.md Engine Specification & Benchmark Standards
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rule text-muted hover:text-ink transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-ink">
          {/* Note on Transparency */}
          <div className="p-3.5 rounded-lg bg-accent-soft border-l-4 border-accent text-accent">
            <p className="m-0 font-medium">
              Every rule, threshold, FOIR band, and assumption below is deterministic, transparent, and grounded in RBI circulars and standard Indian bank credit policies.
            </p>
          </div>

          {/* 1. FOIR SLABS TABLE */}
          <div>
            <h4 className="font-display text-base font-semibold mb-2 text-ink">
              1. FOIR (Fixed Obligation to Income Ratio) Standards
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-rule">
                <thead>
                  <tr className="bg-bg2 text-muted uppercase text-[10px]">
                    <th className="p-2 border border-rule text-left">Monthly Income Slab</th>
                    <th className="p-2 border border-rule text-right">Lender Max FOIR</th>
                    <th className="p-2 border border-rule text-right">Borrower Safe FOIR</th>
                    <th className="p-2 border border-rule text-left">Rationale & Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule font-mono">
                  {FOIR_SLABS.map((s, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border border-rule">₹{s.minIncome.toLocaleString('en-IN')} - {s.maxIncome === Infinity ? 'Above' : `₹${s.maxIncome.toLocaleString('en-IN')}`}</td>
                      <td className="p-2 border border-rule text-right font-bold text-rose-600">{(s.lenderMaxFoir * 100)}%</td>
                      <td className="p-2 border border-rule text-right font-bold text-emerald-600">{(s.borrowerSafeFoir * 100)}%</td>
                      <td className="p-2 border border-rule font-sans text-muted">
                        {s.maxIncome <= 35000 
                          ? 'Low income slab requires 68%+ allocation for essential food/rent.' 
                          : s.maxIncome <= 75000 
                          ? 'Moderate income absorbs 40% debt while leaving emergency buffer.'
                          : 'High disposable income allows higher debt servicing with ample living cushion.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. PRODUCT BENCHMARK BASELINE RATES */}
          <div>
            <h4 className="font-display text-base font-semibold mb-2 text-ink">
              2. Product Baseline Rates (Prime Tier Anchor: 750+ CIBIL)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-rule">
                <thead>
                  <tr className="bg-bg2 text-muted uppercase text-[10px]">
                    <th className="p-2 border border-rule text-left">Loan Product</th>
                    <th className="p-2 border border-rule text-right">Prime Benchmark Range</th>
                    <th className="p-2 border border-rule text-right">Standard Tenure</th>
                    <th className="p-2 border border-rule text-left">Source / Pricing Anchor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule font-mono">
                  {Object.entries(PRODUCT_BASE_RATES).map(([k, v]) => (
                    <tr key={k}>
                      <td className="p-2 border border-rule uppercase font-sans font-medium">{k.replace(/_/g, ' ')}</td>
                      <td className="p-2 border border-rule text-right font-bold text-emerald-600">{v.primeMin}% - {v.primeMax}%</td>
                      <td className="p-2 border border-rule text-right">{v.defaultTenureYrs} Yrs (Max {v.maxTenureYrs} Yrs)</td>
                      <td className="p-2 border border-rule font-sans text-muted">RBI Repo (6.50%) + Asset Risk Spread</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. LTV STATUTORY CAPS */}
          <div>
            <h4 className="font-display text-base font-semibold mb-2 text-ink">
              3. Regulatory LTV (Loan-To-Value) Caps
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-bg2 border border-rule">
                <span className="text-muted block text-[10px] uppercase font-sans font-semibold">Commercial Property / Shop (LAP)</span>
                <b className="text-accent text-lg">50% - 55% LTV</b>
                <span className="text-muted block text-[10px] font-sans mt-1">Conservative shop valuation for MSMEs</span>
              </div>
              <div className="p-3 rounded-lg bg-bg2 border border-rule">
                <span className="text-muted block text-[10px] uppercase font-sans font-semibold">Residential Property (LAP)</span>
                <b className="text-accent text-lg">60% - 65% LTV</b>
                <span className="text-muted block text-[10px] font-sans mt-1">Standard residential mortgage cap</span>
              </div>
              <div className="p-3 rounded-lg bg-bg2 border border-rule">
                <span className="text-muted block text-[10px] uppercase font-sans font-semibold">Gold Jewellery Loans</span>
                <b className="text-accent text-lg">75% LTV Cap</b>
                <span className="text-muted block text-[10px] font-sans mt-1">RBI Statutory Ceiling on Gold Loans</span>
              </div>
            </div>
          </div>

          {/* 4. CONFIDENCE MATHEMATICAL DEGRADATION */}
          <div>
            <h4 className="font-display text-base font-semibold mb-2 text-ink">
              4. Confidence & Band Widening Algorithm
            </h4>
            <p className="text-muted mb-2">
              <b>Rule 2: Confidence widens with silence.</b> When only the 8 Must Questions are provided, the engine defaults to a baseline 60% confidence with a ±2.5% rate band buffer. Each answered tightener provides verified verification signals:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted">
              <li><b>+5% Confidence</b> for Job / Business Vintage (3+ years proves cashflow stability).</li>
              <li><b>+5% Confidence</b> for 12-Month Bounce History (0 bounces proves payment discipline).</li>
              <li><b>+5% Confidence</b> for Emergency Fund Runway (3+ months guarantees buffer).</li>
              <li><b>+5% Confidence</b> for Collateral Documentation (unencumbered property appraisal).</li>
              <li><b>+5% Confidence</b> for Verified Bureau Pull (750+ CIBIL score).</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-rule bg-bg2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-accent text-accent-ink font-medium text-xs hover:opacity-90"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
