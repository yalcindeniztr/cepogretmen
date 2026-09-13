import React from 'react';

interface EmbossedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export const EmbossedButton: React.FC<EmbossedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  icon
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-b from-maarif-500 to-maarif-700 text-white border-t border-white/30 shadow-[0_4px_12px_rgba(12,140,233,0.4),0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] hover:brightness-105',
    secondary: 'bg-gradient-to-b from-white to-slate-100 text-slate-700 border border-slate-200/80 shadow-[3px_3px_8px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] hover:bg-slate-50',
    success: 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white border-t border-white/30 shadow-[0_4px_12px_rgba(16,185,129,0.4),0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] hover:brightness-105',
    warning: 'bg-gradient-to-b from-amber-400 to-amber-600 text-white border-t border-white/30 shadow-[0_4px_12px_rgba(245,158,11,0.4),0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] hover:brightness-105',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-700 text-white border-t border-white/30 shadow-[0_4px_12px_rgba(244,63,94,0.4),0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] hover:brightness-105',
    purple: 'bg-gradient-to-b from-purple-500 to-purple-700 text-white border-t border-white/30 shadow-[0_4px_12px_rgba(168,85,247,0.4),0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] hover:brightness-105'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
