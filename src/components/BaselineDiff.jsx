import React from 'react';
import { ArrowRight, GitCommit, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BaselineDiff({ selectedZone }) {
  // Use selected zone or default Zone 04
  const zone = selectedZone || {
    code: 'Zone 04',
    name: 'Metro Expressway',
    metrics: { traffic: 81, garbage: 43, rainfall: 0, airQuality: 'Good' },
    baseline: { traffic: 42, garbage: 43, rainfall: 0, airQuality: 'Good' }
  };

  const metricsList = [
    { 
      key: 'traffic', 
      label: 'Traffic Flow', 
      unit: '%',
      base: zone.baseline.traffic, 
      curr: zone.metrics.traffic, 
      diff: zone.metrics.traffic - zone.baseline.traffic > 0 ? `+${zone.metrics.traffic - zone.baseline.traffic}%` : `${zone.metrics.traffic - zone.baseline.traffic}%`,
      changed: zone.metrics.traffic !== zone.baseline.traffic
    },
    { 
      key: 'garbage', 
      label: 'Garbage Fill', 
      unit: '%',
      base: zone.baseline.garbage, 
      curr: zone.metrics.garbage, 
      diff: zone.metrics.garbage - zone.baseline.garbage > 0 ? `+${zone.metrics.garbage - zone.baseline.garbage}%` : '—',
      changed: zone.metrics.garbage !== zone.baseline.garbage
    },
    { 
      key: 'rainfall', 
      label: 'Rainfall', 
      unit: 'mm/hr',
      base: zone.baseline.rainfall, 
      curr: zone.metrics.rainfall, 
      diff: zone.metrics.rainfall - zone.baseline.rainfall > 0 ? `+${zone.metrics.rainfall - zone.baseline.rainfall} mm/hr` : '—',
      changed: zone.metrics.rainfall !== zone.baseline.rainfall
    },
    { 
      key: 'airQuality', 
      label: 'Air Quality', 
      unit: '',
      base: zone.baseline.airQuality, 
      curr: zone.metrics.airQuality, 
      diff: zone.metrics.airQuality !== zone.baseline.airQuality ? 'Shifted' : '—',
      changed: zone.metrics.airQuality !== zone.baseline.airQuality
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-[#091122] to-slate-950 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <GitCommit className="w-4 h-4" />
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-100 uppercase tracking-wider">
              STATE CHANGE COMPUTATION — {zone.code} ({zone.name})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threshold comparator engine generating delta payloads for City Memory.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>DIFF ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Three Column Table Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Column 1: BASELINE */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. BASELINE STATE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Operating Norm
            </span>
          </div>

          <div className="space-y-3 font-mono text-sm">
            {metricsList.map(m => (
              <div key={m.key} className="flex justify-between items-center py-1 text-slate-400 border-b border-slate-800/50">
                <span className="text-xs">{m.label}</span>
                <span className="font-bold">{m.base} {m.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: CURRENT STATE */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 relative">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. CURRENT STATE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 animate-pulse">
              Live Sensor Stream
            </span>
          </div>

          <div className="space-y-3 font-mono text-sm">
            {metricsList.map(m => (
              <div 
                key={m.key} 
                className={`flex justify-between items-center py-1 border-b border-slate-800/50 ${
                  m.changed 
                    ? 'text-cyan-300 font-bold bg-cyan-950/40 px-2 rounded -mx-2' 
                    : 'text-slate-400'
                }`}
              >
                <span className="text-xs">{m.label}</span>
                <span className={m.changed ? 'text-cyan-300 font-extrabold text-base' : ''}>
                  {m.curr} {m.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: DELTA / DIFF */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 relative glow-cyan">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-cyan-500/30">
            <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
              3. DELTA (STATE DIFF)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
              Commit Triggered
            </span>
          </div>

          <div className="space-y-3 font-mono text-sm">
            {metricsList.map(m => (
              <div 
                key={m.key} 
                className={`flex justify-between items-center py-1 border-b border-cyan-500/20 ${
                  m.changed 
                    ? 'text-rose-400 font-extrabold text-base bg-rose-950/40 px-2 rounded -mx-2' 
                    : 'text-slate-600 opacity-60'
                }`}
              >
                <span className="text-xs">{m.label}</span>
                <span>{m.diff}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Prominent Explanation Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-200">
        <div className="p-2 rounded-lg bg-cyan-900/60 text-cyan-300 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="font-medium leading-relaxed">
          <strong className="text-white underline decoration-cyan-400">Core Principle:</strong> "CityMind stores meaningful changes instead of continuously storing unchanged values."
        </p>
      </div>
    </div>
  );
}
