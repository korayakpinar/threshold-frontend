import React, { useState, useEffect } from 'react';
import DecryptionGrid from './DecryptionGrid';
import { Card, CardHeader, CardContent, CardTitle } from '../Card/Card';
import { getEtherscanLink, weiToEther } from '../../utils/helpers';

const truncateHash = (hash, startLength = 8, endLength = 8) => {
  if (!hash) return 'N/A';
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};

const calculateDecryptionLatency = (proposedAt, decryptedAt) => {
  if (!proposedAt || !decryptedAt) return 'N/A';
  
  const proposed = new Date(proposedAt);
  const decrypted = new Date(decryptedAt);
  
  const diffInMilliseconds = decrypted - proposed;
  
  if (diffInMilliseconds < 1000) {
    return `${diffInMilliseconds}ms`;
  } else if (diffInMilliseconds < 60000) {
    return `${(diffInMilliseconds / 1000).toFixed(2)}s`;
  } else {
    return `${(diffInMilliseconds / 60000).toFixed(2)}min`;
  }
};

const TransactionInfo = ({ data }) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading transaction information...</p>
        </CardContent>
      </Card>
    );
  }

  const decryptionLatency = calculateDecryptionLatency(data.proposedAt, data.decryptedAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Tx Hash:</p>
                <p className="text-sm">{truncateHash(data.hash)}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p className="text-sm">{data.status}</p>
              </div>
              <div>
                <p className="font-semibold">Committee Size:</p>
                <p className="text-sm">{data.committeeSize}</p>
              </div>
              <div>
                <p className="font-semibold">Threshold:</p>
                <p className="text-sm">{data.threshold}</p>
              </div>
              <div>
                <p className="font-semibold">Decryption Latency:</p>
                <p className="text-sm">{decryptionLatency}</p>
              </div>
              {data.status === 'included' && data.hash && (
                <div>
                  <p className="font-semibold">Etherscan:</p>
                  <a 
                    href={getEtherscanLink(data)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:text-blue-700 underline text-sm"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
              {data.rawTx && (
                <>
                  <div>
                    <p className="font-semibold">From:</p>
                    <p className="text-sm">{truncateHash(data.rawTx.From)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">To:</p>
                    <p className="text-sm">{truncateHash(data.rawTx.To)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Value:</p>
                    <p className="text-sm">{weiToEther(data.rawTx.Value)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Nonce:</p>
                    <p className="text-sm">{data.rawTx.Nonce}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-200 mx-4 self-stretch my-4"></div>
          <div className="w-full md:w-1/2 pl-0 md:pl-4">
            <p className="font-semibold mb-2 text-center">Partial Decryptions</p>
            <div className="h-[calc(100%-2rem)]">
              <DecryptionGrid 
                committeeSize={data.committeeSize} 
                partialDecryptions={data.partialDecryptions || {}}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default TransactionInfo;