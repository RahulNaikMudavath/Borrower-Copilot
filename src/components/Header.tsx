import React from 'react';
import { Sparkles, Shield, User, RotateCcw, BookOpen, Sun, Moon, Info } from 'lucide-react';
import { PERSONAS } from '../engine/personas';
import { CalculatedOutputs, PersonaProfile } from '../engine/types';

interface HeaderProps {
  activePersonaId: 'priya' | 'ravi' | 'anita' | 'custom';
  onSelectPersona: (persona: PersonaProfile | null) => void;
  outputs: CalculatedOutputs;
  onOpenRules: () => void;
  onOpenPersonasModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersonaId,
  onSelectPersona,
  outputs,
  onOpenRules,
  onOpenPersonasModal,
  darkMode,
  onToggleDarkMode,
}) => {
  const getConfidenceBadgeColor = () => {
    if (outputs.confidenceScore >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
    if (outputs.confidenceScore >= 65) return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
    return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
  };

  return (
    <header className="border-b border-rule pb-6 mb-8 pt-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">
              Lokta · Build Challenge · Take-Home
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-accent-soft text-accent border border-accent/20">
              v1.0 Ready
            </span>
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink tracking-tight mt-1">
            Borrower <em className="italic text-accent">Copilot</em>
          </h1>
        </div>

        {/* Right Action Badges */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Confidence Meter Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium font-mono ${getConfidenceBadgeColor()}`} title={outputs.confidenceExplanation}>
            <Shield className="w-3.5 h-3.5" />
            <span>Confidence: <b>{outputs.confidenceScore}%</b> ({outputs.confidenceTier})</span>
          </div>

          {/* Rules Inspector Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule hover:border-ink/40 bg-bg2 text-ink text-xs font-medium transition-all"
            title="Inspect every formula, FOIR table, and RBI benchmark"
          >
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span>RULES.md</span>
          </button>

          {/* 3 Personas Comparison */}
          <button
            onClick={onOpenPersonasModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule hover:border-ink/40 bg-bg2 text-ink text-xs font-medium transition-all"
            title="View side-by-side run-through of Priya, Ravi, Anita"
          >
            <User className="w-3.5 h-3.5 text-accent" />
            <span>3 Personas Run</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg border border-rule hover:border-ink/40 bg-bg2 text-ink transition-all"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-accent" />}
          </button>
        </div>
      </div>

      {/* Product Thesis */}
      <p className="font-display text-lg text-ink/90 max-w-3xl leading-snug">
        Your personal self-assessment before walking into a lender: <strong>Should I borrow at all? How much am I really eligible for? What is a fair rate for me? What EMI should I agree to?</strong> Plus a 1-page card you can negotiate with.
      </p>

      {/* 1-Click Persona Pre-loaders */}
      <div className="mt-5 pt-4 border-t border-rule/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            1-Click Test Scenarios (Challenge Personas):
          </span>
          {activePersonaId !== 'custom' && (
            <span className="text-xs text-accent font-medium">
              Loaded: <b>{PERSONAS[activePersonaId].name}</b> ({PERSONAS[activePersonaId].tagline})
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Priya */}
          <button
            onClick={() => onSelectPersona(PERSONAS.priya)}
            className={`text-left p-2.5 rounded-lg border transition-all ${
              activePersonaId === 'priya'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent'
                : 'border-rule hover:border-accent/40 bg-bg2 text-ink'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-sm">Priya, 29</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg/80">Salaried MNC</span>
            </div>
            <p className="text-xs text-muted truncate mt-0.5">₹1.1L net · ₹8L Wedding loan</p>
          </button>

          {/* Ravi */}
          <button
            onClick={() => onSelectPersona(PERSONAS.ravi)}
            className={`text-left p-2.5 rounded-lg border transition-all ${
              activePersonaId === 'ravi'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent'
                : 'border-rule hover:border-accent/40 bg-bg2 text-ink'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-sm">Ravi, 42</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg/80">Kirana Store</span>
            </div>
            <p className="text-xs text-muted truncate mt-0.5">₹45L shop · ₹15L stock loan</p>
          </button>

          {/* Anita */}
          <button
            onClick={() => onSelectPersona(PERSONAS.anita)}
            className={`text-left p-2.5 rounded-lg border transition-all ${
              activePersonaId === 'anita'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent'
                : 'border-rule hover:border-accent/40 bg-bg2 text-ink'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-sm">Anita, 35</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg/80">Informal / Gig</span>
            </div>
            <p className="text-xs text-muted truncate mt-0.5">3 app loans · ₹1.5L EV scooter</p>
          </button>

          {/* Custom / Reset */}
          <button
            onClick={() => onSelectPersona(null)}
            className={`text-left p-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 ${
              activePersonaId === 'custom'
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent'
                : 'border-rule hover:border-accent/40 bg-bg2 text-ink'
            }`}
          >
            <RotateCcw className="w-4 h-4 text-muted" />
            <span className="text-xs font-semibold">Custom / Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
