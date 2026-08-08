import React from 'react';
import CitizenReportCard from '../components/CitizenReportCard';
import { Users, GitCommit, ArrowRight, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CitizenReportsPage({ reports, onCreateCommit }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0a1428] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 glow-cyan">
                <Users className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide">
                  Citizen Incident Reports
                </h1>
                <p className="text-sm text-cyan-300 font-mono mt-0.5">
                  Community-driven anomaly detection & automated commit creation pipeline
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
              Active Reports: <strong className="text-cyan-400 font-bold">{reports.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Workflow Pipeline Explanation Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 bg-slate-950/80">
        <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          Automated Citizen-to-Commit Workflow Pipeline
        </h4>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-center pt-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-700">
            Citizen Report
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <div className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-500/40">
            AI Classification (Vision & NLP)
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <div className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-200 border border-amber-500/40">
            Anomaly / Event
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold glow-cyan">
            City Commit → Warm Memory
          </div>
        </div>
      </div>

      {/* Grid of Citizen Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <CitizenReportCard 
            key={report.id} 
            report={report} 
            onCreateCommit={onCreateCommit} 
          />
        ))}
      </div>
    </div>
  );
}
