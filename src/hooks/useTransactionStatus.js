'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const WS_URL = `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8082/ws`;
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useTransactionStatus(txHash) {
    const [data, setData] = useState(null);
    const [transition, setTransition] = useState(false);
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);
    const reconnectAttempts = useRef(0);

    const connect = useCallback(() => {
        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
            setError("Max reconnection attempts reached. Please refresh the page.");
            setConnectionStatus('failed');
            return;
        }

        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            setConnectionStatus('connected');
            reconnectAttempts.current = 0;
            if (txHash) {
                ws.current.send(JSON.stringify({ type: 'subscribe', txHash }));
            }
            setError(null);
        };

        ws.current.onmessage = (event) => {
            try {
                const status = JSON.parse(event.data);
                if (status.error) {
                    setError(status.error);
                    return;
                }
                setTransition(true);
                setData(prevData => {
                    if (JSON.stringify(prevData) !== JSON.stringify(status)) {
                        return status;
                    }
                    return prevData;
                });
                setTimeout(() => setTransition(false), 100);
            } catch (e) {
                console.error("Error parsing WebSocket message:", e);
                setError("Failed to parse WebSocket message");
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            setError("Failed to connect to WebSocket. Retrying...");
            setConnectionStatus('error');
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed. Reconnecting...');
            setConnectionStatus('reconnecting');
            reconnectAttempts.current += 1;
            reconnectTimeout.current = setTimeout(connect, RECONNECT_INTERVAL);
        };
    }, [txHash]);

    useEffect(() => {
        connect();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [connect]);

    const memoizedData = useMemo(() => data, [data]);

    return { data: memoizedData, transition, error, connectionStatus };
}

export default useTransactionStatus;