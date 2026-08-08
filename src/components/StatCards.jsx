import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, Layers, HardDrive } from 'lucide-react';

export default function StatCards({ zones, commitCount }) {
  const normalCount = zones.filter(z => z.status === 'normal').length;
  const warningCount = zones.filter(z => z.status === 'warning').length;
  const criticalCount = zones.filter(z => z.status === 'critical').length;

  const stats = [
    {
      title: "NORMAL ZONES",
      value: normalCount,
      sub: "Operating at Baseline",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      glow: "glow-emerald",
      badge: "Stable"
    },
    {
      title: "WARNING ZONES",
      value: warningCount,
      sub: "Threshold Approached",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
      glow: "glow-amber",
      badge: "Elevated"
    },
    {
      title: "CRITICAL ZONES",
      value: criticalCount,
      sub: "Commit Generated",
      icon: Flame,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      glow: "glow-rose",
      badge: "Immediate Action"
    },
    {
      title: "EVENTS TODAY",
      value: commitCount || 27,
      sub: "State Diffs Logged",
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      glow: "glow-cyan",
      badge: "Warm Memory"
    },
    {
      title: "TELEMETRY REDUCTION",
      value: "87%",
      sub: "Storage Overhead Saved",
      icon: HardDrive,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
      glow: "glow-cyan",
      badge: "Demo / simulated metric",
      isHighlighted: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`glass-panel-interactive rounded-2xl p-4 flex flex-col justify-between border relative overflow-hidden ${stat.bg}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`font-heading text-3xl font-extrabold tracking-tight ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-400 font-medium">{stat.sub}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                stat.isHighlighted 
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 animate-pulse'
                  : 'bg-slate-900/80 text-slate-300'
              }`}>
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
