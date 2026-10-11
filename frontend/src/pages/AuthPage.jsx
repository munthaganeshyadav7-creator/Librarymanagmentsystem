import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Library, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const AuthPage = ({ onSuccess, isOpenModal = false, onCloseModal }) => {
  const { login, register, quickLogin, loading } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [error, setError] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT'
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(loginData.email, loginData.password);
    if (res.success) {
      if (onSuccess) onSuccess('Welcome back!');
      if (onCloseModal) onCloseModal();
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(registerData);
    if (res.success) {
      if (onSuccess) onSuccess('Account created and logged in!');
      if (onCloseModal) onCloseModal();
    } else {
      setError(res.message);
    }
  };

  const handleDemoClick = (role) => {
    quickLogin(role);
    if (onSuccess) onSuccess(`Signed in as demo ${role.toLowerCase()}!`);
    if (onCloseModal) onCloseModal();
  };

  const content = (
    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100">
      
      {/* Brand Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-indigo-300 backdrop-blur-md shadow-inner">
          <Library className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">College Library Portal</h2>
        <p className="text-xs text-indigo-200">
          Sign in or create an account to borrow books & manage returns
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => { setIsLoginTab(true); setError(''); }}
          className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
            isLoginTab 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setIsLoginTab(false); setError(''); }}
          className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
            !isLoginTab 
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Register Student
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isLoginTab ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                College Email
              </label>
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="e.g. aarav.sharma@college.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Sen"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="e.g. vikram.sen@college.edu"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Min 4 characters"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Account Role
              </label>
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="STUDENT">Student Cardholder</option>
                <option value="LIBRARIAN">Librarian Staff</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 disabled:opacity-50 transition-all flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Evaluation Buttons */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Demo Evaluation Profiles</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleDemoClick('STUDENT')}
              className="py-2 px-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold transition-all"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('LIBRARIAN')}
              className="py-2 px-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold transition-all"
            >
              Librarian
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN')}
              className="py-2 px-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold transition-all"
            >
              Admin
            </button>
          </div>
        </div>

      </div>

      {isOpenModal && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onCloseModal}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {content}
    </div>
  );
};
