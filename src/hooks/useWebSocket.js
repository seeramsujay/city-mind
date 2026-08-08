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
