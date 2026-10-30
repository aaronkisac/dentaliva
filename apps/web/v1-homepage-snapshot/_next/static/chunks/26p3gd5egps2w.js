(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  66083,
  (e) => {
    "use strict";
    var t = e.i(27693),
      a = e.i(39493),
      r = e.i(70093);
    e.s([
      "default",
      0,
      function ({ error: e, reset: i }) {
        return (
          console.error("[app] global error:", e),
          (0, t.jsx)("html", {
            lang: a.site.defaultLocale,
            children: (0, t.jsx)("body", {
              style: {
                margin: 0,
                backgroundColor: "#faf9f6",
                color: "#2b2620",
                fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
              },
              children: (0, t.jsxs)("main", {
                style: {
                  minHeight: "50vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  padding: "96px 24px",
                  textAlign: "center",
                },
                children: [
                  (0, t.jsx)("h1", {
                    style: {
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "48px",
                      margin: 0,
                    },
                    children: (0, r.uiString)("errorTitle"),
                  }),
                  (0, t.jsx)("p", { style: { margin: 0 }, children: (0, r.uiString)("errorBody") }),
                  (0, t.jsx)("button", {
                    type: "button",
                    onClick: i,
                    style: {
                      marginTop: "8px",
                      border: "1px solid #c09a55",
                      background: "transparent",
                      color: "#1c1610",
                      padding: "12px 24px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    },
                    children: (0, r.uiString)("errorRetry"),
                  }),
                ],
              }),
            }),
          })
        );
      },
    ]);
  },
  39493,
  (e) => {
    "use strict";
    let t = {
        com: {
          id: "com",
          domain: "www.dentaliva.com",
          locales: ["tr"],
          defaultLocale: "tr",
          sanity: { projectId: "86x2hbzv", dataset: "production", stagingDataset: "staging" },
          sisterDomains: ["dentaliva.eu", "dentaliva.nl"],
          routes: {
            about: "/hakkimizda",
            treatments: "/hizmetlerimiz",
            doctors: "/hekimlerimiz",
            branches: "/subelerimiz",
            blog: "/blog",
            contact: "/iletisim",
            gallery: "/fotograf-galerisi",
            legal: "/kvkk",
          },
          nav: [
            { label: "Hakkımızda", href: "/hakkimizda" },
            { label: "Tedavilerimiz", href: "/hizmetlerimiz" },
            { label: "Hekimlerimiz", href: "/hekimlerimiz" },
            { label: "Şubelerimiz", href: "/subelerimiz" },
            { label: "Blog", href: "/blog" },
            { label: "İletişim", href: "/iletisim" },
          ],
          features: { chatbotApi: !0, blog: !0 },
          sections: {
            home: [
              "hero",
              "ticker",
              "trustStrip",
              "about",
              "treatmentPaths",
              "quickServices",
              "onceSonra",
              "videoTestimonials",
              "reviewForm",
              "howItWorks",
              "decisionModules",
              "travelStay",
              "aftercare",
              "reviews",
              "clinics",
              "gallery",
              "doctors",
              "faq",
              "cta",
            ],
          },
        },
        eu: {
          id: "eu",
          domain: "www.dentaliva.eu",
          locales: ["en"],
          defaultLocale: "en",
          sanity: { projectId: "84n9qnfg", dataset: "production", stagingDataset: "staging" },
          sisterDomains: ["dentaliva.com", "dentaliva.nl"],
          routes: {
            about: "/about",
            treatments: "/services",
            doctors: "/doctors",
            branches: "/branches",
            blog: "/blog",
            contact: "/contact",
            gallery: "/gallery",
            legal: "/privacy",
          },
          nav: [
            { label: "About Us", href: "/about" },
            { label: "Our Treatments", href: "/services" },
            { label: "Our Doctors", href: "/doctors" },
            { label: "Branches", href: "/branches" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ],
          features: { chatbotApi: !1, blog: !0 },
          sections: {
            home: [
              "hero",
              "ticker",
              "trustStrip",
              "about",
              "treatmentPaths",
              "quickServices",
              "onceSonra",
              "videoTestimonials",
              "reviewForm",
              "howItWorks",
              "decisionModules",
              "travelStay",
              "aftercare",
              "reviews",
              "clinics",
              "gallery",
              "doctors",
              "faq",
              "cta",
            ],
          },
        },
        nl: {
          id: "nl",
          domain: "www.dentaliva.nl",
          locales: ["nl"],
          defaultLocale: "nl",
          sanity: { projectId: "x8kdvsh2", dataset: "production", stagingDataset: "staging" },
          sisterDomains: ["dentaliva.com", "dentaliva.eu"],
          routes: {
            about: "/over-ons",
            treatments: "/behandelingen",
            doctors: "/onze-tandartsen",
            branches: "/onze-filialen",
            blog: "/blog",
            contact: "/contact",
            gallery: "/fotogalerij",
            legal: "/privacybeleid",
          },
          nav: [
            { label: "Over ons", href: "/over-ons" },
            { label: "Behandelingen", href: "/behandelingen" },
            { label: "Onze Tandartsen", href: "/onze-tandartsen" },
            { label: "Vestigingen", href: "/onze-filialen" },
            { label: "Contact", href: "/contact" },
          ],
          features: { chatbotApi: !1, blog: !1 },
          sections: {
            home: [
              "hero",
              "ticker",
              "trustStrip",
              "about",
              "treatmentPaths",
              "quickServices",
              "onceSonra",
              "videoTestimonials",
              "reviewForm",
              "howItWorks",
              "decisionModules",
              "travelStay",
              "aftercare",
              "reviews",
              "clinics",
              "gallery",
              "doctors",
              "faq",
              "cta",
            ],
          },
        },
      },
      a = (function (e = "com") {
        let a = t[e];
        if (!a)
          throw Error(`Unknown SITE_ID "${e}". Available sites: ${Object.keys(t).join(", ")}`);
        return a;
      })();
    e.s(["site", 0, a], 39493);
  },
]);
