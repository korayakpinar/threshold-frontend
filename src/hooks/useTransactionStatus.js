'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useTransactionStatus(txHash, ws_url) {
    const [data, setData] = useState(null);
    const [transition, setTransition] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    
    const ws = useRef(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef(null);
    const isConnected = useRef(false);

    const connect = useCallback(() => {
        if (typeof window === 'undefined' || isConnected.current || reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
            return;
        }

        ws.current = new WebSocket(ws_url);

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            setConnectionStatus('connected');
            reconnectAttempts.current = 0;
            isConnected.current = true;
            if (txHash) {
                ws.current.send(JSON.stringify({ type: 'subscribe', txHash }));
            }
        };

        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'txUpdate' && message.txHash === txHash) {
                    setTransition(true);
                    setData(prevData => {
                        if (JSON.stringify(prevData) !== JSON.stringify(message.data)) {
                            return message.data;
                        }
                        return prevData;
                    });
                    setTimeout(() => setTransition(false), 100);
                }
            } catch (e) {
                console.error("Error parsing WebSocket message:", e);
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnectionStatus('error');
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
            isConnected.current = false;
            setConnectionStatus('disconnected');
            reconnectAttempts.current += 1;
            if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
                reconnectTimeout.current = setTimeout(connect, RECONNECT_INTERVAL);
            }
        };
    }, [txHash, ws_url]);

    useEffect(() => {
        if (typeof window !== 'undefined' && ws_url && txHash) {
            connect();
        }

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [connect, ws_url, txHash]);

    const memoizedData = useMemo(() => data, [data]);

    return { data: memoizedData, transition, connectionStatus };
}

export default useTransactionStatus;