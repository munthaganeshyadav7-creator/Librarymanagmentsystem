import { apiRequest } from './client';

export const borrowApi = {
  borrowBook: async (studentId, bookId, days = 14) => {
    return apiRequest('/api/borrow', {
      method: 'POST',
      body: JSON.stringify({ studentId, bookId, days })
    });
  },

  returnBook: async (borrowId) => {
    return apiRequest(`/api/return/${borrowId}`, {
      method: 'PUT'
    });
  },

  getStudentHistory: async (studentId) => {
    return apiRequest(`/api/borrow/student/${studentId}`);
  },

  getAllBorrows: async () => {
    return apiRequest('/api/borrow/all');
  },

  getActiveBorrows: async () => {
    return apiRequest('/api/borrow/active');
  },

  getOverdueBorrows: async () => {
    return apiRequest('/api/borrow/overdue');
  }
};
