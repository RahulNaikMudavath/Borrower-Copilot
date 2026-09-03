import React from 'react';
import { NegotiationCardData } from '../engine/types';
import { Printer, Shield, AlertOctagon, MessageSquare, HelpCircle, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface NegotiationCardProps {
  cardData: NegotiationCardData;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({ cardData }) => {
  const handlePrint = () => {
    window.print();
  };

  const getLeverageBadge = () => {
    if (cardData.leverageScore >= 80) return 'bg-emerald-600 text-white';
    if (cardData.leverageScore >= 60) return 'bg-amber-600 text-white';
    return 'bg-purple-600 text-white';
  };

  return (
    <div className="bg-bg rounded-2xl border-2 border-accent/40 shadow-xl overflow-hidden mb-12 negotiation-card-container">
      {/* CARD HEADER / BANNER */}
      <div className="bg-accent text-accent-ink p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-mono font-semibold px-2 py-0.5 rounded bg-white/20">
              Lender Negotiation Battle-Card
            </span>
            <span className="text-xs text-accent-ink/80 font-mono">
              Hold this up in the branch
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight m-0 text-white">
            Borrower Power Card
          </h2>
          <p className="text-xs text-accent-ink/90 mt-1 m-0">
            {cardData.borrowerTypeSummary} · Target Facility: <b>{cardData.targetLoanType}</b> (₹{cardData.targetLoanAmount.toLocaleString('en-IN')})
          </p>
        </div>

        {/* Print Button & Leverage Score */}
        <div className="flex items-center gap-3 no-print">
          <div className="text-right">
            <span className="text-[10px] text-accent-ink/80 uppercase block">Your Leverage Score</span>
            <span className="font-mono text-xl font-bold text-white">
              {cardData.leverageScore} / 100
            </span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-accent hover:bg-accent-soft font-semibold text-xs transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print 1-Page Card</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* LEVERAGE SUMMARY */}
        <div className="p-3.5 rounded-lg bg-bg2 border border-rule text-xs flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="m-0 text-ink/90 font-medium leading-relaxed">
            <b>Your Position:</b> {cardData.leverageSummary}
          </p>
        </div>

        {/* 3 CORE COUNTER-METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-bg2 border border-rule">
            <span className="text-muted block text-[11px] uppercase font-semibold">1. Fair Rate Counter-Offer</span>
            <b className="font-mono text-2xl text-emerald-600 block mt-1 tabular-nums">
              {cardData.fairRateRange}
            </b>
            <span className="text-[11px] text-muted">Reject quotes higher than ceiling</span>
          </div>

          <div className="p-4 rounded-xl bg-bg2 border border-rule">
            <span className="text-muted block text-[11px] uppercase font-semibold">2. All-In APR Ceiling</span>
            <b className="font-mono text-2xl text-accent block mt-1 tabular-nums">
              {cardData.targetAprCeiling}
            </b>
            <span className="text-[11px] text-muted">Including PF, GST, & documentation</span>
          </div>

          <div className="p-4 rounded-xl bg-bg2 border border-rule">
            <span className="text-muted block text-[11px] uppercase font-semibold">3. Safe Monthly EMI Ceiling</span>
            <b className="font-mono text-2xl text-ink block mt-1 tabular-nums">
              {cardData.safeEmiCeiling}
            </b>
            <span className="text-[11px] text-muted">Do not sign any higher monthly outflow</span>
          </div>
        </div>

        {/* PRODUCT PIVOT RECOMMENDATION (If applicable) */}
        {cardData.productPivot && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-bg2 dark:from-purple-950/40 dark:to-bg2 border border-purple-300 dark:border-purple-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-sm text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Strategic Product Pivot
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
                Saves ~₹{cardData.productPivot.interestSavingsEst.toLocaleString('en-IN')} in Interest
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono py-1">
              <span className="line-through text-muted">{cardData.productPivot.fromProduct}</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent hidden sm:inline" />
              <span className="font-bold text-accent">{cardData.productPivot.toProduct}</span>
            </div>
            <p className="text-xs text-ink/90 font-medium m-0">
              {cardData.productPivot.rationale}
            </p>
          </div>
        )}

        {/* READY-TO-USE BRANCH COUNTER-OFFER SCRIPT */}
        <div className="p-4 rounded-xl bg-accent-soft/70 border border-accent/30 space-y-2">
          <div className="flex items-center gap-2 text-accent font-semibold text-xs uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span>Exact Words to Speak to the Loan Officer / Branch Manager:</span>
          </div>
          <blockquote className="font-display italic text-sm sm:text-base text-ink leading-relaxed border-l-2 border-accent pl-3.5 my-1">
            {cardData.counterOfferScript}
          </blockquote>
        </div>

        {/* 3 HARD RED LINES (Walk away if...) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>3 Hard Red Lines (Walk away immediately if the lender says this):</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {cardData.redLines.map((redLine, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                <span className="font-mono font-bold text-rose-600 flex-shrink-0">✕</span>
                <span className="font-medium">{redLine}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 CRITICAL BRANCH QUESTIONS */}
        <div className="pt-4 border-t border-rule space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted block">
            4 Checklist Questions to Force Honest Disclosure:
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 list-none m-0 text-xs text-ink/90">
            {cardData.essentialBranchQuestions.map((q, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-bg2 border border-rule flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                <span className="font-medium">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
