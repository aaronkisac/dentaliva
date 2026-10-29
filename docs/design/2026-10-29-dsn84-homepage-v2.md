# DSN-84 — Anasayfa v2: Funnel Doküman Sırası + Şablon Tasarım Uygulaması

**Talep (Aaron, 2026-10-29):** Anasayfa, 16 bölümlük funnel dokümantasyonunun sırasıyla ve
metinleriyle kurulacak ("sıralamaya bağlı kal"); her bileşen için şablon sitelerden (ReoDental,
CareNow, Medilo, Dentia, DentalX) en uygun tasarım bulunup uygulanacak; Türkçe öncelikli;
mevcut tasarım v1 olarak arşivlenecek. Issue #361.

**Şablon araştırması:** 5 sitenin tam sayfa ekran görüntüsü alınıp bölüm bölüm incelendi
(CareNow carenownextjs.vercel.app, Medilo medilo-nextjs.vercel.app, Dentia dentia.on3-step.com,
DentalX dentalx-nextjs16.vercel.app, ReoDental reodental.framer.website; Themeforest
önizlemeleri Turnstile arkasında — demo URL'leri iframe HTML'sinden çıkarıldı).

## Yapısal kararlar

1. **com sırası = dokümanın 16 bölümü birebir:**
   `hero → trustStrip → treatmentPaths → onceSonra → videoTestimonials(gizli) → reviewForm →
howItWorks → decisionModules → travelStay → aftercare → reviews(gizli) → clinics →
doctors → cta → faq`
   ticker / about / quickServices / gallery com sırasından çıkar (dokümanda yok; bileşenler ve
   eu/nl config'leri dokunulmaz — geri getirmek tek satır). videoTestimonials ve reviews com'da
   CMS hiddenSections ile gizli kalır (TR uyum; doküman uyum notu "yalnız dentaliva.eu").
   **cta ile faq yer değiştirir** (dokümanda final CTA #15, SSS #16; v1'de tersti).
2. **v1 arşiv:** git tag `homepage-v1` (e0cd8f8) + `docs/design/homepage-v1/` (desktop+mobile
   tam sayfa ekran görüntüleri + README).
3. **Tasarım dili değişmez:** espresso/navy + ivory, serif başlıklar, altın çizgi eyebrow motifi,
   4px köşe — şablon KOMPOZİSYONLARI bu dile çevrilir (DSN-62'den beri uygulanan desen).

## Bölüm bölüm eşleme

| #     | Bölüm           | Şablon deseni                                                      | Uygulama (bizim dille)                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----- | --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01    | Hero            | **CareNow/DentalX split hero + yüzen kart**                        | Espresso zeminde split: solda eyebrow (yeni `hero.eyebrow`) + H1 + sub + body (yeni `hero.body`) + çift CTA; sağda 2 klinik fotoğrafı kart kolajı (yeni `hero.sideImages`, dikey 3/4, altın çerçeveli about dili + hafif offset) + sol altta yüzen Google puan rozeti. `sideImages` boşsa mevcut full-bleed foto davranışı aynen kalır (eu/nl ve boş-CMS güvenli).                                                                                                             |
| 02    | Trust strip     | **DentalX/CareNow overlap kart + Dentia ince dikey ayraçlı stats** | Hero'nun altına negatif margin'la taşan tam genişlik beyaz kart (gölge + hairline çerçeve): Google markası + puan/yorum sayısı, sonra göstergeler; hücreler dikey hairline'larla ayrılır. Kompakt kalır — dokümanın eyebrow/headline/CTA stringleri bu banta basılmaz (bilinçli; DSN-77 öncülü: her string her yüzeyde kullanılmaz). Klinik/hekim sayısı vurgusu yok (doc #02 kuralı).                                                                                         |
| 03    | Treatment paths | **DSN-48 overlay kart dili (DentalX görsel-üstü kart)**            | 4 kart tam-kanat görsel (aspect 4/3→3/4 yerine kare değil, 4/5), navy alt-gradient + altın serif numara (01–04) + ihtiyaç cümlesi büyük beyaz serif + teknik terim ikinci satır beyaz/75; tüm kart link; görselsiz kart navy zemin okunur.                                                                                                                                                                                                                                     |
| 04    | Vakalar         | **Dentia smile-gallery kart dili**                                 | Mevcut BeforeAfterSlider kartları korunur (Aaron onaylı etkileşim) + data-gated vaka meta satırı (yeni `beforeAfterCase.meta`: "Tedavi · Hekim · Şube · Tarih" tek localeString satırı) + resultsNote. Filtre çipleri bilinçli eklenmedi — 3 geçici vaka, 3 farklı tedaviyle filtre anlamsız; gerçek hasta vakaları gelince ayrı iş (TR uyum metadata'sı da o dalgada dolar).                                                                                                  |
| 05    | Videolar        | — (com'da gizli)                                                   | Bileşene dokunulmaz (eu/nl kullanıyor). Doküman uyum notu zaten "yalnız dentaliva.eu".                                                                                                                                                                                                                                                                                                                                                                                         |
| 06    | Form            | **CareNow "Book Appointment" koyu split bloğu**                    | Tam genişlik navy bant: solda eyebrow + başlık + gövde + 3 adım (beyaz serif numaralı, beyaz/80 metin); sağda beyaz form kartı (mevcut ReviewFormLoader). `#review` çapası korunur (hero CTA hedefi).                                                                                                                                                                                                                                                                          |
| 07    | Nasıl işler     | **CareNow numaralı-çember + bağlantı çizgisi timeline**            | xl'de 6 kolon yatay: üstte hairline bağlantı çizgisi + üzerinde ince altın halka içinde serif numara; lg 3+3, mobil dikey sol çizgi. Adım metinleri CMS'ten (DSN-77'de doc'la birebir doğrulandı).                                                                                                                                                                                                                                                                             |
| 08/09 | Karar modülleri | **Dentia split + CareNow kart satırları**                          | Mevcut iki kolon korunur; medya tarafına altın çerçeve + 4px (about kartı dili); seçenek satırları hairline kutulara dönüşür (hover lift + sağ ok); modül CTA'ları outline buton; modüller arası zemin dönüşümü (ivory/beyaz) ritmi.                                                                                                                                                                                                                                           |
| 10    | Seyahat         | **DentalX kapsam kartı + Medilo numaralı liste**                   | Sol: eyebrow + başlık + (yeni `travelStay.image`, data-gated görsel); sağ: checklist tek hairline kutu kartta check ikonlarıyla. "Ücretsiz/hediye" dili yok (mevcut kural).                                                                                                                                                                                                                                                                                                    |
| 11    | Aftercare       | **Dentia süreç kartları**                                          | Normal/urgent iki kart korunur; kart başlıklarına ikon (check/zil SVG), iletişim rotası notu altta tek satır + WhatsApp/telefon linkleri data-gated.                                                                                                                                                                                                                                                                                                                           |
| 12    | Yorumlar        | — (com'da gizli)                                                   | Bileşene dokunulmaz.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 13    | Klinikler       | **DentalX "Our Clinics" dolu lokasyon kartları**                   | 3 kart: foto üstte, şube adı serif, altında ADRES / TELEFON / SAAT satırları (ikonlu hairline satırlar — BranchItem'da phone+hours zaten var) + "Şube Detayı" linki. Dokümandaki İstanbul haritası bilinçli eklenmedi (embed perf/CSP; statik harita görseli istenirse ayrı iş).                                                                                                                                                                                               |
| 14    | Hekimler        | **Dentia 3/4 portre ekip kartları**                                | DSN-18/19 carousel emekli (doküman net: "3-4 hekim kartı; tam isim, resmi unvan, alan, profil linki"). 4 kart grid: 3/4 portre + serif isim + unvan + alan satırı (data-gated) + profil linki; altta "Ekibimizle Tanışın" CTA → /hekimlerimiz (yeni `teamSection.ctaLabel`). Seçki yeni `teamSection.doctors` referanslarından (max 4); boşsa listenin ilk 4'ü. Bileşen client'tan server'a döner (carousel state gider — perf kazancı; use-client-audit allowlist'ten düşer). |
| 15    | Final CTA       | **DSN-64 split (doc'la birebir) korunur**                          | Sol karar metni + altın eyebrow + WhatsApp outline + güven satırı + privacy linki (DSN-78); sağ kompakt form. Cila: form kartına gölge.                                                                                                                                                                                                                                                                                                                                        |
| 16    | SSS             | **Medilo/DentalX iki sütun (DSN-49) korunur**                      | Sol başlık bloğu + sağ flush akordeon; eyebrow/support/CTA CMS'ten.                                                                                                                                                                                                                                                                                                                                                                                                            |

## TR copy (dokümandan çeviri — com seed hedefleri)

| Bölüm | Alan            | TR                                                                                                                                 |
| ----- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 01    | eyebrow         | İleri Diş Hekimliği Gülüş Tasarımıyla Buluşuyor                                                                                    |
| 01    | headline        | Diş Tedavisinden Fazlası. Eksiksiz Bir Gülüş Dönüşümü. _(mevcut, DSN-77 — doküman çevirisi zaten)_                                 |
| 01    | subline         | _(mevcut)_                                                                                                                         |
| 01    | body            | Gerçek dönüşümleri görün, arkasındaki tedavileri keşfedin ve görünüşünüzü ve hissinizi değiştiren bir gülüşe giden ilk adımı atın. |
| 02    | rating/label    | 4,6 / 93 Google Değerlendirmesi _(şube harita kartından doğrulandı — düzenli güncellenecek; uydurma gösterge girilmedi)_           |
| 03    | eyebrow/heading | Dönüşümünüz Doğru Tedaviyle Başlar / Gülüşünüzü Değiştirebilecek Tedaviyi Bulun                                                    |
| 04    | eyebrow/heading | Gerçek Hastalar. Gerçek Dönüşümler. / Eksiksiz Bir Gülüş Değişiminin Nasıl Görüneceğini Görün                                      |
| 06    | eyebrow/heading | Dönüşümünüzü Başlatın / Yeni Gülüşünüze Giden İlk Adımı Atın                                                                       |
| 07    | eyebrow/heading | Yeni Gülüşünüz Tek Bir Mesajla Başlıyor / Gülüş Dönüşümünüz, Adım Adım                                                             |
| 10    | eyebrow/heading | İstanbul'daki Gülüş Yolculuğunuz / Tedavinizi Planlayın. Güvenle Gelin.                                                            |
| 11    | eyebrow/heading | Sonuçlarınız Kalıcı Özeni Hak Ediyor / Eve Döndükten Sonra da Devam Eden Destek                                                    |
| 13    | eyebrow/heading | İstanbul'un Üç Noktasında / Üç İstanbul Kliniği. Tek Bakım Standardı.                                                              |
| 14    | eyebrow/heading | Her Gülüşün Arkasındaki Uzmanlık / Dönüşümünüzün Arkasındaki Diş Hekimlerini Tanıyın · cta: Ekibimizle Tanışın                     |
| 15    | eyebrow         | Yeni Gülüşünüz Burada Başlıyor                                                                                                     |
| 16    | eyebrow/heading | Bilmeniz Gereken Her Şey / Sorularınız, Net Yanıtlarla                                                                             |

Mevcut değerlerle çakışanlar PATCH edilmez, yalnız farklar yazılır (dry-run raporu seed
script'inde). Dokümanın İngilizce metinleri eu/nl dalgasında kendi dillerine girer (ayrı iş).

## Şema değişiklikleri (additive — hepsi data-gated, eu/nl boş bırakılır)

- `homePage.hero.eyebrow` (localeString), `hero.body` (localeText), `hero.sideImages` (imageWithAlt dizisi, max 2)
- `homePage.onceSonraCases[].meta` (localeString — tek satır vaka künyesi)
- `homePage.teamSection.doctors` (doctor referansları, max 4) + `teamSection.ctaLabel` (localeString)
- `homePage.travelStay.image` (imageWithAlt)

GROQ `homePageQuery` projeksiyonları + `content/home.ts` tipleri eşlik eder. Studio ×3 redeploy.

## Bilinçli kapsam dışı

- Filtre çipleri (#04) ve harita embed'i (#13) — gerçek vaka verisi / statik harita görseli gelince ayrı iş
- #05 video bölümü yeniden tasarımı — yalnız eu/nl'de görünür, eu dalgasında
- ticker/about/quickServices/gallery SİLİNMESİ — com config'inden çıkar, kod kalır
- Prod deploy — Aaron onayı (DSN-57'den beri biriken açık kalemlerle birlikte)
