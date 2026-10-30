(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  87414,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(27867),
      i = e.i(4211),
      n = e.i(52864),
      a = e.i(31345),
      l = e.i(6563),
      o = e.i(7542),
      s = e.i(70093);
    let u = (0, l.imageTarget)();
    e.s([
      "BranchGallery",
      0,
      function ({ name: e, photos: l, closeLabel: d }) {
        let c = (0, i.useRef)(null),
          [f, h] = (0, i.useState)(null),
          g = (0, i.useRef)(null),
          m = l.filter((e) => e.ref),
          p = m.slice(0, 4),
          b = m.length - p.length,
          v = m.map((e) => ({ asset: { _ref: e.ref }, alt: e.alt, lqip: e.lqip }));
        (0, i.useEffect)(() => {
          let e = c.current;
          null === f ? e?.close() : e && !e.open && e.showModal();
        }, [f]);
        let x = (e) => {
          h((t) => (null === t ? t : Math.min(m.length - 1, Math.max(0, t + e))));
        };
        if (0 === m.length) return null;
        let y = (i, l, o, d) => {
          let c = i.ref,
            f = (0, a.refDimensions)(c) ?? { width: 800, height: 600 };
          return (0, t.jsxs)(
            "button",
            {
              type: "button",
              onClick: () => h(l),
              "aria-label": d
                ? (0, s.uiString)("galleryMore")(d)
                : (0, s.uiString)("lightboxImageAria")(l + 1),
              className:
                "group/tile relative overflow-hidden rounded-[4px] bg-ivory-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                o,
              children: [
                (0, t.jsx)(r.default, {
                  src: c,
                  alt: (0, n.t)(i.alt) || e || "",
                  width: f.width,
                  height: f.height,
                  sizes: "(max-width: 768px) 50vw, 260px",
                  placeholder: i.lqip ? "blur" : "empty",
                  blurDataURL: i.lqip ?? (0, a.lqipUrl)(c, u),
                  className:
                    "h-full w-full object-cover transition-transform duration-700 ease-out group-hover/tile:scale-[1.05] motion-reduce:transition-none motion-reduce:transform-none",
                }),
                d
                  ? (0, t.jsxs)("span", {
                      "aria-hidden": "true",
                      className:
                        "absolute inset-0 flex items-center justify-center bg-navy/60 font-sans text-sm font-semibold tracking-wide text-ivory",
                      children: ["+", d],
                    })
                  : null,
              ],
            },
            c,
          );
        };
        return (0, t.jsxs)(t.Fragment, {
          children: [
            (0, t.jsx)("div", {
              className: "grid gap-2 " + (1 === p.length ? "grid-cols-1" : "grid-cols-2"),
              children:
                1 === p.length && p[0]
                  ? y(p[0], 0, "aspect-[4/3]")
                  : p.length < 4
                    ? p.map((e, t) =>
                        y(e, t, 0 === t ? "col-span-2 aspect-[16/10]" : "aspect-square"),
                      )
                    : p.map((e, t) => y(e, t, "aspect-square", t === p.length - 1 ? b : void 0)),
            }),
            (0, t.jsx)("dialog", {
              ref: c,
              onClick: (e) => {
                e.target === e.currentTarget && h(null);
              },
              onKeyDown: (e) => {
                ("Escape" === e.key && h(null),
                  "ArrowLeft" === e.key && x(-1),
                  "ArrowRight" === e.key && x(1));
              },
              onTouchStart: (e) => {
                g.current = e.touches[0]?.clientX ?? null;
              },
              onTouchEnd: (e) => {
                if (null === g.current) return;
                let t = (e.changedTouches[0]?.clientX ?? 0) - g.current;
                (Math.abs(t) > 48 && x(t < 0 ? 1 : -1), (g.current = null));
              },
              className: "backdrop:bg-navy/90 m-auto bg-transparent p-0 text-ivory",
              "aria-label": e ?? (0, s.uiString)("galleryImageAlt"),
              children:
                null !== f && v[f]
                  ? (0, t.jsx)(o.LightboxStage, {
                      items: v,
                      active: f,
                      closeLabel: d,
                      onClose: () => h(null),
                      onNavigate: x,
                    })
                  : null,
            }),
          ],
        });
      },
    ]);
  },
  7542,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(27867),
      i = e.i(4211),
      n = e.i(52864),
      a = e.i(31345),
      l = e.i(6563),
      o = e.i(29347),
      s = e.i(70093);
    let u = (0, l.imageTarget)(),
      d = [
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
      g =
        "flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/25 bg-navy-3/90 text-white transition-colors duration-300 hover:bg-gold hover:text-navy hover:border-gold disabled:pointer-events-none disabled:opacity-40";
    function m({ items: e, active: i, closeLabel: l, onClose: o, onNavigate: d }) {
      let c = e[i],
        f = c?.asset?._ref,
        h = f ? ((0, a.refDimensions)(f) ?? { width: 1600, height: 1200 }) : null,
        p = (0, n.t)(c?.alt);
      return (0, t.jsxs)("div", {
        className: "relative p-3 md:p-4",
        children: [
          l
            ? (0, t.jsxs)("button", {
                type: "button",
                onClick: o,
                className:
                  "absolute -top-1 right-3 z-10 translate-y-[-100%] rounded-[4px] border border-white/25 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-ivory transition-colors duration-300 hover:bg-gold hover:text-navy md:right-4",
                children: [l, " ✕"],
              })
            : null,
          (0, t.jsx)("button", {
            type: "button",
            "aria-label": (0, s.uiString)("prevImages"),
            onClick: () => d(-1),
            disabled: 0 === i,
            className: `absolute left-4 top-1/2 z-10 -translate-y-1/2 ${g}`,
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
            onClick: () => d(1),
            disabled: i === e.length - 1,
            className: `absolute right-4 top-1/2 z-10 -translate-y-1/2 ${g}`,
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
                    blurDataURL: c.lqip ?? (0, a.lqipUrl)(f, u),
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
      function ({ images: e, onceSonra: l, closeLabel: g }) {
        let p = (0, i.useRef)(null),
          [b, v] = (0, i.useState)(null),
          [x, y] = (0, i.useState)("klinik"),
          w = (0, i.useRef)(null);
        (0, i.useEffect)(() => {
          let e = p.current;
          null === b ? e?.close() : e && !e.open && e.showModal();
        }, [b]);
        let j = e.filter((e) => e.asset?._ref),
          k = (l ?? []).filter((e) => e.asset?._ref),
          S = k.length > 0 ? ("klinik" === x ? j : k) : j,
          _ = "carousel" === c(k.length, x),
          C = (0, o.useTrackCarousel)(_ ? k.length : 0),
          z = (e) => {
            v((t) => (null === t ? t : Math.min(S.length - 1, Math.max(0, t + e))));
          },
          E = (e, i, l) => {
            let o = e.asset?._ref,
              d = (0, a.refDimensions)(o) ?? { width: 800, height: 800 },
              c = (0, n.t)(e.alt);
            return (0, t.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => v(i),
                className:
                  "group relative overflow-hidden rounded-[4px] bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                  (l ? h[l] : "aspect-square") +
                  (_ ? " dvn-carousel-card shrink-0 snap-start" : ""),
                "aria-label": (0, s.uiString)("lightboxImageAria")(i + 1),
                children: [
                  (0, t.jsx)(r.default, {
                    src: o,
                    alt: c || `Galeri g\xf6rseli ${i + 1}`,
                    width: d.width,
                    height: d.height,
                    sizes: l ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw",
                    placeholder: "blur",
                    blurDataURL: e.lqip ?? (0, a.lqipUrl)(o, u),
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
              o,
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
                      children: d.map((e) =>
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
                  ? (0, t.jsx)(m, {
                      items: S,
                      active: b,
                      closeLabel: g,
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
      m,
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
          [a, l] = (0, t.useState)(0),
          o = (0, t.useRef)(0),
          s = (0, t.useRef)(null),
          u = (0, t.useCallback)(() => {
            let e = r.current,
              t = e?.querySelector("a,article,button,div");
            if (!e || !t) return 0;
            let i = getComputedStyle(e),
              n = parseFloat(i.columnGap || i.gap || "0") || 0;
            return t.getBoundingClientRect().width + n;
          }, []),
          d = (e) => {
            ((o.current = e), n(e));
          },
          c = (0, t.useCallback)(() => {
            let e = r.current,
              t = u();
            if (e && !(t <= 0)) {
              if (null !== s.current) {
                if (Math.abs(e.scrollLeft - s.current) > t / 2) return;
                s.current = null;
              }
              d(
                e.scrollLeft + e.clientWidth >= e.scrollWidth - 4
                  ? a
                  : Math.min(a, Math.max(0, Math.round(e.scrollLeft / t))),
              );
            }
          }, [a]),
          f = (0, t.useCallback)(() => {
            let t = r.current,
              i = u();
            if (!t || i <= 0) return;
            let n = Math.max(0, e - Math.max(1, Math.round(t.clientWidth / i)));
            (l(n), d(Math.min(o.current, n)));
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
              let i = u(),
                n = Math.min(Math.max(e, 0), a);
              d(n);
              let l = Math.min(n * i, t.scrollWidth - t.clientWidth);
              ((s.current = l), t.scrollTo({ left: l, behavior: "smooth" }));
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
      l = n._(e.r(4211)),
      o = i._(e.r(94503)),
      s = i._(e.r(48104)),
      u = e.r(29329),
      d = e.r(1302),
      c = e.r(77279),
      f = e.r(2058),
      h = i._(e.r(91765)),
      g = e.r(89360),
      m = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75],
        path: "/_next/image/",
        loader: "custom",
        dangerouslyAllowSVG: !1,
        unoptimized: !1,
      };
    function p(e, t, r, i, n, a, l) {
      let o = e?.src;
      e &&
        e["data-loaded-src"] !== o &&
        ((e["data-loaded-src"] = o),
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
      return l.use ? { fetchPriority: e } : { fetchpriority: e };
    }
    "u" < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
    let v = "u" < typeof window ? l.useEffect : l.useLayoutEffect,
      x = (0, l.forwardRef)(
        (
          {
            src: e,
            srcSet: t,
            sizes: r,
            height: i,
            width: n,
            decoding: o,
            className: s,
            style: u,
            fetchPriority: d,
            placeholder: c,
            loading: f,
            unoptimized: h,
            fill: m,
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
          let E = (0, l.useRef)(!1),
            P = (0, l.useRef)(null);
          v(() => {
            let { current: e } = E,
              { current: t } = P;
            e ||
              null === t ||
              (_ && (t.src = t.src), t.complete && p(t, c, x, y, w, h, k), (E.current = !0));
          }, [e, c, x, y, _, h, k]);
          let M = (0, g.useMergedRef)(z, P);
          return (0, a.jsx)("img", {
            ...C,
            ...b(d),
            loading: f,
            width: n,
            height: i,
            decoding: o,
            "data-nimg": m ? "fill" : "1",
            className: s,
            style: u,
            sizes: r,
            srcSet: t,
            src: e,
            ref: M,
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
      return e && o.default.preload
        ? (o.default.preload(t.src, r), null)
        : (0, a.jsx)(s.default, {
            children: (0, a.jsx)(
              "link",
              { rel: "preload", href: t.srcSet ? void 0 : t.src, ...r },
              "__nimg-" + t.src + t.srcSet + t.sizes,
            ),
          });
    }
    let w = (0, l.forwardRef)((e, t) => {
      let r = (0, l.useContext)(f.RouterContext),
        i = (0, l.useContext)(c.ImageConfigContext),
        n = (0, l.useMemo)(() => {
          let e = m || i || d.imageConfigDefault,
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
        { onLoad: o, onLoadingComplete: s } = e,
        g = (0, l.useRef)(o);
      (0, l.useEffect)(() => {
        g.current = o;
      }, [o]);
      let p = (0, l.useRef)(s);
      (0, l.useEffect)(() => {
        p.current = s;
      }, [s]);
      let [b, v] = (0, l.useState)(!1),
        [w, j] = (0, l.useState)(!1),
        { props: k, meta: S } = (0, u.getImgProps)(e, {
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
            onLoadRef: g,
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
          return u;
        },
      }));
    let i = e.r(56615),
      n = e.r(61205),
      a = e.r(1302),
      l = ["-moz-initial", "fill", "none", "scale-down", void 0];
    function o(e) {
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
    function u(
      {
        src: e,
        sizes: t,
        unoptimized: r = !1,
        priority: d = !1,
        preload: c = !1,
        loading: f,
        className: h,
        quality: g,
        width: m,
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
        lazyRoot: M,
        ...N
      },
      R,
    ) {
      var O;
      let I,
        T,
        L,
        { imgConf: D, showAltText: A, blurComplete: q, defaultLoader: $ } = R,
        U = D || a.imageConfigDefault;
      if ("allSizes" in U) I = U;
      else {
        let e = [...U.deviceSizes, ...U.imageSizes].sort((e, t) => e - t),
          t = U.deviceSizes.sort((e, t) => e - t),
          r = U.qualities?.sort((e, t) => e - t);
        I = { ...U, allSizes: e, deviceSizes: t, qualities: r };
      }
      if (void 0 === $)
        throw Object.defineProperty(
          Error(
            "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E163", enumerable: !1, configurable: !0 },
        );
      let B = N.loader || $;
      (delete N.loader, delete N.srcSet);
      let F = "__next_img_default" in B;
      if (F) {
        if ("custom" === I.loader)
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
        G = s(m),
        H = s(p);
      if ((O = e) && "object" == typeof O && (o(O) || void 0 !== O.src)) {
        let t = o(e) ? e.default : e;
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
      let X = !d && !c && ("lazy" === f || void 0 === f);
      ((!(e = "string" == typeof e ? e : W) || e.startsWith("data:") || e.startsWith("blob:")) &&
        ((r = !0), (X = !1)),
        I.unoptimized && (r = !0),
        F && !I.dangerouslyAllowSVG && e.split("?", 1)[0].endsWith(".svg") && (r = !0));
      let V = s(g),
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
          q || "empty" === j
            ? null
            : "blur" === j
              ? `url("data:image/svg+xml;charset=utf-8,${(0, n.getImageBlurSvg)({ widthInt: G, heightInt: H, blurWidth: T, blurHeight: L, blurDataURL: k || "", objectFit: K.objectFit })}")`
              : `url("${j}")`,
        J = l.includes(K.objectFit)
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
          sizes: l,
          loader: o,
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
          let { widths: s, kind: u } = (function ({ deviceSizes: e, allSizes: t }, r, i) {
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
            })(e, n, l),
            d = s.length - 1;
          return {
            sizes: l || "w" !== u ? l : "100vw",
            srcSet: s
              .map(
                (r, i) =>
                  `${o({ config: e, src: t, quality: a, width: r })} ${"w" === u ? r : i + 1}${u}`,
              )
              .join(", "),
            src: o({ config: e, src: t, quality: a, width: s[d] }),
          };
        })({ config: I, src: e, unoptimized: r, width: G, quality: V, sizes: t, loader: B }),
        ee = X ? "lazy" : f;
      return {
        props: {
          ...N,
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
        meta: { unoptimized: r, preload: c || d, placeholder: j, fill: b },
      };
    }
  },
  48104,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var i = {
      default: function () {
        return m;
      },
      defaultHead: function () {
        return c;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    let a = e.r(36437),
      l = e.r(56421),
      o = e.r(27693),
      s = l._(e.r(4211)),
      u = a._(e.r(45140)),
      d = e.r(44743);
    function c() {
      return [
        (0, o.jsx)("meta", { charSet: "utf-8" }, "charset"),
        (0, o.jsx)("meta", { name: "viewport", content: "width=device-width" }, "viewport"),
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
    function g(e) {
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
              l = !1;
            if (e.key && "number" != typeof e.key && e.key.indexOf("$") > 0) {
              l = !0;
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
                      ("name" !== r || !l) && i.has(t) ? (a = !1) : (i.add(t), (n[r] = i));
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
    let m = function ({ children: e }) {
      let t = (0, s.useContext)(d.HeadManagerContext);
      return (0, o.jsx)(u.default, { reduceComponentsToState: g, headManager: t, children: e });
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
      objectFit: l,
    }) {
      let o = r ? 40 * r : e,
        s = n ? 40 * n : t,
        u = o && s ? `viewBox='0 0 ${o} ${s}'` : "";
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${u}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${u ? "none" : "contain" === l ? "xMidYMid" : "cover" === l ? "xMidYMid slice" : "none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`;
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
        return l;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    let a = ["default", "imgix", "cloudinary", "akamai", "custom"],
      l = {
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
        return d;
      },
      getImageProps: function () {
        return u;
      },
    };
    for (var n in i) Object.defineProperty(r, n, { enumerable: !0, get: i[n] });
    let a = e.r(36437),
      l = e.r(29329),
      o = e.r(7305),
      s = a._(e.r(91765));
    function u(e) {
      let { props: t } = (0, l.getImgProps)(e, {
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
    let d = o.Image;
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
          return o;
        },
      }));
    let i = e.r(4211),
      n = "u" < typeof window,
      a = n ? () => {} : i.useLayoutEffect,
      l = n ? () => {} : i.useEffect;
    function o(e) {
      let { headManager: t, reduceComponentsToState: r } = e;
      function o() {
        if (t && t.mountedInstances) {
          let e = i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));
          t.updateHead(r(e));
        }
      }
      return (
        n && (t?.mountedInstances?.add(e.children), o()),
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
            t && (t._pendingUpdate = o),
            () => {
              t && (t._pendingUpdate = o);
            }
          ),
        ),
        l(
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
