import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle, onClick }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      glow: 'shadow-indigo-100'
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'shadow-emerald-100'
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'shadow-amber-100'
    },
    rose: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-600',
      border: 'border-rose-100',
      glow: 'shadow-rose-100'
    },
    blue: {
      bg: 'bg-sky-50/70',
      text: 'text-sky-600',
      border: 'border-sky-100',
      glow: 'shadow-sky-100'
    },
    purple: {
      bg: 'bg-purple-50/70',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'shadow-purple-100'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border ${scheme.border} shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
