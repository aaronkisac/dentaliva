(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
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
  91765,
  (e) => {
    "use strict";
    var t = e.i(31345),
      r = e.i(6563);
    e.s([
      "default",
      0,
      function ({ src: e, width: i, quality: a }) {
        return (0, t.urlForImage)(e, { width: i, quality: a ?? 75 }, (0, r.imageTarget)());
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
          return _;
        },
      }));
    let i = e.r(36437),
      a = e.r(56421),
      n = e.r(27693),
      o = a._(e.r(4211)),
      l = i._(e.r(94503)),
      s = i._(e.r(48104)),
      u = e.r(29329),
      d = e.r(1302),
      c = e.r(77279),
      f = e.r(2058),
      m = i._(e.r(91765)),
      g = e.r(89360),
      p = {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        qualities: [75],
        path: "/_next/image/",
        loader: "custom",
        dangerouslyAllowSVG: !1,
        unoptimized: !1,
      };
    function h(e, t, r, i, a, n, o) {
      let l = e?.src;
      e &&
        e["data-loaded-src"] !== l &&
        ((e["data-loaded-src"] = l),
        ("decode" in e ? e.decode() : Promise.resolve())
          .catch(() => {})
          .then(() => {
            if (e.parentElement && e.isConnected) {
              if (("empty" !== t && a(!0), r?.current)) {
                let t = new Event("load");
                Object.defineProperty(t, "target", { writable: !1, value: e });
                let i = !1,
                  a = !1;
                r.current({
                  ...t,
                  nativeEvent: t,
                  currentTarget: e,
                  target: e,
                  isDefaultPrevented: () => i,
                  isPropagationStopped: () => a,
                  persist: () => {},
                  preventDefault: () => {
                    ((i = !0), t.preventDefault());
                  },
                  stopPropagation: () => {
                    ((a = !0), t.stopPropagation());
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
      y = (0, o.forwardRef)(
        (
          {
            src: e,
            srcSet: t,
            sizes: r,
            height: i,
            width: a,
            decoding: l,
            className: s,
            style: u,
            fetchPriority: d,
            placeholder: c,
            loading: f,
            unoptimized: m,
            fill: p,
            onLoadRef: y,
            onLoadingCompleteRef: w,
            setBlurComplete: _,
            setShowAltText: S,
            sizesInput: j,
            onLoad: x,
            onError: P,
            ...E
          },
          O,
        ) => {
          let z = (0, o.useRef)(!1),
            C = (0, o.useRef)(null);
          v(() => {
            let { current: e } = z,
              { current: t } = C;
            e ||
              null === t ||
              (P && (t.src = t.src), t.complete && h(t, c, y, w, _, m, j), (z.current = !0));
          }, [e, c, y, w, P, m, j]);
          let k = (0, g.useMergedRef)(O, C);
          return (0, n.jsx)("img", {
            ...E,
            ...b(d),
            loading: f,
            width: a,
            height: i,
            decoding: l,
            "data-nimg": p ? "fill" : "1",
            className: s,
            style: u,
            sizes: r,
            srcSet: t,
            src: e,
            ref: k,
            onLoad: (e) => {
              h(e.currentTarget, c, y, w, _, m, j);
            },
            onError: (e) => {
              (S(!0), "empty" !== c && _(!0), P && P(e));
            },
          });
        },
      );
    function w({ isAppRouter: e, imgAttributes: t }) {
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
        : (0, n.jsx)(s.default, {
            children: (0, n.jsx)(
              "link",
              { rel: "preload", href: t.srcSet ? void 0 : t.src, ...r },
              "__nimg-" + t.src + t.srcSet + t.sizes,
            ),
          });
    }
    let _ = (0, o.forwardRef)((e, t) => {
      let r = (0, o.useContext)(f.RouterContext),
        i = (0, o.useContext)(c.ImageConfigContext),
        a = (0, o.useMemo)(() => {
          let e = p || i || d.imageConfigDefault,
            t = [...e.deviceSizes, ...e.imageSizes].sort((e, t) => e - t),
            r = e.deviceSizes.sort((e, t) => e - t),
            a = e.qualities?.sort((e, t) => e - t);
          return {
            ...e,
            allSizes: t,
            deviceSizes: r,
            qualities: a,
            localPatterns: "u" < typeof window ? i?.localPatterns : e.localPatterns,
          };
        }, [i]),
        { onLoad: l, onLoadingComplete: s } = e,
        g = (0, o.useRef)(l);
      (0, o.useEffect)(() => {
        g.current = l;
      }, [l]);
      let h = (0, o.useRef)(s);
      (0, o.useEffect)(() => {
        h.current = s;
      }, [s]);
      let [b, v] = (0, o.useState)(!1),
        [_, S] = (0, o.useState)(!1),
        { props: j, meta: x } = (0, u.getImgProps)(e, {
          defaultLoader: m.default,
          imgConf: a,
          blurComplete: b,
          showAltText: _,
        });
      return (0, n.jsxs)(n.Fragment, {
        children: [
          (0, n.jsx)(y, {
            ...j,
            unoptimized: x.unoptimized,
            placeholder: x.placeholder,
            fill: x.fill,
            onLoadRef: g,
            onLoadingCompleteRef: h,
            setBlurComplete: v,
            setShowAltText: S,
            sizesInput: e.sizes,
            ref: t,
          }),
          x.preload ? (0, n.jsx)(w, { isAppRouter: !r, imgAttributes: j }) : null,
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
      a = e.r(61205),
      n = e.r(1302),
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
    function u(
      {
        src: e,
        sizes: t,
        unoptimized: r = !1,
        priority: d = !1,
        preload: c = !1,
        loading: f,
        className: m,
        quality: g,
        width: p,
        height: h,
        fill: b = !1,
        style: v,
        overrideSrc: y,
        onLoad: w,
        onLoadingComplete: _,
        placeholder: S = "empty",
        blurDataURL: j,
        fetchPriority: x,
        decoding: P = "async",
        layout: E,
        objectFit: O,
        objectPosition: z,
        lazyBoundary: C,
        lazyRoot: k,
        ...R
      },
      I,
    ) {
      var D;
      let T,
        M,
        $,
        { imgConf: A, showAltText: q, blurComplete: L, defaultLoader: U } = I,
        F = A || n.imageConfigDefault;
      if ("allSizes" in F) T = F;
      else {
        let e = [...F.deviceSizes, ...F.imageSizes].sort((e, t) => e - t),
          t = F.deviceSizes.sort((e, t) => e - t),
          r = F.qualities?.sort((e, t) => e - t);
        T = { ...F, allSizes: e, deviceSizes: t, qualities: r };
      }
      if (void 0 === U)
        throw Object.defineProperty(
          Error(
            "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config",
          ),
          "__NEXT_ERROR_CODE",
          { value: "E163", enumerable: !1, configurable: !0 },
        );
      let N = R.loader || U;
      (delete R.loader, delete R.srcSet);
      let B = "__next_img_default" in N;
      if (B) {
        if ("custom" === T.loader)
          throw Object.defineProperty(
            Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),
            "__NEXT_ERROR_CODE",
            { value: "E252", enumerable: !1, configurable: !0 },
          );
      } else {
        let e = N;
        N = (t) => {
          let { config: r, ...i } = t;
          return e(i);
        };
      }
      if (E) {
        "fill" === E && (b = !0);
        let e = {
          intrinsic: { maxWidth: "100%", height: "auto" },
          responsive: { width: "100%", height: "auto" },
        }[E];
        e && (v = { ...v, ...e });
        let r = { responsive: "100vw", fill: "100vw" }[E];
        r && !t && (t = r);
      }
      let W = "",
        G = s(p),
        H = s(h);
      if ((D = e) && "object" == typeof D && (l(D) || void 0 !== D.src)) {
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
        if (((M = t.blurWidth), ($ = t.blurHeight), (j = j || t.blurDataURL), (W = t.src), !b))
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
      let V = !d && !c && ("lazy" === f || void 0 === f);
      ((!(e = "string" == typeof e ? e : W) || e.startsWith("data:") || e.startsWith("blob:")) &&
        ((r = !0), (V = !1)),
        T.unoptimized && (r = !0),
        B && !T.dangerouslyAllowSVG && e.split("?", 1)[0].endsWith(".svg") && (r = !0));
      let X = s(g),
        Y = Object.assign(
          b
            ? {
                position: "absolute",
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                objectFit: O,
                objectPosition: z,
              }
            : {},
          q ? {} : { color: "transparent" },
          v,
        ),
        J =
          L || "empty" === S
            ? null
            : "blur" === S
              ? `url("data:image/svg+xml;charset=utf-8,${(0, a.getImageBlurSvg)({ widthInt: G, heightInt: H, blurWidth: M, blurHeight: $, blurDataURL: j || "", objectFit: Y.objectFit })}")`
              : `url("${S}")`,
        K = o.includes(Y.objectFit)
          ? "fill" === Y.objectFit
            ? "100% 100%"
            : "cover"
          : Y.objectFit,
        Q = J
          ? {
              backgroundSize: K,
              backgroundPosition: Y.objectPosition || "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundImage: J,
            }
          : {},
        Z = (function ({
          config: e,
          src: t,
          unoptimized: r,
          width: a,
          quality: n,
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
          let { widths: s, kind: u } = (function ({ deviceSizes: e, allSizes: t }, r, i) {
              if (i) {
                let r = /(^|\s)(1?\d?\d)vw/g,
                  a = [];
                for (let e; (e = r.exec(i));) a.push(parseInt(e[2]));
                if (a.length) {
                  let r = 0.01 * Math.min(...a);
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
            })(e, a, o),
            d = s.length - 1;
          return {
            sizes: o || "w" !== u ? o : "100vw",
            srcSet: s
              .map(
                (r, i) =>
                  `${l({ config: e, src: t, quality: n, width: r })} ${"w" === u ? r : i + 1}${u}`,
              )
              .join(", "),
            src: l({ config: e, src: t, quality: n, width: s[d] }),
          };
        })({ config: T, src: e, unoptimized: r, width: G, quality: X, sizes: t, loader: N }),
        ee = V ? "lazy" : f;
      return {
        props: {
          ...R,
          loading: ee,
          fetchPriority: x,
          width: G,
          height: H,
          decoding: P,
          className: m,
          style: { ...Y, ...Q },
          sizes: Z.sizes,
          srcSet: Z.srcSet,
          src: y || Z.src,
        },
        meta: { unoptimized: r, preload: c || d, placeholder: S, fill: b },
      };
    }
  },
  48104,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var i = {
      default: function () {
        return p;
      },
      defaultHead: function () {
        return c;
      },
    };
    for (var a in i) Object.defineProperty(r, a, { enumerable: !0, get: i[a] });
    let n = e.r(36437),
      o = e.r(56421),
      l = e.r(27693),
      s = o._(e.r(4211)),
      u = n._(e.r(45140)),
      d = e.r(44743);
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
    let m = ["name", "httpEquiv", "charSet", "itemProp"];
    function g(e) {
      let t, r, i, a;
      return e
        .reduce(f, [])
        .reverse()
        .concat(c().reverse())
        .filter(
          ((t = new Set()),
          (r = new Set()),
          (i = new Set()),
          (a = {}),
          (e) => {
            let n = !0,
              o = !1;
            if (e.key && "number" != typeof e.key && e.key.indexOf("$") > 0) {
              o = !0;
              let r = e.key.slice(e.key.indexOf("$") + 1);
              t.has(r) ? (n = !1) : t.add(r);
            }
            switch (e.type) {
              case "title":
              case "base":
                r.has(e.type) ? (n = !1) : r.add(e.type);
                break;
              case "meta":
                for (let t = 0, r = m.length; t < r; t++) {
                  let r = m[t];
                  if (e.props.hasOwnProperty(r))
                    if ("charSet" === r) i.has(r) ? (n = !1) : i.add(r);
                    else {
                      let t = e.props[r],
                        i = a[r] || new Set();
                      ("name" !== r || !o) && i.has(t) ? (n = !1) : (i.add(t), (a[r] = i));
                    }
                }
            }
            return n;
          }),
        )
        .reverse()
        .map((e, t) => {
          let r = e.key || t;
          return s.default.cloneElement(e, { key: r });
        });
    }
    let p = function ({ children: e }) {
      let t = (0, s.useContext)(d.HeadManagerContext);
      return (0, l.jsx)(u.default, { reduceComponentsToState: g, headManager: t, children: e });
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
      blurHeight: a,
      blurDataURL: n,
      objectFit: o,
    }) {
      let l = r ? 40 * r : e,
        s = a ? 40 * a : t,
        u = l && s ? `viewBox='0 0 ${l} ${s}'` : "";
      return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${u}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${u ? "none" : "contain" === o ? "xMidYMid" : "cover" === o ? "xMidYMid slice" : "none"}' style='filter: url(%23b);' href='${n}'/%3E%3C/svg%3E`;
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
          return n;
        },
      }));
    let i = e.r(36437)._(e.r(4211)),
      a = e.r(1302),
      n = i.default.createContext(a.imageConfigDefault);
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
        return n;
      },
      imageConfigDefault: function () {
        return o;
      },
    };
    for (var a in i) Object.defineProperty(r, a, { enumerable: !0, get: i[a] });
    let n = ["default", "imgix", "cloudinary", "akamai", "custom"],
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
      a = "u" < typeof window,
      n = a ? () => {} : i.useLayoutEffect,
      o = a ? () => {} : i.useEffect;
    function l(e) {
      let { headManager: t, reduceComponentsToState: r } = e;
      function l() {
        if (t && t.mountedInstances) {
          let e = i.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));
          t.updateHead(r(e));
        }
      }
      return (
        a && (t?.mountedInstances?.add(e.children), l()),
        n(
          () => (
            t?.mountedInstances?.add(e.children),
            () => {
              t?.mountedInstances?.delete(e.children);
            }
          ),
        ),
        n(
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
      let a = (function (e) {
          let t = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(e);
          if (!t) throw Error(`Invalid Sanity image reference: ${e}`);
          let [, r, i, a] = t;
          return `${r}-${i}.${a}`;
        })(e),
        n = new URLSearchParams({
          auto: "format",
          fit: r.fit ?? "crop",
          ...(r.width ? { w: String(r.width) } : {}),
          ...(r.quality ? { q: String(r.quality) } : {}),
        });
      return `https://cdn.sanity.io/images/${i.projectId}/${i.dataset}/${a}?${n.toString()}`;
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
