import { apiRequest } from './client';

export const dashboardApi = {
  getAdminStats: async () => {
    return apiRequest('/api/dashboard');
  },

  getStudentStats: async (studentId) => {
    return apiRequest(`/api/dashboard/student/${studentId}`);
  }
};

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
