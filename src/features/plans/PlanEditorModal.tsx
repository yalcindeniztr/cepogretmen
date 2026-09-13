import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Mic,
  Save,
  Download,
  Printer,
  Check,
  BookOpen,
  Calendar,
  Layers,
  Heart,
  Scale,
  Compass,
  Clock,
  FileCheck,
  HelpCircle,
  Brain
} from 'lucide-react';
import { PlanItem, PlanType, GradeLevel, AppSettings } from '../../core/types';
import { HISTORY_CURRICULUM, MAARIF_VALUES, MAARIF_SKILLS } from '../../core/constants/maarifCurriculum';
import { MEB_WORK_CALENDAR_WEEKS } from '../../core/constants/mebWorkCalendar';
import { GeminiService } from '../../services/ai/geminiService';
import { SpeechService } from '../../services/speech/speechService';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface PlanEditorModalProps {
  plan: PlanItem | null;
  initialType?: PlanType;
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PlanItem) => void;
}

export const PlanEditorModal: React.FC<PlanEditorModalProps> = ({
  plan,
  initialType = 'DAILY',
  settings,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<PlanType>(plan ? plan.type : initialType);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(plan ? plan.gradeLevel : 9);
  const [weekNumber, setWeekNumber] = useState<number>(plan ? plan.weekNumber : 8);
  const [dateRange, setDateRange] = useState<string>(plan ? plan.dateRange : '28 Ekim - 01 Kasım');
  const [lessonHours, setLessonHours] = useState<number>(plan ? plan.lessonHours : (settings.defaultWeeklyHours || 2));
  const [subject, setSubject] = useState<string>(plan ? plan.subject : 'TARİH');
  const [themeUnit, setThemeUnit] = useState<string>(plan ? plan.themeUnit : 'TAR.9.1.GEÇMİŞİN İNŞA SÜRECİNDE TARİH / SINAV HAFTASI');
  const [title, setTitle] = useState<string>(plan ? plan.title : 'Tarih Araştırma ve Yazımında Dijitalleşme');

  // BÖLÜM 1: DERS BİLGİSİ & PROGRAMLAR ARASI BİLEŞENLER
  const [domainSkills, setDomainSkills] = useState<string>(
    plan?.domainSkills || 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.5. Kaynağı Yorumlama, SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.3. Kaynağı İnceleme, SBAB1. Zamanı Algılama ve Kronolojik Düşünme, KB2.17. Değerlendirme'
  );
  const [conceptualSkills, setConceptualSkills] = useState<string>(plan?.conceptualSkills || 'KB2.4. Çözümleme');
  const [dispositions, setDispositions] = useState<string>(
    plan?.dispositions || 'E2.1. Empati, E3.2. Odaklanma, E3.3. Yaratıcılık, E3.6. Analitiklik Düşünme, E3.10. Eleştirel Bakma'
  );
  const [socialEmotionalSkills, setSocialEmotionalSkills] = useState<string>(
    plan?.socialEmotionalSkills || 'SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme'
  );
  const [values, setValues] = useState<string[]>(plan ? plan.values : ['D6. Dürüstlük', 'D19. Vatanseverlik']);
  const [literacySkills, setLiteracySkills] = useState<string>(plan?.literacySkills || 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık');
  const [interdisciplinaryRelations, setInterdisciplinaryRelations] = useState<string>(
    plan?.interdisciplinaryRelations || 'Coğrafya, Felsefe, Matematik, Sosyoloji'
  );
  const [interSkillRelations, setInterSkillRelations] = useState<string>(
    plan?.interSkillRelations || 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.2. Kaynaklardan Bilgi Toplama, SBAB2.3. Kaynağı İnceleme, SBAB2.4. Kaynağı Sorgulama, KB3.1. Karar Verme'
  );

  // BÖLÜM 2: ÖĞRENME ÇIKTILARI, İÇERİK VE KANITLAR
  const [outcomesText, setOutcomesText] = useState<string>(
    plan?.learningOutcomes.join('\n') ||
      'TAR.9.1.4. Dijitalleşmenin tarih araştırma ve yazımının dönüşümüne etkisini değerlendirebilme\na) Dijitalleşme öncesindeki ve dijital dönemdeki tarih araştırma ve yazım süreçlerini karşılaştırır.\nb) Tarih araştırma ve yazımında dijitalleşmeyle meydana gelen dönüşüme dair yargıda bulunur.'
  );
  const [contentFramework, setContentFramework] = useState<string>(plan?.contentFramework || 'Tarih Araştırma ve Yazımında Dijitalleşme');
  const [learningEvidences, setLearningEvidences] = useState<string>(
    plan?.learningEvidences ||
      '* Bu ünitedeki öğrenme çıktıları; çalışma yaprağı, infografik ve performans görevleri ile değerlendirilebilir.\n* Tarihin doğası çerçevesinde tarih kavramının kapsamını ve tarihsel bilginin özelliklerini izlemeye yönelik çalışma yaprağı ve tarihsel bilginin üretim aşamalarını göstermeye yönelik infografik kullanılabilir. Oluşturulan infografiklerin değerlendirilmesinde dereceli puanlama anahtarından yararlanılabilir.\n* Performans görevi olarak öğrencilerden tarih öğrenmenin bireye ve topluma faydalarının yorumlanabilmesine ilişkin afiş hazırlamaları istenebilir. Hazırlanan afiş dereceli puanlama anahtarı ile değerlendirilebilir.\n* Performans görevi olarak öğrencilerden dijitalleşmenin tarih araştırma ve yazımının dönüşümüne olumlu ve olumsuz etkisine yönelik fikirlerini içeren bir ağ günlüğü sayfası hazırlamaları istenebilir.'
  );

  // BÖLÜM 3: ÖĞRENME-ÖĞRETME YAŞANTILARI
  const [basicAssumptions, setBasicAssumptions] = useState<string>(
    plan?.basicAssumptions ||
      '* Öğrencilerin kültürel mirasın aktarılmasında tarihin rolü olduğu bilgisine ve temel düzeyde tarih araştırmaları deneyimine sahip oldukları kabul edilmektedir.\n* Sosyal bilim, fen bilimleri ve büyük veri hakkında ön bilgilere sahip oldukları kabul edilmektedir.\n* Tarihin beşerî bir bilim dalı olduğuna ve bilimsel bir yöntem kullandığına ilişkin ön bilgileri olduğu kabul edilmektedir.\n* Hayatın her alanındaki dijitalleşmenin tarih araştırmaları için de kullanılabileceğine ilişkin temel bilgilere sahip oldukları kabul edilmektedir.\n* Teknolojinin tarih dersinde uygun biçimde kullanımına ilişkin ön bilgilere sahip oldukları kabul edilmektedir.'
  );
  const [preAssessmentProcess, setPreAssessmentProcess] = useState<string>(
    plan?.preAssessmentProcess ||
      '* Ünite kapsamında öğrencilere aşağıdaki rehber sorular sorulabilir:\n• Kültürel mirasın aktarılmasında tarihin rolü ne olabilir?\n• Tarihin araştırma basamakları neler olabilir?'
  );
  const [processComponents, setProcessComponents] = useState<string>(
    plan?.processComponents ||
      '1. Giriş ve Güdüleme: Dijital arşiv ve geleneksel vesika karşılaştırması yansıtılır.\n2. Keşfetme: Öğrenci grupları dijitalleşmenin tarih yazımına katkısını tartışır.\n3. Derinleştirme: EBA ve Devlet Arşivleri Başkanlığı dijital taraması yapılır.\n4. Özetleme & Değerlendirme: Ağ günlüğü sayfası hazırlama yönergesi verilerek ders toparlanır.'
  );
  const [enrichment, setEnrichment] = useState<string>(plan?.differentiation.enrichment || 'Büyük veri ve yapay zekânın tarih yazımına etkisi araştırması.');
  const [support, setSupport] = useState<string>(plan?.differentiation.support || 'Geleneksel ve dijital kaynak türlerini eşleştirme kartları.');
  const [resources, setResources] = useState<string>(plan?.resources || `MEB ${gradeLevel}. Sınıf Tarih Ders Kitabı, MEBİ, EBA, OGM Materyal`);
  const [notes, setNotes] = useState<string>(plan?.notes || '29 Ekim Cumhuriyet Bayramı anma haftası ve 1. Ortak Sınav hazırlığı');

  const [activeTabSection, setActiveTabSection] = useState<'SEC1' | 'SEC2' | 'SEC3'>('SEC1');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // When week is selected from MEB Work Calendar
  const handleCalendarWeekChange = (wNum: number) => {
    setWeekNumber(wNum);
    const found = MEB_WORK_CALENDAR_WEEKS.find(w => w.weekNumber === wNum);
    if (found) {
      setDateRange(found.dateRange);
      if (found.specialDayOrNote) {
        setNotes(found.specialDayOrNote);
      }
    }
  };

  // AI Auto-generate all 3 sections
  const handleAIGenerate = async () => {
    setIsGeneratingAI(true);
    try {
      const result = await GeminiService.generateMaarifPlan(
        gradeLevel,
        themeUnit || 'Tarihin Doğası',
        contentFramework || title,
        type,
        dateRange,
        lessonHours,
        settings.geminiApiKey
      );

      setDomainSkills(result.domainSkills);
      setConceptualSkills(result.conceptualSkills);
      setDispositions(result.dispositions);
      setSocialEmotionalSkills(result.socialEmotionalSkills);
      setValues(result.values);
      setLiteracySkills(result.literacySkills);
      setInterdisciplinaryRelations(result.interdisciplinaryRelations);
      setInterSkillRelations(result.interSkillRelations);

      setOutcomesText(result.learningOutcomes.join('\n'));
      setContentFramework(result.contentFramework);
      setLearningEvidences(result.learningEvidences);

      setBasicAssumptions(result.basicAssumptions);
      setPreAssessmentProcess(result.preAssessmentProcess);
      setProcessComponents(result.processComponents);
      setEnrichment(result.differentiation.enrichment);
      setSupport(result.differentiation.support);
      setResources(result.resources);

      SpeechService.speak(`3 Bölümlü Maarif ders planınız yapay zeka tarafından eksiksiz hazırlandı.`);
    } catch (e) {
      console.error(e);
      alert('Yapay zeka planı hazırlanırken bir hata oluştu.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Voice dictation
  const handleVoiceInput = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (isListeningMic) return;
    setIsListeningMic(true);

    SpeechService.startListening(
      (transcript) => {
        setter(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningMic(false);
      },
      (err) => {
        setIsListeningMic(false);
        alert(`Ses algılama hatası: ${err}`);
      },
      () => {
        setIsListeningMic(false);
      }
    );
  };

  const constructPlanItem = (): PlanItem => {
    const totalHours = 36 * lessonHours;
    return {
      id: plan ? plan.id : `plan-${Date.now()}`,
      type,
      gradeLevel,
      subject,
      title: title || `${gradeLevel}. Sınıf Tarih Planı`,
      weekNumber: Number(weekNumber) || 1,
      dateRange: dateRange || 'Eylül',
      lessonHours: Number(lessonHours) || 2,
      totalYearlyHours: totalHours,

      // BÖLÜM 1
      themeUnit: themeUnit || '1. Tema',
      domainSkills,
      conceptualSkills,
      dispositions,
      socialEmotionalSkills,
      values,
      literacySkills,
      interdisciplinaryRelations,
      interSkillRelations,

      // BÖLÜM 2
      learningOutcomes: outcomesText.split('\n').map(o => o.trim()).filter(Boolean),
      contentFramework,
      topics: [contentFramework],
      learningEvidences,

      // BÖLÜM 3
      basicAssumptions,
      preAssessmentProcess,
      processComponents,
      skills: domainSkills.split(',').map(s => s.trim()),
      socialActivities: 'Okul ve sınıf içi etkinlik.',
      differentiation: {
        enrichment,
        support
      },
      evaluation: learningEvidences,
      resources,
      notes,
      createdAt: plan ? plan.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSave = () => {
    const item = constructPlanItem();
    onSave(item);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleWordExport = async () => {
    const item = constructPlanItem();
    await DocxExportService.exportPlanToWord(item, settings);
  };

  const handlePdfPrint = () => {
    const item = constructPlanItem();
    PdfPrintService.printPlan(item, settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-maarif-800 via-maarif-700 to-sky-700 text-white border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {plan ? 'Ders Planını Düzenle' : 'Türkiye Yüzyılı Maarif Modeli Ders Planı Şablonu'}
              </h2>
              <p className="text-xs text-sky-100">
                {settings.schoolName} • Öğretmen: {settings.teacherName} (Tarih)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Quick Bar: Plan Type, Calendar Week, Lesson Hours, AI Auto-Fill */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Plan Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Plan Türü</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PlanType)}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-maarif-500"
              >
                <option value="DAILY">Günlük Ders Planı (3 Bölümlü Şablon)</option>
                <option value="YEARLY">Yıllık Plan (MEB Çalışma Takvimli)</option>
              </select>
            </div>

            {/* Sınıf */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sınıf</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value) as GradeLevel)}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-maarif-500"
              >
                <option value={9}>9. SINIF</option>
                <option value={10}>10. SINIF</option>
                <option value={11}>11. SINIF</option>
                <option value={12}>12. SINIF</option>
              </select>
            </div>

            {/* MEB Çalışma Takvimi Haftası */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-maarif-600" />
                <span>MEB Çalışma Takvimi</span>
              </label>
              <select
                value={weekNumber}
                onChange={(e) => handleCalendarWeekChange(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-maarif-500"
              >
                {MEB_WORK_CALENDAR_WEEKS.map((w) => (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    {w.weekNumber}. Hafta ({w.dateRange}) {w.specialDayOrNote ? `• ${w.specialDayOrNote}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Haftalık Ders Saati (Kullanıcı Girişli) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>Ders Saati</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={lessonHours}
                  onChange={(e) => setLessonHours(Number(e.target.value))}
                  className="w-16 px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-maarif-500 text-center"
                />
                <span className="text-xs font-medium text-slate-500">Saat</span>
              </div>
            </div>
          </div>

          {/* AI Fill Button */}
          <EmbossedButton
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-4 h-4 text-amber-300" />}
            onClick={handleAIGenerate}
            disabled={isGeneratingAI}
          >
            {isGeneratingAI ? 'Yapay Zeka Hazırlıyor...' : 'Yapay Zeka ile 3 Bölümü Doldur'}
          </EmbossedButton>
        </div>

        {/* 3 Section Navigation Tabs (Birebir MEB Şablon Kısımları) */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTabSection('SEC1')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTabSection === 'SEC1'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Bölüm: DERS BİLGİSİ & PROGRAMLAR ARASI
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection('SEC2')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTabSection === 'SEC2'
                ? 'border-blue-600 text-blue-800 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Bölüm: ÇIKTILAR, İÇERİK & KANITLAR
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSection('SEC3')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTabSection === 'SEC3'
                ? 'border-amber-600 text-amber-800 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Bölüm: ÖĞRENME-ÖĞRETME YAŞANTILARI
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          {/* ==================== BÖLÜM 1: DERS BİLGİSİ & PROGRAMLAR ARASI ==================== */}
          {activeTabSection === 'SEC1' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>BÖLÜM 1: Ders Kimliği, Alan Becerileri (SBAB), Kavramsal Beceriler (KB), Eğilimler ve Değerler</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tema / Ünite</label>
                  <input
                    type="text"
                    value={themeUnit}
                    onChange={(e) => setThemeUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ders Adı & Süre</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                    <input
                      type="text"
                      value={`${lessonHours} Ders Saati`}
                      disabled
                      className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alan Becerileri (SBAB Kodları ve Açıklamaları)</label>
                <textarea
                  rows={2}
                  value={domainSkills}
                  onChange={(e) => setDomainSkills(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kavramsal Beceriler (KB Kodları)</label>
                  <input
                    type="text"
                    value={conceptualSkills}
                    onChange={(e) => setConceptualSkills(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Eğilimler (E Kodları)</label>
                  <input
                    type="text"
                    value={dispositions}
                    onChange={(e) => setDispositions(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Programlar Arası Bileşenler</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sosyal-Duygusal Öğrenme Becerileri (SDB Kodları)</label>
                    <input
                      type="text"
                      value={socialEmotionalSkills}
                      onChange={(e) => setSocialEmotionalSkills(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Değerler (D Kodları)</label>
                      <input
                        type="text"
                        value={values.join(', ')}
                        onChange={(e) => setValues(e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Okuryazarlık Becerileri (OB Kodları)</label>
                      <input
                        type="text"
                        value={literacySkills}
                        onChange={(e) => setLiteracySkills(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Disiplinler Arası İlişki</label>
                      <input
                        type="text"
                        value={interdisciplinaryRelations}
                        onChange={(e) => setInterdisciplinaryRelations(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Beceriler Arası İlişki</label>
                      <input
                        type="text"
                        value={interSkillRelations}
                        onChange={(e) => setInterSkillRelations(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== BÖLÜM 2: ÖĞRENME ÇIKTILARI, İÇERİK & KANITLAR ==================== */}
          {activeTabSection === 'SEC2' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 font-semibold flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>BÖLÜM 2: Öğrenme Çıktıları ve Süreç Bileşenleri, İçerik Çerçevesi ve Öğrenme Kanıtları (Rubrik vb.)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Öğrenme Çıktıları ve Süreç Bileşenleri (Kazanım Kodu ve a, b maddeleri)
                </label>
                <textarea
                  rows={4}
                  value={outcomesText}
                  onChange={(e) => setOutcomesText(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İçerik Çerçevesi (Konu Başlığı)</label>
                <input
                  type="text"
                  value={contentFramework}
                  onChange={(e) => setContentFramework(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Öğrenme Kanıtları (Çalışma yaprağı, infografik, afiş, ağ günlüğü, dereceli puanlama anahtarı, öz değerlendirme)
                </label>
                <textarea
                  rows={6}
                  value={learningEvidences}
                  onChange={(e) => setLearningEvidences(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ==================== BÖLÜM 3: ÖĞRENME-ÖĞRETME YAŞANTILARI ==================== */}
          {activeTabSection === 'SEC3' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-600" />
                <span>BÖLÜM 3: Temel Kabuller, Ön Değerlendirme Süreci, Süreç Adımları ve Farklılaştırma</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Temel Kabuller</label>
                <textarea
                  rows={4}
                  value={basicAssumptions}
                  onChange={(e) => setBasicAssumptions(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ön Değerlendirme Süreci (Rehber Sorular)</label>
                <textarea
                  rows={3}
                  value={preAssessmentProcess}
                  onChange={(e) => setPreAssessmentProcess(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Öğrenme-Öğretme Uygulamaları (Giriş / Keşfetme / Derinleştirme / Özetleme)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleVoiceInput(setProcessComponents)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg border bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sesle Yazdır</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={processComponents}
                  onChange={(e) => setProcessComponents(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farklılaştırma: Zenginleştirme</label>
                  <textarea
                    rows={2}
                    value={enrichment}
                    onChange={(e) => setEnrichment(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farklılaştırma: Destekleme</label>
                  <textarea
                    rows={2}
                    value={support}
                    onChange={(e) => setSupport(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kaynaklar (Ders Kitabı, MEBİ, EBA, OGM)</label>
                  <input
                    type="text"
                    value={resources}
                    onChange={(e) => setResources(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Takvim Notu / Özel Günler</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-semibold text-rose-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Quick 3-Section Navigators, Word, PDF & Save */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWordExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Word İndir (.docx)</span>
            </button>

            <button
              type="button"
              onClick={handlePdfPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDF / Yazdır</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Vazgeç
            </button>

            <EmbossedButton
              variant="primary"
              size="md"
              icon={saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              {saveSuccess ? 'Plan Kaydedildi!' : 'Bilgisayara Kaydet'}
            </EmbossedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
