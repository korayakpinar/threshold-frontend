// src/components/TransactionDashboard/StageProgress.js
import React from 'react';
import { CheckCircle, AlertCircle, Loader } from '../Icons/Icons';
import ProgressBar from '../ProgressBar/ProgressBar';

const stages = ['Pending', 'Proposed', 'Decrypted', 'Included'];

const StageProgress = ({ data, currentStage, transition }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const progress = Math.min((currentStage / (stages.length - 1)) * 100, 100);

  const getStageIcon = (index) => {
    if (index < currentStage) return <CheckCircle color="#22c55e" />;
    if (index === currentStage) {
      if (data.status === 'included') return <CheckCircle color="#22c55e" />;
      return <Loader className="text-blue-500" />;
    }
    return <AlertCircle color="#d1d5db" />;
  };

  return (
    <div className="space-y-6">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`bg-blue-600 h-2 rounded-full ${transition ? 'transition-all duration-500 ease-in-out' : ''}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stages.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center">
            <div className={`flex flex-col items-center ${index === currentStage && data.status !== 'included' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              {getStageIcon(index)}
              <span className="mt-2 text-sm text-center">{stage}</span>
            </div>
            {stage === 'Proposed' && (
              <div className="w-full mt-4 ml-2 px-2 sm:px-4">
                <ProgressBar 
                  value={data.partialDecryptionCount} 
                  max={data.committeeSize} 
                  threshold={data.threshold}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageProgress;