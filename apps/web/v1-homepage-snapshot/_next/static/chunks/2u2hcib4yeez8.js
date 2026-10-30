(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  836,
  (e) => {
    "use strict";
    var t = e.i(27693),
      r = e.i(70093);
    e.s([
      "default",
      0,
      function ({ error: e, reset: n }) {
        return (
          console.error("[app] runtime error:", e),
          (0, t.jsxs)("main", {
            className:
              "mx-auto flex min-h-[50vh] max-w-[var(--dvn-container-max)] flex-col items-center justify-center px-[var(--dvn-container-gutter)] py-24 text-center",
            children: [
              (0, t.jsx)("h1", {
                className: "font-serif text-[length:var(--dvn-text-display-lg-size)] text-navy",
                children: (0, r.uiString)("errorTitle"),
              }),
              (0, t.jsx)("p", {
                className: "mt-4 text-ink",
                children: (0, r.uiString)("errorBody"),
              }),
              (0, t.jsx)("button", {
                type: "button",
                onClick: n,
                className:
                  "mt-6 border border-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-navy hover:bg-navy hover:text-white",
                children: (0, r.uiString)("errorRetry"),
              }),
            ],
          })
        );
      },
    ]);
  },
]);
