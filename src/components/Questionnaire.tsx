import React, { useState } from 'react';
import { BorrowerInputs } from '../engine/types';
import { QUESTIONS_CATALOG, QuestionDefinition } from '../engine/questions';
import { HelpCircle, Zap, ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';

interface QuestionnaireProps {
  inputs: BorrowerInputs;
  onChange: (key: keyof BorrowerInputs, value: any) => void;
  confidenceScore: number;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  inputs,
  onChange,
  confidenceScore,
}) => {
  const [viewMode, setViewMode] = useState<'must_only' | 'all'>('all');
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);

  const toggleHelp = (id: string) => {
    setExpandedHelp(expandedHelp === id ? null : id);
  };

  const mustQuestions = QUESTIONS_CATALOG.filter(q => q.tier === 'must');
  const tightenerQuestions = QUESTIONS_CATALOG.filter(q => q.tier === 'tightener');

  const visibleMust = mustQuestions.filter(q => !q.showIf || q.showIf(inputs));
  const visibleTighteners = tightenerQuestions.filter(q => !q.showIf || q.showIf(inputs));

  const answeredTightenersCount = visibleTighteners.filter(q => {
    const val = inputs[q.id];
    return val !== undefined && val !== null && val !== 0 && val !== false;
  }).length;

  const renderField = (q: QuestionDefinition) => {
    const value = inputs[q.id];

    switch (q.type) {
      case 'select':
        return (
          <select
            id={q.id}
            value={value !== undefined ? String(value) : ''}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="w-full bg-bg border border-rule rounded-lg px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          >
            {q.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'currency':
        return (
          <div>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted font-mono font-medium">
                ₹
              </div>
              <input
                type="number"
                id={q.id}
                value={typeof value === 'number' ? value : ''}
                placeholder={q.placeholder || '0'}
                min={q.min}
                max={q.max}
                step={q.step || 1000}
                onChange={(e) => onChange(q.id, e.target.value === '' ? undefined : Number(e.target.value))}
                className="w-full bg-bg border border-rule rounded-lg pl-8 pr-4 py-2.5 text-ink font-mono focus:outline-none focus:ring-2 focus:ring-accent text-sm tabular-nums"
              />
            </div>
            {typeof value === 'number' && value > 0 && (
              <div className="text-[11px] font-mono text-muted mt-1 pl-1">
                Amount in Words: <b>₹{Number(value).toLocaleString('en-IN')}</b> ({formatInLakhs(Number(value))})
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            id={q.id}
            value={typeof value === 'number' ? value : ''}
            placeholder={q.placeholder || '0'}
            min={q.min}
            max={q.max}
            step={q.step || 1}
            onChange={(e) => onChange(q.id, e.target.value === '' ? undefined : Number(e.target.value))}
            className="w-full bg-bg border border-rule rounded-lg px-3.5 py-2.5 text-ink font-mono focus:outline-none focus:ring-2 focus:ring-accent text-sm tabular-nums"
          />
        );

      case 'radio':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {q.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col p-3 rounded-lg border cursor-pointer transition-all text-xs ${
                  value === opt.value
                    ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent'
                    : 'border-rule hover:border-ink/30 bg-bg text-ink'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={() => onChange(q.id, opt.value)}
                    className="accent-accent"
                  />
                  <span className="font-semibold">{opt.label.split('(')[0]}</span>
                </div>
                {opt.label.includes('(') && (
                  <span className="text-[11px] text-muted ml-5">
                    ({opt.label.split('(')[1]}
                  </span>
                )}
              </label>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex gap-4">
            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-xs ${
              value === true
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent font-semibold'
                : 'border-rule bg-bg text-ink'
            }`}>
              <input
                type="radio"
                name={q.id}
                checked={value === true}
                onChange={() => onChange(q.id, true)}
                className="accent-accent"
              />
              <span>Yes, I own unencumbered collateral</span>
            </label>
            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-xs ${
              value === false
                ? 'border-accent bg-accent-soft text-accent ring-1 ring-accent font-semibold'
                : 'border-rule bg-bg text-ink'
            }`}>
              <input
                type="radio"
                name={q.id}
                checked={value === false}
                onChange={() => onChange(q.id, false)}
                className="accent-accent"
              />
              <span>No / Prefer Unsecured</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-bg2 border border-rule rounded-xl p-5 sm:p-6 shadow-sm mb-8">
      {/* Questionnaire Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rule mb-6">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent" />
            Adaptive Borrower Questionnaire
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Everything runs locally from what you tell us. No bureau pulls, no login required.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex rounded-lg border border-rule p-1 bg-bg text-xs">
          <button
            onClick={() => setViewMode('must_only')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              viewMode === 'must_only'
                ? 'bg-accent text-accent-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            Must Questions ({visibleMust.length})
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'all'
                ? 'bg-accent text-accent-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span>Full Deep Dive</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent-soft text-accent">
              +{visibleTighteners.length}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MUST QUESTIONS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted m-0">
            Tier 1: Core Must Questions (Affordability & Intent)
          </h3>
          <span className="text-xs font-mono text-muted">
            {visibleMust.length} Questions
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {visibleMust.map((q) => (
            <div key={q.id} className="bg-bg border border-rule/80 rounded-lg p-4 space-y-2 hover:border-accent/30 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <label htmlFor={q.id} className="block text-sm font-semibold text-ink">
                    {q.label}
                  </label>
                  <p className="text-xs text-muted mt-0.5">{q.sublabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleHelp(q.id)}
                  className="text-muted hover:text-accent p-1"
                  title="Why this question matters"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Collapsible Why It Matters */}
              {expandedHelp === q.id && (
                <div className="bg-accent-soft/60 border-l-2 border-accent p-2.5 rounded text-xs text-accent space-y-1">
                  <p className="font-semibold m-0">Why this matters:</p>
                  <p className="m-0 text-ink/90">{q.whyItMatters}</p>
                </div>
              )}

              {/* The Input Component */}
              <div className="pt-1">{renderField(q)}</div>

              {/* Impact Tag Badge */}
              <div className="flex items-center gap-1 text-[11px] text-muted font-medium pt-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>{q.impactTag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: RANGE TIGHTENERS (Conditional / Toggle) */}
      {viewMode === 'all' && (
        <div className="mt-8 pt-6 border-t border-rule space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted m-0">
                Tier 2: Range Tighteners (Every question narrows a band)
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Answered: <b>{answeredTightenersCount} of {visibleTighteners.length}</b>. Each answered question tightens rate bands and raises confidence.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Confidence: {confidenceScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {visibleTighteners.map((q) => (
              <div key={q.id} className="bg-bg border border-rule/80 rounded-lg p-4 space-y-2 hover:border-accent/30 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label htmlFor={q.id} className="block text-sm font-semibold text-ink">
                      {q.label}
                    </label>
                    <p className="text-xs text-muted mt-0.5">{q.sublabel}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleHelp(q.id)}
                    className="text-muted hover:text-accent p-1"
                    title="Why this question matters"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                {expandedHelp === q.id && (
                  <div className="bg-accent-soft/60 border-l-2 border-accent p-2.5 rounded text-xs text-accent space-y-1">
                    <p className="font-semibold m-0">Why this matters:</p>
                    <p className="m-0 text-ink/90">{q.whyItMatters}</p>
                  </div>
                )}

                <div className="pt-1">{renderField(q)}</div>

                <div className="flex items-center gap-1 text-[11px] text-muted font-medium pt-1">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  <span>{q.impactTag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to format rupees in Lakhs / Crores
function formatInLakhs(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Crore${num >= 20000000 ? 's' : ''}`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} Lakh${num >= 200000 ? 's' : ''}`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} Thousand`;
  }
  return `${num}`;
}
