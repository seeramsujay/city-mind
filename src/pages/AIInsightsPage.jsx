import React, { useState, useEffect } from 'react';
import AIInsightCard from '../components/AIInsightCard';
import AIMemorySearch from '../components/AIMemorySearch';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Brain, Sparkles, Activity, Layers, Database, Send, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../services/api';
import { aiInsights as initialAiInsights } from '../mockData';

export default function AIInsightsPage() {
  const [chatPrompt, setChatPrompt] = useState('');
  const [chatResponse, setChatResponse] = useState(null);
  const [isChatting, setIsChatting] = useState(false);
  const [agentStatus, setAgentStatus] = useState(null);
  const [insights, setInsights] = useState(initialAiInsights);

  useEffect(() => {
    async function loadAgentAndAlerts() {
      const agentRes = await api.getAgentStatus();
      if (agentRes.data) {
        setAgentStatus(agentRes.data);
      }

      const alertRes = await api.getPredictiveAlerts();
      if (alertRes.online && alertRes.data) {
        // If backend returned alerts array
        setInsights(alertRes.data);
      }
    }
    loadAgentAndAlerts();
  }, []);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;

    setIsChatting(true);
    const res = await api.chatAI(chatPrompt);
    setIsChatting(false);
    if (res.data) {
      setChatResponse(res.data);
    }
  };

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
                  CITYMIND AI REASONING
                </h1>
                <p className="text-sm text-purple-300 font-mono mt-0.5">
                  Vector RAG & Causal Knowledge Graph Memory System
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 font-mono text-xs text-purple-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Multi-Agent Mesh: {agentStatus?.total_agents || 5} Active Agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Chat & RAG Reasoning Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-slate-950/90">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/40">
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider">
              Live AI RAG Chat Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Query CityMind's RAG Engine to analyze causality, zone status, and cross-domain events.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendChat} className="flex gap-3 mb-4">
          <input
            type="text"
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
            placeholder="Ask CityMind (e.g., 'What is the flood risk in North Riverside under heavy rain?')"
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none"
          />
          <button
            type="submit"
            disabled={isChatting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isChatting ? 'Reasoning...' : 'Ask AI'}</span>
          </button>
        </form>

        {chatResponse && (
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-bold border-b border-purple-500/20 pb-2">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                RAG REASONING RESPONSE
              </span>
              <span>Confidence: {Math.round((chatResponse.confidence || 0.95) * 100)}%</span>
            </div>
            <p className="text-slate-200 text-sm font-sans leading-relaxed pt-1">
              {chatResponse.response}
            </p>
            {chatResponse.causal_nodes && chatResponse.causal_nodes.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-slate-400">Causal Graph Nodes:</span>
                {chatResponse.causal_nodes.map((node, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                    {node}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
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
          {insights.map((insight, idx) => (
            <AIInsightCard key={insight.id || idx} insight={insight} />
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
