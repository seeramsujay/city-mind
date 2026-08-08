import React, { useState } from 'react';
import { Users, AlertTriangle, CheckCircle2, GitCommit, ArrowRight, Brain, Eye, Sparkles, MapPin, Clock } from 'lucide-react';

export default function CitizenReportCard({ report, onCreateCommit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverted, setIsConverted] = useState(report.status === 'Commit Created');

  const handleCreateCommit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConverted(true);
      if (onCreateCommit) {
        onCreateCommit(report);
      }
    }, 1500);
  };

  const getSeverityBadge = (sev) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-rose-950/90 text-rose-300 border-rose-500/50';
      case 'high':
        return 'bg-amber-950/90 text-amber-300 border-amber-500/50';
      case 'medium':
        return 'bg-blue-950/90 text-blue-300 border-blue-500/50';
      default:
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50';
    }
  };

  return (
    <>
      <div className="glass-panel-interactive rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/80 flex flex-col justify-between h-full">
        <div>
          {/* Card Top Info */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400">
                REPORT #{report.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(report.severity)}`}>
                {report.severity}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {report.timestamp}
            </span>
          </div>

          {/* Title & Category */}
          <h4 className="font-heading font-extrabold text-base text-slate-100 mb-1">
            {report.title}
          </h4>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{report.zoneName} — <strong className="text-slate-300">{report.location}</strong></span>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 mb-4">
            {report.description}
          </p>

          {/* AI Classification & Confidence */}
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 mb-4">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                AI Classification:
              </span>
              <span className="text-purple-200 font-bold">{report.aiClassification}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Confidence Score:</span>
              <span className="text-emerald-400 font-bold">{report.confidence}% Match</span>
            </div>
          </div>
        </div>

        {/* Buttons & Status */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium flex items-center gap-1 border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Evidence</span>
          </button>

          {isConverted ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Commit Active</span>
            </span>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono glow-cyan flex items-center gap-1 transition-all"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Create Commit</span>
            </button>
          )}
        </div>
      </div>

      {/* Citizen Report Detail & "Create Commit" Workflow Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel rounded-2xl border border-cyan-500/40 bg-slate-950 w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            
            <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-lg text-white">
                  Citizen Incident — {report.id}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image Preview if available */}
              {report.image && (
                <div className="relative rounded-xl overflow-hidden h-48 border border-slate-800">
                  <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-slate-950/80 px-2.5 py-1 rounded text-xs font-mono text-cyan-300 border border-slate-700">
                    Geotagged Photo Evidence
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-heading font-bold text-lg text-slate-100 mb-1">
                  {report.title}
                </h4>
                <p className="text-xs text-slate-300">
                  {report.description}
                </p>
              </div>

              {/* Conversion Pipeline Flow Display */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Automated City Commit Pipeline Step:
                </h5>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-center">
                  <div className="p-2 rounded bg-slate-950 text-slate-300 border border-slate-800 flex-1">
                    Citizen Report
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="p-2 rounded bg-purple-950 text-purple-300 border border-purple-500/40 flex-1">
                    AI Classification ({report.confidence}%)
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="p-2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 flex-1">
                    Anomaly Event
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <div className="p-2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex-1 font-bold">
                    City Commit → Warm Memory
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Close
              </button>

              {!isConverted ? (
                <button
                  onClick={handleCreateCommit}
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-lg glow-cyan flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Generating State Diff...</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="w-4 h-4" />
                      <span>Confirm & Commit to Memory</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Commit Created & Saved in Warm Memory</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
