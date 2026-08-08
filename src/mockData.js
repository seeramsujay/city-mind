// CityMind Comprehensive Mock Data System

export const initialZones = [
  {
    id: "zone-01",
    code: "Zone 01",
    name: "Central Business District",
    status: "normal", // normal, warning, critical
    x: 48, // SVG map percentage coordinates
    y: 35,
    type: "Commercial",
    sensorCount: 142,
    metrics: {
      traffic: 45, // %
      garbage: 38, // %
      rainfall: 0, // mm/hr
      airQuality: "Good", // AQI 42
      aqiValue: 42,
      infrastructureScore: 98,
    },
    baseline: {
      traffic: 45,
      garbage: 38,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 45,
      infrastructureScore: 98,
    },
    latestCommit: "CM-1032",
    lastUpdated: "12m ago"
  },
  {
    id: "zone-02",
    code: "Zone 02",
    name: "North Riverside",
    status: "warning",
    x: 28,
    y: 22,
    type: "Residential / Basin",
    sensorCount: 96,
    metrics: {
      traffic: 34,
      garbage: 52,
      rainfall: 38, // Elevated! Baseline 0
      airQuality: "Good",
      aqiValue: 48,
      infrastructureScore: 91,
    },
    baseline: {
      traffic: 30,
      garbage: 50,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 50,
      infrastructureScore: 92,
    },
    latestCommit: "CM-1041",
    lastUpdated: "8m ago"
  },
  {
    id: "zone-03",
    code: "Zone 03",
    name: "Tech Hub East",
    status: "normal",
    x: 72,
    y: 28,
    type: "High-Tech District",
    sensorCount: 210,
    metrics: {
      traffic: 58,
      garbage: 41,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 36,
      infrastructureScore: 99,
    },
    baseline: {
      traffic: 60,
      garbage: 40,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 35,
      infrastructureScore: 99,
    },
    latestCommit: "CM-1029",
    lastUpdated: "24m ago"
  },
  {
    id: "zone-04",
    code: "Zone 04",
    name: "Metro Expressway",
    status: "critical",
    x: 52,
    y: 58,
    type: "Transit Corridor",
    sensorCount: 184,
    metrics: {
      traffic: 81, // SPIKE! Baseline 42
      garbage: 43,
      rainfall: 0,
      airQuality: "Moderate",
      aqiValue: 88,
      infrastructureScore: 94,
    },
    baseline: {
      traffic: 42,
      garbage: 43,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 52,
      infrastructureScore: 95,
    },
    latestCommit: "CM-1042",
    lastUpdated: "3m ago"
  },
  {
    id: "zone-05",
    code: "Zone 05",
    name: "Old Town Center",
    status: "warning",
    x: 35,
    y: 48,
    type: "Historical / Retail",
    sensorCount: 115,
    metrics: {
      traffic: 62,
      garbage: 68,
      rainfall: 0,
      airQuality: "Moderate",
      aqiValue: 74,
      infrastructureScore: 78, // Degraded due to pothole report
    },
    baseline: {
      traffic: 55,
      garbage: 65,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 55,
      infrastructureScore: 92,
    },
    latestCommit: "CM-1039",
    lastUpdated: "18m ago"
  },
  {
    id: "zone-06",
    code: "Zone 06",
    name: "South Industrial Park",
    status: "normal",
    x: 78,
    y: 72,
    type: "Manufacturing",
    sensorCount: 160,
    metrics: {
      traffic: 40,
      garbage: 55,
      rainfall: 0,
      airQuality: "Moderate",
      aqiValue: 82,
      infrastructureScore: 90,
    },
    baseline: {
      traffic: 42,
      garbage: 52,
      rainfall: 0,
      airQuality: "Moderate",
      aqiValue: 80,
      infrastructureScore: 90,
    },
    latestCommit: "CM-1035",
    lastUpdated: "31m ago"
  },
  {
    id: "zone-07",
    code: "Zone 07",
    name: "Residential West",
    status: "warning",
    x: 20,
    y: 68,
    type: "Residential Suburb",
    sensorCount: 88,
    metrics: {
      traffic: 28,
      garbage: 92, // Threshold crossed! Baseline 71
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 39,
      infrastructureScore: 96,
    },
    baseline: {
      traffic: 25,
      garbage: 71,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 40,
      infrastructureScore: 96,
    },
    latestCommit: "CM-1040",
    lastUpdated: "14m ago"
  },
  {
    id: "zone-08",
    code: "Zone 08",
    name: "Waterfront Promenade",
    status: "normal",
    x: 18,
    y: 42,
    type: "Recreational / Coastal",
    sensorCount: 75,
    metrics: {
      traffic: 22,
      garbage: 30,
      rainfall: 5,
      airQuality: "Excellent",
      aqiValue: 22,
      infrastructureScore: 97,
    },
    baseline: {
      traffic: 20,
      garbage: 28,
      rainfall: 0,
      airQuality: "Excellent",
      aqiValue: 25,
      infrastructureScore: 97,
    },
    latestCommit: "CM-1025",
    lastUpdated: "45m ago"
  },
  {
    id: "zone-09",
    code: "Zone 09",
    name: "Heavy Industry East",
    status: "critical",
    x: 85,
    y: 45,
    type: "Chemical & Energy",
    sensorCount: 195,
    metrics: {
      traffic: 35,
      garbage: 60,
      rainfall: 0,
      airQuality: "Hazardous", // AQI 164! Baseline 78
      aqiValue: 164,
      infrastructureScore: 88,
    },
    baseline: {
      traffic: 32,
      garbage: 58,
      rainfall: 0,
      airQuality: "Moderate",
      aqiValue: 78,
      infrastructureScore: 90,
    },
    latestCommit: "CM-1038",
    lastUpdated: "21m ago"
  },
  {
    id: "zone-10",
    code: "Zone 10",
    name: "Airport Corridor",
    status: "normal",
    x: 58,
    y: 82,
    type: "Logistics & Flight Hub",
    sensorCount: 230,
    metrics: {
      traffic: 50,
      garbage: 35,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 48,
      infrastructureScore: 99,
    },
    baseline: {
      traffic: 52,
      garbage: 35,
      rainfall: 0,
      airQuality: "Good",
      aqiValue: 45,
      infrastructureScore: 99,
    },
    latestCommit: "CM-1028",
    lastUpdated: "38m ago"
  }
];

export const initialCommits = [
  {
    id: "CM-1042",
    timestamp: "15:21:43",
    date: "Today",
    zoneId: "zone-04",
    zoneCode: "Zone 04",
    zoneName: "Metro Expressway",
    category: "Traffic",
    event: "Traffic Spike",
    previousValue: "42%",
    newValue: "81%",
    delta: "+39%",
    severity: "critical", // critical, warning, high, normal
    status: "Active",
    trigger: "Sensor Threshold Crossing",
    cause: "Severe bottleneck detected at Exit 14 interchange due to stalled multi-axle freight truck blocking 2 out of 3 lanes.",
    evidence: [
      "Inductive loop detectors #L-402 and #L-405 recorded vehicle flow drop from 85 mph avg to 8 mph.",
      "CCTV Vision AI module #CAM-04B identified stationary heavy vehicle with hazard lights.",
      "Upstream queue length rapidly increased by 1.8 kilometers in 4 minutes."
    ],
    aiAnalysis: "Semantic vector pattern matches 92% with event EV-884 (Oct 14). High risk of cascade congestion spreading to Zone 01 and Zone 05 if signal timings are not updated.",
    recommendedAction: "Dispatch traffic management unit to Exit 14. Automatically adjust variable speed limit displays to 35 MPH 2 miles upstream and reroute light traffic via Zone 01 outer bypass."
  },
  {
    id: "CM-1041",
    timestamp: "15:18:12",
    date: "Today",
    zoneId: "zone-02",
    zoneCode: "Zone 02",
    zoneName: "North Riverside",
    category: "Weather",
    event: "Rainfall Spike",
    previousValue: "0 mm/hr",
    newValue: "38 mm/hr",
    delta: "+38 mm/hr",
    severity: "warning",
    status: "Monitoring",
    trigger: "Optical Pluviometer Anomaly",
    cause: "Localized convective thunderstorm cell passing over North Basin catchment area.",
    evidence: [
      "Weather telemetry station #WX-02 recorded precipitation jump from 0 to 38mm/hr within 10-minute window.",
      "Storm drain pressure sensors #DP-201 indicating 64% fill level."
    ],
    aiAnalysis: "Hydro-dynamic model predicts potential surface flooding in low-lying underpasses if rainfall remains >30mm/hr for another 20 minutes.",
    recommendedAction: "Activate automated drainage pumps P-1 and P-2. Issue low-visibility rain alert for drivers entering Zone 02."
  },
  {
    id: "CM-1040",
    timestamp: "15:11:08",
    date: "Today",
    zoneId: "zone-07",
    zoneCode: "Zone 07",
    zoneName: "Residential West",
    category: "Garbage",
    event: "Garbage Threshold Crossed",
    previousValue: "71%",
    newValue: "92%",
    delta: "+21%",
    severity: "warning",
    status: "Scheduled",
    trigger: "Smart Dumpster Ultrasonic Telemetry",
    cause: "Multiple commercial dumpsters in Sector 7-C reached 90%+ capacity following weekend market activity.",
    evidence: [
      "Sensors #DMP-701 through #DMP-708 reached sustained fill levels above 90% threshold.",
      "Gas telemetry recorded elevated methane/odour index."
    ],
    aiAnalysis: "Waste collection route optimization model recommends dispatching compaction vehicle #WV-04 prior to peak evening residential disposal hours.",
    recommendedAction: "Reroute waste management crew #WM-3 to Zone 07 Sector C."
  },
  {
    id: "CM-1039",
    timestamp: "15:04:27",
    date: "Today",
    zoneId: "zone-05",
    zoneCode: "Zone 05",
    zoneName: "Old Town Center",
    category: "Citizen Reports",
    event: "Severe Pothole Report",
    previousValue: "Baseline 92% Road Condition",
    newValue: "78% Road Condition",
    delta: "-14%",
    severity: "high",
    status: "Verified",
    trigger: "Citizen Incident Submission #CR-204",
    cause: "Deep asphalt surface erosion near Main Junction causing vehicle swerving and tire damage risk.",
    evidence: [
      "Validated by 3 independent citizen app reports with geotagged photo evidence.",
      "Vehicle accelerometer vibration anomaly flagged by city bus fleet sensor #BUS-112."
    ],
    aiAnalysis: "AI Computer Vision classified photo as Class-3 Deep Structural Pothole (94% confidence). High probability of rim damage during night hours.",
    recommendedAction: "Dispatch rapid-patch maintenance crew. Deploy temporary illuminated warning cone."
  },
  {
    id: "CM-1038",
    timestamp: "14:58:41",
    date: "Today",
    zoneId: "zone-09",
    zoneCode: "Zone 09",
    zoneName: "Heavy Industry East",
    category: "Air Quality",
    event: "AQI Spike Anomaly",
    previousValue: "AQI 78",
    newValue: "AQI 164",
    delta: "+86 AQI",
    severity: "critical",
    status: "Active",
    trigger: "Multi-Gas Optical Sensor Array",
    cause: "Unplanned particulate release and VOC surge near Chemical Processing Plant B.",
    evidence: [
      "PM2.5 concentration elevated from 18 µg/m³ to 112 µg/m³ within 15 minutes.",
      "NO2 gas sensors #AQ-904 registered 145 ppb spike."
    ],
    aiAnalysis: "Cross-correlated with facility operational logs. Environmental compliance threshold exceeded by 180%. Vector match with previous exhaust filter bypass incident.",
    recommendedAction: "Notify Environmental Regulatory Officer. Send advisory push notification to sensitive populations within 1.5km downwind radius."
  },
  {
    id: "CM-1037",
    timestamp: "14:22:15",
    date: "Today",
    zoneId: "zone-01",
    zoneCode: "Zone 01",
    zoneName: "Central Business District",
    category: "Infrastructure",
    event: "Grid Frequency Stabilized",
    previousValue: "49.2 Hz",
    newValue: "50.0 Hz",
    delta: "+0.8 Hz",
    severity: "normal",
    status: "Resolved",
    trigger: "Substation Telemetry",
    cause: "Grid micro-battery storage discharged 2.4 MW during peak elevator usage period.",
    evidence: [
      "Substation #SUB-01 telemetry returned to nominal 50Hz baseline.",
      "Power factor stabilized at 0.98."
    ],
    aiAnalysis: "Automated balancing system operated within parameters.",
    recommendedAction: "No further action required. Log state diff in Warm Memory."
  }
];

export const initialCitizenReports = [
  {
    id: "CR-204",
    title: "Deep Pothole at Main Junction",
    category: "Pothole",
    zoneId: "zone-05",
    zoneName: "Old Town Center",
    location: "Main Junction & 4th Ave",
    timestamp: "14:45:10 Today",
    severity: "High",
    aiClassification: "Road Infrastructure",
    confidence: 94,
    status: "Pending Commit",
    description: "Dangerous 12-inch wide pothole open on right lane. Cars swerving suddenly to avoid it.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
    upvotes: 18
  },
  {
    id: "CR-205",
    title: "Market Dumpster Overflowing",
    category: "Garbage Overflow",
    zoneId: "zone-07",
    zoneName: "Residential West",
    location: "Sector 7 Commercial Plaza",
    timestamp: "13:20:00 Today",
    severity: "Medium",
    aiClassification: "Waste Management",
    confidence: 91,
    status: "Commit Created",
    description: "Garbage spilling onto sidewalk after weekend organic market.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
    upvotes: 12
  },
  {
    id: "CR-206",
    title: "Water Bursting from Manhole",
    category: "Water Leakage",
    zoneId: "zone-02",
    zoneName: "North Riverside",
    location: "Riverbed Boulevard #120",
    timestamp: "12:10:44 Today",
    severity: "Critical",
    aiClassification: "Hydraulic Utility",
    confidence: 97,
    status: "Under Review",
    description: "Clean water gushing out of storm drain manhole. Road surface lifting slightly.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80",
    upvotes: 34
  },
  {
    id: "CR-207",
    title: "Broken Traffic Signal Light",
    category: "Traffic Issue",
    zoneId: "zone-04",
    zoneName: "Metro Expressway",
    location: "Off-ramp 14 Signal",
    timestamp: "11:55:02 Today",
    severity: "High",
    aiClassification: "Traffic Control",
    confidence: 89,
    status: "Commit Created",
    description: "Left turn signal stuck on flashing yellow causing confusion.",
    image: "https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80",
    upvotes: 8
  },
  {
    id: "CR-208",
    title: "Dark Streetlight Cluster",
    category: "Streetlight Failure",
    zoneId: "zone-03",
    zoneName: "Tech Hub East",
    location: "Innovation Way Pedestrian Path",
    timestamp: "10:15:30 Today",
    severity: "Low",
    aiClassification: "Electrical Grid",
    confidence: 96,
    status: "Pending Commit",
    description: "5 consecutive streetlights out along walkway behind Building B.",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80",
    upvotes: 5
  }
];

export const aiInsights = [
  {
    id: "INSIGHT-01",
    title: "TRAFFIC ANOMALY IN ZONE 04",
    zoneId: "zone-04",
    zoneName: "Metro Expressway",
    type: "Traffic Critical",
    severity: "critical",
    diffHighlight: "Traffic increased by +39% above baseline (42% → 81%)",
    similarityScore: 87,
    historicalMatchId: "HIST-884",
    historicalDate: "14 days ago",
    possibleCauses: [
      "Road congestion caused by stalled freight vehicle at Exit 14",
      "Nearby stadium event dispersing peak crowd onto expressway",
      "Traffic signal timing out of sync at primary off-ramp"
    ],
    recommendedAction: "Dispatch traffic management team to Zone 04. Trigger automated dynamic rerouting displays on upstream gantries.",
    evidenceCount: 3,
    status: "Action Required"
  },
  {
    id: "INSIGHT-02",
    title: "AIR QUALITY SURGE IN ZONE 09",
    zoneId: "zone-09",
    zoneName: "Heavy Industry East",
    type: "Environmental Anomaly",
    severity: "critical",
    diffHighlight: "AQI spiked from 78 to 164 (+86 AQI)",
    similarityScore: 93,
    historicalMatchId: "HIST-512",
    historicalDate: "45 days ago",
    possibleCauses: [
      "Industrial emissions filter bypass during plant maintenance",
      "Unusual micro-climate thermal inversion trapping particulates",
      "High chemical boiler stack exhaust temperature"
    ],
    recommendedAction: "Dispatch environmental compliance team for stack inspection. Notify regional health authority.",
    evidenceCount: 4,
    status: "Investigation Active"
  },
  {
    id: "INSIGHT-03",
    title: "RECURRING GARBAGE SATURATION IN ZONE 07",
    zoneId: "zone-07",
    zoneName: "Residential West",
    type: "Operational Trend",
    severity: "warning",
    diffHighlight: "Fill rate exceeded 90% threshold 4 times this month",
    similarityScore: 91,
    historicalMatchId: "HIST-309",
    historicalDate: "7 days ago",
    possibleCauses: [
      "Increased weekend vendor pop-ups near Sector 7 plaza",
      "Inadequate 3-day collection cycle for residential volume growth",
      "Broken compaction mechanism on primary bin #DMP-703"
    ],
    recommendedAction: "Upgrade Zone 07 collection schedule from bi-weekly to 3-times weekly. Install 2 extra high-capacity smart compactor bins.",
    evidenceCount: 2,
    status: "Recommendation Pending"
  }
];

export const vectorSearchResults = [
  {
    query: "traffic spikes in Zone 04",
    matchedEvents: [
      {
        id: "HIST-884",
        title: "Expressway Exit Bottleneck",
        zone: "Zone 04",
        timeAgo: "14 days ago",
        similarity: 87,
        diff: "Traffic 42% → 84% (+42%)",
        aiSummary: "Traffic spikes in Zone 04 frequently occur between 5 PM and 7 PM during nearby sports arena events or freight breakdowns at Exit 14."
      },
      {
        id: "HIST-710",
        title: "Rain Surface Hydroplaning Congestion",
        zone: "Zone 04",
        timeAgo: "32 days ago",
        similarity: 79,
        diff: "Traffic 42% → 79% (+37%)",
        aiSummary: "Heavy rain causes immediate speed drops on Zone 04 curve #3 leading to rapid 2km backing queue."
      },
      {
        id: "HIST-402",
        title: "Evening Commute Surge",
        zone: "Zone 04",
        timeAgo: "60 days ago",
        similarity: 71,
        diff: "Traffic 42% → 72% (+30%)",
        aiSummary: "Baseline traffic shifts naturally during holiday Fridays without structural incidents."
      }
    ]
  },
  {
    query: "air quality anomalies",
    matchedEvents: [
      {
        id: "HIST-512",
        title: "Plant B Exhaust Surge",
        zone: "Zone 09",
        timeAgo: "45 days ago",
        similarity: 93,
        diff: "AQI 78 → 172 (+94)",
        aiSummary: "Particulate spikes in Zone 09 correlate strongly with Plant B boiler purge cycles during low wind velocity conditions."
      },
      {
        id: "HIST-319",
        title: "Port Vessel Idle Emissions",
        zone: "Zone 08",
        timeAgo: "90 days ago",
        similarity: 81,
        diff: "AQI 25 → 95 (+70)",
        aiSummary: "Container ships idling at berth under east wind conditions push NO2 into coastal promenade zones."
      }
    ]
  }
];

export const memoryStats = {
  hotMemory: {
    title: "HOT MEMORY",
    subtitle: "Real-time Telemetry Buffer",
    timeframe: "Last 1–2 hours",
    contents: [
      "Raw high-frequency sensor readings",
      "Operational threshold monitoring",
      "Immediate anomaly detection engine"
    ],
    status: "LIVE",
    itemCount: "4,120 raw metrics/min",
    retention: "Ephemeral (120 mins max)"
  },
  warmMemory: {
    title: "WARM MEMORY",
    subtitle: "City Commits & State Diffs",
    timeframe: "Last 30 Days",
    contents: [
      "State diff logs & commit payloads",
      "Citizen incident reports",
      "Validated anomaly events",
      "Operational state transitions"
    ],
    status: "ACTIVE",
    itemCount: "27 commits today (1,420 total)",
    retention: "Indexed event log"
  },
  coldMemory: {
    title: "COLD MEMORY",
    subtitle: "Long-Term AI Knowledge Graph",
    timeframe: "Multi-Year Permanent Archive",
    contents: [
      "Historical narrative summaries",
      "High-dimensional semantic embeddings",
      "Cross-domain causality graphs",
      "Macro urban development trends"
    ],
    status: "OPTIMIZED",
    itemCount: "184 AI summaries • 2,431 knowledge nodes",
    retention: "Permanent Compressed Vector DB"
  }
};

export const analyticsData = {
  trafficEventsOverTime: [
    { time: "08:00", zone04Traffic: 42, baseline: 42 },
    { time: "09:00", zone04Traffic: 45, baseline: 42 },
    { time: "10:00", zone04Traffic: 43, baseline: 42 },
    { time: "11:00", zone04Traffic: 44, baseline: 42 },
    { time: "12:00", zone04Traffic: 48, baseline: 42 },
    { time: "13:00", zone04Traffic: 51, baseline: 42 },
    { time: "14:00", zone04Traffic: 58, baseline: 42 },
    { time: "15:00", zone04Traffic: 81, baseline: 42 }, // Spike
    { time: "15:30", zone04Traffic: 76, baseline: 42 }
  ],
  commitsByCategory: [
    { name: "Traffic", value: 38, color: "#06b6d4" },
    { name: "Weather", value: 22, color: "#3b82f6" },
    { name: "Garbage", value: 18, color: "#f59e0b" },
    { name: "Infrastructure", value: 12, color: "#10b981" },
    { name: "Air Quality", value: 10, color: "#f43f5e" }
  ],
  commitsBySeverity: [
    { severity: "Critical", count: 8, fill: "#f43f5e" },
    { severity: "Warning", count: 12, fill: "#f59e0b" },
    { severity: "High", count: 5, fill: "#3b82f6" },
    { severity: "Normal", count: 2, fill: "#10b981" }
  ],
  storageComparison: [
    { name: "Traditional 24/7 IoT", gigabytes: 100, label: "100% Raw Data" },
    { name: "CityMind Diff Commits", gigabytes: 13, label: "13% Event Memory" }
  ]
};
