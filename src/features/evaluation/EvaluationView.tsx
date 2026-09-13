import React, { useState } from 'react';
import {
  Scale,
  Download,
  Printer,
  Plus,
  CheckSquare,
  Award,
  FileText
} from 'lucide-react';
import { EvaluationScale, AppSettings, PerformanceTaskItem } from '../../core/types';
import { DEFAULT_PERFORMANCE_TASKS } from '../../core/constants/performanceTasks';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';

interface EvaluationViewProps {
  scales: EvaluationScale[];
  settings: AppSettings;
  onAddScale: (scale: EvaluationScale) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  scales,
  settings,
  onAddScale
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'SCALES' | 'PERFORMANCE'>('PERFORMANCE');
  const [selectedScale, setSelectedScale] = useState<EvaluationScale>(scales[0]);
  const [isCreatingScale, setIsCreatingScale] = useState(false);

  // Performance Tasks state
  const [performanceTasks] = useState<PerformanceTaskItem[]>(DEFAULT_PERFORMANCE_TASKS);
  const [selectedTaskGrade, setSelectedTaskGrade] = useState<number | 'ALL'>('ALL');
  const [selectedTask, setSelectedTask] = useState<PerformanceTaskItem>(DEFAULT_PERFORMANCE_TASKS[0]);

  // New scale form state
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [instructions, setInstructions] = useState('');
  const [criteriaText, setCriteriaText] = useState(
    'Tarihsel Bağlamı Kavrama|Olayı döneminin şartları ve zihniyetiyle ilişkilendirir.|25\nKaynak ve Kanıt Analizi|Belgenin güvenilirliğini ve amacını sorgular.|25\nNeden-Sonuç İlişkisi|Olayların birbirini tetikleyen sebeplerini açıklar.|25\nDil ve Tarih Terminolojisi|Kavramları yerinde ve doğru kullanır.|25'
  );

  const handleCreateScale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedCriteria = criteriaText
      .split('\n')
      .map(line => {
        const parts = line.split('|');
        return {
          dimension: parts[0]?.trim() || 'Boyut',
          description: parts[1]?.trim() || 'Açıklama',
          maxScore: Number(parts[2]?.trim()) || 20
        };
      })
      .filter(c => c.dimension);

    const newScale: EvaluationScale = {
      id: `scale-custom-${Date.now()}`,
      title: title.trim(),
      gradeLevel: 'Tümü',
      type: 'RUBRIK',
      purpose: purpose.trim() || 'Öğrenci beceri ve süreç gelişimini değerlendirme.',
      instructions: instructions.trim() || 'Ölçütler 100 tam puan üzerinden değerlendirilir.',
      criteria: parsedCriteria
    };

    onAddScale(newScale);
    setSelectedScale(newScale);
    setIsCreatingScale(false);
    setTitle('');
    setPurpose('');
  };

  const filteredTasks = selectedTaskGrade === 'ALL'
    ? performanceTasks
    : performanceTasks.filter(t => t.gradeLevel === selectedTaskGrade);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-purple-600" />
            <span>Süreç Odaklı Ölçme & Değerlendirme</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Türkiye Yüzyılı Maarif Modeli performans görevleri, 5 ölçütlü dereceli puanlama anahtarları (rubrikler) ve gözlem formları.
          </p>
        </div>

        {activeSubTab === 'SCALES' && (
          <EmbossedButton
            variant="purple"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreatingScale(true)}
          >
            Yeni Değerlendirme Ölçeği
          </EmbossedButton>
        )}
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSubTab('PERFORMANCE')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'PERFORMANCE'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-purple-600" />
          <span>Maarif Performans Görevleri (9-12. Sınıf)</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-100 text-purple-800 font-extrabold">
            {performanceTasks.length} Görev
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('SCALES')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'SCALES'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-purple-600" />
          <span>Süreç Değerlendirme Ölçekleri & Rubrikler</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-200 text-slate-700 font-extrabold">
            {scales.length} Ölçek
          </span>
        </button>
      </div>

      {/* SUB-TAB 1: PERFORMANCE TASKS (MODÜL 4) */}
      {activeSubTab === 'PERFORMANCE' && (
        <div className="space-y-6">
          {/* Grade Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Sınıf Düzeyi:</span>
            <button
              onClick={() => setSelectedTaskGrade('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedTaskGrade === 'ALL'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tümü (9-12)
            </button>
            {[9, 10, 11, 12].map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedTaskGrade(grade)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedTaskGrade === grade
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {grade}. Sınıf Tarih
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task List (Left) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Performans Görevleri ({filteredTasks.length})
              </h3>

              {filteredTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <EmbossedCard
                    key={task.id}
                    variant={isSelected ? 'purple' : 'slate'}
                    onClick={() => setSelectedTask(task)}
                    className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {task.gradeLevel}. Sınıf • {task.term}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {task.deadlineWeeks} Hafta Süre
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{task.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{task.themeUnit}</p>
                    <div className="mt-2 text-[11px] text-purple-700 font-semibold">
                      5 Ölçütlü Rubrik (100 Puan) →
                    </div>
                  </EmbossedCard>
                );
              })}
            </div>

            {/* Selected Task Details & Export Box (Right) */}
            <div className="lg:col-span-2 space-y-4">
              {selectedTask ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                  {/* Header & Export Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                          {selectedTask.gradeLevel}. Sınıf Tarih • {selectedTask.term}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{settings.schoolName}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                        {selectedTask.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => DocxExportService.exportPerformanceTaskToWord(selectedTask, settings)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span>Word (.docx) İndir</span>
                      </button>

                      <button
                        onClick={() => PdfPrintService.printPerformanceTask(selectedTask, settings)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-emerald-600" />
                        <span>PDF / Yazdır</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Öğrenme Alanı / Tema:</span>
                      <p className="text-slate-700 font-medium">{selectedTask.themeUnit}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Görevin Amacı:</span>
                      <p className="text-slate-600">{selectedTask.objective}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Teslim Formatı:</span>
                      <p className="text-slate-600">{selectedTask.submissionFormat}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Hazırlama Süresi:</span>
                      <p className="text-slate-600">{selectedTask.deadlineWeeks} Hafta</p>
                    </div>
                  </div>

                  {/* Student Instruction Steps */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Öğrenci Yönergesi ve Görev Basamakları</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedTask.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs p-2.5 bg-purple-50/40 rounded-xl border border-purple-100">
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rubric Criteria Table (5 Criterions = 100 Points) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-purple-600" />
                        <span>Dereceli Puanlama Anahtarı (Rubrik - 100 Puan)</span>
                      </h4>
                      <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                        Toplam: {selectedTask.rubricCriteria.reduce((sum, c) => sum + c.points, 0)} Puan
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3 w-10 text-center">No</th>
                            <th className="p-3 w-1/3">Değerlendirme Ölçütü</th>
                            <th className="p-3">Gösterge / Başarı Açıklaması</th>
                            <th className="p-3 w-24 text-center">Puan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {selectedTask.rubricCriteria.map((crit, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="p-3 font-bold text-center text-slate-500">{idx + 1}</td>
                              <td className="p-3 font-bold text-slate-800">{crit.title}</td>
                              <td className="p-3 text-slate-600 leading-relaxed">{crit.description}</td>
                              <td className="p-3 font-extrabold text-center text-purple-700 bg-purple-50/50">
                                {crit.points} Puan
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Signatures Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Ders Öğretmeni: <strong>{settings.teacherName}</strong></span>
                    <span>Okul Müdürü: <strong>{settings.principalName}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">Lütfen soldan bir görev seçin.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EXISTING PROCESS EVALUATION SCALES */}
      {activeSubTab === 'SCALES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scales Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kayıtlı Maarif Ölçekleri
            </h3>

            {scales.map((scale) => {
              const isSelected = selectedScale?.id === scale.id;
              return (
                <EmbossedCard
                  key={scale.id}
                  variant={isSelected ? 'purple' : 'slate'}
                  onClick={() => setSelectedScale(scale)}
                  className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {scale.type === 'RUBRIK' ? 'Rubrik (Puanlama Anahtarı)' : 'Gözlem Formu'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {scale.criteria.length} Ölçüt
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{scale.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{scale.purpose}</p>
                </EmbossedCard>
              );
            })}
          </div>

          {/* Selected Scale Detail & Export Box */}
          <div className="lg:col-span-2 space-y-4">
            {selectedScale ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                {/* Header & Export Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                      {settings.schoolName} • Tarih Dersi
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {selectedScale.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => DocxExportService.exportScaleToWord(selectedScale, settings)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>Word (.docx) İndir</span>
                    </button>

                    <button
                      onClick={() => PdfPrintService.printScale(selectedScale, settings)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-600" />
                      <span>PDF / Yazdır</span>
                    </button>
                  </div>
                </div>

                {/* Purpose & Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Değerlendirmenin Amacı:</span>
                    <p className="text-slate-600">{selectedScale.purpose}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Uygulama Yönergesi:</span>
                    <p className="text-slate-600">{selectedScale.instructions}</p>
                  </div>
                </div>

                {/* Criteria Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Değerlendirme Ölçütleri ve Puan Dağılımı
                  </h4>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-12 text-center">No</th>
                          <th className="p-3 w-1/3">Değerlendirme Boyutu</th>
                          <th className="p-3">Ölçüt / Gösterge Açıklaması</th>
                          <th className="p-3 w-24 text-center">Maks. Puan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedScale.criteria.map((crit, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-3 font-bold text-center text-slate-500">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-800">{crit.dimension}</td>
                            <td className="p-3 text-slate-600">{crit.description}</td>
                            <td className="p-3 font-extrabold text-center text-purple-700">
                              {crit.maxScore} Puan
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-purple-50 font-bold text-purple-900">
                        <tr>
                          <td colSpan={3} className="p-3 text-right">Toplam Puan:</td>
                          <td className="p-3 text-center text-sm">
                            {selectedScale.criteria.reduce((acc, c) => acc + c.maxScore, 0)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Signatures Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Ders Öğretmeni: <strong>{settings.teacherName}</strong></span>
                  <span>Okul Müdürü: <strong>{settings.principalName}</strong></span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">Lütfen soldan bir ölçek seçin.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Custom Scale */}
      {isCreatingScale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Yeni Değerlendirme Ölçeği Oluştur</span>
            </h3>

            <form onSubmit={handleCreateScale} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ölçek Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Tarihsel Harita Analizi ve Yorumlama Rubriği"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Değerlendirmenin Amacı</label>
                <input
                  type="text"
                  placeholder="Öğrencinin tarihi haritalar üzerindeki çıkarımlarını ölçme..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ölçütler (Format: Boyut|Açıklama|Puan)</label>
                <textarea
                  rows={5}
                  value={criteriaText}
                  onChange={(e) => setCriteriaText(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Her satıra bir ölçüt giriniz. Dikey çizgi (|) ile Boyut, Açıklama ve Puanı ayırınız.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingScale(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Vazgeç
                </button>
                <EmbossedButton variant="purple" size="md" type="submit">
                  Ölçeği Kaydet
                </EmbossedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
