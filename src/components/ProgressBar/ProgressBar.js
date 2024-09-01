// src/components/ProgressBar/ProgressBar.js
import React from 'react';

const ProgressBar = ({ value, max, threshold }) => {
  value = value + 1;
  const percentage = (value / max) * 100;
  const thresholdPercentage = (threshold / max) * 100;

  // Ensure the value label stays within the bar's width
  const labelPosition = Math.max(Math.min(percentage, 98), 2);

  return (
    <div className="w-full">
      <div className="flex items-center">
        <span className="text-xs text-gray-600 mr-2">0</span>
        <div className="relative flex-grow">
          <div className="h-2 bg-gray-200 rounded-full overflow-visible">
            <div 
              className="absolute h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${percentage}%` }}
            />
            <div 
              className="absolute h-4 w-px bg-gray-400 -top-1 transition-all duration-500 ease-in-out" 
              style={{ left: `${thresholdPercentage}%` }}
            />
          </div>
          <span 
            className="absolute text-[10px] font-medium text-blue-600 transition-all duration-500 ease-in-out"
            style={{ 
              left: `${labelPosition}%`, 
              transform: 'translateX(-50%)',
              bottom: '100%',
              marginBottom: '3px',
            }}
          >
            {value}
          </span>
          <span 
            className="absolute text-xs text-gray-600 transition-all duration-500 ease-in-out"
            style={{ 
              left: `${thresholdPercentage}%`, 
              transform: 'translateX(-50%)', 
              top: '100%',
              marginTop: '4px'
            }}
          >
            {threshold}
          </span>
        </div>
        <span className="text-xs text-gray-600 ml-2">{max}</span>
      </div>
    </div>
  );
};

export default ProgressBar;