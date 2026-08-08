import React from 'react';
import { HardDrive, TrendingDown, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function DataSavingsCard() {
  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6 border border-purple-500/30 bg-gradient-to-br from-slate-950 via-[#100a22] to-slate-950 mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/40 glow-cyan">
              <HardDrive className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-100 uppercase tracking-wider flex items-center gap-2">
                Why CityMind? Data Savings Visualization
              </h3>
              <p className="text-xs text-slate-400">
                Drastic reduction in database overhead through event-driven state diff commit architecture
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold animate-pulse">
          Illustrative hackathon simulation
        </div>
      </div>

      {/* Comparison Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        
        {/* Traditional IoT Storage */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400 font-semibold">Traditional IoT Storage (Flat 24/7 Time-Series)</span>
            <span className="text-rose-400 font-bold text-sm">100% Payload</span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div className="w-full h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Stores millions of identical, flat sensor states (e.g. "Traffic 42%" saved every 5 seconds forever).
          </p>
        </div>

        {/* CityMind Event Storage */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 glow-cyan">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              CityMind Event Storage (Baseline + Diff Commits)
            </span>
            <span className="text-emerald-400 font-bold text-sm">13% Payload</span>
          </div>
          <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div className="w-[13%] h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full animate-pulse" />
          </div>
          <p className="text-[11px] text-cyan-200 mt-2 font-mono">
            Stores only baseline delta state diffs & verified citizen events. Zero flat redundancy.
          </p>
        </div>

      </div>

      {/* Summary Highlight Box */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-2xl text-emerald-400">
              87% ESTIMATED STORAGE REDUCTION
            </span>
            <p className="text-xs text-slate-300 font-medium">
              "Unchanged sensor states do not need to become permanent records."
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          <span className="block text-slate-200 font-bold">100 GB → 13 GB</span>
          <span>Scales to million-device cities</span>
        </div>
      </div>
    </div>
  );
}
