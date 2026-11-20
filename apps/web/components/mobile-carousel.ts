/**
 * DSN-105: mobil carousel makinesi (DSN-91) TEK modülde. 8 bölüm aynı
 * track sınıf dizisini kopyalıyordu — DSN-91 sm/md kesim düzeltmesi tam
 * da bu yüzden dosya dosya elle uygulanmak zorunda kalmıştı. Kesim
 * sonrası grid spesifikasyonu (sm:grid …) bölümün kendisine aittir ve
 * çağrı yerinde birleşir; gap'ler bölümler arasında gerçekten farklıdır
 * (gap-6 / gap-x-6 / gap-4) ve bilinçli olarak çağrıya bırakılır.
 */

/** Tam genişlik mobil track tabanı — gap YOK, çağrı kendi gap'ini ekler. */
export const MOBILE_CAROUSEL_TRACK =
  "-mx-[var(--dvn-container-gutter)] flex snap-x snap-mandatory overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Mobil carousel kart öneki — genişlik/snap; sm üstü yerleşim çağrıda. */
export const MOBILE_CAROUSEL_CARD = "w-[82%] shrink-0 snap-start";
