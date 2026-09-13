import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Download,
  Printer,
  Sparkles,
  Building2,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Filter,
  FileCheck
} from 'lucide-react';
import { GradeLevel, AppSettings, FullTwoTermYearlyPlan, SchoolBasedPlanItem, SocialActivityPlanItem } from '../../core/types';
import { buildFullTwoTermYearlyPlan } from '../../core/constants/twoTermPlanDefaults';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';
import { SchoolBasedPlanningModal } from './SchoolBasedPlanningModal';
import { SocialActivitiesModal } from './SocialActivitiesModal';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface FullYearlyPlanViewProps {
  settings: AppSettings;
}

export const FullYearlyPlanView: React.FC<FullYearlyPlanViewProps> = ({ settings }) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(9);
  const [weeklyHours, setWeeklyHours] = useState<number>(settings.defaultWeeklyHours || 2);
  const [academicYear, setAcademicYear] = useState<string>('2024-2025');
  const [activeTermTab, setActiveTermTab] = useState<'ALL' | 'TERM_1' | 'TERM_2'>('ALL');

  // Modals
  const [isSchoolBasedModalOpen, setIsSchoolBasedModalOpen] = useState(false);
  const [isSocialActivityModalOpen, setIsSocialActivityModalOpen] = useState(false);

  // Custom added plans
  const [customSchoolPlan, setCustomSchoolPlan] = useState<SchoolBasedPlanItem | null>(null);
  const [customSocialActivity, setCustomSocialActivity] = useState<SocialActivityPlanItem | null>(null);

  // Build the 2-term plan dynamically
  const yearlyPlan = useMemo(() => {
    const plan = buildFullTwoTermYearlyPlan(academicYear, selectedGrade, weeklyHours, settings);
    if (customSchoolPlan && customSchoolPlan.gradeLevel === selectedGrade) {
      plan.schoolBasedPlans = [customSchoolPlan];
    }
    if (customSocialActivity && customSocialActivity.gradeLevel === selectedGrade) {
      plan.socialActivities = [customSocialActivity];
    }
    return plan;
  }, [academicYear, selectedGrade, weeklyHours, settings, customSchoolPlan, customSocialActivity]);

  const isGrade12 = selectedGrade === 12;

  const handleExportWord = async () => {
    await DocxExportService.exportFullTwoTermYearlyPlanToWord(yearlyPlan, settings);
  };

  const handlePrintPdf = () => {
    PdfPrintService.printFullTwoTermYearlyPlan(yearlyPlan, settings);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-md border border-blue-200">
              MEB Çalışma Takvimi 37 Hafta
            </span>
            <span className="text-xs text-slate-500 font-semibold">{settings.schoolName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-maarif-600" />
            <span>2 Dönemli Yıllık Plan Sistemi (Tüm Yıl)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Haftalık parçalı kayıtlar yerine; ara tatiller, yarıyıl tatili, sınavlar, okul temelli planlama ve sosyal etkinlikleri içeren resmi 2 dönemlik bütüncül plan.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <EmbossedButton
            variant="success"
            size="sm"
            icon={<Building2 className="w-4 h-4" />}
            onClick={() => setIsSchoolBasedModalOpen(true)}
          >
            Okul Temelli Planlama (AI)
          </EmbossedButton>

          <EmbossedButton
            variant="purple"
            size="sm"
            icon={<HeartHandshake className="w-4 h-4" />}
            onClick={() => setIsSocialActivityModalOpen(true)}
          >
            Sosyal Etkinlik Planlama (AI)
          </EmbossedButton>

          <button
            onClick={handleExportWord}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Word (.docx) İndir</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>PDF / Yazdır</span>
          </button>
        </div>
      </div>

      {/* Grade & Hours Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Grade Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Sınıf Düzeyi</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[9, 10, 11, 12].map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g as GradeLevel)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-maarif-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g}. Sınıf
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Hours */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Haftalık Ders Saati</label>
            <select
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-maarif-500 cursor-pointer"
            >
              <option value={2}>Haftalık 2 Ders Saati (Yıllık: 74 Saat)</option>
              <option value={4}>Haftalık 4 Ders Saati (Yıllık: 148 Saat)</option>
              <option value={3}>Haftalık 3 Ders Saati (Yıllık: 111 Saat)</option>
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Öğretim Yılı</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-maarif-500"
            />
          </div>

          {/* Total Summary */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase block">Yıllık Müfredat</span>
              <span className="font-extrabold text-blue-950 text-sm">{yearlyPlan.totalHours} Ders Saati</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-blue-600 block">Dönem Dağılımı</span>
              <span className="font-bold text-blue-900">18 + 19 = 37 Hafta</span>
            </div>
          </div>
        </div>

        {/* Grade-Specific Rule Banner */}
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
          isGrade12 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isGrade12 ? 'text-amber-600' : 'text-indigo-600'}`} />
          <div className="space-y-1">
            <strong>Maarif Modeli {selectedGrade}. Sınıf Planlama Kuralı:</strong>
            {isGrade12 ? (
              <p>
                12. sınıfta 1. dönem <strong>Okul Temelli Planlama yapılmaz</strong>. 2. dönem son ayında (Mayıs/Haziran - 36. Hafta) <strong>Cumhuriyet ve Demokrasi Vizyonu Sosyal Etkinliği</strong> yer alır.
              </p>
            ) : (
              <p>
                {selectedGrade}. sınıfta 1. dönem sonunda (Ocak - 18. Hafta) <strong>Sosyal Etkinlik</strong>; 2. dönem sene sonu ayında (Haziran - 36 ve 37. Hafta) ise hem <strong>Okul Temelli Planlama</strong> hem de <strong>Sosyal Etkinlik</strong> zorunlu olarak yer alır.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Term Switcher Subtabs */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTermTab('ALL')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTermTab === 'ALL' ? 'bg-white text-maarif-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tüm Yıl (1 & 2. Dönem Birleşik)
        </button>
        <button
          onClick={() => setActiveTermTab('TERM_1')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTermTab === 'TERM_1' ? 'bg-white text-maarif-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Dönem Planı (Eylül - Ocak • 18 Hafta)
        </button>
        <button
          onClick={() => setActiveTermTab('TERM_2')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTermTab === 'TERM_2' ? 'bg-white text-maarif-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Dönem Planı (Şubat - Haziran • 19 Hafta)
        </button>
      </div>

      {/* TABLE RENDERING */}
      <div className="space-y-8">
        {/* 1. DÖNEM */}
        {(activeTermTab === 'ALL' || activeTermTab === 'TERM_1') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">
                  09 Eylül 2024 - 17 Ocak 2025
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  1. DÖNEM ÇALIŞMA PLANI (18 HAFTA)
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-sky-200">
                <span className="px-2.5 py-1 bg-white/10 rounded-xl border border-white/20">
                  1. ve 2. Ortak Sınavlar
                </span>
                <span className="px-2.5 py-1 bg-white/10 rounded-xl border border-white/20">
                  11-15 Kasım 1. Ara Tatil
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28 text-center">Ay / Tarih</th>
                    <th className="p-3 w-12 text-center">Hafta</th>
                    <th className="p-3 w-12 text-center">Saat</th>
                    <th className="p-3 w-1/4">Tema / Öğrenme Alanı</th>
                    <th className="p-3 w-1/3">Öğrenme Çıktıları ve Süreç</th>
                    <th className="p-3 w-40">Erdem-Değer-Beceri</th>
                    <th className="p-3 w-48">Özel Gün / Sınav / Etkinlik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {yearlyPlan.term1Weeks.map((w) => {
                    const isExam = w.specialType === 'EXAM';
                    const isSocial = w.specialType === 'SOCIAL_ACTIVITY';

                    return (
                      <tr
                        key={w.weekNumber}
                        className={`transition-colors ${
                          isExam
                            ? 'bg-amber-50/70 hover:bg-amber-100/60'
                            : isSocial
                            ? 'bg-purple-50/70 hover:bg-purple-100/60'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="p-3 text-center font-bold text-slate-700">
                          <span className="block text-[10px] uppercase text-slate-400">{w.monthName}</span>
                          <span className="text-[11px]">{w.dateRange}</span>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-800">{w.weekNumber}</td>
                        <td className="p-3 text-center text-slate-600 font-medium">{w.hours}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {w.themeUnit}
                          {isExam && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-md">
                              MEB Ortak Sınav
                            </span>
                          )}
                          {isSocial && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-purple-200 text-purple-900 rounded-md">
                              Maarif Sosyal Etkinlik
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-700 leading-relaxed">{w.learningOutcomes}</td>
                        <td className="p-3 text-slate-500 text-[11px] leading-relaxed">{w.valuesAndSkills}</td>
                        <td className="p-3 font-semibold text-slate-800">
                          {w.specialNote ? (
                            <span className={w.specialNote.includes('Sınav') ? 'text-red-700' : 'text-slate-700'}>
                              {w.specialNote}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. DÖNEM */}
        {(activeTermTab === 'ALL' || activeTermTab === 'TERM_2') && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  03 Şubat 2025 - 20 Haziran 2025
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  2. DÖNEM ÇALIŞMA PLANI (19 HAFTA)
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <span className="px-2.5 py-1 bg-white/10 rounded-xl border border-white/20">
                  31 Mart - 04 Nisan 2. Ara Tatil
                </span>
                <span className="px-2.5 py-1 bg-white/10 rounded-xl border border-white/20">
                  Sene Sonu Etkinlikleri
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-28 text-center">Ay / Tarih</th>
                    <th className="p-3 w-12 text-center">Hafta</th>
                    <th className="p-3 w-12 text-center">Saat</th>
                    <th className="p-3 w-1/4">Tema / Öğrenme Alanı</th>
                    <th className="p-3 w-1/3">Öğrenme Çıktıları ve Süreç</th>
                    <th className="p-3 w-40">Erdem-Değer-Beceri</th>
                    <th className="p-3 w-48">Özel Gün / Sınav / Etkinlik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {yearlyPlan.term2Weeks.map((w) => {
                    const isExam = w.specialType === 'EXAM';
                    const isSchool = w.specialType === 'SCHOOL_BASED';
                    const isSocial = w.specialType === 'SOCIAL_ACTIVITY';

                    return (
                      <tr
                        key={w.weekNumber}
                        className={`transition-colors ${
                          isExam
                            ? 'bg-amber-50/70 hover:bg-amber-100/60'
                            : isSchool
                            ? 'bg-emerald-50/70 hover:bg-emerald-100/60'
                            : isSocial
                            ? 'bg-purple-50/70 hover:bg-purple-100/60'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="p-3 text-center font-bold text-slate-700">
                          <span className="block text-[10px] uppercase text-slate-400">{w.monthName}</span>
                          <span className="text-[11px]">{w.dateRange}</span>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-800">{w.weekNumber}</td>
                        <td className="p-3 text-center text-slate-600 font-medium">{w.hours}</td>
                        <td className="p-3 font-bold text-slate-900">
                          {w.themeUnit}
                          {isExam && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-md">
                              MEB Ortak Sınav
                            </span>
                          )}
                          {isSchool && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-200 text-emerald-900 rounded-md">
                              Okul Temelli Plan
                            </span>
                          )}
                          {isSocial && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold bg-purple-200 text-purple-900 rounded-md">
                              Maarif Sosyal Etkinlik
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-700 leading-relaxed">{w.learningOutcomes}</td>
                        <td className="p-3 text-slate-500 text-[11px] leading-relaxed">{w.valuesAndSkills}</td>
                        <td className="p-3 font-semibold text-slate-800">
                          {w.specialNote ? (
                            <span className={w.specialNote.includes('Sınav') ? 'text-red-700' : 'text-slate-700'}>
                              {w.specialNote}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* School Based Plan Modal */}
      <SchoolBasedPlanningModal
        isOpen={isSchoolBasedModalOpen}
        onClose={() => setIsSchoolBasedModalOpen(false)}
        gradeLevel={selectedGrade}
        settings={settings}
        onSavePlan={(p) => setCustomSchoolPlan(p)}
      />

      {/* Social Activity Modal */}
      <SocialActivitiesModal
        isOpen={isSocialActivityModalOpen}
        onClose={() => setIsSocialActivityModalOpen(false)}
        gradeLevel={selectedGrade}
        settings={settings}
        onSaveActivity={(a) => setCustomSocialActivity(a)}
      />
    </div>
  );
};
