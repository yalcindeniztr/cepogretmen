import React, { useState } from 'react';
import {
  HeartHandshake,
  Sparkles,
  Download,
  Printer,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { SocialActivityPlanItem, GradeLevel, AppSettings } from '../../core/types';
import { DEFAULT_SOCIAL_ACTIVITIES } from '../../core/constants/twoTermPlanDefaults';
import { GeminiService } from '../../services/ai/geminiService';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface SocialActivitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeLevel: GradeLevel;
  settings: AppSettings;
  onSaveActivity?: (activity: SocialActivityPlanItem) => void;
}

export const SocialActivitiesModal: React.FC<SocialActivitiesModalProps> = ({
  isOpen,
  onClose,
  gradeLevel,
  settings,
  onSaveActivity
}) => {
  if (!isOpen) return null;

  const defaultForGrade = DEFAULT_SOCIAL_ACTIVITIES.find(a => a.gradeLevel === gradeLevel) || {
    id: `social-act-${gradeLevel}`,
    gradeLevel,
    term: gradeLevel === 12 ? '2. Dönem' : '1. Dönem',
    activityTitle: `${gradeLevel}. Sınıf Maarif Sosyal Etkinliği`,
    category: 'MUNAZARA_PANEL',
    maarifValues: ['D19. Vatanseverlik', 'D4. Dayanışma', 'D3. Bilimsellik'],
    targetMonthOrWeek: gradeLevel === 12 ? '2. Dönem Son Ayı (Mayıs/Haziran)' : '1. Dönem Sonu (Ocak Ayı)',
    description: 'Türkiye Yüzyılı Maarif Modeli Erdem-Değer-Eylem çerçevesinde tarih dersi sosyal etkinliği.',
    studentTasks: [
      'Tarihsel kaynakların araştırılması.',
      'Sunum veya pano çalışmasının hazırlanması.',
      'Değerlendirme formunun doldurulması.'
    ],
    expectedOutcomes: 'Tarih bilinci ve değerlerin pekiştirilmesi.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [currentActivity, setCurrentActivity] = useState<SocialActivityPlanItem>(defaultForGrade);
  const [selectedTerm, setSelectedTerm] = useState<'1. Dönem' | '2. Dönem'>(defaultForGrade.term);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  const isGrade12 = gradeLevel === 12;

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const generated = await GeminiService.generateSocialActivityPlan(
        gradeLevel,
        selectedTerm,
        currentActivity.category,
        customTopic
      );
      setCurrentActivity(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (onSaveActivity) {
      onSaveActivity(currentActivity);
    }
    alert('Sosyal Etkinlik Planı başarıyla kaydedildi ve yıllık plana entegre edildi.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <HeartHandshake className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Türkiye Yüzyılı Maarif Modeli • Erdem-Değer-Eylem
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Sosyal Etkinlik Planlama Modülü ({gradeLevel}. Sınıf Tarih)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule Info Banner */}
        <div className="p-3.5 bg-purple-50 border-b border-purple-100 flex items-center gap-2 text-xs text-purple-900">
          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
          {isGrade12 ? (
            <span>
              <strong>12. Sınıf Kuralı:</strong> 12. sınıflarda sosyal etkinlik <strong>2. Dönem son ayında (Mayıs/Haziran)</strong> yer alır.
            </span>
          ) : (
            <span>
              <strong>{gradeLevel}. Sınıf Kuralı:</strong> 1. Dönem sonunda (Ocak) ve 2. Dönem sene sonunda (Haziran) olmak üzere 2 sosyal etkinlik haftası planlanır.
            </span>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
          {/* AI Generator Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 p-4 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-purple-800 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Yapay Zekâ Destekli Sosyal Etkinlik Üretici</span>
              </span>
              <p className="text-slate-600">
                Maarif Modeli erdem ve değerlerine uygun panel, münazara, canlandırma veya milli bayram etkinliği üretin.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Özel konu (isteğe bağlı)..."
                className="px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs w-48 sm:w-60 focus:outline-none focus:border-purple-500"
              />
              <EmbossedButton
                variant="purple"
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleGenerateAI}
                disabled={isGenerating}
              >
                {isGenerating ? 'Üretiliyor...' : 'AI ile Üret'}
              </EmbossedButton>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 uppercase mb-1">Etkinlik Başlığı</label>
                <input
                  type="text"
                  value={currentActivity.activityTitle}
                  onChange={(e) => setCurrentActivity({ ...currentActivity, activityTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Dönem & Zamanı</label>
                <select
                  value={selectedTerm}
                  onChange={(e) => {
                    const t = e.target.value as '1. Dönem' | '2. Dönem';
                    setSelectedTerm(t);
                    setCurrentActivity({ ...currentActivity, term: t });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
                >
                  {!isGrade12 && <option value="1. Dönem">1. Dönem Sonu (Ocak)</option>}
                  <option value="2. Dönem">2. Dönem Sonu (Haziran)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Etkinlik Türü / Kategorisi</label>
                <select
                  value={currentActivity.category}
                  onChange={(e) => setCurrentActivity({ ...currentActivity, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                >
                  <option value="MUNAZARA_PANEL">Münazara, Panel, Çalıştay</option>
                  <option value="MILLI_BAYRAM_ANMA">Milli Bayram ve Anma Programı</option>
                  <option value="MUZE_SERGI">3D Sanal Müze, Sergi & Canlandırma</option>
                  <option value="TARIH_KULUBU">Tarih Kulübü Toplumsal Farkındalık</option>
                  <option value="SOZLU_TARIH">Sözlü Tarih ve Gazilerle Röportaj</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">İlişkili Maarif Değerleri</label>
                <input
                  type="text"
                  value={currentActivity.maarifValues.join(', ')}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      maarifValues: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Etkinlik Açıklaması ve Kapsamı</label>
              <textarea
                rows={3}
                value={currentActivity.description}
                onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Öğrenci Görevleri ve Uygulama Adımları
              </label>
              <textarea
                rows={3}
                value={currentActivity.studentTasks.join('\n')}
                onChange={(e) =>
                  setCurrentActivity({
                    ...currentActivity,
                    studentTasks: e.target.value.split('\n').filter(Boolean)
                  })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Beklenen Çıktılar ve Kazanımlar</label>
              <input
                type="text"
                value={currentActivity.expectedOutcomes}
                onChange={(e) => setCurrentActivity({ ...currentActivity, expectedOutcomes: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {settings.schoolName} • {settings.teacherName}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Kapat
            </button>
            <EmbossedButton variant="purple" size="md" onClick={handleSave}>
              Yıllık Plana Ekle ve Kaydet
            </EmbossedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
