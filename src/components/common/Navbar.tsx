import React from 'react';
import {
  BookOpen,
  Calendar,
  FileText,
  Library,
  Scale,
  Bot,
  Settings,
  Sparkles,
  School,
  Volume2,
  FileCheck,
  Search
} from 'lucide-react';
import { AppSettings } from '../../core/types';
import { SpeechService } from '../../services/speech/speechService';

export type ActiveTab = 'dashboard' | 'yearly' | 'daily' | 'exams' | 'library' | 'scales' | 'assistant' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: AppSettings;
  onVoiceReminder: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onVoiceReminder,
  onOpenCommandPalette
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; color: string }> = [
    { id: 'dashboard', label: 'Ana Panel', icon: <Sparkles className="w-4 h-4" />, color: 'from-blue-500 to-indigo-600' },
    { id: 'yearly', label: 'Yıllık Planlar', icon: <Calendar className="w-4 h-4" />, color: 'from-sky-500 to-blue-600' },
    { id: 'daily', label: 'Günlük Planlar', icon: <FileText className="w-4 h-4" />, color: 'from-emerald-500 to-teal-600' },
    { id: 'exams', label: 'Açık Uçlu Sınavlar', icon: <FileCheck className="w-4 h-4" />, color: 'from-rose-500 to-red-600' },
    { id: 'library', label: 'Kütüphane & Kitaplar', icon: <Library className="w-4 h-4" />, color: 'from-amber-500 to-orange-600' },
    { id: 'scales', label: 'Ölçme & Değerlendirme', icon: <Scale className="w-4 h-4" />, color: 'from-purple-500 to-pink-600' },
    { id: 'assistant', label: 'Yapay Zeka Asistanı', icon: <Bot className="w-4 h-4" />, color: 'from-violet-500 to-purple-600' },
    { id: 'settings', label: 'Kurum & Ayarlar', icon: <Settings className="w-4 h-4" />, color: 'from-slate-600 to-slate-800' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Institution */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-maarif-600 via-maarif-500 to-sky-400 flex items-center justify-center text-white shadow-[3px_3px_8px_rgba(12,140,233,0.35),-2px_-2px_6px_rgba(255,255,255,0.8)] border border-white/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-maarif-900 to-maarif-700 bg-clip-text text-transparent">
                  Maarif Planlayıcı
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md border border-blue-200">
                  Tarih 9-12
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <School className="w-3 h-3 text-maarif-600" />
                <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-none">
                  {settings.schoolName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">{settings.teacherName}</span>
              </div>
            </div>
          </div>

          {/* Quick Voice Assistant Trigger & Search */}
          <div className="flex items-center gap-2">
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                title="Hızlı Komut Paleti (Ctrl+K)"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Ara</span>
                <kbd className="hidden md:inline px-1.5 py-0.5 bg-white rounded text-[10px] font-mono text-slate-500 border border-slate-200">
                  Ctrl+K
                </kbd>
              </button>
            )}
            <button
              onClick={onVoiceReminder}
              title="Günün Maarif Hatırlatmasını Sesli Dinle"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-300/80 shadow-[2px_2px_6px_rgba(245,158,11,0.15),-2px_-2px_5px_rgba(255,255,255,0.9)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="hidden sm:inline">Sesli Hatırlat</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap select-none cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-[0_4px_12px_rgba(12,140,233,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
