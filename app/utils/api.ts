// utils/api.ts
const API_BASE_URL = 'http://transport.infogreen/api/index.php';

/**
 * Generic API function for making POST requests
 * @param {any} payload - The complete payload object to send
 * @param {RequestInit} options - Additional fetch options (headers, etc.)
 * @returns {Promise<any>} - The API response
 */
export const apiCall = async (payload: any, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(payload),
      ...options
    });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};