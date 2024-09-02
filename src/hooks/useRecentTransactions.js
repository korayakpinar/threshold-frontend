'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WS_URL = `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:8082/ws`;
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useRecentTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    
    const ws = useRef(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef(null);
    const isConnected = useRef(false);

    const connect = useCallback(() => {
        if (isConnected.current || reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
            return;
        }

        ws.current = new WebSocket(WS_URL);

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
            setConnectionStatus('connected');
            reconnectAttempts.current = 0;
            isConnected.current = true;
            ws.current.send(JSON.stringify({ type: 'getRecentTransactions' }));
            ws.current.send(JSON.stringify({ type: 'subscribeToNewTransactions' }));
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'recentTransactions') {
                    setTransactions(data.transactions);
                } else if (data.type === 'newTransaction') {
                    setTransactions(prevTransactions => [data.transaction, ...prevTransactions].slice(0, 8));
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
    }, []);

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

    return { transactions, connectionStatus };
}

export default useRecentTransactions;