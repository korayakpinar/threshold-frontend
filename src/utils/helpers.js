export const getCurrentStage = (data) => {
  if (!data || !data.proposed) return 0;
  if (data.partialDecryptionCount < data.txInfo.threshold) return 1;
  if (!data.decrypted) return 2;
  if (!data.included) return 3;
  return 4; // All stages completed
};

export const getPartialDecryptionProgress = (data) => {
  if (!data || !data.txInfo) return 0;
  return (data.partialDecryptionCount / data.txInfo.threshold) * 100;
};

export const getEtherscanLink = (data) => {
  const baseUrl = "https://etherscan.io/tx/";
  if (!data || !data.txInfo || !data.txInfo.hash) {
    return baseUrl; // Return base URL if data is not available
  }
  return `${baseUrl}${data.txInfo.hash}`;
};