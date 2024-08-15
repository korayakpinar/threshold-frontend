// Mock API function (replace with actual API call)
const getTxStatus = async (txHash) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response
    return {
      proposed: Math.random() > 0.5,
      partialDecryptionCount: Math.floor(Math.random() * 10),
      decrypted: Math.random() > 0.5,
      included: Math.random() > 0.5,
      txInfo: {
        hash: txHash,
        committeeSize: Math.floor(Math.random() * 20) + 5,
        threshold: Math.floor(Math.random() * 10) + 3
      }
    };
};

export { getTxStatus };