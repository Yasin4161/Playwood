# 🏗️ İnşaat Kalıp Yerleştirme Aracı (Construction Panel Placement Tool)

## 📌 Genel Bakış

Bu araç, **inşaat profesyonellerinin** belirli alanlara **kalıp panellerini en verimli şekilde yerleştirmelerine** yardımcı olmak için geliştirilmiştir.  
🔍 Panel yerleşimi, **bin-packing (kutu yerleştirme) algoritmaları** ile optimize edilir ve sonuçlar **HTML5 Canvas** kullanılarak **görsel olarak** sunulur.  

Kullanıcılar:
- Panel boyutlarını girebilir
- İnşaat alanını tanımlayabilir
- Yerleşim önerilerini, **verimlilik oranları** ile birlikte alabilir
- Görselleştirmeleri dışa aktarabilir

---

## 👤 Kullanıcı Tercihleri

- **Tercih edilen dil:** Basit ve günlük Türkçe

---

## 🧱 Sistem Mimarisi

### 🎨 Ön Yüz (Frontend) Mimarisi

- **🧩 Tek Sayfa Uygulaması (SPA)**  
  Framework bağımsız, yalnızca HTML, CSS ve JavaScript ile geliştirildi.

- **📦 Sınıf Tabanlı JavaScript Mimarisi**  
  `PanelPlacementApp` ES6 sınıfı, uygulama durumunu ve iş mantığını kapsar.

- **🖼️ Canvas Tabanlı Görselleştirme Sistemi**  
  HTML5 Canvas API ile renk kodlu yerleşim diyagramları üretilir.

- **📱 Duyarlı (Responsive) Tasarım**  
  CSS Grid ve Flexbox ile mobil uyumlu arayüz.

- **💾 Tarayıcı Depolama (localStorage)**  
  Panel bilgileri tarayıcıda saklanır, oturumlar arası korunur.

---

### 🧠 Temel Algoritmalar

- **📐 Bin Packing Algoritması**  
  Alanı en verimli kullanacak şekilde panel yerleşimini hesaplar.

- **🛠️ Panel Yönetimi**  
  Panel ekleme, silme ve doğrulama işlemleri dinamik olarak yapılır.

- **⚙️ Yerleşim Optimizasyon Motoru**  
  Verimlilik oranı, kalan alan ve yerleşim uygunluğu hesaplanır.

- **🖌️ Görsel Çizim Motoru**  
  Renkli ve net yerleşim diyagramları çizer.

---

### 🧭 Arayüz Özellikleri

- **🚶‍♂️ Adım Adım Kullanım Akışı**  
  Panel girişinden sonuçlara kadar yönlendirici yapı.

- **✅ Gerçek Zamanlı Doğrulama**  
  Hatalı girişler anında kullanıcıya bildirilir.

- **🔔 Toast Bildirim Sistemi**  
  Başarılı işlemler, hatalar vb. için rahatsız etmeyen bildirimler.

- **📭 Boş Durum Yönetimi**  
  Veri olmayan durumlarda açıklayıcı mesajlar ve görseller.

---

### 🗃️ Veri Yönetimi

- **🧠 Bellek Üzerinde Durum**  
  JavaScript dizileri ile panel bilgileri ve sonuçlar saklanır.

- **🎨 Renk Atama Sistemi**  
  Panellerin görsel olarak ayırt edilmesi için otomatik renk atanır.

- **📤 Dışa Aktarım Özelliği**  
  Yerleşim diyagramları indirilebilir görsel olarak kaydedilebilir.

---

## 🔗 Harici Bağımlılıklar

### 🌐 CDN Kaynakları

- **Font Awesome 6.0.0**  
  İnşaat temalı ikonlar:  
  [`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css)

---

### 🧩 Tarayıcı API'leri

- **HTML5 Canvas API** – Görselleştirme motoru  
- **Web Storage API (localStorage)** – Kullanıcı oturum verisi  
- **File API** – Yerleşim görselini indirilebilir hale getirme

---

## 🚀 Mimari Avantajlar

- ✅ **Sunucu Gereksinimi Yok**  
  Tamamen istemci tarafında çalışır, çevrimdışı kullanılabilir.

- 🔓 **Framework Bağımsızlığı**  
  Uzun vadeli sürdürülebilirlik için saf JavaScript mimarisi.

- 📱 **Mobil Uyumlu Kullanım**  
  Şantiyelerde, mobil cihazlarla kolay erişim ve etkileşim.

---

## 🛠️ Katkıda Bulunmak

Bu proje gelişime açıktır!  
Sorun bildirmek, iyileştirme önermek veya katkıda bulunmak için lütfen [GitHub Issues](https://github.com/) kısmını kullanın.

---
