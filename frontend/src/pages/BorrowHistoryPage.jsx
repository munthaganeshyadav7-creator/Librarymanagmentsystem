import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowApi } from '../api/borrowApi';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  RefreshCw
} from 'lucide-react';

export const BorrowHistoryPage = ({ onReturnClick, triggerRefresh }) => {
  const { user, canManage } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      // If admin/librarian, can view all borrows, else user's history
      const res = canManage 
        ? await borrowApi.getAllBorrows() 
        : await borrowApi.getStudentHistory(user?.studentId);

      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user, canManage, triggerRefresh]);

  const filteredHistory = history.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.book?.title?.toLowerCase().includes(q);
      const matchAuthor = item.book?.author?.toLowerCase().includes(q);
      const matchStudent = item.student?.name?.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchStudent;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Borrow History & Loan Log
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {canManage 
              ? 'Complete institutional records of all student book loans and returns' 
              : `Historical log of all books borrowed by ${user?.name}`}
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by book title, author, or student name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
          {['ALL', 'BORROWED', 'OVERDUE', 'RETURNED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading history records...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No borrow records found</p>
            <p className="text-xs text-slate-400">There are no records matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Loan ID</th>
                  <th className="px-5 py-3.5">Book Details</th>
                  {canManage && <th className="px-5 py-3.5">Student / Borrower</th>}
                  <th className="px-5 py-3.5">Issue Date</th>
                  <th className="px-5 py-3.5">Due Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredHistory.map((item) => {
                  const isBorrowed = item.status === 'BORROWED';
                  const isOverdue = item.status === 'OVERDUE';
                  const isReturned = item.status === 'RETURNED';

                  return (
                    <tr key={item.borrowId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono text-slate-500">#{item.borrowId}</td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm max-w-xs leading-snug">
                          {item.book?.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.book?.author} • <span className="text-indigo-600 font-semibold">{item.book?.category}</span>
                        </div>
                      </td>
                      {canManage && (
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">{item.student?.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.student?.email}</div>
                        </td>
                      )}
                      <td className="px-5 py-4 whitespace-nowrap">{item.issueDate}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                          {item.dueDate}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isReturned 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : isOverdue 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' 
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {isReturned && <CheckCircle2 className="w-3 h-3" />}
                          {isOverdue && <AlertTriangle className="w-3 h-3" />}
                          {isBorrowed && <Clock className="w-3 h-3" />}
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {(isBorrowed || isOverdue) ? (
                          <button
                            onClick={() => onReturnClick(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                          >
                            <RotateCcw className="w-3 h-3 text-emerald-400" />
                            <span>Return</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
