İnşaat Kalıp Yerleştirme Aracı (Construction Panel Placement Tool)

Genel Bakış

Bu araç, Türkçe olarak sunulan bir kalıp yerleştirme optimizasyon sistemidir. İnşaat profesyonellerine, belirli inşaat alanları içerisinde kalıp panellerini en verimli şekilde yerleştirme konusunda yardımcı olur. Uygulama, bin-packing (kutu yerleştirme) algoritmaları kullanarak panel yerleşimini optimize eder ve yerleşim sonuçlarını tuval (canvas) üzerinde görsel olarak sunar. Kullanıcılar, panel boyutlarını ve alan kısıtlamalarını girerek, verimlilik metrikleri ve dışa aktarılabilir görselleştirmelerle birlikte yerleşim önerileri alabilir.

Kullanıcı Tercihleri

Tercih edilen iletişim biçimi: Basit ve günlük Türkçe.

Sistem Mimarisi

Ön Yüz (Frontend) Mimarisi

Tek Sayfa Uygulaması (SPA): Uygulama, maksimum taşınabilirlik ve düşük sistem yükü sağlamak amacıyla yalnızca saf HTML, CSS ve JavaScript kullanılarak geliştirilmiştir. Herhangi bir framework (çatı) bağımlılığı bulunmamaktadır.

Sınıf Tabanlı JavaScript Mimarisi: PanelPlacementApp adlı ES6 sınıf yapısı, uygulama durumunun yönetimi, kullanıcı arayüzü etkileşimi ve iş mantığını kapsayacak şekilde tasarlanmıştır.

Canvas Tabanlı Görselleştirme Sistemi: HTML5 Canvas API kullanılarak, gerçek zamanlı renk kodlu panel yerleşim görselleri oluşturulmaktadır.

Duyarlı (Responsive) CSS Izgara Yerleşimi: CSS Grid ve Flexbox kullanılarak mobil öncelikli, tüm cihazlara uyumlu arayüz tasarımı yapılmıştır.

İstemci Taraflı Veri Saklama: Tarayıcıya ait localStorage sistemi ile panel konfigürasyonları oturumlar arasında saklanır.


Temel Algoritma Bileşenleri

Bin Packing Algoritması: İnşaat alanı sınırları içerisinde alan kullanımını en üst düzeye çıkaracak şekilde panel yerleşim hesaplamalarını gerçekleştirir.

Panel Yönetim Sistemi: Panel boyutlarının dinamik olarak eklenmesi, silinmesi ve doğrulanması işlemlerini gerçek zamanlı olarak yürütür.

Yerleşim Optimizasyon Motoru: Verimlilik hesapları, kalan alan analizi ve yerleşim uygunluk kontrollerini gerçekleştirir.

Görsel Çizim Motoru: Belirlenmiş renk paletleriyle panel ayrımını sağlayan, alanı temsil eden çizimleri canvas üzerinde üretir.


Kullanıcı Arayüzü Tasarımı

Adım Adım İş Akışı: Kullanıcıyı panel girişi, alan tanımlaması ve hesaplama sonuçlarına kadar yönlendiren yapıdadır.

Gerçek Zamanlı Doğrulama Sistemi: Kullanıcı girişleri ve kısıtlamalar anında kontrol edilerek geri bildirim sağlanır.

Toast Bildirim Sistemi: İşlemler, hatalar ve başarı durumları için rahatsız etmeyen geri bildirim mesajları sağlar.

Boş Durum Yönetimi: Her bölümde veri bulunmadığında, kullanıcıya açıklayıcı mesajlar ve görsel ipuçları gösterilir.


Veri Yönetimi

Bellek Üzerinde Durum Yönetimi: Panel tanımları ve yerleşim sonuçları JavaScript dizileri ile bellekte tutulur.

Renk Atama Sistemi: Panelleri görsel olarak ayırt etmek için önceden belirlenmiş bir renk paletinden otomatik olarak renk atanır.

Dışa Aktarım Özelliği: Yerleşim diyagramları, canvas’tan görsele dönüştürülerek indirilebilir görseller halinde kaydedilebilir.


Harici Bağımlılıklar

CDN Kaynakları

Font Awesome 6.0.0: İnşaat temalı kullanıcı arayüzü ikonlarını ve görsel iyileştirmeleri sağlayan ikon kütüphanesi
https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css


Tarayıcı API’leri

HTML5 Canvas API: Görselleştirme bileşenlerinin çizimi ve render işlemleri için temel işlevleri sağlar.

Web Storage API (localStorage): Panel konfigürasyonlarının istemci tarafında saklanmasını sağlar.

File API: Yerleşim görsellerinin indirilebilir biçime dönüştürülmesini sağlar.


Mimari Avantajlar

Sunucu Gereksinimi Yok: Uygulama tamamen istemci tarafında çalışır, bu sayede barındırma (hosting) ihtiyacını ortadan kaldırır ve çevrimdışı (offline) kullanım imkânı sunar.

Framework Bağımsızlığı: Saf JavaScript yaklaşımı sayesinde uzun vadeli sürdürülebilirlik ve düşük teknik borç sağlanır.

Mobil Uyumlu Tasarım: Sahada kullanım kolaylığı için mobil cihazlarla uyumlu, duyarlı kullanıcı arayüzü sunar.
