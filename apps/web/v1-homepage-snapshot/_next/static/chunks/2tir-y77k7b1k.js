(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  40759,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(4211);
    function n(e) {
      return e.replaceAll(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
    }
    ({
      ...Object.fromEntries(
        Object.entries({
          1: "4px",
          2: "8px",
          3: "12px",
          4: "16px",
          5: "24px",
          6: "32px",
          8: "48px",
          10: "64px",
          12: "80px",
        }).map(([e, t]) => [`--dvn-space-${e}`, t]),
      ),
      ...Object.fromEntries(
        Object.entries({
          displayXl: { size: "64px", lineHeight: "1.05" },
          displayLg: { size: "48px", lineHeight: "1.1" },
          displayMd: { size: "40px", lineHeight: "1.15" },
          displaySm: { size: "32px", lineHeight: "1.2" },
          title: { size: "24px", lineHeight: "1.3" },
          bodyLg: { size: "18px", lineHeight: "1.6" },
          body: { size: "16px", lineHeight: "1.6" },
          small: { size: "14px", lineHeight: "1.6" },
          micro: { size: "12px", lineHeight: "1.5" },
        }).flatMap(([e, t]) => [
          [`--dvn-text-${n(e)}-size`, t.size],
          [`--dvn-text-${n(e)}-lh`, t.lineHeight],
        ]),
      ),
      "--dvn-duration-fast": "150ms",
      "--dvn-duration-base": "300ms",
      "--dvn-duration-slow": "600ms",
      "--dvn-ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      "--dvn-stagger": "60ms",
      "--dvn-z-behind": String(-1),
      "--dvn-z-base": String(0),
      "--dvn-z-raised": String(10),
      "--dvn-z-header": String(100),
      "--dvn-z-overlay": String(200),
      "--dvn-z-modal": String(300),
    });
    let a = "espresso",
      o = [a, "gece", "deniz", "bordeaux", "zeytin", "lila", "okyanus", "gul", "tarcin", "orman"],
      l = {
        espresso: { dark: "#1c1610", accent: "#c09a55" },
        gece: { dark: "#0c1f38", accent: "#c9a35c" },
        deniz: { dark: "#0d2630", accent: "#8fd0c3" },
        bordeaux: { dark: "#291016", accent: "#cf9a6a" },
        zeytin: { dark: "#232a19", accent: "#cfc07a" },
        lila: { dark: "#241a2e", accent: "#c9b2e0" },
        okyanus: { dark: "#0b2545", accent: "#a8cfe8" },
        gul: { dark: "#2e1a22", accent: "#d99ba6" },
        tarcin: { dark: "#301c12", accent: "#d98e4a" },
        orman: { dark: "#14251c", accent: "#a3c9a8" },
      },
      i = "dvn-palette";
    o.filter((e) => e !== a)
      .map((e) => `"${e}"`)
      .join(",");
    var u = e.i(70093);
    let s = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 },
      c = Object.fromEntries(o.map((e) => [e, `dvn-swatch-${e}`]));
    e.s(
      [
        "ThemeSwitcher",
        0,
        function () {
          let [e, n] = (0, r.useState)(!1),
            [d, f] = (0, r.useState)(!1),
            [p, m] = (0, r.useState)(a),
            h = (0, r.useRef)(null),
            y = (0, r.useRef)(null),
            g = (0, r.useRef)(null);
          if (
            ((0, r.useEffect)(() => {
              var e;
              let t = null != (e = localStorage.getItem(i)) && o.includes(e) ? e : null;
              t && m(t);
            }, []),
            (0, r.useEffect)(() => {
              let e = h.current;
              if (!e) return;
              let t = () => {
                  g.current && (clearTimeout(g.current), (g.current = null));
                },
                r = () => {
                  (t(), f(!0));
                },
                n = () => {
                  (t(), (g.current = setTimeout(() => f(!1), 300)));
                },
                a = (r) => {
                  e.contains(r.relatedTarget) || (t(), f(!1));
                },
                o = (e) => {
                  "Escape" === e.key && (t(), f(!1), y.current?.focus());
                };
              return (
                e.addEventListener("mouseenter", r),
                e.addEventListener("mouseleave", n),
                e.addEventListener("focusout", a),
                e.addEventListener("keydown", o),
                () => {
                  (t(),
                    e.removeEventListener("mouseenter", r),
                    e.removeEventListener("mouseleave", n),
                    e.removeEventListener("focusout", a),
                    e.removeEventListener("keydown", o));
                }
              );
            }, []),
            e)
          )
            return null;
          let b = (e) => {
            m(e);
            try {
              (e === a
                ? delete document.documentElement.dataset.palette
                : (document.documentElement.dataset.palette = e),
                localStorage.setItem(i, e));
            } catch {}
          };
          return (0, t.jsxs)("div", {
            ref: h,
            "data-theme-switcher": "",
            role: "group",
            className: "fixed bottom-6 left-0 z-[var(--dvn-z-overlay)] flex items-end",
            children: [
              (0, t.jsx)("button", {
                ref: y,
                type: "button",
                onClick: (e) => {
                  let t = e.nativeEvent instanceof PointerEvent ? e.nativeEvent.pointerType : null;
                  f((e) => "mouse" === t || !e);
                },
                "aria-expanded": d,
                "aria-controls": "dvn-theme-panel",
                "aria-label": (0, u.uiString)("themeOpenAria"),
                className:
                  "flex h-11 w-7 items-center justify-center rounded-r-[4px] border border-l-0 border-[var(--dvn-line-gold)] bg-white text-navy shadow-soft transition-shadow hover:shadow-gold focus-visible:outline-2 focus-visible:outline-gold",
                children: (0, t.jsxs)("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1.8",
                  "aria-hidden": "true",
                  className: "h-4 w-4",
                  children: [
                    (0, t.jsx)("path", {
                      d: "M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h6.5A2.5 2.5 0 0 0 21 9.5 9 9 0 0 0 12 3Z",
                    }),
                    (0, t.jsx)("circle", {
                      cx: "7.5",
                      cy: "10.5",
                      r: "1.1",
                      fill: "currentColor",
                      stroke: "none",
                    }),
                    (0, t.jsx)("circle", {
                      cx: "12",
                      cy: "7.5",
                      r: "1.1",
                      fill: "currentColor",
                      stroke: "none",
                    }),
                    (0, t.jsx)("circle", {
                      cx: "16.5",
                      cy: "10.5",
                      r: "1.1",
                      fill: "currentColor",
                      stroke: "none",
                    }),
                  ],
                }),
              }),
              d
                ? (0, t.jsxs)("div", {
                    id: "dvn-theme-panel",
                    role: "group",
                    "aria-label": (0, u.uiString)("themeLabel"),
                    className:
                      "absolute bottom-0 left-7 w-56 rounded-[4px] border border-[var(--dvn-line-gold)] bg-white p-4 shadow-lift",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                          (0, t.jsx)("span", {
                            className: "text-xs font-semibold uppercase tracking-widest text-ink",
                            children: (0, u.uiString)("themeLabel"),
                          }),
                          (0, t.jsx)("button", {
                            type: "button",
                            onClick: () => n(!0),
                            "aria-label": (0, u.uiString)("themeClose"),
                            className:
                              "flex h-11 w-11 items-center justify-center text-muted hover:text-navy focus-visible:outline-2 focus-visible:outline-gold",
                            children: (0, t.jsx)("svg", {
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2",
                              "aria-hidden": "true",
                              className: "h-4 w-4",
                              children: (0, t.jsx)("path", { d: "M6 6l12 12M18 6L6 18" }),
                            }),
                          }),
                        ],
                      }),
                      (0, t.jsx)("div", {
                        role: "radiogroup",
                        "aria-label": (0, u.uiString)("themeLabel"),
                        className: "mt-2 grid grid-cols-5 gap-2",
                        children: o.map((e) => {
                          let r = (0, u.uiString)("paletteNames")[e],
                            n = l[e];
                          return (0, t.jsx)(
                            "button",
                            {
                              id: c[e],
                              type: "button",
                              role: "radio",
                              "aria-checked": p === e,
                              tabIndex: p === e ? 0 : -1,
                              "aria-label": r,
                              title: r,
                              onClick: () => b(e),
                              onKeyDown: (t) => {
                                if ("Home" !== t.key && "End" !== t.key && !(t.key in s)) return;
                                t.preventDefault();
                                let r = o.indexOf(e),
                                  n =
                                    "Home" === t.key
                                      ? 0
                                      : "End" === t.key
                                        ? o.length - 1
                                        : (r + s[t.key] + o.length) % o.length;
                                (b(o[n]), document.getElementById(c[o[n]])?.focus());
                              },
                              style: {
                                background: `linear-gradient(135deg, ${n.dark} 0% 50%, ${n.accent} 50% 100%)`,
                              },
                              className:
                                "h-8 w-8 rounded-[4px] border border-[var(--dvn-line-gold)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" +
                                (p === e
                                  ? " ring-2 ring-gold ring-offset-2 ring-offset-white"
                                  : ""),
                            },
                            e,
                          );
                        }),
                      }),
                    ],
                  })
                : null,
            ],
          });
        },
      ],
      40759,
    );
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
  22685,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      default: function () {
        return g;
      },
      useLinkStatus: function () {
        return v;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = e.r(56421),
      l = e.r(27693),
      i = o._(e.r(4211)),
      u = e.r(3055),
      s = e.r(94662),
      c = e.r(89360),
      d = e.r(97741),
      f = e.r(57572),
      p = e.r(10433),
      m = e.r(77573),
      h = e.r(70813),
      y = e.r(62562);
    function g(t) {
      var r;
      let n,
        a,
        o,
        [g, v] = (0, i.useOptimistic)(m.IDLE_LINK_STATUS),
        x = (0, i.useRef)(null),
        {
          href: _,
          as: j,
          children: P,
          prefetch: O = null,
          passHref: S,
          replace: C,
          shallow: E,
          scroll: k,
          onClick: T,
          onMouseEnter: R,
          onTouchStart: M,
          legacyBehavior: N = !1,
          onNavigate: L,
          transitionTypes: A,
          ref: w,
          unstable_dynamicOnHover: z,
          ...F
        } = t;
      ((n = P),
        N &&
          ("string" == typeof n || "number" == typeof n) &&
          (n = (0, l.jsx)("a", { children: n })));
      let B = i.default.useContext(s.AppRouterContext),
        D = !1 !== O,
        I = !1 === O ? "none" : !0 === O ? "full" : "auto",
        $ =
          "none" !== I
            ? "auto" === I
              ? y.FetchStrategy.PPR
              : y.FetchStrategy.Full
            : y.FetchStrategy.PPR,
        H = "string" == typeof (r = j || _) ? r : (0, u.formatUrl)(r);
      if (N) {
        if (n?.$$typeof === Symbol.for("react.lazy"))
          throw Object.defineProperty(
            Error(
              "`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E863", enumerable: !1, configurable: !0 },
          );
        a = i.default.Children.only(n);
      }
      let U = N ? a && "object" == typeof a && a.ref : w,
        K,
        V = i.default.useCallback(
          (e) => (
            null !== B && (x.current = (0, m.mountLinkInstance)(e, H, B, $, D, v, K)),
            () => {
              (x.current && ((0, m.unmountLinkForCurrentNavigation)(x.current), (x.current = null)),
                (0, m.unmountPrefetchableInstance)(e));
            }
          ),
          [D, H, B, $, v, K],
        ),
        G = {
          ref: (0, c.useMergedRef)(V, U),
          onClick(t) {
            (N || "function" != typeof T || T(t),
              N && a.props && "function" == typeof a.props.onClick && a.props.onClick(t),
              !B ||
                t.defaultPrevented ||
                (function (t, r, n, a, o, l, u, s = "none") {
                  if ("u" > typeof window) {
                    let c,
                      { nodeName: d } = t.currentTarget;
                    if (
                      ("A" === d.toUpperCase() &&
                        (((c = t.currentTarget.getAttribute("target")) && "_self" !== c) ||
                          t.metaKey ||
                          t.ctrlKey ||
                          t.shiftKey ||
                          t.altKey ||
                          (t.nativeEvent && 2 === t.nativeEvent.which))) ||
                      t.currentTarget.hasAttribute("download")
                    )
                      return;
                    if (!(0, h.isLocalURL)(r)) {
                      a && (t.preventDefault(), location.replace(r));
                      return;
                    }
                    if ((t.preventDefault(), l)) {
                      let e = !1;
                      if (
                        (l({
                          preventDefault: () => {
                            e = !0;
                          },
                        }),
                        e)
                      )
                        return;
                    }
                    let { dispatchNavigateAction: f } = e.r(13979);
                    i.default.startTransition(() => {
                      f(
                        r,
                        a ? "replace" : "push",
                        !1 === o ? p.ScrollBehavior.NoScroll : p.ScrollBehavior.Default,
                        n.current,
                        u,
                        s,
                      );
                    });
                  }
                })(t, H, x, C, k, L, A, I));
          },
          onMouseEnter(e) {
            (N || "function" != typeof R || R(e),
              N && a.props && "function" == typeof a.props.onMouseEnter && a.props.onMouseEnter(e),
              B && D && (0, m.onNavigationIntent)(e.currentTarget, !0 === z));
          },
          onTouchStart: function (e) {
            (N || "function" != typeof M || M(e),
              N && a.props && "function" == typeof a.props.onTouchStart && a.props.onTouchStart(e),
              B && D && (0, m.onNavigationIntent)(e.currentTarget, !0 === z));
          },
        };
      return (
        (0, d.isAbsoluteUrl)(H)
          ? (G.href = H)
          : (N && !S && ("a" !== a.type || "href" in a.props)) || (G.href = (0, f.addBasePath)(H)),
        (o = N ? i.default.cloneElement(a, G) : (0, l.jsx)("a", { ...F, ...G, children: n })),
        (0, l.jsx)(b.Provider, { value: g, children: o })
      );
    }
    let b = (0, i.createContext)(m.IDLE_LINK_STATUS),
      v = () => (0, i.useContext)(b);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  33627,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useRouterBFCache", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = e.r(4211);
    function a(e, t, r) {
      let [a, o] = (0, n.useState)(() => ({ tree: e, cacheNode: t, stateKey: r, next: null }));
      if (a.tree === e) return a;
      let l = { tree: e, cacheNode: t, stateKey: r, next: null },
        i = 1,
        u = a,
        s = l;
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
      return (o(l), l);
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
    let n = e.r(27693),
      a = e.r(94662),
      o = e.r(4211),
      l = e.r(48607),
      i = e.r(41481),
      u = e.r(20095);
    function s({ Component: e, serverProvidedParams: t }) {
      let r, c;
      if (null !== t) ((r = t.searchParams), (c = t.params));
      else {
        let e = (0, o.use)(a.LayoutRouterContext);
        ((c = null !== e ? e.parentParams : {}),
          (r = (0, l.urlSearchParamsToParsedUrlQuery)((0, o.use)(i.SearchParamsContext))));
      }
      let d = (0, u.createClientSearchParams)(r),
        f = (0, u.createClientParams)(c);
      return (0, n.jsx)(e, { params: f, searchParams: d });
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
    let n = e.r(27693),
      a = e.r(94662),
      o = e.r(4211),
      l = e.r(20095);
    function i({ Component: e, slots: t, serverProvidedParams: r }) {
      let u;
      if (null !== r) u = r.params;
      else {
        let e = (0, o.use)(a.LayoutRouterContext);
        u = null !== e ? e.parentParams : {};
      }
      let s = (0, l.createClientParams)(u);
      return (0, n.jsx)(e, { ...t, params: s });
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
    let n = e.r(56421),
      a = e.r(27693),
      o = n._(e.r(4211)),
      l = e.r(44606),
      i = e.r(53624),
      u = e.r(94662);
    class s extends o.default.Component {
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
        let { notFound: e, forbidden: t, unauthorized: r, children: n } = this.props,
          { triggeredStatus: o } = this.state,
          l = {
            [i.HTTPAccessErrorStatus.NOT_FOUND]: e,
            [i.HTTPAccessErrorStatus.FORBIDDEN]: t,
            [i.HTTPAccessErrorStatus.UNAUTHORIZED]: r,
          };
        if (o) {
          let u = o === i.HTTPAccessErrorStatus.NOT_FOUND && e,
            s = o === i.HTTPAccessErrorStatus.FORBIDDEN && t,
            c = o === i.HTTPAccessErrorStatus.UNAUTHORIZED && r;
          return u || s || c
            ? (0, a.jsxs)(a.Fragment, {
                children: [(0, a.jsx)("meta", { name: "robots", content: "noindex" }), !1, l[o]],
              })
            : n;
        }
        return n;
      }
    }
    function c({ notFound: e, forbidden: t, unauthorized: r, children: n }) {
      let i = (0, l.useUntrackedPathname)(),
        d = (0, o.useContext)(u.MissingSlotContext);
      return e || t || r
        ? (0, a.jsx)(s, {
            pathname: i,
            notFound: e,
            forbidden: t,
            unauthorized: r,
            missingSlots: d,
            children: n,
          })
        : (0, a.jsx)(a.Fragment, { children: n });
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
    var n = {
      InstantValidationBoundaryContext: function () {
        return o;
      },
      PlaceValidationBoundaryBelowThisLevel: function () {
        return l;
      },
      RenderValidationBoundaryAtThisLevel: function () {
        return i;
      },
      SlotMarker: function () {
        return u;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = null,
      l = null,
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
    var n = {
      InstantValidationBoundaryContext: function () {
        return o.InstantValidationBoundaryContext;
      },
      PlaceValidationBoundaryBelowThisLevel: function () {
        return o.PlaceValidationBoundaryBelowThisLevel;
      },
      RenderValidationBoundaryAtThisLevel: function () {
        return o.RenderValidationBoundaryAtThisLevel;
      },
      SlotMarker: function () {
        return o.SlotMarker;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = e.r(20213);
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
    var n = {
      LoadingBoundaryProvider: function () {
        return S;
      },
      default: function () {
        return E;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = e.r(36437),
      l = e.r(56421),
      i = e.r(27693),
      u = l._(e.r(4211)),
      s = o._(e.r(94503)),
      c = e.r(94662),
      d = e.r(92633),
      f = e.r(76688),
      p = e.r(7688),
      m = e.r(81975),
      h = e.r(56901);
    e.r(47022);
    let y = e.r(32896),
      g = e.r(33627);
    e.r(63002);
    let b = e.r(41481),
      v = e.r(48607),
      x = e.r(36872);
    s.default.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function _(e, t, r) {
      let n = e.getClientRects();
      if (0 === n.length) return 0;
      let a = 1 / 0;
      for (let e = 0; e < n.length; e++) {
        let t = n[e];
        t.top < a && (a = t.top);
      }
      return a >= r() && a <= t ? 1 : 2;
    }
    u.default.Component;
    let j = function (e) {
      let t = u.default.useRef(null);
      return (
        (0, u.useLayoutEffect)(
          () => {
            let { focusAndScrollRef: r, cacheNode: n } = e,
              a = r.forceScroll ? r.scrollRef : n.scrollRef;
            if (null === a || !a.current) return;
            let o = null,
              l = r.hashFragment;
            if (l) {
              var i;
              if (
                null ===
                (o =
                  "top" === (i = l)
                    ? document.body
                    : (document.getElementById(i) ?? document.getElementsByName(i)[0] ?? null))
              ) {
                ((a.current = !1), (r.onlyHashChange = !1), (r.hashFragment = null));
                return;
              }
            } else o = t.current;
            if (null === o) return;
            let u = !1;
            ((0, p.disableSmoothScrollDuringRouteTransition)(
              () => {
                let e = document.documentElement,
                  t = null,
                  r = null,
                  n = null,
                  i = () => {
                    var r, a;
                    let o, l;
                    return (
                      null === n &&
                        ((r = e),
                        (a = t),
                        (n =
                          !Number.isFinite(
                            (l = Number.parseFloat((o = getComputedStyle(r).scrollPaddingTop))),
                          ) || l < 0
                            ? 0
                            : o.endsWith("px")
                              ? l
                              : o.endsWith("%")
                                ? (l / 100) * a
                                : 0)),
                      n
                    );
                  };
                (l || ((t = e.clientHeight), 0 !== (r = _(o, t, i)))) &&
                  (((u = !0), (a.current = !1), l)
                    ? o.scrollIntoView()
                    : 1 !== r && ((e.scrollTop = 0), 2 === _(o, t, i) && o.scrollIntoView()));
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
    function P({ children: e, cacheNode: t }) {
      let r = (0, u.useContext)(c.GlobalLayoutRouterContext);
      if (!r)
        throw Object.defineProperty(
          Error("invariant global layout router not mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E473", enumerable: !1, configurable: !0 },
        );
      return (0, i.jsx)(j, { focusAndScrollRef: r.focusAndScrollRef, cacheNode: t, children: e });
    }
    function O({
      tree: e,
      segmentPath: t,
      debugNameContext: r,
      cacheNode: n,
      params: a,
      url: o,
      isActive: l,
    }) {
      let s,
        f = (0, u.useContext)(c.GlobalLayoutRouterContext);
      if (((0, u.useContext)(b.NavigationPromisesContext), !f))
        throw Object.defineProperty(
          Error("invariant global layout router not mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E473", enumerable: !1, configurable: !0 },
        );
      let p = null !== n ? n : (0, u.use)(d.unresolvedThenable),
        m = null !== p.prefetchRsc ? p.prefetchRsc : p.rsc,
        h = (0, u.useDeferredValue)(p.rsc, m);
      if ((0, x.isDeferredRsc)(h)) {
        let e = (0, u.use)(h);
        (null === e && (0, u.use)(d.unresolvedThenable), (s = e));
      } else (null === h && (0, u.use)(d.unresolvedThenable), (s = h));
      let y = s;
      return (0, i.jsx)(c.LayoutRouterContext.Provider, {
        value: {
          parentTree: e,
          parentCacheNode: p,
          parentSegmentPath: t,
          parentParams: a,
          parentLoadingData: null,
          debugNameContext: r,
          url: o,
          isActive: l,
        },
        children: y,
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
        let n = t[0],
          a = t[1],
          o = t[2];
        return (0, i.jsx)(u.Suspense, {
          name: e,
          fallback: (0, i.jsxs)(i.Fragment, { children: [a, o, n] }),
          children: r,
        });
      }
      return (0, i.jsx)(i.Fragment, { children: r });
    }
    function E({
      parallelRouterKey: e,
      error: t,
      errorStyles: r,
      errorScripts: n,
      templateStyles: a,
      templateScripts: o,
      template: l,
      notFound: s,
      forbidden: p,
      unauthorized: b,
      segmentViewBoundaries: x,
    }) {
      let _ = (0, u.useContext)(c.LayoutRouterContext);
      if (!_)
        throw Object.defineProperty(
          Error("invariant expected layout router to be mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E56", enumerable: !1, configurable: !0 },
        );
      let {
          parentTree: j,
          parentCacheNode: S,
          parentSegmentPath: k,
          parentParams: T,
          parentLoadingData: R,
          url: M,
          isActive: N,
          debugNameContext: L,
        } = _,
        A = j[0],
        w = null === k ? [e] : k.concat([A, e]),
        z = j[1][e],
        F = S.slots;
      (void 0 === z || null === F) && (0, u.use)(d.unresolvedThenable);
      let B = z[0],
        D = F[e] ?? null,
        I = (0, y.createRouterCacheKey)(B, !0),
        $ = (0, g.useRouterBFCache)(z, D, I),
        H = [];
      do {
        let e = $.tree,
          u = $.cacheNode,
          d = $.stateKey,
          y = e[0],
          g = T;
        if (Array.isArray(y)) {
          let e = y[0],
            t = y[1],
            r = y[2],
            n = (0, v.getParamValueFromCacheKey)(t, r);
          null !== n && (g = { ...T, [e]: n });
        }
        let x = (function (e) {
            if ("/" === e) return "/";
            if ("string" == typeof e)
              if ("(__SLOT__)" === e) return;
              else return e + "/";
            return e[1] + "/";
          })(y),
          _ = x ?? L,
          j = void 0 === x ? void 0 : L,
          S = (0, i.jsxs)(P, {
            cacheNode: u,
            children: [
              (0, i.jsx)(f.ErrorBoundary, {
                errorComponent: t,
                errorStyles: r,
                errorScripts: n,
                children: (0, i.jsx)(C, {
                  name: j,
                  loading: R,
                  children: (0, i.jsx)(h.HTTPAccessFallbackBoundary, {
                    notFound: s,
                    forbidden: p,
                    unauthorized: b,
                    children: (0, i.jsxs)(m.RedirectBoundary, {
                      children: [
                        (0, i.jsx)(O, {
                          url: M,
                          tree: e,
                          params: g,
                          cacheNode: u,
                          segmentPath: w,
                          debugNameContext: _,
                          isActive: N && d === I,
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
          E = (0, i.jsxs)(c.TemplateContext.Provider, { value: S, children: [a, o, l] }, d);
        (H.push(E), ($ = $.next));
      } while (null !== $);
      return H;
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
    let n = e.r(56421),
      a = e.r(27693),
      o = n._(e.r(4211)),
      l = e.r(94662);
    function i() {
      let e = (0, o.useContext)(l.TemplateContext);
      return (0, a.jsx)(a.Fragment, { children: e });
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
          return a;
        },
      }));
    let n = new WeakMap();
    function a(e) {
      let t = n.get(e);
      if (t) return t;
      let r = Promise.resolve(e);
      return (n.set(e, r), r);
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
          return n;
        },
      }));
    let n = e.r(58490).createRenderParamsFromClient;
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
          return a;
        },
      }));
    let n = new WeakMap();
    function a(e) {
      let t = n.get(e);
      if (t) return t;
      let r = Promise.resolve(e);
      return (n.set(e, r), r);
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
          return n;
        },
      }));
    let n = e.r(13600).createRenderSearchParamsFromClient;
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
    var n = {
      createClientParams: function () {
        return o.createRenderParamsFromClient;
      },
      createClientSearchParams: function () {
        return l.createRenderSearchParamsFromClient;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = e.r(48477),
      l = e.r(72015);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  89360,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useMergedRef", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = e.r(4211);
    function a(e, t) {
      let r = (0, n.useRef)(null),
        a = (0, n.useRef)(null);
      return (0, n.useCallback)(
        (n) => {
          if (null === n) {
            let e = r.current;
            e && ((r.current = null), e());
            let t = a.current;
            t && ((a.current = null), t());
          } else (e && (r.current = o(e, n)), t && (a.current = o(t, n)));
        },
        [e, t],
      );
    }
    function o(e, t) {
      if ("function" != typeof e)
        return (
          (e.current = t),
          () => {
            e.current = null;
          }
        );
      {
        let r = e(t);
        return "function" == typeof r ? r : () => e(null);
      }
    }
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
          return a;
        },
      }));
    let n = e.r(27693),
      a = () => ("u" > typeof window ? null : (0, n.jsx)("meta", { name: "«nxt-icon»" }));
  },
  7688,
  (e, t, r) => {
    "use strict";
    function n(e, t = {}) {
      if (t.onlyHashChange) return void e();
      let r = document.documentElement;
      if ("smooth" !== r.dataset.scrollBehavior) return void e();
      let a = r.style.scrollBehavior;
      ((r.style.scrollBehavior = "auto"),
        t.dontForceLayout || r.getClientRects(),
        e(),
        (r.style.scrollBehavior = a));
    }
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "disableSmoothScrollDuringRouteTransition", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
  },
  70813,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "isLocalURL", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    let n = e.r(97741),
      a = e.r(86460);
    function o(e) {
      if (!(0, n.isAbsoluteUrl)(e)) return !0;
      try {
        let t = (0, n.getLocationOrigin)(),
          r = new URL(e, t);
        return r.origin === t && (0, a.hasBasePath)(r.pathname);
      } catch (e) {
        return !1;
      }
    }
  },
  38212,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      assign: function () {
        return u;
      },
      searchParamsToUrlQuery: function () {
        return o;
      },
      urlQueryToSearchParams: function () {
        return i;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    function o(e) {
      let t = {};
      for (let [r, n] of e.entries()) {
        let e = t[r];
        void 0 === e ? (t[r] = n) : Array.isArray(e) ? e.push(n) : (t[r] = [e, n]);
      }
      return t;
    }
    function l(e) {
      return "string" == typeof e
        ? e
        : ("number" != typeof e || isNaN(e)) && "boolean" != typeof e
          ? ""
          : String(e);
    }
    function i(e) {
      let t = new URLSearchParams();
      for (let [r, n] of Object.entries(e))
        if (Array.isArray(n)) for (let e of n) t.append(r, l(e));
        else t.set(r, l(n));
      return t;
    }
    function u(e, ...t) {
      for (let r of t) {
        for (let t of r.keys()) e.delete(t);
        for (let [t, n] of r.entries()) e.append(t, n);
      }
      return e;
    }
  },
  3055,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      formatUrl: function () {
        return i;
      },
      formatWithValidation: function () {
        return s;
      },
      urlObjectKeys: function () {
        return u;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = e.r(56421)._(e.r(38212)),
      l = /https?|ftp|gopher|file/;
    function i(e) {
      let { auth: t, hostname: r } = e,
        n = e.protocol || "",
        a = e.pathname || "",
        i = e.hash || "",
        u = e.query || "",
        s = !1;
      ((t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : ""),
        e.host
          ? (s = t + e.host)
          : r && ((s = t + (~r.indexOf(":") ? `[${r}]` : r)), e.port && (s += ":" + e.port)),
        u && "object" == typeof u && (u = String(o.urlQueryToSearchParams(u))));
      let c = e.search || (u && `?${u}`) || "";
      return (
        n && !n.endsWith(":") && (n += ":"),
        e.slashes || ((!n || l.test(n)) && !1 !== s)
          ? ((s = "//" + (s || "")), a && "/" !== a[0] && (a = "/" + a))
          : s || (s = ""),
        i && "#" !== i[0] && (i = "#" + i),
        c && "?" !== c[0] && (c = "?" + c),
        (a = a.replace(/[?#]/g, encodeURIComponent)),
        (c = c.replace("#", "%23")),
        `${n}${s}${a}${c}${i}`
      );
    }
    let u = [
      "auth",
      "hash",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "slashes",
    ];
    function s(e) {
      return i(e);
    }
  },
  97741,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      DecodeError: function () {
        return g;
      },
      MiddlewareNotFoundError: function () {
        return _;
      },
      MissingStaticPage: function () {
        return x;
      },
      NormalizeError: function () {
        return b;
      },
      PageNotFoundError: function () {
        return v;
      },
      SP: function () {
        return h;
      },
      ST: function () {
        return y;
      },
      WEB_VITALS: function () {
        return o;
      },
      execOnce: function () {
        return l;
      },
      getDisplayName: function () {
        return d;
      },
      getLocationOrigin: function () {
        return s;
      },
      getURL: function () {
        return c;
      },
      isAbsoluteUrl: function () {
        return u;
      },
      isResSent: function () {
        return f;
      },
      loadGetInitialProps: function () {
        return m;
      },
      normalizeRepeatedSlashes: function () {
        return p;
      },
      stringifyError: function () {
        return j;
      },
    };
    for (var a in n) Object.defineProperty(r, a, { enumerable: !0, get: n[a] });
    let o = ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"];
    function l(e) {
      let t,
        r = !1;
      return (...n) => (r || ((r = !0), (t = e(...n))), t);
    }
    let i = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/,
      u = (e) => {
        let t = e.charCodeAt(0);
        return !!((t >= 65 && t <= 90) || (t >= 97 && t <= 122)) && i.test(e);
      };
    function s() {
      let { protocol: e, hostname: t, port: r } = window.location;
      return `${e}//${t}${r ? ":" + r : ""}`;
    }
    function c() {
      let { href: e } = window.location,
        t = s();
      return e.substring(t.length);
    }
    function d(e) {
      return "string" == typeof e ? e : e.displayName || e.name || "Unknown";
    }
    function f(e) {
      return e.finished || e.headersSent;
    }
    function p(e) {
      let t = e.split("?");
      return (
        t[0].replace(/\\/g, "/").replace(/\/\/+/g, "/") + (t[1] ? `?${t.slice(1).join("?")}` : "")
      );
    }
    async function m(e, t) {
      let r = t.res || (t.ctx && t.ctx.res);
      if (!e.getInitialProps)
        return t.ctx && t.Component ? { pageProps: await m(t.Component, t.ctx) } : {};
      let n = await e.getInitialProps(t);
      if (r && f(r)) return n;
      if (!n)
        throw Object.defineProperty(
          Error(
            `"${d(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`,
          ),
          "__NEXT_ERROR_CODE",
          { value: "E1025", enumerable: !1, configurable: !0 },
        );
      return n;
    }
    let h = "u" > typeof performance,
      y =
        h &&
        ["mark", "measure", "getEntriesByName"].every((e) => "function" == typeof performance[e]);
    class g extends Error {}
    class b extends Error {}
    class v extends Error {
      constructor(e) {
        (super(),
          (this.code = "ENOENT"),
          (this.name = "PageNotFoundError"),
          (this.message = `Cannot find module for page: ${e}`));
      }
    }
    class x extends Error {
      constructor(e, t) {
        (super(), (this.message = `Failed to load static file for page: ${e} ${t}`));
      }
    }
    class _ extends Error {
      constructor() {
        (super(), (this.code = "ENOENT"), (this.message = "Cannot find the middleware module"));
      }
    }
    function j(e) {
      return JSON.stringify({ message: e.message, stack: e.stack });
    }
  },
]);
