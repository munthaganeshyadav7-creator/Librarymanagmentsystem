import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('college_library_user');
      return saved ? JSON.parse(saved) : {
        studentId: 3,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@college.edu',
        phone: '9123456780',
        role: 'STUDENT'
      };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('college_library_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('college_library_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        setUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.data) {
        setUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const quickLogin = (roleType) => {
    if (roleType === 'ADMIN') {
      setUser({
        studentId: 1,
        name: 'System Administrator',
        email: 'admin@library.college.edu',
        phone: '9876543210',
        role: 'ADMIN'
      });
    } else if (roleType === 'LIBRARIAN') {
      setUser({
        studentId: 2,
        name: 'Head Librarian',
        email: 'librarian@library.college.edu',
        phone: '9876543211',
        role: 'LIBRARIAN'
      });
    } else {
      setUser({
        studentId: 3,
        name: 'Aarav Sharma',
        email: 'aarav.sharma@college.edu',
        phone: '9123456780',
        role: 'STUDENT'
      });
    }
  };

  const isStudent = user?.role === 'STUDENT';
  const isAdmin = user?.role === 'ADMIN';
  const isLibrarian = user?.role === 'LIBRARIAN';
  const canManage = isAdmin || isLibrarian;

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      register,
      logout,
      quickLogin,
      isAuthenticated: !!user,
      isStudent,
      isAdmin,
      isLibrarian,
      canManage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
