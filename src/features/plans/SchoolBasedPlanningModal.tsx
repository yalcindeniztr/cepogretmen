import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  Download,
  Printer,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  MapPin,
  FileText
} from 'lucide-react';
import { SchoolBasedPlanItem, GradeLevel, AppSettings } from '../../core/types';
import { DEFAULT_SCHOOL_BASED_PLANS } from '../../core/constants/twoTermPlanDefaults';
import { GeminiService } from '../../services/ai/geminiService';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface SchoolBasedPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeLevel: GradeLevel;
  settings: AppSettings;
  onSavePlan?: (plan: SchoolBasedPlanItem) => void;
}

export const SchoolBasedPlanningModal: React.FC<SchoolBasedPlanningModalProps> = ({
  isOpen,
  onClose,
  gradeLevel,
  settings,
  onSavePlan
}) => {
  if (!isOpen) return null;

  const defaultForGrade = DEFAULT_SCHOOL_BASED_PLANS.find(p => p.gradeLevel === gradeLevel) || {
    id: `school-plan-${gradeLevel}`,
    gradeLevel,
    term: '2. Dönem',
    activityTitle: `${gradeLevel}. Sınıf Tarih Okul Temelli Yerel Miras İncelemesi`,
    themeUnit: `TAR.${gradeLevel}.4. Yerel Tarih ve Somut Kültürel Miras`,
    localContext: `${settings.schoolName} çevresindeki tarihi camiler, hanlar, köprüler veya yerel şehitlikler.`,
    objective: 'Öğrencilerin yerel çevredeki tarihi mirası birinci elden inceleyerek koruma bilinci geliştirmesi.',
    learningOutcomes: [
      `TAR.${gradeLevel}.4.1. Çevresindeki somut kültürel miras unsurlarını açıklar.`,
      `TAR.${gradeLevel}.4.2. Kültürel mirasın korunmasında bireysel sorumluluk üstlenir.`
    ],
    implementationSteps: [
      'Zümre öğretmenleri tarafından yerel tarihi eserin belirlenmesi.',
      'Öğrencilere saha inceleme ve fotoğraf çekim rehberi hazırlanması.',
      'Elde edilen bulguların okul panosunda veya dijital sunumda sergilenmesi.'
    ],
    evaluationEvidence: 'Saha gözlem formu, hazırlanan broşür ve dereceli puanlama ölçeği.',
    resources: 'İl Kültür Envanteri, EBA 3D Sanal Müze, Yerel Tarih Yayınları.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [currentPlan, setCurrentPlan] = useState<SchoolBasedPlanItem>(defaultForGrade);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customContext, setCustomContext] = useState('');

  const isGrade12 = gradeLevel === 12;

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const generated = await GeminiService.generateSchoolBasedPlan(
        gradeLevel,
        customContext || currentPlan.localContext,
        currentPlan.themeUnit,
        settings.schoolName
      );
      setCurrentPlan(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (onSavePlan) {
      onSavePlan(currentPlan);
    }
    alert('Okul Temelli Plan başarıyla kaydedildi ve yıllık plana entegre edildi.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Türkiye Yüzyılı Maarif Modeli
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Okul Temelli Planlama Modülü ({gradeLevel}. Sınıf Tarih)
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

        {/* Grade 12 Notice */}
        {isGrade12 ? (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Maarif Müfredat Kuralı (12. Sınıf):</strong> 12. sınıflarda 1. dönem okul temelli planlama yapılmamaktadır. 2. dönem sonunda ise ağırlıklı olarak Sosyal Etkinlik (Cumhuriyet ve Demokrasi Vizyonu) uygulanır. Yine de okulunuzun imkânlarına göre özel bir okul temelli çalışma planlamak isterseniz aşağıdaki formu kullanabilirsiniz.
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>{gradeLevel}. Sınıf Kuralı:</strong> 2. Dönem sene sonundaki ayda (Haziran / 36. Hafta) yıllık plana Okul Temelli Planlama bloğu olarak işlenmektedir.
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
          {/* AI Generator Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Yapay Zekâ ile Okulun Çevre Şartlarına Göre Üret</span>
              </span>
              <p className="text-slate-600">
                Okulunuzun yerel çevresini (tarihi cami, kale, müze, şehitlik) yazarak Maarif modeline uygun tam plan üretin.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Örn: Ballıca çevresindeki tarihi eserler..."
                className="px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs w-48 sm:w-64 focus:outline-none focus:border-emerald-500"
              />
              <EmbossedButton
                variant="success"
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
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Etkinlik Başlığı</label>
              <input
                type="text"
                value={currentPlan.activityTitle}
                onChange={(e) => setCurrentPlan({ ...currentPlan, activityTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Öğrenme Alanı / Tema</label>
                <input
                  type="text"
                  value={currentPlan.themeUnit}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, themeUnit: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Yerel Çevre ve Mekan Bağlamı</label>
                <input
                  type="text"
                  value={currentPlan.localContext}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, localContext: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Görevin / Etkinliğin Amacı</label>
              <textarea
                rows={2}
                value={currentPlan.objective}
                onChange={(e) => setCurrentPlan({ ...currentPlan, objective: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Öğrenme Çıktıları (Her satıra bir çıktı)
              </label>
              <textarea
                rows={3}
                value={currentPlan.learningOutcomes.join('\n')}
                onChange={(e) =>
                  setCurrentPlan({
                    ...currentPlan,
                    learningOutcomes: e.target.value.split('\n').filter(Boolean)
                  })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Uygulama Basamakları ve Süreç
              </label>
              <textarea
                rows={3}
                value={currentPlan.implementationSteps.join('\n')}
                onChange={(e) =>
                  setCurrentPlan({
                    ...currentPlan,
                    implementationSteps: e.target.value.split('\n').filter(Boolean)
                  })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Ölçme ve Değerlendirme Kanıtları</label>
                <input
                  type="text"
                  value={currentPlan.evaluationEvidence}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, evaluationEvidence: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Kullanılacak Kaynaklar & Materyal</label>
                <input
                  type="text"
                  value={currentPlan.resources}
                  onChange={(e) => setCurrentPlan({ ...currentPlan, resources: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
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
            <EmbossedButton variant="success" size="md" onClick={handleSave}>
              Yıllık Plana Ekle ve Kaydet
            </EmbossedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
