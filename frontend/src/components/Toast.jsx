import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message } = toast;

  const styles = {
    success: 'bg-emerald-900/90 text-white border-emerald-700 shadow-emerald-900/20',
    error: 'bg-rose-900/90 text-white border-rose-700 shadow-rose-900/20',
    info: 'bg-slate-900/90 text-white border-slate-700 shadow-slate-900/20'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-300 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-xl text-sm font-medium ${styles[type] || styles.info}`}>
        {icons[type] || icons.info}
        <span className="flex-1 leading-snug">{message}</span>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};
