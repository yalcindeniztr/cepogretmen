import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Download,
  Calendar,
  Plus,
  Trash2,
  X,
  Building,
  Award,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AppSettings, DepartmentMinutesItem } from '../../core/types';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { DocxExportService } from '../../services/export/docxExportService';

interface DepartmentMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

const DEFAULT_AGENDAS: Record<'DÖNEM_BASI_1' | 'DÖNEM_BASI_2' | 'DÖNEM_SONU', { title: string; agenda: string[]; decisions: string[] }> = {
  DÖNEM_BASI_1: {
    title: '1. Dönem Başı Tarih Zümre Öğretmenler Kurulu Toplantısı',
    agenda: [
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
      'Toplantı Zümre Başkanı Yalçın DENİZ başkanlığında açıldı.',
      '9. sınıflarda Türkiye Yüzyılı Maarif Modeli çerçevesinde beceri ve süreç odaklı planlamalar eksiksiz uygulanacaktır.',
      'Tüm yazılı sınavların MEB Ölçme ve Değerlendirme Yönetmeliği gereği açık uçlu, bağlamlı ve 100 puan üzerinden 10 soruluk analitik rubriklerle yapılması kararlaştırıldı.',
      'Sınav bitiminde 10 gün içinde her şube için Soru ve Kazanım Başarı Analizi çıkarılarak %50 altında kalan kazanımlar için telafi planı uygulanacaktır.',
      'Kaynaştırma/BEP öğrencileri için 4 soruluk, basitleştirilmiş bağlamlı ve 25 er puanlık BEP sınavları hazırlanacaktır.',
      'Her dönem için 9, 10, 11 ve 12. sınıflarda 5 ölçütlü (100 tam puan) analitik rubriğe sahip birer performans görevi verilecektir.',
      'Derslerde EBA 3D Sanal Müze ve MEBİ platformundaki tarihsel kaynaklar etkin olarak kullanılacaktır.',
      'Tarihsel coğrafya ve edebi metin incelemeleri için Coğrafya ve Türk Dili ve Edebiyatı zümreleriyle ortak takvim belirlenecektir.'
    ]
  },
  DÖNEM_BASI_2: {
    title: '2. Dönem Başı Tarih Zümre Öğretmenler Kurulu Toplantısı',
    agenda: [
      'Açılış ve 1. Dönem zümre kararlarının uygulama sonuçlarının gözden geçirilmesi.',
      '1. Dönem şube başarı durumlarının, sınav analizlerinin ve ders başarı yüzdelerinin değerlendirilmesi.',
      '2. Dönem ünitelendirilmiş yıllık planların güncellenmesi ve çalışma takvimine uyumu.',
      '2. Dönem ortak yazılı sınav tarihleri, senaryoları ve açık uçlu soru dağılımlarının tespiti.',
      'Başarısı düşük öğrenciler ve BEP kapsamındaki öğrencilerin 1. dönem gelişimlerinin incelenmesi.',
      'Performans görevlerinin teslimi, dereceli puanlama anahtarı ile değerlendirilmesi ve e-Okul sisteme girişi.',
      'Okul kütüphanesinde tarihsel araştırma etkinliklerinin artırılması ve yerel tarih gezileri.',
      'Dilek ve temenniler.'
    ],
    decisions: [
      '1. Dönem hedeflerine büyük oranda ulaşıldığı, Soru ve Kazanım Analizleri sonucunda eksik görülen konularda yapılan telafi derslerinin olumlu sonuç verdiği tespit edildi.',
      '2. Dönem ortak yazılı sınavlarının MEB konu soru dağılım tablolarına uygun olarak hazırlanması kararlaştırıldı.',
      'BEP li öğrencilerin başarı durumlarının BEP Geliştirme Birimi ile koordineli olarak izlenmesine devam edilecektir.',
      '2. Dönem performans görevlerinin Nisan ayı son haftasında toplanıp rubrik ile puanlanması kararlaştırıldı.'
    ]
  },
  DÖNEM_SONU: {
    title: 'Ders Yılı Sonu (Sene Sonu) Tarih Zümre Öğretmenler Kurulu Toplantısı',
    agenda: [
      'Açılış ve yoklama.',
      'Eğitim öğretim yılı boyunca alınan zümre kararlarının uygulanma düzeyinin değerlendirilmesi.',
      '9, 10, 11 ve 12. Sınıf Tarih dersi yıllık planlarının müfredat tamamlama durumlarının kontrolü.',
      'Yıl boyunca yapılan açık uçlu sınavların, telafi eğitimlerinin ve başarı analizlerinin genel raporu.',
      'Proje ve performans görevlerinin sonuçları ve öğrenci kazanımlarına katkısı.',
      'Tarih dersi araç-gereç ve kütüphane durumunun incelenmesi, gelecek yıla yönelik ihtiyaçların belirlenmesi.',
      'Türkiye Yüzyılı Maarif Modeli uygulamalarının ilk yıl değerlendirmesi ve gelecek öğretim yılı için öneriler.',
      'Kapanış.'
    ],
    decisions: [
      'Yıllık planlarda yer alan tüm ünite ve temaların zamanında ve başarıyla tamamlandığı tespit edildi.',
      'Tüm şubelerde sınav analizleri yapılarak okul idaresine teslim edilmiş ve öğrenci başarı ortalamasının hedeflenen düzeyde olduğu görüldü.',
      'Türkiye Yüzyılı Maarif Modeli nin öğrenci merkezli ve değer odaklı yapısının tarih bilincini artırdığı raporlandı.',
      'Gelecek öğretim yılı için okul kütüphanesine yeni tarih kaynakları ve belgesel arşivlerinin eklenmesi okul idaresine teklif edildi.'
    ]
  }
};

export const DepartmentMinutesModal: React.FC<DepartmentMinutesModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [meetingType, setMeetingType] = useState<'DÖNEM_BASI_1' | 'DÖNEM_BASI_2' | 'DÖNEM_SONU'>('DÖNEM_BASI_1');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [meetingDate, setMeetingDate] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('tr-TR');
  });
  const [meetingPlace, setMeetingPlace] = useState('Tarih Zümre Odası / Öğretmenler Odası');
  const [agendaItems, setAgendaItems] = useState<string[]>(DEFAULT_AGENDAS.DÖNEM_BASI_1.agenda);
  const [decisions, setDecisions] = useState<string[]>(DEFAULT_AGENDAS.DÖNEM_BASI_1.decisions);
  const [newAgenda, setNewAgenda] = useState('');
  const [newDecision, setNewDecision] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const config = DEFAULT_AGENDAS[meetingType];
    setAgendaItems(config.agenda);
    setDecisions(config.decisions);
  }, [meetingType]);

  if (!isOpen) return null;

  const handleAddAgenda = () => {
    if (!newAgenda.trim()) return;
    setAgendaItems([...agendaItems, newAgenda.trim()]);
    setNewAgenda('');
  };

  const handleRemoveAgenda = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const handleAddDecision = () => {
    if (!newDecision.trim()) return;
    setDecisions([...decisions, newDecision.trim()]);
    setNewDecision('');
  };

  const handleRemoveDecision = (index: number) => {
    setDecisions(decisions.filter((_, i) => i !== index));
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const minutesItem: DepartmentMinutesItem = {
        id: `minutes-${Date.now()}`,
        meetingType,
        title: DEFAULT_AGENDAS[meetingType].title,
        academicYear,
        meetingDate,
        meetingPlace,
        agendaItems,
        decisions,
        attendees: [
          { name: settings.teacherName, title: 'Tarih Dersi Öğretmeni / Zümre Başkanı' }
        ],
        principalName: settings.principalName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await DocxExportService.exportDepartmentMinutesToWord(minutesItem, settings);
    } catch (err) {
      console.error(err);
      alert('Tutanak indirilirken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-maarif-900 via-sky-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Users className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                MEB Mevzuatı & Maarif Modeli Uyumlu
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Tarih Zümre Öğretmenler Kurulu Tutanakları
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meeting Type Selector */}
        <div className="px-6 pt-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setMeetingType('DÖNEM_BASI_1')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              meetingType === 'DÖNEM_BASI_1'
                ? 'bg-white text-maarif-700 border-maarif-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            1. Dönem Başı Zümresi (Eylül)
          </button>
          <button
            onClick={() => setMeetingType('DÖNEM_BASI_2')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              meetingType === 'DÖNEM_BASI_2'
                ? 'bg-white text-maarif-700 border-maarif-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            2. Dönem Başı Zümresi (Şubat)
          </button>
          <button
            onClick={() => setMeetingType('DÖNEM_SONU')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${
              meetingType === 'DÖNEM_SONU'
                ? 'bg-white text-maarif-700 border-maarif-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            Sene Sonu Zümresi (Haziran)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Öğretim Yılı</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-maarif-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Toplantı Tarihi</label>
              <input
                type="text"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-maarif-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Toplantı Yeri</label>
              <input
                type="text"
                value={meetingPlace}
                onChange={(e) => setMeetingPlace(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-maarif-500"
              />
            </div>
          </div>

          {/* School & Authority Info Box */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-blue-900">{settings.schoolName}</div>
              <div className="text-blue-700 mt-0.5">
                Zümre Başkanı / Öğretmen: <strong>{settings.teacherName}</strong>
              </div>
            </div>
            <div className="text-right">
              <span className="text-blue-600 block text-[11px]">Onay Makamı:</span>
              <span className="font-bold text-blue-900">{settings.principalName} (Okul Müdürü)</span>
            </div>
          </div>

          {/* Agenda Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-maarif-600" />
                <span>Gündem Maddeleri ({agendaItems.length} Madde)</span>
              </h3>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {agendaItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-maarif-700 min-w-5">{idx + 1}.</span>
                    <span className="text-slate-800">{item}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAgenda(idx)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    title="Maddeyi Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAgenda}
                onChange={(e) => setNewAgenda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAgenda())}
                placeholder="Yeni gündem maddesi yazın..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500"
              />
              <button
                type="button"
                onClick={handleAddAgenda}
                className="px-3 py-2 text-xs font-bold text-maarif-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Ekle
              </button>
            </div>
          </div>

          {/* Decisions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Alınan Kararlar ({decisions.length} Karar)</span>
              </h3>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {decisions.map((dec, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-200/60 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700 min-w-16">Karar {idx + 1}:</span>
                    <span className="text-slate-800">{dec}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveDecision(idx)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    title="Kararı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDecision}
                onChange={(e) => setNewDecision(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDecision())}
                placeholder="Yeni karar yazın..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddDecision}
                className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const config = DEFAULT_AGENDAS[meetingType];
              setAgendaItems(config.agenda);
              setDecisions(config.decisions);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Varsayılan MEB Maddelerine Sıfırla
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Kapat
            </button>
            <EmbossedButton
              variant="primary"
              size="md"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportWord}
              disabled={isExporting}
            >
              {isExporting ? 'Hazırlanıyor...' : 'Zümre Tutanağını İndir (.docx)'}
            </EmbossedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
