"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRecentTransactions } from '../hooks/useRecentTransactions';

const truncateHash = (hash, startLength = 6, endLength = 4) => {
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

const TransactionBox = ({ transaction, isLoading }) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isLoading && transaction) {
      router.push(`/tx/${transaction.hash}`);
    }
  };

  const isDecrypted = transaction?.status === 'decrypted' || transaction?.status === 'included';

  return (
    <div 
      onClick={handleClick}
      className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 border-t-2 border-blue-500 ${!isLoading && 'cursor-pointer'} h-[200px] flex flex-col justify-between relative`}
    >
      {!isLoading && transaction.alreadyEncrypted && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <Lock size={12} className="mr-1" />
          Client-side Encrypted
        </div>
      )}
      <div>
        <div className="text-lg font-bold mb-2 text-blue-600">
          {isLoading ? <Skeleton width="80%" height={24} /> : truncateHash(transaction.hash)}
        </div>
        <div className="text-sm space-y-2">
          {isLoading ? (
            <>
              <Skeleton width="60%" height={18} />
              <Skeleton width="70%" height={18} />
              <Skeleton width="65%" height={18} />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const wsUrl = "wss://legendrelabs.xyz:8082/ws";
  const { transactions, connectionStatus } = useRecentTransactions(wsUrl);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [connectionStatus]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Recent Transactions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(isLoading || transactions.length === 0) ? (
          [...Array(8)].map((_, index) => (
            <TransactionBox key={index} isLoading={true} />
          ))
        ) : (
          transactions.slice(0, 8).map((transaction) => (
            <TransactionBox key={transaction.hash} transaction={transaction} isLoading={false} />
          ))
        )}
      </div>
    </main>
  );
}