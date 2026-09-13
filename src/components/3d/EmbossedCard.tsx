import React from 'react';

interface EmbossedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const EmbossedCard: React.FC<EmbossedCardProps> = ({
  children,
  className = '',
  variant = 'slate',
  hoverEffect = true,
  onClick
}) => {
  const variantStyles = {
    slate: 'bg-white/90 border-slate-200/80 shadow-[4px_4px_12px_rgba(0,0,0,0.06),-3px_-3px_10px_rgba(255,255,255,0.9)]',
    blue: 'bg-gradient-to-br from-white via-sky-50/70 to-blue-100/60 border-blue-200/80 shadow-[5px_5px_15px_rgba(12,140,233,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]',
    emerald: 'bg-gradient-to-br from-white via-emerald-50/70 to-emerald-100/60 border-emerald-200/80 shadow-[5px_5px_15px_rgba(16,185,129,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]',
    amber: 'bg-gradient-to-br from-white via-amber-50/70 to-amber-100/60 border-amber-200/80 shadow-[5px_5px_15px_rgba(245,158,11,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]',
    purple: 'bg-gradient-to-br from-white via-purple-50/70 to-purple-100/60 border-purple-200/80 shadow-[5px_5px_15px_rgba(168,85,247,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]',
    rose: 'bg-gradient-to-br from-white via-rose-50/70 to-rose-100/60 border-rose-200/80 shadow-[5px_5px_15px_rgba(244,63,94,0.12),-3px_-3px_10px_rgba(255,255,255,0.9)]'
  };

  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_20px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,1)]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 backdrop-blur-sm ${variantStyles[variant]} ${hoverClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
