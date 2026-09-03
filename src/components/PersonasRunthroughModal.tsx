import React, { useState } from 'react';
import { X, User, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { PERSONAS } from '../engine/personas';
import { evaluateBorrowerProfile } from '../engine/calculator';
import { PersonaProfile } from '../engine/types';

interface PersonasRunthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPersona: (persona: PersonaProfile) => void;
}

export const PersonasRunthroughModal: React.FC<PersonasRunthroughModalProps> = ({
  isOpen,
  onClose,
  onLoadPersona,
}) => {
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<'priya' | 'ravi' | 'anita'>('priya');

  if (!isOpen) return null;

  const currentPersona = PERSONAS[selectedPersonaKey];
  const output = evaluateBorrowerProfile(currentPersona.inputs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-bg border border-rule rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-rule flex items-center justify-between bg-bg2">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            <h3 className="font-display text-xl font-semibold m-0 text-ink">
              Three Borrowers Run-Through Analysis
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rule text-muted hover:text-ink transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Switcher Tabs */}
        <div className="flex border-b border-rule bg-bg2/50 p-2 gap-2">
          {(['priya', 'ravi', 'anita'] as const).map((key) => {
            const p = PERSONAS[key];
            return (
              <button
                key={key}
                onClick={() => setSelectedPersonaKey(key)}
                className={`flex-1 p-2.5 rounded-lg text-left transition-all text-xs ${
                  selectedPersonaKey === key
                    ? 'bg-bg text-ink border border-rule shadow-sm font-semibold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <div className="font-display text-sm font-bold">{p.name}, {p.age}</div>
                <div className="text-[11px] truncate text-muted">{p.location} · {p.employmentType}</div>
              </button>
            );
          })}
        </div>

        {/* Persona Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-ink">
          {/* Story & Ask */}
          <div className="p-4 rounded-xl bg-bg2 border border-rule space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-base text-ink">
                {currentPersona.name}’s Profile & Challenge Prompt:
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-accent-soft text-accent">
                {currentPersona.tagline}
              </span>
            </div>
            <p className="m-0 leading-relaxed text-ink/90">
              {currentPersona.story}
            </p>
            <div className="pt-2 border-t border-rule text-xs font-semibold text-accent">
              Borrower Goal: {currentPersona.ask}
            </div>
          </div>

          {/* 4 Calculated Outputs Breakdown */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-semibold text-ink m-0">
              How Borrower Copilot Answers the 4 Questions:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* O1 */}
              <div className="p-3.5 rounded-lg bg-bg2 border border-rule space-y-1">
                <span className="font-mono text-[10px] text-muted uppercase block font-semibold">O1: The Verdict</span>
                <b className="font-display text-sm text-accent block">{output.o1Verdict.badgeText}</b>
                <p className="text-muted leading-relaxed m-0">{output.o1Verdict.primaryReason}</p>
              </div>

              {/* O2 */}
              <div className="p-3.5 rounded-lg bg-bg2 border border-rule space-y-1">
                <span className="font-mono text-[10px] text-muted uppercase block font-semibold">O2: Maximum Amount</span>
                <b className="font-mono text-sm text-ink block">
                  Lender: ₹{output.o2Capacity.lenderLikelySanction.toLocaleString('en-IN')} vs Safe: ₹{output.o2Capacity.borrowerSafeCapacity.toLocaleString('en-IN')}
                </b>
                <p className="text-muted leading-relaxed m-0">Target Recommended: ₹{output.o2Capacity.recommendedAmount.toLocaleString('en-IN')}</p>
              </div>

              {/* O3 */}
              <div className="p-3.5 rounded-lg bg-bg2 border border-rule space-y-1">
                <span className="font-mono text-[10px] text-muted uppercase block font-semibold">O3: Fair Interest Rate</span>
                <b className="font-mono text-sm text-emerald-600 block">{output.o3Rate.fairRateMin}% - {output.o3Rate.fairRateMax}% (APR {output.o3Rate.apr.allInAprPct}%)</b>
                <p className="text-muted leading-relaxed m-0">{output.o3Rate.rateReason}</p>
              </div>

              {/* O4 */}
              <div className="p-3.5 rounded-lg bg-bg2 border border-rule space-y-1">
                <span className="font-mono text-[10px] text-muted uppercase block font-semibold">O4: Safe EMI & Stress Test</span>
                <b className="font-mono text-sm text-ink block">Max Safe Ceiling: ₹{output.o4Emi.maxSafeMonthlyEmi.toLocaleString('en-IN')}/mo</b>
                <p className="text-muted leading-relaxed m-0">{output.o4Emi.stressTest.combinedRiskAssessment}</p>
              </div>
            </div>
          </div>

          {/* Strategic Rationale & Key Takeaways */}
          <div className="p-4 rounded-xl bg-accent-soft/70 border border-accent/30 space-y-2">
            <span className="font-semibold text-xs text-accent uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              Strategic Underwriting Takeaway:
            </span>
            <p className="text-ink/90 leading-relaxed font-medium m-0">
              {currentPersona.expectedTakeaways.keyStrategy}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-rule bg-bg2 flex items-center justify-between">
          <button
            onClick={() => {
              onLoadPersona(currentPersona);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-ink font-semibold text-xs hover:opacity-90 transition-all"
          >
            <span>Load {currentPersona.name} into Live App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-rule text-muted hover:text-ink text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
