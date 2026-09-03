import React from 'react';
import { O1Verdict } from '../engine/types';
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';

interface VerdictCardProps {
  verdict: O1Verdict;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdict }) => {
  const getBadgeStyles = () => {
    switch (verdict.verdict) {
      case 'BORROW':
        if (verdict.suggestedAlternativeProduct) {
          return {
            container: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200',
            badge: 'bg-purple-600 text-white',
            icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          };
        }
        return {
          container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        };
      case 'BORROW_LESS':
        return {
          container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        };
      case 'DONT_BORROW':
        return {
          container: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200',
          badge: 'bg-rose-600 text-white',
          icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        };
    }
  };

  const styles = getBadgeStyles();

  return (
    <div className={`rounded-xl border p-5 sm:p-6 transition-all shadow-sm ${styles.container}`}>
      {/* Output Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-current/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
            Output 1 · The Verdict
          </span>
          <span className="text-xs text-muted">Should you borrow at all?</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm flex items-center gap-1.5 ${styles.badge}`}>
            {styles.icon}
            <span>{verdict.badgeText}</span>
          </span>
        </div>
      </div>

      {/* Headline & Primary Statement */}
      <div className="space-y-2 mb-4">
        <h3 className="font-display text-2xl font-medium tracking-tight text-ink leading-snug">
          {verdict.headline}
        </h3>
        <p className="text-sm font-medium text-ink/90">
          <b>Reason:</b> {verdict.primaryReason}
        </p>
      </div>

      {/* Product Pivot Box (e.g. Ravi kirana LAP pivot) */}
      {verdict.pivotRecommendation && (
        <div className="my-4 p-4 rounded-lg bg-bg border border-accent/30 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-accent font-semibold">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Strategic Product Optimization Recommended:</span>
          </div>
          <p className="text-ink/90 leading-relaxed m-0 font-medium">
            {verdict.pivotRecommendation}
          </p>
        </div>
      )}

      {/* Detailed Reasons Bullet List */}
      {verdict.detailedReasons.length > 0 && (
        <div className="space-y-2 mt-4 pt-4 border-t border-current/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted m-0">
            Key Underwriting Factors & Rationale:
          </h4>
          <ul className="space-y-1.5 pl-0 list-none m-0 text-xs text-ink/90">
            {verdict.detailedReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
