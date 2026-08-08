import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { analyticsData } from '../mockData';
import { BarChart2, PieChart as PieIcon, Activity, HardDrive } from 'lucide-react';

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Chart 1: Traffic Anomaly Event Spike over Baseline */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wider">
              Traffic Anomaly Threshold Breach — Zone 04
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
            Event Delta Triggered
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.trafficEventsOverTime}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" domain={[30, 90]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#06b6d4', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#38bdf8' }}
              />
              <Area type="monotone" dataKey="zone04Traffic" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#trafficGradient)" name="Zone 04 Traffic %" />
              <Area type="monotone" dataKey="baseline" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#baselineGradient)" name="Baseline %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] font-mono text-slate-400 text-center mt-2">
          Notice the flat line baseline until 15:00 spike trigger generated Commit CM-1042.
        </p>
      </div>

      {/* Chart 2: Commits by Category */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-cyan-400" />
            <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wider">
              City Commits by Domain Category
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
            27 Commits Today
          </span>
        </div>

        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.commitsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.commitsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#090d16" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#06b6d4', borderRadius: '12px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] font-mono text-slate-400 text-center mt-2">
          Distribution of event triggers logged into Warm Memory.
        </p>
      </div>

      {/* Chart 3: Events by Severity */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wider">
              Events by Severity Level
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
            Threshold Severity
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.commitsBySeverity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="severity" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#06b6d4', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {analyticsData.commitsBySeverity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Telemetry Storage Comparison */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 bg-slate-950/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wider">
              Database Storage Efficiency (GB)
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
            87% Storage Saved
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.storageComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" width={140} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="gigabytes" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
