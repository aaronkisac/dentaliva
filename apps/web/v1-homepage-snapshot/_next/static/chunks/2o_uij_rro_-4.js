(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  80129,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(27867),
      n = e.i(4211);
    function i(e) {
      return Number.isNaN(e) ? 50 : Math.min(100, Math.max(0, e));
    }
    e.s([
      "BeforeAfterSlider",
      0,
      function ({ before: e, after: a, label: l, beforeLabel: s, afterLabel: o }) {
        let [d, c] = (0, n.useState)(50),
          u = (0, n.useRef)(null),
          f = (0, n.useRef)(!1),
          h = (0, n.useCallback)((e) => {
            let t = u.current?.getBoundingClientRect();
            t && 0 !== t.width && c(i(((e - t.left) / t.width) * 100));
          }, []),
          m = () => {
            f.current = !1;
          };
        return (0, t.jsxs)("div", {
          ref: u,
          className: "relative aspect-[4/3] cursor-ew-resize touch-none select-none bg-navy",
          onPointerDown: (e) => {
            ((f.current = !0), e.currentTarget.setPointerCapture(e.pointerId), h(e.clientX));
          },
          onPointerMove: (e) => {
            f.current && h(e.clientX);
          },
          onPointerUp: m,
          onPointerCancel: m,
          children: [
            (0, t.jsx)(r.default, {
              src: a.ref,
              alt: a.alt,
              fill: !0,
              sizes: "(max-width: 768px) 100vw, 33vw",
              placeholder: a.lqip ? "blur" : "empty",
              blurDataURL: a.lqip,
              className: "object-cover",
              draggable: !1,
            }),
            (0, t.jsx)(r.default, {
              src: e.ref,
              alt: e.alt,
              fill: !0,
              sizes: "(max-width: 768px) 100vw, 33vw",
              placeholder: e.lqip ? "blur" : "empty",
              blurDataURL: e.lqip,
              className: "object-cover",
              style: { clipPath: `inset(0 ${100 - d}% 0 0)` },
              draggable: !1,
            }),
            s
              ? (0, t.jsx)("span", {
                  className:
                    "pointer-events-none absolute bottom-3 left-3 rounded-[4px] bg-navy/70 px-2.5 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white",
                  children: s,
                })
              : null,
            o
              ? (0, t.jsx)("span", {
                  className:
                    "pointer-events-none absolute bottom-3 right-3 rounded-[4px] bg-navy/70 px-2.5 py-1 font-sans text-xs font-medium uppercase tracking-widest text-white",
                  children: o,
                })
              : null,
            (0, t.jsx)("div", {
              "aria-hidden": "true",
              className: "pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white",
              style: { left: `${d}%` },
            }),
            (0, t.jsx)("div", {
              role: "slider",
              tabIndex: 0,
              "aria-label": l,
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": Math.round(d),
              onKeyDown: (e) => {
                "ArrowLeft" === e.key || "ArrowDown" === e.key
                  ? (e.preventDefault(), c((e) => i(e - 5)))
                  : "ArrowRight" === e.key || "ArrowUp" === e.key
                    ? (e.preventDefault(), c((e) => i(e + 5)))
                    : "Home" === e.key
                      ? (e.preventDefault(), c(0))
                      : "End" === e.key && (e.preventDefault(), c(100));
              },
              className:
                "absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              style: { left: `${d}%` },
              children: (0, t.jsxs)("svg", {
                "aria-hidden": "true",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "h-5 w-5",
                children: [
                  (0, t.jsx)("path", { d: "M8 7l-5 5 5 5" }),
                  (0, t.jsx)("path", { d: "M16 7l5 5-5 5" }),
                ],
              }),
            }),
          ],
        });
      },
      "clampPercent",
      0,
      i,
    ]);
  },
  98213,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(29347);
    function n({ direction: e, label: r, onClick: i, disabled: a, dark: l }) {
      return (0, t.jsx)("button", {
        type: "button",
        "aria-label": r,
        onClick: i,
        disabled: a,
        className:
          "flex h-11 w-11 items-center justify-center border transition-colors duration-300 hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-40 " +
          (l ? "border-white/25 text-white" : "border-[var(--dvn-line-gold)] text-navy"),
        children: (0, t.jsx)("svg", {
          "aria-hidden": "true",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "h-4 w-4",
          children:
            "left" === e
              ? (0, t.jsx)("path", { d: "M19 12H5m0 0 6-6m-6 6 6 6" })
              : (0, t.jsx)("path", { d: "M5 12h14m0 0-6-6m6 6-6 6" }),
        }),
      });
    }
    e.s([
      "CarouselTrack",
      0,
      function ({
        count: e,
        ariaLabelPrefix: i,
        children: a,
        className: l,
        tone: s = "light",
        header: o,
        headerClassName: d,
        trackClassName: c,
      }) {
        let {
            trackRef: u,
            index: f,
            maxIndex: h,
            goTo: m,
            syncFromScroll: g,
            markUserScroll: p,
          } = (0, r.useTrackCarousel)(e),
          v = "dark" === s,
          b = (0, t.jsxs)("div", {
            className: "hidden gap-2 md:flex",
            children: [
              (0, t.jsx)(n, {
                direction: "left",
                label: `\xd6nceki ${i}`,
                onClick: () => m(f - 1),
                disabled: 0 === f,
                dark: v,
              }),
              (0, t.jsx)(n, {
                direction: "right",
                label: `Sonraki ${i}`,
                onClick: () => m(f + 1),
                disabled: f >= h,
                dark: v,
              }),
            ],
          });
        return (0, t.jsxs)(t.Fragment, {
          children: [
            o
              ? (0, t.jsxs)("div", {
                  className: d ?? "grid gap-6 md:grid-cols-[1fr_auto] md:items-end",
                  children: [o, b],
                })
              : null,
            (0, t.jsxs)("div", {
              className: "relative",
              children: [
                o
                  ? null
                  : (0, t.jsx)("div", {
                      className:
                        "absolute right-0 top-0 z-[var(--dvn-z-raised)] hidden gap-2 md:flex",
                      children: b,
                    }),
                (0, t.jsx)("div", {
                  ref: u,
                  onScroll: g,
                  onPointerDown: p,
                  onWheel: p,
                  className:
                    "-mx-[var(--dvn-container-gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
                    (l ?? "") +
                    " " +
                    (c ?? ""),
                  children: a,
                }),
              ],
            }),
            e > 1
              ? (0, t.jsx)("div", {
                  className: "mt-4 flex flex-wrap items-center justify-center gap-1",
                  children: Array.from({ length: e }, (e, r) =>
                    (0, t.jsx)(
                      "button",
                      {
                        type: "button",
                        "aria-label": `${r + 1}. ${i}`,
                        "aria-current": r === f ? "true" : void 0,
                        onClick: () => m(Math.min(r, h)),
                        className: "p-1.5",
                        children: (0, t.jsx)("span", {
                          "aria-hidden": "true",
                          className: `block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${r === f ? "bg-gold" : v ? "bg-white/25 hover:bg-white/50" : "bg-ink/20 hover:bg-ink/40"}`,
                        }),
                      },
                      r,
                    ),
                  ),
                })
              : null,
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
      n = e.i(4211),
      i = e.i(52864),
      a = e.i(31345),
      l = e.i(6563),
      s = e.i(29347),
      o = e.i(70093);
    let d = (0, l.imageTarget)(),
      c = [
        { id: "klinik", label: "Klinik" },
        { id: "onceSonra", label: "Önce / Sonra" },
      ];
    function u(e, t) {
      return "onceSonra" === t && e > 3 ? "carousel" : "grid";
    }
    function f(e, t) {
      return 5 === t ? (0 === e ? "feature" : null) : t < 6 ? null : e % 7 == 0 ? "feature" : null;
    }
    let h = { feature: "col-span-2 aspect-[4/3] md:aspect-auto md:row-span-2" },
      m =
        "flex h-11 w-11 items-center justify-center rounded-[4px] border border-white/25 bg-navy-3/90 text-white transition-colors duration-300 hover:bg-gold hover:text-navy hover:border-gold disabled:pointer-events-none disabled:opacity-40";
    function g({ items: e, active: n, closeLabel: l, onClose: s, onNavigate: c }) {
      let u = e[n],
        f = u?.asset?._ref,
        h = f ? ((0, a.refDimensions)(f) ?? { width: 1600, height: 1200 }) : null,
        p = (0, i.t)(u?.alt);
      return (0, t.jsxs)("div", {
        className: "relative p-3 md:p-4",
        children: [
          l
            ? (0, t.jsxs)("button", {
                type: "button",
                onClick: s,
                className:
                  "absolute -top-1 right-3 z-10 translate-y-[-100%] rounded-[4px] border border-white/25 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-ivory transition-colors duration-300 hover:bg-gold hover:text-navy md:right-4",
                children: [l, " ✕"],
              })
            : null,
          (0, t.jsx)("button", {
            type: "button",
            "aria-label": (0, o.uiString)("prevImages"),
            onClick: () => c(-1),
            disabled: 0 === n,
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
            "aria-label": (0, o.uiString)("nextImages"),
            onClick: () => c(1),
            disabled: n === e.length - 1,
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
              u && h
                ? (0, t.jsx)(r.default, {
                    src: f,
                    alt: p || "Büyük görsel",
                    width: h.width,
                    height: h.height,
                    sizes: "90vw",
                    placeholder: "blur",
                    blurDataURL: u.lqip ?? (0, a.lqipUrl)(f, d),
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
                    children: [n + 1, " / ", e.length],
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
      function ({ images: e, onceSonra: l, closeLabel: m }) {
        let p = (0, n.useRef)(null),
          [v, b] = (0, n.useState)(null),
          [x, y] = (0, n.useState)("klinik"),
          w = (0, n.useRef)(null);
        (0, n.useEffect)(() => {
          let e = p.current;
          null === v ? e?.close() : e && !e.open && e.showModal();
        }, [v]);
        let j = e.filter((e) => e.asset?._ref),
          k = (l ?? []).filter((e) => e.asset?._ref),
          S = k.length > 0 ? ("klinik" === x ? j : k) : j,
          N = "carousel" === u(k.length, x),
          _ = (0, s.useTrackCarousel)(N ? k.length : 0),
          C = (e) => {
            b((t) => (null === t ? t : Math.min(S.length - 1, Math.max(0, t + e))));
          },
          P = (e, n, l) => {
            let s = e.asset?._ref,
              c = (0, a.refDimensions)(s) ?? { width: 800, height: 800 },
              u = (0, i.t)(e.alt);
            return (0, t.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => b(n),
                className:
                  "group relative overflow-hidden rounded-[4px] bg-ivory-2 transition-shadow duration-300 hover:shadow-[var(--dvn-shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                  (l ? h[l] : "aspect-square") +
                  (N ? " dvn-carousel-card shrink-0 snap-start" : ""),
                "aria-label": (0, o.uiString)("lightboxImageAria")(n + 1),
                children: [
                  (0, t.jsx)(r.default, {
                    src: s,
                    alt: u || `Galeri g\xf6rseli ${n + 1}`,
                    width: c.width,
                    height: c.height,
                    sizes: l ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw",
                    placeholder: "blur",
                    blurDataURL: e.lqip ?? (0, a.lqipUrl)(s, d),
                    className:
                      "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none",
                  }),
                  u
                    ? (0, t.jsxs)("span", {
                        "aria-hidden": "true",
                        className:
                          "pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent p-3 pt-10 opacity-0 transition-[opacity,translate] duration-300 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100",
                        children: [
                          (0, t.jsx)("span", { className: "mb-1.5 block h-px w-6 bg-gold" }),
                          (0, t.jsx)("span", {
                            className:
                              "block font-sans text-xs font-medium tracking-wide text-ivory",
                            children: u,
                          }),
                        ],
                      })
                    : null,
                ],
              },
              s,
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
                      "aria-label": (0, o.uiString)("lightboxFilterAria"),
                      className: "flex flex-wrap gap-2",
                      children: c.map((e) =>
                        (0, t.jsx)(
                          "button",
                          {
                            type: "button",
                            "aria-pressed": x === e.id,
                            onClick: () => {
                              (y(e.id), b(null));
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
                    N
                      ? (0, t.jsxs)("div", {
                          className: "hidden gap-2 md:flex",
                          children: [
                            (0, t.jsx)("button", {
                              type: "button",
                              "aria-label": (0, o.uiString)("prevImages"),
                              onClick: () => _.goTo(_.index - 1),
                              disabled: 0 === _.index,
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
                              "aria-label": (0, o.uiString)("nextImages"),
                              onClick: () => _.goTo(_.index + 1),
                              disabled: _.index >= _.maxIndex,
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
            N
              ? (0, t.jsxs)(t.Fragment, {
                  children: [
                    (0, t.jsx)("div", {
                      ref: _.trackRef,
                      onScroll: _.syncFromScroll,
                      onPointerDown: _.markUserScroll,
                      onWheel: _.markUserScroll,
                      className:
                        "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                      children: k.map((e, t) => P(e, t, null)),
                    }),
                    k.length > 1
                      ? (0, t.jsx)("div", {
                          className: "mt-4 flex flex-wrap items-center justify-center gap-1",
                          children: k.map((e, r) =>
                            (0, t.jsx)(
                              "button",
                              {
                                type: "button",
                                "aria-label": (0, o.uiString)("galleryImageAria")(r + 1),
                                "aria-current": _.index === r ? "true" : void 0,
                                onClick: () => _.goTo(Math.min(r, _.maxIndex)),
                                className: "p-1.5",
                                children: (0, t.jsx)("span", {
                                  "aria-hidden": "true",
                                  className: `block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${_.index === r ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"}`,
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
                  children: S.map((e, t) => P(e, t, f(t, S.length))),
                }),
            (0, t.jsx)("dialog", {
              ref: p,
              onClick: (e) => {
                e.target === e.currentTarget && b(null);
              },
              onKeyDown: (e) => {
                ("Escape" === e.key && b(null),
                  "ArrowLeft" === e.key && C(-1),
                  "ArrowRight" === e.key && C(1));
              },
              onTouchStart: (e) => {
                w.current = e.touches[0]?.clientX ?? null;
              },
              onTouchEnd: (e) => {
                if (null === w.current) return;
                let t = (e.changedTouches[0]?.clientX ?? 0) - w.current;
                (Math.abs(t) > 48 && C(t < 0 ? 1 : -1), (w.current = null));
              },
              className: "backdrop:bg-navy/90 m-auto bg-transparent p-0 text-ivory",
              "aria-label": (0, o.uiString)("galleryImageAlt"),
              children:
                null !== v && S[v]
                  ? (0, t.jsx)(g, {
                      items: S,
                      active: v,
                      closeLabel: m,
                      onClose: () => b(null),
                      onNavigate: C,
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
      u,
      "mosaicSpan",
      0,
      f,
    ]);
  },
  63954,
  (e) => {
    "use strict";
    var t = e.i(27693);
    let r = (0, e.i(80399).default)(() => e.A(42752).then((e) => e.CallbackForm), {
      loadableGenerated: { modules: [53303] },
      loading: () =>
        (0, t.jsxs)("div", {
          "aria-hidden": "true",
          className: "space-y-5 font-sans",
          children: [
            (0, t.jsx)("div", { className: "h-12 rounded-[4px] bg-ivory-2" }),
            (0, t.jsx)("div", { className: "h-12 rounded-[4px] bg-ivory-2" }),
            (0, t.jsx)("div", { className: "h-12 rounded-[4px] bg-ivory-2" }),
            (0, t.jsx)("div", { className: "h-12 rounded-[4px] bg-ivory-2" }),
          ],
        }),
    });
    e.s([
      "ReviewFormLoader",
      0,
      function ({ variant: e = "full", privacyHref: n }) {
        return (0, t.jsx)(r, { variant: e, privacyHref: n });
      },
    ]);
  },
  94075,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(4211);
    e.i(16233);
    var n = e.i(23322),
      i = e.i(14099),
      a = e.i(78534),
      l = e.i(70218),
      s = e.i(22142),
      o = e.i(52864),
      d = e.i(31345),
      c = e.i(6563),
      u = e.i(27867);
    function f({
      name: e,
      photo: r,
      alt: i,
      frameClassName: a,
      imageClassName: l,
      initialsClassName: s,
      width: o,
      height: d,
      sizes: c,
      priority: h,
    }) {
      let m;
      return r?.ref
        ? (0, t.jsx)(u.default, {
            src: r.ref,
            alt: i ?? "",
            width: o ?? 600,
            height: d ?? 400,
            sizes: c,
            priority: h,
            placeholder: r.lqip ? "blur" : "empty",
            blurDataURL: r.lqip,
            className: (0, n.cn)("object-cover", a, l),
          })
        : (0, t.jsx)("div", {
            "aria-hidden": "true",
            className: (0, n.cn)("flex items-center justify-center bg-navy", a),
            children: (0, t.jsx)("span", {
              className: (0, n.cn)(
                "font-serif text-gold-soft",
                s ?? "text-[length:var(--dvn-text-display-md-size)]",
              ),
              children:
                ((m = (e ?? "").replace(/\b(?:Dr|Dt)\.?\s*/gi, " ").trim()) &&
                  m
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((e) => e.charAt(0).toLocaleUpperCase("tr-TR"))
                    .join("")) ||
                "D",
            }),
          });
    }
    var h = e.i(70093),
      m = e.i(80150);
    let g = (0, c.imageTarget)();
    function p({ direction: e }) {
      return (0, t.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "h-4 w-4",
        children:
          "left" === e
            ? (0, t.jsx)("path", { d: "M19 12H5m0 0 6-6m-6 6 6 6" })
            : (0, t.jsx)("path", { d: "M5 12h14m0 0-6-6m6 6-6 6" }),
      });
    }
    e.s(
      [
        "DoctorsSection",
        0,
        function ({ items: e, team: c }) {
          let [u, v] = (0, r.useState)(0),
            [b, x] = (0, r.useState)(1),
            [y, w] = (0, r.useState)(!1),
            j = e.length;
          if (0 === j) return null;
          let k = y ? (1 === b ? "team-slide-next" : "team-slide-prev") : "",
            S = y ? (1 === b ? "team-featured-next" : "team-featured-prev") : "",
            N = (e) => {
              (x(e), w(!0), v((t) => (t + e + j) % j));
            },
            _ = Array.from({ length: Math.min(4, j) }, (t, r) => ({
              doctor: e[(u + r) % j],
              isBig: 0 === r,
            }));
          return (0, t.jsxs)(l.Section, {
            className: "bg-white",
            children: [
              (0, o.t)(c?.heading)
                ? (0, t.jsxs)(t.Fragment, {
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                          (0, t.jsx)("span", {
                            "aria-hidden": "true",
                            className: "h-px w-8 bg-gold",
                          }),
                          (0, t.jsx)("p", {
                            className: "font-sans text-xs uppercase tracking-widest text-gold-deep",
                            children: (0, o.t)(c?.eyebrow),
                          }),
                        ],
                      }),
                      (0, t.jsx)(i.Heading, {
                        level: "h2",
                        size: "md",
                        className: "mt-4 max-w-2xl",
                        children: (0, o.t)(c?.heading),
                      }),
                    ],
                  })
                : null,
              (0, o.t)(c?.text)
                ? (0, t.jsx)(s.Text, {
                    className: "mt-3 max-w-2xl text-ink/70",
                    children: (0, o.t)(c?.text),
                  })
                : null,
              (0, t.jsxs)("div", {
                className: "relative mt-10",
                children: [
                  (0, t.jsx)("p", {
                    role: "status",
                    className: "sr-only",
                    children: (0, h.uiString)("doctorsLive")(_[0]?.doctor.name ?? "", u + 1, j),
                  }),
                  (0, t.jsx)(
                    "div",
                    {
                      role: "group",
                      "aria-roledescription": "carousel",
                      "aria-label": (0, h.uiString)("doctorsRegionAria"),
                      className: "flex flex-wrap items-end gap-4",
                      children: _.map(({ doctor: e, isBig: r }) =>
                        (0, t.jsxs)(
                          a.Link,
                          {
                            href: m.routes.doctor(e.slug),
                            className: (0, n.cn)(
                              "group block",
                              r
                                ? "w-full sm:w-[38%]"
                                : "w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-0 sm:flex-1",
                              !r && k,
                            ),
                            children: [
                              (0, t.jsx)("div", {
                                className: (0, n.cn)("overflow-hidden rounded-[4px]", r && S),
                                children: (0, t.jsx)(f, {
                                  name: e.name,
                                  photo: {
                                    ref: e.photo?.ref,
                                    lqip:
                                      e.lqip ??
                                      (e.photo?.ref ? (0, d.lqipUrl)(e.photo.ref, g) : void 0),
                                  },
                                  alt: (0, o.t)(e.photo?.alt) || e.name,
                                  frameClassName: "aspect-[20/21] w-full",
                                  width: r ? 800 : 400,
                                  height: r ? 840 : 420,
                                  sizes: r ? "(max-width: 1023px) 100vw, 38vw" : "220px",
                                  imageClassName:
                                    "transition-transform duration-500 group-hover:scale-105",
                                }),
                              }),
                              (0, t.jsx)("p", {
                                className: (0, n.cn)(
                                  "mt-3 text-ink",
                                  r
                                    ? "font-sans text-lg font-medium"
                                    : "font-sans text-sm font-medium",
                                ),
                                children: e.name,
                              }),
                              (0, o.t)(e.title)
                                ? (0, t.jsx)("p", {
                                    className: "mt-0.5 font-sans text-xs text-ink/70",
                                    children: (0, o.t)(e.title),
                                  })
                                : null,
                            ],
                          },
                          e.slug,
                        ),
                      ),
                    },
                    `${u}-${b}`,
                  ),
                  j > 1 &&
                    (0, t.jsxs)("div", {
                      className:
                        "mt-8 flex justify-end gap-2 sm:absolute sm:right-0 sm:top-0 sm:mt-0",
                      children: [
                        (0, t.jsx)("button", {
                          type: "button",
                          "aria-label": (0, h.uiString)("prevDoctors"),
                          onClick: () => N(-1),
                          className:
                            "flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy",
                          children: (0, t.jsx)(p, { direction: "left" }),
                        }),
                        (0, t.jsx)("button", {
                          type: "button",
                          "aria-label": (0, h.uiString)("nextDoctors"),
                          onClick: () => N(1),
                          className:
                            "flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy",
                          children: (0, t.jsx)(p, { direction: "right" }),
                        }),
                      ],
                    }),
                ],
              }),
              j > 1
                ? (0, t.jsx)("div", {
                    className: "mt-6 flex flex-wrap items-center justify-center gap-1",
                    children: e.map((e, r) =>
                      (0, t.jsx)(
                        "button",
                        {
                          type: "button",
                          "aria-label": (0, h.uiString)("doctorSlideAria")(r + 1),
                          "aria-current": r === u ? "true" : void 0,
                          onClick: () => {
                            (x(r > u ? 1 : -1), w(!0), v(r));
                          },
                          className: "p-1.5",
                          children: (0, t.jsx)("span", {
                            "aria-hidden": "true",
                            className: `block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${r === u ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"}`,
                          }),
                        },
                        e.slug ?? r,
                      ),
                    ),
                  })
                : null,
            ],
          });
        },
      ],
      94075,
    );
  },
  25195,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(4211);
    e.i(16233);
    var n = e.i(14099),
      i = e.i(78534),
      a = e.i(70218),
      l = e.i(27867),
      s = e.i(52864),
      o = e.i(80150);
    function d({ item: e }) {
      let r = (0, s.t)(e.name),
        n = (0, s.t)(e.summary),
        a = (0, t.jsxs)(t.Fragment, {
          children: [
            e.heroImage?.ref
              ? (0, t.jsx)(l.default, {
                  src: e.heroImage.ref,
                  alt: (0, s.t)(e.heroImage.alt),
                  fill: !0,
                  sizes: "(max-width: 768px) 100vw, 33vw",
                  placeholder: e.heroImage.lqip ? "blur" : "empty",
                  blurDataURL: e.heroImage.lqip,
                  className:
                    "object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none",
                })
              : null,
            (0, t.jsx)("div", {
              "aria-hidden": "true",
              className:
                "absolute inset-0 bg-gradient-to-b from-navy/70 via-transparent to-navy/90",
            }),
            r
              ? (0, t.jsx)("div", {
                  className:
                    "absolute left-4 top-4 rounded-[4px] border border-white/70 px-3 py-1.5",
                  children: (0, t.jsx)("h3", {
                    className:
                      "font-sans text-xs font-semibold uppercase tracking-widest text-white",
                    children: r,
                  }),
                })
              : null,
            n
              ? (0, t.jsx)("p", {
                  className:
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent p-4 pt-8 font-sans text-sm leading-relaxed text-white/95",
                  children: (function (e, t = 20) {
                    let r = e.split(/\s+/).filter(Boolean);
                    return r.length <= t ? e : `${r.slice(0, t).join(" ")}…`;
                  })(n),
                })
              : null,
          ],
        }),
        c = "group relative block aspect-[6/7] overflow-hidden rounded-[4px] bg-navy";
      return e.slug
        ? (0, t.jsx)(i.Link, {
            href: o.routes.treatment(e.slug),
            className: `${c} hover:no-underline hover:shadow-[var(--dvn-shadow-lift)]`,
            children: a,
          })
        : (0, t.jsx)("article", { className: c, children: a });
    }
    var c = e.i(70093);
    function u({ direction: e }) {
      return (0, t.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "h-4 w-4",
        children:
          "left" === e
            ? (0, t.jsx)("path", { d: "M19 12H5m0 0 6-6m-6 6 6 6" })
            : (0, t.jsx)("path", { d: "M5 12h14m0 0-6-6m6 6-6 6" }),
      });
    }
    let f =
      "flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy transition-colors duration-300 hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-40";
    e.s(
      [
        "QuickServicesSection",
        0,
        function ({ items: e, eyebrow: l, heading: h, ctaLabel: m }) {
          let g = (0, r.useRef)(null),
            [p, v] = (0, r.useState)(0),
            [b, x] = (0, r.useState)(0),
            [y, w] = (0, r.useState)(!1),
            j = (0, r.useRef)(0),
            k = (0, r.useRef)(null),
            S = () => {
              let e = g.current,
                t = e?.querySelector("a,article");
              return e && t ? t.getBoundingClientRect().width + 24 : 0;
            },
            N = (e) => {
              ((j.current = e), v(e));
            },
            _ = (e) => {
              let t = g.current;
              if (!t) return;
              let r = S(),
                n = Math.min(Math.max(e, 0), b);
              N(n);
              let i = Math.min(n * r, t.scrollWidth - t.clientWidth);
              ((k.current = i), t.scrollTo({ left: i, behavior: "smooth" }));
            },
            C = () => {
              k.current = null;
            },
            P = (0, r.useCallback)(() => {
              let e = g.current,
                t = S();
              if (e && !(t <= 0)) {
                if (null !== k.current) {
                  if (Math.abs(e.scrollLeft - k.current) > t / 2) return;
                  k.current = null;
                }
                N(
                  e.scrollLeft + e.clientWidth >= e.scrollWidth - 4
                    ? b
                    : Math.min(b, Math.max(0, Math.round(e.scrollLeft / t))),
                );
              }
            }, [b]),
            M = (0, r.useCallback)(() => {
              let t = g.current,
                r = S();
              if (!t || r <= 0) return;
              let n = Math.max(1, Math.round(t.clientWidth / r)),
                i = Math.max(0, e.length - n);
              (x(i), N(Math.min(j.current, i)));
            }, [e.length]);
          return ((0, r.useEffect)(
            () => (
              M(),
              window.addEventListener("resize", M),
              () => window.removeEventListener("resize", M)
            ),
            [M, y],
          ),
          (0, r.useEffect)(() => {
            if (y) return;
            let e = () => w(!0),
              t =
                "function" == typeof window.requestIdleCallback
                  ? window.requestIdleCallback(e)
                  : window.setTimeout(e, 2e3);
            return () => {
              "function" == typeof window.cancelIdleCallback
                ? window.cancelIdleCallback(t)
                : window.clearTimeout(t);
            };
          }, [y]),
          0 === e.length)
            ? null
            : (0, t.jsxs)(a.Section, {
                children: [
                  (0, t.jsxs)("div", {
                    className: "grid gap-6 md:grid-cols-[1fr_auto] md:items-end",
                    children: [
                      (0, t.jsxs)("div", {
                        children: [
                          l
                            ? (0, t.jsxs)("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  (0, t.jsx)("span", {
                                    "aria-hidden": "true",
                                    className: "h-px w-8 bg-gold",
                                  }),
                                  (0, t.jsx)("p", {
                                    className:
                                      "font-sans text-xs uppercase tracking-widest text-gold-deep",
                                    children: l,
                                  }),
                                ],
                              })
                            : null,
                          h
                            ? (0, t.jsx)(n.Heading, {
                                level: "h2",
                                size: "md",
                                className: l ? "mt-4 max-w-2xl" : "max-w-2xl",
                                children: h,
                              })
                            : null,
                        ],
                      }),
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-3 max-md:mt-2",
                        children: [
                          m
                            ? (0, t.jsxs)(i.Link, {
                                href: o.routes.treatments,
                                className:
                                  "font-sans text-sm font-semibold text-navy underline-offset-4 hover:text-gold-deep hover:underline",
                                children: [m, " →"],
                              })
                            : null,
                          (0, t.jsxs)("div", {
                            className: "hidden gap-2 md:flex",
                            children: [
                              (0, t.jsx)("button", {
                                type: "button",
                                "aria-label": (0, c.uiString)("prevServices"),
                                onClick: () => _(p - 1),
                                disabled: 0 === p,
                                className: f,
                                children: (0, t.jsx)(u, { direction: "left" }),
                              }),
                              (0, t.jsx)("button", {
                                type: "button",
                                "aria-label": (0, c.uiString)("nextServices"),
                                onClick: () => _(p + 1),
                                disabled: p >= b,
                                className: f,
                                children: (0, t.jsx)(u, { direction: "right" }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsx)("div", {
                    ref: g,
                    onScroll: P,
                    onPointerDown: C,
                    onWheel: C,
                    className:
                      "-mx-[var(--dvn-container-gutter)] mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    children: (y ? e : e.slice(0, 6)).map((e) =>
                      (0, t.jsx)(
                        "div",
                        {
                          className: "dvn-service-card shrink-0 snap-start",
                          children: (0, t.jsx)(d, { item: e }),
                        },
                        e.slug ?? (0, s.t)(e.name),
                      ),
                    ),
                  }),
                  e.length > 1
                    ? (0, t.jsx)("div", {
                        className: "mt-4 flex flex-wrap items-center justify-center gap-1",
                        children: e.map((e, r) =>
                          (0, t.jsx)(
                            "button",
                            {
                              type: "button",
                              "aria-label": (0, c.uiString)("serviceSlideAria")(r + 1),
                              "aria-current": r === p ? "true" : void 0,
                              onClick: () => _(Math.min(r, b)),
                              className: "p-1.5",
                              children: (0, t.jsx)("span", {
                                "aria-hidden": "true",
                                className: `block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${r === p ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"}`,
                              }),
                            },
                            e.slug ?? ((0, s.t)(e.name) || r),
                          ),
                        ),
                      })
                    : null,
                ],
              });
        },
      ],
      25195,
    );
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
          [n, i] = (0, t.useState)(0),
          [a, l] = (0, t.useState)(0),
          s = (0, t.useRef)(0),
          o = (0, t.useRef)(null),
          d = (0, t.useCallback)(() => {
            let e = r.current,
              t = e?.querySelector("a,article,button,div");
            if (!e || !t) return 0;
            let n = getComputedStyle(e),
              i = parseFloat(n.columnGap || n.gap || "0") || 0;
            return t.getBoundingClientRect().width + i;
          }, []),
          c = (e) => {
            ((s.current = e), i(e));
          },
          u = (0, t.useCallback)(() => {
            let e = r.current,
              t = d();
            if (e && !(t <= 0)) {
              if (null !== o.current) {
                if (Math.abs(e.scrollLeft - o.current) > t / 2) return;
                o.current = null;
              }
              c(
                e.scrollLeft + e.clientWidth >= e.scrollWidth - 4
                  ? a
                  : Math.min(a, Math.max(0, Math.round(e.scrollLeft / t))),
              );
            }
          }, [a]),
          f = (0, t.useCallback)(() => {
            let t = r.current,
              n = d();
            if (!t || n <= 0) return;
            let i = Math.max(0, e - Math.max(1, Math.round(t.clientWidth / n)));
            (l(i), c(Math.min(s.current, i)));
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
            index: n,
            maxIndex: a,
            goTo: (e) => {
              let t = r.current;
              if (!t) return;
              let n = d(),
                i = Math.min(Math.max(e, 0), a);
              c(i);
              let l = Math.min(i * n, t.scrollWidth - t.clientWidth);
              ((o.current = l), t.scrollTo({ left: l, behavior: "smooth" }));
            },
            syncFromScroll: u,
            markUserScroll: () => {
              o.current = null;
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
      function ({ src: e, width: n, quality: i }) {
        return (0, t.urlForImage)(e, { width: n, quality: i ?? 75 }, (0, r.imageTarget)());
      },
    ]);
  },
  80150,
  (e) => {
    "use strict";
    var t = e.i(39493);
    let r = {
      home: "/",
      about: t.site.routes.about,
      treatments: t.site.routes.treatments,
      doctors: t.site.routes.doctors,
      branches: t.site.routes.branches,
      blog: t.site.routes.blog,
      contact: t.site.routes.contact,
      gallery: t.site.routes.gallery,
      legal: t.site.routes.legal,
      treatment: (e) => (e ? `${t.site.routes.treatments}/${e}` : t.site.routes.treatments),
      doctor: (e) => (e ? `${t.site.routes.doctors}/${e}` : t.site.routes.doctors),
      branch: (e) => (e ? `${t.site.routes.branches}/${e}` : t.site.routes.branches),
      blogPost: (e) => (e ? `${t.site.routes.blog}/${e}` : t.site.routes.blog),
    };
    e.s(["routes", 0, r]);
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
    let n = e.r(36437),
      i = e.r(56421),
      a = e.r(27693),
      l = i._(e.r(4211)),
      s = n._(e.r(94503)),
      o = n._(e.r(48104)),
      d = e.r(29329),
      c = e.r(1302),
      u = e.r(77279),
      f = e.r(2058),
      h = n._(e.r(91765)),
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
    function p(e, t, r, n, i, a, l) {
      let s = e?.src;
      e &&
        e["data-loaded-src"] !== s &&
        ((e["data-loaded-src"] = s),
        ("decode" in e ? e.decode() : Promise.resolve())
          .catch(() => {})
          .then(() => {
            if (e.parentElement && e.isConnected) {
              if (("empty" !== t && i(!0), r?.current)) {
                let t = new Event("load");
                Object.defineProperty(t, "target", { writable: !1, value: e });
                let n = !1,
                  i = !1;
                r.current({
                  ...t,
                  nativeEvent: t,
                  currentTarget: e,
                  target: e,
                  isDefaultPrevented: () => n,
                  isPropagationStopped: () => i,
                  persist: () => {},
                  preventDefault: () => {
                    ((n = !0), t.preventDefault());
                  },
                  stopPropagation: () => {
                    ((i = !0), t.stopPropagation());
                  },
                });
              }
              n?.current && n.current(e);
            }
          }));
    }
    function v(e) {
      return l.use ? { fetchPriority: e } : { fetchpriority: e };
    }
    "u" < typeof window && (globalThis.__NEXT_IMAGE_IMPORTED = !0);
    let b = "u" < typeof window ? l.useEffect : l.useLayoutEffect,
      x = (0, l.forwardRef)(
        (
          {
            src: e,
            srcSet: t,
            sizes: r,
            height: n,
            width: i,
            decoding: s,
            className: o,
            style: d,
            fetchPriority: c,
            placeholder: u,
            loading: f,
            unoptimized: h,
            fill: g,
            onLoadRef: x,
            onLoadingCompleteRef: y,
            setBlurComplete: w,
            setShowAltText: j,
            sizesInput: k,
            onLoad: S,
            onError: N,
            ..._
          },
          C,
        ) => {
          let P = (0, l.useRef)(!1),
            M = (0, l.useRef)(null);
          b(() => {
            let { current: e } = P,
              { current: t } = M;
            e ||
              null === t ||
              (N && (t.src = t.src), t.complete && p(t, u, x, y, w, h, k), (P.current = !0));
          }, [e, u, x, y, N, h, k]);
          let z = (0, m.useMergedRef)(C, M);
          return (0, a.jsx)("img", {
            ..._,
            ...v(c),
            loading: f,
            width: i,
            height: n,
            decoding: s,
            "data-nimg": g ? "fill" : "1",
            className: o,
            style: d,
            sizes: r,
            srcSet: t,
            src: e,
            ref: z,
            onLoad: (e) => {
              p(e.currentTarget, u, x, y, w, h, k);
            },
            onError: (e) => {
              (j(!0), "empty" !== u && w(!0), N && N(e));
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
        ...v(t.fetchPriority),
      };
      return e && s.default.preload
        ? (s.default.preload(t.src, r), null)
        : (0, a.jsx)(o.default, {
            children: (0, a.jsx)(
              "link",
              { rel: "preload", href: t.srcSet ? void 0 : t.src, ...r },
              "__nimg-" + t.src + t.srcSet + t.sizes,
            ),
          });
    }
    let w = (0, l.forwardRef)((e, t) => {
      let r = (0, l.useContext)(f.RouterContext),
        n = (0, l.useContext)(u.ImageConfigContext),
        i = (0, l.useMemo)(() => {
          let e = g || n || c.imageConfigDefault,
            t = [...e.deviceSizes, ...e.imageSizes].sort((e, t) => e - t),
            r = e.deviceSizes.sort((e, t) => e - t),
            i = e.qualities?.sort((e, t) => e - t);
          return {
            ...e,
            allSizes: t,
            deviceSizes: r,
            qualities: i,
            localPatterns: "u" < typeof window ? n?.localPatterns : e.localPatterns,
          };
        }, [n]),
        { onLoad: s, onLoadingComplete: o } = e,
        m = (0, l.useRef)(s);
      (0, l.useEffect)(() => {
        m.current = s;
      }, [s]);
      let p = (0, l.useRef)(o);
      (0, l.useEffect)(() => {
        p.current = o;
      }, [o]);
      let [v, b] = (0, l.useState)(!1),
        [w, j] = (0, l.useState)(!1),
        { props: k, meta: S } = (0, d.getImgProps)(e, {
          defaultLoader: h.default,
          imgConf: i,
          blurComplete: v,
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
            setBlurComplete: b,
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
  5440,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      bindSnapshot: function () {
        return d;
      },
      createAsyncLocalStorage: function () {
        return o;
      },
      createSnapshot: function () {
        return c;
      },
    };
    for (var i in n) Object.defineProperty(r, i, { enumerable: !0, get: n[i] });
    let a = Object.defineProperty(
      Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"),
      "__NEXT_ERROR_CODE",
      { value: "E504", enumerable: !1, configurable: !0 },
    );
    class l {
      disable() {
        throw a;
      }
      getStore() {}
      run() {
        throw a;
      }
      exit() {
        throw a;
      }
      enterWith() {
        throw a;
      }
      static bind(e) {
        return e;
      }
    }
    let s = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
    function o() {
      return s ? new s() : new l();
    }
    function d(e) {
      return s ? s.bind(e) : l.bind(e);
    }
    function c() {
      return s
        ? s.snapshot()
        : function (e, ...t) {
            return e(...t);
          };
    }
  },
  90373,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "workAsyncStorageInstance", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let n = (0, e.r(5440).createAsyncLocalStorage)();
  },
  45482,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "workAsyncStorage", {
        enumerable: !0,
        get: function () {
          return n.workAsyncStorageInstance;
        },
      }));
    let n = e.r(90373);
  },
  55152,
  (e, t, r) => {
    "use strict";
    function n(e) {
      return e
        .split("/")
        .map((e) => encodeURIComponent(e))
        .join("/");
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "encodeURIPath", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
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
    let n = e.r(56615),
      i = e.r(61205),
      a = e.r(1302),
      l = ["-moz-initial", "fill", "none", "scale-down", void 0];
    function s(e) {
      return void 0 !== e.default;
    }
    function o(e) {
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
        priority: c = !1,
        preload: u = !1,
        loading: f,
        className: h,
        quality: m,
        width: g,
        height: p,
        fill: v = !1,
        style: b,
        overrideSrc: x,
        onLoad: y,
        onLoadingComplete: w,
        placeholder: j = "empty",
        blurDataURL: k,
        fetchPriority: S,
        decoding: N = "async",
        layout: _,
        objectFit: C,
        objectPosition: P,
        lazyBoundary: M,
        lazyRoot: z,
        ...O
      },
      R,
    ) {
      var E;
      let L,
        I,
        T,
        { imgConf: D, showAltText: $, blurComplete: A, defaultLoader: q } = R,
        U = D || a.imageConfigDefault;
      if ("allSizes" in U) L = U;
      else {
        let e = [...U.deviceSizes, ...U.imageSizes].sort((e, t) => e - t),
          t = U.deviceSizes.sort((e, t) => e - t),
          r = U.qualities?.sort((e, t) => e - t);
        L = { ...U, allSizes: e, deviceSizes: t, qualities: r };
      }
      if (void 0 === q)
        throw Object.defineProperty(
          Error(
            "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E163", enumerable: !1, configurable: !0 },
        );
      let B = O.loader || q;
      (delete O.loader, delete O.srcSet);
      let W = "__next_img_default" in B;
      if (W) {
        if ("custom" === L.loader)
          throw Object.defineProperty(
            Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),
            "__NEXT_ERROR_CODE",
            { value: "E252", enumerable: !1, configurable: !0 },
          );
      } else {
        let e = B;
        B = (t) => {
          let { config: r, ...n } = t;
          return e(n);
        };
      }
      if (_) {
        "fill" === _ && (v = !0);
        let e = {
          intrinsic: { maxWidth: "100%", height: "auto" },
          responsive: { width: "100%", height: "auto" },
        }[_];
        e && (b = { ...b, ...e });
        let r = { responsive: "100vw", fill: "100vw" }[_];
        r && !t && (t = r);
      }
      let F = "",
        H = o(g),
        G = o(p);
      if ((E = e) && "object" == typeof E && (s(E) || void 0 !== E.src)) {
        let t = s(e) ? e.default : e;
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
        if (((I = t.blurWidth), (T = t.blurHeight), (k = k || t.blurDataURL), (F = t.src), !v))
          if (H || G) {
            if (H && !G) {
              let e = H / t.width;
              G = Math.round(t.height * e);
            } else if (!H && G) {
              let e = G / t.height;
              H = Math.round(t.width * e);
            }
          } else ((H = t.width), (G = t.height));
      }
      let X = !c && !u && ("lazy" === f || void 0 === f);
      ((!(e = "string" == typeof e ? e : F) || e.startsWith("data:") || e.startsWith("blob:")) &&
        ((r = !0), (X = !1)),
        L.unoptimized && (r = !0),
        W && !L.dangerouslyAllowSVG && e.split("?", 1)[0].endsWith(".svg") && (r = !0));
      let V = o(m),
        K = Object.assign(
          v
            ? {
                position: "absolute",
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: C,
                objectPosition: P,
              }
            : {},
          $ ? {} : { color: "transparent" },
          b,
        ),
        Y =
          A || "empty" === j
            ? null
            : "blur" === j
              ? `url("data:image/svg+xml;charset=utf-8,${(0, i.getImageBlurSvg)({ widthInt: H, heightInt: G, blurWidth: I, blurHeight: T, blurDataURL: k || "", objectFit: K.objectFit })}")`
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
          width: i,
          quality: a,
          sizes: l,
          loader: s,
        }) {
          if (r) {
            if (t.startsWith("/") && !t.startsWith("//")) {
              let e = (0, n.getDeploymentId)();
              if (t.includes("/_next/static/immutable") && !(0, n.getAssetToken)()) e = void 0;
              else if (e) {
                let r = t.indexOf("?");
                if (-1 !== r) {
                  let n = new URLSearchParams(t.slice(r + 1));
                  n.get("dpl") || (n.append("dpl", e), (t = t.slice(0, r) + "?" + n.toString()));
                } else t += `?dpl=${e}`;
              }
            }
            return { src: t, srcSet: void 0, sizes: void 0 };
          }
          let { widths: o, kind: d } = (function ({ deviceSizes: e, allSizes: t }, r, n) {
              if (n) {
                let r = /(^|\s)(1?\d?\d)vw/g,
                  i = [];
                for (let e; (e = r.exec(n));) i.push(parseInt(e[2]));
                if (i.length) {
                  let r = 0.01 * Math.min(...i);
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
            })(e, i, l),
            c = o.length - 1;
          return {
            sizes: l || "w" !== d ? l : "100vw",
            srcSet: o
              .map(
                (r, n) =>
                  `${s({ config: e, src: t, quality: a, width: r })} ${"w" === d ? r : n + 1}${d}`,
              )
              .join(", "),
            src: s({ config: e, src: t, quality: a, width: o[c] }),
          };
        })({ config: L, src: e, unoptimized: r, width: H, quality: V, sizes: t, loader: B }),
        ee = X ? "lazy" : f;
      return {
        props: {
          ...O,
          loading: ee,
          fetchPriority: S,
          width: H,
          height: G,
          decoding: N,
          className: h,
          style: { ...K, ...Q },
          sizes: Z.sizes,
          srcSet: Z.srcSet,
          src: x || Z.src,
        },
        meta: { unoptimized: r, preload: u || c, placeholder: j, fill: v },
      };
    }
  },
  48104,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      default: function () {
        return g;
      },
      defaultHead: function () {
        return u;
      },
    };
    for (var i in n) Object.defineProperty(r, i, { enumerable: !0, get: n[i] });
    let a = e.r(36437),
      l = e.r(56421),
      s = e.r(27693),
      o = l._(e.r(4211)),
      d = a._(e.r(45140)),
      c = e.r(44743);
    function u() {
      return [
        (0, s.jsx)("meta", { charSet: "utf-8" }, "charset"),
        (0, s.jsx)("meta", { name: "viewport", content: "width=device-width" }, "viewport"),
      ];
    }
    function f(e, t) {
      return "string" == typeof t || "number" == typeof t
        ? e
        : t.type === o.default.Fragment
          ? e.concat(
              o.default.Children.toArray(t.props.children).reduce(
                (e, t) => ("string" == typeof t || "number" == typeof t ? e : e.concat(t)),
                [],
              ),
            )
          : e.concat(t);
    }
    let h = ["name", "httpEquiv", "charSet", "itemProp"];
    function m(e) {
      let t, r, n, i;
      return e
        .reduce(f, [])
        .reverse()
        .concat(u().reverse())
        .filter(
          ((t = new Set()),
          (r = new Set()),
          (n = new Set()),
          (i = {}),
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
                    if ("charSet" === r) n.has(r) ? (a = !1) : n.add(r);
                    else {
                      let t = e.props[r],
                        n = i[r] || new Set();
                      ("name" !== r || !l) && n.has(t) ? (a = !1) : (n.add(t), (i[r] = n));
                    }
                }
            }
            return a;
          }),
        )
        .reverse()
        .map((e, t) => {
          let r = e.key || t;
          return o.default.cloneElement(e, { key: r });
        });
    }
    let g = function ({ children: e }) {
      let t = (0, o.useContext)(c.HeadManagerContext);
      return (0, s.jsx)(d.default, { reduceComponentsToState: m, headManager: t, children: e });
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
    function n({
      widthInt: e,
      heightInt: t,
      blurWidth: r,
      blurHeight: i,
      blurDataURL: a,
      objectFit: l,
    }) {
      let s = r ? 40 * r : e,
        o = i ? 40 * i : t,
        d = s && o ? `viewBox='0 0 ${s} ${o}'` : "";
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d ? "none" : "contain" === l ? "xMidYMid" : "cover" === l ? "xMidYMid slice" : "none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`;
    }
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "getImageBlurSvg", {
        enumerable: !0,
        get: function () {
          return n;
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
    let n = e.r(36437)._(e.r(4211)),
      i = e.r(1302),
      a = n.default.createContext(i.imageConfigDefault);
  },
  2058,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "RouterContext", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let n = e.r(36437)._(e.r(4211)).default.createContext(null);
  },
  1302,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      VALID_LOADERS: function () {
        return a;
      },
      imageConfigDefault: function () {
        return l;
      },
    };
    for (var i in n) Object.defineProperty(r, i, { enumerable: !0, get: n[i] });
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
    var n = {
      default: function () {
        return c;
      },
      getImageProps: function () {
        return d;
      },
    };
    for (var i in n) Object.defineProperty(r, i, { enumerable: !0, get: n[i] });
    let a = e.r(36437),
      l = e.r(29329),
      s = e.r(7305),
      o = a._(e.r(91765));
    function d(e) {
      let { props: t } = (0, l.getImgProps)(e, {
        defaultLoader: o.default,
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
    let c = s.Image;
  },
  27867,
  (e, t, r) => {
    t.exports = e.r(40267);
  },
  57388,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "BailoutToCSR", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let n = e.r(5755);
    function i({ reason: e, children: t }) {
      if ("u" < typeof window)
        throw Object.defineProperty(new n.BailoutToCSRError(e), "__NEXT_ERROR_CODE", {
          value: "E394",
          enumerable: !1,
          configurable: !0,
        });
      return t;
    }
  },
  83165,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "PreloadChunks", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    let n = e.r(27693),
      i = e.r(94503),
      a = e.r(45482),
      l = e.r(55152),
      s = e.r(56615);
    function o({ moduleIds: e }) {
      if ("u" > typeof window) return null;
      let t = a.workAsyncStorage.getStore();
      if (void 0 === t) return null;
      let r = [];
      if (t.reactLoadableManifest && e) {
        let n = t.reactLoadableManifest;
        for (let t of e) {
          if (!n[t]) continue;
          let e = n[t].files;
          r.push(...e);
        }
      }
      if (0 === r.length) return null;
      let d = (0, s.getAssetTokenQuery)();
      return (0, n.jsx)(n.Fragment, {
        children: r.map((e) => {
          let r = `${t.assetPrefix}/_next/${(0, l.encodeURIPath)(e)}${d}`;
          return e.endsWith(".css")
            ? (0, n.jsx)(
                "link",
                { precedence: "dynamic", href: r, rel: "stylesheet", as: "style", nonce: t.nonce },
                e,
              )
            : ((0, i.preload)(r, { as: "script", fetchPriority: "low", nonce: t.nonce }), null);
        }),
      });
    }
  },
  20305,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return d;
        },
      }));
    let n = e.r(27693),
      i = e.r(4211),
      a = e.r(57388),
      l = e.r(83165);
    function s(e) {
      return { default: e && "default" in e ? e.default : e };
    }
    let o = { loader: () => Promise.resolve(s(() => null)), loading: null, ssr: !0 },
      d = function (e) {
        let t = { ...o, ...e },
          r = (0, i.lazy)(() => t.loader().then(s)),
          d = t.loading;
        function c(e) {
          let s = d ? (0, n.jsx)(d, { isLoading: !0, pastDelay: !0, error: null }) : null,
            o = !t.ssr || !!t.loading,
            c = o ? i.Suspense : i.Fragment,
            u = t.ssr
              ? (0, n.jsxs)(n.Fragment, {
                  children: [
                    "u" < typeof window
                      ? (0, n.jsx)(l.PreloadChunks, { moduleIds: t.modules })
                      : null,
                    (0, n.jsx)(r, { ...e }),
                  ],
                })
              : (0, n.jsx)(a.BailoutToCSR, {
                  reason: "next/dynamic",
                  children: (0, n.jsx)(r, { ...e }),
                });
          return (0, n.jsx)(c, { ...(o ? { fallback: s } : {}), children: u });
        }
        return ((c.displayName = "LoadableComponent"), c);
      };
  },
  80399,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let n = e.r(36437)._(e.r(20305));
    function i(e, t) {
      let r = {};
      "function" == typeof e && (r.loader = e);
      let i = { ...r, ...t };
      return (0, n.default)({ ...i, modules: i.loadableGenerated?.modules });
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  45140,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function () {
          return s;
        },
      }));
    let n = e.r(4211),
      i = "u" < typeof window,
      a = i ? () => {} : n.useLayoutEffect,
      l = i ? () => {} : n.useEffect;
    function s(e) {
      let { headManager: t, reduceComponentsToState: r } = e;
      function s() {
        if (t && t.mountedInstances) {
          let e = n.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));
          t.updateHead(r(e));
        }
      }
      return (
        i && (t?.mountedInstances?.add(e.children), s()),
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
            t && (t._pendingUpdate = s),
            () => {
              t && (t._pendingUpdate = s);
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
    function t(e, r = {}, n) {
      let i = (function (e) {
          let t = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(e);
          if (!t) throw Error(`Invalid Sanity image reference: ${e}`);
          let [, r, n, i] = t;
          return `${r}-${n}.${i}`;
        })(e),
        a = new URLSearchParams({
          auto: "format",
          fit: r.fit ?? "crop",
          ...(r.width ? { w: String(r.width) } : {}),
          ...(r.quality ? { q: String(r.quality) } : {}),
        });
      return `https://cdn.sanity.io/images/${n.projectId}/${n.dataset}/${i}?${a.toString()}`;
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
      n = e.i(39493);
    e.s(
      [
        "imageTarget",
        0,
        function () {
          return {
            projectId: n.site.sanity.projectId,
            dataset: r.default.env.SANITY_DATASET ?? n.site.sanity.dataset,
          };
        },
      ],
      6563,
    );
  },
  16233,
  14099,
  70218,
  22142,
  (e) => {
    "use strict";
    e.i(83707);
    var t = e.i(27693),
      r = e.i(94237),
      n = e.i(4211),
      i = e.i(23322);
    ((0, r.cva)(
      "inline-flex items-center px-3 py-1 font-sans text-[length:var(--dvn-text-micro-size)] font-semibold uppercase tracking-widest",
      {
        variants: {
          tone: {
            goldOnNavy: "bg-navy text-gold",
            navyOnGold: "bg-gold text-navy",
            neutral: "bg-white text-ink",
          },
        },
        defaultVariants: { tone: "goldOnNavy" },
      },
    ),
      e.i(77607),
      (0, r.cva)("border p-6 transition-shadow duration-300", {
        variants: {
          tone: {
            light: "border-[var(--dvn-line-soft)] bg-white text-ink",
            dark: "border-[var(--dvn-line-gold)] bg-navy text-white",
          },
          hover: { none: "", lift: "hover:shadow-[var(--dvn-shadow-lift)]" },
        },
        defaultVariants: { tone: "light", hover: "none" },
      }),
      e.i(78534),
      e.i(9196));
    let a = {
        xl: "text-[length:var(--dvn-text-display-xl-size)] leading-[var(--dvn-text-display-xl-lh)]",
        lg: "text-[length:var(--dvn-text-display-lg-size)] leading-[var(--dvn-text-display-lg-lh)]",
        md: "text-[length:var(--dvn-text-display-md-size)] leading-[var(--dvn-text-display-md-lh)]",
        sm: "text-[length:var(--dvn-text-display-sm-size)] leading-[var(--dvn-text-display-sm-lh)]",
        title: "text-[length:var(--dvn-text-title-size)] leading-[var(--dvn-text-title-lh)]",
      },
      l = (0, n.forwardRef)(function ({ className: e, level: r, size: n = "lg", ...l }, s) {
        return (0, t.jsx)(r, {
          ref: s,
          className: (0, i.cn)("font-serif text-navy [text-wrap:balance]", a[n], e),
          ...l,
        });
      });
    (e.s(["Heading", 0, l], 14099), e.i(17016));
    let s = (0, n.forwardRef)(function ({ className: e, innerClassName: r, children: n, ...a }, l) {
      return (0, t.jsx)("section", {
        ref: l,
        className: (0, i.cn)("py-[var(--dvn-section-y)] md:py-[var(--dvn-section-y-md)]", e),
        ...a,
        children: (0, t.jsx)("div", {
          className: (0, i.cn)(
            "mx-auto w-full max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)]",
            r,
          ),
          children: n,
        }),
      });
    });
    e.s(["Section", 0, s], 70218);
    let o = {
        lg: "text-[length:var(--dvn-text-body-lg-size)] leading-[var(--dvn-text-body-lg-lh)]",
        base: "text-[length:var(--dvn-text-body-size)] leading-[var(--dvn-text-body-lh)]",
        small: "text-[length:var(--dvn-text-small-size)] leading-[var(--dvn-text-small-lh)]",
        micro: "text-[length:var(--dvn-text-micro-size)] leading-[var(--dvn-text-micro-lh)]",
      },
      d = (0, n.forwardRef)(function (
        { className: e, size: r = "base", tone: n = "ink", ...a },
        l,
      ) {
        return (0, t.jsx)("p", {
          ref: l,
          className: (0, i.cn)(
            "font-sans",
            o[r],
            "muted" === n
              ? "text-muted"
              : "white" === n
                ? "text-white"
                : "gold" === n
                  ? "text-gold"
                  : "text-ink",
            e,
          ),
          ...a,
        });
      });
    (e.s(["Text", 0, d], 22142), e.i(50871), e.s([], 16233));
  },
]);
