import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowApi } from '../api/borrowApi';
import { X, BookCheck, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const BorrowModal = ({ book, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [loanDays, setLoanDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !book) return null;

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + Number(loanDays));

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      setError('Please log in as a student to borrow books.');
      return;
    }

    if (book.availableQuantity <= 0) {
      setError('Sorry, no copies are currently available for this book.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await borrowApi.borrowBook(user.studentId, book.bookId, loanDays);
      if (res.success) {
        onSuccess(res.message || 'Book issued successfully!');
        onClose();
      } else {
        setError(res.message || 'Failed to borrow book');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server');
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
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <BookCheck className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Borrow Book</h3>
              <p className="text-xs text-indigo-200">Issue to your library account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Book Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {book.category}
            </span>
            <h4 className="font-bold text-slate-900 text-base leading-snug">
              {book.title}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
              <span>Author: <strong className="text-slate-800">{book.author}</strong></span>
              {book.isbn && <span>ISBN: <strong className="font-mono text-slate-800">{book.isbn}</strong></span>}
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs">
              <span className="text-slate-500">Available Stock:</span>
              <span className={`font-bold ${book.availableQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {book.availableQuantity} of {book.quantity} copies available
              </span>
            </div>
          </div>

          {/* Borrower Information */}
          <div className="text-xs space-y-1 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/70">
            <span className="font-semibold text-slate-700">Issuing To:</span>
            <div className="flex justify-between items-center text-slate-900 font-medium">
              <span>{user?.name || 'Guest'}</span>
              <span className="text-slate-500 font-mono">{user?.email}</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Loan Duration:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 14, 21, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setLoanDays(days)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    loanDays === days
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Due Date banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-amber-900">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>Return Due Date:</span>
            </div>
            <strong className="font-bold text-amber-900 text-sm">
              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </strong>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleBorrow}
            disabled={loading || book.availableQuantity <= 0}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span>Issuing...</span>
            ) : (
              <>
                <BookCheck className="w-4 h-4" />
                <span>Confirm Borrow</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
