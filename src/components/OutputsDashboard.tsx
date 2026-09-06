import React, { useState } from 'react';
import { CalculatedOutputs } from '../engine/types';
import { VerdictCard } from './VerdictCard';
import { CapacityCard } from './CapacityCard';
import { RateCard } from './RateCard';
import { EmiStressCard } from './EmiStressCard';
import { NegotiationCard } from './NegotiationCard';
import { LayoutDashboard, Award, SlidersHorizontal, Printer, ChevronRight } from 'lucide-react';

interface OutputsDashboardProps {
  outputs: CalculatedOutputs;
  requestedAmount: number;
}

export const OutputsDashboard: React.FC<OutputsDashboardProps> = ({ outputs, requestedAmount }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'card'>('all');

  return (
    <div className="space-y-8">
      {/* Top Output Tabs */}
      <div className="flex items-center justify-between border-b border-rule pb-3 no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-accent text-accent-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>4 Outputs Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'card'
                ? 'bg-accent text-accent-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>1-Page Negotiation Card</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Calculation Active</span>
          </span>
          <span className="hidden sm:inline">· &lt; 5ms local execution</span>
        </div>
      </div>

      {activeTab === 'card' ? (
        /* Only Negotiation Card View */
        <NegotiationCard cardData={outputs.negotiationCard} />
      ) : (
        /* Full 4 Outputs Stack */
        <div className="space-y-8">
          {/* O1: The Verdict */}
          <VerdictCard verdict={outputs.o1Verdict} />

          {/* O2: Maximum Amount */}
          <CapacityCard capacity={outputs.o2Capacity} requestedAmount={requestedAmount} />

          {/* O3: Fair Interest Rate & APR */}
          <RateCard rate={outputs.o3Rate} loanAmount={requestedAmount} />

          {/* O4: Safe Monthly EMI & Stress Testing */}
          <EmiStressCard emiData={outputs.o4Emi} loanAmount={requestedAmount} />

          {/* The Negotiation Card at the bottom of the dashboard */}
          <div className="pt-6 border-t border-rule">
            <div className="mb-4">
              <h3 className="font-display text-2xl font-medium text-ink">
                Your 1-Page Branch Negotiation Card
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Take this card into the branch to counter high rates, demand fee waivers, and force transparent APR disclosure.
              </p>
            </div>
            <NegotiationCard cardData={outputs.negotiationCard} />
          </div>
        </div>
      )}
    </div>
  );
};
