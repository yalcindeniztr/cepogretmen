import { AppSettings, GradeLevel, LibraryItem, EvaluationScale, MebCalendarReminder } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  id: 1,
  schoolName: 'Ballıca MTAL',
  teacherName: 'Yalçın DENİZ',
  principalName: 'Fatma Bayram ARSLAN',
  academicYear: '2024-2025',
  term: 'Tam Yıl',
  defaultWeeklyHours: 2,
  geminiApiKey: '',
  speechEnabled: true
};

export interface CurriculumUnit {
  unitNumber: number;
  title: string;
  suggestedWeeks: number;
  topics: string[];
  learningOutcomes: string[];
  skills: string[];
  values: string[];
  suggestedActivities: string;
  evaluationMethods: string[];
}

export const MAARIF_VALUES = [
  'Adalet',
  'Dostluk',
  'Dürüstlük',
  'Öz Denetim',
  'Sabır',
  'Saygı',
  'Sevgi',
  'Sorumluluk',
  'Vatanseverlik',
  'Yardımseverlik',
  'Milli Bilinç',
  'Tarihsel Duyarlılık',
  'Kültürel Mirasa Sahip Çıkma',
  'Bilimsellik ve Merak'
];

export const MAARIF_SKILLS = [
  'Tarihsel Kavrama ve Kronolojik Düşünme',
  'Tarihsel Kanıta Dayalı Sorgulama ve Analiz',
  'Tarihsel Empati ve Çok Boyutlu Bakış',
  'Değişim ve Sürekliliği Algılama',
  'Neden-Sonuç İlişkisi Kurma',
  'Tarihsel Metin ve Harita Okuryazarlığı',
  'Dijital Tarihsel Kaynakları Değerlendirme'
];

export const HISTORY_CURRICULUM: Record<GradeLevel, { title: string; units: CurriculumUnit[] }> = {
  9: {
    title: '9. Sınıf Tarih (Maarif Modeli)',
    units: [
      {
        unitNumber: 1,
        title: 'Giriş: Geçmişin İnşası ve Tarih',
        suggestedWeeks: 4,
        topics: [
          'Tarih Biliminin Doğası ve İnsanın Anlam Arayışı',
          'Tarihin Kaynakları ve Bilgi Üretim Süreci',
          'Zaman, Takvim ve Kronoloji Bilinci',
          'Tarihsel Olay, Olgu ve Kanıt İlişkisi'
        ],
        learningOutcomes: [
          'TAR.9.1.1. Tarih biliminin doğasını ve insanın geçmişle kurduğu anlam bağını değerlendirebilme',
          'TAR.9.1.2. Tarihsel bilginin üretiminde kullanılan kaynak türlerini ve güvenilirliklerini sorgulayabilme',
          'TAR.9.1.3. Zaman algısı ve takvim sistemlerinin toplumsal ihtiyaçlarla gelişimini açıklayabilme'
        ],
        skills: ['Tarihsel Kanıta Dayalı Sorgulama', 'Kronolojik Düşünme', 'Bilgi Okuryazarlığı'],
        values: ['Dürüstlük', 'Bilimsellik ve Merak', 'Tarihsel Duyarlılık'],
        suggestedActivities: 'Aile tarihi sözlü tarih çalışması, dijital arşivlerden (Devlet Arşivleri/EBA) belge analizi atölyesi.',
        evaluationMethods: ['Açık Uçlu Soru Rubriği', 'Sözlü Tarih Performans Ölçeği', 'Öz Değerlendirme Formu']
      },
      {
        unitNumber: 2,
        title: 'Kadim Dünyada İnsan ve Mekân (İlk Çağ)',
        suggestedWeeks: 6,
        topics: [
          'İlk Yerleşimler ve İnsan-Doğa Etkileşimi (Göbeklitepe, Çatalhöyük)',
          'Kadim Medeniyet Havzaları (Mezopotamya, Mısır, Anadolu, Ege, Çin, Hint)',
          'İlk Hukuk Metinleri ve Adalet Anlayışı',
          'Yazı, Bilim, Ticaret Yolları ve Kültürel Etkileşim'
        ],
        learningOutcomes: [
          'TAR.9.2.1. İnsan-mekân etkileşimi bağlamında ilk yerleşimlerin ve üretim tarzlarının gelişimini analiz edebilme',
          'TAR.9.2.2. Kadim medeniyet havzalarındaki bilim, hukuk ve sanat birikiminin insanlığa katkılarını değerlendirebilme',
          'TAR.9.2.3. Hukuk kurallarının gelişiminde adalet ve toplumsal düzen arayışını karşılaştırabilme'
        ],
        skills: ['Neden-Sonuç İlişkisi Kurma', 'Harita Okuryazarlığı', 'Tarihsel Empati'],
        values: ['Adalet', 'Kültürel Mirasa Sahip Çıkma', 'Saygı'],
        suggestedActivities: 'Hammurabi Kanunları ile günümüz adalet kavramını karşılaştıran münazara; Göbeklitepe sanal müze turu (OGM Materyal 3D).',
        evaluationMethods: ['Kavram Haritası Puanlama Anahtarı', 'Grup Çalışması Gözlem Formu']
      },
      {
        unitNumber: 3,
        title: 'Orta Çağ Dünyasında Siyaset, Toplum ve İnanç',
        suggestedWeeks: 6,
        topics: [
          'Orta Çağ’da Siyasi Yapılar (Feodalite, Doğu Roma, Sasani)',
          'Tarımdan Ticarete Orta Çağ Ekonomisi ve İpek/Baharat Yolları',
          'İnanç Dünyası ve Dinlerin Toplumsal Dönüşüme Etkisi',
          'Orta Çağ Hukuku (Roma Hukuku, Cengiz Yasası vb.)'
        ],
        learningOutcomes: [
          'TAR.9.3.1. Orta Çağ’daki başlıca siyasi organizasyonları ve meşruiyet kaynaklarını analiz edebilme',
          'TAR.9.3.2. Ticaret yollarının medeniyetler arası kültürel aktarımdaki rolünü yorumlayabilme'
        ],
        skills: ['Değişim ve Sürekliliği Algılama', 'Tarihsel Metin Analizi'],
        values: ['Dostluk', 'Sorumluluk', 'Barış'],
        suggestedActivities: 'İpek Yolu kervan simülasyonu etkinliği, harita üzerinde ticaret güzergahları çizimi.',
        evaluationMethods: ['Performans Görevi Dereceli Puanlama Anahtarı', 'Akran Değerlendirme']
      },
      {
        unitNumber: 4,
        title: 'Avrasya Bozkırlarında Türk Dünyası',
        suggestedWeeks: 8,
        topics: [
          'Bozkır Kültürü ve Konargöçer Yaşam Tarzı',
          'İlk Türk Devletleri ve Teşkilat Yapısı (Asya Hun, Kök Türk, Uygur)',
          'Türklerde Töre, Hukuk, Ordu ve Kadının Rolü',
          'Kavimler Göçü ve Dünya Tarihine Etkileri'
        ],
        learningOutcomes: [
          'TAR.9.4.1. Bozkır coğrafyasının Türk devlet teşkilatlanması ve yaşam kültürüne etkilerini değerlendirebilme',
          'TAR.9.4.2. İlk Türk devletlerinde töre ve adalet anlayışını devlet yönetimiyle ilişkilendirebilme',
          'TAR.9.4.3. Orhun Yazıtları üzerinden Türk devlet felsefesini ve milli bilinci analiz edebilme'
        ],
        skills: ['Tarihsel Metin Analizi', 'Tarihsel Empati', 'Kronolojik Düşünme'],
        values: ['Vatanseverlik', 'Milli Bilinç', 'Adalet', 'Öz Denetim'],
        suggestedActivities: 'Orhun Kitabeleri metin inceleme atölyesi, MEBİ sesli ve görsel kaynaklarından bilge hükümdarlar analizi.',
        evaluationMethods: ['Metin İnceleme Rubriği', 'Tarihsel Düşünme Gözlem Formu']
      },
      {
        unitNumber: 5,
        title: 'İslam Medeniyetinin Doğuşu ve Yayılışı',
        suggestedWeeks: 6,
        topics: [
          'İslamiyet’in Doğuşu Sırasında Dünya ve Arap Yarımadası',
          'Hz. Muhammed Dönemi ve Medine Sözleşmesi',
          'Dört Halife Dönemi, Emeviler ve Abbasiler',
          'İslam Medeniyetinde İlim, Düşünce ve Beytü’l-Hikme'
        ],
        learningOutcomes: [
          'TAR.9.5.1. İslamiyet’in doğuşunun toplumsal, hukuki ve ahlaki dönüşümlerini analiz edebilme',
          'TAR.9.5.2. Medine Sözleşmesi’nin çoğulcu toplum ve barış kültürüne katkılarını değerlendirebilme',
          'TAR.9.5.3. İslam Rönesansı döneminde üretilen bilim ve düşünce mirasını insanlık tarihi açısından açıklayabilme'
        ],
        skills: ['Tarihsel Empati', 'Neden-Sonuç İlişkisi Kurma', 'Eleştirel Düşünme'],
        values: ['Adalet', 'Sevgi', 'Saygı', 'Yardımseverlik', 'Bilimsellik ve Merak'],
        suggestedActivities: 'Medine Sözleşmesi maddeleri üzerinden günümüz insan hakları kavramlarının incelenmesi.',
        evaluationMethods: ['Rubrikli Makale/Kompozisyon Değerlendirme', 'Öz Değerlendirme']
      },
      {
        unitNumber: 6,
        title: 'Türklerin İslamiyet’i Kabulü ve İlk İslam Devletleri',
        suggestedWeeks: 6,
        topics: [
          'Talas Savaşı ve Türk-İslam Sentezinin Başlangıcı',
          'Karahanlılar, Gazneliler ve Büyük Selçuklu Devleti',
          'Türk-İslam Kültüründe İlk Eserler (Kutadgu Bilig, Divanü Lügati\'t-Türk)',
          'Nizamiye Medreseleri ve Bilim Dünyası'
        ],
        learningOutcomes: [
          'TAR.9.6.1. Türklerin İslamiyet’i kabul süreçlerini ve kültürel sürekliliklerini değerlendirebilme',
          'TAR.9.6.2. İlk Türk-İslam edebî ve felsefi eserlerindeki ahlak ve devlet yönetimi ilkelerini analiz edebilme'
        ],
        skills: ['Değişim ve Sürekliliği Algılama', 'Tarihsel Kanıt İnceleme'],
        values: ['Milli Bilinç', 'Dürüstlük', 'Öz Denetim', 'Kültürel Mirasa Sahip Çıkma'],
        suggestedActivities: 'Kutadgu Bilig’den seçilen beyitlerin drama veya canlandırma ile sınıfta çözümlenmesi.',
        evaluationMethods: ['Drama Değerlendirme Ölçeği', 'Ders İçi Katılım Rubriği']
      }
    ]
  },
  10: {
    title: '10. Sınıf Tarih',
    units: [
      {
        unitNumber: 1,
        title: 'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi',
        suggestedWeeks: 6,
        topics: ['1071 Malazgirt ve Anadolu’nun Türkleşmesi', 'Anadolu Selçukluları ve Beylikler', 'Haçlı Seferleri ve Kültürel Etkileşim'],
        learningOutcomes: ['TAR.10.1.1. Anadolu’da ilk Türk beylikleri ve Türkiye Selçuklu Devleti’nin iskân siyasetini analiz edebilme'],
        skills: ['Harita Okuryazarlığı', 'Tarihsel Empati'],
        values: ['Vatanseverlik', 'Dayanışma', 'Adalet'],
        suggestedActivities: 'Anadolu Türk mimarisi görsel sunum hazırlama ve Darüşşifa kavramı incelemesi.',
        evaluationMethods: ['Performans Görevi Puanlama Anahtarı']
      },
      {
        unitNumber: 2,
        title: 'Beylikten Devlete Osmanlı Siyaseti (1302-1453)',
        suggestedWeeks: 8,
        topics: ['Osmanlı Kuruluş Dönemi ve Jeopolitik Konumu', 'Balkanlar’da İskân ve İstimâlet Politikası', 'Fetret Devri ve Ankara Savaşı'],
        learningOutcomes: ['TAR.10.2.1. Osmanlı Beyliği’nin devletleşme sürecindeki siyasi ve askeri dinamikleri kavrayabilme'],
        skills: ['Kronolojik Düşünme', 'Neden-Sonuç İlişkisi Kurma'],
        values: ['Adalet', 'Hoşgörü (Saygı)', 'Sorumluluk'],
        suggestedActivities: 'İstimâlet politikasının Balkan halkları üzerindeki etkisine dair kaynak belge analizi.',
        evaluationMethods: ['Açık Uçlu Soru Değerlendirme Rubriği']
      },
      {
        unitNumber: 3,
        title: 'Devletleşme Sürecinde Savaşçılar ve Askerler',
        suggestedWeeks: 6,
        topics: ['Tımar Sistemi ve Tımarlı Sipahiler', 'Yeniçeri Ocağı ve Devşirme Sistemi', 'Osmanlı Ordu Teşkilatı'],
        learningOutcomes: ['TAR.10.3.1. Osmanlı askeri teşkilatlanmasının toplumsal ve ekonomik temellerini analiz edebilme'],
        skills: ['Tarihsel Sorgulama', 'Şema ve Tablo Okuma'],
        values: ['Vatanseverlik', 'Öz Denetim', 'Disiplin'],
        suggestedActivities: 'Tımar sisteminin tarım ve ordu ilişkisini gösteren zihin haritası tasarımı.',
        evaluationMethods: ['Zihin Haritası Değerlendirme Ölçeği']
      },
      {
        unitNumber: 4,
        title: 'Klasik Çağda Osmanlı Toplum Düzeni ve Kültürü',
        suggestedWeeks: 8,
        topics: ['Millet Sistemi ve Çok Kültürlülük', 'Lonca Teşkilatı ve Ahilik Kültürü', 'Vakıf Medeniyeti ve Şehirleşme'],
        learningOutcomes: ['TAR.10.4.1. Osmanlı toplum yapısını, vakıf kültürünü ve Ahilik teşkilatının ahlaki ilkelerini analiz edebilme'],
        skills: ['Tarihsel Empati', 'Değişim ve Sürekliliği Algılama'],
        values: ['Yardımseverlik', 'Dürüstlük', 'Saygı', 'Kültürel Miras'],
        suggestedActivities: 'Ahi Evran ahlak ilkeleri ile mesleki etik karşılaştırması atölyesi.',
        evaluationMethods: ['Gözlem Formu', 'Öz Değerlendirme']
      },
      {
        unitNumber: 5,
        title: 'Sultan ve Merkez Teşkilatı',
        suggestedWeeks: 4,
        topics: ['Divân-ı Hümâyun ve Yetkileri', 'Padişahın Meşruiyeti ve Kanunnameler', 'Topkapı Sarayı ve Enderun'],
        learningOutcomes: ['TAR.10.5.1. Osmanlı merkez teşkilatının unsurlarını ve yönetim felsefesini değerlendirebilme'],
        skills: ['Tarihsel Metin Analizi', 'Sorgulama'],
        values: ['Adalet', 'Liyakat ve Sorumluluk'],
        suggestedActivities: 'Kanunname-i Âl-i Osman maddelerinden devlet düzeni analizi.',
        evaluationMethods: ['Kavram Değerlendirme Formu']
      }
    ]
  },
  11: {
    title: '11. Sınıf Tarih',
    units: [
      {
        unitNumber: 1,
        title: 'Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti (1595-1774)',
        suggestedWeeks: 8,
        topics: ['Westphalia Barışı ve Modern Devletler Hukuku', 'Osmanlı-Habsburg ve Osmanlı-Safevi Mücadeleleri', 'Karlofça ve Küçük Kaynarca Antlaşmaları'],
        learningOutcomes: ['TAR.11.1.1. XVII ve XVIII. yüzyıllarda değişen uluslararası dengeleri Osmanlı dış politikası bağlamında analiz edebilme'],
        skills: ['Neden-Sonuç İlişkisi', 'Tarihsel Harita Analizi'],
        values: ['Milli Bilinç', 'Sabır', 'Diplomasi ve Barış'],
        suggestedActivities: 'Karlofça Antlaşması öncesi ve sonrası Osmanlı sınırlarının haritada karşılaştırılması.',
        evaluationMethods: ['Harita Analiz Rubriği']
      },
      {
        unitNumber: 2,
        title: 'Değişim Çağında Avrupa ve Osmanlı',
        suggestedWeeks: 8,
        topics: ['Rönesans, Reform ve Aydınlanma Düşüncesi', 'Merkantilizm ve Coğrafi Keşiflerin Ekonomik Etkisi', 'Osmanlı’da Celali İsyanları ve Islahat Hareketleri'],
        learningOutcomes: ['TAR.11.2.1. Avrupa’daki bilimsel ve düşünsel dönüşümün Osmanlı Devleti’ne yansımalarını değerlendirebilme'],
        skills: ['Değişim ve Süreklilik', 'Tarihsel Kanıt İnceleme'],
        values: ['Bilimsellik', 'Eleştirel Düşünme', 'Sorumluluk'],
        suggestedActivities: 'Matbaanın gelişi ve İbrahim Müteferrika risalesi üzerine münazara.',
        evaluationMethods: ['Münazara Değerlendirme Rubriği']
      },
      {
        unitNumber: 3,
        title: 'Uluslararası İlişkilerde Denge Stratejisi (1774-1914)',
        suggestedWeeks: 8,
        topics: ['Fransız İhtilali ve Milliyetçilik Akımı', 'Sanayi Devrimi ve Sömürgecilik Yarışı', 'Şark Meselesi ve Osmanlı Toprak Kayıpları'],
        learningOutcomes: ['TAR.11.3.1. Denge politikasının Osmanlı Devleti’nin bekasını sürdürmesindeki rolünü analiz edebilme'],
        skills: ['Çok Boyutlu Düşünme', 'Tarihsel Empati'],
        values: ['Vatanseverlik', 'Milli Birlik', 'Tarih Bilinci'],
        suggestedActivities: '93 Harbi ve Balkan göçleri üzerine görsel ve mektup analizi.',
        evaluationMethods: ['Görsel Belge İnceleme Ölçeği']
      },
      {
        unitNumber: 4,
        title: 'Devrimler Çağında Değişen Devlet-Toplum İlişkileri',
        suggestedWeeks: 8,
        topics: ['Tanzimat ve Islahat Fermanları', 'I. ve II. Meşrutiyet Dönemleri', 'Kanun-ı Esasi ve Parlamenter Yaşamın Başlangıcı'],
        learningOutcomes: ['TAR.11.4.1. Osmanlı Devleti’nde anayasal düzene geçiş adımlarını ve vatandaşlık kavramının gelişimini açıklayabilme'],
        skills: ['Kronolojik Düşünme', 'Tarihsel Metin Analizi'],
        values: ['Hukukun Üstünlüğü', 'Adalet', 'Eşitlik'],
        suggestedActivities: 'Tanzimat Fermanı metni üzerinden eşit vatandaşlık kavramı tartışması.',
        evaluationMethods: ['Metin İnceleme Değerlendirme Formu']
      }
    ]
  },
  12: {
    title: '12. Sınıf T.C. İnkılap Tarihi ve Atatürkçülük',
    units: [
      {
        unitNumber: 1,
        title: 'XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya',
        suggestedWeeks: 6,
        topics: ['Mustafa Kemal’in Hayatı, Fikir Dünyası ve Eğitimi', 'Trablusgarp ve Balkan Savaşları', 'I. Dünya Savaşı ve Osmanlı Cepheleri (Çanakkale, Kutü\'l-Amare vb.)'],
        learningOutcomes: ['İNK.12.1.1. Mustafa Kemal’in liderlik özelliklerinin oluşumundaki tarihi olayları analiz edebilme', 'İNK.12.1.2. Çanakkale Zaferi’nin milli mücadele ruhuna etkilerini değerlendirebilme'],
        skills: ['Tarihsel Empati', 'Kronolojik Düşünme', 'Kanıt Kullanma'],
        values: ['Vatanseverlik', 'Milli Birlik', 'Cesaret', 'Fedakârlık'],
        suggestedActivities: 'Çanakkale Şehitleri mektupları analizi ve hatırat okuma atölyesi.',
        evaluationMethods: ['Duygu ve Düşünce Günlüğü Rubriği', 'Açık Uçlu Soru Ölçeği']
      },
      {
        unitNumber: 2,
        title: 'Millî Mücadele (1919-1923)',
        suggestedWeeks: 10,
        topics: [
          'Mondros Mütarekesi ve İşgaller',
          'Kuvâ-yı Millîye ve Müdafaa-i Hukuk Cemiyetleri',
          'Genelgeler ve Kongreler Dönemi (Amasya, Erzurum, Sivas)',
          'Büyük Millet Meclisi’nin Açılışı ve Misakımillî',
          'Doğu, Güney ve Batı Cepheleri (İnönü, Sakarya, Büyük Taarruz)',
          'Mudanya Mütarekesi ve Lozan Barış Antlaşması'
        ],
        learningOutcomes: [
          'İNK.12.2.1. Millî Mücadele’nin hazırlık evresinde millet egemenliği ve bağımsızlık ilkesini analiz edebilme',
          'İNK.12.2.2. Muharebeler döneminde milletin topyekûn fedakârlığını (Tekâlif-i Milliye) değerlendirebilme',
          'İNK.12.2.3. Lozan Barış Antlaşması ile elde edilen siyasi ve hukuki kazanımları yorumlayabilme'
        ],
        skills: ['Tarihsel Düşünme', 'Harita Analizi', 'Tarihsel Sorgulama'],
        values: ['Vatanseverlik', 'Bağımsızlık Aşkı', 'Dayanışma', 'Adalet'],
        suggestedActivities: 'Amasya Genelgesi kararlarının milli egemenlik açısından münazarası; Tekalif-i Milliye panosu hazırlığı.',
        evaluationMethods: ['Performans Görevi Rubriği', 'Proje Değerlendirme Ölçeği']
      },
      {
        unitNumber: 3,
        title: 'Atatürkçülük ve Türk İnkılabı',
        suggestedWeeks: 8,
        topics: [
          'Cumhuriyetin İlanı ve Halifeliğin Kaldırılması',
          'Hukuk, Eğitim, Kültür ve Toplumsal Alanda İnkılaplar',
          'Ekonomi Alanında Gelişmeler (İzmir İktisat Kongresi, Fabrikalar)',
          'Atatürk İlkeleri (Cumhuriyetçilik, Milliyetçilik, Halkçılık, Devletçilik, Laiklik, İnkılapçılık)'
        ],
        learningOutcomes: [
          'İNK.12.3.1. Atatürk ilke ve inkılaplarının Türk milletinin çağdaşlaşmasındaki rolünü değerlendirebilme',
          'İNK.12.3.2. Hukuk ve eğitim inkılaplarının toplumsal eşitliğe katkılarını analiz edebilme'
        ],
        skills: ['Değişim ve Süreklilik', 'Tarihsel Eleştiri'],
        values: ['Çalışkanlık', 'Bilimsellik', 'Eşitlik', 'Milli Egemenlik'],
        suggestedActivities: 'Atatürk ilkelerinin güncel hayattaki karşılıklarını anlatan dijital bülten hazırlama.',
        evaluationMethods: ['Bülten Tasarımı Rubriği', 'Gözlem Formu']
      },
      {
        unitNumber: 4,
        title: 'İki Savaş Arasındaki Dönemde Türkiye ve Dünya',
        suggestedWeeks: 6,
        topics: ['Atatürk Dönemi Türk Dış Politikası (Balkan Antantı, Sadabat Paktı, Montrö, Hatay Meselesi)', '1929 Dünya Ekonomik Buhranı'],
        learningOutcomes: ['İNK.12.4.1. Atatürk’ün "Yurtta sulh, cihanda sulh" ilkesi doğrultusundaki diplomatik başarıları analiz edebilme'],
        skills: ['Diplomatik Metin Çözümleme', 'Kronolojik Düşünme'],
        values: ['Barışseverlik', 'Akılcılık', 'Liderlik'],
        suggestedActivities: 'Montrö Boğazlar Sözleşmesi maddelerinin Türkiye\'nin egemenliği açısından analizi.',
        evaluationMethods: ['Açık Uçlu Sınav Puanlama Anahtarı']
      }
    ]
  }
};

export const DEFAULT_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib-9-pdf',
    title: '9. Sınıf Tarih Ders Kitabı (MEB Resmi PDF)',
    category: 'DERS_KITABI',
    gradeLevel: 9,
    description: 'Türkiye Yüzyılı Maarif Modeline uygun 9. Sınıf Tarih resmi MEB ders kitabı tam metin PDF arşivi. Üniteler: Geçmişin İnşası ve Tarih, Kadim Dünyada İnsan ve Mekân, Avrasya Bozkırlarında Türk Dünyası, İslam Medeniyetinin Doğuşu.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/panel/upload/etkilesimli/kitap/tarih/9/index.html',
    content: '9. Sınıf Maarif Tarih Kitabı: Ünite 1 Tarih Öğrenmenin Faydaları, Tarihin Doğası, Tarihsel Bilginin Üretim Süreci, Dijitalleşme ve Tarih Yazımı. Kazanımlar: TAR.9.1.1, TAR.9.1.2, TAR.9.1.3, TAR.9.1.4. Beceriler: SBAB1, SBAB2, KB2.4. Değerler: D6 Dürüstlük, D19 Vatanseverlik.',
    tags: ['9. Sınıf', 'MEB', 'PDF', 'Maarif Modeli', 'Ders Kitabı'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-9-etkilesimli',
    title: '9. Sınıf Tarih Etkileşimli Ders Kitabı (OGM Materyal 3D)',
    category: 'MEBI_EBA_OGM',
    gradeLevel: 9,
    description: 'OGM Materyal 3D sanal müze, etkileşimli haritalar, sesli ve animasyonlu 9. sınıf tarih konuları.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    tags: ['9. Sınıf', 'Etkileşimli Kitap', 'OGM', '3D', 'Harita'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-10-pdf',
    title: '10. Sınıf Tarih Ders Kitabı (MEB Resmi PDF)',
    category: 'DERS_KITABI',
    gradeLevel: 10,
    description: 'Selçuklu Türkiyesi, Beylikten Devlete Osmanlı Siyaseti, Tımar ve Devşirme Sistemi, Klasik Çağ Osmanlı Toplum Düzeni ve Kültürü resmi ders kitabı PDF.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    content: '10. Sınıf Tarih Kitabı: Selçuklu Türkiyesi, Osmanlı Kuruluş Dönemi, Fetret Devri, Tımar Sistemi, Ahilik ve Loncalar, Divan-ı Hümayun, Fatih Kanunnameleri.',
    tags: ['10. Sınıf', 'MEB', 'PDF', 'Osmanlı', 'Selçuklu'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-10-etkilesimli',
    title: '10. Sınıf Tarih Etkileşimli Ders Kitabı (OGM Materyal)',
    category: 'MEBI_EBA_OGM',
    gradeLevel: 10,
    description: 'Osmanlı minyatürleri, fetih haritaları ve Topkapı Sarayı sanal turu içeren etkileşimli içerik.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    tags: ['10. Sınıf', 'Etkileşimli', 'OGM', 'Sanal Tur'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-11-pdf',
    title: '11. Sınıf Tarih Ders Kitabı (MEB Resmi PDF)',
    category: 'DERS_KITABI',
    gradeLevel: 11,
    description: 'Değişen Dünya Dengeleri Karşısında Osmanlı (1595-1774), Değişim Çağında Avrupa ve Osmanlı, Denge Stratejisi, Devrimler Çağında Toplum resmi ders kitabı PDF.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    content: '11. Sınıf Tarih Kitabı: Westphalia Barışı, Karlofça ve Küçük Kaynarca, Celali İsyanları, Tanzimat ve Islahat Fermanları, Kanun-ı Esasi ve Meşrutiyet.',
    tags: ['11. Sınıf', 'MEB', 'PDF', 'Denge Stratejisi', 'Tanzimat'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-11-etkilesimli',
    title: '11. Sınıf Tarih Etkileşimli Ders Kitabı (OGM Materyal)',
    category: 'MEBI_EBA_OGM',
    gradeLevel: 11,
    description: '17-19. yüzyıl diplomatik antlaşma metinleri, tarihi gazete arşivleri ve etkileşimli zaman çizelgesi.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    tags: ['11. Sınıf', 'Etkileşimli', 'Zaman Çizelgesi', 'OGM'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-12-pdf',
    title: '12. Sınıf T.C. İnkılap Tarihi ve Atatürkçülük (MEB Resmi PDF)',
    category: 'DERS_KITABI',
    gradeLevel: 12,
    description: 'XX. Yüzyıl Başlarında Osmanlı, Çanakkale Cephesi, Millî Mücadele (Genelgeler, Kongreler, Muharebeler, Lozan), Atatürkçülük ve Türk İnkılabı resmi ders kitabı PDF.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    content: '12. Sınıf İnkılap Tarihi: Mustafa Kemal’in Hayatı, I. Dünya Savaşı, Amasya Genelgesi, Sivas ve Erzurum Kongreleri, TBMM Açılışı, Lozan Barış Antlaşması, Atatürk İlkeleri.',
    tags: ['12. Sınıf', 'MEB', 'PDF', 'İnkılap Tarihi', 'Atatürk'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-12-etkilesimli',
    title: '12. Sınıf T.C. İnkılap Tarihi Etkileşimli Kitap (OGM Materyal)',
    category: 'MEBI_EBA_OGM',
    gradeLevel: 12,
    description: 'Kurtuluş Savaşı muharebe simülasyonları, Nutuk orijinal ses kayıtları ve harita animasyonları.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    tags: ['12. Sınıf', 'Etkileşimli', 'Kurtuluş Savaşı', 'Harita'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-kultur-pdf',
    title: 'Türk Kültür ve Medeniyeti Tarihi Ders Kitabı (MEB Resmi PDF)',
    category: 'DERS_KITABI',
    gradeLevel: 'Tümü',
    description: 'Türk devlet teşkilatı, hukuk yapısı, ordu, toplum, ekonomi, bilim ve sanat birikimini inceleyen seçmeli ve ileri düzey ders kitabı.',
    linkUrl: 'https://ogmmateryal.eba.gov.tr/kitaplik',
    tags: ['Seçmeli Tarih', 'Kültür ve Medeniyet', 'MEB', 'PDF'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-mebi-portal',
    title: 'MEBİ (Bireysel Öğrenme Platformu) Tarih Modülü',
    category: 'MEBI_EBA_OGM',
    gradeLevel: 'Tümü',
    description: 'MEB tarafından geliştirilen, yapay zekâ destekli kişiselleştirilmiş Tarih soru bankaları, konu anlatım videoları ve deneme sınavları.',
    linkUrl: 'https://mebi.eba.gov.tr',
    tags: ['MEBİ', 'YKS', 'Etkileşimli', 'Soru Bankası'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-eba-portal',
    title: 'EBA Tarih Portalı ve Dijital Arşivi',
    category: 'MEBI_EBA_OGM',
    gradeLevel: 'Tümü',
    description: 'Tarih dersleri için MEB EBA video dersleri, belgeseller, etkileşimli simülasyonlar ve tarihi belgeler.',
    linkUrl: 'https://www.eba.gov.tr',
    tags: ['EBA', 'Belgesel', 'Video Ders', 'Arşiv'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-yonetmelik-ortaogretim',
    title: 'MEB Ortaöğretim Kurumları Yönetmeliği (Resmi Gazete)',
    category: 'YONETMELIK',
    gradeLevel: 'Tümü',
    description: 'Ders planları, ortak sınav tarihleri, zümre toplantıları, e-Okul not giriş süreleri ve öğretmen görev sorumlulukları.',
    linkUrl: 'https://ogm.meb.gov.tr/meb_iys_dosyalar/2023_09/08170940_ortaogretim_kurumlari_yonetmeligi.pdf',
    tags: ['Yönetmelik', 'Mevzuat', 'Sınavlar', 'Zümre'],
    dateAdded: '2024-09-01'
  },
  {
    id: 'lib-yonetmelik-maarif',
    title: 'Türkiye Yüzyılı Maarif Modeli Öğretim Programı Genel Esasları',
    category: 'YONETMELIK',
    gradeLevel: 'Tümü',
    description: 'Erdem-Değer-Eylem Çerçevesi (D), Beceriler Haritası (SBAB, KB, SDB, OB), Süreç Odaklı Ölçme ve Farklılaştırma Esasları.',
    linkUrl: 'https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=1240',
    tags: ['Maarif Modeli', 'Program', 'Değerler', 'Beceriler'],
    dateAdded: '2024-09-01'
  }
];

export const DEFAULT_EVALUATION_SCALES: EvaluationScale[] = [
  {
    id: 'scale-1',
    title: 'Tarihsel Düşünme ve Kanıt İnceleme Rubriği',
    gradeLevel: 'Tümü',
    type: 'RUBRIK',
    purpose: 'Öğrencinin tarihi bir belge veya kanıt üzerinden çıkarım yapma ve sorgulama düzeyini ölçme.',
    criteria: [
      {
        dimension: 'Kaynağı Tanımlama ve Güvenilirlik',
        description: 'Kaynağın yazarını, dönemini ve türünü doğru belirleyip tarafsızlığını sorgular.',
        maxScore: 25
      },
      {
        dimension: 'Tarihsel Bağlamı Kavrama',
        description: 'Olayı gerçekleştiği dönemin şartları, inançları ve zihniyetiyle ilişkilendirir.',
        maxScore: 25
      },
      {
        dimension: 'Neden-Sonuç ve Süreklilik İlişkisi',
        description: 'Tarihi olgunun öncesi ve sonrasındaki değişim/süreklilik bağlantılarını kanıtlarla açıklar.',
        maxScore: 25
      },
      {
        dimension: 'Argüman ve Dil Kullanımı',
        description: 'Düşüncelerini tarih terimlerini yerinde kullanarak mantıksal bir sıra ile ifade eder.',
        maxScore: 25
      }
    ],
    instructions: 'Her ölçüt 0-25 puan arasında puanlanır. Toplam 100 tam puan üzerinden notlandırılır.'
  },
  {
    id: 'scale-2',
    title: 'Maarif Modeli Ders İçi Gözlem ve Süreç Formu',
    gradeLevel: 'Tümü',
    type: 'GOZLEM_FORMU',
    purpose: 'Öğrencinin ders sürecinde erdem, değer ve beceri kazanımlarındaki gelişimini gözlemleme.',
    criteria: [
      {
        dimension: 'Erdem ve Değerlere Saygı (Adalet/Hoşgörü)',
        description: 'Farklı görüşlere saygı duyar, sınıf içi tartışmalarda adil ve yapıcı davranır.',
        maxScore: 20
      },
      {
        dimension: 'Sorumluluk ve Görev Bilinci',
        description: 'Bireysel ve grup çalışmalarına zamanında ve eksiksiz katkı sunar.',
        maxScore: 20
      },
      {
        dimension: 'Tarihsel Merak ve Araştırma İstemi',
        description: 'Ders kitapları, EBA ve MEBİ kaynaklarını araştırarak soru sorma isteği gösterir.',
        maxScore: 20
      },
      {
        dimension: 'Tarihsel Empati Yetisi',
        description: 'Geçmişteki aktörlerin kararlarını bugünün değerleriyle değil o günün koşullarıyla tartar.',
        maxScore: 20
      },
      {
        dimension: 'İş Birliği ve Dayanışma',
        description: 'Arkadaşlarıyla bilgiyi paylaşır, grup ödevlerinde dayanışma ruhuyla hareket eder.',
        maxScore: 20
      }
    ],
    instructions: 'Ders öğretmeni tarafından haftalık veya aylık periyotlarla doldurulur.'
  },
  {
    id: 'scale-3',
    title: 'Öğrenci Tarihsel Beceri Öz Değerlendirme Çizelgesi',
    gradeLevel: 'Tümü',
    type: 'OZ_DEGERLENDIRME',
    purpose: 'Öğrencinin kendi öğrenme sürecini ve tarihsel kavrayışını değerlendirmesi.',
    criteria: [
      {
        dimension: 'Tarihsel Kronolojiyi Takip Edebilme',
        description: 'İşlenen ünitedeki olayların sıralamasını zihnimde canlandırabiliyorum.',
        maxScore: 25
      },
      {
        dimension: 'Harita ve Mekânı Anlama',
        description: 'Tarihi olayların geçtiği coğrafyayı harita üzerinde gösterebiliyorum.',
        maxScore: 25
      },
      {
        dimension: 'Tarihsel Değerleri Özümseme',
        description: 'Milletimizin kültürel mirasını ve değerlerini kavramanın önemini anlıyorum.',
        maxScore: 25
      },
      {
        dimension: 'Kendi Öğrenmemi Yönetebilme',
        description: 'EBA ve MEBİ üzerinden eksik olduğum konuları kendim telafi edebiliyorum.',
        maxScore: 25
      }
    ],
    instructions: 'Öğrenci her boyutu 1-4 puan (Geliştirilmeli - Çok İyi) aralığında kendisi işaretler.'
  }
];

export const DEFAULT_MEB_REMINDERS: MebCalendarReminder[] = [
  {
    id: 'rem-1',
    title: 'Sene Başı Zümre Öğretmenler Kurulu',
    dateStr: 'Eylül Ayı Başı',
    category: 'ZUMRE',
    description: 'Yıllık planların onaylanması, Maarif modeline uygun kazanım ve ölçme yöntemlerinin karara bağlanması.',
    actionRequired: 'Zümre karar tutanağı hazırlanmalı ve okul müdürlüğüne teslim edilmelidir.',
    isUrgent: false
  },
  {
    id: 'rem-2',
    title: '1. Dönem 1. Ortak Yazılı Sınav Haftası',
    dateStr: 'Ekim Sonu - Kasım Başı',
    category: 'SINAV',
    description: 'MEB ve İl geneli ortak sınav konu soru dağılım tablolarına göre açık uçlu sınavların uygulanması.',
    actionRequired: 'Açık uçlu sınav soruları ve dereceli puanlama anahtarı (rubrik) hazırlanmalıdır.',
    isUrgent: true
  },
  {
    id: 'rem-3',
    title: '1. Dönem Ara Tatil Öğretmen Semineri',
    dateStr: 'Kasım 2. Hafta',
    category: 'TATIL',
    description: 'Maarif Modeli mesleki çalışma seminerleri ve 1. çeyrek kazanım değerlendirmeleri.',
    actionRequired: 'ÖBA seminer videolarının tamamlanması ve ders izleme raporunun yazılması.',
    isUrgent: false
  },
  {
    id: 'rem-4',
    title: '1. Dönem e-Okul Not ve Ölçek Girişi',
    dateStr: 'Ocak Ayı',
    category: 'E_OKUL',
    description: 'Ders etkinliklerine katılım, performans ve proje ölçek puanlarının e-Okul sistemine girilmesi.',
    actionRequired: 'Gözlem formları ve rubrik puanları e-Okul sistemine işlenmeli, çıktı alınıp imzalanmalıdır.',
    isUrgent: true
  },
  {
    id: 'rem-5',
    title: '2. Dönem Başı Zümre ve Yıllık Plan Revizyonu',
    dateStr: 'Şubat Başı',
    category: 'ZUMRE',
    description: '1. Dönem başarı analizi ve 2. Dönem planlarının gözden geçirilmesi.',
    actionRequired: '2. Dönem zümre tutanağı düzenlenmelidir.',
    isUrgent: false
  },
  {
    id: 'rem-6',
    title: 'Sosyal Kulüp Yıl Sonu Raporları ve Portfolyo',
    dateStr: 'Mayıs Sonu - Haziran Başı',
    category: 'KULUP',
    description: 'Öğrenci sosyal etkinlik modülü veri girişleri ve kulüp yıl sonu faaliyet raporunun hazırlanması.',
    actionRequired: 'e-Okul Sosyal Etkinlik Modülüne faaliyetlerin işlenmesi gerekmektedir.',
    isUrgent: false
  }
];
