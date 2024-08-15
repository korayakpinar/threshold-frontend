// src/components/TransactionDashboard/TransactionDashboard.js
"use client";
import React from 'react';
import StageProgress from './StageProgress';
import TransactionInfo from './TransactionInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card/Card';
import { useTransactionStatus } from '../../hooks/useTransactionStatus';
import { getCurrentStage } from '../../utils/helpers';

const TransactionDashboard = () => {
  const { data, transition, error } = useTransactionStatus();
  const currentStage = data ? getCurrentStage(data) : 0;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
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

export default TransactionDashboard;