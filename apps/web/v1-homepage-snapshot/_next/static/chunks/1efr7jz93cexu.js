(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  66083,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(39493),
      a = e.i(70093);
    e.s([
      "default",
      0,
      function ({ error: e, reset: n }) {
        return (
          console.error("[app] global error:", e),
          (0, t.jsx)("html", {
            lang: r.site.defaultLocale,
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
                    children: (0, a.uiString)("errorTitle"),
                  }),
                  (0, t.jsx)("p", { style: { margin: 0 }, children: (0, a.uiString)("errorBody") }),
                  (0, t.jsx)("button", {
                    type: "button",
                    onClick: n,
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
                    children: (0, a.uiString)("errorRetry"),
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
      r = (function (e = "com") {
        let r = t[e];
        if (!r)
          throw Error(`Unknown SITE_ID "${e}". Available sites: ${Object.keys(t).join(", ")}`);
        return r;
      })();
    e.s(["site", 0, r], 39493);
  },
  70093,
  (e) => {
    "use strict";
    e.i(55211);
    let t = {
      errorTitle: "Bir sorun oluştu",
      errorBody: "Sayfa yüklenirken beklenmeyen bir hata oluştu.",
      errorRetry: "Tekrar dene",
      bookCta: "Randevu Al",
      exploreServicesCta: "Tedavilerimizi Keşfedin",
      startReviewCta: "Ücretsiz Ön Değerlendirme Başlatın",
      whatsappCta: "WhatsApp'tan Yazın",
      moduleCta: "Seçenekleri keşfedin",
      googleBadge: "Google Değerlendirmeleri · 5,0",
      patientVideoAlt: "Hasta videosu",
      doctorsRegionAria: "Uzman hekimler",
      doctorsLive: (e, t, r) => `\xd6ne \xe7ıkan: ${e} (${t}/${r})`,
      prevDoctors: "Önceki hekimler",
      nextDoctors: "Sonraki hekimler",
      doctorSlideAria: (e) => `${e}. hekim`,
      prevServices: "Önceki hizmetler",
      nextServices: "Sonraki hizmetler",
      serviceSlideAria: (e) => `${e}. hizmet`,
      lightboxImageAria: (e) => `G\xf6rsel ${e} — b\xfcy\xfct`,
      lightboxFilterAria: "Galeri filtresi",
      prevImages: "Önceki görseller",
      nextImages: "Sonraki görseller",
      galleryImageAria: (e) => `${e}. g\xf6rsel`,
      galleryImageAlt: "Galeri görseli",
      galleryMore: (e) => `+${e} — galeriyi a\xe7`,
      nameLabel: "Ad Soyad *",
      phoneLabel: "Telefon / WhatsApp *",
      phonePlaceholder: "0532 000 00 00",
      preferredTimeLabel: "Tercih edilen arama saati (opsiyonel)",
      emailLabel: "E-posta (opsiyonel)",
      treatmentInterestLabel: "Tedavi ilgisi (opsiyonel)",
      treatmentInterestOptions: {
        "": "Seçiniz",
        implants: "İmplant / eksik diş",
        "full-arch": "Tüm çene (All-on-4/6)",
        smile: "Gülüş tasarımı",
        veneers: "Lamine kaplama",
        crowns: "Zirkonyum kaplama",
        unsure: "Emin değilim",
      },
      contactMethodLabel: "Sizi nasıl aramamızı istersiniz? (opsiyonel)",
      contactMethodOptions: {
        "": "Seçiniz",
        whatsapp: "WhatsApp",
        phone: "Telefon",
        email: "E-posta",
      },
      consentLabel:
        "KVKK aydınlatma metnini okudum; kişisel verilerimin geri arama amacıyla işlenmesine onay veriyorum. *",
      privacyNotice: "Gizlilik Bildirimi",
      submitting: "Gönderiliyor…",
      submitCta: "Geri arama talep et",
      successMessage: "Talebiniz alındı. En kısa sürede size dönüş yapacağız.",
      submitErrorFallback: "Gönderim başarısız oldu. Lütfen tekrar deneyin.",
      connectionError: "Bağlantı hatası. Lütfen tekrar deneyin.",
      themeOpenAria: "Renk paleti seçiciyi aç",
      themeLabel: "Renk paleti",
      themeClose: "Renk paleti seçiciyi kapat",
      paletteNames: {
        espresso: "Espresso",
        gece: "Gece Mavisi",
        deniz: "Deniz Yeşili",
        bordeaux: "Bordeaux",
        zeytin: "Zeytin",
        lila: "Lila",
        okyanus: "Okyanus",
        gul: "Gül",
        tarcin: "Tarçın",
        orman: "Orman",
      },
    };
    e.s([
      "uiString",
      0,
      function (e) {
        return t[e];
      },
    ]);
  },
  33627,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useRouterBFCache", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let a = e.r(4211);
    function n(e, t, r) {
      let [n, l] = (0, a.useState)(() => ({ tree: e, cacheNode: t, stateKey: r, next: null }));
      if (n.tree === e) return n;
      let o = { tree: e, cacheNode: t, stateKey: r, next: null },
        i = 1,
        u = n,
        s = o;
      for (; null !== u && i < 1;) {
        if (u.stateKey === r) {
          s.next = u.next;
          break;
        }
        {
          i++;
          let e = { tree: u.tree, cacheNode: u.cacheNode, stateKey: u.stateKey, next: null };
          ((s.next = e), (s = e));
        }
        u = u.next;
      }
      return (l(o), o);
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  26447,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "ClientPageRoot", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    let a = e.r(27693),
      n = e.r(94662),
      l = e.r(4211),
      o = e.r(48607),
      i = e.r(41481),
      u = e.r(20095);
    function s({ Component: e, serverProvidedParams: t }) {
      let r, c;
      if (null !== t) ((r = t.searchParams), (c = t.params));
      else {
        let e = (0, l.use)(n.LayoutRouterContext);
        ((c = null !== e ? e.parentParams : {}),
          (r = (0, o.urlSearchParamsToParsedUrlQuery)((0, l.use)(i.SearchParamsContext))));
      }
      let d = (0, u.createClientSearchParams)(r),
        f = (0, u.createClientParams)(c);
      return (0, a.jsx)(e, { params: f, searchParams: d });
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  5164,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "ClientSegmentRoot", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let a = e.r(27693),
      n = e.r(94662),
      l = e.r(4211),
      o = e.r(20095);
    function i({ Component: e, slots: t, serverProvidedParams: r }) {
      let u;
      if (null !== r) u = r.params;
      else {
        let e = (0, l.use)(n.LayoutRouterContext);
        u = null !== e ? e.parentParams : {};
      }
      let s = (0, o.createClientParams)(u);
      return (0, a.jsx)(e, { ...t, params: s });
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  56901,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "HTTPAccessFallbackBoundary", {
        enumerable: !0,
        get: function () {
          return c;
        },
      }));
    let a = e.r(56421),
      n = e.r(27693),
      l = a._(e.r(4211)),
      o = e.r(44606),
      i = e.r(53624),
      u = e.r(94662);
    class s extends l.default.Component {
      constructor(e) {
        (super(e), (this.state = { triggeredStatus: void 0, previousPathname: e.pathname }));
      }
      componentDidCatch() {}
      static getDerivedStateFromError(e) {
        if ((0, i.isHTTPAccessFallbackError)(e))
          return { triggeredStatus: (0, i.getAccessFallbackHTTPStatus)(e) };
        throw e;
      }
      static getDerivedStateFromProps(e, t) {
        return e.pathname !== t.previousPathname && t.triggeredStatus
          ? { triggeredStatus: void 0, previousPathname: e.pathname }
          : { triggeredStatus: t.triggeredStatus, previousPathname: e.pathname };
      }
      render() {
        let { notFound: e, forbidden: t, unauthorized: r, children: a } = this.props,
          { triggeredStatus: l } = this.state,
          o = {
            [i.HTTPAccessErrorStatus.NOT_FOUND]: e,
            [i.HTTPAccessErrorStatus.FORBIDDEN]: t,
            [i.HTTPAccessErrorStatus.UNAUTHORIZED]: r,
          };
        if (l) {
          let u = l === i.HTTPAccessErrorStatus.NOT_FOUND && e,
            s = l === i.HTTPAccessErrorStatus.FORBIDDEN && t,
            c = l === i.HTTPAccessErrorStatus.UNAUTHORIZED && r;
          return u || s || c
            ? (0, n.jsxs)(n.Fragment, {
                children: [(0, n.jsx)("meta", { name: "robots", content: "noindex" }), !1, o[l]],
              })
            : a;
        }
        return a;
      }
    }
    function c({ notFound: e, forbidden: t, unauthorized: r, children: a }) {
      let i = (0, o.useUntrackedPathname)(),
        d = (0, l.useContext)(u.MissingSlotContext);
      return e || t || r
        ? (0, n.jsx)(s, {
            pathname: i,
            notFound: e,
            forbidden: t,
            unauthorized: r,
            missingSlots: d,
            children: a,
          })
        : (0, n.jsx)(n.Fragment, { children: a });
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  20213,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var a = {
      InstantValidationBoundaryContext: function () {
        return l;
      },
      PlaceValidationBoundaryBelowThisLevel: function () {
        return o;
      },
      RenderValidationBoundaryAtThisLevel: function () {
        return i;
      },
      SlotMarker: function () {
        return u;
      },
    };
    for (var n in a) Object.defineProperty(r, n, { enumerable: !0, get: a[n] });
    let l = null,
      o = null,
      i = null,
      u = null;
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  47022,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var a = {
      InstantValidationBoundaryContext: function () {
        return l.InstantValidationBoundaryContext;
      },
      PlaceValidationBoundaryBelowThisLevel: function () {
        return l.PlaceValidationBoundaryBelowThisLevel;
      },
      RenderValidationBoundaryAtThisLevel: function () {
        return l.RenderValidationBoundaryAtThisLevel;
      },
      SlotMarker: function () {
        return l.SlotMarker;
      },
    };
    for (var n in a) Object.defineProperty(r, n, { enumerable: !0, get: a[n] });
    let l = e.r(20213);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  35218,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var a = {
      LoadingBoundaryProvider: function () {
        return S;
      },
      default: function () {
        return T;
      },
    };
    for (var n in a) Object.defineProperty(r, n, { enumerable: !0, get: a[n] });
    let l = e.r(36437),
      o = e.r(56421),
      i = e.r(27693),
      u = o._(e.r(4211)),
      s = l._(e.r(94503)),
      c = e.r(94662),
      d = e.r(92633),
      f = e.r(76688),
      m = e.r(7688),
      p = e.r(81975),
      b = e.r(56901);
    e.r(47022);
    let h = e.r(32896),
      g = e.r(33627);
    e.r(63002);
    let y = e.r(41481),
      v = e.r(48607),
      _ = e.r(36872);
    s.default.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function x(e, t, r) {
      let a = e.getClientRects();
      if (0 === a.length) return 0;
      let n = 1 / 0;
      for (let e = 0; e < a.length; e++) {
        let t = a[e];
        t.top < n && (n = t.top);
      }
      return n >= r() && n <= t ? 1 : 2;
    }
    u.default.Component;
    let P = function (e) {
      let t = u.default.useRef(null);
      return (
        (0, u.useLayoutEffect)(
          () => {
            let { focusAndScrollRef: r, cacheNode: a } = e,
              n = r.forceScroll ? r.scrollRef : a.scrollRef;
            if (null === n || !n.current) return;
            let l = null,
              o = r.hashFragment;
            if (o) {
              var i;
              if (
                null ===
                (l =
                  "top" === (i = o)
                    ? document.body
                    : (document.getElementById(i) ?? document.getElementsByName(i)[0] ?? null))
              ) {
                ((n.current = !1), (r.onlyHashChange = !1), (r.hashFragment = null));
                return;
              }
            } else l = t.current;
            if (null === l) return;
            let u = !1;
            ((0, m.disableSmoothScrollDuringRouteTransition)(
              () => {
                let e = document.documentElement,
                  t = null,
                  r = null,
                  a = null,
                  i = () => {
                    var r, n;
                    let l, o;
                    return (
                      null === a &&
                        ((r = e),
                        (n = t),
                        (a =
                          !Number.isFinite(
                            (o = Number.parseFloat((l = getComputedStyle(r).scrollPaddingTop))),
                          ) || o < 0
                            ? 0
                            : l.endsWith("px")
                              ? o
                              : l.endsWith("%")
                                ? (o / 100) * n
                                : 0)),
                      a
                    );
                  };
                (o || ((t = e.clientHeight), 0 !== (r = x(l, t, i)))) &&
                  (((u = !0), (n.current = !1), o)
                    ? l.scrollIntoView()
                    : 1 !== r && ((e.scrollTop = 0), 2 === x(l, t, i) && l.scrollIntoView()));
              },
              { dontForceLayout: !0, onlyHashChange: r.onlyHashChange },
            ),
              u && ((r.onlyHashChange = !1), (r.hashFragment = null)));
          },
          void 0,
        ),
        (0, i.jsx)(u.Fragment, { ref: t, children: e.children })
      );
    };
    function j({ children: e, cacheNode: t }) {
      let r = (0, u.useContext)(c.GlobalLayoutRouterContext);
      if (!r)
        throw Object.defineProperty(
          Error("invariant global layout router not mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E473", enumerable: !1, configurable: !0 },
        );
      return (0, i.jsx)(P, { focusAndScrollRef: r.focusAndScrollRef, cacheNode: t, children: e });
    }
    function O({
      tree: e,
      segmentPath: t,
      debugNameContext: r,
      cacheNode: a,
      params: n,
      url: l,
      isActive: o,
    }) {
      let s,
        f = (0, u.useContext)(c.GlobalLayoutRouterContext);
      if (((0, u.useContext)(y.NavigationPromisesContext), !f))
        throw Object.defineProperty(
          Error("invariant global layout router not mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E473", enumerable: !1, configurable: !0 },
        );
      let m = null !== a ? a : (0, u.use)(d.unresolvedThenable),
        p = null !== m.prefetchRsc ? m.prefetchRsc : m.rsc,
        b = (0, u.useDeferredValue)(m.rsc, p);
      if ((0, _.isDeferredRsc)(b)) {
        let e = (0, u.use)(b);
        (null === e && (0, u.use)(d.unresolvedThenable), (s = e));
      } else (null === b && (0, u.use)(d.unresolvedThenable), (s = b));
      let h = s;
      return (0, i.jsx)(c.LayoutRouterContext.Provider, {
        value: {
          parentTree: e,
          parentCacheNode: m,
          parentSegmentPath: t,
          parentParams: n,
          parentLoadingData: null,
          debugNameContext: r,
          url: l,
          isActive: o,
        },
        children: h,
      });
    }
    function S({ loading: e, children: t }) {
      let r = (0, u.use)(c.LayoutRouterContext);
      return null === r
        ? t
        : (0, i.jsx)(c.LayoutRouterContext.Provider, {
            value: {
              parentTree: r.parentTree,
              parentCacheNode: r.parentCacheNode,
              parentSegmentPath: r.parentSegmentPath,
              parentParams: r.parentParams,
              parentLoadingData: e,
              debugNameContext: r.debugNameContext,
              url: r.url,
              isActive: r.isActive,
            },
            children: t,
          });
    }
    function C({ name: e, loading: t, children: r }) {
      if (null !== t) {
        let a = t[0],
          n = t[1],
          l = t[2];
        return (0, i.jsx)(u.Suspense, {
          name: e,
          fallback: (0, i.jsxs)(i.Fragment, { children: [n, l, a] }),
          children: r,
        });
      }
      return (0, i.jsx)(i.Fragment, { children: r });
    }
    function T({
      parallelRouterKey: e,
      error: t,
      errorStyles: r,
      errorScripts: a,
      templateStyles: n,
      templateScripts: l,
      template: o,
      notFound: s,
      forbidden: m,
      unauthorized: y,
      segmentViewBoundaries: _,
    }) {
      let x = (0, u.useContext)(c.LayoutRouterContext);
      if (!x)
        throw Object.defineProperty(
          Error("invariant expected layout router to be mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E56", enumerable: !1, configurable: !0 },
        );
      let {
          parentTree: P,
          parentCacheNode: S,
          parentSegmentPath: k,
          parentParams: R,
          parentLoadingData: M,
          url: A,
          isActive: E,
          debugNameContext: z,
        } = x,
        F = P[0],
        B = null === k ? [e] : k.concat([F, e]),
        L = P[1][e],
        N = S.slots;
      (void 0 === L || null === N) && (0, u.use)(d.unresolvedThenable);
      let w = L[0],
        D = N[e] ?? null,
        I = (0, h.createRouterCacheKey)(w, !0),
        H = (0, g.useRouterBFCache)(L, D, I),
        U = [];
      do {
        let e = H.tree,
          u = H.cacheNode,
          d = H.stateKey,
          h = e[0],
          g = R;
        if (Array.isArray(h)) {
          let e = h[0],
            t = h[1],
            r = h[2],
            a = (0, v.getParamValueFromCacheKey)(t, r);
          null !== a && (g = { ...R, [e]: a });
        }
        let _ = (function (e) {
            if ("/" === e) return "/";
            if ("string" == typeof e)
              if ("(__SLOT__)" === e) return;
              else return e + "/";
            return e[1] + "/";
          })(h),
          x = _ ?? z,
          P = void 0 === _ ? void 0 : z,
          S = (0, i.jsxs)(j, {
            cacheNode: u,
            children: [
              (0, i.jsx)(f.ErrorBoundary, {
                errorComponent: t,
                errorStyles: r,
                errorScripts: a,
                children: (0, i.jsx)(C, {
                  name: P,
                  loading: M,
                  children: (0, i.jsx)(b.HTTPAccessFallbackBoundary, {
                    notFound: s,
                    forbidden: m,
                    unauthorized: y,
                    children: (0, i.jsxs)(p.RedirectBoundary, {
                      children: [
                        (0, i.jsx)(O, {
                          url: A,
                          tree: e,
                          params: g,
                          cacheNode: u,
                          segmentPath: B,
                          debugNameContext: x,
                          isActive: E && d === I,
                        }),
                        null,
                      ],
                    }),
                  }),
                }),
              }),
              null,
            ],
          }),
          T = (0, i.jsxs)(c.TemplateContext.Provider, { value: S, children: [n, l, o] }, d);
        (U.push(T), (H = H.next));
      } while (null !== H);
      return U;
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  15895,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let a = e.r(56421),
      n = e.r(27693),
      l = a._(e.r(4211)),
      o = e.r(94662);
    function i() {
      let e = (0, l.useContext)(o.TemplateContext);
      return (0, n.jsx)(n.Fragment, { children: e });
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  58490,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createRenderParamsFromClient", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let a = new WeakMap();
    function n(e) {
      let t = a.get(e);
      if (t) return t;
      let r = Promise.resolve(e);
      return (a.set(e, r), r);
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  48477,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createRenderParamsFromClient", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let a = e.r(58490).createRenderParamsFromClient;
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  13600,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createRenderSearchParamsFromClient", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let a = new WeakMap();
    function n(e) {
      let t = a.get(e);
      if (t) return t;
      let r = Promise.resolve(e);
      return (a.set(e, r), r);
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  72015,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createRenderSearchParamsFromClient", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let a = e.r(13600).createRenderSearchParamsFromClient;
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  20095,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var a = {
      createClientParams: function () {
        return l.createRenderParamsFromClient;
      },
      createClientSearchParams: function () {
        return o.createRenderSearchParamsFromClient;
      },
    };
    for (var n in a) Object.defineProperty(r, n, { enumerable: !0, get: a[n] });
    let l = e.r(48477),
      o = e.r(72015);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  45652,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "IconMark", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let a = e.r(27693),
      n = () => ("u" > typeof window ? null : (0, a.jsx)("meta", { name: "«nxt-icon»" }));
  },
  7688,
  (e, t, r) => {
    "use strict";
    function a(e, t = {}) {
      if (t.onlyHashChange) return void e();
      let r = document.documentElement;
      if ("smooth" !== r.dataset.scrollBehavior) return void e();
      let n = r.style.scrollBehavior;
      ((r.style.scrollBehavior = "auto"),
        t.dontForceLayout || r.getClientRects(),
        e(),
        (r.style.scrollBehavior = n));
    }
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "disableSmoothScrollDuringRouteTransition", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
  },
]);
