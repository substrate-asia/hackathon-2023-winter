import axios from 'axios';

export const storeTokenUriMetadata = async (metadata) => {
  try {
    const response = await axios.post('https://blend-server.vercel.app/pinata', metadata, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error storing Token URI metadata:', error);
    return { error: 'Error storing Token URI metadata' };
  }
};