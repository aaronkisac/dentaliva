# Dentaliva Tasarım Denetimi — 2026-10-06

- **Hedef:** https://dentaliva-com-staging.dentaliva.workers.dev (main HEAD 2ebc213 + production dataset)
- **Yöntem:** gstack headless Chromium (browse.exe + server-node.mjs; Windows junction kurulumu, bak: sonraki bölüm), 1280×720 / 1440×900 / 768×1024 / 375×812; sayfa-içi JS probu (font, renk, başlık ölçeği, dokunma hedefi, odak, opaklık); ilk tam denetim (baseline kuruldu).
- **Kalibrasyon:** `packages/tokens/src/tokens.ts` (espresso/bronze/fildişi; Cormorant Garamond + Montserrat; kare köşe marka), ADR-005/008, DSN-23..35 kararları. DESIGN.md yok.
- Ekran görüntüleri: `~/.gstack/projects/aaronkisac-dental-clinic/designs/design-audit-20261006/screenshots/`

## İlk izlenim (anasayfa)

Site **"kurumsal ama sıcak, lüks klinik"** iletiyor. Göz sırasıyla: (1) büyük serif başlık, (2) altın Randevu Al butonu, (3) tam ekran klinik fotoğrafı. Hiyerarşi doğru çalışıyor — ancak sayfa kaydırınca **tedavi grid'i hiç görünmüyor** (bkz. FINDING-001): hero ile videolar bölümü arasında binlerce piksellik boşluk var. Tek kelime: **"dengeli"** — içerik hatası düzelene kadar kullanıcıya ulaşan hâliyle **"yarım"**.

## Çıkarılan Tasarım Sistemi

| Boyut                 | Bulgu                                             | Not                     |
| --------------------- | ------------------------------------------------- | ----------------------- |
| Font aileleri         | 2 (Cormorant Garamond serif + Montserrat sans)    | ✅ ≤3, yasaklı font yok |
| Başlık ölçeği         | H1 64 / H2 40 / H3 24 — token ölçeğiyle birebir   | ✅ sistematik           |
| Palet                 | espresso #1c1610, bronze #c09a55, fildişi #faf9f6 | ✅ tutarlı sıcak palet  |
| Köşe                  | 0/4px (kare marka karakteri)                      | ✅                      |
| Odak halkası          | 2px altın (#c09a55) linklerde                     | ✅ markalı              |
| ::selection/scrollbar | yok (tarayıcı varsayılanı)                        | ⚠️ FINDING-006          |
| text-wrap             | başlıklarda `wrap` (balance yok)                  | ⚠️ P-01                 |

## Bulgular

### FINDING-001 — HIGH · motion/tüm site

**Reveal `threshold: 0.15` uzun bölümleri kalıcı olarak gizliyor.** `packages/ui/src/reveal.tsx:40` — elementin %15'i görünmeden reveal tetiklenmiyor. Ana sayfa tedavi grid'i tek Reveal sarmalayıcısında **5061px** → %15 = 759px > 720px (yaygın 1280×720 masaüstü) → **tetiklenemez**. Aynı sebeple görünmez: `/hizmetlerimiz` liste gövdesi, `/blog` liste gövdesi, hizmet detayı gövde+Faydalar+Tedavi Süreci bölümleri; mobilde daha da uzun (stack) olduğundan orada da görünmez. Kullanıcı hero'dan sonra devasa boşluk görüyor. Kanıt: `screenshots/hizmetlerimiz.jpg` (hero+boşluk+footer), `home-full.jpg`, `mobile-home.jpg`.
**Çözüm:** threshold'u element boyutundan bağımsız hale getir: `threshold: 0` + `rootMargin: "0px 0px -15% 0px"` (eleman viewport'un alt %15 çizgisini geçince tetiklenir — kısa kartlarda bugünkü davranışın aynısı, uzun bölümlerde girişte tetiklenir).

### FINDING-002 — MEDIUM · renk/kontrast

**Header "Dentaliva" wordmark'ı şeffaf (hero üstü) durumda koyu kalıyor.** Nav linkleri, telefon, buton beyaz; serif wordmark mürekkep rengi — anasayfa hero'sunda (mobil + masaüstü) okunmuyor. `packages/ui/src/header.tsx` wordmark rengi scroll durumuna bağlı değil.

### FINDING-003 — MEDIUM · performans/konsol hijyeni

**Her iç rotada RSC prefetch 404'leri.** `/{route}/__next.{route}.__PAGE__.txt?_rsc=…` istekleri tüm listeleme sayfalarında 404 (Next 16.3.6 + `output: "export"` build'inde bu prefetch dosyaları üretilmiyor). SPA gezinme çalışıyor (Next doküman yüklemesine düşüyor) ama konsol gürültüsü + ön-ön bellek kaybı. Çözüm: `packages/ui/src/link.tsx` NextLink'te `prefetch={false}` (statik CF edge sitesinde kazanç zaten minimal).

### FINDING-004 — MEDIUM · erişilebilirlik/dokunma

**KVKK onay kutusu 16×16** (WCAG 2.5.8 min 24px), form submit butonu 40px, carousel okları 40×40. Form input'ları 50px ✅.

### FINDING-005 — MEDIUM · ikon dili

**Carousel okları unicode `←`/`→`** — DSN-23 burger'in SVG'ye taşınma kararıyla tutarsız; platform fontuna göre görünüm değişir. SVG ok bileşeni + 44px hedef.

### FINDING-006 — POLISH · tarayıcı yüzeyleri

`::selection`, scrollbar, caret marka renklerinde değil (globals.css'te tanım yok). Metin seçimi tarayıcı mavisinde kalıyor.

### FINDING-007 — MEDIUM · tutarlılık

**`/iletisim` PageHero kalıbının dışında** (fildişi zeminde çıplak H1; diğer tüm sayfalar espresso bant + eyebrow). Ayrıca sol kolon telefon/e-posta altında ~300px ölü alan (harita facade'ı ayrı iş olarak bekleniyor — bu deliği kapatmalı).

### FINDING-008 — İZLEME · performans (kod değişikliği gerekmedi)

**Font preload uyarıları:** `cormorant-latin-ext.woff2` + `montserrat-latin.woff2` "preloaded but not used". Kök neden incelendi: preload işaretlemesi doğru (`crossOrigin="anonymous"` mevcut, PRF-5). Uyarı `font-display: optional`'ın bilinen sezgisel davranışı — tarayıcı ilk boyamada fontu kullanmaya karar vermezse preload kullanılmamış sayılır. Kod değişikliği YOK; staging'de gözlemlenmeye devam.

### FINDING-009 — MEDIUM · CMS verisi (kod düzeltmesi değil)

- Dr. Şehmus Saygın kartında **klinik koridor fotoğrafı** var (portre değil).
- Birden çok hekimde unvan tekrarı "Dr. Dr." (ör. Dr. Dt. M. Cihan Babuccu).
- Unvan hiyerarşisi karışık: "Diş Hekimi" / "DİŞ HEKİMİ" karışık kayıtlı.

### FINDING-010 — DÜZELTİLDİ (kısmen yanlış pozitif) · etkileşim durumu

Form input'larında odak halkası **aslında var** (`controlClassName`: `focus:border-gold focus:outline-2 focus:outline-gold`) — prob gizli honeypot alanına odaklanmış. Kalan geçerli kısım: header nav hedefleri 36px (WCAG AA geçer, 44px kılavuz altı) — kabul edilebilir, dokunma düzeltmeleri DSN-38/39'da.

## Polish notları

- P-01: serif başlıklara `text-wrap: balance` (mobil hero 6 satır, son satır kısa).
- P-02: hero fotoğrafı mavi tonlu — sıcak espresso/bronze paletle soğuk çatlıyor (içerik yönlendirmesi; overlay zaten espresso).
- P-03: hekim detayı hero'sunda portrenin sağı boş; "Unvan:" satırı hero alt başlığını tekrarlıyor; CV düz metin çizgi-liste (DSN-32 kapsamı dışı bırakıldı — bilinen borç).
- P-04: hakkımızda galerisindeki "+19 fotoğraf" kutusu biçimsiz beyaz kart görünüyor.

## Akışlar (goodwill)

1. Mobil kullanıcı: açılış → menü → randevu CTA → iletişim. 70 → 90 (menü temiz, CTA belirgin, form etiketli). SAĞLIKLI.
2. Hasta tedavi arıyor: anasayfa → Hizmetlerimiz. **-15 liste boş, -15 geri dönüş yok** → 40/100. KRİTİK (FINDING-001).
3. Hizmet detayı okuyucusu: liste → detay. Gövde bölümleri boş (-15) → detay FAQ + CTA çalışıyor. FINDING-001 aynı kök.

## Trunk testi

Anasayfa/hakkımızda/hekimlerimiz/şubelerimiz: PASS. hizmetlerimiz/blog: PARTIAL (gövde görünmüyor — site kimliği + nav net, sayfa içeriği yok). İletişim: PASS.

## Notlar (kategori harf notları)

hierarchy B+ · typography A- · color B · spacing B+ · interaction C+ · responsive B · motion C (F-001 içerik bug'ı yüzünden) · content B · ai-slop A (şablon kokusu sıfır — kimlik güçlü) · performance-as-design B

**Genel: B — FINDING-001 düzelince A- bandına çıkar.**

## Bilinen borçlar (bu denetimin kapsamı dışı — ayrı işler)

Copy sweep Faz 2 (siteCopy mimarisi: footer/bölüm başlıkları, hero güven satırı, aria copy'leri) · WhatsApp bandı (numara onayı) · önce/sonra fotoğrafları (Aaron) · CPT-8 production deploy · yapılandırılmış CV (DSN-32 kararı) · harita facade'ı.
