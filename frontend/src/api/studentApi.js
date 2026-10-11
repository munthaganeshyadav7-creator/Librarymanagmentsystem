import { apiRequest } from './client';

export const studentApi = {
  getStudents: async () => {
    return apiRequest('/api/students');
  },

  getStudentById: async (id) => {
    return apiRequest(`/api/students/${id}`);
  },

  updateStudent: async (id, data) => {
    return apiRequest(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  deleteStudent: async (id) => {
    return apiRequest(`/api/students/${id}`, {
      method: 'DELETE'
    });
  }
};
