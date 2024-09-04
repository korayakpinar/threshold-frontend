


const connectWebSocket = () => {
    const WS_URL = `wss://banger.build:8082/ws`;
    let socket = null;
    if (!socket) {
        socket = new WebSocket(WS_URL);
        socket.onopen = () => console.log('WebSocket connected');
        socket.onclose = () => console.log('WebSocket disconnected');
        socket.onerror = (error) => console.error('WebSocket error:', error);
    }
    return socket;
};

export const getTxStatus = (txHash) => {
    return new Promise((resolve, reject) => {
        const socket = connectWebSocket();
        const handler = (event) => {
            const data = JSON.parse(event.data);
            if (data.hash === txHash) {
                socket.removeEventListener('message', handler);
                resolve(data);
            }
        };
        socket.addEventListener('message', handler);
        socket.send(JSON.stringify({ type: 'getTxStatus', txHash }));
    });
};

export const getRecentTransactions = () => {
    return new Promise((resolve, reject) => {
        const socket = connectWebSocket();
        const handler = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'recentTransactions') {
                socket.removeEventListener('message', handler);
                resolve(data.transactions);
            }
        };
        socket.addEventListener('message', handler);
        socket.send(JSON.stringify({ type: 'getRecentTransactions' }));
    });
};