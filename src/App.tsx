import React, { useState, useEffect } from 'react';
import { BorrowerInputs, CalculatedOutputs, PersonaProfile } from './engine/types';
import { PERSONAS } from './engine/personas';
import { evaluateBorrowerProfile } from './engine/calculator';
import { Header } from './components/Header';
import { Questionnaire } from './components/Questionnaire';
import { OutputsDashboard } from './components/OutputsDashboard';
import { RuleInspectorModal } from './components/RuleInspectorModal';
import { PersonasRunthroughModal } from './components/PersonasRunthroughModal';

const DEFAULT_BLANK_INPUTS: BorrowerInputs = {
  purpose: 'personal' as any,
  loanAmountWanted: 500000,
  loanTypeWanted: 'personal',
  monthlyNetIncome: 50000,
  employmentType: 'salaried',
  existingMonthlyEmi: 0,
  monthlyHouseholdExpenses: 25000,
  age: 30,
  creditScoreTier: 'unknown_ntc',
};

export function App() {
  // Start with Priya loaded by default
  const [activePersonaId, setActivePersonaId] = useState<'priya' | 'ravi' | 'anita' | 'custom'>('priya');
  const [inputs, setInputs] = useState<BorrowerInputs>(PERSONAS.priya.inputs);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isPersonasModalOpen, setIsPersonasModalOpen] = useState<boolean>(false);

  // Compute live outputs deterministically
  const outputs: CalculatedOutputs = evaluateBorrowerProfile(inputs);

  // Handle Input Changes
  const handleInputChange = (key: keyof BorrowerInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
    setActivePersonaId('custom');
  };

  // Handle Persona Selection
  const handleSelectPersona = (persona: PersonaProfile | null) => {
    if (!persona) {
      setActivePersonaId('custom');
      setInputs(DEFAULT_BLANK_INPUTS);
    } else {
      setActivePersonaId(persona.id);
      setInputs(persona.inputs);
    }
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-accent-soft selection:text-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full flex-1">
        {/* Header with 1-click Persona Loaders & Confidence Meter */}
        <Header
          activePersonaId={activePersonaId}
          onSelectPersona={handleSelectPersona}
          outputs={outputs}
          onOpenRules={() => setIsRulesModalOpen(true)}
          onOpenPersonasModal={() => setIsPersonasModalOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Main Grid Layout: Questionnaire (Left/Top) and Outputs (Right/Bottom) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Adaptive Questionnaire */}
          <div className="lg:col-span-5 space-y-6 no-print">
            <Questionnaire
              inputs={inputs}
              onChange={handleInputChange}
              confidenceScore={outputs.confidenceScore}
            />
          </div>

          {/* Right Column: 4 Outputs Dashboard & Negotiation Card */}
          <div className="lg:col-span-7 space-y-6">
            <OutputsDashboard
              outputs={outputs}
              requestedAmount={inputs.loanAmountWanted}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-rule text-xs text-muted flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <p className="m-0 font-display italic text-sm">
            What we are really testing: can you turn lending judgement into rules a borrower can see and a machine can run?
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Lokta Challenge v1.0</span>
            <span>·</span>
            <span>Zero Bureau Pull</span>
            <span>·</span>
            <span>100% Client-Side</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <RuleInspectorModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <PersonasRunthroughModal
        isOpen={isPersonasModalOpen}
        onClose={() => setIsPersonasModalOpen(false)}
        onLoadPersona={(p) => handleSelectPersona(p)}
      />
    </div>
  );
}

export default App;
