import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../Card/Card';
import { getEtherscanLink } from '../../utils/helpers';

const TransactionInfo = ({ data }) => {
  if (!data || !data.txInfo) {
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
            <p className="text-sm">{data.txInfo.hash || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Committee Size:</p>
            <p className="text-sm">{data.txInfo.committeeSize || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Threshold:</p>
            <p className="text-sm">{data.txInfo.threshold || 'N/A'}</p>
          </div>
          {data.included && data.txInfo.hash && (
            <div className="col-span-2">
              <p className="font-semibold">Etherscan Link:</p>
              <a 
                href={getEtherscanLink(data)} 
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