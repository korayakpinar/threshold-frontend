import { useState, useEffect } from 'react';
import { getTxStatus } from '../services/api';

export function useTransactionStatus(txHash) {
    const [data, setData] = useState(null);
    const [transition, setTransition] = useState(false);
    const [error, setError] = useState(null);

    const fetchTxStatus = async () => {
        if (!txHash) {
            setError("No transaction hash provided");
            return;
        }

        try {
            const status = await getTxStatus(txHash);
            setTransition(true);
            setData(prevData => ({
                ...status,
                partialDecryptionCount: prevData?.partialDecryptionCount || 0
            }));
            setTimeout(() => {
                setData(status);
                setTransition(false);
            }, 500);
            setError(null);
        } catch (error) {
            console.error("Error fetching transaction status:", error);
            setError("Failed to fetch transaction status");
            setData(null);
            setTransition(false);
        }
    };

    useEffect(() => {
        if (txHash) {
            fetchTxStatus();
            const interval = setInterval(fetchTxStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [txHash]);

    return { data, transition, error };
}

export default useTransactionStatus;