// src/app/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Helper function to truncate hash
const truncateHash = (hash, startLength = 6, endLength = 4) => {
  if (!hash) return 'N/A';
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};

// Function to fetch recent transactions
const getRecentTransactions = async () => {
  try {
    const response = await axios.get('http://threshold-client:8082/recent-transactions');
    console.log('Recent transactions:', response);
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

  return (
    <div 
      onClick={handleClick}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center border-t-2 border-blue-500"
    >
      <span className="text-lg font-semibold">{truncateHash(transaction.hash)}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {transactions.map((transaction, index) => (
          <TransactionBox key={index} transaction={transaction} />
        ))}
      </div>
    </main>
  );
}