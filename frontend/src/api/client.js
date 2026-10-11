const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = (rawBaseUrl && rawBaseUrl.trim())
  ? rawBaseUrl.trim().replace(/\/+$/, '')
  : (import.meta.env.DEV ? 'http://localhost:8080' : '');

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}
