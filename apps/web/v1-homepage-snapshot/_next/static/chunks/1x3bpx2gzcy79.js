(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  57875,
  (e, r, t) => {
    r.exports = e.r(6652);
  },
  83707,
  (e) => {
    "use strict";
    var r = e.i(27693),
      t = e.i(4211),
      o = e.i(23322);
    e.s([
      "Accordion",
      0,
      function ({
        items: e,
        defaultOpenId: n = e[0]?.id ?? null,
        className: s,
        variant: l = "boxed",
      }) {
        let a = (0, t.useId)(),
          [i, d] = (0, t.useState)(n),
          c = "flush" === l;
        return (0, r.jsx)("div", {
          className: (0, o.cn)(
            "divide-y divide-[var(--dvn-line-soft)]",
            c ? "border-y-0" : "border border-[var(--dvn-line-soft)]",
            s,
          ),
          children: e.map((e, t) => {
            let n = i === e.id,
              s = `${a}-${t}-button`,
              l = `${a}-${t}-panel`;
            return (0, r.jsxs)(
              "div",
              {
                children: [
                  (0, r.jsx)("h3", {
                    children: (0, r.jsxs)("button", {
                      type: "button",
                      id: s,
                      "aria-expanded": n,
                      "aria-controls": l,
                      onClick: () => d(n ? null : e.id),
                      className: (0, o.cn)(
                        "flex w-full items-center justify-between gap-4 text-left font-sans text-[length:var(--dvn-text-body-size)] font-semibold text-ink transition-colors duration-300 hover:text-navy focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold",
                        c ? "px-0 py-5" : "px-5 py-4",
                      ),
                      children: [
                        e.question,
                        (0, r.jsx)("span", {
                          "aria-hidden": "true",
                          className: "text-gold",
                          children: n ? "−" : "+",
                        }),
                      ],
                    }),
                  }),
                  (0, r.jsx)("div", {
                    id: l,
                    role: "region",
                    "aria-labelledby": s,
                    hidden: !n,
                    className: (0, o.cn)(
                      "font-sans text-[length:var(--dvn-text-body-size)] leading-[var(--dvn-text-body-lh)] text-ink",
                      c ? "pb-5 pr-10" : "px-5 pb-4",
                    ),
                    children: e.answer,
                  }),
                ],
              },
              e.id,
            );
          }),
        });
      },
    ]);
  },
  23322,
  7284,
  (e) => {
    "use strict";
    var r;
    let t, o, n, s, l;
    function a() {
      for (var e, r, t = 0, o = "", n = arguments.length; t < n; t++)
        (e = arguments[t]) &&
          (r = (function e(r) {
            var t,
              o,
              n = "";
            if ("string" == typeof r || "number" == typeof r) n += r;
            else if ("object" == typeof r)
              if (Array.isArray(r)) {
                var s = r.length;
                for (t = 0; t < s; t++) r[t] && (o = e(r[t])) && (n && (n += " "), (n += o));
              } else for (o in r) r[o] && (n && (n += " "), (n += o));
            return n;
          })(e)) &&
          (o && (o += " "), (o += r));
      return o;
    }
    e.s(["clsx", 0, a], 7284);
    let i = (e = new Map(), r = null, t) => ({ nextPart: e, validators: r, classGroupId: t }),
      d = [],
      c = (e, r, t) => {
        if (0 == e.length - r) return t.classGroupId;
        let o = e[r],
          n = t.nextPart.get(o);
        if (n) {
          let t = c(e, r + 1, n);
          if (t) return t;
        }
        let s = t.validators;
        if (null === s) return;
        let l = 0 === r ? e.join("-") : e.slice(r).join("-"),
          a = s.length;
        for (let e = 0; e < a; e++) {
          let r = s[e];
          if (r.validator(l)) return r.classGroupId;
        }
      },
      m = (e, r) => {
        let t = i();
        for (let o in e) u(e[o], t, o, r);
        return t;
      },
      u = (e, r, t, o) => {
        let n = e.length;
        for (let s = 0; s < n; s++) p(e[s], r, t, o);
      },
      p = (e, r, t, o) => {
        "string" == typeof e ? b(e, r, t) : "function" == typeof e ? f(e, r, t, o) : h(e, r, t, o);
      },
      b = (e, r, t) => {
        ("" === e ? r : x(r, e)).classGroupId = t;
      },
      f = (e, r, t, o) => {
        g(e)
          ? u(e(o), r, t, o)
          : (null === r.validators && (r.validators = []),
            r.validators.push({ classGroupId: t, validator: e }));
      },
      h = (e, r, t, o) => {
        let n = Object.entries(e),
          s = n.length;
        for (let e = 0; e < s; e++) {
          let [s, l] = n[e];
          u(l, x(r, s), t, o);
        }
      },
      x = (e, r) => {
        let t = e,
          o = r.split("-"),
          n = o.length;
        for (let e = 0; e < n; e++) {
          let r = o[e],
            n = t.nextPart.get(r);
          (n || ((n = i()), t.nextPart.set(r, n)), (t = n));
        }
        return t;
      },
      g = (e) => "isThemeGetter" in e && !0 === e.isThemeGetter,
      v = [],
      k = (e, r, t, o, n) => ({
        modifiers: e,
        hasImportantModifier: r,
        baseClassName: t,
        maybePostfixModifierPosition: o,
        isExternal: n,
      }),
      y = /\s+/,
      w = (e) => {
        let r;
        if ("string" == typeof e) return e;
        let t = "";
        for (let o = 0; o < e.length; o++) e[o] && (r = w(e[o])) && (t && (t += " "), (t += r));
        return t;
      },
      j = [],
      z = (e) => {
        let r = (r) => r[e] || j;
        return ((r.isThemeGetter = !0), (r.themeKey = e), r);
      },
      N = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
      C = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
      L = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
      E = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
      M =
        /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
      G = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/,
      $ = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
      O =
        /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
      S = (e) => L.test(e),
      W = (e) => !!e && !Number.isNaN(Number(e)),
      A = (e) => !!e && Number.isInteger(Number(e)),
      I = (e) => e.endsWith("%") && W(e.slice(0, -1)),
      T = (e) => E.test(e),
      R = () => !0,
      B = (e) => M.test(e) && !G.test(e),
      H = () => !1,
      P = (e) => $.test(e),
      q = (e) => O.test(e),
      D = (e) => !V(e) && !ee(e),
      F = (e) =>
        e.startsWith("@container") &&
        (("/" === e[10] && void 0 !== e[11]) ||
          ("s" === e[11] && void 0 !== e[16] && e.startsWith("-size/", 10)) ||
          ("n" === e[11] && void 0 !== e[18] && e.startsWith("-normal/", 10))),
      K = (e) => ei(e, eu, H),
      V = (e) => N.test(e),
      _ = (e) => ei(e, ep, B),
      U = (e) => ei(e, eb, W),
      Y = (e) => ei(e, eh, R),
      J = (e) => ei(e, ef, H),
      Q = (e) => ei(e, ec, H),
      X = (e) => ei(e, em, q),
      Z = (e) => ei(e, ex, P),
      ee = (e) => C.test(e),
      er = (e) => ed(e, ep),
      et = (e) => ed(e, ef),
      eo = (e) => ed(e, ec),
      en = (e) => ed(e, eu),
      es = (e) => ed(e, em),
      el = (e) => ed(e, ex, !0),
      ea = (e) => ed(e, eh, !0),
      ei = (e, r, t) => {
        let o = N.exec(e);
        return !!o && (o[1] ? r(o[1]) : t(o[2]));
      },
      ed = (e, r, t = !1) => {
        let o = C.exec(e);
        return !!o && (o[1] ? r(o[1]) : t);
      },
      ec = (e) => "position" === e || "percentage" === e,
      em = (e) => "image" === e || "url" === e,
      eu = (e) => "length" === e || "size" === e || "bg-size" === e,
      ep = (e) => "length" === e,
      eb = (e) => "number" === e,
      ef = (e) => "family-name" === e,
      eh = (e) => "number" === e || "weight" === e,
      ex = (e) => "shadow" === e,
      eg =
        ((r = () => {
          let e = z("color"),
            r = z("font"),
            t = z("text"),
            o = z("font-weight"),
            n = z("tracking"),
            s = z("leading"),
            l = z("breakpoint"),
            a = z("container"),
            i = z("spacing"),
            d = z("radius"),
            c = z("shadow"),
            m = z("inset-shadow"),
            u = z("text-shadow"),
            p = z("drop-shadow"),
            b = z("blur"),
            f = z("perspective"),
            h = z("aspect"),
            x = z("ease"),
            g = z("animate"),
            v = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
            k = () => [
              "center",
              "top",
              "bottom",
              "left",
              "right",
              "top-left",
              "left-top",
              "top-right",
              "right-top",
              "bottom-right",
              "right-bottom",
              "bottom-left",
              "left-bottom",
            ],
            y = () => [...k(), ee, V],
            w = () => ["auto", "hidden", "clip", "visible", "scroll"],
            j = () => ["auto", "contain", "none"],
            N = () => [ee, V, i],
            C = () => [S, "full", "auto", ...N()],
            L = () => [A, "none", "subgrid", ee, V],
            E = () => ["auto", { span: ["full", A, ee, V] }, A, ee, V],
            M = () => [A, "auto", ee, V],
            G = () => ["auto", "min", "max", "fr", ee, V],
            $ = () => [
              "start",
              "end",
              "center",
              "between",
              "around",
              "evenly",
              "stretch",
              "baseline",
              "center-safe",
              "end-safe",
            ],
            O = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
            B = () => ["auto", ...N()],
            H = () => [
              S,
              "auto",
              "full",
              "dvw",
              "dvh",
              "lvw",
              "lvh",
              "svw",
              "svh",
              "min",
              "max",
              "fit",
              ...N(),
            ],
            P = () => [a, S, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...N()],
            q = () => [S, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...N()],
            ei = () => [e, ee, V],
            ed = () => [...k(), eo, Q, { position: [ee, V] }],
            ec = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
            em = () => ["auto", "cover", "contain", en, K, { size: [ee, V] }],
            eu = () => [I, er, _],
            ep = () => ["", "none", "full", d, ee, V],
            eb = () => ["", W, er, _],
            ef = () => ["solid", "dashed", "dotted", "double"],
            eh = () => [
              "normal",
              "multiply",
              "screen",
              "overlay",
              "darken",
              "lighten",
              "color-dodge",
              "color-burn",
              "hard-light",
              "soft-light",
              "difference",
              "exclusion",
              "hue",
              "saturation",
              "color",
              "luminosity",
            ],
            ex = () => [W, I, eo, Q],
            eg = () => ["", "none", b, ee, V],
            ev = () => ["none", W, ee, V],
            ek = () => ["none", W, ee, V],
            ey = () => [W, ee, V],
            ew = () => [S, "full", ...N()];
          return {
            cacheSize: 500,
            theme: {
              animate: ["spin", "ping", "pulse", "bounce"],
              aspect: ["video"],
              blur: [T],
              breakpoint: [T],
              color: [R],
              container: [T],
              "drop-shadow": [T],
              ease: ["in", "out", "in-out"],
              font: [D],
              "font-weight": [
                "thin",
                "extralight",
                "light",
                "normal",
                "medium",
                "semibold",
                "bold",
                "extrabold",
                "black",
              ],
              "inset-shadow": [T],
              leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
              perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
              radius: [T],
              shadow: [T],
              spacing: ["px", W],
              text: [T],
              "text-shadow": [T],
              tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
            },
            classGroups: {
              aspect: [{ aspect: ["auto", "square", S, V, ee, h] }],
              container: ["container"],
              "container-type": [{ "@container": ["", "normal", "size", ee, V] }],
              "container-named": [F],
              columns: [{ columns: [W, "auto", V, ee, a] }],
              "break-after": [{ "break-after": v() }],
              "break-before": [{ "break-before": v() }],
              "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }],
              "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
              box: [{ box: ["border", "content"] }],
              display: [
                "block",
                "inline-block",
                "inline",
                "flex",
                "inline-flex",
                "table",
                "inline-table",
                "table-caption",
                "table-cell",
                "table-column",
                "table-column-group",
                "table-footer-group",
                "table-header-group",
                "table-row-group",
                "table-row",
                "flow-root",
                "grid",
                "inline-grid",
                "contents",
                "list-item",
                "hidden",
              ],
              sr: ["sr-only", "not-sr-only"],
              float: [{ float: ["right", "left", "none", "start", "end"] }],
              clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
              isolation: ["isolate", "isolation-auto"],
              "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }],
              "object-position": [{ object: y() }],
              overflow: [{ overflow: w() }],
              "overflow-x": [{ "overflow-x": w() }],
              "overflow-y": [{ "overflow-y": w() }],
              overscroll: [{ overscroll: j() }],
              "overscroll-x": [{ "overscroll-x": j() }],
              "overscroll-y": [{ "overscroll-y": j() }],
              position: ["static", "fixed", "absolute", "relative", "sticky"],
              inset: [{ inset: C() }],
              "inset-x": [{ "inset-x": C() }],
              "inset-y": [{ "inset-y": C() }],
              start: [{ "inset-s": C(), start: C() }],
              end: [{ "inset-e": C(), end: C() }],
              "inset-bs": [{ "inset-bs": C() }],
              "inset-be": [{ "inset-be": C() }],
              top: [{ top: C() }],
              right: [{ right: C() }],
              bottom: [{ bottom: C() }],
              left: [{ left: C() }],
              visibility: ["visible", "invisible", "collapse"],
              z: [{ z: [A, "auto", ee, V] }],
              basis: [{ basis: [S, "full", "auto", a, ...N()] }],
              "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }],
              "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
              flex: [{ flex: [W, S, "auto", "initial", "none", V] }],
              grow: [{ grow: ["", W, ee, V] }],
              shrink: [{ shrink: ["", W, ee, V] }],
              order: [{ order: [A, "first", "last", "none", ee, V] }],
              "grid-cols": [{ "grid-cols": L() }],
              "col-start-end": [{ col: E() }],
              "col-start": [{ "col-start": M() }],
              "col-end": [{ "col-end": M() }],
              "grid-rows": [{ "grid-rows": L() }],
              "row-start-end": [{ row: E() }],
              "row-start": [{ "row-start": M() }],
              "row-end": [{ "row-end": M() }],
              "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }],
              "auto-cols": [{ "auto-cols": G() }],
              "auto-rows": [{ "auto-rows": G() }],
              gap: [{ gap: N() }],
              "gap-x": [{ "gap-x": N() }],
              "gap-y": [{ "gap-y": N() }],
              "justify-content": [{ justify: [...$(), "normal"] }],
              "justify-items": [{ "justify-items": [...O(), "normal"] }],
              "justify-self": [{ "justify-self": ["auto", ...O()] }],
              "align-content": [{ content: ["normal", ...$()] }],
              "align-items": [{ items: [...O(), { baseline: ["", "last"] }] }],
              "align-self": [{ self: ["auto", ...O(), { baseline: ["", "last"] }] }],
              "place-content": [{ "place-content": $() }],
              "place-items": [{ "place-items": [...O(), "baseline"] }],
              "place-self": [{ "place-self": ["auto", ...O()] }],
              p: [{ p: N() }],
              px: [{ px: N() }],
              py: [{ py: N() }],
              ps: [{ ps: N() }],
              pe: [{ pe: N() }],
              pbs: [{ pbs: N() }],
              pbe: [{ pbe: N() }],
              pt: [{ pt: N() }],
              pr: [{ pr: N() }],
              pb: [{ pb: N() }],
              pl: [{ pl: N() }],
              m: [{ m: B() }],
              mx: [{ mx: B() }],
              my: [{ my: B() }],
              ms: [{ ms: B() }],
              me: [{ me: B() }],
              mbs: [{ mbs: B() }],
              mbe: [{ mbe: B() }],
              mt: [{ mt: B() }],
              mr: [{ mr: B() }],
              mb: [{ mb: B() }],
              ml: [{ ml: B() }],
              "space-x": [{ "space-x": N() }],
              "space-x-reverse": ["space-x-reverse"],
              "space-y": [{ "space-y": N() }],
              "space-y-reverse": ["space-y-reverse"],
              size: [{ size: H() }],
              "inline-size": [{ inline: ["auto", ...P()] }],
              "min-inline-size": [{ "min-inline": ["auto", ...P()] }],
              "max-inline-size": [{ "max-inline": ["none", ...P()] }],
              "block-size": [{ block: ["auto", ...q()] }],
              "min-block-size": [{ "min-block": ["auto", ...q()] }],
              "max-block-size": [{ "max-block": ["none", ...q()] }],
              w: [{ w: [a, "screen", ...H()] }],
              "min-w": [{ "min-w": [a, "screen", "none", ...H()] }],
              "max-w": [{ "max-w": [a, "screen", "none", "prose", { screen: [l] }, ...H()] }],
              h: [{ h: ["screen", "lh", ...H()] }],
              "min-h": [{ "min-h": ["screen", "lh", "none", ...H()] }],
              "max-h": [{ "max-h": ["screen", "lh", "none", ...H()] }],
              "font-size": [{ text: ["base", t, er, _] }],
              "font-smoothing": ["antialiased", "subpixel-antialiased"],
              "font-style": ["italic", "not-italic"],
              "font-weight": [{ font: [o, ea, Y] }],
              "font-stretch": [
                {
                  "font-stretch": [
                    "ultra-condensed",
                    "extra-condensed",
                    "condensed",
                    "semi-condensed",
                    "normal",
                    "semi-expanded",
                    "expanded",
                    "extra-expanded",
                    "ultra-expanded",
                    I,
                    V,
                  ],
                },
              ],
              "font-family": [{ font: [et, J, r] }],
              "font-features": [{ "font-features": [V] }],
              "fvn-normal": ["normal-nums"],
              "fvn-ordinal": ["ordinal"],
              "fvn-slashed-zero": ["slashed-zero"],
              "fvn-figure": ["lining-nums", "oldstyle-nums"],
              "fvn-spacing": ["proportional-nums", "tabular-nums"],
              "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
              tracking: [{ tracking: [n, ee, V] }],
              "line-clamp": [{ "line-clamp": [W, "none", ee, U] }],
              leading: [{ leading: ["none", s, ...N()] }],
              "list-image": [{ "list-image": ["none", ee, V] }],
              "list-style-position": [{ list: ["inside", "outside"] }],
              "list-style-type": [{ list: ["disc", "decimal", "none", ee, V] }],
              "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }],
              "placeholder-color": [{ placeholder: ei() }],
              "text-color": [{ text: ei() }],
              "text-decoration": ["underline", "overline", "line-through", "no-underline"],
              "text-decoration-style": [{ decoration: [...ef(), "wavy"] }],
              "text-decoration-thickness": [{ decoration: [W, "from-font", "auto", ee, _] }],
              "text-decoration-color": [{ decoration: ei() }],
              "underline-offset": [{ "underline-offset": [W, "auto", ee, V] }],
              "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
              "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
              "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
              indent: [{ indent: N() }],
              "tab-size": [{ tab: [A, ee, V] }],
              "vertical-align": [
                {
                  align: [
                    "baseline",
                    "top",
                    "middle",
                    "bottom",
                    "text-top",
                    "text-bottom",
                    "sub",
                    "super",
                    ee,
                    V,
                  ],
                },
              ],
              whitespace: [
                { whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] },
              ],
              break: [{ break: ["normal", "words", "all", "keep"] }],
              wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
              hyphens: [{ hyphens: ["none", "manual", "auto"] }],
              content: [{ content: ["none", ee, V] }],
              "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
              "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
              "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
              "bg-position": [{ bg: ed() }],
              "bg-repeat": [{ bg: ec() }],
              "bg-size": [{ bg: em() }],
              "bg-image": [
                {
                  bg: [
                    "none",
                    {
                      linear: [{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, A, ee, V],
                      radial: ["", ee, V],
                      conic: ["", A, ee, V],
                    },
                    es,
                    X,
                  ],
                },
              ],
              "bg-color": [{ bg: ei() }],
              "gradient-from-pos": [{ from: eu() }],
              "gradient-via-pos": [{ via: eu() }],
              "gradient-to-pos": [{ to: eu() }],
              "gradient-from": [{ from: ei() }],
              "gradient-via": [{ via: ei() }],
              "gradient-to": [{ to: ei() }],
              rounded: [{ rounded: ep() }],
              "rounded-s": [{ "rounded-s": ep() }],
              "rounded-e": [{ "rounded-e": ep() }],
              "rounded-t": [{ "rounded-t": ep() }],
              "rounded-r": [{ "rounded-r": ep() }],
              "rounded-b": [{ "rounded-b": ep() }],
              "rounded-l": [{ "rounded-l": ep() }],
              "rounded-ss": [{ "rounded-ss": ep() }],
              "rounded-se": [{ "rounded-se": ep() }],
              "rounded-ee": [{ "rounded-ee": ep() }],
              "rounded-es": [{ "rounded-es": ep() }],
              "rounded-tl": [{ "rounded-tl": ep() }],
              "rounded-tr": [{ "rounded-tr": ep() }],
              "rounded-br": [{ "rounded-br": ep() }],
              "rounded-bl": [{ "rounded-bl": ep() }],
              "border-w": [{ border: eb() }],
              "border-w-x": [{ "border-x": eb() }],
              "border-w-y": [{ "border-y": eb() }],
              "border-w-s": [{ "border-s": eb() }],
              "border-w-e": [{ "border-e": eb() }],
              "border-w-bs": [{ "border-bs": eb() }],
              "border-w-be": [{ "border-be": eb() }],
              "border-w-t": [{ "border-t": eb() }],
              "border-w-r": [{ "border-r": eb() }],
              "border-w-b": [{ "border-b": eb() }],
              "border-w-l": [{ "border-l": eb() }],
              "divide-x": [{ "divide-x": eb() }],
              "divide-x-reverse": ["divide-x-reverse"],
              "divide-y": [{ "divide-y": eb() }],
              "divide-y-reverse": ["divide-y-reverse"],
              "border-style": [{ border: [...ef(), "hidden", "none"] }],
              "divide-style": [{ divide: [...ef(), "hidden", "none"] }],
              "border-color": [{ border: ei() }],
              "border-color-x": [{ "border-x": ei() }],
              "border-color-y": [{ "border-y": ei() }],
              "border-color-s": [{ "border-s": ei() }],
              "border-color-e": [{ "border-e": ei() }],
              "border-color-bs": [{ "border-bs": ei() }],
              "border-color-be": [{ "border-be": ei() }],
              "border-color-t": [{ "border-t": ei() }],
              "border-color-r": [{ "border-r": ei() }],
              "border-color-b": [{ "border-b": ei() }],
              "border-color-l": [{ "border-l": ei() }],
              "divide-color": [{ divide: ei() }],
              "outline-style": [{ outline: [...ef(), "none", "hidden"] }],
              "outline-offset": [{ "outline-offset": [W, ee, V] }],
              "outline-w": [{ outline: ["", W, er, _] }],
              "outline-color": [{ outline: ei() }],
              shadow: [{ shadow: ["", "inner", "none", c, el, Z] }],
              "shadow-color": [{ shadow: ei() }],
              "inset-shadow": [{ "inset-shadow": ["none", m, el, Z] }],
              "inset-shadow-color": [{ "inset-shadow": ei() }],
              "ring-w": [{ ring: eb() }],
              "ring-w-inset": ["ring-inset"],
              "ring-color": [{ ring: ei() }],
              "ring-offset-w": [{ "ring-offset": [W, _] }],
              "ring-offset-color": [{ "ring-offset": ei() }],
              "inset-ring-w": [{ "inset-ring": eb() }],
              "inset-ring-color": [{ "inset-ring": ei() }],
              "text-shadow": [{ "text-shadow": ["none", u, el, Z] }],
              "text-shadow-color": [{ "text-shadow": ei() }],
              opacity: [{ opacity: [W, ee, V] }],
              "mix-blend": [{ "mix-blend": [...eh(), "plus-darker", "plus-lighter"] }],
              "bg-blend": [{ "bg-blend": eh() }],
              "mask-clip": [
                { "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] },
                "mask-no-clip",
              ],
              "mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }],
              "mask-image-linear-pos": [{ "mask-linear": [W] }],
              "mask-image-linear-from-pos": [{ "mask-linear-from": ex() }],
              "mask-image-linear-to-pos": [{ "mask-linear-to": ex() }],
              "mask-image-linear-from-color": [{ "mask-linear-from": ei() }],
              "mask-image-linear-to-color": [{ "mask-linear-to": ei() }],
              "mask-image-t-from-pos": [{ "mask-t-from": ex() }],
              "mask-image-t-to-pos": [{ "mask-t-to": ex() }],
              "mask-image-t-from-color": [{ "mask-t-from": ei() }],
              "mask-image-t-to-color": [{ "mask-t-to": ei() }],
              "mask-image-r-from-pos": [{ "mask-r-from": ex() }],
              "mask-image-r-to-pos": [{ "mask-r-to": ex() }],
              "mask-image-r-from-color": [{ "mask-r-from": ei() }],
              "mask-image-r-to-color": [{ "mask-r-to": ei() }],
              "mask-image-b-from-pos": [{ "mask-b-from": ex() }],
              "mask-image-b-to-pos": [{ "mask-b-to": ex() }],
              "mask-image-b-from-color": [{ "mask-b-from": ei() }],
              "mask-image-b-to-color": [{ "mask-b-to": ei() }],
              "mask-image-l-from-pos": [{ "mask-l-from": ex() }],
              "mask-image-l-to-pos": [{ "mask-l-to": ex() }],
              "mask-image-l-from-color": [{ "mask-l-from": ei() }],
              "mask-image-l-to-color": [{ "mask-l-to": ei() }],
              "mask-image-x-from-pos": [{ "mask-x-from": ex() }],
              "mask-image-x-to-pos": [{ "mask-x-to": ex() }],
              "mask-image-x-from-color": [{ "mask-x-from": ei() }],
              "mask-image-x-to-color": [{ "mask-x-to": ei() }],
              "mask-image-y-from-pos": [{ "mask-y-from": ex() }],
              "mask-image-y-to-pos": [{ "mask-y-to": ex() }],
              "mask-image-y-from-color": [{ "mask-y-from": ei() }],
              "mask-image-y-to-color": [{ "mask-y-to": ei() }],
              "mask-image-radial": [{ "mask-radial": [ee, V] }],
              "mask-image-radial-from-pos": [{ "mask-radial-from": ex() }],
              "mask-image-radial-to-pos": [{ "mask-radial-to": ex() }],
              "mask-image-radial-from-color": [{ "mask-radial-from": ei() }],
              "mask-image-radial-to-color": [{ "mask-radial-to": ei() }],
              "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
              "mask-image-radial-size": [
                { "mask-radial": [{ closest: ["side", "corner"], farthest: ["side", "corner"] }] },
              ],
              "mask-image-radial-pos": [{ "mask-radial-at": k() }],
              "mask-image-conic-pos": [{ "mask-conic": [W] }],
              "mask-image-conic-from-pos": [{ "mask-conic-from": ex() }],
              "mask-image-conic-to-pos": [{ "mask-conic-to": ex() }],
              "mask-image-conic-from-color": [{ "mask-conic-from": ei() }],
              "mask-image-conic-to-color": [{ "mask-conic-to": ei() }],
              "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
              "mask-origin": [
                { "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] },
              ],
              "mask-position": [{ mask: ed() }],
              "mask-repeat": [{ mask: ec() }],
              "mask-size": [{ mask: em() }],
              "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
              "mask-image": [{ mask: ["none", ee, V] }],
              filter: [{ filter: ["", "none", ee, V] }],
              blur: [{ blur: eg() }],
              brightness: [{ brightness: [W, ee, V] }],
              contrast: [{ contrast: [W, ee, V] }],
              "drop-shadow": [{ "drop-shadow": ["", "none", p, el, Z] }],
              "drop-shadow-color": [{ "drop-shadow": ei() }],
              grayscale: [{ grayscale: ["", W, ee, V] }],
              "hue-rotate": [{ "hue-rotate": [W, ee, V] }],
              invert: [{ invert: ["", W, ee, V] }],
              saturate: [{ saturate: [W, ee, V] }],
              sepia: [{ sepia: ["", W, ee, V] }],
              "backdrop-filter": [{ "backdrop-filter": ["", "none", ee, V] }],
              "backdrop-blur": [{ "backdrop-blur": eg() }],
              "backdrop-brightness": [{ "backdrop-brightness": [W, ee, V] }],
              "backdrop-contrast": [{ "backdrop-contrast": [W, ee, V] }],
              "backdrop-grayscale": [{ "backdrop-grayscale": ["", W, ee, V] }],
              "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [W, ee, V] }],
              "backdrop-invert": [{ "backdrop-invert": ["", W, ee, V] }],
              "backdrop-opacity": [{ "backdrop-opacity": [W, ee, V] }],
              "backdrop-saturate": [{ "backdrop-saturate": [W, ee, V] }],
              "backdrop-sepia": [{ "backdrop-sepia": ["", W, ee, V] }],
              "border-collapse": [{ border: ["collapse", "separate"] }],
              "border-spacing": [{ "border-spacing": N() }],
              "border-spacing-x": [{ "border-spacing-x": N() }],
              "border-spacing-y": [{ "border-spacing-y": N() }],
              "table-layout": [{ table: ["auto", "fixed"] }],
              caption: [{ caption: ["top", "bottom"] }],
              transition: [
                {
                  transition: [
                    "",
                    "all",
                    "colors",
                    "opacity",
                    "shadow",
                    "transform",
                    "none",
                    ee,
                    V,
                  ],
                },
              ],
              "transition-behavior": [{ transition: ["normal", "discrete"] }],
              duration: [{ duration: [W, "initial", ee, V] }],
              ease: [{ ease: ["linear", "initial", x, ee, V] }],
              delay: [{ delay: [W, ee, V] }],
              animate: [{ animate: ["none", g, ee, V] }],
              backface: [{ backface: ["hidden", "visible"] }],
              perspective: [{ perspective: [f, ee, V] }],
              "perspective-origin": [{ "perspective-origin": y() }],
              rotate: [{ rotate: ev() }],
              "rotate-x": [{ "rotate-x": ev() }],
              "rotate-y": [{ "rotate-y": ev() }],
              "rotate-z": [{ "rotate-z": ev() }],
              scale: [{ scale: ek() }],
              "scale-x": [{ "scale-x": ek() }],
              "scale-y": [{ "scale-y": ek() }],
              "scale-z": [{ "scale-z": ek() }],
              "scale-3d": ["scale-3d"],
              skew: [{ skew: ey() }],
              "skew-x": [{ "skew-x": ey() }],
              "skew-y": [{ "skew-y": ey() }],
              transform: [{ transform: [ee, V, "", "none", "gpu", "cpu"] }],
              "transform-origin": [{ origin: y() }],
              "transform-style": [{ transform: ["3d", "flat"] }],
              translate: [{ translate: ew() }],
              "translate-x": [{ "translate-x": ew() }],
              "translate-y": [{ "translate-y": ew() }],
              "translate-z": [{ "translate-z": ew() }],
              "translate-none": ["translate-none"],
              zoom: [{ zoom: [A, ee, V] }],
              accent: [{ accent: ei() }],
              appearance: [{ appearance: ["none", "auto"] }],
              "caret-color": [{ caret: ei() }],
              "color-scheme": [
                { scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"] },
              ],
              cursor: [
                {
                  cursor: [
                    "auto",
                    "default",
                    "pointer",
                    "wait",
                    "text",
                    "move",
                    "help",
                    "not-allowed",
                    "none",
                    "context-menu",
                    "progress",
                    "cell",
                    "crosshair",
                    "vertical-text",
                    "alias",
                    "copy",
                    "no-drop",
                    "grab",
                    "grabbing",
                    "all-scroll",
                    "col-resize",
                    "row-resize",
                    "n-resize",
                    "e-resize",
                    "s-resize",
                    "w-resize",
                    "ne-resize",
                    "nw-resize",
                    "se-resize",
                    "sw-resize",
                    "ew-resize",
                    "ns-resize",
                    "nesw-resize",
                    "nwse-resize",
                    "zoom-in",
                    "zoom-out",
                    ee,
                    V,
                  ],
                },
              ],
              "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
              "pointer-events": [{ "pointer-events": ["auto", "none"] }],
              resize: [{ resize: ["none", "", "y", "x"] }],
              "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
              "scrollbar-thumb-color": [{ "scrollbar-thumb": ei() }],
              "scrollbar-track-color": [{ "scrollbar-track": ei() }],
              "scrollbar-gutter": [{ "scrollbar-gutter": ["auto", "stable", "both"] }],
              "scrollbar-w": [{ scrollbar: ["auto", "thin", "none"] }],
              "scroll-m": [{ "scroll-m": N() }],
              "scroll-mx": [{ "scroll-mx": N() }],
              "scroll-my": [{ "scroll-my": N() }],
              "scroll-ms": [{ "scroll-ms": N() }],
              "scroll-me": [{ "scroll-me": N() }],
              "scroll-mbs": [{ "scroll-mbs": N() }],
              "scroll-mbe": [{ "scroll-mbe": N() }],
              "scroll-mt": [{ "scroll-mt": N() }],
              "scroll-mr": [{ "scroll-mr": N() }],
              "scroll-mb": [{ "scroll-mb": N() }],
              "scroll-ml": [{ "scroll-ml": N() }],
              "scroll-p": [{ "scroll-p": N() }],
              "scroll-px": [{ "scroll-px": N() }],
              "scroll-py": [{ "scroll-py": N() }],
              "scroll-ps": [{ "scroll-ps": N() }],
              "scroll-pe": [{ "scroll-pe": N() }],
              "scroll-pbs": [{ "scroll-pbs": N() }],
              "scroll-pbe": [{ "scroll-pbe": N() }],
              "scroll-pt": [{ "scroll-pt": N() }],
              "scroll-pr": [{ "scroll-pr": N() }],
              "scroll-pb": [{ "scroll-pb": N() }],
              "scroll-pl": [{ "scroll-pl": N() }],
              "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
              "snap-stop": [{ snap: ["normal", "always"] }],
              "snap-type": [{ snap: ["none", "x", "y", "both"] }],
              "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
              touch: [{ touch: ["auto", "none", "manipulation"] }],
              "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
              "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
              "touch-pz": ["touch-pinch-zoom"],
              select: [{ select: ["none", "text", "all", "auto"] }],
              "will-change": [
                { "will-change": ["auto", "scroll", "contents", "transform", ee, V] },
              ],
              fill: [{ fill: ["none", ...ei()] }],
              "stroke-w": [{ stroke: [W, er, _, U] }],
              stroke: [{ stroke: ["none", ...ei()] }],
              "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
            },
            conflictingClassGroups: {
              "container-named": ["container-type"],
              overflow: ["overflow-x", "overflow-y"],
              overscroll: ["overscroll-x", "overscroll-y"],
              inset: [
                "inset-x",
                "inset-y",
                "inset-bs",
                "inset-be",
                "start",
                "end",
                "top",
                "right",
                "bottom",
                "left",
              ],
              "inset-x": ["start", "end", "right", "left"],
              "inset-y": ["inset-bs", "inset-be", "top", "bottom"],
              flex: ["basis", "grow", "shrink"],
              gap: ["gap-x", "gap-y"],
              p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
              px: ["ps", "pe", "pr", "pl"],
              py: ["pbs", "pbe", "pt", "pb"],
              m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
              mx: ["ms", "me", "mr", "ml"],
              my: ["mbs", "mbe", "mt", "mb"],
              size: ["w", "h"],
              "font-size": ["leading"],
              "fvn-normal": [
                "fvn-ordinal",
                "fvn-slashed-zero",
                "fvn-figure",
                "fvn-spacing",
                "fvn-fraction",
              ],
              "fvn-ordinal": ["fvn-normal"],
              "fvn-slashed-zero": ["fvn-normal"],
              "fvn-figure": ["fvn-normal"],
              "fvn-spacing": ["fvn-normal"],
              "fvn-fraction": ["fvn-normal"],
              "line-clamp": ["display", "overflow"],
              rounded: [
                "rounded-s",
                "rounded-e",
                "rounded-t",
                "rounded-r",
                "rounded-b",
                "rounded-l",
                "rounded-ss",
                "rounded-se",
                "rounded-ee",
                "rounded-es",
                "rounded-tl",
                "rounded-tr",
                "rounded-br",
                "rounded-bl",
              ],
              "rounded-s": ["rounded-ss", "rounded-es"],
              "rounded-e": ["rounded-se", "rounded-ee"],
              "rounded-t": ["rounded-tl", "rounded-tr"],
              "rounded-r": ["rounded-tr", "rounded-br"],
              "rounded-b": ["rounded-br", "rounded-bl"],
              "rounded-l": ["rounded-tl", "rounded-bl"],
              "border-spacing": ["border-spacing-x", "border-spacing-y"],
              "border-w": [
                "border-w-x",
                "border-w-y",
                "border-w-s",
                "border-w-e",
                "border-w-bs",
                "border-w-be",
                "border-w-t",
                "border-w-r",
                "border-w-b",
                "border-w-l",
              ],
              "border-w-x": ["border-w-s", "border-w-e", "border-w-r", "border-w-l"],
              "border-w-y": ["border-w-bs", "border-w-be", "border-w-t", "border-w-b"],
              "border-color": [
                "border-color-x",
                "border-color-y",
                "border-color-s",
                "border-color-e",
                "border-color-bs",
                "border-color-be",
                "border-color-t",
                "border-color-r",
                "border-color-b",
                "border-color-l",
              ],
              "border-color-x": [
                "border-color-s",
                "border-color-e",
                "border-color-r",
                "border-color-l",
              ],
              "border-color-y": [
                "border-color-bs",
                "border-color-be",
                "border-color-t",
                "border-color-b",
              ],
              translate: ["translate-x", "translate-y", "translate-none"],
              "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
              "scroll-m": [
                "scroll-mx",
                "scroll-my",
                "scroll-ms",
                "scroll-me",
                "scroll-mbs",
                "scroll-mbe",
                "scroll-mt",
                "scroll-mr",
                "scroll-mb",
                "scroll-ml",
              ],
              "scroll-mx": ["scroll-ms", "scroll-me", "scroll-mr", "scroll-ml"],
              "scroll-my": ["scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mb"],
              "scroll-p": [
                "scroll-px",
                "scroll-py",
                "scroll-ps",
                "scroll-pe",
                "scroll-pbs",
                "scroll-pbe",
                "scroll-pt",
                "scroll-pr",
                "scroll-pb",
                "scroll-pl",
              ],
              "scroll-px": ["scroll-ps", "scroll-pe", "scroll-pr", "scroll-pl"],
              "scroll-py": ["scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pb"],
              touch: ["touch-x", "touch-y", "touch-pz"],
              "touch-x": ["touch"],
              "touch-y": ["touch"],
              "touch-pz": ["touch"],
            },
            conflictingClassGroupModifiers: { "font-size": ["leading"] },
            postfixLookupClassGroups: ["container-type"],
            orderSensitiveModifiers: [
              "*",
              "**",
              "after",
              "backdrop",
              "before",
              "details-content",
              "file",
              "first-letter",
              "first-line",
              "marker",
              "placeholder",
              "selection",
            ],
          };
        }),
        (l = (e) => {
          let r = o(e);
          if (r) return r;
          let s = ((e, r) => {
            let {
                parseClassName: t,
                getClassGroupId: o,
                getConflictingClassGroupIds: n,
                sortModifiers: s,
                postfixLookupClassGroupIds: l,
              } = r,
              a = [],
              i = e.trim().split(y),
              d = "";
            for (let e = i.length - 1; e >= 0; e -= 1) {
              let r,
                c = i[e],
                {
                  isExternal: m,
                  modifiers: u,
                  hasImportantModifier: p,
                  baseClassName: b,
                  maybePostfixModifierPosition: f,
                } = t(c);
              if (m) {
                d = c + (d.length > 0 ? " " + d : d);
                continue;
              }
              let h = !!f;
              if (h) {
                let e = (r = o(b.substring(0, f))) && l[r] ? o(b) : void 0;
                e && e !== r && ((r = e), (h = !1));
              } else r = o(b);
              if (!r) {
                if (!h || !(r = o(b))) {
                  d = c + (d.length > 0 ? " " + d : d);
                  continue;
                }
                h = !1;
              }
              let x = 0 === u.length ? "" : 1 === u.length ? u[0] : s(u).join(":"),
                g = p ? x + "!" : x,
                v = g + r;
              if (a.indexOf(v) > -1) continue;
              a.push(v);
              let k = n(r, h);
              for (let e = 0; e < k.length; ++e) {
                let r = k[e];
                a.push(g + r);
              }
              d = c + (d.length > 0 ? " " + d : d);
            }
            return d;
          })(e, t);
          return (n(e, s), s);
        }),
        (s = (e) => {
          var a;
          let i;
          return (
            (o = (t = {
              cache: ((e) => {
                if (e < 1) return { get: () => void 0, set: () => {} };
                let r = 0,
                  t = Object.create(null),
                  o = Object.create(null),
                  n = (n, s) => {
                    ((t[n] = s), ++r > e && ((r = 0), (o = t), (t = Object.create(null))));
                  };
                return {
                  get(e) {
                    let r = t[e];
                    return void 0 !== r ? r : void 0 !== (r = o[e]) ? (n(e, r), r) : void 0;
                  },
                  set(e, r) {
                    e in t ? (t[e] = r) : n(e, r);
                  },
                };
              })((a = [].reduce((e, r) => r(e), r())).cacheSize),
              parseClassName: ((e) => {
                let { prefix: r, experimentalParseClassName: t } = e,
                  o = (e) => {
                    let r,
                      t = [],
                      o = 0,
                      n = 0,
                      s = 0,
                      l = e.length;
                    for (let a = 0; a < l; a++) {
                      let l = e[a];
                      if (0 === o && 0 === n) {
                        if (":" === l) {
                          (t.push(e.slice(s, a)), (s = a + 1));
                          continue;
                        }
                        if ("/" === l) {
                          r = a;
                          continue;
                        }
                      }
                      "[" === l ? o++ : "]" === l ? o-- : "(" === l ? n++ : ")" === l && n--;
                    }
                    let a = 0 === t.length ? e : e.slice(s),
                      i = a,
                      d = !1;
                    return (
                      a.endsWith("!")
                        ? ((i = a.slice(0, -1)), (d = !0))
                        : a.startsWith("!") && ((i = a.slice(1)), (d = !0)),
                      k(t, d, i, r && r > s ? r - s : void 0)
                    );
                  };
                if (r) {
                  let e = r + ":",
                    t = o;
                  o = (r) => (r.startsWith(e) ? t(r.slice(e.length)) : k(v, !1, r, void 0, !0));
                }
                if (t) {
                  let e = o;
                  o = (r) => t({ className: r, parseClassName: e });
                }
                return o;
              })(a),
              sortModifiers:
                ((i = new Map()),
                a.orderSensitiveModifiers.forEach((e, r) => {
                  i.set(e, 1e6 + r);
                }),
                (e) => {
                  let r = [],
                    t = [];
                  for (let o = 0; o < e.length; o++) {
                    let n = e[o],
                      s = "[" === n[0],
                      l = i.has(n);
                    s || l
                      ? (t.length > 0 && (t.sort(), r.push(...t), (t = [])), r.push(n))
                      : t.push(n);
                  }
                  return (t.length > 0 && (t.sort(), r.push(...t)), r);
                }),
              postfixLookupClassGroupIds: ((e) => {
                let r = Object.create(null),
                  t = e.postfixLookupClassGroups;
                if (t) for (let e = 0; e < t.length; e++) r[t[e]] = !0;
                return r;
              })(a),
              ...((e) => {
                let r = ((e) => {
                    let { theme: r, classGroups: t } = e;
                    return m(t, r);
                  })(e),
                  { conflictingClassGroups: t, conflictingClassGroupModifiers: o } = e;
                return {
                  getClassGroupId: (e) => {
                    if (e.startsWith("[") && e.endsWith("]")) {
                      var t;
                      let r, o, n;
                      return -1 === (t = e).slice(1, -1).indexOf(":")
                        ? void 0
                        : ((o = (r = t.slice(1, -1)).indexOf(":")),
                          (n = r.slice(0, o)) ? "arbitrary.." + n : void 0);
                    }
                    let o = e.split("-"),
                      n = +("" === o[0] && o.length > 1);
                    return c(o, n, r);
                  },
                  getConflictingClassGroupIds: (e, r) => {
                    if (r) {
                      let r = o[e],
                        n = t[e];
                      if (r) {
                        if (n) {
                          let e = Array(n.length + r.length);
                          for (let r = 0; r < n.length; r++) e[r] = n[r];
                          for (let t = 0; t < r.length; t++) e[n.length + t] = r[t];
                          return e;
                        }
                        return r;
                      }
                      return n || d;
                    }
                    return t[e] || d;
                  },
                };
              })(a),
            }).cache.get),
            (n = t.cache.set),
            (s = l),
            l(e)
          );
        }),
        (...e) =>
          s(
            ((...e) => {
              let r,
                t,
                o = 0,
                n = "";
              for (; o < e.length;) (r = e[o++]) && (t = w(r)) && (n && (n += " "), (n += t));
              return n;
            })(...e),
          ));
    e.s(
      [
        "cn",
        0,
        function (...e) {
          return eg(a(e));
        },
      ],
      23322,
    );
  },
  9196,
  94237,
  77607,
  78534,
  (e) => {
    "use strict";
    var r = e.i(27693),
      t = e.i(4211),
      o = e.i(57875),
      n = e.i(7284);
    let s = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
      l = n.clsx,
      a = (e, r) => (t) => {
        var o;
        if ((null == r ? void 0 : r.variants) == null)
          return l(e, null == t ? void 0 : t.class, null == t ? void 0 : t.className);
        let { variants: n, defaultVariants: a } = r,
          i = Object.keys(n).map((e) => {
            let r = null == t ? void 0 : t[e],
              o = null == a ? void 0 : a[e];
            if (null === r) return null;
            let l = s(r) || s(o);
            return n[e][l];
          }),
          d =
            t &&
            Object.entries(t).reduce((e, r) => {
              let [t, o] = r;
              return (void 0 === o || (e[t] = o), e);
            }, {});
        return l(
          e,
          i,
          null == r || null == (o = r.compoundVariants)
            ? void 0
            : o.reduce((e, r) => {
                let { class: t, className: o, ...n } = r;
                return Object.entries(n).every((e) => {
                  let [r, t] = e;
                  return Array.isArray(t) ? t.includes({ ...a, ...d }[r]) : { ...a, ...d }[r] === t;
                })
                  ? [...e, t, o]
                  : e;
              }, []),
          null == t ? void 0 : t.class,
          null == t ? void 0 : t.className,
        );
      };
    e.s(["cva", 0, a], 94237);
    var i = e.i(23322);
    let d = a(
        "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase tracking-widest transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50",
        {
          variants: {
            variant: {
              gold: "bg-gold text-navy hover:bg-gold-soft",
              navy: "bg-navy text-white hover:bg-navy-3",
              outline: "border border-gold bg-transparent text-navy hover:bg-navy hover:text-white",
              ghostLight: "bg-transparent text-white hover:text-gold",
            },
            size: { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-xs", lg: "px-8 py-4 text-sm" },
          },
          defaultVariants: { variant: "gold", size: "md" },
        },
      ),
      c = (0, t.forwardRef)(function (
        { className: e, variant: t, size: o, type: n = "button", ...s },
        l,
      ) {
        return (0, r.jsx)("button", {
          ref: l,
          type: n,
          className: (0, i.cn)(d({ variant: t, size: o }), e),
          ...s,
        });
      });
    e.s(["Button", 0, c, "buttonVariants", 0, d], 77607);
    var m = e.i(22685);
    let u = /^\/(?!\/)/,
      p = (0, t.forwardRef)(function (
        { className: e, href: t, children: o, rel: n, target: s, ...l },
        a,
      ) {
        return "string" != typeof t || u.test(t)
          ? (0, r.jsx)(m.default, {
              ref: a,
              href: t,
              prefetch: !1,
              className: (0, i.cn)(
                "font-sans underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                e,
              ),
              ...l,
              children: o,
            })
          : (0, r.jsx)("a", {
              ref: a,
              href: t,
              target: s ?? "_blank",
              rel: n ?? "noopener noreferrer",
              className: (0, i.cn)(
                "font-sans underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                e,
              ),
              ...l,
              children: o,
            });
      });
    e.s(["Link", 0, p], 78534);
    var b = e.i(50871);
    function f({ className: e }) {
      return (0, r.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: (0, i.cn)("h-4 w-4", e),
        children: (0, r.jsx)("path", {
          d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
        }),
      });
    }
    function h({ className: e }) {
      return (0, r.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        className: (0, i.cn)("h-6 w-6", e),
        children: (0, r.jsx)("path", { d: "M4 6h16M4 12h16M4 18h16" }),
      });
    }
    function x({ className: e }) {
      return (0, r.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        className: (0, i.cn)("h-6 w-6", e),
        children: (0, r.jsx)("path", { d: "M6 6l12 12M18 6L6 18" }),
      });
    }
    function g({ className: e }) {
      return (0, r.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: (0, i.cn)("h-3.5 w-3.5", e),
        children: (0, r.jsx)("path", { d: "m6 9 6 6 6-6" }),
      });
    }
    function v({ item: e, dark: o }) {
      let [n, s] = (0, t.useState)(!1),
        l = (0, t.useRef)(null);
      return (
        (0, t.useEffect)(() => {
          if (!n) return;
          let e = (e) => {
              l.current && !l.current.contains(e.target) && s(!1);
            },
            r = (e) => {
              "Escape" === e.key && s(!1);
            };
          return (
            document.addEventListener("pointerdown", e),
            document.addEventListener("keydown", r),
            () => {
              (document.removeEventListener("pointerdown", e),
                document.removeEventListener("keydown", r));
            }
          );
        }, [n]),
        (0, r.jsxs)("div", {
          className: "relative",
          ref: l,
          children: [
            (0, r.jsx)("button", {
              type: "button",
              "aria-expanded": n,
              onClick: () => s((e) => !e),
              className: (0, i.cn)(
                "whitespace-nowrap px-3 py-2 font-sans text-sm",
                o ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep",
              ),
              children: e.label,
            }),
            n
              ? (0, r.jsx)("div", {
                  className:
                    "absolute left-0 top-full z-[var(--dvn-z-header)] min-w-56 border border-[var(--dvn-line-gold)] bg-white p-2 shadow-[var(--dvn-shadow-soft)]",
                  children: e.children?.map((e) =>
                    (0, r.jsx)(
                      p,
                      {
                        href: e.href,
                        className:
                          "block whitespace-nowrap px-3 py-2 text-sm text-ink hover:bg-ivory",
                        onClick: () => s(!1),
                        children: e.label,
                      },
                      e.href,
                    ),
                  ),
                })
              : null,
          ],
        })
      );
    }
    let k = "dvn-mega-panel";
    function y({ item: e, dark: t, open: o, onToggle: n }) {
      return (0, r.jsxs)("button", {
        type: "button",
        "aria-expanded": o,
        "aria-controls": k,
        onClick: n,
        className: (0, i.cn)(
          "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 font-sans text-sm",
          t ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep",
        ),
        children: [
          e.label,
          (0, r.jsx)(g, {
            className: (0, i.cn)(
              "transition-transform duration-[var(--dvn-duration-base)]",
              o && "rotate-180",
            ),
          }),
        ],
      });
    }
    function w({ menu: e, onClose: t }) {
      return (0, r.jsxs)("div", {
        id: k,
        className:
          "absolute inset-x-0 top-full hidden border-b border-[var(--dvn-line-gold)] bg-white shadow-[var(--dvn-shadow-soft)] xl:block",
        children: [
          (0, r.jsx)("div", {
            className:
              "mx-auto grid max-w-[var(--dvn-container-max)] grid-cols-2 gap-x-8 gap-y-6 px-[var(--dvn-container-gutter)] py-6 md:grid-cols-4",
            children: e.groups.map((e) =>
              (0, r.jsxs)(
                "div",
                {
                  children: [
                    (0, r.jsx)("div", {
                      className: "mb-2 min-h-6",
                      children: e.heading
                        ? e.headingHref
                          ? (0, r.jsx)(p, {
                              href: e.headingHref,
                              onClick: t,
                              className:
                                "text-xs font-semibold uppercase tracking-[0.08em] text-navy hover:text-gold-deep",
                              children: e.heading,
                            })
                          : (0, r.jsx)("span", {
                              className:
                                "text-xs font-semibold uppercase tracking-[0.08em] text-navy",
                              children: e.heading,
                            })
                        : null,
                    }),
                    (0, r.jsx)("ul", {
                      className: "space-y-0.5",
                      children: e.links.map((e) =>
                        (0, r.jsx)(
                          "li",
                          {
                            children: (0, r.jsx)(p, {
                              href: e.href,
                              onClick: t,
                              className:
                                "block whitespace-nowrap py-1 text-sm text-ink/80 hover:text-gold-deep",
                              children: e.label,
                            }),
                          },
                          e.href,
                        ),
                      ),
                    }),
                  ],
                },
                e.heading ?? e.links[0]?.href,
              ),
            ),
          }),
          e.all
            ? (0, r.jsx)("div", {
                className: "border-t border-[var(--dvn-line-soft)]",
                children: (0, r.jsx)("div", {
                  className:
                    "mx-auto max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)] py-3",
                  children: (0, r.jsxs)(p, {
                    href: e.all.href,
                    onClick: t,
                    className:
                      "inline-flex items-center gap-1 text-sm font-medium text-gold-deep hover:text-navy",
                    children: [
                      e.all.label,
                      (0, r.jsx)("span", { "aria-hidden": "true", children: "→" }),
                    ],
                  }),
                }),
              })
            : null,
        ],
      });
    }
    function j({ item: e, dark: o, onClose: n }) {
      let [s, l] = (0, t.useState)(!1),
        a = (0, i.cn)("block px-2 py-3 text-base", o ? "text-ivory" : "text-navy");
      return e.menu
        ? (0, r.jsxs)(r.Fragment, {
            children: [
              (0, r.jsxs)("button", {
                type: "button",
                "aria-expanded": s,
                onClick: () => l((e) => !e),
                className: (0, i.cn)(
                  "flex w-full items-center justify-between px-2 py-3 text-base",
                  o ? "text-ivory" : "text-navy",
                ),
                children: [
                  e.label,
                  (0, r.jsx)(g, {
                    className: (0, i.cn)(
                      "h-4 w-4 transition-transform duration-[var(--dvn-duration-base)]",
                      s && "rotate-180",
                    ),
                  }),
                ],
              }),
              s
                ? (0, r.jsxs)("div", {
                    className: "ml-2 border-l border-[var(--dvn-line-soft)] pb-2 pl-3",
                    children: [
                      e.menu.all
                        ? (0, r.jsx)(p, {
                            href: e.menu.all.href,
                            onClick: n,
                            className: (0, i.cn)(
                              "block px-2 py-2 text-sm font-medium",
                              o ? "text-gold-soft" : "text-gold-deep",
                            ),
                            children: e.menu.all.label,
                          })
                        : null,
                      e.menu.groups.map((e) =>
                        (0, r.jsxs)(
                          "div",
                          {
                            className: "mt-2",
                            children: [
                              e.heading
                                ? e.headingHref
                                  ? (0, r.jsx)(p, {
                                      href: e.headingHref,
                                      onClick: n,
                                      className: (0, i.cn)(
                                        "block px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
                                        o ? "text-ivory/90" : "text-navy",
                                      ),
                                      children: e.heading,
                                    })
                                  : (0, r.jsx)("div", {
                                      className: (0, i.cn)(
                                        "px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
                                        o ? "text-ivory/90" : "text-navy",
                                      ),
                                      children: e.heading,
                                    })
                                : null,
                              e.links.map((e) =>
                                (0, r.jsx)(
                                  p,
                                  {
                                    href: e.href,
                                    onClick: n,
                                    className: (0, i.cn)(
                                      "block px-4 py-1.5 text-sm",
                                      o ? "text-ivory/70" : "text-muted",
                                    ),
                                    children: e.label,
                                  },
                                  e.href,
                                ),
                              ),
                            ],
                          },
                          e.heading ?? e.links[0]?.href,
                        ),
                      ),
                    ],
                  })
                : null,
            ],
          })
        : (0, r.jsxs)(r.Fragment, {
            children: [
              (0, r.jsx)(p, { href: e.href, className: a, onClick: n, children: e.label }),
              e.children?.map((e) =>
                (0, r.jsx)(
                  p,
                  {
                    href: e.href,
                    className: (0, i.cn)(
                      "block px-6 py-2 text-sm",
                      o ? "text-ivory/70" : "text-muted",
                    ),
                    onClick: n,
                    children: e.label,
                  },
                  e.href,
                ),
              ),
            ],
          });
    }
    function z({ items: e, phone: o, cta: n, dark: s, onClose: l, labels: a }) {
      let m = (0, t.useRef)(null);
      return (
        (0, b.useFocusTrap)(m, !0, l),
        (0, r.jsx)("div", {
          ref: m,
          className: (0, i.cn)(
            "border-t xl:hidden",
            s ? "border-gold/30 bg-navy" : "border-[var(--dvn-line-soft)] bg-ivory",
          ),
          children: (0, r.jsxs)("nav", {
            "aria-label": "Mobile",
            className: "px-4 py-4",
            children: [
              (0, r.jsx)("ul", {
                className: "space-y-1",
                children: e.map((e) =>
                  (0, r.jsx)(
                    "li",
                    { children: (0, r.jsx)(j, { item: e, dark: s, onClose: l }) },
                    e.href,
                  ),
                ),
              }),
              o
                ? (0, r.jsxs)("a", {
                    href: `tel:${o}`,
                    className: (0, i.cn)(
                      "mt-4 flex items-center gap-2 px-2 py-2 text-sm",
                      s ? "text-ivory/80" : "text-ink",
                    ),
                    children: [(0, r.jsx)(f, {}), o],
                  })
                : null,
              n
                ? (0, r.jsx)(p, {
                    href: n.href,
                    className: (0, i.cn)(d({ variant: "gold", size: "md" }), "mt-4 w-full"),
                    onClick: l,
                    children: n.label,
                  })
                : (0, r.jsx)(c, { className: "mt-4 w-full", onClick: l, children: a.closeMenu }),
            ],
          }),
        })
      );
    }
    function N(e, r, t) {
      return "/" !== e || r > Math.max(t - 84, 120) ? "light" : "dark";
    }
    e.s(
      [
        "Header",
        0,
        function ({ items: e, cta: n, logo: s, contact: l, labels: a }) {
          let [d, c] = (0, t.useState)(!1),
            [m, u] = (0, t.useState)(null),
            b = (0, t.useRef)(null),
            g = (0, o.usePathname)(),
            [k, j] = (0, t.useState)(() => "dark" === N(g ?? "/", 0, 800));
          ((0, t.useEffect)(() => {
            let e = () => {
              j("dark" === N(g ?? "/", window.scrollY, window.innerHeight));
            };
            return (
              e(),
              window.addEventListener("scroll", e, { passive: !0 }),
              window.addEventListener("resize", e, { passive: !0 }),
              () => {
                (window.removeEventListener("scroll", e), window.removeEventListener("resize", e));
              }
            );
          }, [g]),
            (0, t.useEffect)(() => {
              if (!m) return;
              let e = (e) => {
                  b.current && !b.current.contains(e.target) && u(null);
                },
                r = (e) => {
                  "Escape" === e.key && u(null);
                };
              return (
                document.addEventListener("pointerdown", e),
                document.addEventListener("keydown", r),
                () => {
                  (document.removeEventListener("pointerdown", e),
                    document.removeEventListener("keydown", r));
                }
              );
            }, [m]));
          let C = (0, t.useCallback)(() => c(!1), []),
            L = (0, t.useCallback)(() => u(null), []),
            E = "/" === g,
            M = m ? e.find((e) => e.href === m && e.menu) : void 0,
            G = k ? "text-ivory/90 hover:text-gold-soft" : "text-ink hover:text-gold-deep",
            $ = k
              ? "border-[1.5px] border-ivory/40 text-ivory hover:border-gold hover:text-gold-soft"
              : "border-[1.5px] border-ink/30 text-ink hover:border-gold-deep hover:text-gold-deep";
          return (0, r.jsxs)("header", {
            ref: b,
            className: (0, i.cn)(
              E ? "fixed inset-x-0 top-0" : "sticky top-0",
              "z-[var(--dvn-z-header)] border-b transition-colors duration-[var(--dvn-duration-base)]",
              k
                ? "border-transparent bg-transparent"
                : "border-[var(--dvn-line-soft)] bg-ivory/95 backdrop-blur",
            ),
            children: [
              (0, r.jsxs)("div", {
                className:
                  "mx-auto flex h-[var(--dvn-header-h)] max-w-[var(--dvn-container-max)] items-center justify-between gap-6 px-[var(--dvn-container-gutter)]",
                children: [
                  (0, r.jsx)(p, {
                    href: "/",
                    className: "flex shrink-0 items-center",
                    children: (0, r.jsx)("img", {
                      src: k ? (s.srcDark ?? s.src) : s.src,
                      alt: s.alt,
                      width: s.width,
                      height: s.height,
                      className: "h-11 w-auto",
                    }),
                  }),
                  (0, r.jsx)("nav", {
                    "aria-label": "Main",
                    className: "hidden items-center gap-1 xl:flex",
                    children: e.map((e) =>
                      e.menu
                        ? (0, r.jsx)(
                            y,
                            {
                              item: e,
                              dark: k,
                              open: m === e.href,
                              onToggle: () => u((r) => (r === e.href ? null : e.href)),
                            },
                            e.href,
                          )
                        : e.children
                          ? (0, r.jsx)(v, { item: e, dark: k }, e.href)
                          : (0, r.jsx)(
                              p,
                              {
                                href: e.href,
                                className: (0, i.cn)("whitespace-nowrap px-3 py-2 text-sm", G),
                                children: e.label,
                              },
                              e.href,
                            ),
                    ),
                  }),
                  (0, r.jsxs)("div", {
                    className: "hidden items-center gap-5 xl:flex",
                    children: [
                      l?.phone
                        ? (0, r.jsxs)("a", {
                            href: `tel:${l.phone}`,
                            className: (0, i.cn)(
                              "flex items-center gap-2 whitespace-nowrap text-sm",
                              G,
                            ),
                            children: [(0, r.jsx)(f, {}), l.phone],
                          })
                        : null,
                      n
                        ? (0, r.jsx)(p, {
                            href: n.href,
                            className: (0, i.cn)("whitespace-nowrap px-5 py-2.5 text-sm", $),
                            children: n.label,
                          })
                        : null,
                    ],
                  }),
                  (0, r.jsx)("button", {
                    type: "button",
                    "aria-expanded": d,
                    "aria-label": a.toggleMenu,
                    onClick: () => c((e) => !e),
                    className: (0, i.cn)("px-2 py-3 xl:hidden", k ? "text-ivory" : "text-navy"),
                    children: d ? (0, r.jsx)(x, {}) : (0, r.jsx)(h, {}),
                  }),
                ],
              }),
              M?.menu ? (0, r.jsx)(w, { menu: M.menu, onClose: L }) : null,
              d
                ? (0, r.jsx)(z, {
                    items: e,
                    phone: l?.phone,
                    cta: n,
                    dark: k,
                    onClose: C,
                    labels: a,
                  })
                : null,
            ],
          });
        },
        "headerMode",
        0,
        N,
      ],
      9196,
    );
  },
  17016,
  (e) => {
    "use strict";
    var r = e.i(27693),
      t = e.i(4211),
      o = e.i(23322);
    e.s([
      "Reveal",
      0,
      function ({ children: e, delay: n = 0, className: s, effect: l = "up" }) {
        let a = (0, t.useRef)(null),
          [i, d] = (0, t.useState)(!1);
        return (
          (0, t.useEffect)(() => {
            let e = a.current;
            if (null === e) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return void d(!0);
            let r = new IntersectionObserver(
              (e) => {
                e.some((e) => e.isIntersecting) && (d(!0), r.disconnect());
              },
              { threshold: 0, rootMargin: "0px 0px -15% 0px" },
            );
            return (r.observe(e), () => r.disconnect());
          }, []),
          (0, r.jsx)("div", {
            ref: a,
            style: n > 0 ? { transitionDelay: `${n}ms` } : void 0,
            className: (0, o.cn)(
              "transition-[opacity,translate,scale] ease-[var(--dvn-ease-out)] duration-[var(--dvn-duration-slow)] motion-reduce:transition-none",
              i
                ? "scale" === l
                  ? "opacity-100 scale-100"
                  : "opacity-100 translate-y-0"
                : "scale" === l
                  ? "opacity-0 scale-[0.92]"
                  : "opacity-0 translate-y-4",
              s,
            ),
            children: e,
          })
        );
      },
    ]);
  },
  50871,
  (e) => {
    "use strict";
    var r = e.i(4211);
    e.s([
      "useFocusTrap",
      0,
      function (e, t, o) {
        (0, r.useEffect)(() => {
          if (!t) return;
          let r = e.current;
          if (!r) return;
          let n = document.activeElement,
            s = () =>
              Array.from(
                r.querySelectorAll(
                  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
              );
          s()[0]?.focus();
          let l = (e) => {
            if ("Escape" === e.key) return void o?.();
            if ("Tab" !== e.key) return;
            let t = s();
            if (0 === t.length) return;
            let n = t[0],
              l = t[t.length - 1],
              a = document.activeElement;
            if (e.shiftKey) {
              let t = r.contains(a);
              (a !== n && t) || (e.preventDefault(), l.focus());
              return;
            }
            a === l && (e.preventDefault(), n.focus());
          };
          return (
            document.addEventListener("keydown", l),
            () => {
              (document.removeEventListener("keydown", l), n?.focus());
            }
          );
        }, [e, t, o]);
      },
    ]);
  },
]);
