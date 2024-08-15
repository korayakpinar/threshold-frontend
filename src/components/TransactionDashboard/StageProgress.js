// src/components/TransactionDashboard/StageProgress.js
import React from 'react';
import { Progress } from '../Progress/Progress';
import { CheckCircle, AlertCircle, Loader } from '../Icons/Icons';

const stages = ['Proposed', 'Partial Decryption', 'Decrypted', 'Included'];

const StageProgress = ({ data, currentStage, transition }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const progress = (currentStage / (stages.length - 1)) * 100;

  const getStageIcon = (index) => {
    if (index < currentStage) return <CheckCircle className="text-green-500" />;
    if (index === currentStage) return <Loader className="text-blue-500" />;
    return <AlertCircle className="text-gray-300" />;
  };

  const getPartialDecryptionProgress = () => {
    if (!data.txInfo || typeof data.partialDecryptionCount === 'undefined' || typeof data.txInfo.threshold === 'undefined') {
      return 0;
    }
    return (data.partialDecryptionCount / data.txInfo.threshold) * 100;
  };

  return (
    <>
      <Progress value={progress} className={`w-full h-2 ${transition ? 'transition-all duration-500 ease-in-out' : ''}`} />
      <div className="mt-4 grid grid-cols-4 gap-4">
        {stages.map((stage, index) => (
          <div key={stage} className={`flex flex-col items-center ${index === currentStage ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
            {getStageIcon(index)}
            <span className="mt-2 text-sm text-center">{stage}</span>
            {stage === 'Partial Decryption' && (
              <div className="w-full mt-2">
                <Progress 
                  value={getPartialDecryptionProgress()} 
                  className={`w-full h-1 ${transition ? 'transition-all duration-500 ease-in-out' : ''}`} 
                />
                <span className="text-xs mt-1">
                  Count: {data.partialDecryptionCount || 0}/{data.txInfo?.threshold || 0}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default StageProgress;