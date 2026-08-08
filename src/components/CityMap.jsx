import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Activity, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export default function CityMap({ zones, selectedZone, onSelectZone }) {
  const [hoveredZone, setHoveredZone] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-rose-500',
          border: 'border-rose-500',
          text: 'text-rose-400',
          fill: 'rgba(244, 63, 94, 0.15)',
          stroke: '#f43f5e',
          glow: 'glow-rose'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-500',
          text: 'text-amber-400',
          fill: 'rgba(245, 158, 11, 0.15)',
          stroke: '#f59e0b',
          glow: 'glow-amber'
        };
      default:
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-500',
          text: 'text-emerald-400',
          fill: 'rgba(16, 185, 129, 0.12)',
          stroke: '#10b981',
          glow: 'glow-emerald'
        };
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-6 border border-cyan-500/20 relative overflow-hidden flex flex-col h-full min-h-[480px]">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80 z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Compass className="w-5 h-5 animate-radar" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              City Digital Twin — Real-time Zone Mesh
            </h3>
            <p className="text-xs text-slate-400">
              Select a zone to inspect state diffs, baseline thresholds, and commit logs.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Normal (5)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Warning (3)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/40 border border-rose-500/30 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Critical (2)</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Cyber City Canvas */}
      <div className="relative flex-1 w-full bg-[#040711] rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center min-h-[380px]">
        {/* Cyberpunk Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 70%), linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 32px 32px, 32px 32px'
          }}
        />

        {/* Radar Sweep Animation Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-cyan-500/10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-cyan-500/40 to-transparent origin-left animate-radar" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-cyan-500/5 pointer-events-none" />

        {/* Main Interactive SVG Map Layer */}
        <svg className="w-full h-full absolute inset-0 z-0 overflow-visible" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          {/* Cyber City Arterial Highways / Roads */}
          <path d="M 180 120 L 480 210 L 780 160 L 850 270 L 520 350 L 780 430 L 580 490 L 200 400 Z" fill="none" stroke="#1e293b" strokeWidth="6" strokeDasharray="4 4" />
          <path d="M 480 210 L 520 350 M 350 290 L 780 430 M 280 130 L 200 400" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.3" />

          {/* SVG Zone Node Polygons & Connections */}
          {zones.map((zone) => {
            const colors = getStatusColor(zone.status);
            const isSelected = selectedZone?.id === zone.id;
            const isHovered = hoveredZone?.id === zone.id;
            
            // Map percentage to SVG viewBox 1000x600 coordinates
            const cx = (zone.x / 100) * 1000;
            const cy = (zone.y / 100) * 600;

            return (
              <g 
                key={zone.id}
                onClick={() => onSelectZone(zone)}
                onMouseEnter={() => setHoveredZone(zone)}
                onMouseLeave={() => setHoveredZone(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Zone Area Polygon / Hex Node */}
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isSelected ? "48" : isHovered ? "42" : "36"} 
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  className="transition-all duration-300"
                />

                {/* Pulse Ring for Critical / Warning */}
                {(zone.status === 'critical' || zone.status === 'warning') && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "64" : "48"}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="1.5"
                    opacity="0.4"
                    className="animate-ping"
                    style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: zone.status === 'critical' ? '1.5s' : '3s' }}
                  />
                )}

                {/* Central Point */}
                <circle cx={cx} cy={cy} r="4" fill={colors.stroke} />

                {/* Zone Code Label */}
                <text 
                  x={cx} 
                  y={cy - 12} 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="12" 
                  fontWeight="bold" 
                  fontFamily="Outfit, sans-serif"
                >
                  {zone.code}
                </text>

                {/* Status Indicator text on map */}
                <text 
                  x={cx} 
                  y={cy + 16} 
                  textAnchor="middle" 
                  fill={colors.stroke} 
                  fontSize="10" 
                  fontWeight="600" 
                  fontFamily="JetBrains Mono, monospace"
                >
                  {zone.status.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Floating Micro Labels over SVG */}
        {zones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          const colors = getStatusColor(zone.status);
          
          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 z-10 ${
                isSelected ? 'scale-110' : 'scale-100'
              }`}
            >
              {/* Key Delta Badge preview if anomalous */}
              {zone.status === 'critical' && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-950/90 border border-rose-500/60 text-rose-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>
                    {zone.id === 'zone-04' ? 'Traffic +39%' : 'AQI +86'}
                  </span>
                </div>
              )}

              {zone.status === 'warning' && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-950/90 border border-amber-500/60 text-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>
                    {zone.id === 'zone-02' ? 'Rain 38mm' : zone.id === 'zone-07' ? 'Garbage 92%' : 'Pothole'}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Quick Helper overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-slate-400 text-xs font-mono flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Click any zone to inspect baseline diffs</span>
        </div>
      </div>
    </div>
  );
}
