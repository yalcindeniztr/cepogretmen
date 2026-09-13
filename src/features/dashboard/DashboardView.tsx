import React from 'react';
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
  Layers
} from 'lucide-react';
import { AppSettings, PlanItem, LibraryItem, EvaluationScale, MebCalendarReminder, ExamPaper } from '../../core/types';
import { HoloSquareCard } from '../../components/3d/HoloSquareCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { SpeechService } from '../../services/speech/speechService';
import { ActiveTab } from '../../components/common/Navbar';
import { DepartmentMinutesModal } from '../documents/DepartmentMinutesModal';

interface DashboardViewProps {
  settings: AppSettings;
  plans: PlanItem[];
  libraryItems: LibraryItem[];
  scales: EvaluationScale[];
  reminders: MebCalendarReminder[];
  exams?: ExamPaper[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectPlan: (plan: PlanItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  plans,
  libraryItems,
  scales,
  reminders,
  exams = [],
  onNavigate,
  onSelectPlan
}) => {
  const yearlyPlans = plans.filter(p => p.type === 'YEARLY');
  const dailyPlans = plans.filter(p => p.type === 'DAILY');
  const [isMinutesModalOpen, setIsMinutesModalOpen] = React.useState(false);

  const speakReminder = (reminder: MebCalendarReminder) => {
    const speechText = `Hatırlatma: ${reminder.title}. Tarih: ${reminder.dateStr}. ${reminder.description} Yapılması gereken işlem: ${reminder.actionRequired}`;
    SpeechService.speak(speechText);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hoş Geldiniz & Hızlı Eylem Banner'ı (2. Resimdeki Üst Bölüm) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-maarif-950 via-maarif-900 to-sky-900 text-white p-6 sm:p-8 shadow-[0_14px_35px_rgba(12,140,233,0.35)] border border-white/20">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 mb-3.5 border border-white/20 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-sky-300" />
            <span>Türkiye Yüzyılı Maarif Modeli Resmi Uyumlu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Hoş Geldiniz, {settings.teacherName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-3xl">
            <strong>{settings.schoolName}</strong> bünyesinde 9, 10, 11 ve 12. sınıf Tarih dersleri için Maarif Modeli esaslarına göre yıllık ve günlük ders planlarınızı hazırlayabilir, resmi tablolarla Word ve PDF çıktıları alabilirsiniz.
          </p>

          {/* Hızlı Erişim Eylem Butonları */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <EmbossedButton
              variant="warning"
              size="md"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => onNavigate('yearly')}
            >
              Yıllık Plan Hazırla
            </EmbossedButton>
            <EmbossedButton
              variant="success"
              size="md"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => onNavigate('daily')}
            >
              Günlük Ders Planı
            </EmbossedButton>
            <EmbossedButton
              variant="danger"
              size="md"
              icon={<FileCheck className="w-4 h-4" />}
              onClick={() => onNavigate('exams')}
            >
              Açık Uçlu Sınav Hazırla
            </EmbossedButton>
            <EmbossedButton
              variant="primary"
              size="md"
              icon={<Users className="w-4 h-4" />}
              onClick={() => setIsMinutesModalOpen(true)}
            >
              Zümre Karar Tutanağı
            </EmbossedButton>
            <EmbossedButton
              variant="purple"
              size="md"
              icon={<Bot className="w-4 h-4" />}
              onClick={() => onNavigate('assistant')}
            >
              Maarif Asistanı ile Konuş
            </EmbossedButton>
          </div>
        </div>

        {/* Ambient Hologram Glow Lighting */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
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
          <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300">
            8 Aktif Bölüm
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {/* 1. Yıllık Planlar */}
          <HoloSquareCard
            title="YILLIK PLANLAR"
            value={yearlyPlans.length > 0 ? `${yearlyPlans.length} Plan` : '2 Dönemli'}
            subtitle="9-12. Sınıf MEB takvimi & planlar"
            badgeText="2 Dönemli"
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

          {/* 3. Açık Uçlu Sınavlar */}
          <HoloSquareCard
            title="AÇIK UÇLU SINAVLAR"
            value={exams.length > 0 ? `${exams.length} Sınav` : '100 Puan'}
            subtitle="10 soruluk açık uçlu & dereceli rubrik"
            badgeText="Yeni Ölçme"
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

          {/* 6. Maarif Asistanı */}
          <HoloSquareCard
            title="MAARİF ASİSTANI"
            value="AI Tarih"
            subtitle="Tarih öğretmeni uzman yapay zeka rehberi"
            badgeText="Akıllı Sohbet"
            icon={<Bot className="w-5 h-5" />}
            variant="indigo"
            actionText="Asistanla Konuş"
            onClick={() => onNavigate('assistant')}
          />

          {/* 7. Zümre Karar Tutanağı */}
          <HoloSquareCard
            title="ZÜMRE TUTANAĞI"
            value="12 Madde"
            subtitle="1-2. Dönem ve sene sonu resmi tutanak"
            badgeText="MEB Formatı"
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
                  className="mt-2 block mx-auto text-xs font-bold text-sky-600 hover:underline"
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

            {/* Okul Temelli & Sosyal Etkinlik Kılavuzu */}
            <div className="p-3 rounded-xl bg-white/90 border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-[11px]">Sosyal & Okul Temelli Plan</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Yıllık plana entegre modüller</div>
              </div>
              <button
                onClick={() => onNavigate('yearly')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Git →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zümre Tutanağı Modalı */}
      <DepartmentMinutesModal
        isOpen={isMinutesModalOpen}
        onClose={() => setIsMinutesModalOpen(false)}
        settings={settings}
      />
    </div>
  );
};
