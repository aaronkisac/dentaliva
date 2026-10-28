import { defineField, defineType } from "sanity";

/**
 * DSN-73: kategorili klinik foto kütüphanesi — fotoğraflar bir kez, kategori
 * etiketiyle girilir; şube galerileri (branch.gallery) bu dokümanlara
 * referansla seçer. Böylece aynı fotoğraf birden çok şubede kullanılabilir
 * ve Studio'nun referans seçicisinde kategoriyle ayırt edilir.
 */
export const clinicPhoto = defineType({
  name: "clinicPhoto",
  title: "Klinik Fotoğrafı",
  type: "document",
  fields: [
    defineField({ name: "photo", title: "Fotoğraf", type: "imageWithAlt" }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Dış Görünüm", value: "dis-gorunum" },
          { title: "Resepsiyon", value: "resepsiyon" },
          { title: "Bekleme Alanı", value: "bekleme-alani" },
          { title: "Tedavi Odası", value: "tedavi-odasi" },
          { title: "Sterilizasyon", value: "sterilizasyon" },
          { title: "Cihaz ve Teknoloji", value: "cihaz-teknoloji" },
          { title: "Ekip", value: "ekip" },
          { title: "Diğer", value: "diger" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "photo.alt.tr", media: "photo", subtitle: "category" },
  },
});
