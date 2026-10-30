(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  7542,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(27867),
      i = e.i(4211),
      n = e.i(52864),
      a = e.i(31345),
      o = e.i(6563),
      l = e.i(29347),
      s = e.i(70093);
    let d = (0, o.imageTarget)(),
      u = [
        { id: "klinik", label: "Klinik" },
        { id: "onceSonra", label: "Önce / Sonra" },
      ];
    function c(e, t) {
      return "onceSonra" === t && e > 3 ? "carousel" : "grid";
    }
    function f(e, t) {
      return 5 === t ? (0 === e ? "feature" : null) : t < 6 ? null : e % 7 == 0 ? "feature" : null;
    }
    let h = { feature: "col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2" },
      m =
        "flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/25 bg-navy-3/90 text-white transition-colors duration-300 hover:bg-gold hover:text-navy hover:border-gold disabled:pointer-events-none disabled:opacity-40";
    function g({ items: e, active: i, closeLabel: o, onClose: l, onNavigate: u }) {
      let c = e[i],
        f = c?.asset?._ref,
        h = f ? ((0, a.refDimensions)(f) ?? { width: 1600, height: 1200 }) : null,
        p = (0, n.t)(c?.alt);
      return (0, t.jsxs)("div", {
        className: "relative p-3 md:p-4",
        children: [
          o
            ? (0, t.jsxs)("button", {
                type: "button",
                onClick: l,
                className:
                  "absolute -top-1 right-3 z-10 translate-y-[-100%] rounded-[4px] border border-white/25 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-ivory transition-colors duration-300 hover:bg-gold hover:text-navy md:right-4",
                children: [o, " ✕"],
              })
            : null,
          (0, t.jsx)("button", {
            type: "button",
            "aria-label": (0, s.uiString)("prevImages"),
            onClick: () => u(-1),
            disabled: 0 === i,
            className: `absolute left-4 top-1/2 z-10 -translate-y-1/2 ${m}`,
            children: (0, t.jsx)("svg", {
              "aria-hidden": "true",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "h-4 w-4",
              children: (0, t.jsx)("path", { d: "M19 12H5m0 0 6-6m-6 6 6 6" }),
            }),
          }),
          (0, t.jsx)("button", {
            type: "button",
            "aria-label": (0, s.uiString)("nextImages"),
            onClick: () => u(1),
            disabled: i === e.length - 1,
            className: `absolute right-4 top-1/2 z-10 -translate-y-1/2 ${m}`,
            children: (0, t.jsx)("svg", {
              "aria-hidden": "true",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "h-4 w-4",
              children: (0, t.jsx)("path", { d: "M5 12h14m0 0-6-6m6 6-6 6" }),
            }),
          }),
          (0, t.jsxs)("div", {
            className: "rounded-[4px] border border-[var(--dvn-line-gold)] bg-navy-2/60 p-2 md:p-3",
            children: [
              c && h
                ? (0, t.jsx)(r.default, {
                    src: f,
                    alt: p || "Büyük görsel",
                    width: h.width,
                    height: h.height,
                    sizes: "90vw",
                    placeholder: "blur",
                    blurDataURL: c.lqip ?? (0, a.lqipUrl)(f, d),
                    className:
                      "mx-auto h-auto max-h-[78dvh] w-auto max-w-[86vw] rounded-[2px] object-contain",
                  })
                : null,
              (0, t.jsxs)("div", {
                className:
                  "mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-3",
                children: [
                  (0, t.jsxs)("span", {
                    className: "flex min-w-0 items-center gap-2.5",
                    children: [
                      (0, t.jsx)("span", {
                        "aria-hidden": "true",
                        className: "h-px w-5 shrink-0 bg-gold",
                      }),
                      (0, t.jsx)("span", {
                        className: "truncate font-sans text-sm text-ivory/80",
                        children: p ?? "",
                      }),
                    ],
                  }),
                  (0, t.jsxs)("span", {
                    className:
                      "font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft [font-variant-numeric:tabular-nums]",
                    children: [i + 1, " / ", e.length],
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
    e.s([
      "GalleryLightbox",
      0,
      function ({ images: e, onceSonra: o, closeLabel: m }) {
        let p = (0, i.useRef)(null),
          [b, v] = (0, i.useState)(null),
          [x, y] = (0, i.useState)("klinik"),
          w = (0, i.useRef)(null);
        (0, i.useEffect)(() => {
          let e = p.current;
          null === b ? e?.close() : e && !e.open && e.showModal();
        }, [b]);
        let j = e.filter((e) => e.asset?._ref),
          k = (o ?? []).filter((e) => e.asset?._ref),
          S = k.length > 0 ? ("klinik" === x ? j : k) : j,
          _ = "carousel" === c(k.length, x),
          C = (0, l.useTrackCarousel)(_ ? k.length : 0),
          z = (e) => {
            v((t) => (null === t ? t : Math.min(S.length - 1, Math.max(0, t + e))));
          },
          E = (e, i, o) => {
            let l = e.asset?._ref,
              u = (0, a.refDimensions)(l) ?? { width: 800, height: 800 },
              c = (0, n.t)(e.alt);
            return (0, t.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => v(i),
                className:
                  "group relative overflow-hidden rounded-[4px] bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                  (o ? h[o] : "aspect-square") +
                  (_ ? " dvn-carousel-card shrink-0 snap-start" : ""),
                "aria-label": (0, s.uiString)("lightboxImageAria")(i + 1),
                children: [
                  (0, t.jsx)(r.default, {
                    src: l,
                    alt: c || `Galeri g\xf6rseli ${i + 1}`,
                    width: u.width,
                    height: u.height,
                    sizes: o ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw",
                    placeholder: "blur",
                    blurDataURL: e.lqip ?? (0, a.lqipUrl)(l, d),
                    className:
                      "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none",
                  }),
                  c
                    ? (0, t.jsxs)("span", {
                        "aria-hidden": "true",
                        className:
                          "pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent p-3 pt-10 opacity-0 transition-[opacity,translate] duration-300 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100",
                        children: [
                          (0, t.jsx)("span", { className: "mb-1.5 block h-px w-6 bg-gold" }),
                          (0, t.jsx)("span", {
                            className:
                              "block font-sans text-xs font-medium tracking-wide text-ivory",
                            children: c,
                          }),
                        ],
                      })
                    : null,
                ],
              },
              l,
            );
          };
        return (0, t.jsxs)(t.Fragment, {
          children: [
            k.length > 0
              ? (0, t.jsxs)("div", {
                  className: "mb-6 flex flex-wrap items-center justify-between gap-4",
                  children: [
                    (0, t.jsx)("div", {
                      role: "group",
                      "aria-label": (0, s.uiString)("lightboxFilterAria"),
                      className: "flex flex-wrap gap-2",
                      children: u.map((e) =>
                        (0, t.jsx)(
                          "button",
                          {
                            type: "button",
                            "aria-pressed": x === e.id,
                            onClick: () => {
                              (y(e.id), v(null));
                            },
                            className:
                              "px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                              (x === e.id
                                ? "bg-navy text-white"
                                : "border border-[var(--dvn-line-gold)] text-navy hover:bg-navy hover:text-white"),
                            children: e.label,
                          },
                          e.id,
                        ),
                      ),
                    }),
                    _
                      ? (0, t.jsxs)("div", {
                          className: "hidden gap-2 md:flex",
                          children: [
                            (0, t.jsx)("button", {
                              type: "button",
                              "aria-label": (0, s.uiString)("prevImages"),
                              onClick: () => C.goTo(C.index - 1),
                              disabled: 0 === C.index,
                              className:
                                "flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy transition-colors duration-300 hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-40",
                              children: (0, t.jsx)("svg", {
                                "aria-hidden": "true",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "h-4 w-4",
                                children: (0, t.jsx)("path", { d: "M19 12H5m0 0 6-6m-6 6 6 6" }),
                              }),
                            }),
                            (0, t.jsx)("button", {
                              type: "button",
                              "aria-label": (0, s.uiString)("nextImages"),
                              onClick: () => C.goTo(C.index + 1),
                              disabled: C.index >= C.maxIndex,
                              className:
                                "flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy transition-colors duration-300 hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-40",
                              children: (0, t.jsx)("svg", {
                                "aria-hidden": "true",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "h-4 w-4",
                                children: (0, t.jsx)("path", { d: "M5 12h14m0 0-6-6m6 6-6 6" }),
                              }),
                            }),
                          ],
                        })
                      : null,
                  ],
                })
              : null,
            _
              ? (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsx)("div", {
                      ref: C.trackRef,
                      onScroll: C.syncFromScroll,
                      onPointerDown: C.markUserScroll,
                      onWheel: C.markUserScroll,
                      className:
                        "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                      children: k.map((e, t) => E(e, t, null)),
                    }),
                    k.length > 1
                      ? (0, t.jsx)("div", {
                          className: "mt-4 flex flex-wrap items-center justify-center gap-1",
                          children: k.map((e, r) =>
                            (0, t.jsx)(
                              "button",
                              {
                                type: "button",
                                "aria-label": (0, s.uiString)("galleryImageAria")(r + 1),
                                "aria-current": C.index === r ? "true" : void 0,
                                onClick: () => C.goTo(Math.min(r, C.maxIndex)),
                                className: "p-1.5",
                                children: (0, t.jsx)("span", {
                                  "aria-hidden": "true",
                                  className: `block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${C.index === r ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"}`,
                                }),
                              },
                              e.asset?._ref ?? r,
                            ),
                          ),
                        })
                      : null,
                  ],
                })
              : (0, t.jsx)("div", {
                  className: "grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
                  children: S.map((e, t) => E(e, t, f(t, S.length))),
                }),
            (0, t.jsx)("dialog", {
              ref: p,
              onClick: (e) => {
                e.target === e.currentTarget && v(null);
              },
              onKeyDown: (e) => {
                ("Escape" === e.key && v(null),
                  "ArrowLeft" === e.key && z(-1),
                  "ArrowRight" === e.key && z(1));
              },
              onTouchStart: (e) => {
                w.current = e.touches[0]?.clientX ?? null;
              },
              onTouchEnd: (e) => {
                if (null === w.current) return;
                let t = (e.changedTouches[0]?.clientX ?? 0) - w.current;
                (Math.abs(t) > 48 && z(t < 0 ? 1 : -1), (w.current = null));
              },
              className: "backdrop:bg-navy/90 m-auto bg-transparent p-0 text-ivory",
              "aria-label": (0, s.uiString)("galleryImageAlt"),
              children:
                null !== b && S[b]
                  ? (0, t.jsx)(g, {
                      items: S,
                      active: b,
                      closeLabel: m,
                      onClose: () => v(null),
                      onNavigate: z,
                    })
                  : null,
            }),
          ],
        });
      },
      "LightboxStage",
      0,
      g,
      "galleryMode",
      0,
      c,
      "mosaicSpan",
      0,
      f,
    ]);
  },
  29347,
  (e) => {
    "use strict";
    var t = e.i(4211);
    e.s([
      "useTrackCarousel",
      0,
      function (e) {
        let r = (0, t.useRef)(null),
          [i, n] = (0, t.useState)(0),
          [a, o] = (0, t.useState)(0),
          l = (0, t.useRef)(0),
          s = (0, t.useRef)(null),
          d = (0, t.useCallback)(() => {
            let e = r.current,
              t = e?.querySelector("a,article,button,div");
            if (!e || !t) return 0;
            let i = getComputedStyle(e),
              n = parseFloat(i.columnGap || i.gap || "0") || 0;
            return t.getBoundingClientRect().width + n;
          }, []),
          u = (e) => {
            ((l.current = e), n(e));
          },
          c = (0, t.useCallback)(() => {
            let e = r.current,
              t = d();
            if (e && !(t <= 0)) {
              if (null !== s.current) {
                if (Math.abs(e.scrollLeft - s.current) > t / 2) return;
                s.current = null;
              }
              u(
                e.scrollLeft + e.clientWidth >= e.scrollWidth - 4
                  ? a
                  : Math.min(a, Math.max(0, Math.round(e.scrollLeft / t))),
              );
            }
          }, [a]),
          f = (0, t.useCallback)(() => {
            let t = r.current,
              i = d();
            if (!t || i <= 0) return;
            let n = Math.max(0, e - Math.max(1, Math.round(t.clientWidth / i)));
            (o(n), u(Math.min(l.current, n)));
          }, [e]);
        return (
          (0, t.useEffect)(
            () => (
              f(),
              window.addEventListener("resize", f),
              () => window.removeEventListener("resize", f)
            ),
            [f],
          ),
          {
            trackRef: r,
            index: i,
            maxIndex: a,
            goTo: (e) => {
              let t = r.current;
              if (!t) return;
              let i = d(),
                n = Math.min(Math.max(e, 0), a);
              u(n);
              let o = Math.min(n * i, t.scrollWidth - t.clientWidth);
              ((s.current = o), t.scrollTo({ left: o, behavior: "smooth" }));
            },
            syncFromScroll: c,
            markUserScroll: () => {
              s.current = null;
            },
          }
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
  52864,
  (e) => {
    "use strict";
    var t = e.i(39493);
    e.s(
      [
        "t",
        0,
        function (e) {
          return (function (e, t = "tr") {
            return "en" === t
              ? (e?.en ?? e?.tr ?? "")
              : "nl" === t
                ? (e?.nl ?? e?.en ?? e?.tr ?? "")
                : (e?.tr ?? "");
          })(e, "en" === t.site.defaultLocale ? "en" : "nl" === t.site.defaultLocale ? "nl" : "tr");
        },
      ],
      52864,
    );
  },
  91765,
  (e) => {
    "use strict";
    var t = e.i(31345),
      r = e.i(6563);
    e.s([
      "default",
      0,
      function ({ src: e, width: i, quality: n }) {
        return (0, t.urlForImage)(e, { width: i, quality: n ?? 75 }, (0, r.imageTarget)());
      },
    ]);
  },
  7305,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "Image", {
        enumerable: !0,
        get: function () {
          return w;
        },
      }));
    let i = e.r(36437),
      n = e.r(56421),
      a = e.r(27693),
      o = n._(e.r(4211)),
      l = i._(e.r(94503)),
      s = i._(e.r(48104)),
      d = e.r(29329),
      u = e.r(1302),
      c = e.r(77279),
      f = e.r(2058),
      h = i._(e.r(91765)),
      m = e.r(89360),
      g = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75],
        path: "/_next/image/",
        loader: "custom",
        dangerouslyAllowSVG: !1,
        unoptimized: !1,
      };
    function p(e, t, r, i, n, a, o) {
      let l = e?.src;
      e &&
        e["data-loaded-src"] !== l &&
        ((e["data-loaded-src"] = l),
        ("decode" in e ? e.decode() : Promise.resolve())
          .catch(() => {})
          .then(() => {
            if (e.parentElement && e.isConnected) {
              if (("empty" !== t && n(!0), r?.current)) {
                let t = new Event("load");
                Object.defineProperty(t, "target", { writable: !1, value: e });
                let i = !1,
                  n = !1;
                r.current({
                  ...t,
                  nativeEvent: t,
                  currentTarget: e,
                  target: e,
                  isDefaultPrevented: () => i,
                  isPropagationStopped: () => n,
                  persist: () => {},
                  preventDefault: () => {
                    ((i = !0), t.preventDefault());
                  },
                  stopPropagation: () => {
                    ((n = !0), t.stopPropagation());
                  },
                });
              }
              i?.current && i.current(e);
            }
          }));
    }
    function b(e) {
      return o.use ? { fetchPriority: e } : { fetchpriority: e };
    }
    "u" < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
    let v = "u" < typeof window ? o.useEffect : o.useLayoutEffect,
      x = (0, o.forwardRef)(
        (
          {
            src: e,
            srcSet: t,
            sizes: r,
            height: i,
            width: n,
            decoding: l,
            className: s,
            style: d,
            fetchPriority: u,
            placeholder: c,
            loading: f,
            unoptimized: h,
            fill: g,
            onLoadRef: x,
            onLoadingCompleteRef: y,
            setBlurComplete: w,
            setShowAltText: j,
            sizesInput: k,
            onLoad: S,
            onError: _,
            ...C
          },
          z,
        ) => {
          let E = (0, o.useRef)(!1),
            P = (0, o.useRef)(null);
          v(() => {
            let { current: e } = E,
              { current: t } = P;
            e ||
              null === t ||
              (_ && (t.src = t.src), t.complete && p(t, c, x, y, w, h, k), (E.current = !0));
          }, [e, c, x, y, _, h, k]);
          let O = (0, m.useMergedRef)(z, P);
          return (0, a.jsx)("img", {
            ...C,
            ...b(u),
            loading: f,
            width: n,
            height: i,
            decoding: l,
            "data-nimg": g ? "fill" : "1",
            className: s,
            style: d,
            sizes: r,
            srcSet: t,
            src: e,
            ref: O,
            onLoad: (e) => {
              p(e.currentTarget, c, x, y, w, h, k);
            },
            onError: (e) => {
              (j(!0), "empty" !== c && w(!0), _ && _(e));
            },
          });
        },
      );
    function y({ isAppRouter: e, imgAttributes: t }) {
      let r = {
        as: "image",
        imageSrcSet: t.srcSet,
        imageSizes: t.sizes,
        crossOrigin: t.crossOrigin,
        referrerPolicy: t.referrerPolicy,
        ...b(t.fetchPriority),
      };
      return e && l.default.preload
        ? (l.default.preload(t.src, r), null)
        : (0, a.jsx)(s.default, {
            children: (0, a.jsx)(
              "link",
              { rel: "preload", href: t.srcSet ? void 0 : t.src, ...r },
              "__nimg-" + t.src + t.srcSet + t.sizes,
            ),
          });
    }
    let w = (0, o.forwardRef)((e, t) => {
      let r = (0, o.useContext)(f.RouterContext),
        i = (0, o.useContext)(c.ImageConfigContext),
        n = (0, o.useMemo)(() => {
          let e = g || i || u.imageConfigDefault,
            t = [...e.deviceSizes, ...e.imageSizes].sort((e, t) => e - t),
            r = e.deviceSizes.sort((e, t) => e - t),
            n = e.qualities?.sort((e, t) => e - t);
          return {
            ...e,
            allSizes: t,
            deviceSizes: r,
            qualities: n,
            localPatterns: "u" < typeof window ? i?.localPatterns : e.localPatterns,
          };
        }, [i]),
        { onLoad: l, onLoadingComplete: s } = e,
        m = (0, o.useRef)(l);
      (0, o.useEffect)(() => {
        m.current = l;
      }, [l]);
      let p = (0, o.useRef)(s);
      (0, o.useEffect)(() => {
        p.current = s;
      }, [s]);
      let [b, v] = (0, o.useState)(!1),
        [w, j] = (0, o.useState)(!1),
        { props: k, meta: S } = (0, d.getImgProps)(e, {
          defaultLoader: h.default,
          imgConf: n,
          blurComplete: b,
          showAltText: w,
        });
      return (0, a.jsxs)(a.Fragment, {
        children: [
          (0, a.jsx)(x, {
            ...k,
            unoptimized: S.unoptimized,
            placeholder: S.placeholder,
            fill: S.fill,
            onLoadRef: m,
            onLoadingCompleteRef: p,
            setBlurComplete: v,
            setShowAltText: j,
            sizesInput: e.sizes,
            ref: t,
          }),
          S.preload ? (0, a.jsx)(y, { isAppRouter: !r, imgAttributes: k }) : null,
        ],
      });
    });
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  29329,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "getImgProps", {
        enumerable: !0,
        get: function () {
          return d;
        },
      }));
    let i = e.r(56615),
      n = e.r(61205),
      a = e.r(1302),
      o = ["-moz-initial", "fill", "none", "scale-down", void 0];
    function l(e) {
      return void 0 !== e.default;
    }
    function s(e) {
      return void 0 === e
        ? e
        : "number" == typeof e
          ? Number.isFinite(e)
            ? e
            : NaN
          : "string" == typeof e && /^[0-9]+$/.test(e)
            ? parseInt(e, 10)
            : NaN;
    }
    function d(
      {
        src: e,
        sizes: t,
        unoptimized: r = !1,
        priority: u = !1,
        preload: c = !1,
        loading: f,
        className: h,
        quality: m,
        width: g,
        height: p,
        fill: b = !1,
        style: v,
        overrideSrc: x,
        onLoad: y,
        onLoadingComplete: w,
        placeholder: j = "empty",
        blurDataURL: k,
        fetchPriority: S,
        decoding: _ = "async",
        layout: C,
        objectFit: z,
        objectPosition: E,
        lazyBoundary: P,
        lazyRoot: O,
        ...I
      },
      M,
    ) {
      var R;
      let N,
        T,
        L,
        { imgConf: D, showAltText: A, blurComplete: $, defaultLoader: q } = M,
        U = D || a.imageConfigDefault;
      if ("allSizes" in U) N = U;
      else {
        let e = [...U.deviceSizes, ...U.imageSizes].sort((e, t) => e - t),
          t = U.deviceSizes.sort((e, t) => e - t),
          r = U.qualities?.sort((e, t) => e - t);
        N = { ...U, allSizes: e, deviceSizes: t, qualities: r };
      }
      if (void 0 === q)
        throw Object.defineProperty(
          Error(
            "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E163", enumerable: !1, configurable: !0 },
        );
      let B = I.loader || q;
      (delete I.loader, delete I.srcSet);
      let F = "__next_img_default" in B;
      if (F) {
        if ("custom" === N.loader)
          throw Object.defineProperty(
            Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),
            "__NEXT_ERROR_CODE",
            { value: "E252", enumerable: !1, configurable: !0 },
          );
      } else {
        let e = B;
        B = (t) => {
          let { config: r, ...i } = t;
          return e(i);
        };
      }
      if (C) {
        "fill" === C && (b = !0);
        let e = {
          intrinsic: { maxWidth: "100%", height: "auto" },
          responsive: { width: "100%", height: "auto" },
        }[C];
        e && (v = { ...v, ...e });
        let r = { responsive: "100vw", fill: "100vw" }[C];
        r && !t && (t = r);
      }
      let W = "",
        G = s(g),
        H = s(p);
      if ((R = e) && "object" == typeof R && (l(R) || void 0 !== R.src)) {
        let t = l(e) ? e.default : e;
        if (!t.src)
          throw Object.defineProperty(
            Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`,
            ),
            "__NEXT_ERROR_CODE",
            { value: "E460", enumerable: !1, configurable: !0 },
          );
        if (!t.height || !t.width)
          throw Object.defineProperty(
            Error(
              `An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`,
            ),
            "__NEXT_ERROR_CODE",
            { value: "E48", enumerable: !1, configurable: !0 },
          );
        if (((T = t.blurWidth), (L = t.blurHeight), (k = k || t.blurDataURL), (W = t.src), !b))
          if (G || H) {
            if (G && !H) {
              let e = G / t.width;
              H = Math.round(t.height * e);
            } else if (!G && H) {
              let e = H / t.height;
              G = Math.round(t.width * e);
            }
          } else ((G = t.width), (H = t.height));
      }
      let X = !u && !c && ("lazy" === f || void 0 === f);
      ((!(e = "string" == typeof e ? e : W) || e.startsWith("data:") || e.startsWith("blob:")) &&
        ((r = !0), (X = !1)),
        N.unoptimized && (r = !0),
        F && !N.dangerouslyAllowSVG && e.split("?", 1)[0].endsWith(".svg") && (r = !0));
      let V = s(m),
        K = Object.assign(
          b
            ? {
                position: "absolute",
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: z,
                objectPosition: E,
              }
            : {},
          A ? {} : { color: "transparent" },
          v,
        ),
        Y =
          $ || "empty" === j
            ? null
            : "blur" === j
              ? `url("data:image/svg+xml;charset=utf-8,${(0, n.getImageBlurSvg)({ widthInt: G, heightInt: H, blurWidth: T, blurHeight: L, blurDataURL: k || "", objectFit: K.objectFit })}")`
              : `url("${j}")`,
        J = o.includes(K.objectFit)
          ? "fill" === K.objectFit
            ? "100% 100%"
            : "cover"
          : K.objectFit,
        Q = Y
          ? {
              backgroundSize: J,
              backgroundPosition: K.objectPosition || "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundImage: Y,
            }
          : {},
        Z = (function ({
          config: e,
          src: t,
          unoptimized: r,
          width: n,
          quality: a,
          sizes: o,
          loader: l,
        }) {
          if (r) {
            if (t.startsWith("/") && !t.startsWith("//")) {
              let e = (0, i.getDeploymentId)();
              if (t.includes("/_next/static/immutable") && !(0, i.getAssetToken)()) e = void 0;
              else if (e) {
                let r = t.indexOf("?");
                if (-1 !== r) {
                  let i = new URLSearchParams(t.slice(r + 1));
                  i.get("dpl") || (i.append("dpl", e), (t = t.slice(0, r) + "?" + i.toString()));
                } else t += `?dpl=${e}`;
              }
            }
            return { src: t, srcSet: void 0, sizes: void 0 };
          }
          let { widths: s, kind: d } = (function ({ deviceSizes: e, allSizes: t }, r, i) {
              if (i) {
                let r = /(^|\s)(1?\d?\d)vw/g,
                  n = [];
                for (let e; (e = r.exec(i));) n.push(parseInt(e[2]));
                if (n.length) {
                  let r = 0.01 * Math.min(...n);
                  return { widths: t.filter((t) => t >= e[0] * r), kind: "w" };
                }
                return { widths: t, kind: "w" };
              }
              return "number" != typeof r
                ? { widths: e, kind: "w" }
                : {
                    widths: [
                      ...new Set([r, 2 * r].map((e) => t.find((t) => t >= e) || t[t.length - 1])),
                    ],
                    kind: "x",
                  };
            })(e, n, o),
            u = s.length - 1;
          return {
            sizes: o || "w" !== d ? o : "100vw",
            srcSet: s
              .map(
                (r, i) =>
                  `${l({ config: e, src: t, quality: a, width: r })} ${"w" === d ? r : i + 1}${d}`,
              )
              .join(", "),
            src: l({ config: e, src: t, quality: a, width: s[u] }),
          };
        })({ config: N, src: e, unoptimized: r, width: G, quality: V, sizes: t, loader: B }),
        ee = X ? "lazy" : f;
      return {
        props: {
          ...I,
          loading: ee,
          fetchPriority: S,
          width: G,
          height: H,
          decoding: _,
          className: h,
          style: { ...K, ...Q },
          sizes: Z.sizes,
          srcSet: Z.srcSet,
          src: x || Z.src,
        },
        meta: { unoptimized: r, preload: c || u, placeholder: j, fill: b },
      };
    }
  },
  48104,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var i = {
      default: function () {
        return g;
      },
      defaultHead: function () {
        return c;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    let a = e.r(36437),
      o = e.r(56421),
      l = e.r(27693),
      s = o._(e.r(4211)),
      d = a._(e.r(45140)),
      u = e.r(44743);
    function c() {
      return [
        (0, l.jsx)("meta", { charSet: "utf-8" }, "charset"),
        (0, l.jsx)("meta", { name: "viewport", content: "width=device-width" }, "viewport"),
      ];
    }
    function f(e, t) {
      return "string" == typeof t || "number" == typeof t
        ? e
        : t.type === s.default.Fragment
          ? e.concat(
              s.default.Children.toArray(t.props.children).reduce(
                (e, t) => ("string" == typeof t || "number" == typeof t ? e : e.concat(t)),
                [],
              ),
            )
          : e.concat(t);
    }
    let h = ["name", "httpEquiv", "charSet", "itemProp"];
    function m(e) {
      let t, r, i, n;
      return e
        .reduce(f, [])
        .reverse()
        .concat(c().reverse())
        .filter(
          ((t = new Set()),
          (r = new Set()),
          (i = new Set()),
          (n = {}),
          (e) => {
            let a = !0,
              o = !1;
            if (e.key && "number" != typeof e.key && e.key.indexOf("$") > 0) {
              o = !0;
              let r = e.key.slice(e.key.indexOf("$") + 1);
              t.has(r) ? (a = !1) : t.add(r);
            }
            switch (e.type) {
              case "title":
              case "base":
                r.has(e.type) ? (a = !1) : r.add(e.type);
                break;
              case "meta":
                for (let t = 0, r = h.length; t < r; t++) {
                  let r = h[t];
                  if (e.props.hasOwnProperty(r))
                    if ("charSet" === r) i.has(r) ? (a = !1) : i.add(r);
                    else {
                      let t = e.props[r],
                        i = n[r] || new Set();
                      ("name" !== r || !o) && i.has(t) ? (a = !1) : (i.add(t), (n[r] = i));
                    }
                }
            }
            return a;
          }),
        )
        .reverse()
        .map((e, t) => {
          let r = e.key || t;
          return s.default.cloneElement(e, { key: r });
        });
    }
    let g = function ({ children: e }) {
      let t = (0, s.useContext)(u.HeadManagerContext);
      return (0, l.jsx)(d.default, { reduceComponentsToState: m, headManager: t, children: e });
    };
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  61205,
  (e, t, r) => {
    "use strict";
    function i({
      widthInt: e,
      heightInt: t,
      blurWidth: r,
      blurHeight: n,
      blurDataURL: a,
      objectFit: o,
    }) {
      let l = r ? 40 * r : e,
        s = n ? 40 * n : t,
        d = l && s ? `viewBox='0 0 ${l} ${s}'` : "";
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d ? "none" : "contain" === o ? "xMidYMid" : "cover" === o ? "xMidYMid slice" : "none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`;
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "getImageBlurSvg", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
  },
  77279,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "ImageConfigContext", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let i = e.r(36437)._(e.r(4211)),
      n = e.r(1302),
      a = i.default.createContext(n.imageConfigDefault);
  },
  2058,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "RouterContext", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let i = e.r(36437)._(e.r(4211)).default.createContext(null);
  },
  1302,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var i = {
      VALID_LOADERS: function () {
        return a;
      },
      imageConfigDefault: function () {
        return o;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    let a = ["default", "imgix", "cloudinary", "akamai", "custom"],
      o = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        path: "/_next/image",
        loader: "default",
        loaderFile: "",
        domains: [],
        disableStaticImages: !1,
        minimumCacheTTL: 14400,
        formats: ["image/webp"],
        maximumDiskCacheSize: void 0,
        maximumRedirects: 3,
        maximumResponseBody: 5e7,
        dangerouslyAllowLocalIP: !1,
        dangerouslyAllowSVG: !1,
        contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
        contentDispositionType: "attachment",
        localPatterns: void 0,
        remotePatterns: [],
        qualities: [75],
        unoptimized: !1,
        customCacheHandler: !1,
      };
  },
  40267,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var i = {
      default: function () {
        return u;
      },
      getImageProps: function () {
        return d;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    let a = e.r(36437),
      o = e.r(29329),
      l = e.r(7305),
      s = a._(e.r(91765));
    function d(e) {
      let { props: t } = (0, o.getImgProps)(e, {
        defaultLoader: s.default,
        imgConf: {
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [32, 48, 64, 96, 128, 256, 384],
          qualities: [75],
          path: "/_next/image/",
          loader: "custom",
          dangerouslyAllowSVG: !1,
          unoptimized: !1,
        },
      });
      for (let [e, r] of Object.entries(t)) void 0 === r && delete t[e];
      return { props: t };
    }
    let u = l.Image;
  },
  27867,
  (e, t, r) => {
    t.exports = e.r(40267);
  },
  45140,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return l;
        },
      }));
    let i = e.r(4211),
      n = "u" < typeof window,
      a = n ? () => {} : i.useLayoutEffect,
      o = n ? () => {} : i.useEffect;
    function l(e) {
      let { headManager: t, reduceComponentsToState: r } = e;
      function l() {
        if (t && t.mountedInstances) {
          let e = i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));
          t.updateHead(r(e));
        }
      }
      return (
        n && (t?.mountedInstances?.add(e.children), l()),
        a(
          () => (
            t?.mountedInstances?.add(e.children),
            () => {
              t?.mountedInstances?.delete(e.children);
            }
          ),
        ),
        a(
          () => (
            t && (t._pendingUpdate = l),
            () => {
              t && (t._pendingUpdate = l);
            }
          ),
        ),
        o(
          () => (
            t && t._pendingUpdate && (t._pendingUpdate(), (t._pendingUpdate = null)),
            () => {
              t && t._pendingUpdate && (t._pendingUpdate(), (t._pendingUpdate = null));
            }
          ),
        ),
        null
      );
    }
  },
  31345,
  6563,
  (e) => {
    "use strict";
    function t(e, r = {}, i) {
      let n = (function (e) {
          let t = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(e);
          if (!t) throw Error(`Invalid Sanity image reference: ${e}`);
          let [, r, i, n] = t;
          return `${r}-${i}.${n}`;
        })(e),
        a = new URLSearchParams({
          auto: "format",
          fit: r.fit ?? "crop",
          ...(r.width ? { w: String(r.width) } : {}),
          ...(r.quality ? { q: String(r.quality) } : {}),
        });
      return `https://cdn.sanity.io/images/${i.projectId}/${i.dataset}/${n}?${a.toString()}`;
    }
    e.s(
      [
        "lqipUrl",
        0,
        function (e, r) {
          return t(e, { width: 32, quality: 30 }, r);
        },
        "refDimensions",
        0,
        function (e) {
          let t = /^image-[a-f0-9]+-(\d+)x(\d+)-\w+$/.exec(e);
          return t ? { width: Number(t[1]), height: Number(t[2]) } : null;
        },
        "urlForImage",
        0,
        t,
      ],
      31345,
    );
    var r = e.i(55211),
      i = e.i(39493);
    e.s(
      [
        "imageTarget",
        0,
        function () {
          return {
            projectId: i.site.sanity.projectId,
            dataset: r.default.env.SANITY_DATASET ?? i.site.sanity.dataset,
          };
        },
      ],
      6563,
    );
  },
]);
