import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { bookApi } from '../api/bookApi';
import { borrowApi } from '../api/borrowApi';
import { studentApi } from '../api/studentApi';
import { StatCard } from '../components/StatCard';
import { 
  BookOpen, 
  Users, 
  RotateCcw, 
  Clock, 
  DollarSign, 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  RefreshCw,
  Library
} from 'lucide-react';

export const AdminDashboardPage = ({ onAddBookClick, onEditBookClick, onReturnClick, triggerRefresh }) => {
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'desk', 'students'
  const [bookSearch, setBookSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, booksRes, studentsRes, activeLoansRes] = await Promise.all([
        dashboardApi.getAdminStats(),
        bookApi.getBooks(),
        studentApi.getStudents(),
        borrowApi.getActiveBorrows()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (booksRes.success) setBooks(booksRes.data);
      if (studentsRes.success) setStudents(studentsRes.data);
      if (activeLoansRes.success) setActiveLoans(activeLoansRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [triggerRefresh]);

  const handleDeleteBook = async (bookId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the library inventory?`)) {
      return;
    }
    try {
      const res = await bookApi.deleteBook(bookId);
      if (res.success) {
        setBooks(books.filter(b => b.bookId !== bookId));
        loadAllData();
      } else {
        alert(res.message || 'Failed to delete book');
      }
    } catch (err) {
      alert(err.message || 'Error deleting book');
    }
  };

  const filteredBooks = books.filter(b => {
    if (!bookSearch.trim()) return true;
    const q = bookSearch.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
  });

  const filteredStudents = students.filter(s => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Administrator & Librarian Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management of book inventory, student lending operations, and fine audits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddBookClick}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Book Titles"
          value={stats?.totalBooks ?? books.length}
          icon={BookOpen}
          color="indigo"
          subtitle={`${stats?.totalInventoryCopies ?? 0} total physical copies`}
        />
        <StatCard
          title="Registered Students"
          value={stats?.totalStudents ?? students.length}
          icon={Users}
          color="blue"
          subtitle="Active library cardholders"
        />
        <StatCard
          title="Active Loans"
          value={stats?.activeBorrows ?? 0}
          icon={Layers}
          color="amber"
          subtitle={`${stats?.overdueBorrows ?? 0} books currently overdue`}
        />
        <StatCard
          title="Total Fines Collected"
          value={`₹${stats?.totalFines ?? '0.00'}`}
          icon={DollarSign}
          color="emerald"
          subtitle={`${stats?.totalReturns ?? 0} books returned to date`}
        />
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Book Inventory ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('desk')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'desk'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Return Processing Desk ({activeLoans.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Registered Members ({students.length})
        </button>
      </div>

      {/* Tab 1: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-5">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Search inventory by title, author, category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={onAddBookClick}
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Title</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Book Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Total Copies</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredBooks.map((book) => {
                  const isLow = book.availableQuantity <= 1;
                  return (
                    <tr key={book.bookId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-slate-500">#{book.bookId}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm max-w-sm">{book.title}</div>
                        <div className="text-[11px] text-slate-500">by {book.author} {book.isbn && `• ISBN: ${book.isbn}`}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{book.quantity}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          book.availableQuantity > 0 
                            ? isLow ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700' 
                            : 'bg-rose-50 text-rose-700 font-extrabold'
                        }`}>
                          {book.availableQuantity} available
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onEditBookClick(book)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.bookId, book.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Return Processing Desk */}
      {activeTab === 'desk' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Circulation & Return Processing Desk</h3>
            <p className="text-xs text-slate-500">
              Check in borrowed books and immediately calculate overdue penalties per the institutional fine policy.
            </p>
          </div>

          {activeLoans.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm">All books returned!</p>
              <p className="text-xs text-slate-400">There are no outstanding unreturned loans.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Loan ID</th>
                    <th className="px-4 py-3">Book</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Process Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {activeLoans.map((loan) => {
                    const isOverdue = loan.status === 'OVERDUE';
                    return (
                      <tr key={loan.borrowId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-slate-500">#{loan.borrowId}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 max-w-xs">{loan.book?.title}</td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold">{loan.student?.name}</div>
                          <div className="text-[11px] text-slate-400">{loan.student?.email}</div>
                        </td>
                        <td className="px-4 py-3.5">{loan.issueDate}</td>
                        <td className="px-4 py-3.5">
                          <span className={isOverdue ? 'text-rose-600 font-bold' : ''}>
                            {loan.dueDate}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isOverdue ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-indigo-50 text-indigo-700'
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => onReturnClick(loan)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Process Return</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Student & User Directory */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search registered members by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500 self-center">
              Total {filteredStudents.length} Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Member ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Contact Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((st) => (
                  <tr key={st.studentId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-slate-500">#{st.studentId}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{st.name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{st.email}</td>
                    <td className="px-4 py-3.5 text-slate-600">{st.phone || 'N/A'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        st.role === 'ADMIN'
                          ? 'bg-rose-100 text-rose-700'
                          : st.role === 'LIBRARIAN'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {st.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
