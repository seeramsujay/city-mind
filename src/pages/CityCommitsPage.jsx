import React, { useState } from 'react';
import { GitCommit, Filter, Search, ArrowRight, ExternalLink, Clock, Layers, ShieldCheck, Flame } from 'lucide-react';

export default function CityCommitsPage({ commits, onSelectCommit }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Traffic', 'Weather', 'Garbage', 'Infrastructure', 'Citizen Reports', 'Critical'];

  const filteredCommits = commits.filter(commit => {
    const matchesCategory = filterCategory === 'All' 
      ? true 
      : filterCategory === 'Critical' 
        ? commit.severity.toLowerCase() === 'critical'
        : commit.category.toLowerCase() === filterCategory.toLowerCase();

    const matchesSearch = searchQuery === '' || 
      commit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getSeverityBadge = (sev) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-rose-950/90 text-rose-300 border-rose-500/50';
      case 'warning':
        return 'bg-amber-950/90 text-amber-300 border-amber-500/50';
      case 'high':
        return 'bg-blue-950/90 text-blue-300 border-blue-500/50';
      default:
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#0b1326] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 glow-cyan">
                <GitCommit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide">
                  City Commits
                </h1>
                <p className="text-sm text-cyan-300 font-mono mt-0.5">
                  "Every meaningful change becomes a traceable event."
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
              Total Warm Commits: <strong className="text-cyan-400 font-bold">{commits.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-cyan-500/20">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commits by ID, zone, event..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Commits Table View */}
      <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Commit ID</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Zone</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Baseline</th>
                <th className="py-3.5 px-4">Current</th>
                <th className="py-3.5 px-4">Delta</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCommits.map((commit) => (
                <tr
                  key={commit.id}
                  onClick={() => onSelectCommit(commit)}
                  className="hover:bg-slate-900/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-cyan-300">
                    {commit.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {commit.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-semibold">
                    {commit.zoneCode}
                  </td>
                  <td className="py-3.5 px-4 text-white font-heading font-semibold">
                    {commit.event}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {commit.previousValue}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-bold">
                    {commit.newValue}
                  </td>
                  <td className={`py-3.5 px-4 font-extrabold ${commit.delta.startsWith('+') ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {commit.delta}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getSeverityBadge(commit.severity)}`}>
                      {commit.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCommit(commit);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1"
                    >
                      <span>Trace</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
