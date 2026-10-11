import React, { useState, useEffect } from 'react';
import { bookApi } from '../api/bookApi';
import { X, BookPlus, Edit3, AlertCircle } from 'lucide-react';

export const BookFormModal = ({ isOpen, onClose, bookToEdit, onSuccess }) => {
  const isEditing = Boolean(bookToEdit);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Computer Science',
    quantity: 5,
    isbn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const CATEGORIES = [
    'Computer Science',
    'Algorithms',
    'Artificial Intelligence',
    'Databases',
    'Web Development',
    'Software Engineering',
    'Networking',
    'System Design',
    'Programming',
    'Electronics',
    'Mathematics',
    'Literature'
  ];

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        category: bookToEdit.category || 'Computer Science',
        quantity: bookToEdit.quantity || 1,
        isbn: bookToEdit.isbn || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Computer Science',
        quantity: 5,
        isbn: ''
      });
    }
    setError('');
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Title and Author are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        const res = await bookApi.updateBook(bookToEdit.bookId, formData);
        if (res.success) {
          onSuccess(res.message || 'Book updated successfully!');
          onClose();
        } else {
          setError(res.message || 'Failed to update book');
        }
      } else {
        const res = await bookApi.addBook(formData);
        if (res.success) {
          onSuccess(res.message || 'Book added to library catalog!');
          onClose();
        } else {
          setError(res.message || 'Failed to add book');
        }
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-5 h-5 text-indigo-300" /> : <BookPlus className="w-5 h-5 text-indigo-300" />}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {isEditing ? 'Edit Book Record' : 'Add New Book to Inventory'}
              </h3>
              <p className="text-xs text-indigo-200">
                {isEditing ? `Modifying Book ID #${bookToEdit?.bookId}` : 'Expand the college library repository'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Distributed Systems & Cloud Computing"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Author(s) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="e.g. Andrew S. Tanenbaum, Maarten van Steen"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Inventory Copies <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              ISBN Identifier
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="e.g. 978-0132126953"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Book'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
