import React, { useState } from 'react';
import { Brain, AlertTriangle, ArrowRight, Eye, RefreshCw, CheckCircle2, Sparkles, Layers, ShieldAlert } from 'lucide-react';

export default function AIInsightCard({ insight = {}, onSelectSimilar }) {
  const [actionTriggered, setActionTriggered] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const causes = Array.isArray(insight.possibleCauses) && insight.possibleCauses.length > 0 
    ? insight.possibleCauses 
    : [
        insight.details || 'Threshold anomaly detected by forecasting models.',
        'Cross-sector load and environmental variable correlation.'
      ];

  const title = insight.title || insight.target_system || 'Urban Predictive Alert';
  const type = insight.type || 'Predictive';
  const similarityScore = insight.similarityScore ?? Math.round((insight.probability || 0.88) * 100);
  const diffHighlight = insight.diffHighlight || insight.details || 'State variance detected';
  const matchId = insight.historicalMatchId || insight.alert_id || 'AL-101';
  const dateStr = insight.historicalDate || insight.estimated_timeframe || 'Next 2-4 Hours';
  const actionText = insight.recommendedAction || insight.recommended_mitigation || 'Continuous monitoring and automated telemetry evaluation active.';
  const evidenceCount = insight.evidenceCount || 12;
  const zone = insight.zoneId || insight.location_zone || 'Smart City Zone';

  return (
    <div className="glass-panel-interactive rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-br from-slate-950 via-[#0d091e] to-slate-950 flex flex-col justify-between mb-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 glow-cyan">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">
                AI REASONING INSIGHT • {type}
              </span>
              <h4 className="font-heading font-extrabold text-base text-slate-100">
                {title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
              {similarityScore}% Vector Match
            </span>
          </div>
        </div>

        {/* Diff Highlight */}
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs font-mono text-rose-200 mb-4 flex items-center justify-between">
          <span>{diffHighlight}</span>
          <span className="text-slate-400">Match Ref: <strong className="text-cyan-300">{matchId}</strong> ({dateStr})</span>
        </div>

        {/* Root Causes */}
        <div className="mb-4">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider block mb-2">
            Possible Causes Identified from Memory:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
            {causes.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Action */}
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 mb-4">
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
            RECOMMENDED CITY ACTION
          </span>
          <p className="text-xs font-medium text-emerald-100">
            "{actionText}"
          </p>
        </div>

        {/* Evidence details popup */}
        {showEvidence && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1 mb-4 font-mono">
            <p className="font-bold text-cyan-300">Sensor Evidence Logs ({evidenceCount}):</p>
            <p>• Multi-loop detector array threshold breached at {zone}</p>
            <p>• High-resolution vision telemetry confirmed queue density</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEvidence(!showEvidence)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showEvidence ? 'Hide Evidence' : 'View Evidence'}</span>
          </button>
          
          <button 
            onClick={() => onSelectSimilar && onSelectSimilar(insight.historicalMatchId)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>View Similar Events</span>
          </button>
        </div>

        <button
          onClick={() => {
            setActionTriggered(true);
            setTimeout(() => setActionTriggered(false), 3000);
          }}
          className={`px-4 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            actionTriggered 
              ? 'bg-emerald-500 text-slate-950' 
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg glow-cyan'
          }`}
        >
          {actionTriggered ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Response Dispatched!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Response</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
