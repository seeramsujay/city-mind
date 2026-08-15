// CityMind WebSocket Connection Hook
import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(onTelemetry, onCityCommit) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  // Store callbacks in refs to prevent unnecessary re-connections when callbacks change
  const onTelemetryRef = useRef(onTelemetry);
  const onCityCommitRef = useRef(onCityCommit);

  useEffect(() => {
    onTelemetryRef.current = onTelemetry;
    onCityCommitRef.current = onCityCommit;
  }, [onTelemetry, onCityCommit]);

  const connect = useCallback(() => {
    // Determine WebSocket URL relative to window or default 8000
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host.includes(':') 
      ? window.location.host 
      : `${window.location.hostname}:8000`;
    const wsUrl = `${protocol}//${host}/api/v1/telemetry/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          setLastMessage(payload);

          if (payload.type === 'telemetry' && onTelemetryRef.current) {
            onTelemetryRef.current(payload.data);
          } else if (payload.type === 'city_commit' && onCityCommitRef.current) {
            onCityCommitRef.current(payload.data);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        // Schedule reconnect after 3 seconds
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
        ws.close();
      };
    } catch (err) {
      console.warn('WebSocket initialization failed:', err);
      setIsConnected(false);
      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, 3000);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Simulated telemetry ticker for Vercel Cloud Edge deployment
  useEffect(() => {
    if (isConnected) return;

    const zones = ['zone-downtown', 'zone-north', 'zone-west', 'zone-east', 'zone-expressway'];
    const metrics = ['traffic_congestion_pct', 'water_level_m', 'aqi', 'waste_fill_pct'];

    const simInterval = setInterval(() => {
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
      
      let val = 45;
      if (randomMetric === 'traffic_congestion_pct') val = Math.floor(30 + Math.random() * 45);
      else if (randomMetric === 'water_level_m') val = Number((0.8 + Math.random() * 1.5).toFixed(2));
      else if (randomMetric === 'aqi') val = Math.floor(35 + Math.random() * 55);
      else if (randomMetric === 'waste_fill_pct') val = Math.floor(25 + Math.random() * 50);

      if (onTelemetryRef.current) {
        onTelemetryRef.current({
          zone_id: randomZone,
          metric_name: randomMetric,
          value: val,
          unit: randomMetric === 'water_level_m' ? 'm' : '%'
        });
      }
    }, 2500);

    return () => clearInterval(simInterval);
  }, [isConnected]);

  const sendMessage = useCallback((msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
}
