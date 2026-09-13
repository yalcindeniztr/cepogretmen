import React, { useState } from 'react';
import {
  Settings,
  School,
  User,
  ShieldAlert,
  Save,
  Download,
  Upload,
  Key,
  Volume2,
  Check,
  Database,
  RefreshCw
} from 'lucide-react';
import { AppSettings } from '../../core/types';
import { LocalDatabaseService } from '../../services/storage/localDatabase';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onDataReload: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onDataReload
}) => {
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [teacherName, setTeacherName] = useState(settings.teacherName);
  const [principalName, setPrincipalName] = useState(settings.principalName);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [term, setTerm] = useState(settings.term);
  const [defaultWeeklyHours, setDefaultWeeklyHours] = useState(settings.defaultWeeklyHours || 2);
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [speechEnabled, setSpeechEnabled] = useState(settings.speechEnabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      schoolName: schoolName.trim() || 'Ballıca MTAL',
      teacherName: teacherName.trim() || 'Yalçın DENİZ',
      principalName: principalName.trim() || 'Fatma Bayram ARSLAN',
      academicYear: academicYear.trim() || '2024-2025',
      term,
      defaultWeeklyHours: Number(defaultWeeklyHours) || 2,
      geminiApiKey: geminiApiKey.trim(),
      speechEnabled
    };

    onUpdateSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Full Computer Backup export to JSON file
  const handleExportBackup = () => {
    const jsonStr = LocalDatabaseService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaarifPlanlayici_Yedek_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup from computer
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = LocalDatabaseService.importFullBackup(content);
        if (ok) {
          alert('Yedek başarıyla bilgisayarınızdan geri yüklendi!');
          onDataReload();
        } else {
          alert('Yedek dosyası geçersiz veya bozuk.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-slate-700" />
          <span>Kurum, Öğretmen ve Sistem Ayarları</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Okul, müdür, öğretmen bilgileri tüm Word ve PDF belgelerine resmi olarak yansır.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <EmbossedCard variant="blue" className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-blue-200/60 pb-3">
                <School className="w-4 h-4 text-maarif-600" />
                <span>Resmi Kurum ve Yetkili Bilgileri</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Okul Adı</label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Varsayılan: Ballıca MTAL</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tarih Dersi Öğretmeni</label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Varsayılan: Yalçın DENİZ</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Okul Müdürü Adı</label>
                  <input
                    type="text"
                    required
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 font-semibold"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Varsayılan: Fatma Bayram ARSLAN</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Eğitim-Öğretim Yılı & Dönem</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="2024-2025"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 font-semibold"
                    />
                    <select
                      value={term}
                      onChange={(e) => setTerm(e.target.value as any)}
                      className="w-full px-2 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 font-semibold"
                    >
                      <option value="Tam Yıl">Tam Yıl</option>
                      <option value="1. Dönem">1. Dönem</option>
                      <option value="2. Dönem">2. Dönem</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Varsayılan Haftalık Ders Saati
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={defaultWeeklyHours}
                      onChange={(e) => setDefaultWeeklyHours(Number(e.target.value))}
                      className="w-24 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-maarif-500 font-semibold text-center"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Saat (Yıllık Plan: {defaultWeeklyHours * 36} Saat)
                    </span>
                  </div>
                </div>
              </div>
            </EmbossedCard>

            <EmbossedCard variant="purple" className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-purple-200/60 pb-3">
                <Key className="w-4 h-4 text-purple-600" />
                <span>Google Gemini Yapay Zeka API Anahtarı (Opsiyonel)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  * API Anahtarınız olmadan da sistemin dahili Maarif Modeli kütüphanesi %100 çevrimdışı çalışarak planları ve ölçekleri üretir.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="speechToggle"
                  checked={speechEnabled}
                  onChange={(e) => setSpeechEnabled(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="speechToggle" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Sesli Asistan ve Türkçe Bildirimleri Etkinleştir</span>
                </label>
              </div>
            </EmbossedCard>

            <div className="flex items-center justify-end">
              <EmbossedButton
                variant="primary"
                size="lg"
                type="submit"
                icon={savedSuccess ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              >
                {savedSuccess ? 'Ayarlar Kaydedildi!' : 'Tüm Ayarları Kaydet'}
              </EmbossedButton>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Local PC Database Management & Backup */}
        <div className="space-y-4">
          <EmbossedCard variant="emerald" className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-emerald-200/60 pb-3">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Bilgisayar Veritabanı & Yedekleme</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tüm hazırladığınız yıllık planlar, günlük ders planları, kütüphane materyalleri ve kurum ayarları <strong>bilgisayarınızın yerel depolama alanına (Local Storage / IndexedDB)</strong> kaydedilir.
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Bilgisayara Tam Yedek İndir (JSON)</span>
              </button>

              <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200 shadow-xs">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Bilgisayardan Yedek Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </EmbossedCard>

          <EmbossedCard variant="amber" className="text-xs space-y-2">
            <h4 className="font-bold text-amber-900">Güvenlik ve Gizlilik Garantisi</h4>
            <p className="text-amber-800/90 leading-relaxed">
              Verileriniz harici bir sunucuya gitmez; tamamen kendi bilgisayarınızda barındırılır. Sayfayı kapatsanız veya çevrimdışı kalsanız dahi tüm çalışmalarınız korunur.
            </p>
          </EmbossedCard>
        </div>
      </div>
    </div>
  );
};
