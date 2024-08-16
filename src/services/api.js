import axios from 'axios';

const getTxStatus = async (txHash) => {
  
  try {
    const response = await axios.get(`http://127.0.0.1:8082/tx/${txHash}`);

    console.log('Transaction status:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
};

export { getTxStatus };