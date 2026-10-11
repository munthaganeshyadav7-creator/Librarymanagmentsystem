import { apiRequest } from './client';

export const authApi = {
  login: async (email, password) => {
    return apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData) => {
    return apiRequest('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};
