import React from 'react';
import { O2Capacity } from '../engine/types';
import { ShieldCheck, AlertCircle, Building2, UserCheck, TrendingUp, Info } from 'lucide-react';

interface CapacityCardProps {
  capacity: O2Capacity;
  requestedAmount: number;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({ capacity, requestedAmount }) => {
  return (
    <div className="bg-bg2 border border-rule rounded-xl p-5 sm:p-6 shadow-sm">
      {/* Output Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rule mb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-soft text-accent">
            Output 2 · Borrowing Capacity
          </span>
          <span className="text-xs text-muted">Lender Sanction vs Safe Carrying Limit</span>
        </div>
        <div className="text-xs font-mono text-muted">
          Asked: <b>₹{requestedAmount.toLocaleString('en-IN')}</b>
        </div>
      </div>

      {/* The Two Numbers (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 1. Lender Likely Sanction */}
        <div className="bg-bg border border-rule rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-muted" />
              Lender Likely Sanction
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-bg2 border border-rule">
              FOIR Cap: {capacity.lenderFoirLimitPct}%
            </span>
          </div>

          <div className="font-mono text-3xl sm:text-4xl font-semibold text-ink tracking-tight my-1 tabular-nums">
            ₹{capacity.lenderLikelySanction.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            The maximum loan a bank or NBFC credit policy will stretch to approve based on algorithmic FOIR underwriting.
          </p>
        </div>

        {/* 2. Borrower Safe Carrying Capacity */}
        <div className="bg-bg border-2 border-emerald-500/50 dark:border-emerald-500/40 rounded-xl p-4 sm:p-5 relative overflow-hidden bg-gradient-to-br from-emerald-50/30 to-transparent dark:from-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 mb-2">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Your Safe Carrying Limit
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 font-bold">
              Safe FOIR: {capacity.borrowerSafeFoirLimitPct}%
            </span>
          </div>

          <div className="font-mono text-3xl sm:text-4xl font-semibold text-emerald-700 dark:text-emerald-300 tracking-tight my-1 tabular-nums">
            ₹{capacity.borrowerSafeCapacity.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 mt-2 leading-relaxed font-medium">
            The prudent ceiling you can service while maintaining emergency savings, rent, and household stability.
          </p>
        </div>
      </div>

      {/* Which Number Should You Use Directive */}
      <div className="bg-accent-soft/80 border-l-4 border-accent rounded-r-lg p-4 mb-5 space-y-1">
        <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Recommended Target Amount: <b>₹{capacity.recommendedAmount.toLocaleString('en-IN')}</b></span>
        </div>
        <p className="text-xs text-ink/90 leading-relaxed m-0 font-medium">
          {capacity.explanation}
        </p>
      </div>

      {/* Collateral LTV Cap (If property/shop available) */}
      {capacity.collateralLtvCapAmount && capacity.collateralLtvCapAmount > 0 && (
        <div className="bg-bg border border-rule rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent flex-shrink-0" />
            <span>
              <b>Asset Security Headroom:</b> Your pledged collateral allows a regulatory LTV limit of <b>{capacity.collateralLtvPct}%</b> (up to <b>₹{capacity.collateralLtvCapAmount.toLocaleString('en-IN')}</b>).
            </span>
          </div>
          <span className="font-mono text-[11px] text-accent px-2 py-1 rounded bg-accent-soft border border-accent/20 flex-shrink-0">
            High Security Cover
          </span>
        </div>
      )}

      {/* DTI & FOIR Metrics Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-rule text-xs font-mono">
        <div className="p-2 rounded bg-bg border border-rule">
          <span className="text-muted block text-[10px] uppercase">Current DTI</span>
          <b className="text-ink text-sm">{capacity.currentDtiPct}%</b>
        </div>
        <div className="p-2 rounded bg-bg border border-rule">
          <span className="text-muted block text-[10px] uppercase">Projected DTI</span>
          <b className={`text-sm ${capacity.projectedDtiPct > 55 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {capacity.projectedDtiPct}%
          </b>
        </div>
        <div className="p-2 rounded bg-bg border border-rule">
          <span className="text-muted block text-[10px] uppercase">Lender Limit</span>
          <b className="text-ink text-sm">{capacity.lenderFoirLimitPct}% FOIR</b>
        </div>
        <div className="p-2 rounded bg-bg border border-rule">
          <span className="text-muted block text-[10px] uppercase">Safe Limit</span>
          <b className="text-emerald-600 text-sm">{capacity.borrowerSafeFoirLimitPct}% FOIR</b>
        </div>
      </div>
    </div>
  );
};
