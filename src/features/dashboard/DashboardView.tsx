import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Library,
  Scale,
  Sparkles,
  Bot,
  AlertCircle,
  Volume2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCheck,
  Users,
  Settings,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  Archive,
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { AppSettings, PlanItem, LibraryItem, EvaluationScale, MebCalendarReminder, ExamPaper } from '../../core/types';
import { HoloSquareCard } from '../../components/3d/HoloSquareCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { SpeechService } from '../../services/speech/speechService';
import { ActiveTab } from '../../components/common/Navbar';
import { DepartmentMinutesModal } from '../documents/DepartmentMinutesModal';
import { CommandPalette } from '../../components/common/CommandPalette';
import { JarvisBriefingModal } from '../../components/speech/JarvisBriefingModal';
import { PortfolioZipService } from '../../services/export/portfolioZipService';

interface DashboardViewProps {
  settings: AppSettings;
  plans: PlanItem[];
  libraryItems: LibraryItem[];
  scales: EvaluationScale[];
  reminders: MebCalendarReminder[];
  exams?: ExamPaper[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectPlan: (plan: PlanItem) => void;
  onOpenCommandPalette?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  plans,
  libraryItems,
  scales,
  reminders,
  exams = [],
  onNavigate,
  onSelectPlan,
  onOpenCommandPalette
}) => {
  const yearlyPlans = plans.filter((p) => p.type === 'YEARLY');
  const dailyPlans = plans.filter((p) => p.type === 'DAILY');

  // Modals state
  const [isMinutesModalOpen, setIsMinutesModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isJarvisModalOpen, setIsJarvisModalOpen] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<string | null>(null);

  const speakReminder = (reminder: MebCalendarReminder) => {
    const speechText = `Hatırlatma: ${reminder.title}. Tarih: ${reminder.dateStr}. ${reminder.description} Yapılması gereken işlem: ${reminder.actionRequired}`;
    SpeechService.speak(speechText);
  };

  const handleExportZip = async () => {
    if (isExportingZip) return;
    try {
      setIsExportingZip(true);
      setZipProgress('Zümre belgeleri hazırlanıyor...');
      await PortfolioZipService.exportFullPortfolioZip(settings, '2024-2025', (status) => {
        setZipProgress(status);
      });
      setTimeout(() => {
        setIsExportingZip(false);
        setZipProgress(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Zümre paketi zip olarak oluşturulurken bir hata oluştu.');
      setIsExportingZip(false);
      setZipProgress(null);
    }
  };

  // Determine smart pulse badges based on calendar and counts
  const hasUrgentExam = reminders.some((r) => r.isUrgent && r.title.toLowerCase().includes('sınav'));
  const hasUrgentMinutes = reminders.some((r) => r.title.toLowerCase().includes('zümre'));

  return (
    <div className="space-y-8 pb-12">
      {/* 1. KULLANICI İSTEĞİ: YAZILAR TAMAMEN KALDIRILDI -> 3D KABARTMA PARILTILI BUTON DOCK'U */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-maarif-950 via-maarif-900 to-sky-950 p-5 sm:p-6 shadow-[0_12px_35px_rgba(12,140,233,0.3)] border border-white/20">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Yıllık Plan Hazırla (Amber/Gold) */}
            <EmbossedButton
              variant="warning"
              size="md"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => onNavigate('yearly')}
            >
              Yıllık Plan Hazırla
            </EmbossedButton>

            {/* Günlük Ders Planı (Zümrüt Yeşil) */}
            <EmbossedButton
              variant="success"
              size="md"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => onNavigate('daily')}
            >
              Günlük Ders Planı
            </EmbossedButton>

            {/* Açık Uçlu Sınav Hazırla (Yakut Kırmızı) */}
            <EmbossedButton
              variant="danger"
              size="md"
              icon={<FileCheck className="w-4 h-4" />}
              onClick={() => onNavigate('exams')}
            >
              Açık Uçlu Sınav Hazırla
            </EmbossedButton>

            {/* Zümre Karar Tutanağı (Gök Mavi) */}
            <EmbossedButton
              variant="primary"
              size="md"
              icon={<Users className="w-4 h-4" />}
              onClick={() => setIsMinutesModalOpen(true)}
            >
              Zümre Karar Tutanağı
            </EmbossedButton>

            {/* Maarif Asistanı ile Konuş (Ametist Mor) */}
            <EmbossedButton
              variant="purple"
              size="md"
              icon={<Bot className="w-4 h-4" />}
              onClick={() => setIsJarvisModalOpen(true)}
            >
              Maarif Asistanı ile Konuş
            </EmbossedButton>

            {/* Kütüphane & Kitaplar */}
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_4px_14px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-400/40 active:scale-95 transition-all cursor-pointer"
            >
              <Library className="w-4 h-4" />
              <span>Kütüphane & Kitaplar</span>
            </button>

            {/* Ölçme & Değerlendirme */}
            <button
              onClick={() => onNavigate('scales')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_4px_14px_rgba(168,85,247,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-purple-400/40 active:scale-95 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Ölçme & Değerlendirme</span>
            </button>

            {/* Kurum & Ayarlar */}
            <button
              onClick={() => onNavigate('settings')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-[0_4px_14px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-slate-600/50 active:scale-95 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Kurum & Ayarlar</span>
            </button>

            {/* 4. MADDE: TEK TIKLA ZÜMRE PAKETİ İNDİR (.ZIP) */}
            <button
              onClick={handleExportZip}
              disabled={isExportingZip}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-[0_4px_14px_rgba(6,182,212,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] border border-cyan-400/40 active:scale-95 transition-all cursor-pointer disabled:opacity-75"
            >
              {isExportingZip ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Paketleniyor...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>Zümre Paketi İndir (.ZIP)</span>
                </>
              )}
            </button>

            {/* 1. MADDE: HIZLI ARAMA & KOMUT PALETİ (Ctrl + K) BUTONU */}
            <button
              onClick={() => (onOpenCommandPalette ? onOpenCommandPalette() : setIsCommandPaletteOpen(true))}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-sky-200 bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-inner border border-white/20 active:scale-95 transition-all cursor-pointer ml-auto"
              title="Hızlı Komut Paleti (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-sky-300" />
              <span>Hızlı Ara</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded text-white border border-white/30">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Zip Progress Indicator */}
          {zipProgress && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-200 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/30 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{zipProgress}</span>
            </div>
          )}
        </div>

        {/* Ambient Hologram Glow Lighting */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-36 top-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. KARE 3D KABARTMA HOLOGRAM PARILTILI GÖLGELİ KESKİN KENARLI KUTULAR (8 Kategori & Bölüm) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-lg text-white shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Maarif Modülü & Hızlı Kontrol Paneli
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tüm modüllere 3D hologram kutular üzerinden tek tıkla ulaşın
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsJarvisModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-300 hover:shadow-xs transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-purple-600" />
              <span>Jarvis Brifingi</span>
            </button>
            <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300">
              8 Aktif Bölüm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {/* 1. Yıllık Planlar */}
          <HoloSquareCard
            title="YILLIK PLANLAR"
            value={yearlyPlans.length > 0 ? `${yearlyPlans.length} Plan` : '2 Dönemli'}
            subtitle="9-12. Sınıf MEB takvimi & planlar"
            badgeText="2 Dönemli"
            pulseBadge={yearlyPlans.length > 0 ? 'Aktif Plan' : undefined}
            icon={<Calendar className="w-5 h-5" />}
            variant="blue"
            actionText="Planları Aç"
            onClick={() => onNavigate('yearly')}
          />

          {/* 2. Günlük Planlar */}
          <HoloSquareCard
            title="GÜNLÜK PLANLAR"
            value={dailyPlans.length > 0 ? `${dailyPlans.length} Plan` : '3 Aşamalı'}
            subtitle="Ders akışları, etkinlikler ve çıktılar"
            badgeText="Kazanım & Çıktı"
            icon={<FileText className="w-5 h-5" />}
            variant="emerald"
            actionText="Planı Aç"
            onClick={() => onNavigate('daily')}
          />

          {/* 3. Açık Uçlu Sınavlar (Akıllı Sınav Bildirim Rozeti Destekli) */}
          <HoloSquareCard
            title="AÇIK UÇLU SINAVLAR"
            value={exams.length > 0 ? `${exams.length} Sınav` : '100 Puan'}
            subtitle="10 soruluk açık uçlu & dereceli rubrik"
            badgeText="Yeni Ölçme"
            pulseBadge={hasUrgentExam ? 'Sınav Haftası!' : undefined}
            icon={<FileCheck className="w-5 h-5" />}
            variant="crimson"
            actionText="Sınav Hazırla"
            onClick={() => onNavigate('exams')}
          />

          {/* 4. Materyal & Kitaplık */}
          <HoloSquareCard
            title="MATERYAL & KİTAPLIK"
            value={libraryItems.length > 0 ? `${libraryItems.length} Kaynak` : '13 Kitap'}
            subtitle="Tarih MEB ders kitapları, MEBİ & EBA"
            badgeText="Resmi Kaynak"
            icon={<Library className="w-5 h-5" />}
            variant="amber"
            actionText="Kitaplığı Aç"
            onClick={() => onNavigate('library')}
          />

          {/* 5. Ölçme Ölçekleri */}
          <HoloSquareCard
            title="ÖLÇME ÖLÇEKLERİ"
            value={scales.length > 0 ? `${scales.length} Ölçek` : 'Süreç Odaklı'}
            subtitle="Gözlem formları, rubrik ve akran ölçekleri"
            badgeText="Süreç Ölçme"
            icon={<Scale className="w-5 h-5" />}
            variant="purple"
            actionText="Ölçekleri Gör"
            onClick={() => onNavigate('scales')}
          />

          {/* 6. Maarif Jarvis Asistanı */}
          <HoloSquareCard
            title="MAARİF ASİSTANI"
            value="Jarvis AI"
            subtitle="Tarih öğretmeni uzman yapay zeka rehberi"
            badgeText="Sesli Brifing"
            pulseBadge="Jarvis Aktif"
            icon={<Bot className="w-5 h-5" />}
            variant="indigo"
            actionText="Asistanı Başlat"
            onClick={() => setIsJarvisModalOpen(true)}
          />

          {/* 7. Zümre Karar Tutanağı */}
          <HoloSquareCard
            title="ZÜMRE TUTANAĞI"
            value="12 Madde"
            subtitle="1-2. Dönem ve sene sonu resmi tutanak"
            badgeText="MEB Formatı"
            pulseBadge={hasUrgentMinutes ? 'Zümre Dönemi' : undefined}
            icon={<Users className="w-5 h-5" />}
            variant="cyan"
            actionText="Düzenle & İndir"
            onClick={() => setIsMinutesModalOpen(true)}
          />

          {/* 8. Kurum & Ayarlar */}
          <HoloSquareCard
            title="KURUM & AYARLAR"
            value="Ballıca MTAL"
            subtitle={`${settings.teacherName} • Zümre Başkanı`}
            badgeText="Sistem & API"
            icon={<Settings className="w-5 h-5" />}
            variant="slate"
            actionText="Ayarları Aç"
            onClick={() => onNavigate('settings')}
          />
        </div>
      </div>

      {/* 3. DÖRT SÜTUNLU ALT BÖLÜM (MEB Takvimi, Kayıtlı Planlar, Maarif İlkeleri, Resmi Kurul Evrakları) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {/* SÜTUN 1: MEB Takvimi ve Öğretmen Hatırlatıcıları */}
        <div className="flex flex-col h-full rounded-2xl border-2 border-rose-200/90 bg-gradient-to-b from-white via-rose-50/30 to-rose-100/40 p-4 sm:p-5 shadow-[0_8px_20px_-4px_rgba(244,63,94,0.15),inset_0_1px_1px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  MEB Takvimi
                </h3>
                <p className="text-[11px] text-slate-500">Öğretmen Hatırlatıcıları</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {reminders.length} Bildirim
            </span>
          </div>

          <div className="mt-4 space-y-3 flex-1">
            {reminders.slice(0, 3).map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-xl bg-white/95 border border-rose-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {rem.dateStr}
                    </span>
                    {rem.isUrgent && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200">
                        <AlertCircle className="w-2.5 h-2.5" /> Öncelikli
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{rem.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">{rem.description}</p>
                  <div className="mt-2 p-1.5 rounded-lg bg-rose-50/70 border border-rose-100 text-[10px] text-rose-950">
                    <span className="font-bold text-rose-700">İşlem:</span> {rem.actionRequired}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => speakReminder(rem)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Sesli Dinle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SÜTUN 2: Kayıtlı Planlar (Son Eklenenler) */}
        <div className="flex flex-col h-full rounded-2xl border-2 border-sky-200/90 bg-gradient-to-b from-white via-sky-50/30 to-sky-100/40 p-4 sm:p-5 shadow-[0_8px_20px_-4px_rgba(2,132,199,0.15),inset_0_1px_1px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between pb-3 border-b border-sky-200/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Kayıtlı Planlar
                </h3>
                <p className="text-[11px] text-slate-500">Son Eklenenler</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('yearly')}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-0.5 cursor-pointer"
            >
              Tümü <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 space-y-3 flex-1">
            {plans.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Henüz kayıtlı plan yok.
                <button
                  onClick={() => onNavigate('yearly')}
                  className="mt-2 block mx-auto text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  Yeni Plan Oluştur
                </button>
              </div>
            ) : (
              plans.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => onSelectPlan(plan)}
                  className="p-3 rounded-xl bg-white/95 border border-sky-200/80 shadow-sm hover:shadow-md hover:border-sky-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        plan.type === 'YEARLY' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {plan.type === 'YEARLY' ? 'Yıllık Plan' : 'Günlük Plan'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {plan.gradeLevel}. Sınıf
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {plan.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{plan.themeUnit}</p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-sky-600">
                    <span>{plan.dateRange}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Görüntüle →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SÜTUN 3: Maarif Modeli İlkeleri */}
        <div className="flex flex-col h-full rounded-2xl border-2 border-purple-200/90 bg-gradient-to-b from-white via-purple-50/30 to-purple-100/40 p-4 sm:p-5 shadow-[0_8px_20px_-4px_rgba(147,51,234,0.15),inset_0_1px_1px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between pb-3 border-b border-purple-200/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Maarif İlkeleri
                </h3>
                <p className="text-[11px] text-slate-500">Tarih Dersi Esasları</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              3 Temel Sütun
            </span>
          </div>

          <div className="mt-4 space-y-2.5 flex-1">
            <div className="p-2.5 rounded-xl bg-white/95 border border-purple-200/80 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Tarihsel Düşünme Becerileri</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Ezbere dayalı kronoloji yerine; birincil kaynak analizi, olaylar arası sebep-sonuç ilişkisi ve tarihsel empati.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/95 border border-purple-200/80 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Erdem-Değer-Eylem Çerçevesi</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Adalet, vatanseverlik, kültürel miras ve sorumluluk gibi milli ve evrensel değerlerin her kazanıma doğal entegrasyonu.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/95 border border-purple-200/80 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                <Scale className="w-3.5 h-3.5 text-sky-600" />
                <span>Süreç Odaklı Ölçme</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Sadece sonuç sınavları değil; dereceli rubrikler, gözlem formları ve öz değerlendirme ile öğrencinin adım adım gelişimi.
              </p>
            </div>
          </div>
        </div>

        {/* SÜTUN 4: Resmi Kurul Evrakları */}
        <div className="flex flex-col h-full rounded-2xl border-2 border-indigo-200/90 bg-gradient-to-b from-white via-indigo-50/30 to-indigo-100/40 p-4 sm:p-5 shadow-[0_8px_20px_-4px_rgba(79,70,229,0.15),inset_0_1px_1px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-200/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-md">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Resmi Kurul Evrakları
                </h3>
                <p className="text-[11px] text-slate-500">Zümre & Tutanaklar</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              MEB Uyumlu
            </span>
          </div>

          <div className="mt-4 space-y-3 flex-1 flex flex-col justify-between">
            {/* Zümre Tutanağı Ana Kartı */}
            <div className="p-3 rounded-xl bg-white/95 border border-indigo-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Tarih Zümresi
                </span>
                <span className="text-[10px] font-bold text-slate-500">12 Gündem</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-2">
                Zümre Öğretmenler Kurulu
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                1. Dönem Başı, 2. Dönem Başı ve Sene Sonu toplantı tutanaklarını Maarif gündemiyle düzenleyin ve Word (.docx) olarak indirin.
              </p>
              <button
                onClick={() => setIsMinutesModalOpen(true)}
                className="mt-3 w-full py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Tutanağı Düzenle & İndir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ZIP Paketi Hızlı İndir Butonu */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-slate-800 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 text-[11px] flex items-center gap-1">
                  <Archive className="w-3.5 h-3.5 text-sky-600" />
                  Tam Zümre Dosyası (.ZIP)
                </span>
                <span className="text-[10px] font-bold text-sky-600">Tek Tıkla</span>
              </div>
              <p className="text-[10px] text-slate-600">
                Tüm yıllık planlar, zümre tutanağı ve teslim dizi pusulası arşivde toplanır.
              </p>
              <button
                onClick={handleExportZip}
                disabled={isExportingZip}
                className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-75"
              >
                {isExportingZip ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3" />}
                <span>{isExportingZip ? 'İndiriliyor...' : 'ZIP Olarak İndir'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MODALLER (Zümre Tutanağı, Komut Paleti, Jarvis Asistanı) */}
      <DepartmentMinutesModal
        isOpen={isMinutesModalOpen}
        onClose={() => setIsMinutesModalOpen(false)}
        settings={settings}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={onNavigate}
        plans={plans}
        exams={exams}
        libraryItems={libraryItems}
        onSelectPlan={onSelectPlan}
        onOpenMinutesModal={() => setIsMinutesModalOpen(true)}
        onOpenJarvisBriefing={() => setIsJarvisModalOpen(true)}
        onExportZip={handleExportZip}
      />

      <JarvisBriefingModal
        isOpen={isJarvisModalOpen}
        onClose={() => setIsJarvisModalOpen(false)}
        settings={settings}
        plans={plans}
        exams={exams}
        scales={scales}
        reminders={reminders}
        onNavigate={onNavigate}
        onOpenMinutesModal={() => setIsMinutesModalOpen(true)}
        onExportZip={handleExportZip}
      />
    </div>
  );
};
