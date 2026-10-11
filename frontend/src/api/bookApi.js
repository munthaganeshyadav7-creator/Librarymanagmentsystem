import { apiRequest } from './client';

export const bookApi = {
  getBooks: async (query = '', category = '') => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/books${queryString}`);
  },

  getBookById: async (id) => {
    return apiRequest(`/api/books/${id}`);
  },

  addBook: async (bookData) => {
    return apiRequest('/api/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },

  updateBook: async (id, bookData) => {
    return apiRequest(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  },

  deleteBook: async (id) => {
    return apiRequest(`/api/books/${id}`, {
      method: 'DELETE'
    });
  },

  getCategories: async () => {
    return apiRequest('/api/books/categories');
  }
};
