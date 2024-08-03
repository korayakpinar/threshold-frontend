"use client";

import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import Progress from "@/components/Progress/Progress"

import Card from "@/components/Card/Card"
import CardContent from "@/components/Card/CardContent"
import CardDescription from "@/components/Card/CardDescription"
import CardFooter from "@/components/Card/CardFooter"
import CardHeader from "@/components/Card/CardHeader"
import CardTitle from "@/components/Card/CardTitle"

import Button from "@/components/Button/Button"

const stages = ['Proposed', 'Partial Decryption', 'Decrypted', 'Included'];

const TransactionDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const generateInitialData = () => ({
      currentStage: 0,
      partialDecryptionCount: 0,
      stageStatus: stages.map(() => 'pending'),
      includedLoading: false,
      txInfo: {
        hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
        committeeSize: Math.floor(Math.random() * 20) + 5,
        threshold: Math.floor(Math.random() * 10) + 3
      }
    });

    setData(generateInitialData());
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const progress = (data.currentStage / (stages.length - 1)) * 100;

  const handleNextStage = () => {
    setData(prevData => {
      let newData = { ...prevData };
      if (newData.currentStage === 0) {
        newData.stageStatus[0] = 'completed';
        newData.currentStage = 1;
      } else if (newData.currentStage === 1) {
        if (newData.partialDecryptionCount < newData.txInfo.threshold) {
          newData.partialDecryptionCount++;
        }
        if (newData.partialDecryptionCount === newData.txInfo.threshold) {
          newData.stageStatus[1] = 'completed';
          newData.currentStage = 2;
        }
      } else if (newData.currentStage === stages.length - 2) {
        newData.stageStatus[newData.currentStage] = 'completed';
        newData.currentStage = stages.length - 1;
        newData.includedLoading = true;
      } else if (newData.currentStage === stages.length - 1) {
        if (newData.includedLoading) {
          newData.stageStatus[newData.currentStage] = 'completed';
          newData.includedLoading = false;
        } else {
          // Eğer zaten tamamlanmışsa, yeni bir transaction başlat
          return generateInitialData();
        }
      }
      return newData;
    });
  };

  const getStageIcon = (index) => {
    if (data.stageStatus[index] === 'completed') {
      return <CheckCircle className="text-green-500" />;
    }
    if (index === data.currentStage) {
      if (stages[index] === 'Partial Decryption') {
        if (data.partialDecryptionCount === data.txInfo.threshold) {
          return <CheckCircle className="text-green-500" />;
        }
        return <Loader2 className="text-yellow-500 animate-spin" />;
      }
      if (stages[index] === 'Included' && data.includedLoading) {
        return <Loader2 className="text-blue-500 animate-spin" />;
      }
      return <Loader2 className="text-blue-500 animate-spin" />;
    }
    return <AlertCircle className="text-gray-300" />;
  };

  const getPartialDecryptionProgress = () => {
    return (data.partialDecryptionCount / data.txInfo.threshold) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Transaction Status Dashboard</CardTitle>
          <CardDescription className="text-center">Current Stage: {stages[data.currentStage]}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-2 bg-gray-200" />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {stages.map((stage, index) => (
              <div key={stage} className={`flex flex-col items-center ${index === data.currentStage ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                {getStageIcon(index)}
                <span className="mt-2 text-sm text-center">{stage}</span>
                {stage === 'Partial Decryption' && (
                  <div className="w-full mt-2">
                    <Progress value={getPartialDecryptionProgress()} className="w-full h-1 bg-gray-200" />
                    <span className="text-xs mt-1">Count: {data.partialDecryptionCount}/{data.txInfo.threshold}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={handleNextStage} 
            disabled={data.currentStage === stages.length - 1 && !data.includedLoading}
          >
            {data.currentStage === 0 ? 'Propose Transaction' : 
             data.currentStage === 1 ? 'Perform Partial Decryption' : 
             data.currentStage === stages.length - 1 && data.includedLoading ? 'Complete Inclusion' :
             data.currentStage === stages.length - 1 && !data.includedLoading ? 'Start New Transaction' :
             'Advance to Next Stage'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Tx Hash:</p>
              <p className="text-sm">{data.txInfo.hash}</p>
            </div>
            <div>
              <p className="font-semibold">Committee Size:</p>
              <p className="text-sm">{data.txInfo.committeeSize}</p>
            </div>
            <div>
              <p className="font-semibold">Threshold:</p>
              <p className="text-sm">{data.txInfo.threshold}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDashboard;