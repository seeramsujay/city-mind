import React from 'react';
import { Radio, BarChart2, AlertCircle, GitCommit, Database, Brain, CheckCircle2, ChevronRight } from 'lucide-react';

export default function PipelineHeader() {
  const steps = [
    { label: 'SENSOR DATA', sub: '24/7 Streams', icon: Radio, color: 'text-slate-400', border: 'border-slate-700' },
    { label: 'BASELINE', sub: 'Normal State', icon: BarChart2, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { label: 'CHANGE DETECTED', sub: 'Threshold Alert', icon: AlertCircle, color: 'text-amber-400', border: 'border-amber-500/40' },
    { label: 'DELTA / DIFF', sub: 'State Difference', icon: GitCommit, color: 'text-rose-400', border: 'border-rose-500/40' },
    { label: 'CITY COMMIT', sub: 'Traceable Event', icon: GitCommit, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { label: 'MEMORY', sub: 'Hot/Warm/Cold', icon: Database, color: 'text-blue-400', border: 'border-blue-500/40' },
    { label: 'AI REASONING', sub: 'Vector Insights', icon: Brain, color: 'text-purple-400', border: 'border-purple-500/40' },
    { label: 'CITY ACTION', sub: 'Automated Support', icon: CheckCircle2, color: 'text-cyan-300', border: 'border-cyan-400/50' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-5 border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0a1224] to-slate-950 shadow-2xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="font-heading font-bold text-sm lg:text-base text-cyan-200 uppercase tracking-wider">
              Core Operational Architecture — Event-Driven State Diffs
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            CityMind rejects continuous flat time-series storage. Only meaningful diffs become permanent City Commits.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-cyan-300">
          <span className="text-slate-400">TRADITIONAL:</span>
          <span className="line-through text-slate-500">Continuous Raw Data</span>
          <span className="text-cyan-400 font-bold">vs</span>
          <span className="text-emerald-400 font-bold">CITYMIND: Baseline + Diff Commits</span>
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 items-center">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              <div className={`flex flex-col items-center p-2.5 rounded-xl bg-slate-900/80 border ${step.border} hover:bg-slate-800/90 transition-all text-center h-full`}>
                <div className={`p-1.5 rounded-lg bg-slate-950/60 mb-1.5 ${step.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-heading font-bold text-slate-200 tracking-tight leading-tight">
                  {step.label}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {step.sub}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                  <ChevronRight className="w-4 h-4 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
