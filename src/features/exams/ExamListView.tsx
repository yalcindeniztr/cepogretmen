import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Download,
  Printer,
  Trash2,
  Edit,
  Filter,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ExamPaper, GradeLevel, AppSettings } from '../../core/types';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { EmbossedBadge } from '../../components/3d/EmbossedBadge';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';

interface ExamListViewProps {
  exams: ExamPaper[];
  settings: AppSettings;
  onOpenCreate: () => void;
  onSelectExam: (exam: ExamPaper) => void;
  onDeleteExam: (id: string) => void;
}

export const ExamListView: React.FC<ExamListViewProps> = ({
  exams,
  settings,
  onOpenCreate,
  onSelectExam,
  onDeleteExam
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [selectedTerm, setSelectedTerm] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  const filteredExams = exams
    .filter(e => (selectedGrade === 'ALL' ? true : e.gradeLevel === selectedGrade))
    .filter(e => (selectedTerm === 'ALL' ? true : e.term === selectedTerm))
    .filter(e => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        e.themeUnit.toLowerCase().includes(q) ||
        e.scenario.toLowerCase().includes(q) ||
        e.topics.some(t => t.toLowerCase().includes(q)) ||
        e.questions.some(qu => qu.questionText.toLowerCase().includes(q) || qu.learningOutcome.toLowerCase().includes(q))
      );
    });

  const toggleExpand = (id: string) => {
    setExpandedExamId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileCheck className="w-7 h-7 text-rose-600" />
            <span>Açık Uçlu ve Bağlamlı Sınavlar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Türkiye Yüzyılı Maarif Modeli Ölçme Yönetmeliğine uygun, senaryo ve kaynak temelli sınavlar ve dereceli rubrikler.
          </p>
        </div>

        <EmbossedButton
          variant="danger"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreate}
        >
          Yeni Sınav Oluştur (Yapay Zeka)
        </EmbossedButton>
      </div>

      {/* Official MEB Assessment Notice Banner */}
      <div className="flex items-start gap-3.5 p-4 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border border-rose-200/80 rounded-2xl shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-rose-950 flex items-center gap-2">
            <span>MEB Yeni Ölçme ve Değerlendirme Esasları</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold">
              %100 AÇIK UÇLU
            </span>
          </h3>
          <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
            Yeni yönetmelik gereği ortak sınavlarda çoktan seçmeli soru sorulamaz. Tüm sorular bir tarihsel metin, kitabe veya senaryo bağlamına dayalı açık uçlu sorulardan ve dereceli puanlama anahtarından (rubrik) oluşur.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Grade Filter */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sınıf:
            </span>
            {(['ALL', 9, 10, 11, 12] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grade === 'ALL' ? 'Tümü' : `${grade}. Sınıf`}
              </button>
            ))}
          </div>

          {/* Term Filter */}
          <div className="flex items-center gap-1 overflow-x-auto border-l pl-3 border-slate-200">
            <span className="text-xs font-bold text-slate-500 mr-1">Dönem:</span>
            {(['ALL', '1. Dönem', '2. Dönem'] as const).map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedTerm === term
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {term === 'ALL' ? 'Tümü' : term}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Konu, senaryo veya soru ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-slate-300">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Kayıtlı Sınav Bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            "Yeni Sınav Oluştur" butonuna basarak sınıf, dönem ve konu seçip yapay zekaya açık uçlu soruları ve rubrik cevap anahtarını hazırlatabilirsiniz.
          </p>
          <div className="mt-4">
            <EmbossedButton variant="danger" size="sm" onClick={onOpenCreate}>
              Hemen Sınav Hazırla
            </EmbossedButton>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExams.map((exam) => {
            const isExpanded = expandedExamId === exam.id;

            return (
              <EmbossedCard
                key={exam.id}
                variant="rose"
                className="overflow-hidden"
              >
                {/* Exam Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                      {exam.gradeLevel}. Sınıf Tarih
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exam.academicYear} • {exam.term} • {exam.examNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {exam.scenario}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.durationMinutes} Dakika
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {exam.questions.length} Soru / {exam.totalScore} Puan
                    </span>
                  </div>
                </div>

                {/* Exam Title & Units */}
                <div className="mt-3">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {exam.themeUnit}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exam.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        • {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Collapsible Questions Preview */}
                <div className="mt-4">
                  <button
                    onClick={() => toggleExpand(exam.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span>Soruları ve Model Cevapları Önizle ({exam.questions.length} Soru)</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 pt-2">
                      {exam.questions.map((q) => (
                        <div
                          key={q.id}
                          className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs">
                                Soru {q.questionNumber}
                              </span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                q.difficulty === 'Zor'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : q.difficulty === 'Kolay'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}>
                                {q.difficulty || 'Orta'} ({q.maxPoints} Puan)
                              </span>
                              {q.cognitiveLevel && (
                                <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                  {q.cognitiveLevel}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded max-w-md truncate">
                              {q.learningOutcome}
                            </span>
                          </div>

                          {q.contextText && (
                            <div className="p-2.5 bg-amber-50/60 rounded-lg border-l-2 border-amber-500 text-slate-800 italic">
                              <span className="font-bold not-italic text-amber-900 block text-[10px] uppercase">
                                Bağlam / Kaynak:
                              </span>
                              "{q.contextText}"
                            </div>
                          )}

                          <p className="font-bold text-slate-900">{q.questionText}</p>

                          <div className="p-2 bg-emerald-50/70 rounded-lg text-emerald-950">
                            <span className="font-bold text-emerald-800 block text-[10px] uppercase">
                              Beklenen Model Cevap:
                            </span>
                            <div className="whitespace-pre-line text-[11px] mt-0.5">{q.sampleAnswer}</div>
                          </div>

                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg space-y-1.5">
                            <span className="font-bold text-slate-700 block text-[10px] uppercase">
                              Dereceli Rubrik Puan Dağılımı:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5">
                              {q.rubricGuide.map((r, rIdx) => (
                                <li key={rIdx}>
                                  {r.criterion} <strong>[{r.points} Puan]</strong>
                                  {r.partialGuidance && (
                                    <span className="text-slate-500 italic ml-1">({r.partialGuidance})</span>
                                  )}
                                </li>
                              ))}
                            </ul>

                            {q.partialCreditNotes && (
                              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                                <strong className="text-amber-950">⚠️ Kademeli Puanlama / Yarım Cevap Değerlendirmesi:</strong> {q.partialCreditNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {/* Export Options: Student Paper & Answer Key */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Soru Kağıdı Çıktıları */}
                    <button
                      onClick={() => DocxExportService.exportExamPaperToWord(exam, settings)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Öğrenci Soru Kağıdını Word (.docx) olarak indir"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Soru Kağıdı (.docx)</span>
                    </button>

                    <button
                      onClick={() => PdfPrintService.printExamPaper(exam, settings)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Öğrenci Soru Kağıdını A4 Dikey yazdır veya PDF kaydet"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Soru Kağıdı (PDF)</span>
                    </button>

                    {/* Cevap Anahtarı & Rubrik Çıktıları */}
                    <button
                      onClick={() => DocxExportService.exportExamAnswerKeyToWord(exam, settings)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Dereceli Cevap Anahtarını Word (.docx) olarak indir"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-600" />
                      <span>Cevap Anahtarı (.docx)</span>
                    </button>

                    <button
                      onClick={() => PdfPrintService.printExamAnswerKey(exam, settings)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Dereceli Cevap Anahtarını A4 Yatay yazdır veya PDF kaydet"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-600" />
                      <span>Cevap Anahtarı (PDF)</span>
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectExam(exam)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Sınavı Düzenle / İncele"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${exam.gradeLevel}. Sınıf ${exam.term} ${exam.examNumber}" sınavını silmek istediğinize emin misiniz?`)) {
                          onDeleteExam(exam.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Sınavı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </EmbossedCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
