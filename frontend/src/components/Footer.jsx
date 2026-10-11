import React from 'react';
import { Library, Heart, Shield, Code, Database, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">College Library Management System</div>
              <div className="text-[11px] text-slate-400">Technical Training Project (Java Full Stack)</div>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">Spring Boot 3.3</span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">MySQL / JPA</span>
            <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">React + Vite</span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700">Maven</span>
            <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">Postman Verified</span>
          </div>

        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© 2026 College Library Management System. Designed for Scalable Institutional Automation.</p>
          <div className="flex items-center space-x-4">
            <span>Student Registration</span>
            <span>•</span>
            <span>Book Inventory</span>
            <span>•</span>
            <span>Overdue Fine Management</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
