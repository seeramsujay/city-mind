import React from 'react';
import MemoryArchitecture from '../components/MemoryArchitecture';
import AIMemorySearch from '../components/AIMemorySearch';
import { Database, Brain, Sparkles, Network, ArrowRight, ShieldCheck, Cloud, Server, BellRing, Zap } from 'lucide-react';

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
                  CockroachDB Distributed Vector Indexing & AWS Forever Free Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-emerald-200 text-xs font-mono font-bold">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>CockroachDB Vector Index Active</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-500/40 px-3 py-1.5 rounded-xl text-blue-200 text-xs font-mono font-bold">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>AWS DynamoDB 25GB Free Forever</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-200 text-xs font-mono font-bold">
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>AWS SNS 1M/mo Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Architecture 3 Tier Visual */}
      <MemoryArchitecture />

      {/* Interactive Semantic Memory Search */}
      <AIMemorySearch />

      {/* CockroachDB & AWS Forever Free Stack Highlights Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="w-full">
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              CockroachDB Distributed Vector Indexing & AWS Forever Free Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">
              CityMind replaces fragmented vector silos with CockroachDB's native distributed vector indexing (VECTOR INDEX). SHA-256 state diff commits are stored and searched using cosine vector distance metrics, Google Gemini Free Tier synthesizes causal insights, AWS DynamoDB (25GB Free Forever) archives permanent event commits, and AWS SNS (1M Free Forever) dispatches emergency alerts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">CockroachDB Vector Index</span>
                <span className="text-slate-400 text-[11px]">Distributed VECTOR(384) indexing with zero consistency gaps between operational & vector data.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">Amazon DynamoDB (25GB Free)</span>
                <span className="text-slate-400 text-[11px]">25 GB storage & 25 WCU/RCU Free Forever for high-speed commit snapshots.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">Amazon SNS & S3 Archive</span>
                <span className="text-slate-400 text-[11px]">1M emergency push notifications/mo Free Forever with multi-region object archiving.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
