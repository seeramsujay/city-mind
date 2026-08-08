import React, { useState } from 'react';
import { Layers, GitCommit, ArrowRight, Filter, AlertTriangle, ShieldCheck, Flame, ExternalLink, Clock } from 'lucide-react';

export default function CommitStream({ commits, onSelectCommit }) {
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filteredCommits = commits.filter(commit => {
    if (filterSeverity === 'All') return true;
    return commit.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const getSeverityStyle = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return {
          badge: 'bg-rose-950/90 text-rose-300 border-rose-500/50',
          dot: 'bg-rose-500',
          cardBorder: 'border-rose-500/30 hover:border-rose-500/60'
        };
      case 'warning':
        return {
          badge: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
          dot: 'bg-amber-500',
          cardBorder: 'border-amber-500/30 hover:border-amber-500/60'
        };
      case 'high':
        return {
          badge: 'bg-blue-950/90 text-blue-300 border-blue-500/50',
          dot: 'bg-blue-500',
          cardBorder: 'border-blue-500/30 hover:border-blue-500/60'
        };
      default:
        return {
          badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
          dot: 'bg-emerald-500',
          cardBorder: 'border-slate-800 hover:border-slate-700'
        };
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 mb-6">
      {/* Stream Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 glow-cyan">
              <GitCommit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-100 uppercase tracking-wider flex items-center gap-2">
                City Commit Stream
                <span className="text-xs font-mono font-normal normal-case px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Live Event Feed
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Meaningful changes detected across the city
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {['All', 'Critical', 'Warning', 'High', 'Normal'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                filterSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Commit List Cards */}
      <div className="space-y-3">
        {filteredCommits.map((commit) => {
          const sevStyle = getSeverityStyle(commit.severity);
          return (
            <div
              key={commit.id}
              onClick={() => onSelectCommit(commit)}
              className={`glass-panel-interactive rounded-xl p-4 border ${sevStyle.cardBorder} cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60`}
            >
              {/* Left Info: Commit ID & Zone */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 shrink-0 font-mono">
                  <span className="text-[10px] text-slate-500">ID</span>
                  <span className="text-xs font-bold text-cyan-300">{commit.id.split('-')[1]}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {commit.id}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {commit.timestamp}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {commit.zoneCode} ({commit.zoneName})
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                    {commit.event}
                    <span className="text-xs font-normal text-slate-400 font-mono">
                      [{commit.category}]
                    </span>
                  </h4>
                </div>
              </div>

              {/* Middle: Delta Transition */}
              <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs shrink-0">
                <span className="text-slate-400">{commit.previousValue}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold">{commit.newValue}</span>
                <span className="text-slate-600">|</span>
                <span className={`font-extrabold ${commit.delta.startsWith('+') ? 'text-rose-400' : 'text-cyan-300'}`}>
                  Delta: {commit.delta}
                </span>
              </div>

              {/* Right: Severity Badge & Trace Action */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border uppercase tracking-wider ${sevStyle.badge}`}>
                  {commit.severity}
                </span>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCommit(commit);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Trace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
