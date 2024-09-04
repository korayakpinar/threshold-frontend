'use client';

import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import StageProgress from './StageProgress';
import TransactionInfo from './TransactionInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card/Card';
import { useTransactionStatus } from '../../hooks/useTransactionStatus';
import { getCurrentStage } from '../../utils/helpers';

const TransactionDashboard = ({ txHash }) => {
  const wsUrl = "wss://banger.build:8082/ws";
  const { data, transition, connectionStatus } = useTransactionStatus(txHash, wsUrl);
  const currentStage = useMemo(() => data ? getCurrentStage(data) : 0, [data]);

  const isLoading = connectionStatus !== 'connected';

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isLoading ? <Skeleton width={200} /> : "Transaction Status Dashboard"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLoading ? (
              <Skeleton width={150} />
            ) : (
              `Current Stage: ${['Proposed', 'Partial Decryption', 'Decrypted', 'Included'][currentStage]}`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StageProgress data={data} currentStage={currentStage} transition={transition} isLoading={isLoading} />
        </CardContent>
      </Card>

      <TransactionInfo data={data} isLoading={isLoading} />
    </div>
  );
};

export default React.memo(TransactionDashboard);