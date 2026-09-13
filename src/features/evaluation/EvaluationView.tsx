import React, { useState } from 'react';
import {
  Scale,
  Download,
  Printer,
  Plus,
  CheckSquare,
  HelpCircle,
  FileCheck,
  Award
} from 'lucide-react';
import { EvaluationScale, AppSettings } from '../../core/types';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';

interface EvaluationViewProps {
  scales: EvaluationScale[];
  settings: AppSettings;
  onAddScale: (scale: EvaluationScale) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  scales,
  settings,
  onAddScale
}) => {
  const [selectedScale, setSelectedScale] = useState<EvaluationScale>(scales[0]);
  const [isCreatingScale, setIsCreatingScale] = useState(false);

  // New scale form state
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [instructions, setInstructions] = useState('');
  const [criteriaText, setCriteriaText] = useState(
    'Tarihsel Bağlamı Kavrama|Olayı döneminin şartları ve zihniyetiyle ilişkilendirir.|25\nKaynak ve Kanıt Analizi|Belgenin güvenilirliğini ve amacını sorgular.|25\nNeden-Sonuç İlişkisi|Olayların birbirini tetikleyen sebeplerini açıklar.|25\nDil ve Tarih Terminolojisi|Kavramları yerinde ve doğru kullanır.|25'
  );

  const handleCreateScale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedCriteria = criteriaText
      .split('\n')
      .map(line => {
        const parts = line.split('|');
        return {
          dimension: parts[0]?.trim() || 'Boyut',
          description: parts[1]?.trim() || 'Açıklama',
          maxScore: Number(parts[2]?.trim()) || 20
        };
      })
      .filter(c => c.dimension);

    const newScale: EvaluationScale = {
      id: `scale-custom-${Date.now()}`,
      title: title.trim(),
      gradeLevel: 'Tümü',
      type: 'RUBRIK',
      purpose: purpose.trim() || 'Öğrenci beceri ve süreç gelişimini değerlendirme.',
      instructions: instructions.trim() || 'Ölçütler 100 tam puan üzerinden değerlendirilir.',
      criteria: parsedCriteria
    };

    onAddScale(newScale);
    setSelectedScale(newScale);
    setIsCreatingScale(false);
    setTitle('');
    setPurpose('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-purple-600" />
            <span>Süreç Odaklı Ölçme & Değerlendirme Ölçekleri</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Türkiye Yüzyılı Maarif Modeli rubrikleri, gözlem formları ve öz değerlendirme çizelgelerini Word (.docx) ve PDF olarak indirin.
          </p>
        </div>

        <EmbossedButton
          variant="purple"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreatingScale(true)}
        >
          Yeni Değerlendirme Ölçeği Oluştur
        </EmbossedButton>
      </div>

      {/* Main Grid: Scales List (Left) & Detailed Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scales Selector */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kayıtlı Maarif Ölçekleri
          </h3>

          {scales.map((scale) => {
            const isSelected = selectedScale?.id === scale.id;
            return (
              <EmbossedCard
                key={scale.id}
                variant={isSelected ? 'purple' : 'slate'}
                onClick={() => setSelectedScale(scale)}
                className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    {scale.type === 'RUBRIK' ? 'Rubrik (Puanlama Anahtarı)' : 'Gözlem Formu'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {scale.criteria.length} Ölçüt
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{scale.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{scale.purpose}</p>
              </EmbossedCard>
            );
          })}
        </div>

        {/* Selected Scale Detail & Export Box */}
        <div className="lg:col-span-2 space-y-4">
          {selectedScale ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
              {/* Header & Export Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    {settings.schoolName} • Tarih Dersi
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedScale.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => DocxExportService.exportScaleToWord(selectedScale, settings)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Word (.docx) İndir</span>
                  </button>

                  <button
                    onClick={() => PdfPrintService.printScale(selectedScale, settings)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-600" />
                    <span>PDF / Yazdır</span>
                  </button>
                </div>
              </div>

              {/* Purpose & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Değerlendirmenin Amacı:</span>
                  <p className="text-slate-600">{selectedScale.purpose}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Uygulama Yönergesi:</span>
                  <p className="text-slate-600">{selectedScale.instructions}</p>
                </div>
              </div>

              {/* Criteria Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Değerlendirme Ölçütleri ve Puan Dağılımı
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3 w-1/3">Değerlendirme Boyutu</th>
                        <th className="p-3">Ölçüt / Gösterge Açıklaması</th>
                        <th className="p-3 w-24 text-center">Maks. Puan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedScale.criteria.map((crit, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-center text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-bold text-slate-800">{crit.dimension}</td>
                          <td className="p-3 text-slate-600">{crit.description}</td>
                          <td className="p-3 font-extrabold text-center text-purple-700">
                            {crit.maxScore} Puan
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-purple-50 font-bold text-purple-900">
                      <tr>
                        <td colSpan={3} className="p-3 text-right">Toplam Puan:</td>
                        <td className="p-3 text-center text-sm">
                          {selectedScale.criteria.reduce((acc, c) => acc + c.maxScore, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Ders Öğretmeni: <strong>{settings.teacherName}</strong></span>
                <span>Okul Müdürü: <strong>{settings.principalName}</strong></span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Lütfen soldan bir ölçek seçin.</div>
          )}
        </div>
      </div>

      {/* Modal: Create Custom Scale */}
      {isCreatingScale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>Yeni Değerlendirme Ölçeği Oluştur</span>
            </h3>

            <form onSubmit={handleCreateScale} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ölçek Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Tarihsel Harita Analizi ve Yorumlama Rubriği"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Değerlendirmenin Amacı</label>
                <input
                  type="text"
                  placeholder="Öğrencinin tarihi haritalar üzerindeki çıkarımlarını ölçme..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ölçütler (Format: Boyut|Açıklama|Puan)</label>
                <textarea
                  rows={5}
                  value={criteriaText}
                  onChange={(e) => setCriteriaText(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Her satıra bir ölçüt giriniz. Dikey çizgi (|) ile Boyut, Açıklama ve Puanı ayırınız.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingScale(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Vazgeç
                </button>
                <EmbossedButton variant="purple" size="md" type="submit">
                  Ölçeği Kaydet
                </EmbossedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
