import { GradeLevel, PlanType, ExamPaper, ExamQuestion } from '../../core/types';
import { HISTORY_CURRICULUM } from '../../core/constants/maarifCurriculum';

export interface GeneratedPlanData {
  topics: string[];
  learningOutcomes: string[];
  skills: string[];
  domainSkills: string;
  conceptualSkills: string;
  dispositions: string;
  socialEmotionalSkills: string;
  values: string[];
  literacySkills: string;
  interdisciplinaryRelations: string;
  interSkillRelations: string;
  contentFramework: string;
  learningEvidences: string;
  basicAssumptions: string;
  preAssessmentProcess: string;
  processComponents: string;
  socialActivities: string;
  differentiation: {
    enrichment: string;
    support: string;
  };
  evaluation: string;
  resources: string;
}

export class GeminiService {
  /**
   * Generates a fully structured Türkiye Yüzyılı Maarif Modeli compliant plan
   * matching the official 3-Section template.
   */
  static async generateMaarifPlan(
    gradeLevel: GradeLevel,
    unitTitle: string,
    topicOrOutcome: string,
    planType: PlanType,
    dateRange: string,
    lessonHours: number = 2,
    apiKey?: string,
    libraryContext?: string
  ): Promise<GeneratedPlanData> {
    const prompt = `
Sen Türkiye Yüzyılı Maarif Modeli MEB Tarih Dersi resmi formatına tam hakim kıdemli bir Tarih Öğretmeni ve Eğitim Mimarısın.
Resmi Maarif Modeli 3 Bölümlü Günlük ve 12 Kolonlu Yıllık Ders Planı şablonuna tam uygun içerik üret.

DİKKAT - KÜTÜPHANE VE DERS KİTAPLARI ANALİZİ:
Aşağıda sistem kütüphanesinde yer alan MEB Tarih Ders Kitapları, MEBİ, EBA ve OGM Materyal kaynakları listelenmiştir. Planı hazırlarken MUTLAKA bu kütüphane içeriklerini analiz et, ilgili MEB ders kitabı sayfalarını ve etkinliklerini içerik çerçevesine ve kaynaklara birebir dahil et:
${libraryContext || 'MEB 9-12. Sınıf Tarih Ders Kitapları, MEBİ Bireysel Öğrenme Platformu, OGM Materyal 3D Sanal Müze ve Etkileşimli Kitaplar.'}

Sınıf Düzeyi: ${gradeLevel}. Sınıf Tarih
Tema / Ünite: ${unitTitle}
Konu / İçerik: ${topicOrOutcome}
Tarih Aralığı: ${dateRange}
Ders Saati: ${lessonHours} Saat

Aşağıdaki JSON şemasında eksiksiz ve geçerli bir JSON çıktısı ver (başka metin ekleme):
{
  "topics": ["Konu 1", "Konu 2"],
  "contentFramework": "İçerik Çerçevesi (Konu özeti)",
  "learningOutcomes": ["TAR.${gradeLevel}... Öğrenme Çıktısı 1", "a) Alt süreç", "b) Alt süreç"],
  "domainSkills": "SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB1. Zamanı Algılama ve Kronolojik Düşünme",
  "conceptualSkills": "KB2.4. Çözümleme, KB2.17. Değerlendirme",
  "dispositions": "E2.1. Empati, E3.2. Odaklanma, E3.6. Analitiklik Düşünme",
  "socialEmotionalSkills": "SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme",
  "values": ["D6. Dürüstlük", "D19. Vatanseverlik"],
  "literacySkills": "OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık",
  "interdisciplinaryRelations": "Coğrafya, Felsefe, Sosyoloji, Edebiyat",
  "interSkillRelations": "SBAB2. Kanıta Dayalı Sorgulama, SBAB2.2. Kaynaklardan Bilgi Toplama, KB3.1. Karar Verme",
  "learningEvidences": "* Bu ünitedeki öğrenme çıktıları; çalışma yaprağı, infografik ve performans görevleri ile değerlendirilebilir.\\n* Dereceli puanlama anahtarı (rubrik) ve öz değerlendirme formu uygulanır.",
  "basicAssumptions": "* Öğrencilerin kültürel mirasın aktarılmasında tarihin rolü olduğu bilgisine ve temel araştırma deneyimine sahip oldukları kabul edilmektedir.\\n* Sosyal bilim ve dijitalleşme hakkında ön bilgilere sahip oldukları kabul edilir.",
  "preAssessmentProcess": "* Ünite kapsamında öğrencilere rehber sorular sorulur:\\n• Kültürel mirasın aktarılmasında tarihin rolü ne olabilir?\\n• Tarihin araştırma basamakları neler olabilir?",
  "processComponents": "1. Giriş ve Güdüleme: İlgi çekici görsel ve merak sorusu ile başlanır. 2. Keşfetme: Öğrenci merkezli grup analizi. 3. Derinleştirme: Tarihsel kanıt ve harita incelemesi. 4. Özetleme: Kazanım pekiştirilir.",
  "socialActivities": "Okul kütüphanesinde kaynak tarama ve sınıf panosu hazırlama.",
  "differentiation": {
    "enrichment": "İleri düzey öğrenciler için arşiv belgeleri ve sanal müze incelemesi.",
    "support": "Görsel eşleştirme kartları ve kavram şemaları ile destekleme."
  },
  "evaluation": "Performans görevi rubriği, çalışma yaprağı ve açık uçlu sınav.",
  "resources": "MEB ${gradeLevel}. Sınıf Tarih Ders Kitabı, MEBİ, EBA, OGM Materyal 3D Sanal Müze"
}
    `.trim();

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              topics: parsed.topics || [topicOrOutcome],
              contentFramework: parsed.contentFramework || topicOrOutcome,
              learningOutcomes: parsed.learningOutcomes || [],
              skills: parsed.skills || ['Tarihsel Kanıta Dayalı Sorgulama'],
              domainSkills: parsed.domainSkills || 'SBAB2. Kanıta Dayalı Sorgulama, SBAB1. Zamanı Algılama',
              conceptualSkills: parsed.conceptualSkills || 'KB2.4. Çözümleme',
              dispositions: parsed.dispositions || 'E2.1. Empati, E3.2. Odaklanma',
              socialEmotionalSkills: parsed.socialEmotionalSkills || 'SDB1.2. Kendini Düzenleme, SDB2.2. İş Birliği',
              values: parsed.values || ['D6. Dürüstlük', 'D19. Vatanseverlik'],
              literacySkills: parsed.literacySkills || 'OB1. Bilgi Okuryazarlığı',
              interdisciplinaryRelations: parsed.interdisciplinaryRelations || 'Coğrafya, Felsefe',
              interSkillRelations: parsed.interSkillRelations || 'SBAB2. Kanıta Dayalı Sorgulama',
              learningEvidences: parsed.learningEvidences || '* Çalışma yaprağı ve dereceli puanlama anahtarı (rubrik).',
              basicAssumptions: parsed.basicAssumptions || '* Öğrencilerin kültürel miras hakkında ön bilgilere sahip oldukları kabul edilmektedir.',
              preAssessmentProcess: parsed.preAssessmentProcess || '* Rehber sorular yönlendirilir.',
              processComponents: parsed.processComponents || '',
              socialActivities: parsed.socialActivities || 'Sınıf içi tarih panosu hazırlama.',
              differentiation: parsed.differentiation || {
                enrichment: 'Müze araştırması ve belge analizi.',
                support: 'Kavram haritası üzerinden pekiştirme.'
              },
              evaluation: parsed.evaluation || 'Açık uçlu soru ve ders içi gözlem formu.',
              resources: parsed.resources || `MEB ${gradeLevel}. Sınıf Tarih Kitabı, EBA, MEBİ`
            };
          }
        }
      } catch (e) {
        console.warn('Gemini API call error, falling back to curated curriculum data:', e);
      }
    }

    // Curated Fallback
    return this.generateFromCurriculumFallback(gradeLevel, unitTitle, topicOrOutcome, planType, lessonHours);
  }

  private static generateFromCurriculumFallback(
    gradeLevel: GradeLevel,
    unitTitle: string,
    topicOrOutcome: string,
    planType: PlanType,
    lessonHours: number = 2
  ): GeneratedPlanData {
    const gradeData = HISTORY_CURRICULUM[gradeLevel];
    const unit = gradeData.units.find(u => u.title.toLowerCase().includes(unitTitle.toLowerCase())) || gradeData.units[0];

    const matchedOutcomes = unit.learningOutcomes.length > 0
      ? [
          ...unit.learningOutcomes,
          'a) Tarihsel kaynakları ve bağlamı analiz eder.',
          'b) Tarihsel olaylar arasındaki neden-sonuç bağlamını değerlendirir.'
        ]
      : [`TAR.${gradeLevel}.${unit.unitNumber}.1. ${unit.title} konusunun tarihsel bağlamını analiz edebilme`];

    const topics = unit.topics.length > 0 ? unit.topics : [topicOrOutcome || unit.title];

    const processComponents = planType === 'DAILY'
      ? `1. Giriş ve Güdüleme: Derse ${topics[0]} konusu ile ilgili merak uyandırıcı bir soru veya görsel kaynak sunularak başlanır (${lessonHours * 20} dk).\n2. Keşfetme: Öğrenciler ikili gruplara ayrılarak MEB Tarih ders kitabı ve EBA görsel arşivi üzerinden konuyu inceler.\n3. Derinleştirme: Maarif modelinin tarihsel empati ve kronolojik düşünme becerileri doğrultusunda olayların sebep-sonuç ilişkileri çözümlenir.\n4. Özetleme & Değerlendirme: Dersin anahtar kavramları sınıfça pekiştirilir ve rubrik ile süreç değerlendirilir.`
      : `Haftalık öğrenme sürecinde ${unit.title} ünitesi kapsamında ${topics.join(', ')} konuları işlenecektir (Haftalık ${lessonHours} ders saati). Derslerde tarihsel kanıt kullanma, harita analizi ve çok boyutlu düşünme yöntemleri benimsenecektir.`;

    return {
      topics,
      contentFramework: topics[0] || unit.title,
      learningOutcomes: matchedOutcomes,
      skills: unit.skills,
      domainSkills: 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma, SBAB2.5. Kaynağı Yorumlama, SBAB1. Zamanı Algılama ve Kronolojik Düşünme',
      conceptualSkills: 'KB2.4. Çözümleme, KB2.17. Değerlendirme',
      dispositions: 'E2.1. Empati, E3.2. Odaklanma, E3.3. Yaratıcılık, E3.6. Analitiklik Düşünme',
      socialEmotionalSkills: 'SDB1.2. Kendini Düzenleme (Öz Düzenleme), SDB2.2. İş Birliği, SDB3.3. Sorumlu Karar Verme',
      values: ['D6. Dürüstlük', 'D19. Vatanseverlik'],
      literacySkills: 'OB1. Bilgi Okuryazarlığı, OB2. Dijital Okuryazarlık',
      interdisciplinaryRelations: 'Coğrafya, Felsefe, Matematik, Sosyoloji',
      interSkillRelations: 'SBAB2. Kanıta Dayalı Sorgulama, SBAB2.2. Kaynaklardan Bilgi Toplama, KB3.1. Karar Verme',
      learningEvidences: '* Bu ünitedeki öğrenme çıktıları; çalışma yaprağı, infografik ve performans görevleri ile değerlendirilebilir.\n* Tarih kavramının kapsamını izlemeye yönelik çalışma yaprağı ve infografik kullanılabilir.\n* Öğrencilerden araştırma ve çıkarımlarına ilişkin dereceli puanlama anahtarı ve öz değerlendirme formuyla ölçme yapılır.',
      basicAssumptions: '* Öğrencilerin kültürel mirasın aktarılmasında tarihin rolü olduğu bilgisine ve temel düzeyde tarih araştırmaları deneyimine sahip oldukları kabul edilmektedir.\n* Sosyal bilim, fen bilimleri ve büyük veri hakkında ön bilgilere sahip oldukları kabul edilmektedir.\n* Tarihin beşerî bir bilim dalı olduğuna ve bilimsel yöntem kullandığına ilişkin ön bilgileri olduğu kabul edilmektedir.',
      preAssessmentProcess: '* Ünite kapsamında öğrencilere aşağıdaki rehber sorular sorulabilir:\n• Kültürel mirasın aktarılmasında tarihin rolü ne olabilir?\n• Tarihin araştırma basamakları neler olabilir?',
      processComponents,
      socialActivities: unit.suggestedActivities || 'Okul kütüphanesinde kaynak tarama ve sınıf panosu hazırlama.',
      differentiation: {
        enrichment: 'İleri düzey öğrenciler için döneme ait ferman, hatırat ve arkeolojik bulguların eleştirel analizi.',
        support: 'Öğrenme güçlüğü çeken öğrenciler için görsel eşleştirme kartları ve kavram şemaları ile destekleme.'
      },
      evaluation: unit.evaluationMethods.join(', ') + ' ve süreç odaklı öz değerlendirme ölçeği.',
      resources: `MEB ${gradeLevel}. Sınıf Tarih Ders Kitabı, EBA Tarih Portalı, MEBİ Bireysel Öğrenme Platformu, OGM Materyal 3D Sanal Müze`
    };
  }

  static async askMaarifAssistant(question: string, apiKey?: string, libraryContext?: string): Promise<string> {
    const prompt = `
Sen Türkiye Yüzyılı Maarif Modeli ve MEB Ortaöğretim mevzuatında uzmanlaşmış "Tarih Maarif Rehberi" adlı sesli yapay zeka asistanısın.
Öğretmenin sorusunu MEB kanunları, Ortaöğretim Kurumları Yönetmeliği, Maarif Modeli ilkeleri, EBA, MEBİ ve OGM materyal standartlarına göre samimi, profesyonel ve net bir dille yanıtla.

SİSTEM KÜTÜPHANESİNDEKİ MEB DERS KİTAPLARI VE MATERYALLER:
${libraryContext || 'MEB 9, 10, 11, 12. Sınıf Tarih Ders Kitapları, Türk Kültür ve Medeniyeti Tarihi, OGM Materyal Etkileşimli Kitaplar, MEBİ ve EBA içerikleri.'}
Soruyu yanıtlarken kütüphanedeki bu MEB kaynaklarına, kitap ünitelerine ve pedagojik hedeflere atıfta bulunarak yol göster.

Soru: ${question}
    `.trim();

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 800 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (e) {
        console.warn('AI chat error:', e);
      }
    }

    const lower = question.toLowerCase();
    if (lower.includes('zümre')) {
      return 'MEB Ortaöğretim Kurumları Yönetmeliği 111. Maddesi gereğince zümre öğretmenler kurulu; ders yılı başında, ikinci dönem başında ve ders yılı sonunda olmak üzere en az üç defa toplanır. Türkiye Yüzyılı Maarif Modeli gereği zümrede beceri temelli ölçme ve süreç odaklı rubriklerin karara bağlanması esastır.';
    } else if (lower.includes('ortak sınav') || lower.includes('sınav')) {
      return 'MEB Ölçme ve Değerlendirme Yönetmeliği uyarınca okullarda sınavlar açık uçlu veya kısa cevaplı sorulardan oluşmalıdır. Çoktan seçmeli sınav yapılamaz. Her sınav öncesinde konu soru dağılım tablosu hazırlanmalı ve sınavın ardından dereceli puanlama anahtarı (rubrik) ile puanlama yapılmalıdır.';
    } else if (lower.includes('maarif') || lower.includes('değer')) {
      return 'Türkiye Yüzyılı Maarif Modeli; bilgi aktarımından ziyade erdem-değer-eylem çerçevesi ve beceri gelişimini merkezine alır. Tarih dersinde öğrencilere ezber yerine tarihsel kanıt sorgulama, empati ve kronolojik düşünme becerileri kazandırılır. Sosyal etkinlikler ve okul temelli planlama ders planının ayrılmaz parçasıdır.';
    } else if (lower.includes('e-okul') || lower.includes('not')) {
      return 'Ders etkinliklerine katılım puanları verilirken en az iki adet süreç odaklı gözlem veya rubrik puanı sisteme işlenmelidir. Öğrencilere verilen performans görevleri de önceden belirlenmiş dereceli puanlama anahtarı ile değerlendirilir.';
    }

    return 'Maarif Modeli doğrultusunda Tarih derslerinizde MEBİ platformunun etkileşimli içeriklerini, EBA görsel arşivini ve OGM Materyal sanal müzelerini kullanarak planlarınızı zenginleştirebilirsiniz. Sınavlarınızda açık uçlu sorular ve dereceli puanlama anahtarları kullanmayı unutmayınız.';
  }

  /**
   * MEB Maarif Modeli Ölçme ve Değerlendirme Yönetmeliğine uygun Açık Uçlu ve Bağlam Temelli 10 Soruluk Sınav Üretici
   * Soruların puan dağılımı zorluk derecesine göredir (Toplam: 100 Puan).
   * Cevap anahtarında yarım/kısmi cevaplar için ayrıntılı basamak puanlaması yer alır.
   */
  static async generateMaarifExam(
    gradeLevel: GradeLevel,
    academicYear: string,
    term: '1. Dönem' | '2. Dönem',
    examNumber: '1. Sınav' | '2. Sınav',
    unitOrTopics: string,
    questionCount: number = 10,
    scenario: string = 'Senaryo 1 (MEB Konu Soru Dağılım Tablosu)',
    schoolName: string = 'Ballıca Mesleki ve Teknik Anadolu Lisesi',
    teacherName: string = 'Yalçın DENİZ',
    apiKey?: string,
    libraryContext?: string
  ): Promise<ExamPaper> {
    const prompt = `
Sen Türkiye Yüzyılı Maarif Modeli ve MEB Ölçme ve Değerlendirme Yönetmeliği uzmanı kıdemli bir Tarih Öğretmenisin.
KULLANICININ KESİN KURALLARI:
1. SINAV TAM OLARAK 10 SORUDAN OLUŞMALIDIR.
2. TOPLAM PUAN KESİNLİKLE 100 PUAN OLMALIDIR.
3. PUAN DAĞILIMI SORULARIN ZORLUK DERECESİNE GÖRE YAPILMALIDIR:
   - 3 Soru KOLAY (Her biri 8 Puan = Toplam 24 Puan)
   - 4 Soru ORTA (Her biri 10 Puan = Toplam 40 Puan)
   - 3 Soru ZOR (Her biri 12 Puan = Toplam 36 Puan)
   - 24 + 40 + 36 = TAM 100 PUAN!
4. TÜM SORULAR AÇIK UÇLU, SENARYO / BAĞLAM TEMELLİ OLMALIDIR (bir tarihsel metin, kitabe parçası, seyyah notu veya tarihi olgu üzerinden çıkarım yaptırılmalı). Asla test/boşluk doldurma soru sorma.
5. CEVAP ANAHTARINDA YARIM CEVAP VEREN ÖĞRENCİLER İÇİN KADEMELİ / KISMİ PUANLAMA AÇIKÇA BELİRTİLMELİDİR:
   - "rubricGuide" içinde sorunun hangi kısmına ne kadar puan verileceği adımlara ayrılmalı.
   - "partialCreditNotes" alanında öğrenci eksik veya yarım cevap verdiğinde kaç puan alacağı net bir kuralla açıklanmalı (Örn: "Yalnızca olguyu yazıp gerekçe sunamayan öğrenciye 4 puan, eksik gerekçeye 6 puan, tam gerekçelendirmeye 10 puan verilir").

SINAV BİLGİLERİ:
- Sınıf: ${gradeLevel}. Sınıf Tarih
- Öğretim Yılı: ${academicYear}
- Dönem: ${term}
- Sınav: ${examNumber}
- Senaryo: ${scenario}
- Ünite / Kapsanan Konular: ${unitOrTopics}
- Okul: ${schoolName}
- Öğretmen: ${teacherName}

DİKKAT - KÜTÜPHANE VE MEB DERS KİTAPLARI BAĞLAMI:
${libraryContext || `MEB ${gradeLevel}. Sınıf Tarih Ders Kitabı, OGM Materyal, EBA ve MEBİ platformundaki resmi kazanımlar.`}

Lütfen YALNIZCA aşağıdaki JSON formatında geçerli bir yanıt ver:
{
  "themeUnit": "${unitOrTopics}",
  "topics": ["Kapsanan Alt Konu 1", "Kapsanan Alt Konu 2", "Kapsanan Alt Konu 3"],
  "instructions": "1. Sınav süresi 40 dakikadır. 2. Sorular açık uçlu olup yanıtlarınızı ayrılan boşluklara gerekçeleriyle yazınız. 3. Puanlama kademeli rubrik anahtarına göre yapılacak olup kısmi/yarım cevaplar da değerlendirilecektir. Başarılar dileriz.",
  "questions": [
    {
      "questionNumber": 1,
      "difficulty": "Kolay",
      "learningOutcome": "TAR.${gradeLevel}.1.1. Tarih öğrenmenin faydalarını yorumlayabilme",
      "domainSkill": "SBAB1. Zamanı Algılama ve Kronolojik Düşünme",
      "conceptualSkill": "KB2.14. Yorumlama",
      "value": "D19. Vatanseverlik",
      "contextText": "Tarihsel metin veya bağlam alıntısı...",
      "questionText": "Açık uçlu soru yönergesi...",
      "sampleAnswer": "Beklenen model yanıt...",
      "rubricGuide": [
        { "criterion": "Temel kavram veya olguyu doğru belirtme", "points": 4, "partialGuidance": "Kavram doğru yazılmışsa 4 puan verilir." },
        { "criterion": "Gerekçelendirme ve dönemsel bağlam kurma", "points": 4, "partialGuidance": "Gerekçe eksikse 2 puan, tamsa 4 puan verilir." }
      ],
      "partialCreditNotes": "Yalnızca kavramı yazan öğrenciye 4 puan, eksik gerekçede 6 puan, tam ve tutarlı açıklamaya 8 puan verilir.",
      "maxPoints": 8
    }
  ]
}
`.trim();

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 4000,
              responseMimeType: 'application/json'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);

            if (parsed.questions && parsed.questions.length >= 8) {
              const questions: ExamQuestion[] = parsed.questions.slice(0, 10).map((q: any, idx: number) => {
                const diff: 'Kolay' | 'Orta' | 'Zor' = q.difficulty || (idx < 3 ? 'Kolay' : idx < 7 ? 'Orta' : 'Zor');
                const defaultPoints = diff === 'Kolay' ? 8 : diff === 'Orta' ? 10 : 12;
                return {
                  id: `q-${Date.now()}-${idx + 1}`,
                  questionNumber: idx + 1,
                  difficulty: diff,
                  learningOutcome: q.learningOutcome || `TAR.${gradeLevel}. Kazanım`,
                  domainSkill: q.domainSkill || 'SBAB2. Kanıta Dayalı Sorgulama',
                  conceptualSkill: q.conceptualSkill || 'KB2.4. Çözümleme',
                  value: q.value || 'D6. Dürüstlük',
                  contextText: q.contextText || '',
                  questionText: q.questionText || '',
                  sampleAnswer: q.sampleAnswer || '',
                  rubricGuide: q.rubricGuide || [
                    { criterion: 'Temel tespiti doğru yapma', points: Math.floor(defaultPoints / 2) },
                    { criterion: 'Gerekçelendirme ve analiz', points: defaultPoints - Math.floor(defaultPoints / 2) }
                  ],
                  partialCreditNotes: q.partialCreditNotes || `Yarım cevapta kısmi puan (maksimum ${Math.floor(defaultPoints / 2)} puan), tam cevapta ${defaultPoints} puan verilir.`,
                  maxPoints: q.maxPoints || defaultPoints
                };
              });

              // Recalculate and balance to ensure exact 100 points
              const currentTotal = questions.reduce((s, q) => s + q.maxPoints, 0);
              if (currentTotal !== 100 && questions.length === 10) {
                // Enforce exact 8, 8, 8, 10, 10, 10, 10, 12, 12, 12
                const exactPts = [8, 8, 8, 10, 10, 10, 10, 12, 12, 12];
                questions.forEach((q, i) => {
                  q.maxPoints = exactPts[i];
                });
              }

              return {
                id: `exam-${Date.now()}`,
                gradeLevel,
                academicYear,
                term,
                examNumber,
                examType: 'OKUL_GENELI_ORTAK',
                scenario,
                themeUnit: parsed.themeUnit || unitOrTopics,
                topics: parsed.topics || [unitOrTopics],
                durationMinutes: 40,
                totalScore: 100,
                questions,
                schoolName,
                teacherName,
                instructions: parsed.instructions || 'Sınav süresi 40 dakikadır. Kademeli puanlama sistemi uygulanacaktır.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
            }
          }
        }
      } catch (e) {
        console.warn('Gemini exam API error, falling back:', e);
      }
    }

    return this.getFallbackExam(
      gradeLevel,
      academicYear,
      term,
      examNumber,
      unitOrTopics,
      10,
      scenario,
      schoolName,
      teacherName
    );
  }

  private static getFallbackExam(
    gradeLevel: GradeLevel,
    academicYear: string,
    term: '1. Dönem' | '2. Dönem',
    examNumber: '1. Sınav' | '2. Sınav',
    unitOrTopics: string,
    questionCount: number = 10,
    scenario: string = 'Senaryo 1 (MEB Konu Soru Dağılım Tablosu)',
    schoolName: string = 'Ballıca Mesleki ve Teknik Anadolu Lisesi',
    teacherName: string = 'Yalçın DENİZ'
  ): ExamPaper {
    const unit = HISTORY_CURRICULUM[gradeLevel]?.units[0];
    const unitTitle = unit?.title || unitOrTopics || 'Tarih Bilimi ve Kadim Medeniyetler';

    // 10 authentic open-ended questions with exact 100 points distribution:
    // 3 Kolay (8P = 24P) + 4 Orta (10P = 40P) + 3 Zor (12P = 36P) = 100 Puan!
    const questions: ExamQuestion[] = [
      // 1. SORU (KOLAY - 8 Puan)
      {
        id: 'q-fb-1',
        questionNumber: 1,
        difficulty: 'Kolay',
        learningOutcome: `TAR.${gradeLevel}.1.1. Tarih öğrenmenin bireye ve topluma faydalarını yorumlayabilme`,
        domainSkill: 'SBAB1. Zamanı Algılama ve Kronolojik Düşünme',
        conceptualSkill: 'KB2.14. Yorumlama',
        value: 'D19. Vatanseverlik, D18. Sorumluluk',
        contextText: 'Mustafa Kemal Atatürk: "Tarih yazmak, tarih yapmak kadar mühimdir. Yazan yapana sadık kalmazsa değişmeyen hakikat insanlığı şaşırtacak bir mahiyet alır." demiştir.',
        questionText: 'Yukarıdaki sözden hareketle; tarih öğrenmenin milli hafıza ve vatandaşlık bilinci oluşturmadaki rolünü bir cümleyle açıklayınız.',
        sampleAnswer: 'Tarih, bir milletin ortak zaferlerini, kederlerini ve kültürel değerlerini aktararak fertler arasında milli birlik ve aidiyet şuuru oluşturur.',
        rubricGuide: [
          { criterion: 'Milli hafıza ve birlik/beraberlik boyutunu belirtme', points: 4, partialGuidance: 'Kavram belirtilmişse 4 puan verilir.' },
          { criterion: 'Ait olma şuuru ve vatandaşlık bilinci ile ilişkilendirme', points: 4, partialGuidance: 'İlişkilendirme yapılmışsa 4 puan verilir.' }
        ],
        partialCreditNotes: 'Öğrenci yalnızca "birlik oluşturur" yazarsa 4 puan; milli hafıza ve gelecek bilinciyle tam açıklarsa 8 puan verilir.',
        maxPoints: 8
      },
      // 2. SORU (KOLAY - 8 Puan)
      {
        id: 'q-fb-2',
        questionNumber: 2,
        difficulty: 'Kolay',
        learningOutcome: `TAR.${gradeLevel}.1.2. Tarihsel bilginin doğasını ve kaynak türlerini kavrayabilme`,
        domainSkill: 'SBAB2. Kanıta Dayalı Sorgulama ve Araştırma',
        conceptualSkill: 'KB2.4. Çözümleme',
        value: 'D6. Dürüstlük',
        contextText: 'Tarih araştırmalarında olayların yaşandığı dönemde yazılan ferman, para ve kitabeler "birinci elden kaynak"; o dönemden sonra yazılan araştırma kitapları ise "ikinci elden kaynak" sayılır.',
        questionText: 'Birinci elden kaynakların tarih araştırmalarındaki önceliğini ve neden daha güvenilir kabul edildiğini kısaca belirtiniz.',
        sampleAnswer: 'Olayın doğrudan tanığı veya dönemin resmi belgesi olduğu için araya zaman ve üçüncü şahısların yorumu girmemiştir, bu nedenle ilk ve en güvenilir kaynaktır.',
        rubricGuide: [
          { criterion: 'Dönemin tanığı/belgesi olma niteliğini ifade etme', points: 4, partialGuidance: 'Doğru nitelik için 4 puan.' },
          { criterion: 'Yorumdan arınmış ve doğrudan bilgi sunma gerekçesini yazma', points: 4, partialGuidance: 'Gerekçe için 4 puan.' }
        ],
        partialCreditNotes: 'Yalnızca "o dönemde yazıldığı için" deyip gerekçeyi açıklamayan öğrenciye 4 puan, gerekçeli tam yanıta 8 puan verilir.',
        maxPoints: 8
      },
      // 3. SORU (KOLAY - 8 Puan)
      {
        id: 'q-fb-3',
        questionNumber: 3,
        difficulty: 'Kolay',
        learningOutcome: `TAR.${gradeLevel}.1.3. Tarihin diğer beşeri ve fen bilimleriyle ilişkisini açıklayabilme`,
        domainSkill: 'SBAB1. Zamanı Algılama ve Mekânsal İlişkilendirme',
        conceptualSkill: 'KB2.4. Çözümleme',
        value: 'D3. Bilimsellik',
        contextText: 'Tarihçi bir savaşın yapıldığı coğrafi alanı incelerken dağları, ırmakları ve iklim koşullarını dikkate almak zorundadır.',
        questionText: 'Tarih biliminin olayların gerçekleştiği mekânı tespit edebilmek için en çok yararlandığı yardımcı bilim dalı hangisidir? Bu bilimin katkısını bir cümleyle yazınız.',
        sampleAnswer: 'Coğrafya bilimidir. Coğrafya, olayın geçtiği yerin iklim, yeryüzü şekilleri ve stratejik konumunu belirterek orduların hareketini ve savaşın sonucunu anlamayı sağlar.',
        rubricGuide: [
          { criterion: 'Coğrafya bilimini doğru tespit etme', points: 4, partialGuidance: 'Doğru bilim dalı için 4 puan.' },
          { criterion: 'Mekân ve iklimin olaylara etkisini açıklama', points: 4, partialGuidance: 'Açıklama için 4 puan.' }
        ],
        partialCreditNotes: 'Yalnızca "Coğrafya" yazıp katkısını belirtmeyen öğrenciye 4 puan; katkısıyla birlikte yazan öğrenciye 8 puan verilir.',
        maxPoints: 8
      },
      // 4. SORU (ORTA - 10 Puan)
      {
        id: 'q-fb-4',
        questionNumber: 4,
        difficulty: 'Orta',
        learningOutcome: `TAR.${gradeLevel}.1.4. Tarihsel bilginin değişebilir ve dinamik yapısını tahlil edebilme`,
        domainSkill: 'SBAB2. Kanıta Dayalı Sorgulama',
        conceptualSkill: 'KB2.17. Değerlendirme',
        value: 'D6. Dürüstlük, D3. Bilimsellik',
        contextText: 'Osmanlı Devleti\'nde ilk paranın Orhan Bey döneminde basıldığı bilinmekteyken, arkeolojik kazılarda Osman Bey\'e ait bir sikke bulunmuş ve bu bilgi güncellenmiştir.',
        questionText: 'Bu durum tarihsel bilginin hangi özelliğini kanıtlar? Tarih biliminde neden mutlak ve ebediyen değişmez kurallar olamayacağını gerekçelendiriniz.',
        sampleAnswer: 'Tarihsel bilginin "yeni belge ve arkeolojik bulgularla değişebilir ve gelişebilir" olduğunu kanıtlar. Tarihte deney ve gözlem yapılamadığından ulaşılan bilgiler mevcut belgelerle sınırlıdır; yeni kanıtlar eski kabulleri değiştirebilir.',
        rubricGuide: [
          { criterion: 'Bilginin değişebilir / dinamik niteliğini doğru saptama', points: 5, partialGuidance: 'Özellik doğruysa 5 puan.' },
          { criterion: 'Deney yapılamaması ve belgelere dayalı olma gerekçesini sunma', points: 5, partialGuidance: 'Gerekçe tutarlıysa 5 puan.' }
        ],
        partialCreditNotes: 'Öğrenci sadece "bilgiler değişebilir" yazarsa 5 puan; deney yapılamaması ve yeni belgelerin etkisiyle tam açıklarsa 10 puan verilir.',
        maxPoints: 10
      },
      // 5. SORU (ORTA - 10 Puan)
      {
        id: 'q-fb-5',
        questionNumber: 5,
        difficulty: 'Orta',
        learningOutcome: `TAR.${gradeLevel}.1.5. Tarih metodolojisinde tenkit (eleştiri) basamağını uygulayabilme`,
        domainSkill: 'SBAB2.3. Kaynağı İnceleme, SBAB2.4. Kaynağı Sorgulama',
        conceptualSkill: 'KB2.4. Çözümleme',
        value: 'D6. Dürüstlük',
        contextText: 'Tarihçi Ali Bey, Haçlı Seferleri\'ni araştırırken sadece Haçlı kroniklerini değil, Selçuklu ve İslam müverrihlerinin (İbnü\'l-Esir gibi) eserlerini de karşılaştırmalı olarak incelemiştir.',
        questionText: 'Tarihçinin farklı taraflara ait kaynakları birlikte tenkit etmesinin (eleştirmesinin) araştırmaya sağlayacağı iki temel faydayı yazınız.',
        sampleAnswer: '1. Olayları tek taraflı önyargılardan arındırarak tarafsız ve objektif bir sonuca ulaşmayı sağlar.\n2. Bir tarafın gizlediği veya abarttığı bilgileri diğer tarafın kayıtlarıyla teyit etme imkânı verir.',
        rubricGuide: [
          { criterion: 'Objektiflik ve tarafsızlık boyutunu açıklama', points: 5, partialGuidance: 'İlk fayda için 5 puan.' },
          { criterion: 'Çapraz kontrol ve bilgi doğrulama boyutunu açıklama', points: 5, partialGuidance: 'İkinci fayda için 5 puan.' }
        ],
        partialCreditNotes: 'Öğrenci yalnızca bir faydayı (örneğin tarafsızlık) yazarsa 5 puan; her iki faydayı gerekçeli yazarsa 10 puan verilir.',
        maxPoints: 10
      },
      // 6. SORU (ORTA - 10 Puan)
      {
        id: 'q-fb-6',
        questionNumber: 6,
        difficulty: 'Orta',
        learningOutcome: `TAR.${gradeLevel}.1.6. Tarih öğreniminde anakronizm (tarih yanılgısı) kavramını değerlendirebilme`,
        domainSkill: 'SBAB1. Zamanı Algılama ve Kronolojik Düşünme',
        conceptualSkill: 'KB2.17. Değerlendirme',
        value: 'D1. Adalet, D13. Saygı',
        contextText: 'Tarihi bir olayı veya şahsiyeti değerlendirirken günümüzün ahlak, hukuk ve teknoloji anlayışıyla hüküm vermek büyük bir tarih metodolojisi hatasıdır.',
        questionText: 'Anakronizmden kaçınmak ve tarihi olayları "kendi döneminin şartları içerisinde değerlendirmek" neden bilimsel bir zorunluluktur? Açıklayınız.',
        sampleAnswer: 'Her dönemin inançları, teknolojik imkânları ve toplumsal değer yargıları farklıdır. Geçmişi bugünün ölçüleriyle yargılamak tarihi şahsiyetlere adaletsizlik yapılmasına ve olayların gerçek nedenlerinin anlaşılamamasına yol açar.',
        rubricGuide: [
          { criterion: 'Dönemin şartlarının ve imkânlarının farklılığını vurgulama', points: 5, partialGuidance: 'Dönemsel zemin için 5 puan.' },
          { criterion: 'Tarihi empati ve adaleti sağlama gerekçesini sunma', points: 5, partialGuidance: 'Adalet ve metodolojik gerekçe için 5 puan.' }
        ],
        partialCreditNotes: 'Yalnızca "o zamanın şartları başkaydı" deyip gerekçeyi derinleştiremeyen öğrenciye 5 puan, tam gerekçeye 10 puan verilir.',
        maxPoints: 10
      },
      // 7. SORU (ORTA - 10 Puan)
      {
        id: 'q-fb-7',
        questionNumber: 7,
        difficulty: 'Orta',
        learningOutcome: `TAR.${gradeLevel}.1.7. Dijitalleşmenin tarih araştırma ve arşivciliğine etkisini analiz edebilme`,
        domainSkill: 'OB2. Dijital Okuryazarlık',
        conceptualSkill: 'KB2.10. Neden-Sonuç İlişkisi Kurma',
        value: 'D18. Sorumluluk, D6. Dürüstlük',
        contextText: 'Devlet Arşivleri Başkanlığı milyonlarca vesikayı dijitalleştirerek internete açmış; buna karşılık sosyal medyada teyitsiz, sahte tarihsel alıntılar ve görseller hızla yayılmaya başlamıştır.',
        questionText: 'Dijitalleşmenin tarih araştırmalarına sağladığı bir büyük kolaylığı (fırsat) ve yol açtığı bir ciddi tehlikeyi (risk) yazınız.',
        sampleAnswer: 'Fırsat: Araştırmacıların fiziki olarak arşive gitmeden belgelere anında erişmesini sağlar ve yıpranabilir belgeleri korur. Risk: Teyit edilmemiş dijital içeriklerin ve yapay zeka sahteciliğinin tarihi dezenformasyona yol açmasıdır.',
        rubricGuide: [
          { criterion: 'Erişim hızı ve arşiv koruma fırsatını açıklama', points: 5, partialGuidance: 'Fırsat boyutu için 5 puan.' },
          { criterion: 'Dijital dezenformasyon ve sahte içerik riskini açıklama', points: 5, partialGuidance: 'Risk boyutu için 5 puan.' }
        ],
        partialCreditNotes: 'Yalnızca fırsatı veya yalnızca riski yazan öğrenciye 5 puan; her iki boyutu da tutarlı açıklayan öğrenciye 10 puan verilir.',
        maxPoints: 10
      },
      // 8. SORU (ZOR - 12 Puan)
      {
        id: 'q-fb-8',
        questionNumber: 8,
        difficulty: 'Zor',
        learningOutcome: `TAR.${gradeLevel}.2.1. Kadim dünyada coğrafi şartların medeniyetlerin maddi kültürüne etkisini analiz edebilme`,
        domainSkill: 'SBAB1. Mekânsal İlişkilendirme, SBAB2. Kanıta Dayalı Sorgulama',
        conceptualSkill: 'KB2.4. Çözümleme',
        value: 'D4. Dayanışma',
        contextText: 'Mezopotamya\'da taş ocakları bulunmadığı için Sümer ve Babil mimarisi kerpiç ve tuğladan yapılmış, bu nedenle eserlerin çoğu eriyerek günümüze ulaşamamıştır. Oysa Mısır\'da yapılar Nil vadisindeki dev granit ve kireç taşı bloklarla inşa edilmiş, piramitler binlerce yıl ayakta kalmıştır.',
        questionText: 'Yukarıdaki metinden hareketle; coğrafi çevre ve ham madde kaynaklarının, medeniyetlerin sanat ve mimari kalıcılığı üzerindeki etkisini gerekçelendirerek tahlil ediniz.',
        sampleAnswer: 'Coğrafi çevre toplumların inşa malzemesi tercihini ve dayanıklılık düzeyini doğrudan belirlemiştir. Sümerler taş olmadığı için kil ve kerpice yönelmiş, seller ve yağmurlar yapıları yok etmiştir. Mısır ise taş kaynağına sahip olduğu için anıtsal ve ölümsüzlüğü simgeleyen dayanıklı eserler inşa edebilmiştir.',
        rubricGuide: [
          { criterion: 'Coğrafya-malzeme (kerpiç vs taş) ilişkisini doğru çözümleme', points: 4, partialGuidance: 'Malzeme tespiti için 4 puan.' },
          { criterion: 'İklim şartlarının kerpiç üzerindeki yıkıcı etkisini açıklama', points: 4, partialGuidance: 'Yıkım etkisi için 4 puan.' },
          { criterion: 'Eserlerin günümüze ulaşabilme düzeyini coğrafyayla gerekçelendirme', points: 4, partialGuidance: 'Kalıcılık boyutu için 4 puan.' }
        ],
        partialCreditNotes: 'Yalnızca taş/kerpiç farkını yazan öğrenciye 4 puan; iklimin etkisini ekleyene 8 puan; kalıcılık ve felsefi boyutuyla eksiksiz tahlil edene 12 puan verilir.',
        maxPoints: 12
      },
      // 9. SORU (ZOR - 12 Puan)
      {
        id: 'q-fb-9',
        questionNumber: 9,
        difficulty: 'Zor',
        learningOutcome: `TAR.${gradeLevel}.2.2. Kadim toplumlarda hukuk kurallarının gelişimini toplumsal yapı ile ilişkilendirebilme`,
        domainSkill: 'SBAB2.5. Kaynağı Yorumlama',
        conceptualSkill: 'KB2.10. Neden-Sonuç İlişkisi Kurma',
        value: 'D1. Adalet, D18. Sorumluluk',
        contextText: 'Babil Kralı Hammurabi Kanunları "Göze göz, dişe diş" (kısas) ilkesine dayanan son derece sert cezalar içerirken; Hitit Kanunları\'nda kısas yerine maddi tazminat esası getirilmiş ve aile hukukuna geniş yer verilmiştir.',
        questionText: 'Bu iki medeniyetin kanunları arasındaki temel yaklaşım farkını karşılaştırınız. Hititlerin tazminat esasına yönelmesinin toplumsal barış ve insan yaşamına bakış açısı açısından önemini değerlendiriniz.',
        sampleAnswer: 'Hammurabi sert kısas ve caydırıcılıkla merkezi otoriteyi korkuyla korumayı amaçlarken; Hititler telafi edici adalet (tazminat) benimsemiştir. Hititlerin bu yaklaşımı insan hayatına verilen değeri artırmış, kan davalarını önlemiş ve daha hümanist bir hukuk anlayışı geliştirmiştir.',
        rubricGuide: [
          { criterion: 'Kısas ile tazminat ilkesi arasındaki farkı doğru karşılaştırma', points: 4, partialGuidance: 'Karşılaştırma için 4 puan.' },
          { criterion: 'Hammurabi\'nin sert otorite kurma amacını açıklama', points: 4, partialGuidance: 'Babil boyutu için 4 puan.' },
          { criterion: 'Hititlerin kan davalarını önleme ve insan hakları katkısını değerlendirme', points: 4, partialGuidance: 'Hitit hümanizmi için 4 puan.' }
        ],
        partialCreditNotes: 'Sadece "Babil sert, Hitit yumuşaktı" yazan öğrenciye 4 puan; tazminat ve kısas terimlerini kullanan öğrenciye 8 puan; toplumsal barış ve insan hayatı tahlili yapan tam yanıta 12 puan verilir.',
        maxPoints: 12
      },
      // 10. SORU (ZOR - 12 Puan)
      {
        id: 'q-fb-10',
        questionNumber: 10,
        difficulty: 'Zor',
        learningOutcome: `TAR.${gradeLevel}.2.3. Konargöçer ve yerleşik yaşam tarzlarının askeri ve siyasi teşkilatlanmaya etkisini sentezleyebilme`,
        domainSkill: 'SBAB1. Zamanı Algılama ve Kronolojik Düşünme, KB3.3. Eleştirel Bakma',
        conceptualSkill: 'KB2.17. Değerlendirme',
        value: 'D19. Vatanseverlik, D4. Dayanışma',
        contextText: 'Çinli elçi, Hun Türkleri hakkında imparatoruna yazdığı raporda: "Onların surları ve sarayları yoktur; at sırtında yaşarlar, sürülerinin peşinde göçerler. Kuşatma altına alınamazlar, çekildiklerinde peşlerinden gidilemez. Kadınları da erkekleri gibi ata biner ve ok atar." demiştir.',
        questionText: 'Yukarıdaki rapordan hareketle; konargöçer bozkır kültürünün Türklere kazandırdığı "ordu-millet" anlayışını ve yerleşik imparatorluklara karşı sağladığı askeri üstünlükleri iki gerekçeyle değerlendiriniz.',
        sampleAnswer: '1. Her An Savaşa Hazır Olma (Ordu-Millet): Bozkırın çetin şartları gereği halkın tamamı günlük yaşamda at binip ok attığından Türklerde paralı veya ayrı bir asker sınıfı olmamış, milletin tamamı savaşa hazır bir ordu haline gelmiştir.\n2. Yüksek Manevra Kabiliyeti ve Kuşatılmama: Sabit şehirleri ve surları olmadığı için düşman onları bir yerde sıkıştıramamış; sahte ricat (Turan taktiği) ve hızlı süvari baskınlarıyla hantal orduları mağlup etmişlerdir.',
        rubricGuide: [
          { criterion: 'Ordu-millet kavramını bozkır yaşam tarzıyla doğru ilişkilendirme', points: 4, partialGuidance: 'Ordu-millet tespiti için 4 puan.' },
          { criterion: 'Hızlı süvari manevrası ve Turan taktiği üstünlüğünü açıklama', points: 4, partialGuidance: 'Askeri taktik için 4 puan.' },
          { criterion: 'Kuşatılamama ve psikolojik yıpratma avantajını değerlendirme', points: 4, partialGuidance: 'Stratejik avantaj için 4 puan.' }
        ],
        partialCreditNotes: 'Öğrenci sadece "hızlı hareket ederlerdi" derse 4 puan; ordu-millet kavramını eklerse 8 puan; taktik ve teşkilat boyutlarıyla eksiksiz değerlendirirse 12 puan verilir.',
        maxPoints: 12
      }
    ];

    return {
      id: `exam-fb-${Date.now()}`,
      gradeLevel,
      academicYear,
      term,
      examNumber,
      examType: 'OKUL_GENELI_ORTAK',
      scenario,
      themeUnit: unitTitle,
      topics: unit?.topics || [unitTitle],
      durationMinutes: 40,
      totalScore: 100,
      questions,
      schoolName,
      teacherName,
      instructions: '1. Sınav süresi 40 dakikadır. 2. Sorular açık uçlu olup yanıtlarınızı ayrılan bölümlere gerekçeli olarak yazınız. 3. Puanlama zorluk derecesine göre dereceli rubrik ile yapılacak olup kısmi/yarım cevaplar da puanlandırılacaktır. Başarılar dileriz.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}


