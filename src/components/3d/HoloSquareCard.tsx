import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export type HoloVariant = 'blue' | 'emerald' | 'crimson' | 'amber' | 'purple' | 'indigo' | 'cyan' | 'slate';

interface HoloSquareCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  badgeText?: string;
  icon: React.ReactNode;
  variant?: HoloVariant;
  actionText?: string;
  onClick?: () => void;
  className?: string;
}

const variantConfig: Record<
  HoloVariant,
  {
    bgGradient: string;
    borderStyle: string;
    shadowStyle: string;
    hoverGlow: string;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    titleColor: string;
    accentLine: string;
  }
> = {
  blue: {
    bgGradient: 'from-sky-50/95 via-white/95 to-blue-100/70',
    borderStyle: 'border-sky-300/80 border-t-white border-b-sky-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(2,132,199,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(2,132,199,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(2,132,199,0.35),0_0_20px_rgba(56,189,248,0.35)] hover:border-sky-400',
    iconBg: 'bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-500 text-white shadow-[0_4px_12px_rgba(2,132,199,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-sky-100/90 border border-sky-300/80 shadow-sm',
    badgeText: 'text-sky-800',
    titleColor: 'text-sky-900',
    accentLine: 'from-sky-400 via-blue-500 to-transparent',
  },
  emerald: {
    bgGradient: 'from-emerald-50/95 via-white/95 to-teal-100/70',
    borderStyle: 'border-emerald-300/80 border-t-white border-b-emerald-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(5,150,105,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(5,150,105,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(5,150,105,0.35),0_0_20px_rgba(52,211,153,0.35)] hover:border-emerald-400',
    iconBg: 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-emerald-100/90 border border-emerald-300/80 shadow-sm',
    badgeText: 'text-emerald-800',
    titleColor: 'text-emerald-900',
    accentLine: 'from-emerald-400 via-teal-500 to-transparent',
  },
  crimson: {
    bgGradient: 'from-rose-50/95 via-white/95 to-red-100/70',
    borderStyle: 'border-rose-300/80 border-t-white border-b-rose-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(225,29,72,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(225,29,72,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(225,29,72,0.35),0_0_20px_rgba(251,113,133,0.35)] hover:border-rose-400',
    iconBg: 'bg-gradient-to-tr from-rose-600 via-red-600 to-amber-600 text-white shadow-[0_4px_12px_rgba(225,29,72,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-rose-100/90 border border-rose-300/80 shadow-sm',
    badgeText: 'text-rose-800',
    titleColor: 'text-rose-900',
    accentLine: 'from-rose-400 via-red-500 to-transparent',
  },
  amber: {
    bgGradient: 'from-amber-50/95 via-white/95 to-yellow-100/70',
    borderStyle: 'border-amber-300/80 border-t-white border-b-amber-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(217,119,6,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(217,119,6,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(217,119,6,0.35),0_0_20px_rgba(251,191,36,0.35)] hover:border-amber-400',
    iconBg: 'bg-gradient-to-tr from-amber-500 via-yellow-600 to-orange-500 text-white shadow-[0_4px_12px_rgba(217,119,6,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-amber-100/90 border border-amber-300/80 shadow-sm',
    badgeText: 'text-amber-900',
    titleColor: 'text-amber-950',
    accentLine: 'from-amber-400 via-orange-500 to-transparent',
  },
  purple: {
    bgGradient: 'from-purple-50/95 via-white/95 to-fuchsia-100/70',
    borderStyle: 'border-purple-300/80 border-t-white border-b-purple-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(147,51,234,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(147,51,234,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(147,51,234,0.35),0_0_20px_rgba(192,132,252,0.35)] hover:border-purple-400',
    iconBg: 'bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-[0_4px_12px_rgba(147,51,234,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-purple-100/90 border border-purple-300/80 shadow-sm',
    badgeText: 'text-purple-800',
    titleColor: 'text-purple-900',
    accentLine: 'from-purple-400 via-fuchsia-500 to-transparent',
  },
  indigo: {
    bgGradient: 'from-indigo-50/95 via-white/95 to-violet-100/70',
    borderStyle: 'border-indigo-300/80 border-t-white border-b-indigo-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(79,70,229,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(79,70,229,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(79,70,229,0.35),0_0_20px_rgba(129,140,248,0.35)] hover:border-indigo-400',
    iconBg: 'bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-indigo-100/90 border border-indigo-300/80 shadow-sm',
    badgeText: 'text-indigo-800',
    titleColor: 'text-indigo-900',
    accentLine: 'from-indigo-400 via-violet-500 to-transparent',
  },
  cyan: {
    bgGradient: 'from-cyan-50/95 via-white/95 to-sky-100/70',
    borderStyle: 'border-cyan-300/80 border-t-white border-b-cyan-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(6,182,212,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(6,182,212,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(6,182,212,0.35),0_0_20px_rgba(34,211,238,0.35)] hover:border-cyan-400',
    iconBg: 'bg-gradient-to-tr from-cyan-600 via-teal-600 to-sky-600 text-white shadow-[0_4px_12px_rgba(6,182,212,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-cyan-100/90 border border-cyan-300/80 shadow-sm',
    badgeText: 'text-cyan-800',
    titleColor: 'text-cyan-900',
    accentLine: 'from-cyan-400 via-teal-500 to-transparent',
  },
  slate: {
    bgGradient: 'from-slate-50/95 via-white/95 to-slate-100/70',
    borderStyle: 'border-slate-300/80 border-t-white border-b-slate-400/40',
    shadowStyle: 'shadow-[0_8px_20px_-4px_rgba(71,85,105,0.18),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(71,85,105,0.08)]',
    hoverGlow: 'hover:shadow-[0_16px_32px_-4px_rgba(71,85,105,0.3),0_0_20px_rgba(148,163,184,0.3)] hover:border-slate-400',
    iconBg: 'bg-gradient-to-tr from-slate-700 via-slate-600 to-zinc-500 text-white shadow-[0_4px_12px_rgba(71,85,105,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]',
    iconColor: 'text-white',
    badgeBg: 'bg-slate-100/90 border border-slate-300/80 shadow-sm',
    badgeText: 'text-slate-800',
    titleColor: 'text-slate-900',
    accentLine: 'from-slate-400 via-zinc-500 to-transparent',
  },
};

export const HoloSquareCard: React.FC<HoloSquareCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  icon,
  variant = 'blue',
  actionText,
  onClick,
  className = '',
}) => {
  const conf = variantConfig[variant];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border-2 bg-gradient-to-br ${conf.bgGradient} ${conf.borderStyle} ${conf.shadowStyle} ${conf.hoverGlow} backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.015] select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* Hologram Prismatic Shimmer Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 pointer-events-none -translate-x-full" />

      {/* Subtle Upper Bevel Reflection */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

      {/* Top Header Row: Category Name + Hologram Icon */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-black tracking-wider uppercase ${conf.titleColor}`}>
              {title}
            </span>
            <Sparkles className="w-3 h-3 text-amber-500 opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          {badgeText && (
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${conf.badgeBg} ${conf.badgeText}`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* 3D Embossed Icon Square Box */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center p-2.5 ${conf.iconBg} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 flex-shrink-0 border border-white/40`}
        >
          {icon}
        </div>
      </div>

      {/* Middle: Prominent Metric / Key Feature Value */}
      <div className="my-3 relative z-10">
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-black transition-colors">
          {value}
        </div>
        <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1 leading-snug">
          {subtitle}
        </p>
      </div>

      {/* Bottom Row: Holographic Accent Divider & Action Link */}
      <div className="relative z-10 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
        <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${conf.accentLine}`} />
        <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-950 flex items-center gap-1 transition-colors">
          {actionText || 'Aç'}
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </div>
  );
};
