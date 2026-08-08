import React from 'react';
import { Flame, Database, Snowflake, ArrowRight, Brain, Radio, Layers, Sparkles } from 'lucide-react';
import { memoryStats } from '../mockData';

export default function MemoryArchitecture() {
  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6 border border-cyan-500/20 mb-6 bg-gradient-to-br from-slate-950 via-[#0a1122] to-slate-950">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-100 uppercase tracking-wider">
                CityMind Memory Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Multi-tier memory system designed for zero redundancy and semantic AI reasoning
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Semantic Compression Ratio: 98.4%</span>
        </div>
      </div>

      {/* Visual Pipeline Flow Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-center gap-2 lg:gap-4 text-xs font-mono text-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 text-slate-400 border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>LIVE SENSORS</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>HOT MEMORY</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-500/30">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>WARM MEMORY</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-500/30">
          <Snowflake className="w-3.5 h-3.5 text-blue-400" />
          <span>COLD MEMORY</span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-500/40 glow-cyan">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>AI REASONING</span>
        </div>
      </div>

      {/* 3 Connected Memory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: HOT MEMORY */}
        <div className="glass-panel-interactive rounded-xl p-5 border border-rose-500/30 bg-slate-950/80 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/40">
                  <Flame className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-white">
                    🔥 HOT MEMORY
                  </h4>
                  <span className="text-xs text-rose-300 font-mono">
                    "{memoryStats.hotMemory.subtitle}"
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {memoryStats.hotMemory.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 font-mono">
              Timeframe: <strong className="text-slate-200">{memoryStats.hotMemory.timeframe}</strong>
            </p>

            <ul className="space-y-2 text-xs text-slate-300 font-sans mb-4">
              {memoryStats.hotMemory.contents.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Buffer: 4,120 raw/min</span>
            <span className="text-rose-400 font-semibold">120 mins max</span>
          </div>
        </div>

        {/* CARD 2: WARM MEMORY */}
        <div className="glass-panel-interactive rounded-xl p-5 border border-amber-500/30 bg-slate-950/80 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/40">
                  <Layers className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-white">
                    🟡 WARM MEMORY
                  </h4>
                  <span className="text-xs text-amber-300 font-mono">
                    "{memoryStats.warmMemory.subtitle}"
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {memoryStats.warmMemory.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 font-mono">
              Timeframe: <strong className="text-slate-200">{memoryStats.warmMemory.timeframe}</strong>
            </p>

            <ul className="space-y-2 text-xs text-slate-300 font-sans mb-4">
              {memoryStats.warmMemory.contents.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-amber-300 font-bold">27 commits today</span>
            <span>1,420 total</span>
          </div>
        </div>

        {/* CARD 3: COLD MEMORY */}
        <div className="glass-panel-interactive rounded-xl p-5 border border-blue-500/30 bg-slate-950/80 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-500/40">
                  <Snowflake className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h4 className="font-heading font-extrabold text-base text-white">
                    ❄️ COLD MEMORY
                  </h4>
                  <span className="text-xs text-blue-300 font-mono">
                    "{memoryStats.coldMemory.subtitle}"
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {memoryStats.coldMemory.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 font-mono">
              Timeframe: <strong className="text-slate-200">{memoryStats.coldMemory.timeframe}</strong>
            </p>

            <ul className="space-y-2 text-xs text-slate-300 font-sans mb-4">
              {memoryStats.coldMemory.contents.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="text-purple-300 font-semibold">184 AI Summaries</span>
            <span>2,431 Vector Nodes</span>
          </div>
        </div>

      </div>

      {/* Bottom Description */}
      <p className="text-center text-xs font-mono text-cyan-300 mt-5 pt-3 border-t border-slate-800/80">
        "CityMind compresses city history into meaningful events and semantic memory."
      </p>
    </div>
  );
}
