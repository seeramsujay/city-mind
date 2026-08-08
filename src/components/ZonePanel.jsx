import React from 'react';
import { X, GitCommit, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers, ShieldCheck, Flame, Cpu } from 'lucide-react';

export default function ZonePanel({ zone, commits, onClose, onViewCommitDetails }) {
  if (!zone) return null;

  const latestCommitData = commits.find(c => c.id === zone.latestCommit) || commits[0];

  const getSeverityBadge = (status) => {
    switch (status) {
      case 'critical':
        return { bg: 'bg-rose-950/80 text-rose-300 border-rose-500/50', label: 'CRITICAL' };
      case 'warning':
        return { bg: 'bg-amber-950/80 text-amber-300 border-amber-500/50', label: 'WARNING' };
      default:
        return { bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50', label: 'NORMAL' };
    }
  };

  const badge = getSeverityBadge(zone.status);

  // Calculate differences dynamically
  const trafficDiff = zone.metrics.traffic - zone.baseline.traffic;
  const garbageDiff = zone.metrics.garbage - zone.baseline.garbage;
  const rainDiff = zone.metrics.rainfall - zone.baseline.rainfall;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between h-full bg-slate-950/95 shadow-2xl relative">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl text-white">
                {zone.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {zone.name} • <span className="text-slate-300 font-medium">{zone.type}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State vs Baseline */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>Telemetry Metric</span>
            <span>Current vs Baseline</span>
          </div>

          {/* Traffic Metric */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-300 block">Traffic Flow</span>
              <span className="text-[11px] font-mono text-slate-400">Baseline: {zone.baseline.traffic}%</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`font-mono text-sm font-bold ${trafficDiff > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {zone.metrics.traffic}%
                </span>
                {trafficDiff !== 0 && (
                  <span className={`text-xs font-mono font-semibold flex items-center ${trafficDiff > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {trafficDiff > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {trafficDiff > 0 ? `+${trafficDiff}%` : `${trafficDiff}%`}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {trafficDiff > 0 ? 'High Congestion' : 'Nominal'}
              </span>
            </div>
          </div>

          {/* Garbage Fill Level */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-300 block">Garbage Fill Rate</span>
              <span className="text-[11px] font-mono text-slate-400">Baseline: {zone.baseline.garbage}%</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`font-mono text-sm font-bold ${garbageDiff > 15 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {zone.metrics.garbage}%
                </span>
                {garbageDiff !== 0 && (
                  <span className={`text-xs font-mono font-semibold flex items-center ${garbageDiff > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {garbageDiff > 0 ? `+${garbageDiff}%` : `${garbageDiff}%`}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {garbageDiff > 15 ? 'Capacity Warning' : 'Normal Fill'}
              </span>
            </div>
          </div>

          {/* Rainfall Metric */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-300 block">Rainfall Rate</span>
              <span className="text-[11px] font-mono text-slate-400">Baseline: {zone.baseline.rainfall} mm/hr</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`font-mono text-sm font-bold ${rainDiff > 0 ? 'text-blue-400' : 'text-slate-200'}`}>
                  {zone.metrics.rainfall} mm/hr
                </span>
                {rainDiff > 0 && (
                  <span className="text-xs font-mono font-semibold text-blue-400 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{rainDiff} mm
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {rainDiff > 20 ? 'Precipitation Spike' : 'Dry Surface'}
              </span>
            </div>
          </div>

          {/* Air Quality */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-300 block">Air Quality (AQI)</span>
              <span className="text-[11px] font-mono text-slate-400">Baseline: AQI {zone.baseline.aqiValue}</span>
            </div>
            <div className="text-right">
              <span className={`font-mono text-sm font-bold ${zone.metrics.aqiValue > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {zone.metrics.airQuality} (AQI {zone.metrics.aqiValue})
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Optical array active
              </span>
            </div>
          </div>
        </div>

        {/* Latest Commit Details Card */}
        {latestCommitData && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                <GitCommit className="w-4 h-4" />
                <span>LATEST CITY COMMIT: {latestCommitData.id}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{latestCommitData.timestamp}</span>
            </div>
            
            <h4 className="font-heading font-bold text-sm text-slate-100 mb-1">
              {latestCommitData.event}
            </h4>
            
            <p className="text-xs text-slate-300 line-clamp-2 mb-3">
              {latestCommitData.cause}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
              <span className="text-slate-400">Delta: <strong className="text-cyan-300">{latestCommitData.delta}</strong></span>
              <button 
                onClick={() => onViewCommitDetails(latestCommitData)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
              >
                View Full Trace →
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
        {zone.sensorCount} active sensors monitored • Baseline synchronized
      </div>
    </div>
  );
}
