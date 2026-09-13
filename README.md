# 📚 Cep Öğretmen - Maarif Modeli Tarih Dersi Asistanı

> **Türkiye Yüzyılı Maarif Modeli** esaslarına göre geliştirilmiş; Tarih dersi yıllık ve günlük ders planları, MEB çalışma takvimi entegrasyonu, %100 açık uçlu bağlamlı sınavlar ve dereceli rubrik değerlendirme anahtarları hazırlama sistemi.

---

## 🌟 Temel Özellikler

### 1. 📅 Maarif Uyumlu Yıllık & Günlük Ders Planı Hazırlama
* **MEB Çalışma Takvimi:** 36 haftalık eğitim öğretim yılı, 1. ve 2. dönem ara tatilleri, sömestr ve resmi tatiller otomatik işlenir.
* **Haftalık Ders Saati Esnekliği:** 2 saat (Temel Düzey) veya 4 saat (İleri Düzey) seçildiğinde kazanım ve konular haftalara otomatik orantılanır.
* **3 Bölümlü Günlük Plan Şablonu:**
  * **Bölüm I:** Ders, Sınıf, Süre, Öğrenme Alanı, Ünite, Temel Beceriler, Maarif Değerleri.
  * **Bölüm II (Dersin Akışı):** Hazırlık & İlgi Çekme, Keşfetme & Bilgi İnşası, Derinleştirme & Bütünleştirme, Özetleme.
  * **Bölüm III:** Ölçme ve Değerlendirme, Bireysel Farklılaştırma (Destekleme / Zenginleştirme).

### 2. 📝 Açık Uçlu ve Bağlamlı Sınav Modülü (10 Soru / 100 Puan)
* **MEB Ölçme ve Değerlendirme Yönetmeliği Uyumlu:** Çoktan seçmeli soru barındırmaz. Tarihsel metin, kitabe, arşiv belgesi veya harita bağlamına dayalı açık uçlu sorular.
* **Zorluk Derecesine Göre Ağırlıklı Puanlama:**
  * **3 Kolay Soru:** 8'er Puan ($3 \times 8 = 24$ Puan)
  * **4 Orta Soru:** 10'ar Puan ($4 \times 10 = 40$ Puan)
  * **3 Zor Soru:** 12'şer Puan ($3 \times 12 = 36$ Puan)
  * **Toplam:** Tam 100 Puan
* **Kademeli Puanlama & Yarım Cevap Değerlendirme Yönergesi:**
  * Öğrencinin eksik veya yarım cevap vermesi durumunda hangi ölçütten kaç puan alacağı dereceli cevap anahtarında açıkça listelenir.

### 3. 📖 MEB Ders Kitapları & Dijital Kütüphane
* 9, 10, 11 ve 12. Sınıf Tarih ders kitapları, etkileşimli bağlantılar (EBA / OGM Materyal) ve yerel PDF ekleme desteği.
* Yapay zekâ (Google Gemini), sınav ve plan üretirken bu kütüphanedeki ünite ve kazanım dizilimlerini kaynak kabul eder.

### 4. 🖨️ Çift Yönlü Çıktı Desteği (Word .docx & A4 Vektörel PDF)
* **Word (.docx):** Tam düzenlenebilir, resmi MEB formatında kenarlıklı ve başlıklı tablolar.
* **A4 Dikey PDF:** Öğrenci Sınav Kağıdı ve Günlük Planlar için doğrudan yazdırılabilir veya PDF kaydedilebilir format.
* **A4 Yatay PDF:** Geniş cevap anahtarları ve rubrikler için optimize edilmiş yatay baskı şablonu.

### 5. 💾 %100 Yerel Veritabanı & Güvenlik
* Veriler kullanıcının kendi bilgisayarında (`localStorage`) güvenle saklanır.
* Tek tıkla tam sistem yedeği (`JSON`) alma ve geri yükleme imkânı.
* Şifre veya sunucu gerektirmez, doğrudan öğretmene özel çalışır.
* **Portable (Taşınabilir):** Kurulum gerektirmeden USB bellekten veya masaüstünden çift tıkla çalıştırılabilir.

---

## 🚀 Kurulum ve Çalıştırma

### Geliştirici Modunda Çalıştırma (Node.js)
```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim derlemesi oluşturun
npm run build
```

### Taşınabilir (Portable) Kullanım
* Masaüstünüzdeki `Maarif_Portable_Baslat.bat` dosyasına çift tıklayarak uygulamayı anında açabilirsiniz.

---

## 🏫 Varsayılan Kurum Bilgileri
* **Okul:** Ballıca Mesleki ve Teknik Anadolu Lisesi
* **Öğretmen:** Yalçın DENİZ
* **Müdür:** Fatma Bayram ARSLAN
*(Tüm bilgiler Ayarlar menüsünden her an değiştirilebilir ve güncellenebilir)*

