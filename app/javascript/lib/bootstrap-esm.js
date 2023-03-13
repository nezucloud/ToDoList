/*!
 * Bootstrap v5.3.0-alpha1 (https://getbootstrap.com/)
 * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */
import "@popperjs/core";
const MAX_UID = 1e6,
  MILLISECONDS_MULTIPLIER = 1e3,
  TRANSITION_END = "transitionend",
  parseSelector = (e) => (
    e &&
      window.CSS &&
      window.CSS.escape &&
      (e = e.replace(/#([^\s"#']+)/g, (e, t) => `#${CSS.escape(t)}`)),
    e
  ),
  toType = (e) =>
    null == e
      ? `${e}`
      : Object.prototype.toString
          .call(e)
          .match(/\s([a-z]+)/i)[1]
          .toLowerCase(),
  getUID = (e) => {
    do {
      e += Math.floor(1e6 * Math.random());
    } while (document.getElementById(e));
    return e;
  },
  getTransitionDurationFromElement = (e) => {
    if (!e) return 0;
    let { transitionDuration: t, transitionDelay: n } =
      window.getComputedStyle(e);
    const i = Number.parseFloat(t),
      s = Number.parseFloat(n);
    return i || s
      ? ((t = t.split(",")[0]),
        (n = n.split(",")[0]),
        1e3 * (Number.parseFloat(t) + Number.parseFloat(n)))
      : 0;
  },
  triggerTransitionEnd = (e) => {
    e.dispatchEvent(new Event(TRANSITION_END));
  },
  isElement = (e) =>
    !(!e || "object" != typeof e) &&
    (void 0 !== e.jquery && (e = e[0]), void 0 !== e.nodeType),
  getElement = (e) =>
    isElement(e)
      ? e.jquery
        ? e[0]
        : e
      : "string" == typeof e && e.length > 0
      ? document.querySelector(parseSelector(e))
      : null,
  isVisible = (e) => {
    if (!isElement(e) || 0 === e.getClientRects().length) return !1;
    const t = "visible" === getComputedStyle(e).getPropertyValue("visibility"),
      n = e.closest("details:not([open])");
    if (!n) return t;
    if (n !== e) {
      const t = e.closest("summary");
      if (t && t.parentNode !== n) return !1;
      if (null === t) return !1;
    }
    return t;
  },
  isDisabled = (e) =>
    !e ||
    e.nodeType !== Node.ELEMENT_NODE ||
    !!e.classList.contains("disabled") ||
    (void 0 !== e.disabled
      ? e.disabled
      : e.hasAttribute("disabled") && "false" !== e.getAttribute("disabled")),
  findShadowRoot = (e) => {
    if (!document.documentElement.attachShadow) return null;
    if ("function" == typeof e.getRootNode) {
      const t = e.getRootNode();
      return t instanceof ShadowRoot ? t : null;
    }
    return e instanceof ShadowRoot
      ? e
      : e.parentNode
      ? findShadowRoot(e.parentNode)
      : null;
  },
  noop = () => {},
  reflow = (e) => {
    e.offsetHeight;
  },
  getjQuery = () =>
    window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")
      ? window.jQuery
      : null,
  DOMContentLoadedCallbacks = [],
  onDOMContentLoaded = (e) => {
    "loading" === document.readyState
      ? (DOMContentLoadedCallbacks.length ||
          document.addEventListener("DOMContentLoaded", () => {
            for (const e of DOMContentLoadedCallbacks) e();
          }),
        DOMContentLoadedCallbacks.push(e))
      : e();
  },
  isRTL = () => "rtl" === document.documentElement.dir,
  defineJQueryPlugin = (e) => {
    var t;
    (t = () => {
      const t = getjQuery();
      if (t) {
        const n = e.NAME,
          i = t.fn[n];
        (t.fn[n] = e.jQueryInterface),
          (t.fn[n].Constructor = e),
          (t.fn[n].noConflict = () => ((t.fn[n] = i), e.jQueryInterface));
      }
    }),
      "loading" === document.readyState
        ? (DOMContentLoadedCallbacks.length ||
            document.addEventListener("DOMContentLoaded", () => {
              for (const e of DOMContentLoadedCallbacks) e();
            }),
          DOMContentLoadedCallbacks.push(t))
        : t();
  },
  execute = (e, t = [], n = e) => ("function" == typeof e ? e(...t) : n),
  executeAfterTransition = (e, t, n = !0) => {
    if (!n) return void execute(e);
    const i = getTransitionDurationFromElement(t) + 5;
    let s = !1;
    const o = ({ target: n }) => {
      n === t &&
        ((s = !0), t.removeEventListener(TRANSITION_END, o), execute(e));
    };
    t.addEventListener(TRANSITION_END, o),
      setTimeout(() => {
        s || triggerTransitionEnd(t);
      }, i);
  },
  getNextActiveElement = (e, t, n, i) => {
    const s = e.length;
    let o = e.indexOf(t);
    return -1 === o
      ? !n && i
        ? e[s - 1]
        : e[0]
      : ((o += n ? 1 : -1),
        i && (o = (o + s) % s),
        e[Math.max(0, Math.min(o, s - 1))]);
  },
  namespaceRegex = /[^.]*(?=\..*)\.|.*/,
  stripNameRegex = /\..*/,
  stripUidRegex = /::\d+$/,
  eventRegistry = {};
let uidEvent = 1;
const customEvents = { mouseenter: "mouseover", mouseleave: "mouseout" },
  nativeEvents = new Set([
    "click",
    "dblclick",
    "mouseup",
    "mousedown",
    "contextmenu",
    "mousewheel",
    "DOMMouseScroll",
    "mouseover",
    "mouseout",
    "mousemove",
    "selectstart",
    "selectend",
    "keydown",
    "keypress",
    "keyup",
    "orientationchange",
    "touchstart",
    "touchmove",
    "touchend",
    "touchcancel",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointerleave",
    "pointercancel",
    "gesturestart",
    "gesturechange",
    "gestureend",
    "focus",
    "blur",
    "change",
    "reset",
    "select",
    "submit",
    "focusin",
    "focusout",
    "load",
    "unload",
    "beforeunload",
    "resize",
    "move",
    "DOMContentLoaded",
    "readystatechange",
    "error",
    "abort",
    "scroll",
  ]);
function makeEventUid(e, t) {
  return (t && `${t}::${uidEvent++}`) || e.uidEvent || uidEvent++;
}
function getElementEvents(e) {
  const t = makeEventUid(e);
  return (
    (e.uidEvent = t),
    (eventRegistry[t] = eventRegistry[t] || {}),
    eventRegistry[t]
  );
}
function bootstrapHandler(e, t) {
  return function n(i) {
    return (
      hydrateObj(i, { delegateTarget: e }),
      n.oneOff && EventHandler.off(e, i.type, t),
      t.apply(e, [i])
    );
  };
}
function bootstrapDelegationHandler(e, t, n) {
  return function i(s) {
    const o = e.querySelectorAll(t);
    for (let { target: r } = s; r && r !== this; r = r.parentNode)
      for (const a of o)
        if (a === r)
          return (
            hydrateObj(s, { delegateTarget: r }),
            i.oneOff && EventHandler.off(e, s.type, t, n),
            n.apply(r, [s])
          );
  };
}
function findHandler(e, t, n = null) {
  return Object.values(e).find(
    (e) => e.callable === t && e.delegationSelector === n
  );
}
function normalizeParameters(e, t, n) {
  const i = "string" == typeof t,
    s = i ? n : t || n;
  let o = getTypeEvent(e);
  return nativeEvents.has(o) || (o = e), [i, s, o];
}
function addHandler(e, t, n, i, s) {
  if ("string" != typeof t || !e) return;
  let [o, r, a] = normalizeParameters(t, n, i);
  if (t in customEvents) {
    const e = (e) =>
      function (t) {
        if (
          !t.relatedTarget ||
          (t.relatedTarget !== t.delegateTarget &&
            !t.delegateTarget.contains(t.relatedTarget))
        )
          return e.call(this, t);
      };
    r = e(r);
  }
  const l = getElementEvents(e),
    c = l[a] || (l[a] = {}),
    _ = findHandler(c, r, o ? n : null);
  if (_) return void (_.oneOff = _.oneOff && s);
  const d = makeEventUid(r, t.replace(namespaceRegex, "")),
    h = o ? bootstrapDelegationHandler(e, n, r) : bootstrapHandler(e, r);
  (h.delegationSelector = o ? n : null),
    (h.callable = r),
    (h.oneOff = s),
    (h.uidEvent = d),
    (c[d] = h),
    e.addEventListener(a, h, o);
}
function removeHandler(e, t, n, i, s) {
  const o = findHandler(t[n], i, s);
  o && (e.removeEventListener(n, o, Boolean(s)), delete t[n][o.uidEvent]);
}
function removeNamespacedHandlers(e, t, n, i) {
  const s = t[n] || {};
  for (const [o, r] of Object.entries(s))
    o.includes(i) && removeHandler(e, t, n, r.callable, r.delegationSelector);
}
function getTypeEvent(e) {
  return (e = e.replace(stripNameRegex, "")), customEvents[e] || e;
}
const EventHandler = {
  on(e, t, n, i) {
    addHandler(e, t, n, i, !1);
  },
  one(e, t, n, i) {
    addHandler(e, t, n, i, !0);
  },
  off(e, t, n, i) {
    if ("string" != typeof t || !e) return;
    const [s, o, r] = normalizeParameters(t, n, i),
      a = r !== t,
      l = getElementEvents(e),
      c = l[r] || {},
      _ = t.startsWith(".");
    if (void 0 === o) {
      if (_)
        for (const n of Object.keys(l))
          removeNamespacedHandlers(e, l, n, t.slice(1));
      for (const [n, i] of Object.entries(c)) {
        const s = n.replace(stripUidRegex, "");
        (a && !t.includes(s)) ||
          removeHandler(e, l, r, i.callable, i.delegationSelector);
      }
    } else {
      if (!Object.keys(c).length) return;
      removeHandler(e, l, r, o, s ? n : null);
    }
  },
  trigger(e, t, n) {
    if ("string" != typeof t || !e) return null;
    const i = getjQuery();
    let s = null,
      o = !0,
      r = !0,
      a = !1;
    t !== getTypeEvent(t) &&
      i &&
      ((s = i.Event(t, n)),
      i(e).trigger(s),
      (o = !s.isPropagationStopped()),
      (r = !s.isImmediatePropagationStopped()),
      (a = s.isDefaultPrevented()));
    let l = new Event(t, { bubbles: o, cancelable: !0 });
    return (
      (l = hydrateObj(l, n)),
      a && l.preventDefault(),
      r && e.dispatchEvent(l),
      l.defaultPrevented && s && s.preventDefault(),
      l
    );
  },
};
function hydrateObj(e, t = {}) {
  for (const [n, i] of Object.entries(t))
    try {
      e[n] = i;
    } catch (t) {
      Object.defineProperty(e, n, { configurable: !0, get: () => i });
    }
  return e;
}
const elementMap = new Map(),
  Data = {
    set(e, t, n) {
      elementMap.has(e) || elementMap.set(e, new Map());
      const i = elementMap.get(e);
      i.has(t) || 0 === i.size
        ? i.set(t, n)
        : console.error(
            `Bootstrap doesn't allow more than one instance per element. Bound instance: ${
              Array.from(i.keys())[0]
            }.`
          );
    },
    get: (e, t) => (elementMap.has(e) && elementMap.get(e).get(t)) || null,
    remove(e, t) {
      if (!elementMap.has(e)) return;
      const n = elementMap.get(e);
      n.delete(t), 0 === n.size && elementMap.delete(e);
    },
  };
function normalizeData(e) {
  if ("true" === e) return !0;
  if ("false" === e) return !1;
  if (e === Number(e).toString()) return Number(e);
  if ("" === e || "null" === e) return null;
  if ("string" != typeof e) return e;
  try {
    return JSON.parse(decodeURIComponent(e));
  } catch (t) {
    return e;
  }
}
function normalizeDataKey(e) {
  return e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
const Manipulator = {
  setDataAttribute(e, t, n) {
    e.setAttribute(`data-bs-${normalizeDataKey(t)}`, n);
  },
  removeDataAttribute(e, t) {
    e.removeAttribute(`data-bs-${normalizeDataKey(t)}`);
  },
  getDataAttributes(e) {
    if (!e) return {};
    const t = {},
      n = Object.keys(e.dataset).filter(
        (e) => e.startsWith("bs") && !e.startsWith("bsConfig")
      );
    for (const i of n) {
      let n = i.replace(/^bs/, "");
      (n = n.charAt(0).toLowerCase() + n.slice(1, n.length)),
        (t[n] = normalizeData(e.dataset[i]));
    }
    return t;
  },
  getDataAttribute: (e, t) =>
    normalizeData(e.getAttribute(`data-bs-${normalizeDataKey(t)}`)),
};
class Config {
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error(
      'You have to implement the static method "NAME", for each component!'
    );
  }
  _getConfig(e) {
    return (
      (e = this._mergeConfigObj(e)),
      (e = this._configAfterMerge(e)),
      this._typeCheckConfig(e),
      e
    );
  }
  _configAfterMerge(e) {
    return e;
  }
  _mergeConfigObj(e, t) {
    const n = isElement(t) ? Manipulator.getDataAttribute(t, "config") : {};
    return {
      ...this.constructor.Default,
      ...("object" == typeof n ? n : {}),
      ...(isElement(t) ? Manipulator.getDataAttributes(t) : {}),
      ...("object" == typeof e ? e : {}),
    };
  }
  _typeCheckConfig(e, t = this.constructor.DefaultType) {
    for (const [i, s] of Object.entries(t)) {
      const t = e[i],
        o = isElement(t)
          ? "element"
          : null == (n = t)
          ? `${n}`
          : Object.prototype.toString
              .call(n)
              .match(/\s([a-z]+)/i)[1]
              .toLowerCase();
      if (!new RegExp(s).test(o))
        throw new TypeError(
          `${this.constructor.NAME.toUpperCase()}: Option "${i}" provided type "${o}" but expected type "${s}".`
        );
    }
    var n;
  }
}
const VERSION = "5.3.0-alpha1";
class BaseComponent extends Config {
  constructor(e, t) {
    super(),
      (e = getElement(e)) &&
        ((this._element = e),
        (this._config = this._getConfig(t)),
        Data.set(this._element, this.constructor.DATA_KEY, this));
  }
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY),
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
    for (const e of Object.getOwnPropertyNames(this)) this[e] = null;
  }
  _queueCallback(e, t, n = !0) {
    executeAfterTransition(e, t, n);
  }
  _getConfig(e) {
    return (
      (e = this._mergeConfigObj(e, this._element)),
      (e = this._configAfterMerge(e)),
      this._typeCheckConfig(e),
      e
    );
  }
  static getInstance(e) {
    return Data.get(getElement(e), this.DATA_KEY);
  }
  static getOrCreateInstance(e, t = {}) {
    return this.getInstance(e) || new this(e, "object" == typeof t ? t : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(e) {
    return `${e}${this.EVENT_KEY}`;
  }
}
const getSelector = (e) => {
    let t = e.getAttribute("data-bs-target");
    if (!t || "#" === t) {
      let n = e.getAttribute("href");
      if (!n || (!n.includes("#") && !n.startsWith("."))) return null;
      n.includes("#") && !n.startsWith("#") && (n = `#${n.split("#")[1]}`),
        (t = n && "#" !== n ? n.trim() : null);
    }
    return parseSelector(t);
  },
  SelectorEngine = {
    find: (e, t = document.documentElement) =>
      [].concat(...Element.prototype.querySelectorAll.call(t, e)),
    findOne: (e, t = document.documentElement) =>
      Element.prototype.querySelector.call(t, e),
    children: (e, t) => [].concat(...e.children).filter((e) => e.matches(t)),
    parents(e, t) {
      const n = [];
      let i = e.parentNode.closest(t);
      for (; i; ) n.push(i), (i = i.parentNode.closest(t));
      return n;
    },
    prev(e, t) {
      let n = e.previousElementSibling;
      for (; n; ) {
        if (n.matches(t)) return [n];
        n = n.previousElementSibling;
      }
      return [];
    },
    next(e, t) {
      let n = e.nextElementSibling;
      for (; n; ) {
        if (n.matches(t)) return [n];
        n = n.nextElementSibling;
      }
      return [];
    },
    focusableChildren(e) {
      const t = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        "details",
        "[tabindex]",
        '[contenteditable="true"]',
      ]
        .map((e) => `${e}:not([tabindex^="-"])`)
        .join(",");
      return this.find(t, e).filter((e) => !isDisabled(e) && isVisible(e));
    },
    getSelectorFromElement(e) {
      const t = getSelector(e);
      return t && SelectorEngine.findOne(t) ? t : null;
    },
    getElementFromSelector(e) {
      const t = getSelector(e);
      return t ? SelectorEngine.findOne(t) : null;
    },
    getMultipleElementsFromSelector(e) {
      const t = getSelector(e);
      return t ? SelectorEngine.find(t) : [];
    },
  },
  enableDismissTrigger = (e, t = "hide") => {
    const n = `click.dismiss${e.EVENT_KEY}`,
      i = e.NAME;
    EventHandler.on(document, n, `[data-bs-dismiss="${i}"]`, function (n) {
      if (
        (["A", "AREA"].includes(this.tagName) && n.preventDefault(),
        isDisabled(this))
      )
        return;
      const s =
        SelectorEngine.getElementFromSelector(this) || this.closest(`.${i}`);
      e.getOrCreateInstance(s)[t]();
    });
  },
  NAME$f = "alert",
  DATA_KEY$a = "bs.alert",
  EVENT_KEY$b = ".bs.alert",
  EVENT_CLOSE = "close.bs.alert",
  EVENT_CLOSED = "closed.bs.alert",
  CLASS_NAME_FADE$5 = "fade",
  CLASS_NAME_SHOW$8 = "show";
class Alert extends BaseComponent {
  static get NAME() {
    return NAME$f;
  }
  close() {
    if (EventHandler.trigger(this._element, EVENT_CLOSE).defaultPrevented)
      return;
    this._element.classList.remove("show");
    const e = this._element.classList.contains("fade");
    this._queueCallback(() => this._destroyElement(), this._element, e);
  }
  _destroyElement() {
    this._element.remove(),
      EventHandler.trigger(this._element, EVENT_CLOSED),
      this.dispose();
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Alert.getOrCreateInstance(this);
      if ("string" == typeof e) {
        if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
          throw new TypeError(`No method named "${e}"`);
        t[e](this);
      }
    });
  }
}
enableDismissTrigger(Alert, "close"), defineJQueryPlugin(Alert);
const NAME$e = "button",
  DATA_KEY$9 = "bs.button",
  EVENT_KEY$a = ".bs.button",
  DATA_API_KEY$6 = ".data-api",
  CLASS_NAME_ACTIVE$3 = "active",
  SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]',
  EVENT_CLICK_DATA_API$6 = "click.bs.button.data-api";
class Button extends BaseComponent {
  static get NAME() {
    return NAME$e;
  }
  toggle() {
    this._element.setAttribute(
      "aria-pressed",
      this._element.classList.toggle("active")
    );
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Button.getOrCreateInstance(this);
      "toggle" === e && t[e]();
    });
  }
}
EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$6,
  SELECTOR_DATA_TOGGLE$5,
  (e) => {
    e.preventDefault();
    const t = e.target.closest(SELECTOR_DATA_TOGGLE$5);
    Button.getOrCreateInstance(t).toggle();
  }
),
  defineJQueryPlugin(Button);
const NAME$d = "swipe",
  EVENT_KEY$9 = ".bs.swipe",
  EVENT_TOUCHSTART = "touchstart.bs.swipe",
  EVENT_TOUCHMOVE = "touchmove.bs.swipe",
  EVENT_TOUCHEND = "touchend.bs.swipe",
  EVENT_POINTERDOWN = "pointerdown.bs.swipe",
  EVENT_POINTERUP = "pointerup.bs.swipe",
  POINTER_TYPE_TOUCH = "touch",
  POINTER_TYPE_PEN = "pen",
  CLASS_NAME_POINTER_EVENT = "pointer-event",
  SWIPE_THRESHOLD = 40,
  Default$c = { endCallback: null, leftCallback: null, rightCallback: null },
  DefaultType$c = {
    endCallback: "(function|null)",
    leftCallback: "(function|null)",
    rightCallback: "(function|null)",
  };
class Swipe extends Config {
  constructor(e, t) {
    super(),
      (this._element = e),
      e &&
        Swipe.isSupported() &&
        ((this._config = this._getConfig(t)),
        (this._deltaX = 0),
        (this._supportPointerEvents = Boolean(window.PointerEvent)),
        this._initEvents());
  }
  static get Default() {
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
  }
  dispose() {
    EventHandler.off(this._element, ".bs.swipe");
  }
  _start(e) {
    this._supportPointerEvents
      ? this._eventIsPointerPenTouch(e) && (this._deltaX = e.clientX)
      : (this._deltaX = e.touches[0].clientX);
  }
  _end(e) {
    this._eventIsPointerPenTouch(e) &&
      (this._deltaX = e.clientX - this._deltaX),
      this._handleSwipe(),
      execute(this._config.endCallback);
  }
  _move(e) {
    this._deltaX =
      e.touches && e.touches.length > 1
        ? 0
        : e.touches[0].clientX - this._deltaX;
  }
  _handleSwipe() {
    const e = Math.abs(this._deltaX);
    if (e <= 40) return;
    const t = e / this._deltaX;
    (this._deltaX = 0),
      t &&
        execute(t > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    this._supportPointerEvents
      ? (EventHandler.on(this._element, EVENT_POINTERDOWN, (e) =>
          this._start(e)
        ),
        EventHandler.on(this._element, EVENT_POINTERUP, (e) => this._end(e)),
        this._element.classList.add("pointer-event"))
      : (EventHandler.on(this._element, EVENT_TOUCHSTART, (e) =>
          this._start(e)
        ),
        EventHandler.on(this._element, EVENT_TOUCHMOVE, (e) => this._move(e)),
        EventHandler.on(this._element, EVENT_TOUCHEND, (e) => this._end(e)));
  }
  _eventIsPointerPenTouch(e) {
    return (
      this._supportPointerEvents &&
      ("pen" === e.pointerType || "touch" === e.pointerType)
    );
  }
  static isSupported() {
    return (
      "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0
    );
  }
}
const NAME$c = "carousel",
  DATA_KEY$8 = "bs.carousel",
  EVENT_KEY$8 = ".bs.carousel",
  DATA_API_KEY$5 = ".data-api",
  ARROW_LEFT_KEY$1 = "ArrowLeft",
  ARROW_RIGHT_KEY$1 = "ArrowRight",
  TOUCHEVENT_COMPAT_WAIT = 500,
  ORDER_NEXT = "next",
  ORDER_PREV = "prev",
  DIRECTION_LEFT = "left",
  DIRECTION_RIGHT = "right",
  EVENT_SLIDE = "slide.bs.carousel",
  EVENT_SLID = "slid.bs.carousel",
  EVENT_KEYDOWN$1 = "keydown.bs.carousel",
  EVENT_MOUSEENTER$1 = "mouseenter.bs.carousel",
  EVENT_MOUSELEAVE$1 = "mouseleave.bs.carousel",
  EVENT_DRAG_START = "dragstart.bs.carousel",
  EVENT_LOAD_DATA_API$3 = "load.bs.carousel.data-api",
  EVENT_CLICK_DATA_API$5 = "click.bs.carousel.data-api",
  CLASS_NAME_CAROUSEL = "carousel",
  CLASS_NAME_ACTIVE$2 = "active",
  CLASS_NAME_SLIDE = "slide",
  CLASS_NAME_END = "carousel-item-end",
  CLASS_NAME_START = "carousel-item-start",
  CLASS_NAME_NEXT = "carousel-item-next",
  CLASS_NAME_PREV = "carousel-item-prev",
  SELECTOR_ACTIVE = ".active",
  SELECTOR_ITEM = ".carousel-item",
  SELECTOR_ACTIVE_ITEM = ".active.carousel-item",
  SELECTOR_ITEM_IMG = ".carousel-item img",
  SELECTOR_INDICATORS = ".carousel-indicators",
  SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]",
  SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]',
  KEY_TO_DIRECTION = { ArrowLeft: "right", ArrowRight: "left" },
  Default$b = {
    interval: 5e3,
    keyboard: !0,
    pause: "hover",
    ride: !1,
    touch: !0,
    wrap: !0,
  },
  DefaultType$b = {
    interval: "(number|boolean)",
    keyboard: "boolean",
    pause: "(string|boolean)",
    ride: "(boolean|string)",
    touch: "boolean",
    wrap: "boolean",
  };
class Carousel extends BaseComponent {
  constructor(e, t) {
    super(e, t),
      (this._interval = null),
      (this._activeElement = null),
      (this._isSliding = !1),
      (this.touchTimeout = null),
      (this._swipeHelper = null),
      (this._indicatorsElement = SelectorEngine.findOne(
        SELECTOR_INDICATORS,
        this._element
      )),
      this._addEventListeners(),
      "carousel" === this._config.ride && this.cycle();
  }
  static get Default() {
    return Default$b;
  }
  static get DefaultType() {
    return DefaultType$b;
  }
  static get NAME() {
    return NAME$c;
  }
  next() {
    this._slide("next");
  }
  nextWhenVisible() {
    !document.hidden && isVisible(this._element) && this.next();
  }
  prev() {
    this._slide("prev");
  }
  pause() {
    this._isSliding && triggerTransitionEnd(this._element),
      this._clearInterval();
  }
  cycle() {
    this._clearInterval(),
      this._updateInterval(),
      (this._interval = setInterval(
        () => this.nextWhenVisible(),
        this._config.interval
      ));
  }
  _maybeEnableCycle() {
    this._config.ride &&
      (this._isSliding
        ? EventHandler.one(this._element, EVENT_SLID, () => this.cycle())
        : this.cycle());
  }
  to(e) {
    const t = this._getItems();
    if (e > t.length - 1 || e < 0) return;
    if (this._isSliding)
      return void EventHandler.one(this._element, EVENT_SLID, () => this.to(e));
    const n = this._getItemIndex(this._getActive());
    if (n === e) return;
    const i = e > n ? "next" : "prev";
    this._slide(i, t[e]);
  }
  dispose() {
    this._swipeHelper && this._swipeHelper.dispose(), super.dispose();
  }
  _configAfterMerge(e) {
    return (e.defaultInterval = e.interval), e;
  }
  _addEventListeners() {
    this._config.keyboard &&
      EventHandler.on(this._element, EVENT_KEYDOWN$1, (e) => this._keydown(e)),
      "hover" === this._config.pause &&
        (EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause()),
        EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () =>
          this._maybeEnableCycle()
        )),
      this._config.touch &&
        Swipe.isSupported() &&
        this._addTouchEventListeners();
  }
  _addTouchEventListeners() {
    for (const e of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element))
      EventHandler.on(e, EVENT_DRAG_START, (e) => e.preventDefault());
    const e = {
      leftCallback: () => this._slide(this._directionToOrder("left")),
      rightCallback: () => this._slide(this._directionToOrder("right")),
      endCallback: () => {
        "hover" === this._config.pause &&
          (this.pause(),
          this.touchTimeout && clearTimeout(this.touchTimeout),
          (this.touchTimeout = setTimeout(
            () => this._maybeEnableCycle(),
            500 + this._config.interval
          )));
      },
    };
    this._swipeHelper = new Swipe(this._element, e);
  }
  _keydown(e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    const t = KEY_TO_DIRECTION[e.key];
    t && (e.preventDefault(), this._slide(this._directionToOrder(t)));
  }
  _getItemIndex(e) {
    return this._getItems().indexOf(e);
  }
  _setActiveIndicatorElement(e) {
    if (!this._indicatorsElement) return;
    const t = SelectorEngine.findOne(".active", this._indicatorsElement);
    t.classList.remove("active"), t.removeAttribute("aria-current");
    const n = SelectorEngine.findOne(
      `[data-bs-slide-to="${e}"]`,
      this._indicatorsElement
    );
    n && (n.classList.add("active"), n.setAttribute("aria-current", "true"));
  }
  _updateInterval() {
    const e = this._activeElement || this._getActive();
    if (!e) return;
    const t = Number.parseInt(e.getAttribute("data-bs-interval"), 10);
    this._config.interval = t || this._config.defaultInterval;
  }
  _slide(e, t = null) {
    if (this._isSliding) return;
    const n = this._getActive(),
      i = "next" === e,
      s = t || getNextActiveElement(this._getItems(), n, i, this._config.wrap);
    if (s === n) return;
    const o = this._getItemIndex(s),
      r = (t) =>
        EventHandler.trigger(this._element, t, {
          relatedTarget: s,
          direction: this._orderToDirection(e),
          from: this._getItemIndex(n),
          to: o,
        });
    if (r(EVENT_SLIDE).defaultPrevented) return;
    if (!n || !s) return;
    const a = Boolean(this._interval);
    this.pause(),
      (this._isSliding = !0),
      this._setActiveIndicatorElement(o),
      (this._activeElement = s);
    const l = i ? CLASS_NAME_START : CLASS_NAME_END,
      c = i ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    s.classList.add(c),
      reflow(s),
      n.classList.add(l),
      s.classList.add(l),
      this._queueCallback(
        () => {
          s.classList.remove(l, c),
            s.classList.add("active"),
            n.classList.remove("active", c, l),
            (this._isSliding = !1),
            r(EVENT_SLID);
        },
        n,
        this._isAnimated()
      ),
      a && this.cycle();
  }
  _isAnimated() {
    return this._element.classList.contains("slide");
  }
  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    this._interval && (clearInterval(this._interval), (this._interval = null));
  }
  _directionToOrder(e) {
    return isRTL()
      ? "left" === e
        ? "prev"
        : "next"
      : "left" === e
      ? "next"
      : "prev";
  }
  _orderToDirection(e) {
    return isRTL()
      ? "prev" === e
        ? "left"
        : "right"
      : "prev" === e
      ? "right"
      : "left";
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Carousel.getOrCreateInstance(this, e);
      if ("number" != typeof e) {
        if ("string" == typeof e) {
          if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
            throw new TypeError(`No method named "${e}"`);
          t[e]();
        }
      } else t.to(e);
    });
  }
}
EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$5,
  SELECTOR_DATA_SLIDE,
  function (e) {
    const t = SelectorEngine.getElementFromSelector(this);
    if (!t || !t.classList.contains("carousel")) return;
    e.preventDefault();
    const n = Carousel.getOrCreateInstance(t),
      i = this.getAttribute("data-bs-slide-to");
    return i
      ? (n.to(i), void n._maybeEnableCycle())
      : "next" === Manipulator.getDataAttribute(this, "slide")
      ? (n.next(), void n._maybeEnableCycle())
      : (n.prev(), void n._maybeEnableCycle());
  }
),
  EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
    const e = SelectorEngine.find(SELECTOR_DATA_RIDE);
    for (const t of e) Carousel.getOrCreateInstance(t);
  }),
  defineJQueryPlugin(Carousel);
const NAME$b = "collapse",
  DATA_KEY$7 = "bs.collapse",
  EVENT_KEY$7 = ".bs.collapse",
  DATA_API_KEY$4 = ".data-api",
  EVENT_SHOW$6 = "show.bs.collapse",
  EVENT_SHOWN$6 = "shown.bs.collapse",
  EVENT_HIDE$6 = "hide.bs.collapse",
  EVENT_HIDDEN$6 = "hidden.bs.collapse",
  EVENT_CLICK_DATA_API$4 = "click.bs.collapse.data-api",
  CLASS_NAME_SHOW$7 = "show",
  CLASS_NAME_COLLAPSE = "collapse",
  CLASS_NAME_COLLAPSING = "collapsing",
  CLASS_NAME_COLLAPSED = "collapsed",
  CLASS_NAME_DEEPER_CHILDREN = ":scope .collapse .collapse",
  CLASS_NAME_HORIZONTAL = "collapse-horizontal",
  WIDTH = "width",
  HEIGHT = "height",
  SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing",
  SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]',
  Default$a = { parent: null, toggle: !0 },
  DefaultType$a = { parent: "(null|element)", toggle: "boolean" };
class Collapse extends BaseComponent {
  constructor(e, t) {
    super(e, t), (this._isTransitioning = !1), (this._triggerArray = []);
    const n = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (const e of n) {
      const t = SelectorEngine.getSelectorFromElement(e),
        n = SelectorEngine.find(t).filter((e) => e === this._element);
      null !== t && n.length && this._triggerArray.push(e);
    }
    this._initializeChildren(),
      this._config.parent ||
        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown()),
      this._config.toggle && this.toggle();
  }
  static get Default() {
    return Default$a;
  }
  static get DefaultType() {
    return DefaultType$a;
  }
  static get NAME() {
    return NAME$b;
  }
  toggle() {
    this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (this._isTransitioning || this._isShown()) return;
    let e = [];
    if (
      (this._config.parent &&
        (e = this._getFirstLevelChildren(SELECTOR_ACTIVES)
          .filter((e) => e !== this._element)
          .map((e) => Collapse.getOrCreateInstance(e, { toggle: !1 }))),
      e.length && e[0]._isTransitioning)
    )
      return;
    if (EventHandler.trigger(this._element, EVENT_SHOW$6).defaultPrevented)
      return;
    for (const t of e) t.hide();
    const t = this._getDimension();
    this._element.classList.remove("collapse"),
      this._element.classList.add("collapsing"),
      (this._element.style[t] = 0),
      this._addAriaAndCollapsedClass(this._triggerArray, !0),
      (this._isTransitioning = !0);
    const n = `scroll${t[0].toUpperCase() + t.slice(1)}`;
    this._queueCallback(
      () => {
        (this._isTransitioning = !1),
          this._element.classList.remove("collapsing"),
          this._element.classList.add("collapse", "show"),
          (this._element.style[t] = ""),
          EventHandler.trigger(this._element, EVENT_SHOWN$6);
      },
      this._element,
      !0
    ),
      (this._element.style[t] = `${this._element[n]}px`);
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) return;
    if (EventHandler.trigger(this._element, EVENT_HIDE$6).defaultPrevented)
      return;
    const e = this._getDimension();
    (this._element.style[e] = `${this._element.getBoundingClientRect()[e]}px`),
      reflow(this._element),
      this._element.classList.add("collapsing"),
      this._element.classList.remove("collapse", "show");
    for (const e of this._triggerArray) {
      const t = SelectorEngine.getElementFromSelector(e);
      t && !this._isShown(t) && this._addAriaAndCollapsedClass([e], !1);
    }
    (this._isTransitioning = !0),
      (this._element.style[e] = ""),
      this._queueCallback(
        () => {
          (this._isTransitioning = !1),
            this._element.classList.remove("collapsing"),
            this._element.classList.add("collapse"),
            EventHandler.trigger(this._element, EVENT_HIDDEN$6);
        },
        this._element,
        !0
      );
  }
  _isShown(e = this._element) {
    return e.classList.contains("show");
  }
  _configAfterMerge(e) {
    return (e.toggle = Boolean(e.toggle)), (e.parent = getElement(e.parent)), e;
  }
  _getDimension() {
    return this._element.classList.contains("collapse-horizontal")
      ? WIDTH
      : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) return;
    const e = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
    for (const t of e) {
      const e = SelectorEngine.getElementFromSelector(t);
      e && this._addAriaAndCollapsedClass([t], this._isShown(e));
    }
  }
  _getFirstLevelChildren(e) {
    const t = SelectorEngine.find(
      CLASS_NAME_DEEPER_CHILDREN,
      this._config.parent
    );
    return SelectorEngine.find(e, this._config.parent).filter(
      (e) => !t.includes(e)
    );
  }
  _addAriaAndCollapsedClass(e, t) {
    if (e.length)
      for (const n of e)
        n.classList.toggle("collapsed", !t), n.setAttribute("aria-expanded", t);
  }
  static jQueryInterface(e) {
    const t = {};
    return (
      "string" == typeof e && /show|hide/.test(e) && (t.toggle = !1),
      this.each(function () {
        const n = Collapse.getOrCreateInstance(this, t);
        if ("string" == typeof e) {
          if (void 0 === n[e]) throw new TypeError(`No method named "${e}"`);
          n[e]();
        }
      })
    );
  }
}
EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$4,
  SELECTOR_DATA_TOGGLE$4,
  function (e) {
    ("A" === e.target.tagName ||
      (e.delegateTarget && "A" === e.delegateTarget.tagName)) &&
      e.preventDefault();
    for (const e of SelectorEngine.getMultipleElementsFromSelector(this))
      Collapse.getOrCreateInstance(e, { toggle: !1 }).toggle();
  }
),
  defineJQueryPlugin(Collapse);
const NAME$a = "dropdown",
  DATA_KEY$6 = "bs.dropdown",
  EVENT_KEY$6 = ".bs.dropdown",
  DATA_API_KEY$3 = ".data-api",
  ESCAPE_KEY$2 = "Escape",
  TAB_KEY$1 = "Tab",
  ARROW_UP_KEY$1 = "ArrowUp",
  ARROW_DOWN_KEY$1 = "ArrowDown",
  RIGHT_MOUSE_BUTTON = 2,
  EVENT_HIDE$5 = "hide.bs.dropdown",
  EVENT_HIDDEN$5 = "hidden.bs.dropdown",
  EVENT_SHOW$5 = "show.bs.dropdown",
  EVENT_SHOWN$5 = "shown.bs.dropdown",
  EVENT_CLICK_DATA_API$3 = "click.bs.dropdown.data-api",
  EVENT_KEYDOWN_DATA_API = "keydown.bs.dropdown.data-api",
  EVENT_KEYUP_DATA_API = "keyup.bs.dropdown.data-api",
  CLASS_NAME_SHOW$6 = "show",
  CLASS_NAME_DROPUP = "dropup",
  CLASS_NAME_DROPEND = "dropend",
  CLASS_NAME_DROPSTART = "dropstart",
  CLASS_NAME_DROPUP_CENTER = "dropup-center",
  CLASS_NAME_DROPDOWN_CENTER = "dropdown-center",
  SELECTOR_DATA_TOGGLE$3 =
    '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)',
  SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.show`,
  SELECTOR_MENU = ".dropdown-menu",
  SELECTOR_NAVBAR = ".navbar",
  SELECTOR_NAVBAR_NAV = ".navbar-nav",
  SELECTOR_VISIBLE_ITEMS =
    ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
  PLACEMENT_TOP = isRTL() ? "top-end" : "top-start",
  PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end",
  PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start",
  PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end",
  PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start",
  PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start",
  PLACEMENT_TOPCENTER = "top",
  PLACEMENT_BOTTOMCENTER = "bottom",
  Default$9 = {
    autoClose: !0,
    boundary: "clippingParents",
    display: "dynamic",
    offset: [0, 2],
    popperConfig: null,
    reference: "toggle",
  },
  DefaultType$9 = {
    autoClose: "(boolean|string)",
    boundary: "(string|element)",
    display: "string",
    offset: "(array|string|function)",
    popperConfig: "(null|object|function)",
    reference: "(string|element|object)",
  };
class Dropdown extends BaseComponent {
  constructor(e, t) {
    super(e, t),
      (this._popper = null),
      (this._parent = this._element.parentNode),
      (this._menu =
        SelectorEngine.next(this._element, SELECTOR_MENU)[0] ||
        SelectorEngine.prev(this._element, SELECTOR_MENU)[0] ||
        SelectorEngine.findOne(SELECTOR_MENU, this._parent)),
      (this._inNavbar = this._detectNavbar());
  }
  static get Default() {
    return Default$9;
  }
  static get DefaultType() {
    return DefaultType$9;
  }
  static get NAME() {
    return NAME$a;
  }
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) return;
    const e = { relatedTarget: this._element };
    if (
      !EventHandler.trigger(this._element, EVENT_SHOW$5, e).defaultPrevented
    ) {
      if (
        (this._createPopper(),
        "ontouchstart" in document.documentElement &&
          !this._parent.closest(".navbar-nav"))
      )
        for (const e of [].concat(...document.body.children))
          EventHandler.on(e, "mouseover", noop);
      this._element.focus(),
        this._element.setAttribute("aria-expanded", !0),
        this._menu.classList.add("show"),
        this._element.classList.add("show"),
        EventHandler.trigger(this._element, EVENT_SHOWN$5, e);
    }
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown()) return;
    const e = { relatedTarget: this._element };
    this._completeHide(e);
  }
  dispose() {
    this._popper && this._popper.destroy(), super.dispose();
  }
  update() {
    (this._inNavbar = this._detectNavbar()),
      this._popper && this._popper.update();
  }
  _completeHide(e) {
    if (
      !EventHandler.trigger(this._element, EVENT_HIDE$5, e).defaultPrevented
    ) {
      if ("ontouchstart" in document.documentElement)
        for (const e of [].concat(...document.body.children))
          EventHandler.off(e, "mouseover", noop);
      this._popper && this._popper.destroy(),
        this._menu.classList.remove("show"),
        this._element.classList.remove("show"),
        this._element.setAttribute("aria-expanded", "false"),
        Manipulator.removeDataAttribute(this._menu, "popper"),
        EventHandler.trigger(this._element, EVENT_HIDDEN$5, e);
    }
  }
  _getConfig(e) {
    if (
      "object" == typeof (e = super._getConfig(e)).reference &&
      !isElement(e.reference) &&
      "function" != typeof e.reference.getBoundingClientRect
    )
      throw new TypeError(
        `${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`
      );
    return e;
  }
  _createPopper() {
    if (void 0 === Popper)
      throw new TypeError(
        "Bootstrap's dropdowns require Popper (https://popper.js.org)"
      );
    let e = this._element;
    "parent" === this._config.reference
      ? (e = this._parent)
      : isElement(this._config.reference)
      ? (e = getElement(this._config.reference))
      : "object" == typeof this._config.reference &&
        (e = this._config.reference);
    const t = this._getPopperConfig();
    this._popper = Popper.createPopper(e, this._menu, t);
  }
  _isShown() {
    return this._menu.classList.contains("show");
  }
  _getPlacement() {
    const e = this._parent;
    if (e.classList.contains("dropend")) return PLACEMENT_RIGHT;
    if (e.classList.contains("dropstart")) return PLACEMENT_LEFT;
    if (e.classList.contains("dropup-center")) return "top";
    if (e.classList.contains("dropdown-center")) return "bottom";
    const t =
      "end" ===
      getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();
    return e.classList.contains("dropup")
      ? t
        ? PLACEMENT_TOPEND
        : PLACEMENT_TOP
      : t
      ? PLACEMENT_BOTTOMEND
      : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return null !== this._element.closest(".navbar");
  }
  _getOffset() {
    const { offset: e } = this._config;
    return "string" == typeof e
      ? e.split(",").map((e) => Number.parseInt(e, 10))
      : "function" == typeof e
      ? (t) => e(t, this._element)
      : e;
  }
  _getPopperConfig() {
    const e = {
      placement: this._getPlacement(),
      modifiers: [
        {
          name: "preventOverflow",
          options: { boundary: this._config.boundary },
        },
        { name: "offset", options: { offset: this._getOffset() } },
      ],
    };
    return (
      (this._inNavbar || "static" === this._config.display) &&
        (Manipulator.setDataAttribute(this._menu, "popper", "static"),
        (e.modifiers = [{ name: "applyStyles", enabled: !1 }])),
      { ...e, ...execute(this._config.popperConfig, [e]) }
    );
  }
  _selectMenuItem({ key: e, target: t }) {
    const n = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(
      (e) => isVisible(e)
    );
    n.length &&
      getNextActiveElement(
        n,
        t,
        e === ARROW_DOWN_KEY$1,
        !n.includes(t)
      ).focus();
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Dropdown.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === t[e]) throw new TypeError(`No method named "${e}"`);
        t[e]();
      }
    });
  }
  static clearMenus(e) {
    if (2 === e.button || ("keyup" === e.type && "Tab" !== e.key)) return;
    const t = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
    for (const n of t) {
      const t = Dropdown.getInstance(n);
      if (!t || !1 === t._config.autoClose) continue;
      const i = e.composedPath(),
        s = i.includes(t._menu);
      if (
        i.includes(t._element) ||
        ("inside" === t._config.autoClose && !s) ||
        ("outside" === t._config.autoClose && s)
      )
        continue;
      if (
        t._menu.contains(e.target) &&
        (("keyup" === e.type && "Tab" === e.key) ||
          /input|select|option|textarea|form/i.test(e.target.tagName))
      )
        continue;
      const o = { relatedTarget: t._element };
      "click" === e.type && (o.clickEvent = e), t._completeHide(o);
    }
  }
  static dataApiKeydownHandler(e) {
    const t = /input|textarea/i.test(e.target.tagName),
      n = "Escape" === e.key,
      i = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(e.key);
    if (!i && !n) return;
    if (t && !n) return;
    e.preventDefault();
    const s = this.matches(SELECTOR_DATA_TOGGLE$3)
        ? this
        : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] ||
          SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] ||
          SelectorEngine.findOne(
            SELECTOR_DATA_TOGGLE$3,
            e.delegateTarget.parentNode
          ),
      o = Dropdown.getOrCreateInstance(s);
    if (i) return e.stopPropagation(), o.show(), void o._selectMenuItem(e);
    o._isShown() && (e.stopPropagation(), o.hide(), s.focus());
  }
}
EventHandler.on(
  document,
  EVENT_KEYDOWN_DATA_API,
  SELECTOR_DATA_TOGGLE$3,
  Dropdown.dataApiKeydownHandler
),
  EventHandler.on(
    document,
    EVENT_KEYDOWN_DATA_API,
    SELECTOR_MENU,
    Dropdown.dataApiKeydownHandler
  ),
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus),
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus),
  EventHandler.on(
    document,
    EVENT_CLICK_DATA_API$3,
    SELECTOR_DATA_TOGGLE$3,
    function (e) {
      e.preventDefault(), Dropdown.getOrCreateInstance(this).toggle();
    }
  ),
  defineJQueryPlugin(Dropdown);
const SELECTOR_FIXED_CONTENT =
    ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
  SELECTOR_STICKY_CONTENT = ".sticky-top",
  PROPERTY_PADDING = "padding-right",
  PROPERTY_MARGIN = "margin-right";
class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }
  getWidth() {
    const e = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - e);
  }
  hide() {
    const e = this.getWidth();
    this._disableOverFlow(),
      this._setElementAttributes(this._element, "padding-right", (t) => t + e),
      this._setElementAttributes(
        SELECTOR_FIXED_CONTENT,
        "padding-right",
        (t) => t + e
      ),
      this._setElementAttributes(".sticky-top", "margin-right", (t) => t - e);
  }
  reset() {
    this._resetElementAttributes(this._element, "overflow"),
      this._resetElementAttributes(this._element, "padding-right"),
      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, "padding-right"),
      this._resetElementAttributes(".sticky-top", "margin-right");
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow"),
      (this._element.style.overflow = "hidden");
  }
  _setElementAttributes(e, t, n) {
    const i = this.getWidth();
    this._applyManipulationCallback(e, (e) => {
      if (e !== this._element && window.innerWidth > e.clientWidth + i) return;
      this._saveInitialAttribute(e, t);
      const s = window.getComputedStyle(e).getPropertyValue(t);
      e.style.setProperty(t, `${n(Number.parseFloat(s))}px`);
    });
  }
  _saveInitialAttribute(e, t) {
    const n = e.style.getPropertyValue(t);
    n && Manipulator.setDataAttribute(e, t, n);
  }
  _resetElementAttributes(e, t) {
    this._applyManipulationCallback(e, (e) => {
      const n = Manipulator.getDataAttribute(e, t);
      null !== n
        ? (Manipulator.removeDataAttribute(e, t), e.style.setProperty(t, n))
        : e.style.removeProperty(t);
    });
  }
  _applyManipulationCallback(e, t) {
    if (isElement(e)) t(e);
    else for (const n of SelectorEngine.find(e, this._element)) t(n);
  }
}
const NAME$9 = "backdrop",
  CLASS_NAME_FADE$4 = "fade",
  CLASS_NAME_SHOW$5 = "show",
  EVENT_MOUSEDOWN = "mousedown.bs.backdrop",
  Default$8 = {
    className: "modal-backdrop",
    clickCallback: null,
    isAnimated: !1,
    isVisible: !0,
    rootElement: "body",
  },
  DefaultType$8 = {
    className: "string",
    clickCallback: "(function|null)",
    isAnimated: "boolean",
    isVisible: "boolean",
    rootElement: "(element|string)",
  };
class Backdrop extends Config {
  constructor(e) {
    super(),
      (this._config = this._getConfig(e)),
      (this._isAppended = !1),
      (this._element = null);
  }
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }
  show(e) {
    if (!this._config.isVisible) return void execute(e);
    this._append();
    const t = this._getElement();
    this._config.isAnimated && reflow(t),
      t.classList.add("show"),
      this._emulateAnimation(() => {
        execute(e);
      });
  }
  hide(e) {
    this._config.isVisible
      ? (this._getElement().classList.remove("show"),
        this._emulateAnimation(() => {
          this.dispose(), execute(e);
        }))
      : execute(e);
  }
  dispose() {
    this._isAppended &&
      (EventHandler.off(this._element, EVENT_MOUSEDOWN),
      this._element.remove(),
      (this._isAppended = !1));
  }
  _getElement() {
    if (!this._element) {
      const e = document.createElement("div");
      (e.className = this._config.className),
        this._config.isAnimated && e.classList.add("fade"),
        (this._element = e);
    }
    return this._element;
  }
  _configAfterMerge(e) {
    return (e.rootElement = getElement(e.rootElement)), e;
  }
  _append() {
    if (this._isAppended) return;
    const e = this._getElement();
    this._config.rootElement.append(e),
      EventHandler.on(e, EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      }),
      (this._isAppended = !0);
  }
  _emulateAnimation(e) {
    executeAfterTransition(e, this._getElement(), this._config.isAnimated);
  }
}
const NAME$8 = "focustrap",
  DATA_KEY$5 = "bs.focustrap",
  EVENT_KEY$5 = ".bs.focustrap",
  EVENT_FOCUSIN$2 = "focusin.bs.focustrap",
  EVENT_KEYDOWN_TAB = "keydown.tab.bs.focustrap",
  TAB_KEY = "Tab",
  TAB_NAV_FORWARD = "forward",
  TAB_NAV_BACKWARD = "backward",
  Default$7 = { autofocus: !0, trapElement: null },
  DefaultType$7 = { autofocus: "boolean", trapElement: "element" };
class FocusTrap extends Config {
  constructor(e) {
    super(),
      (this._config = this._getConfig(e)),
      (this._isActive = !1),
      (this._lastTabNavDirection = null);
  }
  static get Default() {
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
  }
  activate() {
    this._isActive ||
      (this._config.autofocus && this._config.trapElement.focus(),
      EventHandler.off(document, EVENT_KEY$5),
      EventHandler.on(document, EVENT_FOCUSIN$2, (e) => this._handleFocusin(e)),
      EventHandler.on(document, EVENT_KEYDOWN_TAB, (e) =>
        this._handleKeydown(e)
      ),
      (this._isActive = !0));
  }
  deactivate() {
    this._isActive &&
      ((this._isActive = !1), EventHandler.off(document, EVENT_KEY$5));
  }
  _handleFocusin(e) {
    const { trapElement: t } = this._config;
    if (e.target === document || e.target === t || t.contains(e.target)) return;
    const n = SelectorEngine.focusableChildren(t);
    0 === n.length
      ? t.focus()
      : "backward" === this._lastTabNavDirection
      ? n[n.length - 1].focus()
      : n[0].focus();
  }
  _handleKeydown(e) {
    "Tab" === e.key &&
      (this._lastTabNavDirection = e.shiftKey ? "backward" : "forward");
  }
}
const NAME$7 = "modal",
  DATA_KEY$4 = "bs.modal",
  EVENT_KEY$4 = ".bs.modal",
  DATA_API_KEY$2 = ".data-api",
  ESCAPE_KEY$1 = "Escape",
  EVENT_HIDE$4 = "hide.bs.modal",
  EVENT_HIDE_PREVENTED$1 = "hidePrevented.bs.modal",
  EVENT_HIDDEN$4 = "hidden.bs.modal",
  EVENT_SHOW$4 = "show.bs.modal",
  EVENT_SHOWN$4 = "shown.bs.modal",
  EVENT_RESIZE$1 = "resize.bs.modal",
  EVENT_CLICK_DISMISS = "click.dismiss.bs.modal",
  EVENT_MOUSEDOWN_DISMISS = "mousedown.dismiss.bs.modal",
  EVENT_KEYDOWN_DISMISS$1 = "keydown.dismiss.bs.modal",
  EVENT_CLICK_DATA_API$2 = "click.bs.modal.data-api",
  CLASS_NAME_OPEN = "modal-open",
  CLASS_NAME_FADE$3 = "fade",
  CLASS_NAME_SHOW$4 = "show",
  CLASS_NAME_STATIC = "modal-static",
  OPEN_SELECTOR$1 = ".modal.show",
  SELECTOR_DIALOG = ".modal-dialog",
  SELECTOR_MODAL_BODY = ".modal-body",
  SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]',
  Default$6 = { backdrop: !0, focus: !0, keyboard: !0 },
  DefaultType$6 = {
    backdrop: "(boolean|string)",
    focus: "boolean",
    keyboard: "boolean",
  };
class Modal extends BaseComponent {
  constructor(e, t) {
    super(e, t),
      (this._dialog = SelectorEngine.findOne(".modal-dialog", this._element)),
      (this._backdrop = this._initializeBackDrop()),
      (this._focustrap = this._initializeFocusTrap()),
      (this._isShown = !1),
      (this._isTransitioning = !1),
      (this._scrollBar = new ScrollBarHelper()),
      this._addEventListeners();
  }
  static get Default() {
    return Default$6;
  }
  static get DefaultType() {
    return DefaultType$6;
  }
  static get NAME() {
    return NAME$7;
  }
  toggle(e) {
    return this._isShown ? this.hide() : this.show(e);
  }
  show(e) {
    this._isShown ||
      this._isTransitioning ||
      EventHandler.trigger(this._element, EVENT_SHOW$4, { relatedTarget: e })
        .defaultPrevented ||
      ((this._isShown = !0),
      (this._isTransitioning = !0),
      this._scrollBar.hide(),
      document.body.classList.add("modal-open"),
      this._adjustDialog(),
      this._backdrop.show(() => this._showElement(e)));
  }
  hide() {
    this._isShown &&
      !this._isTransitioning &&
      (EventHandler.trigger(this._element, EVENT_HIDE$4).defaultPrevented ||
        ((this._isShown = !1),
        (this._isTransitioning = !0),
        this._focustrap.deactivate(),
        this._element.classList.remove("show"),
        this._queueCallback(
          () => this._hideModal(),
          this._element,
          this._isAnimated()
        )));
  }
  dispose() {
    for (const e of [window, this._dialog]) EventHandler.off(e, ".bs.modal");
    this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      isAnimated: this._isAnimated(),
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({ trapElement: this._element });
  }
  _showElement(e) {
    document.body.contains(this._element) ||
      document.body.append(this._element),
      (this._element.style.display = "block"),
      this._element.removeAttribute("aria-hidden"),
      this._element.setAttribute("aria-modal", !0),
      this._element.setAttribute("role", "dialog"),
      (this._element.scrollTop = 0);
    const t = SelectorEngine.findOne(".modal-body", this._dialog);
    t && (t.scrollTop = 0),
      reflow(this._element),
      this._element.classList.add("show"),
      this._queueCallback(
        () => {
          this._config.focus && this._focustrap.activate(),
            (this._isTransitioning = !1),
            EventHandler.trigger(this._element, EVENT_SHOWN$4, {
              relatedTarget: e,
            });
        },
        this._dialog,
        this._isAnimated()
      );
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (e) => {
      if ("Escape" === e.key)
        return this._config.keyboard
          ? (e.preventDefault(), void this.hide())
          : void this._triggerBackdropTransition();
    }),
      EventHandler.on(window, EVENT_RESIZE$1, () => {
        this._isShown && !this._isTransitioning && this._adjustDialog();
      }),
      EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (e) => {
        EventHandler.one(this._element, EVENT_CLICK_DISMISS, (t) => {
          this._element === e.target &&
            this._element === t.target &&
            ("static" !== this._config.backdrop
              ? this._config.backdrop && this.hide()
              : this._triggerBackdropTransition());
        });
      });
  }
  _hideModal() {
    (this._element.style.display = "none"),
      this._element.setAttribute("aria-hidden", !0),
      this._element.removeAttribute("aria-modal"),
      this._element.removeAttribute("role"),
      (this._isTransitioning = !1),
      this._backdrop.hide(() => {
        document.body.classList.remove("modal-open"),
          this._resetAdjustments(),
          this._scrollBar.reset(),
          EventHandler.trigger(this._element, EVENT_HIDDEN$4);
      });
  }
  _isAnimated() {
    return this._element.classList.contains("fade");
  }
  _triggerBackdropTransition() {
    if (
      EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1)
        .defaultPrevented
    )
      return;
    const e =
        this._element.scrollHeight > document.documentElement.clientHeight,
      t = this._element.style.overflowY;
    "hidden" === t ||
      this._element.classList.contains("modal-static") ||
      (e || (this._element.style.overflowY = "hidden"),
      this._element.classList.add("modal-static"),
      this._queueCallback(() => {
        this._element.classList.remove("modal-static"),
          this._queueCallback(() => {
            this._element.style.overflowY = t;
          }, this._dialog);
      }, this._dialog),
      this._element.focus());
  }
  _adjustDialog() {
    const e =
        this._element.scrollHeight > document.documentElement.clientHeight,
      t = this._scrollBar.getWidth(),
      n = t > 0;
    if (n && !e) {
      const e = isRTL() ? "paddingLeft" : "paddingRight";
      this._element.style[e] = `${t}px`;
    }
    if (!n && e) {
      const e = isRTL() ? "paddingRight" : "paddingLeft";
      this._element.style[e] = `${t}px`;
    }
  }
  _resetAdjustments() {
    (this._element.style.paddingLeft = ""),
      (this._element.style.paddingRight = "");
  }
  static jQueryInterface(e, t) {
    return this.each(function () {
      const n = Modal.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === n[e]) throw new TypeError(`No method named "${e}"`);
        n[e](t);
      }
    });
  }
}
EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$2,
  SELECTOR_DATA_TOGGLE$2,
  function (e) {
    const t = SelectorEngine.getElementFromSelector(this);
    ["A", "AREA"].includes(this.tagName) && e.preventDefault(),
      EventHandler.one(t, EVENT_SHOW$4, (e) => {
        e.defaultPrevented ||
          EventHandler.one(t, EVENT_HIDDEN$4, () => {
            isVisible(this) && this.focus();
          });
      });
    const n = SelectorEngine.findOne(".modal.show");
    n && Modal.getInstance(n).hide(), Modal.getOrCreateInstance(t).toggle(this);
  }
),
  enableDismissTrigger(Modal),
  defineJQueryPlugin(Modal);
const NAME$6 = "offcanvas",
  DATA_KEY$3 = "bs.offcanvas",
  EVENT_KEY$3 = ".bs.offcanvas",
  DATA_API_KEY$1 = ".data-api",
  EVENT_LOAD_DATA_API$2 = "load.bs.offcanvas.data-api",
  ESCAPE_KEY = "Escape",
  CLASS_NAME_SHOW$3 = "show",
  CLASS_NAME_SHOWING$1 = "showing",
  CLASS_NAME_HIDING = "hiding",
  CLASS_NAME_BACKDROP = "offcanvas-backdrop",
  OPEN_SELECTOR = ".offcanvas.show",
  EVENT_SHOW$3 = "show.bs.offcanvas",
  EVENT_SHOWN$3 = "shown.bs.offcanvas",
  EVENT_HIDE$3 = "hide.bs.offcanvas",
  EVENT_HIDE_PREVENTED = "hidePrevented.bs.offcanvas",
  EVENT_HIDDEN$3 = "hidden.bs.offcanvas",
  EVENT_RESIZE = "resize.bs.offcanvas",
  EVENT_CLICK_DATA_API$1 = "click.bs.offcanvas.data-api",
  EVENT_KEYDOWN_DISMISS = "keydown.dismiss.bs.offcanvas",
  SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]',
  Default$5 = { backdrop: !0, keyboard: !0, scroll: !1 },
  DefaultType$5 = {
    backdrop: "(boolean|string)",
    keyboard: "boolean",
    scroll: "boolean",
  };
class Offcanvas extends BaseComponent {
  constructor(e, t) {
    super(e, t),
      (this._isShown = !1),
      (this._backdrop = this._initializeBackDrop()),
      (this._focustrap = this._initializeFocusTrap()),
      this._addEventListeners();
  }
  static get Default() {
    return Default$5;
  }
  static get DefaultType() {
    return DefaultType$5;
  }
  static get NAME() {
    return NAME$6;
  }
  toggle(e) {
    return this._isShown ? this.hide() : this.show(e);
  }
  show(e) {
    this._isShown ||
      EventHandler.trigger(this._element, EVENT_SHOW$3, { relatedTarget: e })
        .defaultPrevented ||
      ((this._isShown = !0),
      this._backdrop.show(),
      this._config.scroll || new ScrollBarHelper().hide(),
      this._element.setAttribute("aria-modal", !0),
      this._element.setAttribute("role", "dialog"),
      this._element.classList.add("showing"),
      this._queueCallback(
        () => {
          (this._config.scroll && !this._config.backdrop) ||
            this._focustrap.activate(),
            this._element.classList.add("show"),
            this._element.classList.remove("showing"),
            EventHandler.trigger(this._element, EVENT_SHOWN$3, {
              relatedTarget: e,
            });
        },
        this._element,
        !0
      ));
  }
  hide() {
    this._isShown &&
      (EventHandler.trigger(this._element, EVENT_HIDE$3).defaultPrevented ||
        (this._focustrap.deactivate(),
        this._element.blur(),
        (this._isShown = !1),
        this._element.classList.add("hiding"),
        this._backdrop.hide(),
        this._queueCallback(
          () => {
            this._element.classList.remove("show", "hiding"),
              this._element.removeAttribute("aria-modal"),
              this._element.removeAttribute("role"),
              this._config.scroll || new ScrollBarHelper().reset(),
              EventHandler.trigger(this._element, EVENT_HIDDEN$3);
          },
          this._element,
          !0
        )));
  }
  dispose() {
    this._backdrop.dispose(), this._focustrap.deactivate(), super.dispose();
  }
  _initializeBackDrop() {
    const e = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible: e,
      isAnimated: !0,
      rootElement: this._element.parentNode,
      clickCallback: e
        ? () => {
            "static" !== this._config.backdrop
              ? this.hide()
              : EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
          }
        : null,
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({ trapElement: this._element });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (e) => {
      "Escape" === e.key &&
        (this._config.keyboard
          ? this.hide()
          : EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED));
    });
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Offcanvas.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
          throw new TypeError(`No method named "${e}"`);
        t[e](this);
      }
    });
  }
}
EventHandler.on(
  document,
  EVENT_CLICK_DATA_API$1,
  SELECTOR_DATA_TOGGLE$1,
  function (e) {
    const t = SelectorEngine.getElementFromSelector(this);
    if (
      (["A", "AREA"].includes(this.tagName) && e.preventDefault(),
      isDisabled(this))
    )
      return;
    EventHandler.one(t, EVENT_HIDDEN$3, () => {
      isVisible(this) && this.focus();
    });
    const n = SelectorEngine.findOne(OPEN_SELECTOR);
    n && n !== t && Offcanvas.getInstance(n).hide(),
      Offcanvas.getOrCreateInstance(t).toggle(this);
  }
),
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    for (const e of SelectorEngine.find(OPEN_SELECTOR))
      Offcanvas.getOrCreateInstance(e).show();
  }),
  EventHandler.on(window, EVENT_RESIZE, () => {
    for (const e of SelectorEngine.find(
      "[aria-modal][class*=show][class*=offcanvas-]"
    ))
      "fixed" !== getComputedStyle(e).position &&
        Offcanvas.getOrCreateInstance(e).hide();
  }),
  enableDismissTrigger(Offcanvas),
  defineJQueryPlugin(Offcanvas);
const uriAttributes = new Set([
    "background",
    "cite",
    "href",
    "itemtype",
    "longdesc",
    "poster",
    "src",
    "xlink:href",
  ]),
  ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i,
  SAFE_URL_PATTERN =
    /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i,
  DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,
  allowedAttribute = (e, t) => {
    const n = e.nodeName.toLowerCase();
    return t.includes(n)
      ? !uriAttributes.has(n) ||
          Boolean(
            SAFE_URL_PATTERN.test(e.nodeValue) ||
              DATA_URL_PATTERN.test(e.nodeValue)
          )
      : t.filter((e) => e instanceof RegExp).some((e) => e.test(n));
  },
  DefaultAllowlist = {
    "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
    a: ["target", "href", "title", "rel"],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ["src", "srcset", "alt", "title", "width", "height"],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: [],
  };
function sanitizeHtml(e, t, n) {
  if (!e.length) return e;
  if (n && "function" == typeof n) return n(e);
  const i = new window.DOMParser().parseFromString(e, "text/html"),
    s = [].concat(...i.body.querySelectorAll("*"));
  for (const e of s) {
    const n = e.nodeName.toLowerCase();
    if (!Object.keys(t).includes(n)) {
      e.remove();
      continue;
    }
    const i = [].concat(...e.attributes),
      s = [].concat(t["*"] || [], t[n] || []);
    for (const t of i) allowedAttribute(t, s) || e.removeAttribute(t.nodeName);
  }
  return i.body.innerHTML;
}
const NAME$5 = "TemplateFactory",
  Default$4 = {
    allowList: DefaultAllowlist,
    content: {},
    extraClass: "",
    html: !1,
    sanitize: !0,
    sanitizeFn: null,
    template: "<div></div>",
  },
  DefaultType$4 = {
    allowList: "object",
    content: "object",
    extraClass: "(string|function)",
    html: "boolean",
    sanitize: "boolean",
    sanitizeFn: "(null|function)",
    template: "string",
  },
  DefaultContentType = {
    entry: "(string|element|function|null)",
    selector: "(string|element)",
  };
class TemplateFactory extends Config {
  constructor(e) {
    super(), (this._config = this._getConfig(e));
  }
  static get Default() {
    return Default$4;
  }
  static get DefaultType() {
    return DefaultType$4;
  }
  static get NAME() {
    return NAME$5;
  }
  getContent() {
    return Object.values(this._config.content)
      .map((e) => this._resolvePossibleFunction(e))
      .filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(e) {
    return (
      this._checkContent(e),
      (this._config.content = { ...this._config.content, ...e }),
      this
    );
  }
  toHtml() {
    const e = document.createElement("div");
    e.innerHTML = this._maybeSanitize(this._config.template);
    for (const [t, n] of Object.entries(this._config.content))
      this._setContent(e, n, t);
    const t = e.children[0],
      n = this._resolvePossibleFunction(this._config.extraClass);
    return n && t.classList.add(...n.split(" ")), t;
  }
  _typeCheckConfig(e) {
    super._typeCheckConfig(e), this._checkContent(e.content);
  }
  _checkContent(e) {
    for (const [t, n] of Object.entries(e))
      super._typeCheckConfig({ selector: t, entry: n }, DefaultContentType);
  }
  _setContent(e, t, n) {
    const i = SelectorEngine.findOne(n, e);
    i &&
      ((t = this._resolvePossibleFunction(t))
        ? isElement(t)
          ? this._putElementInTemplate(getElement(t), i)
          : this._config.html
          ? (i.innerHTML = this._maybeSanitize(t))
          : (i.textContent = t)
        : i.remove());
  }
  _maybeSanitize(e) {
    return this._config.sanitize
      ? sanitizeHtml(e, this._config.allowList, this._config.sanitizeFn)
      : e;
  }
  _resolvePossibleFunction(e) {
    return execute(e, [this]);
  }
  _putElementInTemplate(e, t) {
    if (this._config.html) return (t.innerHTML = ""), void t.append(e);
    t.textContent = e.textContent;
  }
}
const NAME$4 = "tooltip",
  DISALLOWED_ATTRIBUTES = new Set(["sanitize", "allowList", "sanitizeFn"]),
  CLASS_NAME_FADE$2 = "fade",
  CLASS_NAME_MODAL = "modal",
  CLASS_NAME_SHOW$2 = "show",
  SELECTOR_TOOLTIP_INNER = ".tooltip-inner",
  SELECTOR_MODAL = ".modal",
  EVENT_MODAL_HIDE = "hide.bs.modal",
  TRIGGER_HOVER = "hover",
  TRIGGER_FOCUS = "focus",
  TRIGGER_CLICK = "click",
  TRIGGER_MANUAL = "manual",
  EVENT_HIDE$2 = "hide",
  EVENT_HIDDEN$2 = "hidden",
  EVENT_SHOW$2 = "show",
  EVENT_SHOWN$2 = "shown",
  EVENT_INSERTED = "inserted",
  EVENT_CLICK$1 = "click",
  EVENT_FOCUSIN$1 = "focusin",
  EVENT_FOCUSOUT$1 = "focusout",
  EVENT_MOUSEENTER = "mouseenter",
  EVENT_MOUSELEAVE = "mouseleave",
  AttachmentMap = {
    AUTO: "auto",
    TOP: "top",
    RIGHT: isRTL() ? "left" : "right",
    BOTTOM: "bottom",
    LEFT: isRTL() ? "right" : "left",
  },
  Default$3 = {
    allowList: DefaultAllowlist,
    animation: !0,
    boundary: "clippingParents",
    container: !1,
    customClass: "",
    delay: 0,
    fallbackPlacements: ["top", "right", "bottom", "left"],
    html: !1,
    offset: [0, 0],
    placement: "top",
    popperConfig: null,
    sanitize: !0,
    sanitizeFn: null,
    selector: !1,
    template:
      '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    title: "",
    trigger: "hover focus",
  },
  DefaultType$3 = {
    allowList: "object",
    animation: "boolean",
    boundary: "(string|element)",
    container: "(string|element|boolean)",
    customClass: "(string|function)",
    delay: "(number|object)",
    fallbackPlacements: "array",
    html: "boolean",
    offset: "(array|string|function)",
    placement: "(string|function)",
    popperConfig: "(null|object|function)",
    sanitize: "boolean",
    sanitizeFn: "(null|function)",
    selector: "(string|boolean)",
    template: "string",
    title: "(string|element|function)",
    trigger: "string",
  };
class Tooltip extends BaseComponent {
  constructor(e, t) {
    if (void 0 === Popper)
      throw new TypeError(
        "Bootstrap's tooltips require Popper (https://popper.js.org)"
      );
    super(e, t),
      (this._isEnabled = !0),
      (this._timeout = 0),
      (this._isHovered = null),
      (this._activeTrigger = {}),
      (this._popper = null),
      (this._templateFactory = null),
      (this._newContent = null),
      (this.tip = null),
      this._setListeners(),
      this._config.selector || this._fixTitle();
  }
  static get Default() {
    return Default$3;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  static get NAME() {
    return NAME$4;
  }
  enable() {
    this._isEnabled = !0;
  }
  disable() {
    this._isEnabled = !1;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    this._isEnabled &&
      ((this._activeTrigger.click = !this._activeTrigger.click),
      this._isShown() ? this._leave() : this._enter());
  }
  dispose() {
    clearTimeout(this._timeout),
      EventHandler.off(
        this._element.closest(".modal"),
        "hide.bs.modal",
        this._hideModalHandler
      ),
      this._element.getAttribute("data-bs-original-title") &&
        this._element.setAttribute(
          "title",
          this._element.getAttribute("data-bs-original-title")
        ),
      this._disposePopper(),
      super.dispose();
  }
  show() {
    if ("none" === this._element.style.display)
      throw new Error("Please use show on visible elements");
    if (!this._isWithContent() || !this._isEnabled) return;
    const e = EventHandler.trigger(
        this._element,
        this.constructor.eventName("show")
      ),
      t = (
        findShadowRoot(this._element) ||
        this._element.ownerDocument.documentElement
      ).contains(this._element);
    if (e.defaultPrevented || !t) return;
    this._disposePopper();
    const n = this._getTipElement();
    this._element.setAttribute("aria-describedby", n.getAttribute("id"));
    const { container: i } = this._config;
    if (
      (this._element.ownerDocument.documentElement.contains(this.tip) ||
        (i.append(n),
        EventHandler.trigger(
          this._element,
          this.constructor.eventName("inserted")
        )),
      (this._popper = this._createPopper(n)),
      n.classList.add("show"),
      "ontouchstart" in document.documentElement)
    )
      for (const e of [].concat(...document.body.children))
        EventHandler.on(e, "mouseover", noop);
    this._queueCallback(
      () => {
        EventHandler.trigger(
          this._element,
          this.constructor.eventName("shown")
        ),
          !1 === this._isHovered && this._leave(),
          (this._isHovered = !1);
      },
      this.tip,
      this._isAnimated()
    );
  }
  hide() {
    if (
      this._isShown() &&
      !EventHandler.trigger(this._element, this.constructor.eventName("hide"))
        .defaultPrevented
    ) {
      if (
        (this._getTipElement().classList.remove("show"),
        "ontouchstart" in document.documentElement)
      )
        for (const e of [].concat(...document.body.children))
          EventHandler.off(e, "mouseover", noop);
      (this._activeTrigger.click = !1),
        (this._activeTrigger.focus = !1),
        (this._activeTrigger.hover = !1),
        (this._isHovered = null),
        this._queueCallback(
          () => {
            this._isWithActiveTrigger() ||
              (this._isHovered || this._disposePopper(),
              this._element.removeAttribute("aria-describedby"),
              EventHandler.trigger(
                this._element,
                this.constructor.eventName("hidden")
              ));
          },
          this.tip,
          this._isAnimated()
        );
    }
  }
  update() {
    this._popper && this._popper.update();
  }
  _isWithContent() {
    return Boolean(this._getTitle());
  }
  _getTipElement() {
    return (
      this.tip ||
        (this.tip = this._createTipElement(
          this._newContent || this._getContentForTemplate()
        )),
      this.tip
    );
  }
  _createTipElement(e) {
    const t = this._getTemplateFactory(e).toHtml();
    if (!t) return null;
    t.classList.remove("fade", "show"),
      t.classList.add(`bs-${this.constructor.NAME}-auto`);
    const n = getUID(this.constructor.NAME).toString();
    return (
      t.setAttribute("id", n), this._isAnimated() && t.classList.add("fade"), t
    );
  }
  setContent(e) {
    (this._newContent = e),
      this._isShown() && (this._disposePopper(), this.show());
  }
  _getTemplateFactory(e) {
    return (
      this._templateFactory
        ? this._templateFactory.changeContent(e)
        : (this._templateFactory = new TemplateFactory({
            ...this._config,
            content: e,
            extraClass: this._resolvePossibleFunction(this._config.customClass),
          })),
      this._templateFactory
    );
  }
  _getContentForTemplate() {
    return { ".tooltip-inner": this._getTitle() };
  }
  _getTitle() {
    return (
      this._resolvePossibleFunction(this._config.title) ||
      this._element.getAttribute("data-bs-original-title")
    );
  }
  _initializeOnDelegatedTarget(e) {
    return this.constructor.getOrCreateInstance(
      e.delegateTarget,
      this._getDelegateConfig()
    );
  }
  _isAnimated() {
    return (
      this._config.animation ||
      (this.tip && this.tip.classList.contains("fade"))
    );
  }
  _isShown() {
    return this.tip && this.tip.classList.contains("show");
  }
  _createPopper(e) {
    const t = execute(this._config.placement, [this, e, this._element]),
      n = AttachmentMap[t.toUpperCase()];
    return Popper.createPopper(this._element, e, this._getPopperConfig(n));
  }
  _getOffset() {
    const { offset: e } = this._config;
    return "string" == typeof e
      ? e.split(",").map((e) => Number.parseInt(e, 10))
      : "function" == typeof e
      ? (t) => e(t, this._element)
      : e;
  }
  _resolvePossibleFunction(e) {
    return execute(e, [this._element]);
  }
  _getPopperConfig(e) {
    const t = {
      placement: e,
      modifiers: [
        {
          name: "flip",
          options: { fallbackPlacements: this._config.fallbackPlacements },
        },
        { name: "offset", options: { offset: this._getOffset() } },
        {
          name: "preventOverflow",
          options: { boundary: this._config.boundary },
        },
        {
          name: "arrow",
          options: { element: `.${this.constructor.NAME}-arrow` },
        },
        {
          name: "preSetPlacement",
          enabled: !0,
          phase: "beforeMain",
          fn: (e) => {
            this._getTipElement().setAttribute(
              "data-popper-placement",
              e.state.placement
            );
          },
        },
      ],
    };
    return { ...t, ...execute(this._config.popperConfig, [t]) };
  }
  _setListeners() {
    const e = this._config.trigger.split(" ");
    for (const t of e)
      if ("click" === t)
        EventHandler.on(
          this._element,
          this.constructor.eventName("click"),
          this._config.selector,
          (e) => {
            this._initializeOnDelegatedTarget(e).toggle();
          }
        );
      else if ("manual" !== t) {
        const e =
            "hover" === t
              ? this.constructor.eventName("mouseenter")
              : this.constructor.eventName("focusin"),
          n =
            "hover" === t
              ? this.constructor.eventName("mouseleave")
              : this.constructor.eventName("focusout");
        EventHandler.on(this._element, e, this._config.selector, (e) => {
          const t = this._initializeOnDelegatedTarget(e);
          (t._activeTrigger["focusin" === e.type ? "focus" : "hover"] = !0),
            t._enter();
        }),
          EventHandler.on(this._element, n, this._config.selector, (e) => {
            const t = this._initializeOnDelegatedTarget(e);
            (t._activeTrigger["focusout" === e.type ? "focus" : "hover"] =
              t._element.contains(e.relatedTarget)),
              t._leave();
          });
      }
    (this._hideModalHandler = () => {
      this._element && this.hide();
    }),
      EventHandler.on(
        this._element.closest(".modal"),
        "hide.bs.modal",
        this._hideModalHandler
      );
  }
  _fixTitle() {
    const e = this._element.getAttribute("title");
    e &&
      (this._element.getAttribute("aria-label") ||
        this._element.textContent.trim() ||
        this._element.setAttribute("aria-label", e),
      this._element.setAttribute("data-bs-original-title", e),
      this._element.removeAttribute("title"));
  }
  _enter() {
    this._isShown() || this._isHovered
      ? (this._isHovered = !0)
      : ((this._isHovered = !0),
        this._setTimeout(() => {
          this._isHovered && this.show();
        }, this._config.delay.show));
  }
  _leave() {
    this._isWithActiveTrigger() ||
      ((this._isHovered = !1),
      this._setTimeout(() => {
        this._isHovered || this.hide();
      }, this._config.delay.hide));
  }
  _setTimeout(e, t) {
    clearTimeout(this._timeout), (this._timeout = setTimeout(e, t));
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(!0);
  }
  _getConfig(e) {
    const t = Manipulator.getDataAttributes(this._element);
    for (const e of Object.keys(t)) DISALLOWED_ATTRIBUTES.has(e) && delete t[e];
    return (
      (e = { ...t, ...("object" == typeof e && e ? e : {}) }),
      (e = this._mergeConfigObj(e)),
      (e = this._configAfterMerge(e)),
      this._typeCheckConfig(e),
      e
    );
  }
  _configAfterMerge(e) {
    return (
      (e.container =
        !1 === e.container ? document.body : getElement(e.container)),
      "number" == typeof e.delay &&
        (e.delay = { show: e.delay, hide: e.delay }),
      "number" == typeof e.title && (e.title = e.title.toString()),
      "number" == typeof e.content && (e.content = e.content.toString()),
      e
    );
  }
  _getDelegateConfig() {
    const e = {};
    for (const [t, n] of Object.entries(this._config))
      this.constructor.Default[t] !== n && (e[t] = n);
    return (e.selector = !1), (e.trigger = "manual"), e;
  }
  _disposePopper() {
    this._popper && (this._popper.destroy(), (this._popper = null)),
      this.tip && (this.tip.remove(), (this.tip = null));
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Tooltip.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === t[e]) throw new TypeError(`No method named "${e}"`);
        t[e]();
      }
    });
  }
}
defineJQueryPlugin(Tooltip);
const NAME$3 = "popover",
  SELECTOR_TITLE = ".popover-header",
  SELECTOR_CONTENT = ".popover-body",
  Default$2 = {
    ...Tooltip.Default,
    content: "",
    offset: [0, 8],
    placement: "right",
    template:
      '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
    trigger: "click",
  },
  DefaultType$2 = {
    ...Tooltip.DefaultType,
    content: "(null|string|element|function)",
  };
class Popover extends Tooltip {
  static get Default() {
    return Default$2;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  static get NAME() {
    return NAME$3;
  }
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      ".popover-body": this._getContent(),
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Popover.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === t[e]) throw new TypeError(`No method named "${e}"`);
        t[e]();
      }
    });
  }
}
defineJQueryPlugin(Popover);
const NAME$2 = "scrollspy",
  DATA_KEY$2 = "bs.scrollspy",
  EVENT_KEY$2 = ".bs.scrollspy",
  DATA_API_KEY = ".data-api",
  EVENT_ACTIVATE = "activate.bs.scrollspy",
  EVENT_CLICK = "click.bs.scrollspy",
  EVENT_LOAD_DATA_API$1 = "load.bs.scrollspy.data-api",
  CLASS_NAME_DROPDOWN_ITEM = "dropdown-item",
  CLASS_NAME_ACTIVE$1 = "active",
  SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]',
  SELECTOR_TARGET_LINKS = "[href]",
  SELECTOR_NAV_LIST_GROUP = ".nav, .list-group",
  SELECTOR_NAV_LINKS = ".nav-link",
  SELECTOR_NAV_ITEMS = ".nav-item",
  SELECTOR_LIST_ITEMS = ".list-group-item",
  SELECTOR_LINK_ITEMS = ".nav-link, .nav-item > .nav-link, .list-group-item",
  SELECTOR_DROPDOWN = ".dropdown",
  SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle",
  Default$1 = {
    offset: null,
    rootMargin: "0px 0px -25%",
    smoothScroll: !1,
    target: null,
    threshold: [0.1, 0.5, 1],
  },
  DefaultType$1 = {
    offset: "(number|null)",
    rootMargin: "string",
    smoothScroll: "boolean",
    target: "element",
    threshold: "array",
  };
class ScrollSpy extends BaseComponent {
  constructor(e, t) {
    super(e, t),
      (this._targetLinks = new Map()),
      (this._observableSections = new Map()),
      (this._rootElement =
        "visible" === getComputedStyle(this._element).overflowY
          ? null
          : this._element),
      (this._activeTarget = null),
      (this._observer = null),
      (this._previousScrollData = { visibleEntryTop: 0, parentScrollTop: 0 }),
      this.refresh();
  }
  static get Default() {
    return Default$1;
  }
  static get DefaultType() {
    return DefaultType$1;
  }
  static get NAME() {
    return NAME$2;
  }
  refresh() {
    this._initializeTargetsAndObservables(),
      this._maybeEnableSmoothScroll(),
      this._observer
        ? this._observer.disconnect()
        : (this._observer = this._getNewObserver());
    for (const e of this._observableSections.values())
      this._observer.observe(e);
  }
  dispose() {
    this._observer.disconnect(), super.dispose();
  }
  _configAfterMerge(e) {
    return (
      (e.target = getElement(e.target) || document.body),
      (e.rootMargin = e.offset ? `${e.offset}px 0px -30%` : e.rootMargin),
      "string" == typeof e.threshold &&
        (e.threshold = e.threshold.split(",").map((e) => Number.parseFloat(e))),
      e
    );
  }
  _maybeEnableSmoothScroll() {
    this._config.smoothScroll &&
      (EventHandler.off(this._config.target, EVENT_CLICK),
      EventHandler.on(this._config.target, EVENT_CLICK, "[href]", (e) => {
        const t = this._observableSections.get(e.target.hash);
        if (t) {
          e.preventDefault();
          const n = this._rootElement || window,
            i = t.offsetTop - this._element.offsetTop;
          if (n.scrollTo)
            return void n.scrollTo({ top: i, behavior: "smooth" });
          n.scrollTop = i;
        }
      }));
  }
  _getNewObserver() {
    const e = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin,
    };
    return new IntersectionObserver((e) => this._observerCallback(e), e);
  }
  _observerCallback(e) {
    const t = (e) => this._targetLinks.get(`#${e.target.id}`),
      n = (e) => {
        (this._previousScrollData.visibleEntryTop = e.target.offsetTop),
          this._process(t(e));
      },
      i = (this._rootElement || document.documentElement).scrollTop,
      s = i >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = i;
    for (const o of e) {
      if (!o.isIntersecting) {
        (this._activeTarget = null), this._clearActiveClass(t(o));
        continue;
      }
      const e = o.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      if (s && e) {
        if ((n(o), !i)) return;
      } else s || e || n(o);
    }
  }
  _initializeTargetsAndObservables() {
    (this._targetLinks = new Map()), (this._observableSections = new Map());
    const e = SelectorEngine.find("[href]", this._config.target);
    for (const t of e) {
      if (!t.hash || isDisabled(t)) continue;
      const e = SelectorEngine.findOne(t.hash, this._element);
      isVisible(e) &&
        (this._targetLinks.set(t.hash, t),
        this._observableSections.set(t.hash, e));
    }
  }
  _process(e) {
    this._activeTarget !== e &&
      (this._clearActiveClass(this._config.target),
      (this._activeTarget = e),
      e.classList.add("active"),
      this._activateParents(e),
      EventHandler.trigger(this._element, EVENT_ACTIVATE, {
        relatedTarget: e,
      }));
  }
  _activateParents(e) {
    if (e.classList.contains("dropdown-item"))
      SelectorEngine.findOne(
        ".dropdown-toggle",
        e.closest(".dropdown")
      ).classList.add("active");
    else
      for (const t of SelectorEngine.parents(e, ".nav, .list-group"))
        for (const e of SelectorEngine.prev(t, SELECTOR_LINK_ITEMS))
          e.classList.add("active");
  }
  _clearActiveClass(e) {
    e.classList.remove("active");
    const t = SelectorEngine.find("[href].active", e);
    for (const e of t) e.classList.remove("active");
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = ScrollSpy.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
          throw new TypeError(`No method named "${e}"`);
        t[e]();
      }
    });
  }
}
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const e of SelectorEngine.find(SELECTOR_DATA_SPY))
    ScrollSpy.getOrCreateInstance(e);
}),
  defineJQueryPlugin(ScrollSpy);
const NAME$1 = "tab",
  DATA_KEY$1 = "bs.tab",
  EVENT_KEY$1 = ".bs.tab",
  EVENT_HIDE$1 = "hide.bs.tab",
  EVENT_HIDDEN$1 = "hidden.bs.tab",
  EVENT_SHOW$1 = "show.bs.tab",
  EVENT_SHOWN$1 = "shown.bs.tab",
  EVENT_CLICK_DATA_API = "click.bs.tab",
  EVENT_KEYDOWN = "keydown.bs.tab",
  EVENT_LOAD_DATA_API = "load.bs.tab",
  ARROW_LEFT_KEY = "ArrowLeft",
  ARROW_RIGHT_KEY = "ArrowRight",
  ARROW_UP_KEY = "ArrowUp",
  ARROW_DOWN_KEY = "ArrowDown",
  CLASS_NAME_ACTIVE = "active",
  CLASS_NAME_FADE$1 = "fade",
  CLASS_NAME_SHOW$1 = "show",
  CLASS_DROPDOWN = "dropdown",
  SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle",
  SELECTOR_DROPDOWN_MENU = ".dropdown-menu",
  NOT_SELECTOR_DROPDOWN_TOGGLE = ":not(.dropdown-toggle)",
  SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]',
  SELECTOR_OUTER = ".nav-item, .list-group-item",
  SELECTOR_INNER =
    '.nav-link:not(.dropdown-toggle), .list-group-item:not(.dropdown-toggle), [role="tab"]:not(.dropdown-toggle)',
  SELECTOR_DATA_TOGGLE =
    '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',
  SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`,
  SELECTOR_DATA_TOGGLE_ACTIVE =
    '.active[data-bs-toggle="tab"], .active[data-bs-toggle="pill"], .active[data-bs-toggle="list"]';
class Tab extends BaseComponent {
  constructor(e) {
    super(e),
      (this._parent = this._element.closest(SELECTOR_TAB_PANEL)),
      this._parent &&
        (this._setInitialAttributes(this._parent, this._getChildren()),
        EventHandler.on(this._element, EVENT_KEYDOWN, (e) => this._keydown(e)));
  }
  static get NAME() {
    return "tab";
  }
  show() {
    const e = this._element;
    if (this._elemIsActive(e)) return;
    const t = this._getActiveElem(),
      n = t
        ? EventHandler.trigger(t, EVENT_HIDE$1, { relatedTarget: e })
        : null;
    EventHandler.trigger(e, EVENT_SHOW$1, { relatedTarget: t })
      .defaultPrevented ||
      (n && n.defaultPrevented) ||
      (this._deactivate(t, e), this._activate(e, t));
  }
  _activate(e, t) {
    e &&
      (e.classList.add("active"),
      this._activate(SelectorEngine.getElementFromSelector(e)),
      this._queueCallback(
        () => {
          "tab" === e.getAttribute("role")
            ? (e.removeAttribute("tabindex"),
              e.setAttribute("aria-selected", !0),
              this._toggleDropDown(e, !0),
              EventHandler.trigger(e, EVENT_SHOWN$1, { relatedTarget: t }))
            : e.classList.add("show");
        },
        e,
        e.classList.contains("fade")
      ));
  }
  _deactivate(e, t) {
    e &&
      (e.classList.remove("active"),
      e.blur(),
      this._deactivate(SelectorEngine.getElementFromSelector(e)),
      this._queueCallback(
        () => {
          "tab" === e.getAttribute("role")
            ? (e.setAttribute("aria-selected", !1),
              e.setAttribute("tabindex", "-1"),
              this._toggleDropDown(e, !1),
              EventHandler.trigger(e, EVENT_HIDDEN$1, { relatedTarget: t }))
            : e.classList.remove("show");
        },
        e,
        e.classList.contains("fade")
      ));
  }
  _keydown(e) {
    if (
      ![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(
        e.key
      )
    )
      return;
    e.stopPropagation(), e.preventDefault();
    const t = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(e.key),
      n = getNextActiveElement(
        this._getChildren().filter((e) => !isDisabled(e)),
        e.target,
        t,
        !0
      );
    n && (n.focus({ preventScroll: !0 }), Tab.getOrCreateInstance(n).show());
  }
  _getChildren() {
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find((e) => this._elemIsActive(e)) || null;
  }
  _setInitialAttributes(e, t) {
    this._setAttributeIfNotExists(e, "role", "tablist");
    for (const e of t) this._setInitialAttributesOnChild(e);
  }
  _setInitialAttributesOnChild(e) {
    e = this._getInnerElement(e);
    const t = this._elemIsActive(e),
      n = this._getOuterElement(e);
    e.setAttribute("aria-selected", t),
      n !== e && this._setAttributeIfNotExists(n, "role", "presentation"),
      t || e.setAttribute("tabindex", "-1"),
      this._setAttributeIfNotExists(e, "role", "tab"),
      this._setInitialAttributesOnTargetPanel(e);
  }
  _setInitialAttributesOnTargetPanel(e) {
    const t = SelectorEngine.getElementFromSelector(e);
    t &&
      (this._setAttributeIfNotExists(t, "role", "tabpanel"),
      e.id && this._setAttributeIfNotExists(t, "aria-labelledby", `#${e.id}`));
  }
  _toggleDropDown(e, t) {
    const n = this._getOuterElement(e);
    if (!n.classList.contains("dropdown")) return;
    const i = (e, i) => {
      const s = SelectorEngine.findOne(e, n);
      s && s.classList.toggle(i, t);
    };
    i(".dropdown-toggle", "active"),
      i(".dropdown-menu", "show"),
      n.setAttribute("aria-expanded", t);
  }
  _setAttributeIfNotExists(e, t, n) {
    e.hasAttribute(t) || e.setAttribute(t, n);
  }
  _elemIsActive(e) {
    return e.classList.contains("active");
  }
  _getInnerElement(e) {
    return e.matches(SELECTOR_INNER_ELEM)
      ? e
      : SelectorEngine.findOne(SELECTOR_INNER_ELEM, e);
  }
  _getOuterElement(e) {
    return e.closest(SELECTOR_OUTER) || e;
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Tab.getOrCreateInstance(this);
      if ("string" == typeof e) {
        if (void 0 === t[e] || e.startsWith("_") || "constructor" === e)
          throw new TypeError(`No method named "${e}"`);
        t[e]();
      }
    });
  }
}
EventHandler.on(document, "click.bs.tab", SELECTOR_DATA_TOGGLE, function (e) {
  ["A", "AREA"].includes(this.tagName) && e.preventDefault(),
    isDisabled(this) || Tab.getOrCreateInstance(this).show();
}),
  EventHandler.on(window, "load.bs.tab", () => {
    for (const e of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE))
      Tab.getOrCreateInstance(e);
  }),
  defineJQueryPlugin(Tab);
const NAME = "toast",
  DATA_KEY = "bs.toast",
  EVENT_KEY = ".bs.toast",
  EVENT_MOUSEOVER = "mouseover.bs.toast",
  EVENT_MOUSEOUT = "mouseout.bs.toast",
  EVENT_FOCUSIN = "focusin.bs.toast",
  EVENT_FOCUSOUT = "focusout.bs.toast",
  EVENT_HIDE = "hide.bs.toast",
  EVENT_HIDDEN = "hidden.bs.toast",
  EVENT_SHOW = "show.bs.toast",
  EVENT_SHOWN = "shown.bs.toast",
  CLASS_NAME_FADE = "fade",
  CLASS_NAME_HIDE = "hide",
  CLASS_NAME_SHOW = "show",
  CLASS_NAME_SHOWING = "showing",
  DefaultType = { animation: "boolean", autohide: "boolean", delay: "number" },
  Default = { animation: !0, autohide: !0, delay: 5e3 };
class Toast extends BaseComponent {
  constructor(e, t) {
    super(e, t),
      (this._timeout = null),
      (this._hasMouseInteraction = !1),
      (this._hasKeyboardInteraction = !1),
      this._setListeners();
  }
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }
  show() {
    EventHandler.trigger(this._element, EVENT_SHOW).defaultPrevented ||
      (this._clearTimeout(),
      this._config.animation && this._element.classList.add("fade"),
      this._element.classList.remove("hide"),
      reflow(this._element),
      this._element.classList.add("show", "showing"),
      this._queueCallback(
        () => {
          this._element.classList.remove("showing"),
            EventHandler.trigger(this._element, EVENT_SHOWN),
            this._maybeScheduleHide();
        },
        this._element,
        this._config.animation
      ));
  }
  hide() {
    this.isShown() &&
      (EventHandler.trigger(this._element, EVENT_HIDE).defaultPrevented ||
        (this._element.classList.add("showing"),
        this._queueCallback(
          () => {
            this._element.classList.add("hide"),
              this._element.classList.remove("showing", "show"),
              EventHandler.trigger(this._element, EVENT_HIDDEN);
          },
          this._element,
          this._config.animation
        )));
  }
  dispose() {
    this._clearTimeout(),
      this.isShown() && this._element.classList.remove("show"),
      super.dispose();
  }
  isShown() {
    return this._element.classList.contains("show");
  }
  _maybeScheduleHide() {
    this._config.autohide &&
      (this._hasMouseInteraction ||
        this._hasKeyboardInteraction ||
        (this._timeout = setTimeout(() => {
          this.hide();
        }, this._config.delay)));
  }
  _onInteraction(e, t) {
    switch (e.type) {
      case "mouseover":
      case "mouseout":
        this._hasMouseInteraction = t;
        break;
      case "focusin":
      case "focusout":
        this._hasKeyboardInteraction = t;
    }
    if (t) return void this._clearTimeout();
    const n = e.relatedTarget;
    this._element === n ||
      this._element.contains(n) ||
      this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, (e) =>
      this._onInteraction(e, !0)
    ),
      EventHandler.on(this._element, EVENT_MOUSEOUT, (e) =>
        this._onInteraction(e, !1)
      ),
      EventHandler.on(this._element, EVENT_FOCUSIN, (e) =>
        this._onInteraction(e, !0)
      ),
      EventHandler.on(this._element, EVENT_FOCUSOUT, (e) =>
        this._onInteraction(e, !1)
      );
  }
  _clearTimeout() {
    clearTimeout(this._timeout), (this._timeout = null);
  }
  static jQueryInterface(e) {
    return this.each(function () {
      const t = Toast.getOrCreateInstance(this, e);
      if ("string" == typeof e) {
        if (void 0 === t[e]) throw new TypeError(`No method named "${e}"`);
        t[e](this);
      }
    });
  }
}
enableDismissTrigger(Toast), defineJQueryPlugin(Toast);
export {
  Alert,
  Button,
  Carousel,
  Collapse,
  Dropdown,
  Modal,
  Offcanvas,
  Popover,
  ScrollSpy,
  Tab,
  Toast,
  Tooltip,
};
//# sourceMappingURL=bootstrap.esm.min.js.map
