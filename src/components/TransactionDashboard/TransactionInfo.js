import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DecryptionGrid from './DecryptionGrid';
import { Card, CardHeader, CardContent, CardTitle } from '../Card/Card';
import { getEtherscanLink, weiToEther } from '../../utils/helpers';

const truncateHash = (hash, startLength = 8, endLength = 8) => {
  if (!hash) return 'N/A';
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};

const decodeBase64 = (str) => {
  try {
    return atob(str);
  } catch (e) {
    console.error('Error decoding base64:', e);
    return 'Error decoding data';
  }
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

const TransactionInfo = ({ data, isLoading }) => {
  const decryptionLatency = data ? calculateDecryptionLatency(data.proposedAt, data.decryptedAt) : 'N/A';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tx Hash:', value: isLoading ? <Skeleton width={150} /> : truncateHash(data?.hash) },
                { label: 'Status:', value: isLoading ? <Skeleton width={100} /> : data?.status },
                { label: 'Committee Size:', value: isLoading ? <Skeleton width={50} /> : data?.committeeSize },
                { label: 'Threshold:', value: isLoading ? <Skeleton width={50} /> : data?.threshold },
                { label: 'Decryption Latency:', value: isLoading ? <Skeleton width={100} /> : decryptionLatency },
                ...(data?.status === 'included' && data?.hash ? [
                  {
                    label: 'Etherscan:',
                    value: isLoading ? (
                      <Skeleton width={150} />
                    ) : (
                      <a 
                        href={getEtherscanLink(data?.hash)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:text-blue-700 underline text-sm"
                      >
                        View on Etherscan
                      </a>
                    )
                  }
                ] : []),
                ...(data?.rawTx ? [
                  { label: 'From:', value: isLoading ? <Skeleton width={150} /> : truncateHash(data.rawTx.From) },
                  { label: 'To:', value: isLoading ? <Skeleton width={150} /> : truncateHash(data.rawTx.To) },
                  { label: 'Value:', value: isLoading ? <Skeleton width={100} /> : weiToEther(data.rawTx.Value) },
                  { label: 'Nonce:', value: isLoading ? <Skeleton width={50} /> : data.rawTx.Nonce },
                  { 
                    label: 'Data:', 
                    value: isLoading ? <Skeleton width={150} /> : (
                      <div className="break-all">
                        {decodeBase64(data.rawTx.Data)}
                      </div>
                    )
                  },
                ] : [])
              ].map(({ label, value }, index) => (
                <div key={index} className={label === 'Data:' ? 'col-span-2' : ''}>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-200 mx-4 self-stretch my-4"></div>
          <div className="w-full md:w-1/2 pl-0 md:pl-4">
            <p className="font-semibold mb-2 text-center">Partial Decryptions</p>
            <div className="h-[calc(100%-2rem)]">
              {isLoading ? (
                <Skeleton height={200} />
              ) : (
                <DecryptionGrid 
                  committeeSize={data?.committeeSize} 
                  partialDecryptions={data?.partialDecryptions || {}}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionInfo;