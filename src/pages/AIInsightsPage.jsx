import React from 'react';
import AIInsightCard from '../components/AIInsightCard';
import AIMemorySearch from '../components/AIMemorySearch';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Brain, Sparkles, Activity, Layers, Database } from 'lucide-react';
import { aiInsights } from '../mockData';

export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-r from-slate-950 via-[#120a26] to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 glow-cyan">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide">
                  CITYMIND AI
                </h1>
                <p className="text-sm text-purple-300 font-mono mt-0.5">
                  "Reasoning over city memory"
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 font-mono text-xs text-purple-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Multi-Model Causality Agent Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Memory Natural Language Search */}
      <AIMemorySearch />

      {/* AI Reasoning Insights Section */}
      <div>
        <h3 className="font-heading font-bold text-lg text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <Brain className="w-5 h-5 text-purple-400" />
          Active AI Operations Insights & Action Dispatch
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Analytics Recharts Visualizations */}
      <div>
        <h3 className="font-heading font-bold text-lg text-slate-100 mb-4 flex items-center gap-2 uppercase tracking-wider">
          <Activity className="w-5 h-5 text-cyan-400" />
          Event & Memory Analytics Dashboard
        </h3>

        <AnalyticsCharts />
      </div>
    </div>
  );
}
