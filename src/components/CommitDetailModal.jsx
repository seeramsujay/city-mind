import React from 'react';
import { X, GitCommit, AlertTriangle, ShieldCheck, Brain, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CommitDetailModal({ commit, onClose }) {
  if (!commit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel rounded-2xl border border-cyan-500/40 bg-slate-950 w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-[#0a1428] to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 glow-cyan font-mono font-bold text-sm">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-cyan-400">
                  {commit.id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {commit.timestamp} • {commit.date}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-500/40">
                  {commit.severity}
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-white mt-0.5">
                {commit.event} — {commit.zoneCode} ({commit.zoneName})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Baseline vs Current State vs Diff Breakdown */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-3">
              State Diff Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block mb-1">BASELINE STATE</span>
                <span className="text-sm font-bold text-slate-300">{commit.previousValue}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block mb-1">CURRENT STATE</span>
                <span className="text-sm font-bold text-cyan-300">{commit.newValue}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200">
                <span className="text-cyan-400 block mb-1 font-semibold">STATE DIFF / DELTA</span>
                <span className="text-sm font-extrabold text-rose-400">{commit.delta}</span>
              </div>
            </div>
          </div>

          {/* Trigger Source & Root Cause */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                TRIGGER SOURCE
              </span>
              <p className="text-sm font-semibold text-slate-200">
                {commit.trigger}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                COMMITTED CATEGORY
              </span>
              <p className="text-sm font-semibold text-cyan-300">
                {commit.category}
              </p>
            </div>
          </div>

          {/* Root Cause */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              IDENTIFIED CAUSE
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {commit.cause}
            </p>
          </div>

          {/* Evidence Logs */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              VERIFIED SENSOR & TELEMETRY EVIDENCE
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              {commit.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Analysis */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
            <h4 className="text-xs font-mono font-bold uppercase text-purple-300 tracking-wider mb-2 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              AI VECTOR MEMORY REASONING
            </h4>
            <p className="text-sm text-purple-100 leading-relaxed font-sans">
              {commit.aiAnalysis}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
            <h4 className="text-xs font-mono font-bold uppercase text-emerald-300 tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              RECOMMENDED CITY ACTION
            </h4>
            <p className="text-sm text-emerald-100 font-medium">
              {commit.recommendedAction}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Commit Trace Hash: <code className="text-cyan-400">0x8f...4a2b</code>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Close Trace
            </button>
            <button
              onClick={() => {
                alert(`Triggered action response for ${commit.id}`);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg glow-cyan flex items-center gap-1.5"
            >
              <span>Dispatch City Action</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
