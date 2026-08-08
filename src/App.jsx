import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LiveCityPage from './pages/LiveCityPage';
import CityCommitsPage from './pages/CityCommitsPage';
import MemoryPage from './pages/MemoryPage';
import CitizenReportsPage from './pages/CitizenReportsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import CommitDetailModal from './components/CommitDetailModal';

import { api, mapBackendCommitToFrontend } from './services/api';
import { useWebSocket } from './hooks/useWebSocket';

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
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const [selectedZone, setSelectedZone] = useState(initialZones[3]); // Default Zone 04
  const [selectedCommitModal, setSelectedCommitModal] = useState(null);

  // Initial fetch from backend API
  useEffect(() => {
    async function loadBackendData() {
      const zoneRes = await api.getZones();
      if (zoneRes.online) {
        setIsBackendOnline(true);
        setZones(zoneRes.data);
        if (zoneRes.data.length > 0) {
          setSelectedZone(zoneRes.data[0]);
        }
      }

      const commitRes = await api.getCommits();
      if (commitRes.online) {
        setCommits(commitRes.data);
      }
    }

    loadBackendData();
  }, []);

  // Handle incoming real-time telemetry updates from WebSocket
  const handleTelemetry = useCallback((reading) => {
    if (!reading || !reading.zone_id) return;
    setZones(prevZones => prevZones.map(zone => {
      if (zone.id === reading.zone_id || zone.rawBackendData?.zone_id === reading.zone_id) {
        const metricName = reading.metric_name;
        const value = reading.value;
        const newMetrics = { ...zone.metrics };

        if (metricName === 'traffic_congestion_pct' || metricName === 'traffic_speed_kmh') {
          newMetrics.traffic = Math.round(value);
        } else if (metricName === 'waste_fill_pct') {
          newMetrics.garbage = Math.round(value);
        } else if (metricName === 'water_level_m') {
          newMetrics.rainfall = Math.round(value * 10);
        } else if (metricName === 'aqi') {
          newMetrics.aqiValue = Math.round(value);
          newMetrics.airQuality = value > 100 ? 'Hazardous' : value > 70 ? 'Moderate' : 'Good';
        }

        return {
          ...zone,
          metrics: newMetrics,
          lastUpdated: 'Just now'
        };
      }
      return zone;
    }));
  }, []);

  // Handle incoming city commits from WebSocket
  const handleCityCommit = useCallback((commitData) => {
    if (!commitData) return;
    const formattedCommit = mapBackendCommitToFrontend(commitData, 0);
    setCommits(prev => [formattedCommit, ...prev]);

    // Highlight impacted zone status
    setZones(prev => prev.map(z => {
      if (z.id === formattedCommit.zoneId) {
        return {
          ...z,
          status: formattedCommit.severity === 'critical' ? 'critical' : 'warning',
          latestCommit: formattedCommit.id,
          lastUpdated: 'Just now'
        };
      }
      return z;
    }));
  }, []);

  // Initialize WebSocket connection
  const { isConnected: wsConnected } = useWebSocket(handleTelemetry, handleCityCommit);

  // Dynamic commit creation handler for citizen reports or manual simulation
  const handleCreateCommitFromReport = (report) => {
    const newCommitId = `CM-${1043 + commits.length - 6}`;
    const newCommit = {
      id: newCommitId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: "Just now",
      zoneId: report.zoneId,
      zoneCode: report.zoneName ? `Zone ${report.zoneId.replace(/[^0-9]/g, '')}` : 'Zone 01',
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

    setCommits(prev => [newCommit, ...prev]);
    setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'Commit Created' } : r));
    setZones(prev => prev.map(z => z.id === report.zoneId ? { ...z, status: 'warning', latestCommit: newCommitId } : z));
  };

  const handleSimulateEvent = async () => {
    const simRes = await api.runDigitalTwinSimulation('flash_flood', selectedZone?.id || 'zone-04', 1.5);
    if (simRes.data && simRes.data.recommended_actions) {
      alert(`[Digital Twin Simulator Executed]\nScenario: ${simRes.data.scenario_type}\nZone: ${simRes.data.target_zone_id}\n\nRecommended Agent Actions:\n- ${simRes.data.recommended_actions.join('\n- ')}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        commitCount={commits.length}
        isBackendOnline={isBackendOnline}
        wsConnected={wsConnected}
        onSimulateEvent={handleSimulateEvent}
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
          <div className="flex items-center gap-3 text-slate-400">
            <span>Event-Driven State Diffs</span>
            <span>•</span>
            <span className={wsConnected ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
              {wsConnected ? "WebSocket Stream Connected" : "Mock Telemetry Active"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
