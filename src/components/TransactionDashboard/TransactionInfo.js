// src/components/TransactionDashboard/TransactionInfo.js
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../Card/Card';
import { getEtherscanLink, weiToEther } from '../../utils/helpers';

const truncateHash = (hash, startLength = 8, endLength = 8) => {
  if (!hash) return 'N/A';
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Information</CardTitle>
      </CardHeader>
      <CardContent>
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
          {data.status === 'included' && data.hash && (
            <div className="col-span-2">
              <p className="font-semibold">Etherscan Link:</p>
              <a 
                href={getEtherscanLink(data.hash)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:text-blue-700 underline"
              >
                View on Etherscan
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionInfo;