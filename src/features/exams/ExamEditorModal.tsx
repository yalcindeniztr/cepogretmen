import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Save,
  Download,
  Printer,
  Plus,
  Trash2,
  FileCheck,
  Award,
  BookOpen,
  Calendar,
  Clock,
  HelpCircle,
  Layers,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { ExamPaper, ExamQuestion, ExamRubricCriterion, GradeLevel, AppSettings } from '../../core/types';
import { HISTORY_CURRICULUM } from '../../core/constants/maarifCurriculum';
import { GeminiService } from '../../services/ai/geminiService';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface ExamEditorModalProps {
  exam: ExamPaper | null;
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: ExamPaper) => void;
}

export const ExamEditorModal: React.FC<ExamEditorModalProps> = ({
  exam,
  settings,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(exam ? exam.gradeLevel : 9);
  const [academicYear, setAcademicYear] = useState<string>(exam ? exam.academicYear : settings.academicYear);
  const [term, setTerm] = useState<'1. Dönem' | '2. Dönem'>(exam ? exam.term : (settings.term === '2. Dönem' ? '2. Dönem' : '1. Dönem'));
  const [examNumber, setExamNumber] = useState<'1. Sınav' | '2. Sınav'>(exam ? exam.examNumber : '1. Sınav');
  const [scenario, setScenario] = useState<string>(exam ? exam.scenario : 'Senaryo 1 (MEB Konu Soru Dağılım Tablosu)');
  const [themeUnit, setThemeUnit] = useState<string>(
    exam ? exam.themeUnit : (HISTORY_CURRICULUM[gradeLevel]?.units[0]?.title || 'Geçmişin İnşa Sürecinde Tarih')
  );
  const [questionCount, setQuestionCount] = useState<number>(exam ? exam.questions.length : 10);
  const [durationMinutes, setDurationMinutes] = useState<number>(exam ? exam.durationMinutes : 40);
  const [instructions, setInstructions] = useState<string>(
    exam
      ? exam.instructions
      : '1. Sınav süresi 40 dakikadır. 2. Sorular açık uçlu olup cevaplarınızı ayrılan bölümlere gerekçeli olarak yazınız. 3. Puanlama dereceli puanlama anahtarına (rubrik) göre yapılacaktır. Başarılar dileriz.'
  );

  const [questions, setQuestions] = useState<ExamQuestion[]>(() => {
    if (exam && exam.questions.length > 0) return exam.questions;
    return [
      {
        id: 'q-init-1',
        questionNumber: 1,
        difficulty: 'Kolay',
        cognitiveLevel: 'Kavrama',
        learningOutcome: 'TAR.9.1.1. Tarih öğrenmenin faydalarını yorumlayabilme',
        domainSkill: 'SBAB1. Zamanı Algılama',
        conceptualSkill: 'KB2.14. Yorumlama',
        value: 'D19. Vatanseverlik',
        contextText: 'Atatürk: "Tarih yazmak, tarih yapmak kadar mühimdir; yazan yapana sadık kalmazsa değişmeyen hakikat insanlığı şaşırtacak bir mahiyet alır."',
        questionText: 'Tarih öğrenmenin milli bilinç ve gelecek inşasındaki rolünü yukarıdaki söz ışığında açıklayınız.',
        sampleAnswer: 'Ortak hafıza oluşturarak milli dayanışmayı pekiştirir ve geleceğe yönelik stratejik kararlarda tecrübe sağlar.',
        rubricGuide: [
          { criterion: 'Milli hafıza boyutunu açıklama', points: 4, partialGuidance: 'Yalnızca milli hafızayı belirtene 2 puan' },
          { criterion: 'Geleceğe yön verme boyutunu açıklama', points: 4, partialGuidance: 'Geleceği inşa boyutunu açıklayana 2 puan' }
        ],
        maxPoints: 8,
        partialCreditNotes: 'Öğrenci tek bir boyutu açıklarsa 4 puan, her iki boyutu da gerekçeli açıklarsa 8 tam puan alır.'
      }
    ];
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // When grade level changes, update default unit
  useEffect(() => {
    if (!exam) {
      const units = HISTORY_CURRICULUM[gradeLevel]?.units || [];
      if (units.length > 0) {
        setThemeUnit(units[0].title);
      }
    }
  }, [gradeLevel, exam]);

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await GeminiService.generateMaarifExam(
        gradeLevel,
        academicYear,
        term,
        examNumber,
        themeUnit,
        questionCount,
        scenario,
        settings.schoolName,
        settings.teacherName,
        settings.geminiApiKey
      );

      setQuestions(generated.questions);
      setInstructions(generated.instructions);
      setSelectedQuestionIndex(0);
    } catch (e) {
      console.error(e);
      alert('Sınav üretilirken bir sorun oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const totalScore = questions.reduce((sum, q) => sum + Number(q.maxPoints || 0), 0);

    const updatedExam: ExamPaper = {
      id: exam ? exam.id : `exam-${Date.now()}`,
      gradeLevel,
      academicYear,
      term,
      examNumber,
      examType: 'OKUL_GENELI_ORTAK',
      scenario,
      themeUnit,
      topics: [themeUnit],
      durationMinutes,
      totalScore,
      questions,
      schoolName: settings.schoolName,
      teacherName: settings.teacherName,
      instructions,
      createdAt: exam ? exam.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(updatedExam);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const currentQ = questions[selectedQuestionIndex] || questions[0];

  const updateCurrentQuestion = (updates: Partial<ExamQuestion>) => {
    setQuestions(prev => {
      const next = [...prev];
      if (next[selectedQuestionIndex]) {
        next[selectedQuestionIndex] = { ...next[selectedQuestionIndex], ...updates };
      }
      return next;
    });
  };

  const addRubricCriterion = () => {
    if (!currentQ) return;
    const newRubric = [...currentQ.rubricGuide, { criterion: 'Yeni ölçüt gerekçesi', points: 5 }];
    updateCurrentQuestion({ rubricGuide: newRubric });
  };

  const updateRubricCriterion = (idx: number, updates: Partial<ExamRubricCriterion>) => {
    if (!currentQ) return;
    const nextRubric = [...currentQ.rubricGuide];
    nextRubric[idx] = { ...nextRubric[idx], ...updates };
    updateCurrentQuestion({ rubricGuide: nextRubric });
  };

  const removeRubricCriterion = (idx: number) => {
    if (!currentQ || currentQ.rubricGuide.length <= 1) return;
    const nextRubric = currentQ.rubricGuide.filter((_, i) => i !== idx);
    updateCurrentQuestion({ rubricGuide: nextRubric });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {exam ? 'Sınavı ve Cevap Anahtarını Düzenle' : 'Yeni Açık Uçlu Sınav ve Rubrik Hazırla'}
              </h2>
              <p className="text-xs text-slate-300">
                MEB Türkiye Yüzyılı Maarif Modeli Ölçme Standartları
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sınav Parametreleri Formu */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-600" />
                <span>Sınav Parametreleri & MEB Senaryosu</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                Okul: {settings.schoolName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Sınıf Düzeyi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sınıf</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(Number(e.target.value) as GradeLevel)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value={9}>9. Sınıf Tarih</option>
                  <option value={10}>10. Sınıf Tarih</option>
                  <option value={11}>11. Sınıf Tarih</option>
                  <option value={12}>12. Sınıf T.C. İnkılap</option>
                </select>
              </div>

              {/* Dönem */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dönem</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="1. Dönem">1. Dönem</option>
                  <option value="2. Dönem">2. Dönem</option>
                </select>
              </div>

              {/* Sınav No */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sınav No</label>
                <select
                  value={examNumber}
                  onChange={(e) => setExamNumber(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="1. Sınav">1. Sınav (Yazılı)</option>
                  <option value="2. Sınav">2. Sınav (Yazılı)</option>
                </select>
              </div>

              {/* Soru Sayısı */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Açık Uçlu Soru Sayısı</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value={10}>10 Soru (3 Kolay [8P] + 4 Orta [10P] + 3 Zor [12P] = 100P - Maarif Standartı)</option>
                  <option value={5}>5 Soru (20'şer Puan)</option>
                  <option value={4}>4 Soru (25'er Puan)</option>
                  <option value={6}>6 Soru</option>
                  <option value={8}>8 Soru</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Senaryo Seçimi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">MEB Senaryo Dağılımı</label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="Senaryo 1 (MEB Konu Soru Dağılım Tablosu)">Senaryo 1 (MEB Konu Soru Dağılım Tablosu)</option>
                  <option value="Senaryo 2 (İl Geneli Konu Soru Dağılımı)">Senaryo 2 (İl Geneli Konu Soru Dağılımı)</option>
                  <option value="Senaryo 3 (Okul Geneli Ortak Sınav)">Senaryo 3 (Okul Geneli Ortak Sınav)</option>
                  <option value="Özel Sınav Senaryosu">Özel Sınav Senaryosu</option>
                </select>
              </div>

              {/* Ünite / Konu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sınav Kapsamı (Ünite / Konu)</label>
                <input
                  type="text"
                  value={themeUnit}
                  onChange={(e) => setThemeUnit(e.target.value)}
                  placeholder="Örn: Geçmişin İnşa Sürecinde Tarih, İlk Çağ Medeniyetleri"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* AI Auto Generate Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80">
              <span className="text-xs text-slate-600">
                Yapay Zeka; kütüphanedeki MEB ders kitaplarını, kazanımları ve değerleri analiz ederek açık uçlu soruları, model cevapları ve rubriği otomatik oluşturur.
              </span>

              <EmbossedButton
                variant="danger"
                size="md"
                icon={<Sparkles className="w-4 h-4 text-amber-300" />}
                onClick={handleAIGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Yapay Zekâ Sınavı Hazırlıyor...' : 'Yapay Zekâ ile Soruları & Rubriği Üret'}
              </EmbossedButton>
            </div>
          </div>

          {/* Soru Listesi ve Sekmeleri */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {questions.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    onClick={() => setSelectedQuestionIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedQuestionIndex === idx
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Soru {idx + 1} ({q.maxPoints} P)
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-slate-500">
                Toplam: {questions.reduce((sum, q) => sum + Number(q.maxPoints || 0), 0)} / 100 Puan
              </span>
            </div>

            {/* Aktif Soru Düzenleme Alanı */}
            {currentQ && (
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      Soru {selectedQuestionIndex + 1} Detayları
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      currentQ.difficulty === 'Zor'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : currentQ.difficulty === 'Kolay'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {currentQ.difficulty || 'Orta'} ({currentQ.maxPoints} Puan)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Zorluk Derecesi Seçimi */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-xs font-bold text-slate-600">Zorluk Derecesi:</label>
                      <select
                        value={currentQ.difficulty || 'Orta'}
                        onChange={(e) => {
                          const diff = e.target.value as 'Kolay' | 'Orta' | 'Zor';
                          const defaultPoints = diff === 'Kolay' ? 8 : diff === 'Orta' ? 10 : 12;
                          updateCurrentQuestion({ difficulty: diff, maxPoints: defaultPoints });
                        }}
                        className="px-2.5 py-1 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                      >
                        <option value="Kolay">Kolay (8 Puan)</option>
                        <option value="Orta">Orta (10 Puan)</option>
                        <option value="Zor">Zor (12 Puan)</option>
                      </select>
                    </div>

                    {/* Soru Puanı */}
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-bold text-slate-600">Puan:</label>
                      <input
                        type="number"
                        value={currentQ.maxPoints}
                        onChange={(e) => updateCurrentQuestion({ maxPoints: Number(e.target.value) })}
                        className="w-16 px-2 py-1 text-xs text-center font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Kazanım & Beceriler & Bilişsel Düzey */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Öğrenme Çıktısı (Kazanım Kodu & Adı)
                    </label>
                    <input
                      type="text"
                      value={currentQ.learningOutcome}
                      onChange={(e) => updateCurrentQuestion({ learningOutcome: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bilişsel Düzey
                    </label>
                    <input
                      type="text"
                      value={currentQ.cognitiveLevel || ''}
                      onChange={(e) => updateCurrentQuestion({ cognitiveLevel: e.target.value })}
                      placeholder="Örn: Analiz, Kavrama, Sentez"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alan Becerisi (SBAB)
                    </label>
                    <input
                      type="text"
                      value={currentQ.domainSkill || ''}
                      onChange={(e) => updateCurrentQuestion({ domainSkill: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-800 mb-1">
                      Maarif Değeri
                    </label>
                    <input
                      type="text"
                      value={currentQ.value || ''}
                      onChange={(e) => updateCurrentQuestion({ value: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-purple-50/40 border border-purple-200 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Bağlam / Senaryo / Metin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bağlam / Senaryo / Tarihsel Metin (Soru Öncesi Bilgi ve Kaynak)
                  </label>
                  <textarea
                    rows={2}
                    value={currentQ.contextText}
                    onChange={(e) => updateCurrentQuestion({ contextText: e.target.value })}
                    placeholder="Tarihsel belge parçası, ferman, seyyah notu veya durum senaryosu..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 italic"
                  />
                </div>

                {/* Açık Uçlu Soru Cümlesi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Açık Uçlu Soru Yönergesi
                  </label>
                  <textarea
                    rows={2}
                    value={currentQ.questionText}
                    onChange={(e) => updateCurrentQuestion({ questionText: e.target.value })}
                    placeholder="Öğrencinin yanıtlaması istenen soru..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Model / Beklenen Cevap */}
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">
                    Beklenen Model Cevap (Cevap Anahtarı)
                  </label>
                  <textarea
                    rows={3}
                    value={currentQ.sampleAnswer}
                    onChange={(e) => updateCurrentQuestion({ sampleAnswer: e.target.value })}
                    placeholder="Öğrencinin tam puan alması için yazması beklenen gerekçeli cevap..."
                    className="w-full p-2.5 text-xs bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-950 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Kademeli Puanlama / Yarım Cevap Kuralı */}
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
                    <span>⚠️ Kademeli Puanlama / Yarım Cevap Değerlendirme Kuralı</span>
                    <span className="text-[10px] font-semibold text-amber-700">Eksik/Yarım cevap veren öğrenciye verilecek puan notu</span>
                  </label>
                  <textarea
                    rows={2}
                    value={currentQ.partialCreditNotes || ''}
                    onChange={(e) => updateCurrentQuestion({ partialCreditNotes: e.target.value })}
                    placeholder="Örn: Öğrenci yalnızca kavramı belirtip gerekçelendirmeyi eksik bırakırsa 4 puan, gerekçesini kısmen ifade ederse 6 puan, eksiksiz tam çözümde 8 puan verilir."
                    className="w-full p-2.5 text-xs bg-amber-50/60 border border-amber-200 rounded-xl text-amber-950 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Dereceli Puanlama Anahtarı (Rubrik Kriterleri) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Dereceli Puanlama Anahtarı (Rubrik Ölçütleri & Kısmi Puanlar)
                    </label>
                    <button
                      onClick={addRubricCriterion}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ölçüt Ekle
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentQ.rubricGuide.map((r, rIdx) => (
                      <div key={rIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={r.criterion}
                            onChange={(e) => updateRubricCriterion(rIdx, { criterion: e.target.value })}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500 font-medium"
                            placeholder="Ölçüt açıklaması..."
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={r.points}
                              onChange={(e) => updateRubricCriterion(rIdx, { points: Number(e.target.value) })}
                              className="w-14 px-2 py-1.5 text-xs text-center font-bold bg-white border border-slate-200 rounded-lg focus:outline-none"
                            />
                            <span className="text-xs text-slate-600 font-bold">P</span>
                          </div>
                          {currentQ.rubricGuide.length > 1 && (
                            <button
                              onClick={() => removeRubricCriterion(rIdx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Ölçütü Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-700 whitespace-nowrap">Yarım/Kısmi Cevap Kuralı:</span>
                          <input
                            type="text"
                            value={r.partialGuidance || ''}
                            onChange={(e) => updateRubricCriterion(rIdx, { partialGuidance: e.target.value })}
                            className="flex-1 px-2.5 py-1 text-[11px] bg-white border border-amber-200 rounded-md focus:outline-none text-slate-700 italic"
                            placeholder="Örn: Yalnızca tespiti yapıp gerekçeyi yazmayana 2 puan verilir..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Kurum: <strong>{settings.schoolName}</strong></span>
            <span>•</span>
            <span>Öğretmen: <strong>{settings.teacherName}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Vazgeç
            </button>

            <EmbossedButton
              variant="danger"
              size="md"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              {saveSuccess ? 'Kaydedildi!' : 'Sınavı Veritabanına Kaydet'}
            </EmbossedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
