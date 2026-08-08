// CityMind API Client Service
// Provides clean REST API connection with automatic fallback to mock data if offline.

import { 
  initialZones, 
  initialCommits, 
  aiInsights, 
  vectorSearchResults, 
  analyticsData 
} from '../mockData';

const API_BASE = '/api/v1';

/**
 * Maps a backend ZoneMetrics object into the UI zone structure used by frontend components.
 */
export function mapBackendZoneToFrontend(z, index = 0) {
  // Pre-calculated coordinates for SVG map positioning if not provided
  const coordsMap = {
    'zone-downtown': { x: 48, y: 35, type: 'Commercial', code: 'Zone 01', name: 'Central Business District' },
    'zone-north': { x: 28, y: 22, type: 'Residential / Basin', code: 'Zone 02', name: 'North Riverside' },
    'zone-east': { x: 72, y: 28, type: 'High-Tech District', code: 'Zone 03', name: 'Tech Hub East' },
    'zone-expressway': { x: 52, y: 58, type: 'Transit Corridor', code: 'Zone 04', name: 'Metro Expressway' },
    'zone-west': { x: 20, y: 68, type: 'Residential Suburb', code: 'Zone 07', name: 'Residential West' },
  };

  const info = coordsMap[z.zone_id] || {
    x: 30 + (index * 15) % 60,
    y: 25 + (index * 12) % 60,
    type: 'Smart District',
    code: `Zone 0${index + 1}`,
    name: z.zone_name || z.zone_id
  };

  return {
    id: z.zone_id,
    code: info.code,
    name: info.name,
    status: (z.status || 'optimal').toLowerCase() === 'optimal' ? 'normal' : (z.status || 'normal').toLowerCase(),
    x: info.x,
    y: info.y,
    type: info.type,
    sensorCount: 120 + index * 25,
    metrics: {
      traffic: Math.round(z.traffic_congestion_pct ?? 45),
      garbage: Math.round(z.waste_fill_pct ?? 38),
      rainfall: Math.round(z.water_level_m ? z.water_level_m * 10 : 0),
      airQuality: z.aqi > 100 ? 'Hazardous' : z.aqi > 70 ? 'Moderate' : 'Good',
      aqiValue: Math.round(z.aqi ?? 42),
      infrastructureScore: Math.round(100 - (z.active_incidents * 5)),
    },
    baseline: {
      traffic: 42,
      garbage: 40,
      rainfall: 0,
      airQuality: 'Good',
      aqiValue: 45,
      infrastructureScore: 98,
    },
    latestCommit: `CM-${1040 + index}`,
    lastUpdated: 'Live',
    rawBackendData: z
  };
}

/**
 * Maps a backend CityCommit object to frontend UI format.
 */
export function mapBackendCommitToFrontend(c, index = 0) {
  const diffSummary = c.diffs && c.diffs.length > 0 
    ? `${c.diffs[0].metric}: ${c.diffs[0].previous_value} → ${c.diffs[0].current_value}`
    : 'State Diff';

  const severityMap = {
    'threshold_crossing': 'critical',
    'anomaly_detected': 'warning',
    'citizen_report': 'high',
    'agent_observation': 'warning',
    'manual_override': 'normal',
    'heartbeat': 'normal'
  };

  return {
    id: c.commit_hash ? c.commit_hash.substring(0, 10).toUpperCase() : `CM-${1042 - index}`,
    commit_hash: c.commit_hash,
    parent_hash: c.parent_hash,
    timestamp: c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now',
    date: c.timestamp ? new Date(c.timestamp).toLocaleDateString() : 'Today',
    zoneId: c.zone_id || 'zone-04',
    zoneCode: c.zone_id ? `Zone ${c.zone_id.replace(/[^0-9]/g, '') || '04'}` : 'Zone 04',
    zoneName: c.zone_id ? c.zone_id.replace('zone-', '').toUpperCase() : 'Metro Expressway',
    category: (c.domain || 'traffic').charAt(0).toUpperCase() + (c.domain || 'traffic').slice(1),
    event: c.trigger ? c.trigger.replace('_', ' ').toUpperCase() : 'STATE COMMIT',
    previousValue: c.diffs && c.diffs[0] ? `${c.diffs[0].previous_value}` : 'Baseline Nominal',
    newValue: c.diffs && c.diffs[0] ? `${c.diffs[0].current_value}` : 'Updated State',
    delta: c.diffs && c.diffs[0] && c.diffs[0].delta ? `+${c.diffs[0].delta}` : diffSummary,
    severity: severityMap[c.trigger] || 'warning',
    status: 'Active',
    trigger: c.trigger || 'Sensor Threshold Crossing',
    cause: c.ai_summary || 'State diff created by threshold crossing engine.',
    evidence: c.sensor_evidence ? Object.entries(c.sensor_evidence).map(([k, v]) => `${k}: ${v}`) : [
      'Hot memory stream batch evaluated',
      'Sha-256 parent linked'
    ],
    aiAnalysis: c.ai_summary || 'Indexed into vector memory store.',
    recommendedAction: 'Automated agent consensus active.',
    rawBackendData: c
  };
}

// REST API Calls with graceful fallbacks
export const api = {
  // Telemetry API
  async getZones() {
    try {
      const res = await fetch(`${API_BASE}/telemetry/zones`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data: data.map((z, idx) => mapBackendZoneToFrontend(z, idx)) };
    } catch (err) {
      console.warn('API getZones failed, falling back to mockData:', err.message);
      return { online: false, data: initialZones };
    }
  },

  async getZoneMetrics(zoneId) {
    try {
      const res = await fetch(`${API_BASE}/telemetry/zones/${zoneId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data: mapBackendZoneToFrontend(data) };
    } catch (err) {
      console.warn(`API getZoneMetrics(${zoneId}) failed:`, err.message);
      const fallback = initialZones.find(z => z.id === zoneId) || initialZones[0];
      return { online: false, data: fallback };
    }
  },

  async getHotMemory(zoneId, limit = 50) {
    try {
      const res = await fetch(`${API_BASE}/telemetry/hot-memory/${zoneId}?limit=${limit}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn(`API getHotMemory(${zoneId}) failed:`, err.message);
      return { online: false, data: [] };
    }
  },

  // Commits API
  async getCommits(zoneId = null, domain = null, limit = 50) {
    try {
      let url = `${API_BASE}/commits?limit=${limit}`;
      if (zoneId) url += `&zone_id=${zoneId}`;
      if (domain) url += `&domain=${domain}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data: data.map((c, idx) => mapBackendCommitToFrontend(c, idx)) };
    } catch (err) {
      console.warn('API getCommits failed, falling back to mockData:', err.message);
      return { online: false, data: initialCommits };
    }
  },

  async getCommitByHash(commitHash) {
    try {
      const res = await fetch(`${API_BASE}/commits/hash/${commitHash}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data: mapBackendCommitToFrontend(data) };
    } catch (err) {
      console.warn(`API getCommitByHash(${commitHash}) failed:`, err.message);
      return { online: false, data: initialCommits[0] };
    }
  },

  async diffCommits(hashA, hashB) {
    try {
      const res = await fetch(`${API_BASE}/commits/diff/${hashA}/${hashB}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API diffCommits failed:', err.message);
      return { online: false, data: null };
    }
  },

  // AI & RAG Memory API
  async chatAI(prompt, zoneId = null) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, zone_id: zoneId })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API chatAI failed:', err.message);
      return {
        online: false,
        data: {
          query: prompt,
          response: `[Offline Mode] AI Memory response for "${prompt}": CityMind Vector RAG identified 2 historical matches with 89% confidence. Continuous monitoring advised.`,
          retrieved_commits: [],
          causal_nodes: ['Traffic Flow', 'Exit 14 Interchange'],
          confidence: 0.89
        }
      };
    }
  },

  async searchMemory(query, topK = 5) {
    try {
      const res = await fetch(`${API_BASE}/ai/memory/search?q=${encodeURIComponent(query)}&top_k=${topK}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API searchMemory failed:', err.message);
      return { online: false, data: vectorSearchResults[0].matchedEvents };
    }
  },

  async getKnowledgeGraph() {
    try {
      const res = await fetch(`${API_BASE}/ai/memory/graph`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API getKnowledgeGraph failed:', err.message);
      return { online: false, data: { nodes: [], edges: [] } };
    }
  },

  // Agent Mesh API
  async getAgentStatus() {
    try {
      const res = await fetch(`${API_BASE}/agents/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API getAgentStatus failed:', err.message);
      return { 
        online: false, 
        data: { 
          mesh_status: 'operational', 
          total_agents: 5, 
          agents: [
            { agent_id: 'agent-traffic', domain: 'traffic', status: 'active' },
            { agent_id: 'agent-env', domain: 'environment', status: 'active' },
            { agent_id: 'agent-infra', domain: 'infrastructure', status: 'active' },
            { agent_id: 'agent-emergency', domain: 'emergency', status: 'active' },
            { agent_id: 'agent-citizen', domain: 'citizen', status: 'active' },
          ]
        } 
      };
    }
  },

  // Predictions API
  async getPredictiveAlerts() {
    try {
      const res = await fetch(`${API_BASE}/predictions/alerts`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API getPredictiveAlerts failed:', err.message);
      return { online: false, data: aiInsights };
    }
  },

  // Digital Twin API
  async runDigitalTwinSimulation(scenarioType, targetZoneId = 'zone-expressway', intensity = 1.0) {
    try {
      const res = await fetch(`${API_BASE}/digital-twin/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_type: scenarioType, target_zone_id: targetZoneId, intensity })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { online: true, data };
    } catch (err) {
      console.warn('API runDigitalTwinSimulation failed:', err.message);
      return {
        online: false,
        data: {
          scenario_type: scenarioType,
          target_zone_id: targetZoneId,
          simulated_impact: { metric: 'traffic_congestion_pct', before: 42, after: 85, delta: 43 },
          recommended_actions: [
            `Adjust signal timing in ${targetZoneId}`,
            'Dispatch emergency traffic response team',
            'Broadcast dynamic gantry rerouting advisory'
          ]
        }
      };
    }
  }
};
