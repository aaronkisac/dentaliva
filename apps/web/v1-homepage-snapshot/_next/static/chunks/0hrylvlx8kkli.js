(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  76688,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      ErrorBoundary: function () {
        return b;
      },
      ErrorBoundaryHandler: function () {
        return _;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(56421),
      a = e.r(27693),
      i = o._(e.r(4211)),
      l = e.r(44606),
      s = e.r(20969);
    e.r(14253);
    let c = e.r(66741),
      d = e.r(11779),
      f = e.r(94662),
      p = "u" > typeof window && (0, d.isBot)(window.navigator.userAgent);
    class _ extends i.default.Component {
      static {
        this.contextType = f.AppRouterContext;
      }
      constructor(e) {
        (super(e),
          (this.reset = () => {
            this.setState({ error: null });
          }),
          (this.retry = () => {
            (0, i.startTransition)(() => {
              (this.context?.refresh(), this.reset());
            });
          }),
          (this.state = { error: null, previousPathname: this.props.pathname }));
      }
      static getDerivedStateFromError(e) {
        if ((0, s.isNextRouterError)(e)) throw e;
        return { error: { thrownValue: e } };
      }
      static getDerivedStateFromProps(e, t) {
        let { error: r } = t;
        return e.pathname !== t.previousPathname && t.error
          ? { error: null, previousPathname: e.pathname }
          : { error: t.error, previousPathname: e.pathname };
      }
      render() {
        if (this.state.error && !p) {
          let e = this.state.error.thrownValue;
          return (
            (0, c.handleISRError)({ error: e }),
            (0, a.jsxs)(a.Fragment, {
              children: [
                this.props.errorStyles,
                this.props.errorScripts,
                (0, a.jsx)(this.props.errorComponent, {
                  error: e,
                  reset: this.reset,
                  retry: this.retry,
                }),
              ],
            })
          );
        }
        return this.props.children;
      }
    }
    function b({ errorComponent: e, errorStyles: t, errorScripts: r, children: n }) {
      let u = (0, l.useUntrackedPathname)();
      return e
        ? (0, a.jsx)(_, {
            pathname: u,
            errorComponent: e,
            errorStyles: t,
            errorScripts: r,
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
  66741,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "handleISRError", {
        enumerable: !0,
        get: function () {
          return u;
        },
      }));
    let n = e.r(77280);
    function u({ error: e }) {
      if (n.workAsyncStorage) {
        let t = n.workAsyncStorage.getStore();
        if (t?.isStaticGeneration) throw (e && console.error(e), e);
      }
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  53624,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      HTTPAccessErrorStatus: function () {
        return o;
      },
      HTTP_ERROR_FALLBACK_ERROR_CODE: function () {
        return i;
      },
      getAccessFallbackErrorTypeByStatus: function () {
        return c;
      },
      getAccessFallbackHTTPStatus: function () {
        return s;
      },
      isHTTPAccessFallbackError: function () {
        return l;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = { NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 },
      a = new Set(Object.values(o)),
      i = "NEXT_HTTP_ERROR_FALLBACK";
    function l(e) {
      if ("object" != typeof e || null === e || !("digest" in e) || "string" != typeof e.digest)
        return !1;
      let [t, r] = e.digest.split(";");
      return t === i && a.has(Number(r));
    }
    function s(e) {
      return Number(e.digest.split(";")[1]);
    }
    function c(e) {
      switch (e) {
        case 401:
          return "unauthorized";
        case 403:
          return "forbidden";
        case 404:
          return "not-found";
        default:
          return;
      }
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  20969,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "isNextRouterError", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    let n = e.r(53624),
      u = e.r(79574);
    function o(e) {
      return (0, u.isRedirectError)(e) || (0, n.isHTTPAccessFallbackError)(e);
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  14253,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      handleHardNavError: function () {
        return a;
      },
      useNavFailureHandler: function () {
        return i;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    e.r(4211);
    let o = e.r(59573);
    function a(e) {
      return (
        "u" > typeof window &&
        !!window.next.__pendingUrl &&
        (0, o.createHrefFromUrl)(new URL(window.location.href)) !==
          (0, o.createHrefFromUrl)(window.next.__pendingUrl) &&
        (console.error("Error occurred during navigation, falling back to hard navigation", e),
        (window.location.href = window.next.__pendingUrl.toString()),
        !0)
      );
    }
    function i() {}
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  83915,
  (e, t, r) => {
    "use strict";
    let n, u;
    Object.defineProperty(r, "__esModule", { value: !0 });
    var o = {
      useDynamicRouteParams: function () {
        return n;
      },
      useDynamicSearchParams: function () {
        return u;
      },
    };
    for (var a in o) Object.defineProperty(r, a, { enumerable: !0, get: o[a] });
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  21132,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      ServerInsertedHTMLContext: function () {
        return a;
      },
      useServerInsertedHTML: function () {
        return i;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(56421)._(e.r(4211)),
      a = o.default.createContext(null);
    function i(e) {
      let t = (0, o.useContext)(a);
      t && t(e);
    }
  },
  44606,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useUntrackedPathname", {
        enumerable: !0,
        get: function () {
          return a;
        },
      }));
    let n = e.r(4211),
      u = e.r(41481),
      o = e.r(77280);
    function a() {
      return !(function () {
        if ("u" < typeof window) {
          let e = o.workUnitAsyncStorage.getStore();
          if (!e) return !1;
          switch (e.type) {
            case "prerender":
            case "prerender-client":
            case "prerender-ppr":
            case "validation-client":
              let t = e.fallbackRouteParams;
              return !!t && t.size > 0;
          }
        }
        return !1;
      })()
        ? (0, n.useContext)(u.PathnameContext)
        : null;
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  33371,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "notFound", {
        enumerable: !0,
        get: function () {
          return o;
        },
      }));
    let n = e.r(53624),
      u = `${n.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;
    function o() {
      let e = Object.defineProperty(Error(u), "__NEXT_ERROR_CODE", {
        value: "E1041",
        enumerable: !1,
        configurable: !0,
      });
      throw ((e.digest = u), e);
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  97043,
  (e, t, r) => {
    "use strict";
    function n() {
      throw Object.defineProperty(
        Error(
          "`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled.",
        ),
        "__NEXT_ERROR_CODE",
        { value: "E488", enumerable: !1, configurable: !0 },
      );
    }
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "forbidden", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }),
      e.r(53624).HTTP_ERROR_FALLBACK_ERROR_CODE,
      ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
        void 0 === r.default.__esModule &&
        (Object.defineProperty(r.default, "__esModule", { value: !0 }),
        Object.assign(r.default, r),
        (t.exports = r.default)));
  },
  26715,
  (e, t, r) => {
    "use strict";
    function n() {
      throw Object.defineProperty(
        Error(
          "`unauthorized()` is experimental and only allowed to be used when `experimental.authInterrupts` is enabled.",
        ),
        "__NEXT_ERROR_CODE",
        { value: "E411", enumerable: !1, configurable: !0 },
      );
    }
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "unauthorized", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }),
      e.r(53624).HTTP_ERROR_FALLBACK_ERROR_CODE,
      ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
        void 0 === r.default.__esModule &&
        (Object.defineProperty(r.default, "__esModule", { value: !0 }),
        Object.assign(r.default, r),
        (t.exports = r.default)));
  },
  28072,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "ReadonlyURLSearchParams", {
        enumerable: !0,
        get: function () {
          return u;
        },
      }));
    class n extends Error {
      constructor() {
        (super(
          "Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams",
        ),
          Object.defineProperty(this, "__NEXT_ERROR_CODE", {
            value: "E1174",
            enumerable: !1,
            configurable: !0,
          }));
      }
    }
    class u extends URLSearchParams {
      append() {
        throw new n();
      }
      delete() {
        throw new n();
      }
      set() {
        throw new n();
      }
      sort() {
        throw new n();
      }
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  81975,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      RedirectBoundary: function () {
        return p;
      },
      RedirectErrorBoundary: function () {
        return f;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(56421),
      a = e.r(27693),
      i = o._(e.r(4211)),
      l = e.r(6652),
      s = e.r(42113),
      c = e.r(79574);
    function d({ redirect: e, reset: t, redirectType: r }) {
      let n = (0, l.useRouter)();
      return (
        (0, i.useEffect)(() => {
          i.default.startTransition(() => {
            ("push" === r ? n.push(e, {}) : n.replace(e, {}), t());
          });
        }, [e, r, t, n]),
        null
      );
    }
    class f extends i.default.Component {
      constructor(e) {
        (super(e), (this.state = { redirect: null, redirectType: null }));
      }
      static getDerivedStateFromError(e) {
        if ((0, c.isRedirectError)(e)) {
          let t = (0, s.getURLFromRedirectError)(e),
            r = (0, s.getRedirectTypeFromError)(e);
          return "handled" in e
            ? { redirect: null, redirectType: null }
            : { redirect: t, redirectType: r };
        }
        throw e;
      }
      render() {
        let { redirect: e, redirectType: t } = this.state;
        return null !== e && null !== t
          ? (0, a.jsx)(d, {
              redirect: e,
              redirectType: t,
              reset: () => this.setState({ redirect: null }),
            })
          : this.props.children;
      }
    }
    function p({ children: e }) {
      let t = (0, l.useRouter)();
      return (0, a.jsx)(f, { router: t, children: e });
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  32896,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "createRouterCacheKey", {
        enumerable: !0,
        get: function () {
          return u;
        },
      }));
    let n = e.r(67305);
    function u(e, t = !1) {
      return Array.isArray(e)
        ? `${e[0]}|${e[1]}|${e[2]}`
        : t && e.startsWith(n.PAGE_SEGMENT_KEY)
          ? n.PAGE_SEGMENT_KEY
          : e;
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  92633,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "unresolvedThenable", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let n = { then: () => {} };
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  98038,
  (e, t, r) => {
    "use strict";
    (Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "unstable_rethrow", {
        enumerable: !0,
        get: function () {
          return function e(t) {
            if ((0, u.isNextRouterError)(t) || (0, n.isBailoutToCSRError)(t)) throw t;
            t instanceof Error && "cause" in t && e(t.cause);
          };
        },
      }));
    let n = e.r(5755),
      u = e.r(20969);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  1081,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      ReadonlyURLSearchParams: function () {
        return o.ReadonlyURLSearchParams;
      },
      RedirectType: function () {
        return f;
      },
      forbidden: function () {
        return l.forbidden;
      },
      notFound: function () {
        return i.notFound;
      },
      permanentRedirect: function () {
        return a.permanentRedirect;
      },
      redirect: function () {
        return a.redirect;
      },
      unauthorized: function () {
        return s.unauthorized;
      },
      unstable_isUnrecognizedActionError: function () {
        return d;
      },
      unstable_rethrow: function () {
        return c.unstable_rethrow;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(28072),
      a = e.r(42113),
      i = e.r(33371),
      l = e.r(97043),
      s = e.r(26715),
      c = e.r(98038);
    function d() {
      throw Object.defineProperty(
        Error("`unstable_isUnrecognizedActionError` can only be used on the client."),
        "__NEXT_ERROR_CODE",
        { value: "E776", enumerable: !1, configurable: !0 },
      );
    }
    let f = { push: "push", replace: "replace" };
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  6652,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      ReadonlyURLSearchParams: function () {
        return i.ReadonlyURLSearchParams;
      },
      RedirectType: function () {
        return f.RedirectType;
      },
      ServerInsertedHTMLContext: function () {
        return c.ServerInsertedHTMLContext;
      },
      forbidden: function () {
        return f.forbidden;
      },
      notFound: function () {
        return f.notFound;
      },
      permanentRedirect: function () {
        return f.permanentRedirect;
      },
      redirect: function () {
        return f.redirect;
      },
      unauthorized: function () {
        return f.unauthorized;
      },
      unstable_isUnrecognizedActionError: function () {
        return d.unstable_isUnrecognizedActionError;
      },
      unstable_rethrow: function () {
        return f.unstable_rethrow;
      },
      useParams: function () {
        return O;
      },
      usePathname: function () {
        return h;
      },
      useRouter: function () {
        return m;
      },
      useSearchParams: function () {
        return y;
      },
      useSelectedLayoutSegment: function () {
        return P;
      },
      useSelectedLayoutSegments: function () {
        return v;
      },
      useServerInsertedHTML: function () {
        return c.useServerInsertedHTML;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(56421)._(e.r(4211)),
      a = e.r(94662),
      i = e.r(41481),
      l = e.r(67305),
      s = e.r(83915),
      c = e.r(21132),
      d = e.r(84792),
      f = e.r(1081),
      {
        instrumentParamsForClientValidation: p,
        instrumentSearchParamsForClientValidation: _,
        expectCompleteParamsInClientValidation: b,
      } = {};
    function y() {
      s.useDynamicSearchParams?.("useSearchParams()");
      let e = (0, o.useContext)(i.SearchParamsContext);
      return (0, o.useMemo)(() => (e ? new i.ReadonlyURLSearchParams(e) : null), [e]);
    }
    function h() {
      return (s.useDynamicRouteParams?.("usePathname()"), (0, o.useContext)(i.PathnameContext));
    }
    function m() {
      let e = (0, o.useContext)(a.AppRouterContext);
      if (null === e)
        throw Object.defineProperty(
          Error("invariant expected app router to be mounted"),
          "__NEXT_ERROR_CODE",
          { value: "E238", enumerable: !1, configurable: !0 },
        );
      let t = (0, o.useContext)(a.LayoutRouterContext),
        r = t?.parentCacheNode.bfcacheId ?? 0;
      return (0, o.useMemo)(
        () => ({
          back: e.back,
          forward: e.forward,
          refresh: e.refresh,
          hmrRefresh: e.hmrRefresh,
          push: e.push,
          replace: e.replace,
          prefetch: e.prefetch,
          experimental_gesturePush: e.experimental_gesturePush,
          bfcacheId: "_b_" + r + "_",
        }),
        [e, r],
      );
    }
    function O() {
      return (s.useDynamicRouteParams?.("useParams()"), (0, o.useContext)(i.PathParamsContext));
    }
    function v(e = "children") {
      s.useDynamicRouteParams?.("useSelectedLayoutSegments()");
      let t = (0, o.useContext)(a.LayoutRouterContext);
      return t ? (0, l.getSelectedLayoutSegmentPath)(t.parentTree, e) : null;
    }
    function P(e = "children") {
      (s.useDynamicRouteParams?.("useSelectedLayoutSegment()"),
        (0, o.useContext)(i.NavigationPromisesContext));
      let t = v(e);
      return (0, l.computeSelectedLayoutSegment)(t, e);
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  98017,
  (e, t, r) => {
    var n = {
        156: function (e) {
          var t,
            r,
            n,
            u = (e.exports = {});
          function o() {
            throw Error("setTimeout has not been defined");
          }
          function a() {
            throw Error("clearTimeout has not been defined");
          }
          try {
            t = "function" == typeof setTimeout ? setTimeout : o;
          } catch (e) {
            t = o;
          }
          try {
            r = "function" == typeof clearTimeout ? clearTimeout : a;
          } catch (e) {
            r = a;
          }
          function i(e) {
            if (t === setTimeout) return setTimeout(e, 0);
            if ((t === o || !t) && setTimeout) return ((t = setTimeout), setTimeout(e, 0));
            try {
              return t(e, 0);
            } catch (r) {
              try {
                return t.call(null, e, 0);
              } catch (r) {
                return t.call(this, e, 0);
              }
            }
          }
          var l = [],
            s = !1,
            c = -1;
          function d() {
            s && n && ((s = !1), n.length ? (l = n.concat(l)) : (c = -1), l.length && f());
          }
          function f() {
            if (!s) {
              var e = i(d);
              s = !0;
              for (var t = l.length; t;) {
                for (n = l, l = []; ++c < t;) n && n[c].run();
                ((c = -1), (t = l.length));
              }
              ((n = null),
                (s = !1),
                (function (e) {
                  if (r === clearTimeout) return clearTimeout(e);
                  if ((r === a || !r) && clearTimeout) return ((r = clearTimeout), clearTimeout(e));
                  try {
                    r(e);
                  } catch (t) {
                    try {
                      return r.call(null, e);
                    } catch (t) {
                      return r.call(this, e);
                    }
                  }
                })(e));
            }
          }
          function p(e, t) {
            ((this.fun = e), (this.array = t));
          }
          function _() {}
          ((u.nextTick = function (e) {
            var t = Array(arguments.length - 1);
            if (arguments.length > 1)
              for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
            (l.push(new p(e, t)), 1 !== l.length || s || i(f));
          }),
            (p.prototype.run = function () {
              this.fun.apply(null, this.array);
            }),
            (u.title = "browser"),
            (u.browser = !0),
            (u.env = {}),
            (u.argv = []),
            (u.version = ""),
            (u.versions = {}),
            (u.on = _),
            (u.addListener = _),
            (u.once = _),
            (u.off = _),
            (u.removeListener = _),
            (u.removeAllListeners = _),
            (u.emit = _),
            (u.prependListener = _),
            (u.prependOnceListener = _),
            (u.listeners = function (e) {
              return [];
            }),
            (u.binding = function (e) {
              throw Error("process.binding is not supported");
            }),
            (u.cwd = function () {
              return "/";
            }),
            (u.chdir = function (e) {
              throw Error("process.chdir is not supported");
            }),
            (u.umask = function () {
              return 0;
            }));
        },
      },
      u = {};
    function o(e) {
      var t = u[e];
      if (void 0 !== t) return t.exports;
      var r = (u[e] = { exports: {} }),
        a = !0;
      try {
        (n[e](r, r.exports, o), (a = !1));
      } finally {
        a && delete u[e];
      }
      return r.exports;
    }
    ((o.ab =
      "/ROOT/node_modules/.pnpm/next@16.3.6_@babel+core@7.2_ae486b1fc949a5a24e6164753877a3ac/node_modules/next/dist/compiled/process/"),
      (t.exports = o(156)));
  },
  55211,
  (e, t, r) => {
    "use strict";
    var n, u;
    t.exports =
      (null == (n = e.g.process) ? void 0 : n.env) &&
      "object" == typeof (null == (u = e.g.process) ? void 0 : u.env)
        ? e.g.process
        : e.r(98017);
  },
  23178,
  (e, t, r) => {
    "use strict";
    var n = Symbol.for("react.transitional.element");
    function u(e, t, r) {
      var u = null;
      if ((void 0 !== r && (u = "" + r), void 0 !== t.key && (u = "" + t.key), "key" in t))
        for (var o in ((r = {}), t)) "key" !== o && (r[o] = t[o]);
      else r = t;
      return { $$typeof: n, type: e, key: u, ref: void 0 !== (t = r.ref) ? t : null, props: r };
    }
    ((r.Fragment = Symbol.for("react.fragment")), (r.jsx = u), (r.jsxs = u));
  },
  27693,
  (e, t, r) => {
    "use strict";
    (e.i(55211), (t.exports = e.r(23178)));
  },
  31136,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      METADATA_BOUNDARY_NAME: function () {
        return o;
      },
      OUTLET_BOUNDARY_NAME: function () {
        return i;
      },
      ROOT_LAYOUT_BOUNDARY_NAME: function () {
        return l;
      },
      VIEWPORT_BOUNDARY_NAME: function () {
        return a;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = "__next_metadata_boundary__",
      a = "__next_viewport_boundary__",
      i = "__next_outlet_boundary__",
      l = "__next_root_layout_boundary__";
  },
  32197,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      MetadataBoundary: function () {
        return i;
      },
      OutletBoundary: function () {
        return s;
      },
      RootLayoutBoundary: function () {
        return c;
      },
      ViewportBoundary: function () {
        return l;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(31136),
      a = {
        [o.METADATA_BOUNDARY_NAME]: function ({ children: e }) {
          return e;
        },
        [o.VIEWPORT_BOUNDARY_NAME]: function ({ children: e }) {
          return e;
        },
        [o.OUTLET_BOUNDARY_NAME]: function ({ children: e }) {
          return e;
        },
        [o.ROOT_LAYOUT_BOUNDARY_NAME]: function ({ children: e }) {
          return e;
        },
      },
      i = a[o.METADATA_BOUNDARY_NAME.slice(0)],
      l = a[o.VIEWPORT_BOUNDARY_NAME.slice(0)],
      s = a[o.OUTLET_BOUNDARY_NAME.slice(0)],
      c = a[o.ROOT_LAYOUT_BOUNDARY_NAME.slice(0)];
  },
  44743,
  (e, t, r) => {
    "use strict";
    (e.i(55211),
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "HeadManagerContext", {
        enumerable: !0,
        get: function () {
          return n;
        },
      }));
    let n = e.r(36437)._(e.r(4211)).default.createContext({});
  },
  41481,
  (e, t, r) => {
    "use strict";
    (e.i(55211), Object.defineProperty(r, "__esModule", { value: !0 }));
    var n = {
      NavigationPromisesContext: function () {
        return c;
      },
      PathParamsContext: function () {
        return s;
      },
      PathnameContext: function () {
        return l;
      },
      ReadonlyURLSearchParams: function () {
        return a.ReadonlyURLSearchParams;
      },
      SearchParamsContext: function () {
        return i;
      },
      createDevToolsInstrumentedPromise: function () {
        return d;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = e.r(4211),
      a = e.r(28072),
      i = (0, o.createContext)(null),
      l = (0, o.createContext)(null),
      s = (0, o.createContext)(null),
      c = (0, o.createContext)(null);
    function d(e, t) {
      let r = Promise.resolve(t);
      return ((r.status = "fulfilled"), (r.value = t), (r.displayName = `${e} (SSR)`), r);
    }
  },
  5755,
  (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = {
      BailoutToCSRError: function () {
        return a;
      },
      isBailoutToCSRError: function () {
        return i;
      },
    };
    for (var u in n) Object.defineProperty(r, u, { enumerable: !0, get: n[u] });
    let o = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
    class a extends Error {
      constructor(e) {
        (super(`Bail out to client-side rendering: ${e}`), (this.reason = e), (this.digest = o));
      }
    }
    function i(e) {
      return "object" == typeof e && null !== e && "digest" in e && e.digest === o;
    }
  },
]);
