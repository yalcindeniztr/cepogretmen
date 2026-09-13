import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Plus,
  Download,
  Printer,
  Trash2,
  Edit,
  Volume2,
  Filter,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Info
} from 'lucide-react';
import { PlanItem, PlanType, GradeLevel, AppSettings } from '../../core/types';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { EmbossedBadge } from '../../components/3d/EmbossedBadge';
import { DocxExportService } from '../../services/export/docxExportService';
import { PdfPrintService } from '../../services/export/pdfPrintService';
import { SpeechService } from '../../services/speech/speechService';
import { FullYearlyPlanView } from './FullYearlyPlanView';

interface PlanListViewProps {
  planType: PlanType;
  plans: PlanItem[];
  settings: AppSettings;
  onOpenCreate: () => void;
  onSelectPlan: (plan: PlanItem) => void;
  onDeletePlan: (id: string) => void;
}

export const PlanListView: React.FC<PlanListViewProps> = ({
  planType,
  plans,
  settings,
  onOpenCreate,
  onSelectPlan,
  onDeletePlan
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>(planType === 'YEARLY' ? 'table' : 'cards');
  const [yearlyViewType, setYearlyViewType] = useState<'TWO_TERM' | 'WEEKLY_LIST'>('TWO_TERM');

  const filteredPlans = plans
    .filter(p => p.type === planType)
    .filter(p => (selectedGrade === 'ALL' ? true : p.gradeLevel === selectedGrade))
    .filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.themeUnit.toLowerCase().includes(q) ||
        p.learningOutcomes.some(o => o.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const totalWeeklyHours = filteredPlans.reduce(
    (sum, p) => sum + (p.lessonHours || settings.defaultWeeklyHours || 2),
    0
  );

  const handleSpeakPlan = (plan: PlanItem) => {
    const text = `${plan.gradeLevel}. Sınıf Tarih Dersi, ${plan.weekNumber}. Hafta Planı. Ünite: ${plan.themeUnit}. Kazanımlar: ${plan.learningOutcomes.join(', ')}. Değerler: ${plan.values.join(', ')}.`;
    SpeechService.speak(text);
  };

  const handleExportAllToWord = async () => {
    if (filteredPlans.length === 0) {
      alert('İndirilecek plan bulunmuyor.');
      return;
    }
    await DocxExportService.exportMultipleYearlyPlansToWord(
      filteredPlans,
      settings,
      selectedGrade !== 'ALL' ? selectedGrade : undefined
    );
  };

  const handlePrintAllToPdf = () => {
    if (filteredPlans.length === 0) {
      alert('Yazdırılacak plan bulunmuyor.');
      return;
    }
    PdfPrintService.printMultipleYearlyPlans(
      filteredPlans,
      settings,
      selectedGrade !== 'ALL' ? selectedGrade : undefined
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 2 Dönemli Yıllık Plan vs Haftalık Tekil Düzenleme Switcher */}
      {planType === 'YEARLY' && (
        <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setYearlyViewType('TWO_TERM')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              yearlyViewType === 'TWO_TERM'
                ? 'bg-white text-maarif-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-maarif-600" />
            <span>2 Dönemli Yıllık Plan (Tüm Yıl • Tatil, Sınav, Okul Temelli & Sosyal Etkinlik)</span>
          </button>
          <button
            onClick={() => setYearlyViewType('WEEKLY_LIST')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              yearlyViewType === 'WEEKLY_LIST'
                ? 'bg-white text-maarif-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-4 h-4 text-slate-600" />
            <span>Haftalık Tekil Kayıtlar</span>
          </button>
        </div>
      )}

      {planType === 'YEARLY' && yearlyViewType === 'TWO_TERM' ? (
        <FullYearlyPlanView settings={settings} />
      ) : (
        <>
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            {planType === 'YEARLY' ? (
              <Calendar className="w-7 h-7 text-maarif-600" />
            ) : (
              <FileText className="w-7 h-7 text-emerald-600" />
            )}
            <span>{planType === 'YEARLY' ? 'MEB Yıllık Çalışma Planları' : '3 Bölümlü Günlük Ders Planları'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Türkiye Yüzyılı Maarif Modeli ve MEB Çalışma Takvimine uygun planlarınızı yönetin, Word (.docx) ve PDF olarak indirin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {planType === 'YEARLY' && filteredPlans.length > 0 && (
            <>
              <button
                onClick={handleExportAllToWord}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-sm cursor-pointer"
                title="Tüm seçili yıllık plan haftalarını tek bir Word belgesi olarak indir"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Toplu Word (.docx)</span>
              </button>

              <button
                onClick={handlePrintAllToPdf}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-sm cursor-pointer"
                title="Tüm seçili yıllık plan tablosunu A4 yatay formatında yazdır / PDF yap"
              >
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>Toplu PDF / Yazdır</span>
              </button>
            </>
          )}

          <EmbossedButton
            variant={planType === 'YEARLY' ? 'primary' : 'success'}
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenCreate}
          >
            Yeni Plan Oluştur
          </EmbossedButton>
        </div>
      </div>

      {/* Filters & View Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-sm backdrop-blur-sm">
        {/* Grade Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Sınıf:
          </span>
          {(['ALL', 9, 10, 11, 12] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-maarif-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {grade === 'ALL' ? 'Tümü' : `${grade}. Sınıf`}
            </button>
          ))}
        </div>

        {/* View Mode Toggle (Cards vs Table) & Search */}
        <div className="flex items-center gap-3">
          {planType === 'YEARLY' && (
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-maarif-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="12 Sütunlu MEB Resmi Çizelge Tablo Görünümü"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>12 Sütun Tablo</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white text-maarif-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Kart Görünümü"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kartlar</span>
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Konu, ünite veya kazanım ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Plan Count & Summary Banner */}
      <div className="flex items-center justify-between px-4 py-2 bg-maarif-50/70 border border-maarif-100 rounded-xl text-xs text-maarif-900 font-semibold">
        <span className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-maarif-600" />
          Listelenen: <strong>{filteredPlans.length} Hafta / Plan</strong>
          {selectedGrade !== 'ALL' && <span>({selectedGrade}. Sınıf Tarih)</span>}
        </span>
        {planType === 'YEARLY' && (
          <span className="text-slate-700 font-medium">
            Planlanan Toplam Ders Saati: <strong className="text-maarif-800">{totalWeeklyHours} Saat</strong>
          </span>
        )}
      </div>

      {/* Empty State */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Henüz Kayıtlı Plan Bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            "Yeni Plan Oluştur" butonunu kullanarak yapay zeka ile veya hazır Maarif müfredatından seçerek plan hazırlayabilirsiniz.
          </p>
          <div className="mt-4">
            <EmbossedButton variant="primary" size="sm" onClick={onOpenCreate}>
              Hemen Bir Plan Hazırla
            </EmbossedButton>
          </div>
        </div>
      ) : viewMode === 'table' && planType === 'YEARLY' ? (
        /* OFFICIAL 12-COLUMN MEB TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-maarif-700 text-white font-extrabold text-[11px] uppercase tracking-wider text-center border-b border-maarif-800">
                  <th className="p-2.5 border-r border-maarif-600 w-24">TARİH</th>
                  <th className="p-2.5 border-r border-maarif-600 w-16">HAFTA</th>
                  <th className="p-2.5 border-r border-maarif-600 w-14">SAAT</th>
                  <th className="p-2.5 border-r border-maarif-600 w-36 text-left">TEMA</th>
                  <th className="p-2.5 border-r border-maarif-600 w-36 text-left">İÇERİK ÇERÇEVESİ</th>
                  <th className="p-2.5 border-r border-maarif-600 min-w-[200px] text-left">ÖĞRENME ÇIKTILARI</th>
                  <th className="p-2.5 border-r border-maarif-600 min-w-[220px] text-left">SÜREÇ BİLEŞENLERİ</th>
                  <th className="p-2.5 border-r border-maarif-600 min-w-[150px] text-left">ÖĞRENME BECERİLERİ</th>
                  <th className="p-2.5 border-r border-maarif-600 w-28 text-left">DEĞERLER</th>
                  <th className="p-2.5 border-r border-maarif-600 w-28 text-left">OKURYAZARLIK</th>
                  <th className="p-2.5 border-r border-maarif-600 min-w-[160px] text-left">ÖLÇME DEĞERLENDİRME</th>
                  <th className="p-2.5 border-r border-maarif-600 w-24">BELİRLİ GÜN & HAFT.</th>
                  <th className="p-2.5 w-24 text-center">İŞLEM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPlans.map((plan, index) => (
                  <tr
                    key={plan.id}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                    }`}
                  >
                    {/* TARİH */}
                    <td className="p-2.5 text-center font-medium text-slate-700 whitespace-nowrap border-r border-slate-200">
                      {plan.dateRange}
                    </td>

                    {/* HAFTA */}
                    <td className="p-2.5 text-center font-bold text-maarif-800 border-r border-slate-200 whitespace-nowrap">
                      {plan.weekNumber}. Hafta
                    </td>

                    {/* SAAT */}
                    <td className="p-2.5 text-center font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {plan.lessonHours || settings.defaultWeeklyHours || 2} Saat
                    </td>

                    {/* TEMA */}
                    <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200 leading-tight">
                      {plan.themeUnit}
                    </td>

                    {/* İÇERİK ÇERÇEVESİ */}
                    <td className="p-2.5 text-slate-800 font-semibold border-r border-slate-200 leading-tight">
                      {plan.contentFramework || plan.topics.join(', ')}
                    </td>

                    {/* ÖĞRENME ÇIKTILARI */}
                    <td className="p-2.5 text-slate-700 border-r border-slate-200">
                      <ul className="list-disc list-inside space-y-1">
                        {plan.learningOutcomes.map((outcome, oIdx) => (
                          <li key={oIdx} className="leading-snug">
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* SÜREÇ BİLEŞENLERİ */}
                    <td className="p-2.5 text-slate-700 border-r border-slate-200 leading-snug whitespace-pre-line text-[11px]">
                      {plan.processComponents}
                    </td>

                    {/* ÖĞRENME BECERİLERİ */}
                    <td className="p-2.5 text-[11px] text-slate-700 border-r border-slate-200 space-y-1 leading-tight">
                      {plan.domainSkills && (
                        <div><strong className="text-slate-900">Alan:</strong> {plan.domainSkills}</div>
                      )}
                      {plan.conceptualSkills && (
                        <div><strong className="text-slate-900">Kavramsal:</strong> {plan.conceptualSkills}</div>
                      )}
                      {plan.dispositions && (
                        <div><strong className="text-slate-900">Eğilimler:</strong> {plan.dispositions}</div>
                      )}
                    </td>

                    {/* DEĞERLER */}
                    <td className="p-2.5 border-r border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {plan.values.map((v) => (
                          <span
                            key={v}
                            className="px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[10px] font-bold text-purple-800"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* OKURYAZARLIK */}
                    <td className="p-2.5 text-[11px] text-slate-700 border-r border-slate-200 leading-tight">
                      {plan.literacySkills || 'OB1, OB2'}
                    </td>

                    {/* ÖLÇME DEĞERLENDİRME */}
                    <td className="p-2.5 text-[11px] text-slate-700 border-r border-slate-200 whitespace-pre-line leading-tight">
                      {plan.learningEvidences || plan.evaluation}
                    </td>

                    {/* BELİRLİ GÜN VE HAFTALIK NOT */}
                    <td className="p-2.5 text-center font-bold text-rose-800 border-r border-slate-200 leading-tight text-[11px]">
                      {plan.notes || '-'}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => DocxExportService.exportPlanToWord(plan, settings)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Word (.docx) İndir"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => PdfPrintService.printPlan(plan, settings)}
                          className="p-1 rounded text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="PDF / Yazdır"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectPlan(plan)}
                          className="p-1 rounded text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                          title="Düzenle"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`"${plan.weekNumber}. Hafta" planını silmek istediğinize emin misiniz?`)) {
                              onDeletePlan(plan.id);
                            }
                          }}
                          className="p-1 rounded text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredPlans.map((plan) => (
            <EmbossedCard
              key={plan.id}
              variant={plan.type === 'YEARLY' ? 'blue' : 'emerald'}
              className="flex flex-col justify-between"
            >
              <div>
                {/* Card Top Meta */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-maarif-800">
                      {plan.gradeLevel}. Sınıf Tarih
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {plan.weekNumber}. Hafta • {plan.dateRange}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {plan.lessonHours || settings.defaultWeeklyHours || 2} Saat
                    </span>
                  </div>
                  <button
                    onClick={() => handleSpeakPlan(plan)}
                    title="Planı Sesli Oku"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-maarif-600 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Theme & Title */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-maarif-600 block uppercase tracking-wider">
                    {plan.themeUnit}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{plan.title}</h3>
                </div>

                {/* Outcomes & Values */}
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">Öğrenme Çıktısı (Kazanım):</span>
                    {plan.learningOutcomes[0] || 'Kazanım belirtilmemiş'}
                    {plan.learningOutcomes.length > 1 && (
                      <span className="text-slate-500 font-medium ml-1">
                        (+{plan.learningOutcomes.length - 1} diğer)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {plan.values.map((val) => (
                      <EmbossedBadge key={val} variant="amber">
                        {val}
                      </EmbossedBadge>
                    ))}
                    {(plan.skills || []).slice(0, 2).map((skill) => (
                      <EmbossedBadge key={skill} variant="blue">
                        {skill}
                      </EmbossedBadge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Word, PDF, Edit, Delete */}
              <div className="mt-5 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => DocxExportService.exportPlanToWord(plan, settings)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer shadow-sm"
                    title="Word (.docx) formatında indir"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Word (.docx)</span>
                  </button>

                  <button
                    onClick={() => PdfPrintService.printPlan(plan, settings)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shadow-sm"
                    title="Resmi A4 sayfa formatında PDF olarak kaydet veya yazdır"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PDF / Yazdır</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-maarif-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Düzenle / Ayrıntılar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${plan.title}" planını silmek istediğinize emin misiniz?`)) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Planı Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </EmbossedCard>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
};
