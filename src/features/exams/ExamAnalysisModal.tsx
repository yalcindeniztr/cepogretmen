import React, { useState } from 'react';
import {
  X,
  Save,
  Download,
  Printer,
  Plus,
  Trash2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Copy,
  FileSpreadsheet
} from 'lucide-react';
import { ExamPaper, ExamItemAnalysis, ExamStudentResult, AppSettings } from '../../core/types';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface ExamAnalysisModalProps {
  exam: ExamPaper;
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveAnalysis: (updatedExam: ExamPaper) => void;
}

export const ExamAnalysisModal: React.FC<ExamAnalysisModalProps> = ({
  exam,
  settings,
  isOpen,
  onClose,
  onSaveAnalysis
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'ANALYSIS' | 'EOKUL'>('ANALYSIS');
  const [className, setClassName] = useState<string>(exam.analysis?.className || `${exam.gradeLevel}/A MTAL`);
  const [examDate, setExamDate] = useState<string>(exam.analysis?.examDate || new Date().toISOString().split('T')[0]);
  const [actionPlan, setActionPlan] = useState<string>(
    exam.analysis?.actionPlan ||
      'Öğrenme çıktısı %50 altında kalan kazanımlar için sonraki ders saatlerinde kaynak metin tahlili ve soru-cevap tekrarı ile telafi eğitimi yapılacaktır.'
  );

  // Default sample student roster if none exists
  const [students, setStudents] = useState<ExamStudentResult[]>(() => {
    if (exam.analysis?.students && exam.analysis.students.length > 0) {
      return exam.analysis.students;
    }
    const sampleNames = [
      'Ahmet Yılmaz', 'Mehmet Kaya', 'Ayşe Demir', 'Fatma Çelik', 'Mustafa Öztürk',
      'Emine Arslan', 'Ali Doğan', 'Zeynep Kılıç', 'Hüseyin Aydın', 'Hatice Koç',
      'İbrahim Şahin', 'Elif Yıldız', 'Burak Yıldırım', 'Büşra Yavuz', 'Yusuf Polat'
    ];

    return sampleNames.map((name, idx) => {
      const studentNo = `${100 + idx + 1}`;
      const scores = exam.questions.map((q) => {
        const ratio = 0.5 + Math.random() * 0.5;
        return Math.round(q.maxPoints * ratio);
      });
      const total = scores.reduce((sum, s) => sum + s, 0);
      return {
        id: `st-${idx + 1}`,
        studentNo,
        studentName: name,
        questionScores: scores,
        totalScore: total
      };
    });
  });

  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<boolean>(false);

  const sCount = students.length;

  const questionAverageScores: number[] = exam.questions.map((_, qIdx) => {
    if (sCount === 0) return 0;
    const totalQScore = students.reduce((sum, st) => sum + (st.questionScores[qIdx] || 0), 0);
    return totalQScore / sCount;
  });

  const questionSuccessRates: number[] = exam.questions.map((q, qIdx) => {
    if (sCount === 0 || q.maxPoints === 0) return 0;
    const avg = questionAverageScores[qIdx] || 0;
    return Math.round((avg / q.maxPoints) * 100);
  });

  const acquiredOutcomes: string[] = [];
  const unacquiredOutcomes: string[] = [];

  exam.questions.forEach((q, qIdx) => {
    const rate = questionSuccessRates[qIdx] || 0;
    const desc = `S${q.questionNumber} (${q.learningOutcome}) - Başarı: %${rate}`;
    if (rate >= 50) {
      acquiredOutcomes.push(desc);
    } else {
      unacquiredOutcomes.push(desc);
    }
  });

  const classTotal = students.reduce((sum, st) => sum + st.totalScore, 0);
  const classAverage = sCount > 0 ? classTotal / sCount : 0;
  const highestScore = students.length > 0 ? Math.max(...students.map(s => s.totalScore)) : 0;
  const lowestScore = students.length > 0 ? Math.min(...students.map(s => s.totalScore)) : 0;
  const passingCount = students.filter(s => s.totalScore >= 50).length;
  const failingCount = students.filter(s => s.totalScore < 50).length;

  const handleScoreChange = (studentIdx: number, questionIdx: number, value: number) => {
    const qMax = exam.questions[questionIdx]?.maxPoints || 10;
    const validVal = Math.max(0, Math.min(qMax, value));

    setStudents(prev => {
      const next = [...prev];
      const targetSt = { ...next[studentIdx] };
      const newScores = [...targetSt.questionScores];
      newScores[questionIdx] = validVal;
      targetSt.questionScores = newScores;
      targetSt.totalScore = newScores.reduce((a, b) => a + (Number(b) || 0), 0);
      next[studentIdx] = targetSt;
      return next;
    });
  };

  const handleStudentFieldChange = (studentIdx: number, field: 'studentNo' | 'studentName', value: string) => {
    setStudents(prev => {
      const next = [...prev];
      next[studentIdx] = { ...next[studentIdx], [field]: value };
      return next;
    });
  };

  const handleAddStudent = () => {
    const nextNo = (students.length + 101).toString();
    const newStudent: ExamStudentResult = {
      id: `st-${Date.now()}`,
      studentNo: nextNo,
      studentName: `Yeni Öğrenci ${students.length + 1}`,
      questionScores: exam.questions.map(() => 0),
      totalScore: 0
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleRemoveStudent = (idx: number) => {
    setStudents(prev => prev.filter((_, i) => i !== idx));
  };

  const buildAnalysisObject = (): ExamItemAnalysis => {
    return {
      id: exam.analysis?.id || `analysis-${exam.id}-${Date.now()}`,
      examId: exam.id,
      className,
      academicYear: exam.academicYear,
      term: exam.term,
      examNumber: exam.examNumber,
      examDate,
      students,
      questionSuccessRates,
      questionAverageScores,
      acquiredOutcomes,
      unacquiredOutcomes,
      classAverage,
      highestScore,
      lowestScore,
      passingCount,
      failingCount,
      actionPlan,
      updatedAt: new Date().toISOString()
    };
  };

  const handleSave = () => {
    const analysis = buildAnalysisObject();
    const updatedExam: ExamPaper = {
      ...exam,
      analysis,
      updatedAt: new Date().toISOString()
    };
    onSaveAnalysis(updatedExam);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 1500);
  };

  const handleExportWord = () => {
    const analysis = buildAnalysisObject();
    DocxExportService.exportExamAnalysisToWord(exam, analysis, settings);
  };

  const handlePrintPdf = () => {
    const analysis = buildAnalysisObject();
    PdfPrintService.printExamAnalysis(exam, analysis, settings);
  };

  const handleCopyEOKul = () => {
    const lines = students.map(s => `${s.studentNo}\t${s.studentName}\t${s.totalScore}`);
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['Okul No', 'Adı Soyadı', ...exam.questions.map(q => `S${q.questionNumber} (${q.maxPoints}P)`), 'Toplam Puan', 'Durum'];
    const rows = students.map(s => [
      s.studentNo,
      `"${s.studentName}"`,
      ...s.questionScores,
      s.totalScore,
      s.totalScore >= 50 ? 'GECTI' : 'KALDI'
    ]);
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${settings.schoolName}_${className}_Tarih_Not_Listesi.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-7xl max-h-[96vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <span>MEB Sınav Soru & Kazanım Analiz Formu</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Resmi Yönetmelik Uyumlu
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {exam.gradeLevel}. Sınıf Tarih • {exam.term} {exam.examNumber} • {exam.questions.length} Soru / {exam.totalScore} Puan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('ANALYSIS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ANALYSIS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Soru & Kazanım Analizi
              </button>
              <button
                onClick={() => setActiveTab('EOKUL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'EOKUL' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                e-Okul Not Çizelgesi
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sınav ve Şube Başlık Bilgileri */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Şube / Sınıf:</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Örn: 9/A MTAL"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sınav Tarihi:</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ders Öğretmeni:</label>
              <input
                type="text"
                readOnly
                value={settings.teacherName}
                className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Okul Adı:</label>
              <input
                type="text"
                readOnly
                value={settings.schoolName}
                className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold truncate cursor-not-allowed"
              />
            </div>
          </div>

          {activeTab === 'ANALYSIS' ? (
            <>
              {/* İstatistik Göstergeleri Kartları */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl">
                  <span className="text-[11px] font-bold text-blue-800 block">Sınava Giren</span>
                  <div className="text-xl font-extrabold text-blue-950 mt-0.5">{students.length} Öğrenci</div>
                </div>

                <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl">
                  <span className="text-[11px] font-bold text-indigo-800 block">Sınıf Ortalaması</span>
                  <div className="text-xl font-extrabold text-indigo-950 mt-0.5">{classAverage.toFixed(1)} Puan</div>
                </div>

                <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl">
                  <span className="text-[11px] font-bold text-emerald-800 block">Başarılı (≥50 P)</span>
                  <div className="text-xl font-extrabold text-emerald-950 mt-0.5">
                    {passingCount} <span className="text-xs font-semibold text-emerald-700">(%{((passingCount / (students.length || 1)) * 100).toFixed(0)})</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/80 border border-rose-200/80 rounded-2xl">
                  <span className="text-[11px] font-bold text-rose-800 block">Başarısız (&lt;50 P)</span>
                  <div className="text-xl font-extrabold text-rose-950 mt-0.5">
                    {failingCount} <span className="text-xs font-semibold text-rose-700">(%{((failingCount / (students.length || 1)) * 100).toFixed(0)})</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-2xl">
                  <span className="text-[11px] font-bold text-purple-800 block">En Yüksek / Düşük</span>
                  <div className="text-xl font-extrabold text-purple-950 mt-0.5">
                    {highestScore} / {lowestScore} P
                  </div>
                </div>
              </div>

              {/* 1. Soru ve Kazanım Başarı Oranları Tablosu */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Soru ve Öğrenme Çıktısı (Kazanım) Başarı Dağılımı</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    Kazanım Barajı: %50
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 text-center w-12">Soru</th>
                        <th className="p-2.5">Öğrenme Çıktısı (Kazanım Kodu & Adı)</th>
                        <th className="p-2.5 text-center w-28">Zorluk / Puan</th>
                        <th className="p-2.5 text-center w-24">Sınıf Ort.</th>
                        <th className="p-2.5 text-center w-28">Başarı %</th>
                        <th className="p-2.5 text-center w-36">Edinilme Durumu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {exam.questions.map((q, idx) => {
                        const successRate = questionSuccessRates[idx] || 0;
                        const isAcquired = successRate >= 50;
                        const avgScore = (questionAverageScores[idx] || 0).toFixed(1);

                        return (
                          <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-2.5 text-center font-extrabold text-slate-900">
                              S{q.questionNumber}
                            </td>
                            <td className="p-2.5">
                              <span className="font-semibold text-slate-900">{q.learningOutcome}</span>
                              {q.contextText && (
                                <span className="text-[11px] text-slate-500 block truncate max-w-md italic mt-0.5">
                                  {q.contextText}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                q.difficulty === 'Zor'
                                  ? 'bg-rose-100 text-rose-800'
                                  : q.difficulty === 'Kolay'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {q.difficulty} ({q.maxPoints} P)
                              </span>
                            </td>
                            <td className="p-2.5 text-center font-bold text-slate-700">
                              {avgScore} / {q.maxPoints}
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center gap-1.5 font-extrabold">
                                <span className={isAcquired ? 'text-emerald-700' : 'text-rose-700'}>
                                  %{successRate}
                                </span>
                                <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden shrink-0">
                                  <div
                                    className={`h-full rounded-full ${isAcquired ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                    style={{ width: `${Math.min(100, successRate)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-2.5 text-center">
                              {isAcquired ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Edinildi
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  <AlertTriangle className="w-3 h-3" /> Kritik Eksik (Telafi)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Öğrenci Puan Giriş Tablosu */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Öğrenci Puan Giriş Listesi ({students.length} Öğrenci)</span>
                  </h3>

                  <button
                    onClick={handleAddStudent}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Öğrenci Ekle
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm max-h-96">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 text-white font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-2 text-center w-10">#</th>
                        <th className="p-2 w-20 text-center">No</th>
                        <th className="p-2 min-w-[140px]">Adı Soyadı</th>
                        {exam.questions.map((q) => (
                          <th key={q.id} className="p-2 text-center w-12" title={`${q.questionNumber}. Soru (Maks. ${q.maxPoints} Puan)`}>
                            S{q.questionNumber}<br />
                            <span className="text-[10px] font-normal text-slate-300">({q.maxPoints}P)</span>
                          </th>
                        ))}
                        <th className="p-2 text-center w-16 bg-blue-900">Toplam</th>
                        <th className="p-2 text-center w-16">Durum</th>
                        <th className="p-2 text-center w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {students.map((st, sIdx) => {
                        const isPass = st.totalScore >= 50;
                        return (
                          <tr key={st.id || sIdx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-2 text-center text-slate-400 text-[11px]">{sIdx + 1}</td>
                            <td className="p-1 text-center">
                              <input
                                type="text"
                                value={st.studentNo}
                                onChange={(e) => handleStudentFieldChange(sIdx, 'studentNo', e.target.value)}
                                className="w-16 px-1.5 py-1 text-center text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                              />
                            </td>
                            <td className="p-1">
                              <input
                                type="text"
                                value={st.studentName}
                                onChange={(e) => handleStudentFieldChange(sIdx, 'studentName', e.target.value)}
                                className="w-full px-2 py-1 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                              />
                            </td>
                            {exam.questions.map((q, qIdx) => {
                              const score = st.questionScores[qIdx] ?? 0;
                              return (
                                <td key={q.id} className="p-1 text-center">
                                  <input
                                    type="number"
                                    min={0}
                                    max={q.maxPoints}
                                    value={score}
                                    onChange={(e) => handleScoreChange(sIdx, qIdx, Number(e.target.value))}
                                    className="w-11 px-1 py-1 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                  />
                                </td>
                              );
                            })}
                            <td className="p-2 text-center font-extrabold text-sm bg-blue-50/50">
                              <span className={isPass ? 'text-emerald-700' : 'text-rose-700'}>
                                {st.totalScore}
                              </span>
                            </td>
                            <td className="p-2 text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isPass ? 'GEÇTİ' : 'KALDI'}
                              </span>
                            </td>
                            <td className="p-1 text-center">
                              <button
                                onClick={() => handleRemoveStudent(sIdx)}
                                className="p-1 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Öğrenciyi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Telafi Eylem Planı */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Kazanım Telafi ve Öğretmen Eylem Planı (MEB Teftiş Standartı):</span>
                </label>
                <textarea
                  rows={2}
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="Başarısız veya telafi gerektiren kazanımlar için uygulanacak ders içi tedbirleri yazınız..."
                  className="w-full p-2.5 text-xs bg-white border border-amber-200 rounded-xl text-amber-950 focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          ) : (
            /* e-Okul Formatı ve Sıralı Not Çizelgesi */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm">
                    e-O
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">e-Okul Uyumlu Sıralı Not Çizelgesi</h3>
                    <p className="text-xs text-emerald-800">
                      Öğrenci numarası ve sınav puanlarını doğrudan e-Okul sistemine kopyalayabilir veya Excel (.csv) olarak indirebilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyEOKul}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-emerald-700" />
                    <span>{copiedFeedback ? 'Kopyalandı! (Ctrl+V)' : 'Listeyi Kopyala (Tablo)'}</span>
                  </button>

                  <button
                    onClick={handleDownloadCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Excel / CSV İndir</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-center w-16">Sıra</th>
                      <th className="p-3 w-28 text-center">Okul No</th>
                      <th className="p-3">Öğrenci Adı Soyadı</th>
                      <th className="p-3 text-center w-32">Sınav Puanı (100)</th>
                      <th className="p-3 text-center w-28">Başarı Durumu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {students.map((st, i) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center text-slate-400">{i + 1}</td>
                        <td className="p-3 text-center font-mono font-bold text-blue-700">{st.studentNo}</td>
                        <td className="p-3 font-bold text-slate-900">{st.studentName}</td>
                        <td className="p-3 text-center font-extrabold text-sm text-slate-900 bg-slate-50/60">
                          {st.totalScore}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            st.totalScore >= 50
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {st.totalScore >= 50 ? 'Başarılı' : 'Başarısız'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Resmi Sınav Analiz Tutanağını Word (.docx) olarak indir"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Analiz Tutanağı (.docx)</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Resmi Sınav Analiz Tutanağını A4 Yatay yazdır veya PDF kaydet"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Analiz Tutanağı (PDF)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Kapat
            </button>

            <EmbossedButton
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              {saveFeedback ? 'Analiz Kaydedildi!' : 'Analizi Sınava Kaydet'}
            </EmbossedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
