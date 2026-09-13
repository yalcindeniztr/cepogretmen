import { AppSettings, PlanItem, LibraryItem, EvaluationScale, MebCalendarReminder, ExamPaper } from '../../core/types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_LIBRARY_ITEMS,
  DEFAULT_EVALUATION_SCALES,
  DEFAULT_MEB_REMINDERS
} from '../../core/constants/maarifCurriculum';

const STORAGE_KEYS = {
  SETTINGS: 'maarif_settings_v2',
  PLANS: 'maarif_plans_v2',
  LIBRARY: 'maarif_library_v2',
  SCALES: 'maarif_scales_v2',
  EXAMS: 'maarif_exams_v2',
  REMINDERS: 'maarif_reminders_v2'
};

export class LocalDatabaseService {
  // Settings
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Settings read error:', e);
    }
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Plans
  static getPlans(): PlanItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Plans read error:', e);
    }

    // Seed with official 3-Section Maarif Plan sample (birebir MEB resmi örneği)
    const initialPlans: PlanItem[] = [
      {
        id: 'plan-official-daily-8',
        type: 'DAILY',
        gradeLevel: 9,
        subject: 'TARİH',
        title: 'Tarih Araştırma ve Yazımında Dijitalleşme',
        weekNumber: 8,
        dateRange: '28 Ekim - 01 Kasım',
        lessonHours: 2,
        totalYearlyHours: 72,

        // BÖLÜM 1: DERS BİLGİSİ & PROGRAMLAR ARASI BİLEŞENLER
        themeUnit: 'TAR.9.1.GEÇMİŞİN İNŞA SÜRECİNDE TARİH / SINAV HAFTASI',
        domainSkills: 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.5. Kaynağı Yorumlama, SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.3. Kaynağı İnceleme, SBAB1. Zamanı Algılama ve Kronolojik Düşünme, KB2.17. Değerlendirme',
        conceptualSkills: 'KB2.4. Çözümleme',
        dispositions: 'E2.1. Empati, E3.2. Odaklanma, E3.3. Yaratıcılık, E3.6. Analitiklik Düşünme, E3.10. Eleştirel Bakma',
        socialEmotionalSkills: 'SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme',
        values: ['D6. Dürüstlük', 'D19. Vatanseverlik'],
        literacySkills: 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık',
        interdisciplinaryRelations: 'Coğrafya, Felsefe, Matematik, Sosyoloji',
        interSkillRelations: 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.2. Kaynaklardan Bilgi Toplama, SBAB2.3. Kaynağı İnceleme, SBAB2.4. Kaynağı Sorgulama, KB3.1. Karar Verme',

        // BÖLÜM 2: ÖĞRENME ÇIKTILARI, İÇERİK ÇERÇEVESİ VE ÖĞRENME KANITLARI
        learningOutcomes: [
          'TAR.9.1.4. Dijitalleşmenin tarih araştırma ve yazımının dönüşümüne etkisini değerlendirebilme',
          'a) Dijitalleşme öncesindeki ve dijital dönemdeki tarih araştırma ve yazım süreçlerini karşılaştırır.',
          'b) Tarih araştırma ve yazımında dijitalleşmeyle meydana gelen dönüşüme dair yargıda bulunur.'
        ],
        contentFramework: 'Tarih Araştırma ve Yazımında Dijitalleşme',
        topics: [
          'Tarih Araştırma ve Yazımında Dijitalleşme',
          'Geleneksel ve Dijital Arşivcilik Karşılaştırması'
        ],
        learningEvidences: '* Bu ünitedeki öğrenme çıktıları; çalışma yaprağı, infografik ve performans görevleri ile değerlendirilebilir.\n* Tarihin doğası çerçevesinde tarih kavramının kapsamını ve tarihsel bilginin özelliklerini izlemeye yönelik çalışma yaprağı ve tarihsel bilginin üretim aşamalarını göstermeye yönelik infografik kullanılabilir. Oluşturulan infografiklerin değerlendirilmesinde dereceli puanlama anahtarından yararlanılabilir.\n* Performans görevi olarak öğrencilerden tarih öğrenmenin bireye ve topluma faydalarının yorumlanabilmesine ilişkin afiş hazırlamaları istenebilir. Hazırlanan afiş dereceli puanlama anahtarı ile değerlendirilebilir.\n* Performans görevi olarak öğrencilerden dijitalleşmenin tarih araştırma ve yazımının dönüşümüne olumlu ve olumsuz etkisine yönelik fikirlerini içeren bir ağ günlüğü sayfası hazırlamaları istenebilir. Hazırlanan ağ günlüğü sayfası; kapsam, dil ve anlatım, içeriğin doğruluğu, kaynakların çeşitliliği, görsel ve yazılı materyal kullanımı gibi ölçütler kullanılarak dereceli puanlama anahtarıyla ve öz değerlendirme formuyla değerlendirilebilir.',

        // BÖLÜM 3: ÖĞRENME-ÖĞRETME YAŞANTILARI
        basicAssumptions: '* Öğrencilerin kültürel mirasın aktarılmasında tarihin rolü olduğu bilgisine ve temel düzeyde tarih araştırmaları deneyimine sahip oldukları kabul edilmektedir.\n* Sosyal bilim, fen bilimleri ve büyük veri hakkında ön bilgilere sahip oldukları kabul edilmektedir.\n* Tarihin beşerî bir bilim dalı olduğuna ve bilimsel bir yöntem kullandığına ilişkin ön bilgileri olduğu kabul edilmektedir.\n* Hayatın her alanındaki dijitalleşmenin tarih araştırmaları için de kullanılabileceğine ilişkin temel bilgilere sahip oldukları kabul edilmektedir.\n* Teknolojinin tarih dersinde uygun biçimde kullanımına ilişkin ön bilgilere sahip oldukları kabul edilmektedir.',
        preAssessmentProcess: '* Ünite kapsamında öğrencilere aşağıdaki rehber sorular sorulabilir:\n• Kültürel mirasın aktarılmasında tarihin rolü ne olabilir?\n• Tarihin araştırma basamakları neler olabilir?',
        processComponents: '1. Giriş: Sınıfa geleneksel bir arşiv belgesi örneği ve bir dijital veri tabanı arayüzü yansıtılarak dikkat çekilir. 2. Keşfetme: Öğrenciler ikili gruplara ayrılarak dijitalleşmenin araştırmacılara sağladığı kolaylıklar ile dezenformasyon riskini tartışır. 3. Derinleştirme: EBA Tarih portalı ve Devlet Arşivleri Başkanlığı dijital tarama adımları incelenir. 4. Özetleme: Ağ günlüğü hazırlama yönergesi verilerek ders toparlanır.',
        socialActivities: 'Okul bilişim atölyesinde dijital arşiv tarama atölyesi ve sınıf tarih panosu hazırlığı.',
        differentiation: {
          enrichment: 'Büyük veri (Big Data) ve yapay zekânın tarih metodolojisindeki yeri üzerine mini makale hazırlama.',
          support: 'Geleneksel ve dijital kaynak türlerini karşılaştıran görsel eşleştirme kartları kullanma.'
        },
        evaluation: 'Ağ Günlüğü Performans Görevi Dereceli Puanlama Anahtarı ve Çalışma Yaprağı',
        resources: 'MEB 9. Sınıf Tarih Ders Kitabı, EBA Tarih Arşivi, MEBİ, OGM Materyal 3D Sanal Müze',
        notes: '29 Ekim Cumhuriyet Bayramı anma haftası ve 1. Ortak Yazılı Sınav hazırlığı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'plan-sample-yearly-1',
        type: 'YEARLY',
        gradeLevel: 9,
        subject: 'TARİH',
        title: '9. Sınıf Tarih Yıllık Planı (MEB Çalışma Takvimi)',
        weekNumber: 1,
        dateRange: '09 - 13 Eylül',
        lessonHours: 2,
        totalYearlyHours: 72,

        themeUnit: 'TAR.9.1.GEÇMİŞİN İNŞA SÜRECİNDE TARİH',
        domainSkills: 'SBAB1. Zamanı Algılama ve Kronolojik Düşünme, SBAB2. Kanıta Dayalı Sorgulama',
        conceptualSkills: 'KB2.4. Çözümleme',
        dispositions: 'E3.2. Odaklanma, E3.6. Analitiklik Düşünme',
        socialEmotionalSkills: 'SDB1.2. Kendini Düzenleme',
        values: ['D6. Dürüstlük', 'D19. Vatanseverlik'],
        literacySkills: 'OB1. Bilgi Okuryazarlığı',
        interdisciplinaryRelations: 'Coğrafya, Sosyoloji',
        interSkillRelations: 'SBAB2. Kanıta Dayalı Sorgulama',

        learningOutcomes: [
          'TAR.9.1.1. Tarih biliminin doğasını ve insanın geçmişle kurduğu anlam bağını değerlendirebilme'
        ],
        contentFramework: 'Tarih Biliminin Doğası ve İnsanın Anlam Arayışı',
        topics: ['Tarih Biliminin Doğası ve İnsanın Anlam Arayışı'],
        learningEvidences: 'Çalışma yaprağı, kavram haritası ve ders içi gözlem formu ile süreç değerlendirilir.',

        basicAssumptions: 'Öğrencilerin geçmiş ve gelecek kavramlarına dair ön bilgilere sahip olduğu kabul edilir.',
        preAssessmentProcess: 'Tarih bilimi bize ne kazandırır? sorusu ile derse başlanır.',
        processComponents: 'Tarihsel bilginin doğası üzerine soru-cevap ile derse başlanır. Aile albümlerinden ve eski belgelerden yola çıkarak "Tarih nedir?" sorgulaması yapılır.',
        socialActivities: 'Öğrencilerle "Benim Aile Tarihim" mini sözlü tarih projesi başlatılır.',
        differentiation: {
          enrichment: 'Dijital arşiv kaynaklarından 1. elden belge taraması yaptırılır.',
          support: 'Kavram haritası üzerinden tarih biliminin temel terimleri pekiştirilir.'
        },
        evaluation: 'Açık Uçlu Soru ve Süreç Değerlendirme Rubriği',
        resources: 'MEB 9. Sınıf Tarih Ders Kitabı, EBA, MEBİ, OGM Materyal',
        notes: 'Ders yılı başlangıcı ve uyum haftası',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.savePlans(initialPlans);
    return initialPlans;
  }

  static savePlans(plans: PlanItem[]): void {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }

  static addOrUpdatePlan(plan: PlanItem): void {
    const plans = this.getPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    if (index >= 0) {
      plans[index] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
      plans.unshift({ ...plan, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.savePlans(plans);
  }

  static deletePlan(id: string): void {
    const plans = this.getPlans().filter(p => p.id !== id);
    this.savePlans(plans);
  }

  // Library
  static getLibraryItems(): LibraryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Library read error:', e);
    }
    this.saveLibraryItems(DEFAULT_LIBRARY_ITEMS);
    return DEFAULT_LIBRARY_ITEMS;
  }

  static saveLibraryItems(items: LibraryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(items));
  }

  static addLibraryItem(item: LibraryItem): void {
    const items = this.getLibraryItems();
    items.unshift(item);
    this.saveLibraryItems(items);
  }

  static deleteLibraryItem(id: string): void {
    const items = this.getLibraryItems().filter(i => i.id !== id);
    this.saveLibraryItems(items);
  }

  // Evaluation Scales
  static getScales(): EvaluationScale[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCALES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Scales read error:', e);
    }
    this.saveScales(DEFAULT_EVALUATION_SCALES);
    return DEFAULT_EVALUATION_SCALES;
  }

  static saveScales(scales: EvaluationScale[]): void {
    localStorage.setItem(STORAGE_KEYS.SCALES, JSON.stringify(scales));
  }

  static addScale(scale: EvaluationScale): void {
    const scales = this.getScales();
    scales.unshift(scale);
    this.saveScales(scales);
  }

  // Exams (Açık Uçlu ve Bağlamlı Sınavlar)
  static getExams(): ExamPaper[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Exams read error:', e);
    }

    const initialExams: ExamPaper[] = [
      {
        id: 'exam-sample-9-1-1',
        gradeLevel: 9,
        academicYear: '2024-2025',
        term: '1. Dönem',
        examNumber: '1. Sınav',
        examType: 'OKUL_GENELI_ORTAK',
        scenario: 'Senaryo 1 (MEB Konu Soru Dağılım Tablosu - 10 Soru / 100 Puan)',
        themeUnit: 'TAR.9.1. Geçmişin İnşa Sürecinde Tarih & Kadim Dünyada İnsan ve Mekân',
        topics: [
          'Tarihin Doğası ve Tarihsel Bilginin Özellikleri',
          'Tarihsel Bilginin Üretim Süreci ve Kanıt İnceleme',
          'Tarih Yazımında Dijitalleşme',
          'İlk Çağ Medeniyet Havzaları ve Coğrafi Şartlar'
        ],
        durationMinutes: 40,
        totalScore: 100,
        schoolName: 'Ballıca Mesleki ve Teknik Anadolu Lisesi',
        teacherName: 'Yalçın DENİZ',
        instructions: '1. Sınav süresi 40 dakikadır. 2. Sorular açık uçlu ve bağlamlıdır; yanıtlarınızı gerekçeleriyle soru altındaki boşluğa yazınız. 3. Puan dağılımı soru zorluğuna göre (3 Kolay: 8P, 4 Orta: 10P, 3 Zor: 12P) belirlenmiştir. Eksik ve yarım cevaplar kademeli puanlama anahtarına göre değerlendirilecektir. Başarılar dileriz.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questions: [
          {
            id: 'q1',
            questionNumber: 1,
            difficulty: 'Kolay',
            cognitiveLevel: 'Kavrama',
            maxPoints: 8,
            learningOutcome: 'TAR.9.1.1. Tarih öğrenmenin bireye ve topluma sağladığı faydaları kavrayabilme',
            domainSkill: 'SBAB1. Zamanı Algılama ve Kronolojik Düşünme',
            conceptualSkill: 'KB2.14. Yorumlama',
            value: 'D19. Vatanseverlik',
            contextText: 'Mustafa Kemal Atatürk: "Tarih yazmak, tarih yapmak kadar mühimdir. Yazan yapana sadık kalmazsa değişmeyen hakikat insanlığı şaşırtacak bir mahiyet alır." demiştir.',
            questionText: 'Atatürk\'ün yukarıdaki sözünden hareketle; tarihin doğru ve tarafsız yazılmasının bir milletin geleceği için neden vazgeçilmez olduğunu açıklayınız.',
            sampleAnswer: 'Tarihin doğru yazılması, milletin geçmişindeki gerçek tecrübelerden doğru dersler çıkarmasını ve milli hafızanın sağlam temeller üzerine kurulmasını sağlar. Yanıltıcı bilgi toplumların özgüvenini ve geleceğe yönelik stratejik kararlarını zedeler.',
            rubricGuide: [
              { criterion: 'Doğru/tarafsız yazımın milli hafıza ve gelecek inşasıyla ilişkisini açıklama', points: 8, partialGuidance: 'Sadece milli hafıza veya sadece ders çıkarma boyutuna değinilirse 4 puan, her ikisi gerekçelendirilirse 8 tam puan verilir.' }
            ],
            partialCreditNotes: 'Öğrenci tarafsızlık vurgusunu yapıp geleceğe etkisini gerekçelendiremezse 4 puan; her iki boyutu da açık ve eksiksiz bağlarsa 8 tam puan alır.'
          },
          {
            id: 'q2',
            questionNumber: 2,
            difficulty: 'Kolay',
            cognitiveLevel: 'Bilgi/Kavrama',
            maxPoints: 8,
            learningOutcome: 'TAR.9.1.2. Tarihsel bilginin özelliklerini belirleyebilme',
            domainSkill: 'SBAB2. Kanıta Dayalı Sorgulama',
            conceptualSkill: 'KB2.4. Çözümleme',
            value: 'D3. Bilimsellik',
            contextText: 'Yakın zamanda Göbeklitepe ve Karahantepe kazılarında elde edilen buluntular, insanlığın yerleşik hayata geçişi ve inanç merkezleri hakkındaki klasik tarih teorilerini değiştirmiştir.',
            questionText: 'Bu durum tarihsel bilginin hangi temel özelliğini gösterir? Bir cümleyle açıklayınız.',
            sampleAnswer: 'Tarihsel bilginin yeni keşfedilen kanıt, belge ve arkeolojik bulgularla zaman içerisinde değişebilir, güncellenebilir ve gelişebilir dinamik bir yapıya sahip olduğunu gösterir.',
            rubricGuide: [
              { criterion: 'Tarihsel bilginin yeni bulgularla değişebilir/gelişebilir dinamik niteliğini belirtme', points: 8, partialGuidance: 'Sadece "bilgiler değişebilir" yazıp gerekçelendirmeyen öğrenciye 4 puan, arkeolojik kanıtla ilişkilendirene 8 puan verilir.' }
            ],
            partialCreditNotes: 'Yalnızca "bilgi değişir" ifadesine 4 puan; yeni kanıt ve bulguların önceki kabulleri revize ettiğini açıklayan yanıta 8 tam puan verilir.'
          },
          {
            id: 'q3',
            questionNumber: 3,
            difficulty: 'Kolay',
            cognitiveLevel: 'Kavrama',
            maxPoints: 8,
            learningOutcome: 'TAR.9.1.3. Tarihin kaynaklarını sınıflandırabilme',
            domainSkill: 'SBAB2.3. Kaynağı İnceleme',
            conceptualSkill: 'KB2.4. Çözümleme',
            value: 'D6. Dürüstlük',
            contextText: 'Malazgirt Zaferi\'ni araştıran bir araştırmacı, Sultan Alparslan\'ın vezirinin bizzat o gün tuttuğu kayıtlar ile 2010 yılında yayımlanmış bir akademik inceleme kitabını karşılaştırmıştır.',
            questionText: 'Bu iki kaynaktan hangisinin birinci elden kaynak olduğunu belirtip aralarındaki temel farkı açıklayınız.',
            sampleAnswer: 'Sultan Alparslan\'ın vezirinin tuttuğu kayıt birinci elden kaynaktır; çünkü olayın yaşandığı dönemde bizzat tanığı tarafından oluşturulmuştur. 2010 yılındaki kitap ise o dönemin kaynaklarından yararlanılarak sonradan yazıldığı için ikinci elden kaynaktır.',
            rubricGuide: [
              { criterion: 'Vezirin kaydının birinci elden kaynak olduğunu doğru tespit etme', points: 4, partialGuidance: 'Yalnızca birinci elden kaynağı tespit edene 4 puan verilir.' },
              { criterion: 'Dönemin tanığı olma ve sonradan yazılma farkını açıklama', points: 4, partialGuidance: 'Ayrımı eksiksiz açıklayana ilave 4 puan verilir.' }
            ],
            partialCreditNotes: 'Yalnızca kaynak türünü seçen öğrenci 4 puan; dönemsellik ve tanıklık gerekçesini de tam yazan öğrenci 8 puan alır.'
          },
          {
            id: 'q4',
            questionNumber: 4,
            difficulty: 'Orta',
            cognitiveLevel: 'Uygulama/Analiz',
            maxPoints: 10,
            learningOutcome: 'TAR.9.1.3. Tarihsel araştırma basamaklarında tenkit yöntemini uygulayabilme',
            domainSkill: 'SBAB2.4. Kaynağı Sorgulama ve Eleştirme',
            conceptualSkill: 'KB2.17. Değerlendirme',
            value: 'D6. Dürüstlük, D3. Bilimsellik',
            contextText: 'Tarihçi bir sefer günlüğünü incelerken belgenin kağıt ve mürekkep yapısını laboratuvarda test etmiş, ardından yazarın savaştaki olayları kişisel çıkarları nedeniyle abartıp abartmadığını araştırmıştır.',
            questionText: 'Tarihçinin uyguladığı "Dış Tenkit" ve "İç Tenkit" aşamalarını metindeki faaliyetlerle eşleştirerek açıklayınız.',
            sampleAnswer: 'Dış Tenkit: Belgenin fiziki özellikleri olan kağıt, mürekkep cinsi ve yazının orijinalliğinin test edilmesidir. İç Tenkit: Belgenin içindeki bilgilerin doğruluğu, yazarın tarafsızlığı ve olayları abartıp abartmadığının eleştirel analizidir.',
            rubricGuide: [
              { criterion: 'Dış tenkit ve fiziki inceleme (kağıt/mürekkep) eşleştirmesi', points: 5, partialGuidance: 'Doğru tanımlayıp eşleştirene 5 puan verilir.' },
              { criterion: 'İç tenkit ve yazarın tarafsızlığı/içerik analizi eşleştirmesi', points: 5, partialGuidance: 'Doğru tanımlayıp eşleştirene 5 puan verilir.' }
            ],
            partialCreditNotes: 'Yalnızca bir tenkit türünü doğru eşleştiren veya açıklayan öğrenci 5 puan; her iki basamağı da eksiksiz tamamlayan öğrenci 10 tam puan alır.'
          },
          {
            id: 'q5',
            questionNumber: 5,
            difficulty: 'Orta',
            cognitiveLevel: 'Analiz',
            maxPoints: 10,
            learningOutcome: 'TAR.9.1.4. Tarih yazımında dijitalleşmenin imkân ve risklerini değerlendirebilme',
            domainSkill: 'OB2. Dijital Okuryazarlık',
            conceptualSkill: 'KB2.17. Değerlendirme',
            value: 'D18. Sorumluluk',
            contextText: 'Günümüzde milyonlarca arşiv vesikası dijitalleştirilip internete açılmıştır. Buna karşılık yapay zekayla üretilen sahte tarihi fotoğraflar ve çarpıtılmış bilgiler sosyal medyada hızla yayılmaktadır.',
            questionText: 'Dijitalleşmenin tarih araştırmacılığına kazandırdığı bir fırsat ile oluşturduğu bir tehdidi gerekçeleriyle yazınız.',
            sampleAnswer: 'Fırsat: Araştırmacıların dünyanın herhangi bir yerinden arşiv belgelerine hızla ulaşabilmesi ve fiziki belgelerin yıpranmaktan korunmasıdır. Tehdit: Dijital dezenformasyon, teyit edilmemiş sahte belgelerin bilgi kirliliğine ve tarihsel algı operasyonlarına yol açmasıdır.',
            rubricGuide: [
              { criterion: 'Fırsat boyutunu gerekçesiyle ifade etme', points: 5, partialGuidance: 'Erişim kolaylığı veya koruma gerekçesini yazana 5 puan.' },
              { criterion: 'Tehdit boyutunu gerekçesiyle açıklama', points: 5, partialGuidance: 'Bilgi kirliliği veya dezenformasyon riskini açıklayana 5 puan.' }
            ],
            partialCreditNotes: 'Sadece fırsatı yazan 5 puan, sadece tehdidi yazan 5 puan; her iki boyutu gerekçeli açıklayan 10 tam puan alır.'
          },
          {
            id: 'q6',
            questionNumber: 6,
            difficulty: 'Orta',
            cognitiveLevel: 'Uygulama',
            maxPoints: 10,
            learningOutcome: 'TAR.9.2.1. İnsanlığın ilk dönemlerinde yerleşim yeri seçiminde coğrafi şartların etkisini analiz edebilme',
            domainSkill: 'SBAB1. Zamanı Algılama ve Mekânsal İlişkilendirme',
            conceptualSkill: 'KB2.10. Neden-Sonuç İlişkisi Kurma',
            value: 'D4. Dayanışma, D13. Saygı',
            contextText: 'İlk Çağ medeniyetleri çoğunlukla Fırat, Dicle, Nil, İndus ve Sarıırmak gibi nehir boylarındaki alüvyal topraklarda ortaya çıkmıştır.',
            questionText: 'Akarsu havzalarının yerleşim yeri olarak tercih edilmesinin sağladığı iki ekonomik faydayı açıklayınız.',
            sampleAnswer: '1. Tarımsal Verimlilik ve Sulama: Nehirlerin taşıdığı bereketli alüvyonlar ve su imkânı yüksek tarımsal verim ve ürün fazlası (artı ürün) sağlamıştır.\n2. Ticaret ve Ulaşım Kolaylığı: Nehir yolları sallar ve teknelerle ilkel ulaşımı ve takas ticaretini kolaylaştırmıştır.',
            rubricGuide: [
              { criterion: 'Tarımsal üretim ve sulama imkânını açıklama', points: 5, partialGuidance: 'Tarım ve artı ürün boyutuna değinene 5 puan.' },
              { criterion: 'Ulaşım ve ticaret boyutunu açıklama', points: 5, partialGuidance: 'Nehir yoluyla taşıma/ticaret boyutuna değinene 5 puan.' }
            ],
            partialCreditNotes: 'Yalnızca bir ekonomik faydayı açıklayana 5 puan; tarım ve ulaşım/ticaret boyutlarının ikisini de gerekçelendirene 10 tam puan verilir.'
          },
          {
            id: 'q7',
            questionNumber: 7,
            difficulty: 'Orta',
            cognitiveLevel: 'Kavrama/Analiz',
            maxPoints: 10,
            learningOutcome: 'TAR.9.2.2. İlk Çağ\'da yazının icadının toplumsal ve idari hayata etkisini kavrayabilme',
            domainSkill: 'SBAB2. Kanıta Dayalı Sorgulama',
            conceptualSkill: 'KB2.14. Yorumlama',
            value: 'D1. Adalet, D6. Dürüstlük',
            contextText: 'Sümerlerde tapınaklara teslim edilen tahıl ve hayvanların kaydını tutma ihtiyacı piktografik işaretleri ve ardından çivi yazısını doğurmuştur. Zamanla bu kayıtlar hukuki antlaşmalara ve kanun metinlerine dönüşmüştür.',
            questionText: 'Yazının icadının devlet yönetiminde adalet ve bürokrasi üzerindeki iki somut etkisini açıklayınız.',
            sampleAnswer: '1. Kanunların Yazılı Hale Gelmesi ve Keyfiliğin Önlenmesi: Kanunlar yazıya dökülerek herkese eşit uygulanmış ve yöneticilerin keyfi kararları sınırlandırılmıştır.\n2. Vergi ve Mülkiyet Kayıtlarının Kurumsallaşması: Devlet gelirleri, toprak mülkiyeti ve ordunun lojistik kayıtları yazıyla tutularak merkezi otorite güçlendirilmiştir.',
            rubricGuide: [
              { criterion: 'Hukukun yazılı hale gelmesi ve keyfiliğin önlenmesini belirtme', points: 5, partialGuidance: 'Adalet/hukuk boyutunu açıklayana 5 puan.' },
              { criterion: 'Vergi ve idari kayıtların kurumsallaşmasını açıklama', points: 5, partialGuidance: 'Bürokrasi ve merkezi yönetim boyutunu açıklayana 5 puan.' }
            ],
            partialCreditNotes: 'Sadece hukuk veya sadece bürokrasi boyutunu yazana 5 puan; ikisini de gerekçelendirene 10 tam puan verilir.'
          },
          {
            id: 'q8',
            questionNumber: 8,
            difficulty: 'Zor',
            cognitiveLevel: 'Sentez/Değerlendirme',
            maxPoints: 12,
            learningOutcome: 'TAR.9.2.3. Kadim medeniyetlerde hukukun gelişimini ve adalet anlayışını karşılaştırabilme',
            domainSkill: 'SBAB2. Kanıta Dayalı Sorgulama ve Eleştirel Düşünme',
            conceptualSkill: 'KB2.16. Karşılaştırma, KB2.17. Değerlendirme',
            value: 'D1. Adalet',
            contextText: 'Urgakina Kanunları borç yüzünden köleleştirilen vatandaşları affederken; Babil Kralı Hammurabi\'nin kanunlarında "Göze göz, dişe diş" esasına dayalı sert kısas cezaları ve sosyal sınıf ayrımı öne çıkmıştır.',
            questionText: 'Urgakina ve Hammurabi kanunlarını ceza felsefesi ve sosyal adalet anlayışı bakımından karşılaştırınız.',
            sampleAnswer: 'Urgakina Kanunları dünyada bilinen ilk sosyal reform niteliğindedir; yoksulları, kimsesizleri ve borçluları korumayı amaçlayarak insani ve koruyucu bir hukuk anlayışını yansıtır. Hammurabi Kanunları ise devlet otoritesini katı biçimde sağlamak için suçluyu aynı şekilde cezalandıran kısas ilkesine dayanır ve soylu-köle ayrımına göre farklı cezalar öngörür.',
            rubricGuide: [
              { criterion: 'Urgakina Kanunlarının sosyal koruma/reform boyutunu açıklama', points: 6, partialGuidance: 'Sosyal adaleti vurgulayana 4-6 puan; sadece "ilk yazılı kanun" diyene 2 puan verilir.' },
              { criterion: 'Hammurabi Kanunlarının kısas ve sınıfsal ceza felsefesini açıklama', points: 6, partialGuidance: 'Kısas ve sınıf farkını açıklayana 4-6 puan; sadece sert kanun diyene 2 puan verilir.' }
            ],
            partialCreditNotes: 'Öğrenci tek kanunu açıklarsa en fazla 6 puan; her iki kanunun felsefesini ve toplumsal sınıf boyutunu karşılaştırmalı yazarsa 12 tam puan alır.'
          },
          {
            id: 'q9',
            questionNumber: 9,
            difficulty: 'Zor',
            cognitiveLevel: 'Analiz/Tarihsel Empati',
            maxPoints: 12,
            learningOutcome: 'TAR.9.2.4. İlk Çağ medeniyet havzalarının mimari mirasındaki farklılıkları coğrafi ve inanç temelleriyle tahlil edebilme',
            domainSkill: 'SBAB1. Zaman ve Mekân Algılama',
            conceptualSkill: 'KB2.10. Neden-Sonuç İlişkisi Kurma',
            value: 'D13. Saygı, D5. Estetik',
            contextText: 'Mısır\'da piramitler ve kaya mezarları binlerce yıl sağlam kalarak günümüze ulaşırken; Mezopotamya\'da inşa edilen dev zigguratlar zamanla eriyip tepecik haline gelmiştir.',
            questionText: 'Bu iki kadim havzanın mimari kalıntıları arasındaki farkın ortaya çıkmasında etkili olan (a) Coğrafi malzeme ve (b) Ölüm sonrası hayat (ahiret) inancı unsurlarını açıklayınız.',
            sampleAnswer: '(a) Coğrafi Malzeme: Mezopotamya\'da taş bulunmadığı için yapılar çabuk aşınan kerpiç ve tuğladan yapılmıştır; Mısır\'da ise Nil vadisindeki dayanıklı kalker ve granit bloklar kullanılmıştır.\n(b) İnanç Sistemi: Mısırlılar ölümden sonra bedenin ruhla birlikte yaşayacağına (ahiret) inandıkları için firavun bedenlerini koruyacak ölümsüz anıt mezarlar (piramitler) inşa etmiş; Mezopotamya\'da ise ahiret inancı zayıf olduğundan dünyevi tapınaklar ön planda tutulmuştur.',
            rubricGuide: [
              { criterion: 'Coğrafi malzeme farkını (kerpiç vs. dayanıklı taş) temellendirme', points: 6, partialGuidance: 'Malzeme boyutunu eksiksiz açıklayana 6 puan, kısmen değinene 3 puan verilir.' },
              { criterion: 'İnanç ve ahiret anlayışı farkını mimariyle ilişkilendirme', points: 6, partialGuidance: 'Mumyalama/piramit ve ahiret ilişkisini kurana 6 puan, kısmen açıklayana 3 puan verilir.' }
            ],
            partialCreditNotes: 'Yalnızca malzeme farkını yazan 6 puan; yalnızca inanç boyutunu açıklayan 6 puan; her iki etkeni de somut kanıtla temellendiren öğrenci 12 tam puan alır.'
          },
          {
            id: 'q10',
            questionNumber: 10,
            difficulty: 'Zor',
            cognitiveLevel: 'Eleştirel Değerlendirme/Çözümleme',
            maxPoints: 12,
            learningOutcome: 'TAR.9.1.2 & TAR.9.2. Ortak Tarihsel Bilgi ve Medeniyet Mirasını Sentezleyebilme',
            domainSkill: 'SBAB2. Kanıta Dayalı Tarihsel Yargıya Ulaşma',
            conceptualSkill: 'KB2.17. Değerlendirme',
            value: 'D19. Vatanseverlik, D18. Sorumluluk',
            contextText: 'Tarihçi Marc Bloch: "Tarih, zaman içindeki insanların bilimidir. Geçmişi anlamayan, bugünü kavrayamaz; bugünü bilmeyen de geleceği inşa edemez." der.',
            questionText: 'Marc Bloch\'un bu tespitinden ve İlk Çağ medeniyetlerinin tecrübelerinden yola çıkarak; bir gencin tarih öğrenmesini kendi milletine ve insanlığa karşı bir sorumluluk kılan iki temel sebebi gerekçelendirerek yazınız.',
            sampleAnswer: '1. Kültürel Mirası Koruma ve Sürdürme Sorumluluğu: Geçmiş medeniyetlerin bıraktığı bilgi, adalet ve bilim birikimini kavrayan bir genç, kendi milli kültürünü koruma ve insanlığın ortak mirasına katkı sağlama bilincine erişir.\n2. Geçmişin Hatalarından Ders Çıkararak Geleceğe Bilinçli Yön Verme: Tarihteki krizler, çatışmalar ve yükselişlerin nedenlerini sorgulayan fertler; toplumun karşılaşacağı sorunlara akılcı, yapıcı ve milli birlik ekseninde çözümler üretebilir.',
            rubricGuide: [
              { criterion: 'Kültürel miras ve milli sorumluluk boyutunu gerekçelendirme', points: 6, partialGuidance: 'Milli sorumluluk ve miras boyutunu temellendirene 6 puan, yüzeysel değinene 3 puan.' },
              { criterion: 'Geleceği inşa etme ve tarihsel tecrübeden faydalanma boyutunu açıklama', points: 6, partialGuidance: 'Toplumsal sorun çözme ve tecrübe aktarımını açıklayana 6 puan, yüzeysel değinene 3 puan.' }
            ],
            partialCreditNotes: 'Yalnızca bir gerekçeyi doyurucu açıklayan öğrenci 6 puan; her iki boyutu da tarihsel bilinç ve vatandaşlık sorumluluğu ile temellendiren öğrenci 12 tam puan alır.'
          }
        ]
      }
    ];

    this.saveExams(initialExams);
    return initialExams;
  }

  static saveExams(exams: ExamPaper[]): void {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }

  static saveExam(exam: ExamPaper): void {
    const exams = this.getExams();
    const existingIndex = exams.findIndex(e => e.id === exam.id);
    if (existingIndex >= 0) {
      exams[existingIndex] = { ...exam, updatedAt: new Date().toISOString() };
    } else {
      exams.unshift({ ...exam, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveExams(exams);
  }

  static deleteExam(id: string): void {
    const exams = this.getExams().filter(e => e.id !== id);
    this.saveExams(exams);
  }

  // Reminders
  static getReminders(): MebCalendarReminder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Reminders read error:', e);
    }
    this.saveReminders(DEFAULT_MEB_REMINDERS);
    return DEFAULT_MEB_REMINDERS;
  }

  static saveReminders(reminders: MebCalendarReminder[]): void {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }

  // Full Computer Backup & Restore (JSON)
  static exportFullBackup(): string {
    const backup = {
      version: '2.1',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      plans: this.getPlans(),
      library: this.getLibraryItems(),
      scales: this.getScales(),
      exams: this.getExams(),
      reminders: this.getReminders()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importFullBackup(jsonString: string): boolean {
    try {
      const backup = JSON.parse(jsonString);
      if (backup.settings) this.saveSettings(backup.settings);
      if (backup.plans) this.savePlans(backup.plans);
      if (backup.library) this.saveLibraryItems(backup.library);
      if (backup.scales) this.saveScales(backup.scales);
      if (backup.exams) this.saveExams(backup.exams);
      if (backup.reminders) this.saveReminders(backup.reminders);
      return true;
    } catch (e) {
      console.error('Backup import error:', e);
      return false;
    }
  }
}

