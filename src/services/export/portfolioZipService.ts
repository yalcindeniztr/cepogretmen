import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AppSettings, DepartmentMinutesItem } from '../../core/types';
import { DocxExportService } from './docxExportService';
import { buildFullTwoTermYearlyPlan } from '../../core/constants/twoTermPlanDefaults';

export class PortfolioZipService {
  /**
   * Generates a complete, official MEB Department Portfolio (Zümre Dosyası)
   * containing all annual plans (9, 10, 11, 12), department meeting minutes,
   * school-based and social activities, and the official submission cover letter.
   */
  static async exportFullPortfolioZip(
    settings: AppSettings,
    academicYear: string = '2024-2025',
    onProgress?: (status: string) => void
  ): Promise<void> {
    const zip = new JSZip();

    onProgress?.('00_Dizi Pusulası ve Teslim Üst Yazısı hazırlanıyor...');
    const coverBlob = await DocxExportService.generateCoverLetterBlob(settings, academicYear);
    zip.file('00_Tarih_Zumre_Evraklari_Dizi_Pusulasi_ve_Teslim_Tutanagi.docx', coverBlob);

    // 1. Dönem Başı Zümre Tutanağı (12 Gündem Maddesi)
    onProgress?.('01_1. Dönem Başı Zümre Karar Tutanağı hazırlanıyor...');
    const minutesItem1: DepartmentMinutesItem = {
      id: 'minutes-term-1',
      academicYear,
      meetingType: 'DÖNEM_BASI_1',
      title: '1. Dönem Başı Tarih Zümre Öğretmenler Kurulu Toplantısı',
      meetingDate: '09 Eylül 2024',
      meetingPlace: 'Tarih Zümre Odası / Kütüphane',
      agendaItems: [
        'Açılış, yoklama ve zümre başkanı seçimi.',
        'Bir önceki eğitim öğretim yılı zümre kararlarının incelenmesi ve değerlendirilmesi.',
        'Türkiye Yüzyılı Maarif Modeli Tarih Dersi Öğretim Programı (9. Sınıf) ile mevcut müfredatın (10, 11, 12. Sınıflar) incelenmesi.',
        'Yıllık ve günlük ders planlarının MEB çalışma takvimine göre hazırlanması ve onay süreçleri.',
        'Ölçme ve değerlendirme esasları: MEB Ortak Yazılı Sınavlar, açık uçlu ve bağlamlı soru hazırlama ilkeleri.',
        'Soru ve Kazanım Analiz Formlarının uygulanması ve telafi eğitim planlarının oluşturulması.',
        'Bireyselleştirilmiş Eğitim Programı (BEP) kapsamındaki öğrencilere yönelik sınav ve uyarlamalar.',
        'Öğrencilere verilecek performans görevleri ve proje konularının tespiti, dereceli puanlama anahtarlarının (rubrik) belirlenmesi.',
        'Ders araç-gereçleri, EBA, MEBİ ve Tarih ders kitaplarının etkin kullanımı; okul kütüphanesinden yararlanma.',
        'Diğer zümre öğretmenleriyle (Coğrafya, Edebiyat, Felsefe) yapılacak iş birliği esasları.',
        'Milli, manevi değerler (Erdem-Değer-Eylem) ve Atatürkçülük konularının derslere aktarılması.',
        'Dilek ve temenniler, kapanış.'
      ],
      decisions: [
        `Toplantı Zümre Başkanı ${settings.teacherName} başkanlığında açıldı.`,
        '9. sınıflarda Türkiye Yüzyılı Maarif Modeli çerçevesinde beceri ve süreç odaklı planlamalar eksiksiz uygulanacaktır.',
        'Tüm yazılı sınavların MEB Ölçme ve Değerlendirme Yönetmeliği gereği açık uçlu, bağlamlı ve 100 puan üzerinden 10 soruluk analitik rubriklerle yapılması kararlaştırıldı.',
        'Sınav bitiminde 10 gün içinde her şube için Soru ve Kazanım Başarı Analizi çıkarılarak %50 altında kalan kazanımlar için telafi planı uygulanacaktır.',
        'Kaynaştırma/BEP öğrencileri için basitleştirilmiş bağlamlı ve 25 er puanlık 4 soruluk BEP sınavları hazırlanacaktır.',
        'Her dönem için 9, 10, 11 ve 12. sınıflarda 5 ölçütlü (100 tam puan) analitik rubriğe sahip birer performans görevi verilecektir.',
        'Derslerde EBA 3D Sanal Müze ve MEBİ platformundaki tarihsel kaynaklar etkin olarak kullanılacaktır.',
        'Tarihsel coğrafya ve edebi metin incelemeleri için Coğrafya ve Türk Dili ve Edebiyatı zümreleriyle ortak takvim belirlenecektir.'
      ],
      attendees: [
        { name: settings.teacherName, title: 'Tarih Dersi Öğretmeni / Zümre Başkanı' }
      ],
      principalName: settings.principalName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const minutesBlob1 = await DocxExportService.generateDepartmentMinutesBlob(minutesItem1, settings);
    zip.file('01_Tarih_Zumre_Ogretmenler_Kurulu_Tutanagi_1_Donem.docx', minutesBlob1);

    // 2. Dönem Başı Zümre Tutanağı
    onProgress?.('02_2. Dönem Başı Zümre Karar Tutanağı hazırlanıyor...');
    const minutesItem2: DepartmentMinutesItem = {
      ...minutesItem1,
      id: 'minutes-term-2',
      meetingType: 'DÖNEM_BASI_2',
      title: '2. Dönem Başı Tarih Zümre Öğretmenler Kurulu Toplantısı',
      meetingDate: '03 Şubat 2025',
      agendaItems: [
        'Açılış ve 1. Dönem zümre kararlarının uygulama sonuçlarının gözden geçirilmesi.',
        '1. Dönem şube başarı durumlarının, sınav analizlerinin ve ders başarı yüzdelerinin değerlendirilmesi.',
        '2. Dönem ünitelendirilmiş yıllık planların güncellenmesi ve çalışma takvimine uyumu.',
        '2. Dönem ortak yazılı sınav tarihleri, senaryoları ve açık uçlu soru dağılımlarının tespiti.',
        'Başarısı düşük öğrenciler ve BEP kapsamındaki öğrencilerin 1. dönem gelişimlerinin incelenmesi.',
        '2. Dönem performans görevleri ve proje değerlendirme takviminin belirlenmesi.',
        'Sosyal etkinlikler ve Okul Temelli Planlama çalışmalarının planlanması ve yürütülmesi.',
        'Kütüphane kullanımı, MEBİ ve EBA içeriklerinin 2. dönem derslerine entegrasyonu.',
        'Dilek, temenniler ve kapanış.'
      ]
    };
    const minutesBlob2 = await DocxExportService.generateDepartmentMinutesBlob(minutesItem2, settings);
    zip.file('02_Tarih_Zumre_Ogretmenler_Kurulu_Tutanagi_2_Donem.docx', minutesBlob2);

    // 9, 10, 11, 12. Sınıf 2 Dönemli Yıllık Planlar
    const grades: Array<{ grade: 9 | 10 | 11 | 12; hours: number; label: string }> = [
      { grade: 9, hours: 2, label: '03_Tarih_9_Sinif_Maarif_Yillik_Plani_2Donemli.docx' },
      { grade: 10, hours: 2, label: '04_Tarih_10_Sinif_Yillik_Plani_2Donemli.docx' },
      { grade: 11, hours: 2, label: '05_Tarih_11_Sinif_Yillik_Plani_2Donemli.docx' },
      { grade: 12, hours: 2, label: '06_Tarih_12_Sinif_Inkilap_Tarihi_Yillik_Plani_2Donemli.docx' }
    ];

    for (const g of grades) {
      onProgress?.(`${g.grade}. Sınıf 2 Dönemli Yıllık Planı hazırlanıyor...`);
      const plan = buildFullTwoTermYearlyPlan(academicYear, g.grade, g.hours, settings);
      const planBlob = await DocxExportService.generateFullTwoTermYearlyPlanBlob(plan, settings);
      zip.file(g.label, planBlob);
    }

    onProgress?.('Arşiv sıkıştırılıyor ve indiriliyor...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const cleanSchool = settings.schoolName.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ_]/g, '_');
    const zipFileName = `${cleanSchool}_Tarih_Zumre_Paketi_${academicYear.replace('/', '_')}.zip`;
    saveAs(zipBlob, zipFileName);
  }
}
