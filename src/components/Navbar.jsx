import React, { useState, useEffect } from 'react';
import { Cpu, Activity, ShieldCheck, Database, Layers, Users, Brain, Zap } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, commitCount, isBackendOnline, wsConnected, onSimulateEvent }) {
  const [seconds, setSeconds] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev >= 59 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'live-city', label: 'Live City', icon: Activity },
    { id: 'commits', label: 'City Commits', icon: Layers, badge: commitCount },
    { id: 'memory', label: 'Memory', icon: Database },
    { id: 'citizen-reports', label: 'Citizen Reports', icon: Users },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#060a12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('live-city')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 glow-cyan">
            <Brain className="w-6 h-6 animate-pulse" />
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                CITYMIND
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold tracking-wider">
                OS v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Remembering What Changed in the City
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold ${
                    isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wsConnected ? 'bg-emerald-400' : isBackendOnline ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${wsConnected ? 'bg-emerald-500' : isBackendOnline ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className={wsConnected ? "text-emerald-400 font-semibold" : isBackendOnline ? "text-cyan-400 font-semibold" : "text-amber-400 font-semibold"}>
              {wsConnected ? 'Live WS Engine' : isBackendOnline ? 'Backend REST' : 'Offline Mock'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Heartbeat: <strong className="text-slate-200">{seconds}s</strong></span>
          </div>

          <button 
            onClick={onSimulateEvent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Event</span>
          </button>
        </div>
      </div>
    </header>
  );
}
