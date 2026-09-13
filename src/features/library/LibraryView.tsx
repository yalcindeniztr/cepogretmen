import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  Filter,
  Search,
  Check,
  Bookmark,
  Share2,
  FolderOpen,
  Eye,
  X,
  Sparkles,
  Download,
  Info,
  Maximize2
} from 'lucide-react';
import { LibraryItem, LibraryCategory, GradeLevel } from '../../core/types';
import { EmbossedCard } from '../../components/3d/EmbossedCard';
import { EmbossedButton } from '../../components/3d/EmbossedButton';
import { EmbossedBadge } from '../../components/3d/EmbossedBadge';

interface LibraryViewProps {
  items: LibraryItem[];
  onAddItem: (item: LibraryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  items,
  onAddItem,
  onDeleteItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LibraryCategory | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LibraryCategory>('DERS_KITABI');
  const [newGradeLevel, setNewGradeLevel] = useState<GradeLevel | 'Tümü'>('Tümü');
  const [newDescription, setNewDescription] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories: Array<{ id: LibraryCategory | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'Tüm Arşiv' },
    { id: 'DERS_KITABI', label: 'Tarih Ders Kitapları (9-12)' },
    { id: 'MEBI_EBA_OGM', label: 'MEBİ, EBA & OGM Materyal' },
    { id: 'YONETMELIK', label: 'MEB Mevzuat & Yönetmelik' },
    { id: 'OLCEK', label: 'Ölçme & Değerlendirme' },
    { id: 'DERS_NOTU', label: 'Öğretmen Materyalleri' },
  ];

  const filteredItems = items
    .filter(i => (selectedCategory === 'ALL' ? true : i.category === selectedCategory))
    .filter(i => {
      if (selectedGrade === 'ALL') return true;
      return i.gradeLevel === selectedGrade || i.gradeLevel === 'Tümü';
    })
    .filter(i => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    });

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: LibraryItem = {
      id: `lib-custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      gradeLevel: newGradeLevel,
      description: newDescription.trim(),
      linkUrl: newLinkUrl.trim() || undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      isCustom: true,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onAddItem(item);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewLinkUrl('');
    setNewTags('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Library className="w-7 h-7 text-amber-600" />
            <span>Kütüphane & Maarif Tarih Kitaplığı</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            9-12. Sınıf MEB Tarih ders kitapları, OGM Materyal etkileşimli kitaplar, MEBİ ve resmi yönetmelikler.
          </p>
        </div>

        <EmbossedButton
          variant="warning"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Kütüphaneye Materyal Ekle
        </EmbossedButton>
      </div>

      {/* AI Context Indicator Banner */}
      <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <span>Yapay Zekâ Kütüphane Entegrasyonu Aktif</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                TAM ENTEGRE
              </span>
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Yıllık plan veya günlük ders planı hazırlarken yapay zeka buradaki MEB kitaplarını, OGM kazanımlarını ve mevzuatları temel alarak içerik üretir.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="space-y-2 bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 shadow-sm backdrop-blur-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grade Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Kademe:
            </span>
            {(['ALL', 9, 10, 11, 12] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-maarif-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grade === 'ALL' ? 'Tüm Kademeler' : `${grade}. Sınıf`}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kitap, yönetmelik veya etiket ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <EmbossedCard
            key={item.id}
            variant={
              item.category === 'DERS_KITABI'
                ? 'blue'
                : item.category === 'MEBI_EBA_OGM'
                ? 'emerald'
                : item.category === 'YONETMELIK'
                ? 'rose'
                : 'amber'
            }
            className="flex flex-col justify-between"
          >
            <div>
              {/* Category Badge & Grade */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                  item.category === 'DERS_KITABI'
                    ? 'bg-blue-100 text-blue-800'
                    : item.category === 'MEBI_EBA_OGM'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.category === 'YONETMELIK'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.category === 'DERS_KITABI'
                    ? 'MEB Ders Kitabı'
                    : item.category === 'MEBI_EBA_OGM'
                    ? 'MEBİ / EBA / OGM'
                    : item.category === 'YONETMELIK'
                    ? 'Mevzuat & Yönetmelik'
                    : 'Öğretmen Materyali'}
                </span>

                <span className="text-[11px] font-bold text-slate-500">
                  {item.gradeLevel === 'Tümü' || !item.gradeLevel
                    ? 'Tüm Kademeler'
                    : `${item.gradeLevel}. Sınıf`}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-extrabold text-slate-900 mt-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Open Link, Preview & Delete */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {item.linkUrl && (
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                    title="Uygulama İçinde İncele"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>Önizle</span>
                  </button>
                )}

                {item.linkUrl ? (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-maarif-600 hover:text-maarif-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Yeni Sekmede Aç"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Dış Bağlantı</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Yerel Kaynak</span>
                )}
              </div>

              {item.isCustom && (
                <button
                  onClick={() => {
                    if (confirm(`"${item.title}" materyalini kütüphaneden silmek istediğinize emin misiniz?`)) {
                      onDeleteItem(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Materyali Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </EmbossedCard>
        ))}
      </div>

      {/* MODAL: Embedded Book & Material Reader */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md">
          <div className="w-full max-w-5xl h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {previewItem.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {previewItem.gradeLevel === 'Tümü' ? 'Tüm Kademeler' : `${previewItem.gradeLevel}. Sınıf`} • MEB Resmî Ders Materyali
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {previewItem.linkUrl && (
                  <a
                    href={previewItem.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Yeni Sekmede Tam Ekran Aç</span>
                  </a>
                )}

                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Iframe Viewer */}
            <div className="flex-1 bg-slate-100 relative">
              {previewItem.linkUrl ? (
                <iframe
                  src={previewItem.linkUrl}
                  title={previewItem.title}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
                />
              ) : (
                <div className="p-8 text-center text-slate-500">
                  Bu materyal için harici önizleme bağlantısı bulunmuyor.
                </div>
              )}
            </div>

            {/* Modal Footer Info */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-semibold text-slate-800">
                {previewItem.description}
              </span>
              <span className="text-[11px] text-slate-500">
                MEB Resmî Yayınları & OGM Materyal Çevrim İçi Kütüphanesi
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Material / Regulation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-amber-600" />
              <span>Kütüphaneye Yeni Materyal / Yönetmelik Ekle</span>
            </h3>

            <form onSubmit={handleAddNewItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Materyal / Kitap Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 9. Sınıf Tarih Çalışma Fasikülü (OGM)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LibraryCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value="DERS_KITABI">Tarih Ders Kitabı</option>
                    <option value="MEBI_EBA_OGM">MEBİ / EBA / OGM Materyali</option>
                    <option value="YONETMELIK">Mevzuat & Yönetmelik</option>
                    <option value="OLCEK">Ölçme & Değerlendirme</option>
                    <option value="DERS_NOTU">Öğretmen Ders Notu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sınıf Düzeyi</label>
                  <select
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value === 'Tümü' ? 'Tümü' : Number(e.target.value) as GradeLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value="Tümü">Tüm Kademeler</option>
                    <option value={9}>9. Sınıf</option>
                    <option value={10}>10. Sınıf</option>
                    <option value={11}>11. Sınıf</option>
                    <option value={12}>12. Sınıf</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Açıklama</label>
                <textarea
                  rows={3}
                  placeholder="Materyalin içeriği veya yönetmeliğin ilgili maddesi..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bağlantı URL (Opsiyonel)</label>
                <input
                  type="url"
                  placeholder="https://ogmmateryal.eba.gov.tr/..."
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Etiketler (Virgülle ayırın)</label>
                <input
                  type="text"
                  placeholder="Örn: OGM, Kazanım Testi, 9. Sınıf"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Vazgeç
                </button>
                <EmbossedButton variant="warning" size="md" type="submit">
                  Kütüphaneye Kaydet
                </EmbossedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
