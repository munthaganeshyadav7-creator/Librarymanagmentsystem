import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Library, 
  LayoutDashboard, 
  History, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  UserCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, onOpenAuthModal }) => {
  const { user, logout, quickLogin, isAuthenticated, canManage } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & College Brand */}
          <div 
            onClick={() => setActivePage('catalog')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  CollegeLib
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Full Stack
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Library Management System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActivePage('catalog')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'catalog'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Book Catalog</span>
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActivePage('student-dashboard')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePage === 'student-dashboard'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Student Portal</span>
                </button>

                <button
                  onClick={() => setActivePage('history')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePage === 'history'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Borrow History</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActivePage('admin-dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'admin-dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin & Librarian Desk</span>
            </button>
          </nav>

          {/* User Controls & Demo Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Demo Switcher Pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-slate-500 font-medium">Quick Role:</span>
              <button 
                onClick={() => quickLogin('STUDENT')}
                className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                  user?.role === 'STUDENT' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button 
                onClick={() => quickLogin('LIBRARIAN')}
                className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                  user?.role === 'LIBRARIAN' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Librarian
              </button>
              <button 
                onClick={() => quickLogin('ADMIN')}
                className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                  user?.role === 'ADMIN' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <div className="flex items-center justify-end space-x-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                      user.role === 'ADMIN' 
                        ? 'bg-rose-100 text-rose-700' 
                        : user.role === 'LIBRARIAN' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50/50 text-xs">
        <button
          onClick={() => setActivePage('catalog')}
          className={`flex flex-col items-center py-1 px-2 ${activePage === 'catalog' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catalog</span>
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setActivePage('student-dashboard')}
            className={`flex flex-col items-center py-1 px-2 ${activePage === 'student-dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>My Portal</span>
          </button>
        )}
        <button
          onClick={() => setActivePage('admin-dashboard')}
          className={`flex flex-col items-center py-1 px-2 ${activePage === 'admin-dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
