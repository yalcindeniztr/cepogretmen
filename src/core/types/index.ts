export type GradeLevel = 9 | 10 | 11 | 12;

export type PlanType = 'YEARLY' | 'DAILY';

export interface AppSettings {
  id: number;
  schoolName: string;
  teacherName: string;
  principalName: string;
  academicYear: string;
  term: '1. Dönem' | '2. Dönem' | 'Tam Yıl';
  defaultWeeklyHours: number; // Haftalık ders saati (Kullanıcı girişli, örn: 2)
  geminiApiKey?: string;
  speechEnabled?: boolean;
}

export interface PlanItem {
  id: string;
  type: PlanType;
  gradeLevel: GradeLevel;
  subject: string; // 'TARİH'
  title: string;
  weekNumber: number;
  dateRange: string;
  lessonHours: number; // Ders Süresi / Saati (Örn: 2 Ders Saati)
  totalYearlyHours?: number; // Yıllık Plandaki kümülatif veya toplam ders saati (36 hafta x saat)

  // BÖLÜM 1: DERS BİLGİSİ & PROGRAMLAR ARASI BİLEŞENLER
  themeUnit: string; // Tema / Ünite (Örn: TAR.9.1.GEÇMİŞİN İNŞA SÜRECİNDE TARİH / SINAV HAFTASI)
  domainSkills: string; // Alan Becerileri (SBAB kodları)
  skills?: string[]; // Genel / Alan becerileri listesi
  conceptualSkills: string; // Kavramsal Beceriler (KB kodları)
  dispositions: string; // Eğilimler (E kodları: E2.1. Empati, E3.2. Odaklanma vb.)
  socialEmotionalSkills: string; // Sosyal-Duygusal Öğr. Bec. (SDB kodları)
  values: string[]; // Değerler (D kodları: D6. Dürüstlük, D19. Vatanseverlik)
  literacySkills: string; // Okuryazarlık Becerileri (OB1. Bilgi, OB2. Dijital vb.)
  interdisciplinaryRelations: string; // Disiplinler Arası İlişki (Coğrafya, Felsefe vb.)
  interSkillRelations: string; // Beceriler Arası İlişki (SBAB, KB kodları)

  // BÖLÜM 2: ÖĞRENME ÇIKTILARI, İÇERİK ÇERÇEVESİ VE ÖĞRENME KANITLARI
  learningOutcomes: string[]; // Öğrenme Çıktıları ve Süreç Bileşenleri (TAR.9.1.4. a, b...)
  contentFramework: string; // İçerik Çerçevesi (Konu özeti)
  topics: string[]; // Alt Konu başlıkları
  learningEvidences: string; // Öğrenme Kanıtları (Çalışma yaprağı, infografik, afiş, rubrik, öz değerlendirme)

  // BÖLÜM 3: ÖĞRENME-ÖĞRETME YAŞANTILARI
  basicAssumptions: string; // Temel Kabuller
  preAssessmentProcess: string; // Ön Değerlendirme Süreci (Rehber Sorular)
  processComponents: string; // Öğrenme-Öğretme Uygulamaları (Giriş / Keşfetme / Derinleştirme / Özetleme)
  bridgingHook?: string; // Köprü Kurma / Güdüleme
  socialActivities: string; // Sosyal Etkinlik ve Okul Temelli Öğrenme
  differentiation: {
    enrichment: string; // Zenginleştirme
    support: string; // Destekleme
  };
  evaluation: string; // Ölçme ve Değerlendirme
  resources: string; // Kaynaklar (MEBİ, EBA, OGM Materyal vb.)
  notes?: string; // Özel günler, bayramlar, sınav notları
  createdAt: string;
  updatedAt: string;
}

export type LibraryCategory = 'YONETMELIK' | 'DERS_KITABI' | 'MEBI_EBA_OGM' | 'OLCEK' | 'DERS_NOTU';

export interface LibraryItem {
  id: string;
  title: string;
  category: LibraryCategory;
  gradeLevel?: GradeLevel | 'Tümü';
  description: string;
  content?: string;
  linkUrl?: string;
  tags: string[];
  isCustom?: boolean;
  dateAdded: string;
}

export interface EvaluationScale {
  id: string;
  title: string;
  gradeLevel: GradeLevel | 'Tümü';
  type: 'RUBRIK' | 'GOZLEM_FORMU' | 'OZ_DEGERLENDIRME' | 'AKRAN_DEGERLENDIRME' | 'PERFORMANS_GOREVI';
  purpose: string;
  criteria: Array<{
    dimension: string;
    description: string;
    maxScore: number;
  }>;
  instructions: string;
}

export interface MebCalendarReminder {
  id: string;
  title: string;
  dateStr: string;
  category: 'ZUMRE' | 'SINAV' | 'E_OKUL' | 'KULUP' | 'TATIL';
  description: string;
  actionRequired: string;
  isUrgent?: boolean;
}

export interface MebWeekSchedule {
  weekNumber: number;
  dateRange: string;
  term: '1. Dönem' | '2. Dönem';
  specialDayOrNote?: string;
}

export type QuestionDifficulty = 'Kolay' | 'Orta' | 'Zor';

export interface ExamRubricCriterion {
  criterion: string; // Cevabın bu kısmı verilirse
  points: number; // Verilecek puan
  partialGuidance?: string; // Yarım / eksik cevap değerlendirmesi
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  learningOutcome: string;
  domainSkill?: string;
  conceptualSkill?: string;
  value?: string;
  difficulty: QuestionDifficulty; // Zorluk Derecesi (Kolay, Orta, Zor)
  cognitiveLevel?: string; // Bilişsel düzey
  contextText: string;
  questionText: string;
  sampleAnswer: string;
  rubricGuide: ExamRubricCriterion[];
  partialCreditNotes?: string; // Öğrenci yarım cevap verirse uygulanacak puanlama kuralı
  maxPoints: number;
}

export interface ExamPaper {
  id: string;
  gradeLevel: GradeLevel;
  academicYear: string;
  term: '1. Dönem' | '2. Dönem';
  examNumber: '1. Sınav' | '2. Sınav';
  examType: 'OKUL_GENELI_ORTAK' | 'IL_GENELI_ORTAK' | 'MEB_MERKEZI_ORTAK';
  scenario: string;
  themeUnit: string;
  topics: string[];
  durationMinutes: number;
  totalScore: number;
  questions: ExamQuestion[];
  schoolName: string;
  teacherName: string;
  instructions: string;
  isBep?: boolean; // BEP / Kaynaştırma sınavı mı?
  analysis?: ExamItemAnalysis; // Sınav soru ve kazanım analiz tablosu
  createdAt: string;
  updatedAt: string;
}

export interface ExamStudentResult {
  id: string;
  studentNo: string;
  studentName: string;
  questionScores: number[]; // 10 sorunun her birinden alınan puanlar
  totalScore: number;
}

export interface ExamItemAnalysis {
  id: string;
  examId: string;
  className: string; // Örn: 9/A, 10/B MTAL
  academicYear: string;
  term: string;
  examNumber: string;
  examDate?: string;
  students: ExamStudentResult[];
  questionSuccessRates: number[]; // Yüzde başarı oranı (0..100)
  questionAverageScores: number[]; // Soru bazlı ortalama puan
  acquiredOutcomes: string[]; // Başarılı edinilen kazanımlar (>= %50)
  unacquiredOutcomes: string[]; // Telafi gerektiren eksik kazanımlar (< %50)
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  passingCount: number; // >= 50 alan sayısı
  failingCount: number; // < 50 alan sayısı
  actionPlan?: string; // Telafi eylem planı
  updatedAt: string;
}

export interface PerformanceTaskItem {
  id: string;
  title: string;
  gradeLevel: GradeLevel;
  themeUnit: string;
  academicYear: string;
  term: '1. Dönem' | '2. Dönem';
  description: string;
  objective: string;
  steps: string[];
  submissionFormat: string;
  deadlineWeeks: number;
  rubricCriteria: {
    title: string;
    points: number;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentMinutesItem {
  id: string;
  meetingType: 'DÖNEM_BASI_1' | 'DÖNEM_BASI_2' | 'DÖNEM_SONU';
  title: string;
  academicYear: string;
  meetingDate: string;
  meetingPlace: string;
  agendaItems: string[];
  decisions: string[];
  attendees: {
    name: string;
    title: string;
  }[];
  principalName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolBasedPlanItem {
  id: string;
  gradeLevel: GradeLevel;
  term: '1. Dönem' | '2. Dönem';
  activityTitle: string;
  themeUnit: string;
  localContext: string; // Çevre şartları, tarihi mekan, yerel arşiv, okul imkanı
  objective: string;
  learningOutcomes: string[];
  implementationSteps: string[];
  evaluationEvidence: string;
  resources: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialActivityPlanItem {
  id: string;
  gradeLevel: GradeLevel;
  term: '1. Dönem' | '2. Dönem';
  activityTitle: string;
  category: 'MILLI_BAYRAM_ANMA' | 'TARIH_KULUBU' | 'MUNAZARA_PANEL' | 'MUZE_SERGI' | 'SOZLU_TARIH';
  maarifValues: string[];
  targetMonthOrWeek: string;
  description: string;
  studentTasks: string[];
  expectedOutcomes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TwoTermYearlyPlanWeek {
  weekNumber: number;
  term: '1. Dönem' | '2. Dönem';
  dateRange: string;
  monthName: string;
  hours: number;
  cumulativeHours: number;
  themeUnit: string;
  learningOutcomes: string;
  processComponents: string;
  valuesAndSkills: string;
  methodsAndTechniques: string;
  toolsAndMaterials: string;
  specialType?: 'NORMAL' | 'EXAM' | 'VACATION' | 'SCHOOL_BASED' | 'SOCIAL_ACTIVITY';
  specialNote?: string;
}

export interface FullTwoTermYearlyPlan {
  id: string;
  academicYear: string;
  gradeLevel: GradeLevel;
  weeklyHours: number;
  totalHours: number;
  term1Weeks: TwoTermYearlyPlanWeek[];
  term2Weeks: TwoTermYearlyPlanWeek[];
  schoolBasedPlans: SchoolBasedPlanItem[];
  socialActivities: SocialActivityPlanItem[];
  schoolName: string;
  teacherName: string;
  principalName: string;
  createdAt: string;
  updatedAt: string;
}

