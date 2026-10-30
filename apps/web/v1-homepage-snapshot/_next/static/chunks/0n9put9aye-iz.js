(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  16233,
  14099,
  70218,
  22142,
  (t) => {
    "use strict";
    t.i(83707);
    var e = t.i(27693),
      n = t.i(94237),
      a = t.i(4211),
      i = t.i(23322);
    ((0, n.cva)(
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
      t.i(77607),
      (0, n.cva)("border p-6 transition-shadow duration-300", {
        variants: {
          tone: {
            light: "border-[var(--dvn-line-soft)] bg-white text-ink",
            dark: "border-[var(--dvn-line-gold)] bg-navy text-white",
          },
          hover: { none: "", lift: "hover:shadow-[var(--dvn-shadow-lift)]" },
        },
        defaultVariants: { tone: "light", hover: "none" },
      }),
      t.i(78534),
      t.i(9196));
    let l = {
        xl: "text-[length:var(--dvn-text-display-xl-size)] leading-[var(--dvn-text-display-xl-lh)]",
        lg: "text-[length:var(--dvn-text-display-lg-size)] leading-[var(--dvn-text-display-lg-lh)]",
        md: "text-[length:var(--dvn-text-display-md-size)] leading-[var(--dvn-text-display-md-lh)]",
        sm: "text-[length:var(--dvn-text-display-sm-size)] leading-[var(--dvn-text-display-sm-lh)]",
        title: "text-[length:var(--dvn-text-title-size)] leading-[var(--dvn-text-title-lh)]",
      },
      d = (0, a.forwardRef)(function ({ className: t, level: n, size: a = "lg", ...d }, r) {
        return (0, e.jsx)(n, {
          ref: r,
          className: (0, i.cn)("font-serif text-navy [text-wrap:balance]", l[a], t),
          ...d,
        });
      });
    (t.s(["Heading", 0, d], 14099), t.i(17016));
    let r = (0, a.forwardRef)(function ({ className: t, innerClassName: n, children: a, ...l }, d) {
      return (0, e.jsx)("section", {
        ref: d,
        className: (0, i.cn)("py-[var(--dvn-section-y)] md:py-[var(--dvn-section-y-md)]", t),
        ...l,
        children: (0, e.jsx)("div", {
          className: (0, i.cn)(
            "mx-auto w-full max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)]",
            n,
          ),
          children: a,
        }),
      });
    });
    t.s(["Section", 0, r], 70218);
    let v = {
        lg: "text-[length:var(--dvn-text-body-lg-size)] leading-[var(--dvn-text-body-lg-lh)]",
        base: "text-[length:var(--dvn-text-body-size)] leading-[var(--dvn-text-body-lh)]",
        small: "text-[length:var(--dvn-text-small-size)] leading-[var(--dvn-text-small-lh)]",
        micro: "text-[length:var(--dvn-text-micro-size)] leading-[var(--dvn-text-micro-lh)]",
      },
      s = (0, a.forwardRef)(function (
        { className: t, size: n = "base", tone: a = "ink", ...l },
        d,
      ) {
        return (0, e.jsx)("p", {
          ref: d,
          className: (0, i.cn)(
            "font-sans",
            v[n],
            "muted" === a
              ? "text-muted"
              : "white" === a
                ? "text-white"
                : "gold" === a
                  ? "text-gold"
                  : "text-ink",
            t,
          ),
          ...l,
        });
      });
    (t.s(["Text", 0, s], 22142), t.i(50871), t.s([], 16233));
  },
]);
