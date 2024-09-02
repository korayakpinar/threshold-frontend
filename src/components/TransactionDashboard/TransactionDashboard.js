'use client';

import React, { useMemo } from 'react';
import StageProgress from './StageProgress';
import TransactionInfo from './TransactionInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card/Card';
import { useTransactionStatus } from '../../hooks/useTransactionStatus';
import { getCurrentStage } from '../../utils/helpers';

const TransactionDashboard = ({ txHash }) => {
  const { data, transition, error, connectionStatus } = useTransactionStatus(txHash);
  const currentStage = useMemo(() => data ? getCurrentStage(data) : 0, [data]);

  if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Connecting...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Establishing connection to the server... Status: {connectionStatus}</p>
        </CardContent>
      </Card>
    );
  }

  if (connectionStatus === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Connection Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">Failed to connect to the server. Please refresh the page or try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Fetching transaction data... Connection status: {connectionStatus}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Transaction Status Dashboard</CardTitle>
          <CardDescription className="text-center">Current Stage: {['Proposed', 'Partial Decryption', 'Decrypted', 'Included'][currentStage]}</CardDescription>
        </CardHeader>
        <CardContent>
          <StageProgress data={data} currentStage={currentStage} transition={transition} />
        </CardContent>
      </Card>

      <TransactionInfo data={data} />
    </div>
  );
};

export default React.memo(TransactionDashboard);