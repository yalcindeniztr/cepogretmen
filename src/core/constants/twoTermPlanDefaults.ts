import { GradeLevel, SchoolBasedPlanItem, SocialActivityPlanItem, TwoTermYearlyPlanWeek, FullTwoTermYearlyPlan, AppSettings } from '../types';
import { MEB_WORK_CALENDAR_WEEKS } from './mebWorkCalendar';

export const DEFAULT_SCHOOL_BASED_PLANS: SchoolBasedPlanItem[] = [
  {
    id: 'school-plan-9',
    gradeLevel: 9,
    term: '2. Dönem',
    activityTitle: 'Yerel Tarih, Çevredeki Tarihi Yapılar ve Somut Olmayan Kültürel Miras İncelemesi',
    themeUnit: 'TAR.9.4. Kadim Dünyadan Miras & Yerel Çevre Kültürü',
    localContext: 'Okulun bulunduğu il/ilçe çevresindeki tarihi camiler, medreseler, köprüler, hanlar veya şehitlikler.',
    objective: 'Öğrencilerin yaşadıkları yerin tarihsel gelişimini birincil tanıklar, kitabeler ve mimari eserler üzerinden somutlaştırarak koruma bilinci kazanması.',
    learningOutcomes: [
      'TAR.9.4.1. Çevresindeki somut kültürel miras unsurlarını dönem özellikleri ve işlevleri bağlamında açıklar.',
      'TAR.9.4.2. Yerel kültürel değerlerin korunmasında birey ve toplum sorumluluğunu savunur.'
    ],
    implementationSteps: [
      'Okul çevresindeki tarihi bir yapının veya yerel bir kültürel unsurun zümre tarafından belirlenmesi.',
      'Öğrencilere fotoğraf çekimi, kitabe okuma veya yerel kaynak tarama rehberi hazırlanması.',
      'Okul bahçesinde veya sınıf ortamında "Yerel Mirasımız" temalı fotoğraf ve gözlem sergisi açılması.'
    ],
    evaluationEvidence: 'Fotoğraflı saha gözlem formu, hazırlanan tanıtım broşürü ve öz değerlendirme ölçeği.',
    resources: 'İl Kültür ve Turizm Müdürlüğü envanteri, yerel kütüphane arşivleri, dijital haritalar.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'school-plan-10',
    gradeLevel: 10,
    term: '2. Dönem',
    activityTitle: 'Osmanlı Vakıf Medeniyeti ve Mahalle Hayatı Alan Araştırması',
    themeUnit: 'TAR.10.3. Klasik Dönem Osmanlı Toplum Düzeni ve Vakıflar',
    localContext: 'Bölgedeki tarihi vakıf eserleri, kervansaraylar, imarethaneler veya zanaat sokakları.',
    objective: 'Vakıf sisteminin toplumsal dayanışma, adalet ve imar faaliyetlerindeki rolünü yerinde inceleyerek kavrama.',
    learningOutcomes: [
      'TAR.10.3.2. Vakıf kurumlarının Osmanlı şehir kültürüne ve sosyal barışa katkısını örneklerle açıklar.'
    ],
    implementationSteps: [
      'Vakıflar Genel Müdürlüğü dijital arşivinden bölgedeki tarihi vakfiyelerin incelenmesi.',
      'Vakıf eserinin günümüzdeki durumu ve koruma çalışmaları üzerine raporlama yapılması.'
    ],
    evaluationEvidence: 'Vakıf analiz raporu ve sözlü sunum rubriği.',
    resources: 'Vakfiyeler, Osmanlı tapu tahrir özetleri, yerel vakıf yapıları.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'school-plan-11',
    gradeLevel: 11,
    term: '2. Dönem',
    activityTitle: 'Milli İktisat, Demiryolları ve Sanayileşme Mirası İncelemesi',
    themeUnit: 'TAR.11.4. Osmanlı İktisat Düzeni ve Modern Sanayi Girişimleri',
    localContext: 'Tarihi tren garları, eski sanayi tesisleri, un fabrikaları veya zanaatkar çarşıları.',
    objective: 'Sanayi Devrimi sonrası Osmanlı modernleşmesinin ulaşım ve sanayi boyutunu yerel kanıtlarla tahlil etme.',
    learningOutcomes: [
      'TAR.11.4.3. 19. yüzyılda ulaşım ve üretim ağındaki dönüşümü yerel sanayi kalıntılarıyla ilişkilendirir.'
    ],
    implementationSteps: [
      'Bölgedeki demiryolu hattı veya tarihi üretim tesisinin tarihçesinin araştırılması.',
      'Eski ve yeni fotoğrafların karşılaştırmalı dijital sunum haline getirilmesi.'
    ],
    evaluationEvidence: 'Karşılaştırmalı dijital poster ve grup çalışma raporu.',
    resources: 'TCDD tarih arşivi, yerel sanayi odası kayıtları, arşiv fotoğrafları.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_SOCIAL_ACTIVITIES: SocialActivityPlanItem[] = [
  {
    id: 'social-act-1',
    gradeLevel: 9,
    term: '1. Dönem',
    activityTitle: 'Tarihsel Empati ve Zaman Yolculuğu Münazarası: Yazının İcadından Dijital Çağa',
    category: 'MUNAZARA_PANEL',
    maarifValues: ['D3. Bilimsellik', 'D18. Sorumluluk', 'D1. Adalet'],
    targetMonthOrWeek: '1. Dönem Sonu (Ocak Ayı)',
    description: 'Öğrenciler "Tarihin yazımında sözlü kültür mü yoksa yazılı arşivler mi daha belirleyicidir?" tezini savunarak tarihsel eleştiri becerilerini sergiler.',
    studentTasks: [
      'Savunulacak tez için MEBİ ve EBA üzerinden birinci elden kanıt toplama.',
      'Argüman ve karşı argüman tablosu oluşturma.',
      'Münazara jürisi için değerlendirme rubriği hazırlama.'
    ],
    expectedOutcomes: 'Eleştirel düşünme, kanıta dayalı argüman üretme ve kendini ifade etme becerisinde gelişim.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'social-act-2',
    gradeLevel: 9,
    term: '2. Dönem',
    activityTitle: 'Türkiye Yüzyılı Kültürel Miras Şenliği ve 3D Sanal Müze Canlandırmaları',
    category: 'MUZE_SERGI',
    maarifValues: ['D19. Vatanseverlik', 'D7. Estetik', 'D4. Dayanışma'],
    targetMonthOrWeek: '2. Dönem Sonu (Haziran Ayı)',
    description: 'Öğrenciler EBA 3D Sanal Müzelerde yer alan tarihi eserleri (Kadeş Tableti, Göktürk Kitabeleri vb.) canlandırarak sergiler.',
    studentTasks: [
      'Tarihi eserin modelini veya canlandırma metnini hazırlama.',
      'Okul salonunda veya sınıf panosunda tarih koridoru oluşturma.',
      'Diğer sınıf öğrencilerine rehberlik yaparak tarihi aktarma.'
    ],
    expectedOutcomes: 'Tarih bilinci, kültürel miras sevgisi ve okul içi paylaşım kültürünün güçlenmesi.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'social-act-3',
    gradeLevel: 10,
    term: '1. Dönem',
    activityTitle: 'Kut\'ül Amare ve Çanakkale Şehitlerini Anma Sözlü Tarih ve Şiir Dinletisi',
    category: 'MILLI_BAYRAM_ANMA',
    maarifValues: ['D19. Vatanseverlik', 'D14. Saygı', 'D5. Duyarlılık'],
    targetMonthOrWeek: '1. Dönem Sonu (Ocak Ayı)',
    description: 'Aile büyüklerinden veya gazilerden dinlenen milli mücadele hatıralarının ses kaydı veya metin halinde sunulması.',
    studentTasks: [
      'Bölgedeki şehit yakınları veya gazilerle röportaj hazırlığı.',
      'Tarihi mektup ve günlüklerin seslendirilmesi.'
    ],
    expectedOutcomes: 'Milli hafıza ve fedakarlık değerlerinin içselleştirilmesi.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'social-act-4',
    gradeLevel: 12,
    term: '2. Dönem',
    activityTitle: 'Cumhuriyet Vizyonu ve Türkiye Yüzyılı Gençlik Tarih Çalıştayı',
    category: 'MUNAZARA_PANEL',
    maarifValues: ['D19. Vatanseverlik', 'D18. Sorumluluk', 'D11. Özgürlük'],
    targetMonthOrWeek: '2. Dönem Son Ayı (Mayıs / Haziran)',
    description: '12. sınıf öğrencilerinin lise tarih birikimini Cumhuriyetin kazanımları ve geleceğin Türkiye\'si perspektifinde tartıştığı mezuniyet çalıştayı.',
    studentTasks: [
      'Atatürk İlkeleri ve modern Türkiye\'nin kalkınma adımları üzerine bildiri hazırlama.',
      'Çalıştay sonuç bildirgesi kaleme alma ve okul panosunda paylaşma.'
    ],
    expectedOutcomes: 'Lise mezuniyeti öncesi tarihsel şuur ve vatandaşlık sorumluluğunun pekiştirilmesi.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Builds the complete 2-term yearly plan with MEB calendar, vacation weeks,
 * exam weeks, and grade-specific end-of-term school-based & social activities.
 */
export function buildFullTwoTermYearlyPlan(
  academicYear: string,
  gradeLevel: GradeLevel,
  weeklyHours: number,
  settings: AppSettings
): FullTwoTermYearlyPlan {
  const term1Weeks: TwoTermYearlyPlanWeek[] = [];
  const term2Weeks: TwoTermYearlyPlanWeek[] = [];

  let cumHoursTerm1 = 0;
  let cumHoursTerm2 = 0;

  // Month detection helper
  const getMonthName = (dateStr: string): string => {
    if (dateStr.includes('Eylül')) return 'EYLÜL';
    if (dateStr.includes('Ekim')) return 'EKİM';
    if (dateStr.includes('Kasım')) return 'KASIM';
    if (dateStr.includes('Aralık')) return 'ARALIK';
    if (dateStr.includes('Ocak')) return 'OCAK';
    if (dateStr.includes('Şubat')) return 'ŞUBAT';
    if (dateStr.includes('Mart')) return 'MART';
    if (dateStr.includes('Nisan')) return 'NİSAN';
    if (dateStr.includes('Mayıs')) return 'MAYIS';
    if (dateStr.includes('Haziran')) return 'HAZİRAN';
    return 'DÖNEM';
  };

  MEB_WORK_CALENDAR_WEEKS.forEach((week) => {
    const month = getMonthName(week.dateRange);

    if (week.term === '1. Dönem') {
      cumHoursTerm1 += weeklyHours;
      let specialType: TwoTermYearlyPlanWeek['specialType'] = 'NORMAL';
      let themeUnit = `TAR.${gradeLevel}.1. Ünite / Öğrenme Alanı`;
      let outcomes = `TAR.${gradeLevel}.1.${(week.weekNumber % 4) + 1}. Tarihsel olayları neden-sonuç ve kanıt ilişkisiyle değerlendirir.`;
      let values = 'D19. Vatanseverlik, D1. Adalet, SBAB2. Kanıt Analizi';

      if (week.weekNumber === 8 || week.weekNumber === 9) {
        specialType = 'EXAM';
        themeUnit = '1. DÖNEM 1. ORTAK YAZILI SINAV HAFTASI';
        outcomes = '1. Sınav kazanımlarının ölçülmesi ve açık uçlu sorularla değerlendirilmesi.';
      } else if (week.weekNumber === 15) {
        specialType = 'EXAM';
        themeUnit = '1. DÖNEM 2. ORTAK YAZILI SINAV HAFTASI';
        outcomes = '1. Dönem 2. yazılı yoklaması ve kazanım değerlendirmesi.';
      } else if (week.weekNumber === 18) {
        // 1. Dönem son haftası kuralı:
        // 12. sınıfta okul temelli yok, sosyal etkinlik yok (2. dönemde).
        // 9, 10, 11. sınıflarda 1. dönem sonu SOSYAL ETKİNLİK var!
        if (gradeLevel === 12) {
          specialType = 'NORMAL';
          themeUnit = '1. Dönem Genel Tekrar ve Kazanım Pekiştirme';
          outcomes = '1. Dönem ünitelerinin özetlenmesi ve telafi çalışmaları.';
        } else {
          specialType = 'SOCIAL_ACTIVITY';
          themeUnit = '1. DÖNEM SONU SOSYAL ETKİNLİK HAFTASI (MAARİF MODELİ)';
          outcomes = 'Tarihsel Münazara, Kültürel Miras Panosu ve Erdem-Değer-Eylem Sosyal Etkinliği.';
          values = 'D19. Vatanseverlik, D4. Dayanışma, D3. Bilimsellik';
        }
      }

      term1Weeks.push({
        weekNumber: week.weekNumber,
        term: '1. Dönem',
        dateRange: week.dateRange,
        monthName: month,
        hours: weeklyHours,
        cumulativeHours: cumHoursTerm1,
        themeUnit,
        learningOutcomes: outcomes,
        processComponents: 'Giriş, kanıt inceleme, metin tahlili, grup tartışması ve özetleme.',
        valuesAndSkills: values,
        methodsAndTechniques: 'Açık uçlu soru-cevap, beyin fırtınası, kaynak analizi, işbirlikli öğrenme.',
        toolsAndMaterials: 'Ders Kitabı, EBA 3D Sanal Müze, MEBİ, Haritalar, Çalışma Yaprakları.',
        specialType,
        specialNote: week.specialDayOrNote
      });
    } else {
      // 2. Dönem
      cumHoursTerm2 += weeklyHours;
      let specialType: TwoTermYearlyPlanWeek['specialType'] = 'NORMAL';
      let themeUnit = `TAR.${gradeLevel}.2. Ünite / Öğrenme Alanı`;
      let outcomes = `TAR.${gradeLevel}.2.${((week.weekNumber - 18) % 4) + 1}. Dönem konularının tahlili ve tarihsel empati kurma.`;
      let values = 'D18. Sorumluluk, D6. Dürüstlük, SBAB1. Kronoloji';

      if (week.weekNumber === 26) {
        specialType = 'EXAM';
        themeUnit = '2. DÖNEM 1. ORTAK YAZILI SINAV HAFTASI';
        outcomes = '2. Dönem 1. yazılı yoklama ve konu soru dağılım tablosuna göre ölçme.';
      } else if (week.weekNumber === 34) {
        specialType = 'EXAM';
        themeUnit = '2. DÖNEM 2. ORTAK YAZILI SINAV HAFTASI';
        outcomes = '2. Dönem 2. ortak sınav uygulaması ve değerlendirme.';
      } else if (week.weekNumber === 36) {
        // Sene sonu / Son ay kuralı:
        // 12. sınıfta son ayda Sosyal Etkinlik var.
        // 9, 10, 11. sınıflarda son ayda OKUL TEMELLİ PLANLAMA var!
        if (gradeLevel === 12) {
          specialType = 'SOCIAL_ACTIVITY';
          themeUnit = '2. DÖNEM SONU SOSYAL ETKİNLİK: CUMHURİYET VE GENÇLİK TARİH ÇALIŞTAYI';
          outcomes = 'Cumhuriyet kazanımları ve Türkiye Yüzyılı vizyonu üzerine bildiri sunumu.';
        } else {
          specialType = 'SCHOOL_BASED';
          themeUnit = 'MAARİF OKUL TEMELLİ PLANLAMA HAFTASI (YEREL TARİH VE MÜZE İNCELEMESİ)';
          outcomes = 'Okul çevresindeki tarihi eserlerin, kitabelerin ve vakıf yapılarının incelenmesi.';
          values = 'D19. Vatanseverlik, D7. Estetik, D18. Sorumluluk';
        }
      } else if (week.weekNumber === 37) {
        // Sene sonu son hafta:
        // 9, 10, 11'de hem okul temelli hem sosyal etkinlik var (Hafta 37 Sosyal Etkinlik Şenliği)
        if (gradeLevel === 12) {
          specialType = 'NORMAL';
          themeUnit = 'Ders Yılı Sonu Değerlendirmesi ve Mezuniyet Rehberliği';
          outcomes = 'Yıllık kazanımların genel muhasebesi ve karne süreci.';
        } else {
          specialType = 'SOCIAL_ACTIVITY';
          themeUnit = 'SENE SONU SOSYAL ETKİNLİK ŞENLİĞİ VE TARİH KORİDORU SERGİSİ';
          outcomes = 'Okul temelli araştırmaların sergilenmesi, tarih kulübü canlandırmaları.';
          values = 'D4. Dayanışma, D14. Saygı, D19. Vatanseverlik';
        }
      }

      term2Weeks.push({
        weekNumber: week.weekNumber,
        term: '2. Dönem',
        dateRange: week.dateRange,
        monthName: month,
        hours: weeklyHours,
        cumulativeHours: cumHoursTerm1 + cumHoursTerm2,
        themeUnit,
        learningOutcomes: outcomes,
        processComponents: 'Tarihsel vaka analizi, karşılaştırmalı tablo, infografik tasarımı, yerel saha incelemesi.',
        valuesAndSkills: values,
        methodsAndTechniques: 'Örnek olay yöntemi, münazara, drama/canlandırma, saha gözlemi.',
        toolsAndMaterials: 'Ders Kitapları, Tarih Atlası, Görsel Arşivler, Yerel Miras Envanteri.',
        specialType,
        specialNote: week.specialDayOrNote
      });
    }
  });

  return {
    id: `yearly-plan-${gradeLevel}-${academicYear.replace(/[^0-9]/g, '')}`,
    academicYear,
    gradeLevel,
    weeklyHours,
    totalHours: (cumHoursTerm1 + cumHoursTerm2),
    term1Weeks,
    term2Weeks,
    schoolBasedPlans: DEFAULT_SCHOOL_BASED_PLANS.filter(p => p.gradeLevel === gradeLevel),
    socialActivities: DEFAULT_SOCIAL_ACTIVITIES.filter(p => p.gradeLevel === gradeLevel),
    schoolName: settings.schoolName,
    teacherName: settings.teacherName,
    principalName: settings.principalName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
