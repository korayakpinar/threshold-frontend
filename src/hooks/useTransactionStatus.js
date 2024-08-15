import { useState, useEffect } from 'react';
import { getTxStatus } from '../services/api';

export function useTransactionStatus() {
    const [data, setData] = useState(null);
    const [transition, setTransition] = useState(false);
    const [error, setError] = useState(null);
  
    function fetchTxStatus() {
      return async function() {
        try {
          const txHash = `0x${Math.random().toString(16).substr(2, 40)}`;
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
    }
  
    useEffect(function() {
      const fetch = fetchTxStatus();
      fetch();
      const interval = setInterval(fetch, 5000);
      return function cleanup() {
        clearInterval(interval);
      };
    }, []);
  
    return { data, transition, error };
  }
  
  export default useTransactionStatus;