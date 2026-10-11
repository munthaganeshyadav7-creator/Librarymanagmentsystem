import React, { useState } from 'react';
import { borrowApi } from '../api/borrowApi';
import { X, RotateCcw, AlertTriangle, CheckCircle, Calendar, DollarSign } from 'lucide-react';

export const ReturnModal = ({ borrow, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !borrow) return null;

  const today = new Date();
  const dueDate = new Date(borrow.dueDate);
  const isOverdue = today > dueDate;
  
  const diffTime = today - dueDate;
  const daysOverdue = isOverdue ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
  const estimatedFine = (daysOverdue * 5.00).toFixed(2); // ₹5/day rate

  const handleReturn = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await borrowApi.returnBook(borrow.borrowId);
      if (res.success) {
        onSuccess(res.message || 'Book returned successfully!', res.data);
        onClose();
      } else {
        setError(res.message || 'Return processing failed');
      }
    } catch (err) {
      setError(err.message || 'Error processing book return');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <RotateCcw className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Return Book</h3>
              <p className="text-xs text-slate-300">Process return & calculate fine</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {error}
            </div>
          )}

          {/* Book Information */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Loan #{borrow.borrowId}
            </span>
            <h4 className="font-bold text-slate-900 text-base">
              {borrow.book?.title || 'Book Title'}
            </h4>
            <p className="text-xs text-slate-600">
              Borrower: <strong className="text-slate-800">{borrow.student?.name}</strong> ({borrow.student?.email})
            </p>
          </div>

          {/* Dates & Timeline */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Issue Date:</span>
              <strong className="text-slate-800 text-sm">{borrow.issueDate}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Due Date:</span>
              <strong className={`text-sm ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                {borrow.dueDate}
              </strong>
            </div>
          </div>

          {/* Fine preview alert */}
          {isOverdue ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Overdue Return Detected!</span>
              </div>
              <p className="text-xs text-rose-800">
                This item is overdue by <strong>{daysOverdue} days</strong>. Late fine calculation: ₹5.00/day.
              </p>
              <div className="pt-2 flex items-center justify-between text-sm font-extrabold text-rose-700 border-t border-rose-200/60">
                <span>Calculated Late Fee:</span>
                <span className="text-base font-mono">₹{estimatedFine}</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2.5 text-xs font-semibold">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Returning on time! No overdue fine applicable.</span>
            </div>
          )}
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
            onClick={handleReturn}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 text-emerald-400" />
                <span>Confirm Return</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
