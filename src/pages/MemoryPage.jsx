import React from 'react';
import MemoryArchitecture from '../components/MemoryArchitecture';
import AIMemorySearch from '../components/AIMemorySearch';
import { Database, Brain, Sparkles, Network, ArrowRight } from 'lucide-react';

export default function MemoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0a1224] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 glow-cyan">
                <Database className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide">
                  City Memory Explorer
                </h1>
                <p className="text-sm text-cyan-300 font-mono mt-0.5">
                  Semantic Vector Storage & Historical State Reconstruction Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-500/40 px-3.5 py-1.5 rounded-xl text-purple-200 text-xs font-mono font-bold">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Vector Index: 2,431 Nodes</span>
          </div>
        </div>
      </div>

      {/* Memory Architecture 3 Tier Visual */}
      <MemoryArchitecture />

      {/* Interactive Semantic Memory Search */}
      <AIMemorySearch />

      {/* Why Long-Term AI Memory Matters Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              Why Long-Term AI City Memory Matters
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3 font-sans">
              Traditional dashboards view sensor readings in isolation, discarding past context or overwhelming databases with billions of raw numbers. CityMind's Cold Memory maintains semantic vector embeddings of city events, enabling the AI to recognize recurring patterns—like how a traffic spike in Zone 04 correlates with rain in Zone 02 or stadium events.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Causality Correlation</span>
                <span className="text-slate-400 text-[11px]">Links weather diffs to traffic delays across zones automatically.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">Pattern Similarity</span>
                <span className="text-slate-400 text-[11px]">87%+ vector matches with historical events from months ago.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Zero Raw Overhead</span>
                <span className="text-slate-400 text-[11px]">Compresses millions of raw data points into 184 semantic summaries.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
