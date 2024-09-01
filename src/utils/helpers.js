// src/utils/helpers.js

export const getCurrentStage = (data) => {
  if (data.status === 'pending') return 0;
  if (data.status === 'proposed') return 1;
  if (data.status === 'decrypted') return 2;
  if (data.status === 'included') return 3;
  return 0;
};

export const getEtherscanLink = (hash) => {
  return `https://holesky.etherscan.io/tx/${hash}`;
};

export const weiToEther = (wei) => {
  if (!wei) return 'N/A';
  const ether = parseFloat(wei) / 1e18;
  
  if (ether < 1e-6) {
    
    const gwei = ether * 1e9;
    return `${gwei.toFixed(2)} Gwei`;
  } else if (ether < 0.01) {
    
    return `${ether.toFixed(6)} ETH`;
  } else {
    
    return `${ether.toFixed(4)} ETH`;
  }
};