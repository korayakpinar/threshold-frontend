// src/app/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';

const truncateHash = (hash, startLength =6, endLength = 4) => {
  if (!hash) return 'N/A';
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};

const weiToEther = (wei) => {
  if (!wei) return 'N/A';
  const ether = parseFloat(wei) / 1e18;
  
  if (ether < 1e-6) {
    
    const gwei = ether * 1e9;
    return `${gwei.toFixed(2)} Gwei`;
  } else if (ether < 0.01) {
    
    return `${ether.toFixed(6)} ETH`;
  } else {
    
    return `${ether.toFixed(4)} ETH`;
  }
};

const getRecentTransactions = async () => {
  try {
    const response = await axios.get(`${document.location.origin}:8082/recent-transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    throw error;
  }
};

const TransactionBox = ({ transaction }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tx/${transaction.hash}`);
  };

  const isDecrypted = transaction.status === 'decrypted' || transaction.status === 'included';

  return (
    <div 
      onClick={handleClick}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-t-2 border-blue-500"
    >
      <div className="text-lg font-bold mb-2 text-blue-600">
        {truncateHash(transaction.hash)}
      </div>
      <div className="text-sm space-y-2">
        <div>
          <span className="font-semibold">Status: </span>
          <span className={transaction.status === 'included' ? 'text-green-600' : 'text-blue-600'}>
            {transaction.status}
          </span>
        </div>
        {isDecrypted && transaction.rawTx && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <span className="font-semibold">From</span>
                <span>{truncateHash(transaction.rawTx.From)}</span>
              </div>
              <ArrowRight className="text-gray-400" />
              <div className="flex flex-col items-center">
                <span className="font-semibold">To</span>
                <span>{truncateHash(transaction.rawTx.To)}</span>
              </div>
            </div>
            <div>
              <span className="font-semibold">Value: </span>
              <span>{weiToEther(transaction.rawTx.Value)}</span>
            </div>
            <div>
              <span className="font-semibold">Nonce: </span>
              <span>{transaction.rawTx.Nonce}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getRecentTransactions();
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recent transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Recent Transactions</h1>
      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {transactions.map((transaction, index) => (
            <TransactionBox key={index} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg">
          No transactions found.
        </div>
      )}
    </main>
  );
}