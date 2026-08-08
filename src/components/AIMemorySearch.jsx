import React, { useState } from 'react';
import { Search, Brain, Sparkles, Database, GitCommit, ArrowRight, CheckCircle2 } from 'lucide-react';
import { vectorSearchResults } from '../mockData';

export default function AIMemorySearch() {
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState(vectorSearchResults[0]);
  const [isSearching, setIsSearching] = useState(false);

  const sampleQuestions = [
    "Why is traffic increasing in Zone 04?",
    "Has this happened before?",
    "What areas have recurring garbage problems?",
    "What caused the previous traffic spike?"
  ];

  const handleSearch = (q) => {
    setQuery(q);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Pick matching or default result
      if (q.toLowerCase().includes('garbage')) {
        setActiveResult({
          query: q,
          matchedEvents: [
            {
              id: "HIST-309",
              title: "Sector 7 Market Overflow",
              zone: "Zone 07",
              timeAgo: "7 days ago",
              similarity: 91,
              diff: "Garbage 71% → 94% (+23%)",
              aiSummary: "Zone 07 experiences recurring garbage saturation during weekend market pop-ups due to bi-weekly collection limits."
            }
          ]
        });
      } else {
        setActiveResult(vectorSearchResults[0]);
      }
    }, 600);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 lg:p-6 border border-cyan-500/30 bg-slate-950/90 mb-6">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40">
          <Search className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider">
            AI Semantic Memory Explorer
          </h3>
          <p className="text-xs text-slate-400">
            Query long-term Cold Memory vectors and City Commit histories using natural language.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Ask CityMind about the city... (e.g. 'Why is traffic increasing in Zone 04?')"
          className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-3 pl-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-mono shadow-inner"
        />
        <Brain className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <button
          onClick={() => handleSearch(query || sampleQuestions[0])}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow glow-cyan flex items-center gap-1"
        >
          {isSearching ? 'Vector Searching...' : 'Query Memory'}
        </button>
      </div>

      {/* Sample Question Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-mono">
        <span className="text-slate-400">Try asking:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSearch(q)}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-all hover:border-cyan-500/40 text-left"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Results Display */}
      {activeResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Database className="w-4 h-4 text-cyan-400" />
              Found {activeResult.matchedEvents.length} similar historical events in Cold Memory:
            </span>
            <span className="text-purple-300 font-bold">FAISS Vector Index • Cosine Distance</span>
          </div>

          <div className="space-y-3">
            {activeResult.matchedEvents.map((evt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                      {evt.id}
                    </span>
                    <span className="text-slate-200 font-extrabold text-sm">{evt.title}</span>
                    <span className="text-slate-500">• {evt.zone} ({evt.timeAgo})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-200 border border-purple-500/40 font-bold">
                    Similarity: {evt.similarity}%
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 text-slate-300 font-sans text-xs mb-2 border border-slate-800">
                  <strong className="text-cyan-400 font-mono">AI SUMMARY: </strong>
                  "{evt.aiSummary}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>State Diff Payload: <strong className="text-rose-400">{evt.diff}</strong></span>
                  <span className="text-cyan-400 cursor-pointer hover:underline">Inspect Commit Raw Diff →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
