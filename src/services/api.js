// Mock API function (replace with actual API call)
const getTxStatus = async (txHash) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate consistent random values
    const committeeSize = Math.floor(Math.random() * 16) + 5; // 5 to 20
    const threshold = Math.floor(Math.random() * (committeeSize - 4)) + 3; // 3 to committeeSize-2
    const proposed = Math.random() > 0.3; // 70% chance of being proposed
    const partialDecryptionCount = proposed ? Math.floor(Math.random() * (threshold + 1)) : 0;
    const decrypted = proposed && partialDecryptionCount >= threshold;
    const included = decrypted; // 50% chance of being included if decrypted

    // Mock response
    return {
      proposed,
      partialDecryptionCount,
      decrypted,
      included,
      txInfo: {
        hash: txHash,
        committeeSize,
        threshold
      }
    };
};

export { getTxStatus };