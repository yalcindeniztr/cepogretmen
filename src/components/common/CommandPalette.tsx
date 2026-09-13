import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Calendar,
  FileText,
  FileCheck,
  Library,
  Scale,
  Bot,
  Settings,
  Users,
  Archive,
  Volume2,
  Sparkles,
  ArrowRight,
  X,
  Command
} from 'lucide-react';
import { PlanItem, ExamPaper, LibraryItem } from '../../core/types';
import { ActiveTab } from './Navbar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  plans: PlanItem[];
  exams?: ExamPaper[];
  libraryItems: LibraryItem[];
  onSelectPlan: (plan: PlanItem) => void;
  onOpenMinutesModal: () => void;
  onOpenJarvisBriefing: () => void;
  onExportZip: () => void;
}

interface PaletteItem {
  id: string;
  category: 'MODÜLLER' | 'EYLEMLER' | 'PLANLAR' | 'SINAVLAR' | 'KİTAPLAR';
  title: string;
  subtitle?: string;
  badge?: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  plans,
  exams = [],
  libraryItems,
  onSelectPlan,
  onOpenMinutesModal,
  onOpenJarvisBriefing,
  onExportZip
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // All actionable items
  const allItems: PaletteItem[] = [
    // 1. Modüller
    {
      id: 'mod-yearly',
      category: 'MODÜLLER',
      title: 'Yıllık Planlar',
      subtitle: '9-12. Sınıf 2 Dönemli Maarif Takvimi & Planları',
      badge: 'MEB 37 Hafta',
      icon: <Calendar className="w-4 h-4 text-sky-600" />,
      onSelect: () => { onNavigate('yearly'); onClose(); }
    },
    {
      id: 'mod-daily',
      category: 'MODÜLLER',
      title: 'Günlük Planlar',
      subtitle: '3 Bölümlü Resmi Maarif Günlük Ders Akışları',
      badge: 'Ders Planı',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      onSelect: () => { onNavigate('daily'); onClose(); }
    },
    {
      id: 'mod-exams',
      category: 'MODÜLLER',
      title: 'Açık Uçlu Sınavlar',
      subtitle: '100 Puanlık Dereceli Rubrik & Açık Uçlu Senaryolar',
      badge: 'Yeni Ölçme',
      icon: <FileCheck className="w-4 h-4 text-rose-600" />,
      onSelect: () => { onNavigate('exams'); onClose(); }
    },
    {
      id: 'mod-library',
      category: 'MODÜLLER',
      title: 'Kütüphane & Kitaplar',
      subtitle: 'Tarih MEB Ders Kitapları, MEBİ & EBA',
      badge: '13 Kitap',
      icon: <Library className="w-4 h-4 text-amber-600" />,
      onSelect: () => { onNavigate('library'); onClose(); }
    },
    {
      id: 'mod-scales',
      category: 'MODÜLLER',
      title: 'Ölçme & Değerlendirme',
      subtitle: 'Süreç Odaklı Rubrikler & Gözlem Formları',
      badge: 'Ölçekler',
      icon: <Scale className="w-4 h-4 text-purple-600" />,
      onSelect: () => { onNavigate('scales'); onClose(); }
    },
    {
      id: 'mod-assistant',
      category: 'MODÜLLER',
      title: 'Yapay Zeka Asistanı',
      subtitle: 'Maarif Tarih Uzmanı ile Akıllı Sohbet',
      badge: 'Gemini AI',
      icon: <Bot className="w-4 h-4 text-indigo-600" />,
      onSelect: () => { onNavigate('assistant'); onClose(); }
    },
    {
      id: 'mod-settings',
      category: 'MODÜLLER',
      title: 'Kurum & Ayarlar',
      subtitle: 'Okul Bilgileri, Zümre Başkanı & Sistem Ayarları',
      badge: 'Ayarlar',
      icon: <Settings className="w-4 h-4 text-slate-600" />,
      onSelect: () => { onNavigate('settings'); onClose(); }
    },

    // 2. Hızlı Eylemler
    {
      id: 'act-jarvis',
      category: 'EYLEMLER',
      title: 'Jarvis Sesli Brifingi Başlat',
      subtitle: 'MEB takvimi, sınavlar ve plan durumu hakkında sesli brifing',
      badge: 'Sesli Asistan',
      icon: <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />,
      onSelect: () => { onClose(); onOpenJarvisBriefing(); }
    },
    {
      id: 'act-minutes',
      category: 'EYLEMLER',
      title: 'Zümre Karar Tutanağı Düzenle & İndir',
      subtitle: '12 Maddelik Maarif Zümre Tutanağı (Word .docx)',
      badge: 'Resmi Tutanak',
      icon: <Users className="w-4 h-4 text-sky-600" />,
      onSelect: () => { onClose(); onOpenMinutesModal(); }
    },
    {
      id: 'act-zip',
      category: 'EYLEMLER',
      title: 'Zümre Teslim Paketini İndir (.ZIP)',
      subtitle: 'Tüm yıllık planlar, zümre tutanağı ve teslim dizi pusulası tek arşivde',
      badge: 'ZIP Arşivi',
      icon: <Archive className="w-4 h-4 text-blue-700" />,
      onSelect: () => { onClose(); onExportZip(); }
    },

    // 3. Planlar
    ...plans.map((p) => ({
      id: `plan-${p.id}`,
      category: 'PLANLAR' as const,
      title: p.title,
      subtitle: `${p.gradeLevel}. Sınıf • ${p.themeUnit} • ${p.dateRange}`,
      badge: p.type === 'YEARLY' ? 'Yıllık' : 'Günlük',
      icon: <Calendar className="w-4 h-4 text-blue-500" />,
      onSelect: () => { onClose(); onSelectPlan(p); }
    })),

    // 4. Sınavlar
    ...exams.map((ex) => ({
      id: `exam-${ex.id}`,
      category: 'SINAVLAR' as const,
      title: `${ex.gradeLevel}. Sınıf Tarih ${ex.term} ${ex.examNumber}`,
      subtitle: `${ex.themeUnit} • ${ex.scenario || '10 Soru / 100 Puan'}`,
      badge: 'Açık Uçlu',
      icon: <FileCheck className="w-4 h-4 text-rose-500" />,
      onSelect: () => { onNavigate('exams'); onClose(); }
    })),

    // 5. Kütüphane Kitapları
    ...libraryItems.map((b) => ({
      id: `lib-${b.id}`,
      category: 'KİTAPLAR' as const,
      title: b.title,
      subtitle: `${b.gradeLevel ? b.gradeLevel + '. Sınıf • ' : ''}${b.description || b.category}`,
      badge: b.category,
      icon: <Library className="w-4 h-4 text-amber-500" />,
      onSelect: () => { onNavigate('library'); onClose(); }
    }))
  ];

  // Filter items based on query
  const cleanQ = query.trim().toLowerCase();
  const filteredItems = cleanQ
    ? allItems.filter(
        (it) =>
          it.title.toLowerCase().includes(cleanQ) ||
          (it.subtitle && it.subtitle.toLowerCase().includes(cleanQ)) ||
          it.category.toLowerCase().includes(cleanQ) ||
          (it.badge && it.badge.toLowerCase().includes(cleanQ))
      )
    : allItems;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.8)] border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-sky-50/40">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Modül, sınıf, plan, sınav veya kitap ara... (Örn: 10. Sınıf, Sınav, Zümre)"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-slate-600">Sonuç bulunamadı</p>
              <p className="text-xs text-slate-400 mt-1">
                Farklı bir arama terimi deneyebilir veya menü kategorilerini inceleyebilirsiniz.
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-indigo-500/10 border border-sky-300 text-slate-900 font-semibold shadow-xs'
                      : 'hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 flex-shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 truncate font-normal mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {item.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 text-slate-400 ${isSelected ? 'translate-x-0.5 text-sky-600' : ''}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono shadow-2xs">↓</kbd> Gezin
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono shadow-2xs">Enter</kbd> Seç
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-maarif-700">
            <Command className="w-3 h-3" />
            <span>Maarif Hızlı Komut Paleti</span>
          </div>
        </div>
      </div>
    </div>
  );
};
