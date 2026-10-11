import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowApi } from '../api/borrowApi';
import { dashboardApi } from '../api/dashboardApi';
import { StatCard } from '../components/StatCard';
import { 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Sparkles,
  BookMarked
} from 'lucide-react';

export const StudentDashboardPage = ({ onReturnClick, onNavigateCatalog, triggerRefresh }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        dashboardApi.getStudentStats(user.studentId),
        borrowApi.getStudentHistory(user.studentId)
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (historyRes.success) setHistory(historyRes.data);
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, triggerRefresh]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold">Please log in to view your student portal.</h2>
      </div>
    );
  }

  const activeLoans = history.filter(b => b.status === 'BORROWED' || b.status === 'OVERDUE');
  const overdueLoans = history.filter(b => b.status === 'OVERDUE');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Academic Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium">
            Student ID #{user.studentId} • {user.email} • Phone: {user.phone || 'N/A'}
          </p>
        </div>

        <button
          onClick={onNavigateCatalog}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm shadow-md hover:bg-indigo-50 transition-all flex-shrink-0"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Browse Catalog</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

      {/* Overdue Warning Alert if any overdue */}
      {overdueLoans.length > 0 && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 sm:p-5 flex items-start sm:items-center gap-4 text-rose-900 shadow-sm animate-pulse">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm sm:text-base">Attention: You have {overdueLoans.length} overdue book(s)!</h4>
            <p className="text-xs sm:text-sm text-rose-800 mt-0.5">
              Please return these books promptly to the library desk to avoid further overdue fines (₹5.00/day).
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Loans"
          value={stats?.activeLoans ?? activeLoans.length}
          icon={BookMarked}
          color="indigo"
          subtitle="Currently in your possession"
        />
        <StatCard
          title="Overdue Books"
          value={stats?.overdueLoans ?? overdueLoans.length}
          icon={Clock}
          color={overdueLoans.length > 0 ? 'rose' : 'emerald'}
          subtitle={overdueLoans.length > 0 ? "Requires immediate return" : "All loans on schedule"}
        />
        <StatCard
          title="Total Borrowed"
          value={stats?.totalBorrowed ?? history.length}
          icon={BookOpen}
          color="blue"
          subtitle="Lifetime loans to date"
        />
        <StatCard
          title="Fines Accrued"
          value={`₹${stats?.totalFines ?? '0.00'}`}
          icon={DollarSign}
          color="amber"
          subtitle="Late return fee tally"
        />
      </div>

      {/* Active Borrowed Books Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Currently Borrowed Books</h2>
            <p className="text-xs text-slate-500">Books issued to your account awaiting return</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {activeLoans.length} Active
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading student loans...</div>
        ) : activeLoans.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Active Loans</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't currently have any borrowed books. Discover thousands of titles in our library catalog!
            </p>
            <button
              onClick={onNavigateCatalog}
              className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Explore Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLoans.map((loan) => {
              const isOverdue = loan.status === 'OVERDUE';
              const dueDate = new Date(loan.dueDate);
              const today = new Date();
              const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={loan.borrowId}
                  className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-3 transition-all ${
                    isOverdue 
                      ? 'bg-rose-50/50 border-rose-200' 
                      : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {loan.book?.category || 'General'}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isOverdue 
                          ? 'bg-rose-100 text-rose-800 font-extrabold' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isOverdue ? 'OVERDUE' : 'BORROWED'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {loan.book?.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Author: <span className="font-semibold text-slate-800">{loan.book?.author}</span>
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 block">Issued On:</span>
                        <span className="font-medium text-slate-800">{loan.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Due Date:</span>
                        <span className={`font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                          {loan.dueDate}
                        </span>
                      </div>
                    </div>

                    {isOverdue ? (
                      <p className="text-[11px] font-bold text-rose-700 bg-rose-100/70 p-2 rounded-lg">
                        ⚠️ Late by {Math.abs(diffDays)} day(s) — Late fine is accruing!
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        ⏳ {diffDays} day(s) remaining until due date
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onReturnClick(loan)}
                    className="w-full mt-2 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Return Book</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
