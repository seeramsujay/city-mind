import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LiveCityPage from './pages/LiveCityPage';
import CityCommitsPage from './pages/CityCommitsPage';
import MemoryPage from './pages/MemoryPage';
import CitizenReportsPage from './pages/CitizenReportsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import CommitDetailModal from './components/CommitDetailModal';

import { 
  initialZones, 
  initialCommits, 
  initialCitizenReports 
} from './mockData';

export default function App() {
  const [activePage, setActivePage] = useState('live-city');
  const [zones, setZones] = useState(initialZones);
  const [commits, setCommits] = useState(initialCommits);
  const [reports, setReports] = useState(initialCitizenReports);
  
  const [selectedZone, setSelectedZone] = useState(initialZones[3]); // Default Zone 04
  const [selectedCommitModal, setSelectedCommitModal] = useState(null);

  // Dynamic commit creation handler for citizen reports or simulations
  const handleCreateCommitFromReport = (report) => {
    const newCommitId = `CM-${1043 + commits.length - 6}`;
    const newCommit = {
      id: newCommitId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: "Just now",
      zoneId: report.zoneId,
      zoneCode: report.zoneName.split(' ')[0] ? `Zone 0${report.zoneId.split('-')[1]}` : report.zoneName,
      zoneName: report.zoneName,
      category: report.aiClassification,
      event: `Verified ${report.category}`,
      previousValue: "Baseline Nominal",
      newValue: `Severity ${report.severity}`,
      delta: "+1 Anomaly Event",
      severity: report.severity.toLowerCase(),
      status: "Active",
      trigger: `Citizen Report #${report.id}`,
      cause: report.description,
      evidence: [
        `Geotagged citizen evidence photo submission #${report.id}`,
        `AI Classification Engine verified with ${report.confidence}% confidence.`,
        `Community upvotes: ${report.upvotes}`
      ],
      aiAnalysis: `Citizen incident matched with high structural priority index in Warm Memory. Scheduled for rapid dispatch.`,
      recommendedAction: `Dispatch repair unit to ${report.location}.`
    };

    // Prepend to commits
    setCommits(prev => [newCommit, ...prev]);

    // Update report status
    setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'Commit Created' } : r));

    // Update zone status if needed
    setZones(prev => prev.map(z => z.id === report.zoneId ? { ...z, status: 'warning', latestCommit: newCommitId } : z));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        commitCount={commits.length} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activePage === 'live-city' && (
          <LiveCityPage 
            zones={zones}
            commits={commits}
            selectedZone={selectedZone}
            onSelectZone={(zone) => setSelectedZone(zone)}
            onCloseZonePanel={() => setSelectedZone(null)}
            onSelectCommit={(commit) => setSelectedCommitModal(commit)}
          />
        )}

        {activePage === 'commits' && (
          <CityCommitsPage 
            commits={commits}
            onSelectCommit={(commit) => setSelectedCommitModal(commit)}
          />
        )}

        {activePage === 'memory' && (
          <MemoryPage />
        )}

        {activePage === 'citizen-reports' && (
          <CitizenReportsPage 
            reports={reports}
            onCreateCommit={handleCreateCommitFromReport}
          />
        )}

        {activePage === 'ai-insights' && (
          <AIInsightsPage />
        )}
      </main>

      {/* Commit Detail Modal Popup */}
      {selectedCommitModal && (
        <CommitDetailModal 
          commit={selectedCommitModal} 
          onClose={() => setSelectedCommitModal(null)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 lg:px-8 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">CITYMIND</span>
            <span>— Smart City Memory & Decision Support Platform</span>
          </div>
          <div className="text-slate-400">
            Event-Driven State Diffs • Zero Continuous Telemetry Redundancy
          </div>
        </div>
      </footer>
    </div>
  );
}
