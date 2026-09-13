import React from 'react';

interface EmbossedBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'emerald' | 'purple' | 'slate' | 'rose';
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export const EmbossedBadge: React.FC<EmbossedBadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
  onClick,
  removable = false,
  onRemove
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200/80 shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.9)]',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.9)]',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.9)]',
    purple: 'bg-purple-50 text-purple-800 border-purple-200/80 shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.9)]',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.9)]',
    rose: 'bg-rose-50 text-rose-800 border-rose-200/80 shadow-[1px_1px_3px_rgba(0,0,0,0.06),-1px_-1px_3px_rgba(255,255,255,0.9)]'
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]} ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
    >
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-red-500 font-bold ml-1"
        >
          ×
        </button>
      )}
    </span>
  );
};
