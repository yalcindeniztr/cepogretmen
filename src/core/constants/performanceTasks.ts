import { PerformanceTaskItem } from '../types';

export const DEFAULT_PERFORMANCE_TASKS: PerformanceTaskItem[] = [
  {
    id: 'perf-task-9-1',
    title: 'Kadeş Antlaşması Metin Analizi ve Diplomatik Protokol İncelemesi',
    gradeLevel: 9,
    themeUnit: 'TAR.9.1. Geçmişin İnşa Sürecinde Tarih & Kadim Dünyada İnsan ve Mekân',
    academicYear: '2024-2025',
    term: '1. Dönem',
    objective: 'İlk Çağ\'ın ilk yazılı barış antlaşması olan Kadeş Antlaşması metnini tarihsel kanıt ve diplomasi ilkeleri bağlamında inceleyerek eşitlik ve adalet değerlerini yorumlayabilme.',
    description: 'Öğrenci, Hitit kralı III. Hattuşili ile Mısır firavunu II. Ramses arasında MÖ 1280 civarında imzalanan Kadeş Antlaşması\'nın kil tablet kopyasını (İstanbul Arkeoloji Müzeleri) inceler.',
    steps: [
      'İstanbul Arkeoloji Müzeleri ve EBA 3D Sanal Müze arşivinden Kadeş Barış Tableti görselini ve Türkçe tercümesini temin ediniz.',
      'Antlaşma maddelerini tahlil ederek Hitit ve Mısır taraflarının birbirine hitap şeklindeki diplomatik eşitlik vurgusunu tespit ediniz.',
      'Antlaşmada yer alan "Saldırmazlık", "Savunma İttifakı" ve "Siyasi Sığınmacıların İadesi" maddelerini 3 ayrı başlık altında özetleyiniz.',
      'Antlaşmanın günümüz uluslararası hukuku ve Birleşmiş Milletler felsefesiyle benzerliklerini bir değerlendirme paragrafı halinde yazınız.'
    ],
    submissionFormat: 'A4 formatında araştırma raporu (Kapak + Metin Çözümlemesi + Kaynakça) veya 3D Dijital İnfografik Poster.',
    deadlineWeeks: 3,
    rubricCriteria: [
      { title: 'Tarihsel Belge ve Kaynak Analizi', points: 20, description: 'Birinci elden kaynak olan Kadeş tabletinin özelliklerini, yazıldığı dili ve bağlamını doğru tespit etme.' },
      { title: 'Diplomatik Eşitlik ve Hukuki Yorumlama', points: 20, description: 'Maddelerin iki eşit güç arasında imzalandığını ve karşılıklılık (mütekabiliyet) ilkesini gerekçelendirme.' },
      { title: 'Maarif Değerleri ve Barış Kültürü', points: 20, description: 'D1. Adalet ve D4. Dayanışma değerlerini savaş yerine barış masasında çözüm arama kültürüyle bağlama.' },
      { title: 'Bilimsel Dil ve Tarih Terminolojisi', points: 20, description: 'Mütekabiliyet, ittifak, pakt, ferman gibi terimleri yerinde ve hatasız kullanma.' },
      { title: 'Zamanlama, Sayfa Düzeni ve Kaynakça', points: 20, description: 'Görevi süresi içinde teslim etme, MEB kaynakçasını ve dipnotları usulüne uygun belirtme.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'perf-task-10-1',
    title: 'Divan-ı Hümayun ve Osmanlı Devlet Yönetimi Karar Alma Simülasyonu',
    gradeLevel: 10,
    themeUnit: 'TAR.10.2. Klasik Çağda Osmanlı Devlet Teşkilatı',
    academicYear: '2024-2025',
    term: '1. Dönem',
    objective: 'Klasik dönem Osmanlı Divan teşkilatının unsurlarını (Seyfiye, İlmiye, Kalemiye) ve devlet yönetimindeki istişare kültürünü modelleyebilme.',
    description: 'Öğrenci, Kanuni Sultan Süleyman döneminde gerçekleşen örnek bir sınır meselesi veya vergi düzenlemesi vakasını ele alarak Divan-ı Hümayun üyelerinin görüşlerini canlandıran bir dosya hazırlar.',
    steps: [
      'Seyfiye (Sadrazam, Kaptan-ı Derya), İlmiye (Şeyhülislam, Kazasker) ve Kalemiye (Nişancı, Defterdar) sınıflarının görev alanlarını araştırınız.',
      'Örnek bir tarihi olay seçiniz (Örn: Rodos Seferi hazırlıkları veya Akdeniz ticaret güvenliği kararı).',
      'Her divan üyesinin kendi uzmanlık alanından konuya ilişkin sunacağı öneri metnini yazınız.',
      'Padişaha sunulan "Telhis" belgesi formatında nihai karar özetini hazırlayınız.'
    ],
    submissionFormat: 'Osmanlı divan beratı / telhis biçiminde tasarlanmış vaka analiz dosyası.',
    deadlineWeeks: 4,
    rubricCriteria: [
      { title: 'Yönetim Sınıflarının Doğru Temsili', points: 20, description: 'Seyfiye, İlmiye ve Kalemiye yetkililerinin yetki ve sorumluluk sınırlarını doğru yansıtma.' },
      { title: 'İstişare ve Devlet Aklı Değerlendirmesi', points: 20, description: 'Ortak akıl ve meşveret kültürünün devlete sağladığı istikrarı temellendirme.' },
      { title: 'Tarihsel Empati ve Rol Canlandırma', points: 20, description: 'Dönemin zihniyetini, adalet anlayışını ve padişah-divan ilişkisini gerçekçi ifade etme.' },
      { title: 'Kavram ve Terminoloji Zenginliği', points: 20, description: 'Mühimme, telhis, hatt-ı hümayun, fetva, arz gibi idari terimleri doğru kullanma.' },
      { title: 'Raporlama Kalitesi ve Zamanında Teslim', points: 20, description: 'Düzenli dosyalama, görsel zenginlik ve teslim takvimine tam uyum.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'perf-task-11-1',
    title: 'Sanayi İnkılabı ve Osmanlı Lonca Teşkilatının Dönüşümü Araştırması',
    gradeLevel: 11,
    themeUnit: 'TAR.11.3. Uluslararası İlişkilerde Denge Stratejisi & Modernleşen Osmanlı',
    academicYear: '2024-2025',
    term: '1. Dönem',
    objective: 'Avrupa\'da yaşanan Sanayi Devrimi ve 1838 Balta Limanı Ticaret Antlaşması\'nın Osmanlı esnaf ve üretim yapısına etkilerini neden-sonuç ekseninde tahlil edebilme.',
    description: 'Öğrenci, geleneksel ahilik/lonca sistemi ile seri fabrikasyon üretimi karşılaştırarak yerli üretimin korunması ve modern sanayiye geçiş çabalarını irdeler.',
    steps: [
      'Geleneksel lonca üretiminin "Gedik", "Narh" ve "Usta-Çırak" ilişkilerini açıklayınız.',
      'Sanayi İnkılabı sonrası Osmanlı pazarına giren ucuz ithal fabrika mallarının yerli esnaf üzerindeki etkilerini inceleyiniz.',
      'Islah-ı Sanayi Komisyonu\'nun kuruluş amacını ve şirketeşme çabalarını değerlendiriniz.',
      'Girişimcilik ve ekonomik bağımsızlık bilinci üzerine çıkarımlarınızı özetleyiniz.'
    ],
    submissionFormat: 'Karşılaştırmalı analiz tablosu ve çözüm raporu.',
    deadlineWeeks: 3,
    rubricCriteria: [
      { title: 'Ekonomik Neden-Sonuç İlişkisi Kurma', points: 20, description: 'Fabrika üretimi ile yerli el tezgahlarının rekabet edemeyiş sebeplerini tam açıklama.' },
      { title: 'Lonca Teşkilatı ve Ahilik Kültürü Bilgisi', points: 20, description: 'Gedik, narh ve esnaf dayanışması kurallarını doğru tanımlama.' },
      { title: 'D3. Bilimsellik ve D18. Sorumluluk Değerleri', points: 20, description: 'Milli iktisat ve teknolojik yeniliklerin gerekliliğini ekonomik kalkınmayla bağlama.' },
      { title: 'Veri, Grafik ve İstatistik Kullanımı', points: 20, description: '19. yüzyıl Osmanlı dış ticaret dengesine dair verileri raporda etkili kullanma.' },
      { title: 'Araştırma Derinliği ve Rapor Düzeni', points: 20, description: 'Farklı akademik ve MEB kaynaklarından yararlanma ve düzenli teslim.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'perf-task-12-1',
    title: 'Milli Mücadele Döneminde Yerel Kongreler ve Müdafaa-i Hukuk Ruhu',
    gradeLevel: 12,
    themeUnit: 'TAR.12.2. Milli Mücadele ve Kurtuluş Savaşı',
    academicYear: '2024-2025',
    term: '1. Dönem',
    objective: 'Mondros Mütarekesi sonrası halkın bağımsızlık refleksini, yerel cemiyetlerin ve kongrelerin bölgesel direnişten ulusal birliğe evrilme sürecini sentezleyebilme.',
    description: 'Öğrenci, Trabzon Muhafaza-i Hukuk, Erzurum Kongresi veya yerel bölgesel cemiyetlerin (Ballıca/Karadeniz bölgesi dahil) bağımsızlık mücadelesindeki rolünü bir araştırma monografisi olarak hazırlar.',
    steps: [
      'Mondros Mütarekesi\'nin 7. ve 24. maddelerinin oluşturduğu işgal tehdidini harita üzerinde gösteriniz.',
      'Bölgede kurulan Müdafaa-i Hukuk Cemiyetleri\'nin yayınladığı beyannameleri ve aldıkları tedbirleri araştırınız.',
      'Mustafa Kemal Paşa\'nın yerel direnişleri Erzurum ve Sivas kongrelerinde tek çatı altında birleştirme stratejisini açıklayınız.',
      'Milli egemenlik ve vatanın bölünmez bütünlüğü ilkesini vurgulayan sonuç paragrafı yazınız.'
    ],
    submissionFormat: 'Tarihsel araştırma monografisi veya belgesel sunumu.',
    deadlineWeeks: 4,
    rubricCriteria: [
      { title: 'Tarihsel Süreç ve Kronolojiye Hakimiyet', points: 20, description: 'Amasya Genelgesi\'nden Misak-ı Milli\'ye uzanan hattı kronolojik sırayla işleme.' },
      { title: 'Yerel ve Ulusal Birlik Analizi', points: 20, description: 'Bölgesel direnişin milli bir ordu ve meclise dönüşüm sürecini sentezleme.' },
      { title: 'D19. Vatanseverlik ve D4. Dayanışma Değerleri', points: 20, description: 'Kuvâ-yı Milliye ruhunu ve milletin fedakarlıklarını saygıyla yansıtma.' },
      { title: 'Nutuk ve Birinci Elden Belgelerden Alıntı', points: 20, description: 'Mustafa Kemal Atatürk\'ün Nutuk eserinden ve telgraflardan uygun alıntılar yapma.' },
      { title: 'Akademik Özen, Özgünlük ve Sunum', points: 20, description: 'Kopya içerikten uzak, özgün yorumlar içeren ve zamanında teslim edilen çalışma.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
