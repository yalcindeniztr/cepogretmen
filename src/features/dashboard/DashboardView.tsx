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
  Users
} from 'lucide-react';
import { AppSettings, PlanItem, LibraryItem, EvaluationScale, MebCalendarReminder } from '../../core/types';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { EmbossedBadge } from '../../components/3d/EmbossedBadge';
import { SpeechService } from '../../services/speech/speechService';
import { ActiveTab } from '../../components/common/Navbar';
import { DepartmentMinutesModal } from '../documents/DepartmentMinutesModal';

interface DashboardViewProps {
  settings: AppSettings;
  plans: PlanItem[];
  libraryItems: LibraryItem[];
  scales: EvaluationScale[];
  reminders: MebCalendarReminder[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectPlan: (plan: PlanItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  plans,
  libraryItems,
  scales,
  reminders,
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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-maarif-900 via-maarif-800 to-sky-800 text-white p-6 sm:p-8 shadow-[0_12px_35px_rgba(12,140,233,0.3)] border border-white/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-200 mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Türkiye Yüzyılı Maarif Modeli Resmi Uyumlu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Hoş Geldiniz, {settings.teacherName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100/90 leading-relaxed">
            <strong>{settings.schoolName}</strong> bünyesinde 9, 10, 11 ve 12. sınıf Tarih dersleri için Maarif Modeli esaslarına göre yıllık ve günlük ders planlarınızı hazırlayabilir, resmi tablolarla Word ve PDF çıktıları alabilirsiniz.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
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

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-4 w-40 h-40 bg-maarif-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3D Vibrant Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EmbossedCard variant="blue" onClick={() => onNavigate('yearly')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Yıllık Planlar</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{yearlyPlans.length}</div>
            <p className="text-xs text-slate-600 mt-1">9-12. Sınıf müfredatı</p>
          </div>
        </EmbossedCard>

        <EmbossedCard variant="emerald" onClick={() => onNavigate('daily')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Günlük Planlar</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{dailyPlans.length}</div>
            <p className="text-xs text-slate-600 mt-1">Ders akışları & etkinlikler</p>
          </div>
        </EmbossedCard>

        <EmbossedCard variant="amber" onClick={() => onNavigate('library')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Materyal & Kitaplık</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Library className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{libraryItems.length}</div>
            <p className="text-xs text-slate-600 mt-1">Kitaplar, MEBİ, EBA, Yönetmelik</p>
          </div>
        </EmbossedCard>

        <EmbossedCard variant="purple" onClick={() => onNavigate('scales')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Ölçme Ölçekleri</span>
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">{scales.length}</div>
            <p className="text-xs text-slate-600 mt-1">Rubrikler ve gözlem formları</p>
          </div>
        </EmbossedCard>
      </div>

      {/* MEB Takvim ve Görev Hatırlatıcıları (Önemli & Sesli) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">MEB Takvimi ve Öğretmen Hatırlatıcıları</h2>
              <p className="text-xs text-slate-600">Zümre, ortak sınav, e-okul ve kulüp dönemleri için akıllı rehberlik</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reminders.slice(0, 3).map((rem) => (
            <EmbossedCard key={rem.id} variant={rem.isUrgent ? 'rose' : 'slate'} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border shadow-sm text-slate-700">
                    {rem.dateStr}
                  </span>
                  {rem.isUrgent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      <AlertCircle className="w-3 h-3" /> Öncelikli
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-3">{rem.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rem.description}</p>
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-700">
                  <span className="font-semibold text-maarif-700">Gereken İşlem:</span> {rem.actionRequired}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => speakReminder(rem)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-maarif-600 hover:text-maarif-800 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Sesli Dinle
                </button>
              </div>
            </EmbossedCard>
          ))}
        </div>
      </div>

      {/* Recent Plans & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Son Hazırlanan Planlar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Kayıtlı Planlar (Son Eklenenler)</h2>
            <button
              onClick={() => onNavigate('yearly')}
              className="text-xs font-bold text-maarif-600 hover:text-maarif-800 flex items-center gap-1 cursor-pointer"
            >
              Tümünü Gör <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {plans.slice(0, 4).map((plan) => (
              <EmbossedCard
                key={plan.id}
                variant="slate"
                onClick={() => onSelectPlan(plan)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      plan.type === 'YEARLY' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {plan.type === 'YEARLY' ? 'Yıllık Plan' : 'Günlük Plan'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      {plan.gradeLevel}. Sınıf Tarih
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{plan.dateRange}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-1">{plan.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-lg">{plan.themeUnit}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-maarif-600 hover:underline">
                    Görüntüle / Çıktı Al →
                  </span>
                </div>
              </EmbossedCard>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Maarif Modeli Tarih İlkeleri */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">Maarif Modeli İlkeleri</h2>
          <EmbossedCard variant="blue" className="space-y-3 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Compass className="w-4 h-4 text-maarif-600" />
              <span>Tarihsel Düşünme Becerileri</span>
            </div>
            <p className="text-slate-600">
              Ezbere dayalı kronoloji yerine; olayların arka planını sorgulayan, birincil elden kanıtları eleştiren ve empati kuran bir tarih anlayışı.
            </p>

            <div className="pt-2 border-t border-blue-200/60">
              <span className="font-bold text-slate-900 block mb-1">Erdem-Değer-Eylem Çerçevesi</span>
              <p className="text-slate-600">
                Adalet, vatanseverlik, kültürel miras ve sorumluluk gibi milli ve evrensel değerlerin her kazanıma doğal biçimde entegre edilmesi.
              </p>
            </div>

            <div className="pt-2 border-t border-blue-200/60">
              <span className="font-bold text-slate-900 block mb-1">Süreç Odaklı Ölçme</span>
              <p className="text-slate-600">
                Sadece sonuç sınavları değil, rubrikler, gözlem formları ve öz değerlendirme ölçekleri ile öğrencinin adım adım gelişimi.
              </p>
            </div>
          </EmbossedCard>

          {/* Zümre Toplantı Tutanakları Kartı */}
          <EmbossedCard variant="slate" onClick={() => setIsMinutesModalOpen(true)} className="cursor-pointer hover:border-maarif-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Resmi Kurul Evrakları</span>
              <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-bold text-slate-900">Tarih Zümre Öğretmenler Kurulu</h3>
              <p className="text-xs text-slate-600 mt-1">
                1. Dönem Başı, 2. Dönem Başı ve Sene Sonu toplantı tutanaklarını 12 maddelik MEB Maarif gündemiyle düzenleyip Word (.docx) olarak indirin.
              </p>
              <div className="mt-3 text-xs font-bold text-maarif-600 flex items-center gap-1">
                Tutanağı Düzenle & İndir →
              </div>
            </div>
          </EmbossedCard>
        </div>
      </div>

      {/* Department Minutes Modal */}
      <DepartmentMinutesModal
        isOpen={isMinutesModalOpen}
        onClose={() => setIsMinutesModalOpen(false)}
        settings={settings}
      />
    </div>
  );
};
