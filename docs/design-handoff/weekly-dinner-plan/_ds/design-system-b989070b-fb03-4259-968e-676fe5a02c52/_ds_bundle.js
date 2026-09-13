/* @ds-bundle: {"format":3,"namespace":"DesignSystem_b98907","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ListItem","sourcePath":"components/core/ListItem.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"aa114e7860ed","components/core/Badge.jsx":"e7e7ae0bf63b","components/core/Button.jsx":"b21811789ead","components/core/Card.jsx":"62a9ee3fc062","components/core/Chip.jsx":"0e4bb52394dd","components/core/IconButton.jsx":"5a4bf4a29f90","components/core/Input.jsx":"9c72d34091ee","components/core/ListItem.jsx":"de10677ad203","ui_kits/mobile/CalendarScreen.jsx":"161a3d5519f7","ui_kits/mobile/DayDetail.jsx":"dbae69111109","ui_kits/mobile/LoginScreen.jsx":"8f7f4f984799","ui_kits/mobile/data.js":"a125f7b3a5ec"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_b98907 = window.DesignSystem_b98907 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Avatar — circular family-member identity. Renders an Ionicons person glyph
 * (the app's convention) or initials, optionally with the member name below.
 * Inactive state (filter off) greys out and dims.
 */
function Avatar({
  name,
  initial,
  size = 56,
  active = true,
  showName = false,
  onClick,
  style,
  ...rest
}) {
  const circle = /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: active ? "var(--kp-primary)" : "var(--kp-border)",
      color: active ? "#fff" : "var(--kp-text-light)",
      cursor: onClick ? "pointer" : "default",
      transition: "background var(--kp-duration) var(--kp-ease)",
      flex: "none"
    }
  }, initial ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--kp-font-sans)",
      fontWeight: 600,
      fontSize: size * 0.4
    }
  }, initial) : /*#__PURE__*/React.createElement("ion-icon", {
    name: "person",
    style: {
      fontSize: size * 0.5,
      color: "inherit"
    }
  }));
  if (!showName) return /*#__PURE__*/React.createElement("div", _extends({
    style: style
  }, rest), circle);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      opacity: active ? 1 : 0.6,
      ...style
    }
  }, rest), circle, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--kp-font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: active ? "var(--kp-text)" : "var(--kp-text-light)"
    }
  }, name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  menu: "var(--kp-menu)",
  budget: "var(--kp-budget)",
  personal: "var(--kp-event-personal)",
  family: "var(--kp-event-family)",
  todo: "var(--kp-todo)",
  high: "var(--kp-priority-high)",
  medium: "var(--kp-priority-medium)",
  low: "var(--kp-priority-low)",
  success: "var(--kp-success)",
  warning: "var(--kp-warning)",
  error: "var(--kp-error)",
  info: "var(--kp-info)",
  neutral: "var(--kp-text-secondary)"
};

/**
 * Badge — small solid pill for category tags and Todo priority (高/中/低).
 * Use `soft` for a tinted background + colored text instead of solid.
 */
function Badge({
  children,
  tone = "neutral",
  soft = false,
  style,
  ...rest
}) {
  const color = TONES[tone] || tone;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      fontFamily: "var(--kp-font-sans)",
      fontSize: 11,
      fontWeight: 500,
      lineHeight: 1.4,
      padding: "2px 8px",
      borderRadius: "var(--kp-radius-sm)",
      color: soft ? color : "#fff",
      background: soft ? `color-mix(in srgb, ${color} 16%, white)` : color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the app's primary action control.
 * Solid orange by default, full-width inside forms (login / signup).
 * Pass an Ionicons `icon` name to prepend a glyph.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  block = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      height: 36,
      padding: "0 14px",
      font: 14
    },
    md: {
      height: 48,
      padding: "0 20px",
      font: 16
    },
    lg: {
      height: 52,
      padding: "0 24px",
      font: 16
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--kp-primary)",
      color: "var(--kp-text-on-primary)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "var(--kp-bg-secondary)",
      color: "var(--kp-text)",
      border: "1px solid var(--kp-border)"
    },
    ghost: {
      background: "transparent",
      color: "var(--kp-primary)",
      border: "1px solid transparent"
    },
    danger: {
      background: "var(--kp-error)",
      color: "#fff",
      border: "1px solid transparent"
    }
  };
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: block ? "100%" : "auto",
      height: s.height,
      padding: s.padding,
      fontFamily: "var(--kp-font-sans)",
      fontSize: s.font,
      fontWeight: 600,
      lineHeight: 1,
      borderRadius: "var(--kp-radius-lg)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition: "filter var(--kp-duration) var(--kp-ease), opacity var(--kp-duration) var(--kp-ease)",
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.filter = "brightness(0.93)";
    },
    onMouseUp: e => {
      e.currentTarget.style.filter = "none";
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = "none";
    }
  }, rest), icon && /*#__PURE__*/React.createElement("ion-icon", {
    name: icon,
    style: {
      fontSize: "1.2em"
    }
  }), children, iconRight && /*#__PURE__*/React.createElement("ion-icon", {
    name: iconRight,
    style: {
      fontSize: "1.2em"
    }
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — white rounded surface. Default is a flat hairline-bordered card;
 * `elevation="raised"` adds the resting shadow, `elevation="popover"` the
 * dropdown/menu shadow.
 */
function Card({
  children,
  elevation = "flat",
  padding = 16,
  style,
  ...rest
}) {
  const shadows = {
    flat: "none",
    raised: "var(--kp-shadow-card)",
    popover: "var(--kp-shadow-popover)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--kp-bg)",
      border: elevation === "flat" ? "1px solid var(--kp-border)" : "none",
      borderRadius: "var(--kp-radius-lg)",
      boxShadow: shadows[elevation] || "none",
      padding,
      fontFamily: "var(--kp-font-sans)",
      color: "var(--kp-text)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Chip — compact pill control. Two roles:
 *  - `select`: dropdown trigger (grey surface + chevron-down), like the
 *    category filter in the header.
 *  - `toggle`: filter pill that fills orange when active.
 */
function Chip({
  children,
  role = "toggle",
  active = false,
  icon,
  onClick,
  style,
  ...rest
}) {
  const isSelect = role === "select";
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      height: 32,
      padding: "0 12px",
      fontFamily: "var(--kp-font-sans)",
      fontSize: 14,
      fontWeight: 500,
      borderRadius: "var(--kp-radius-md)",
      cursor: "pointer",
      border: isSelect ? "1px solid transparent" : `1px solid ${active ? "transparent" : "var(--kp-border)"}`,
      background: isSelect ? "var(--kp-bg-secondary)" : active ? "var(--kp-primary)" : "var(--kp-bg)",
      color: isSelect ? "var(--kp-text)" : active ? "#fff" : "var(--kp-text-secondary)",
      transition: "background var(--kp-duration) var(--kp-ease), color var(--kp-duration) var(--kp-ease)",
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("ion-icon", {
    name: icon,
    style: {
      fontSize: 16,
      color: "inherit"
    }
  }), children, isSelect && /*#__PURE__*/React.createElement("ion-icon", {
    name: "chevron-down",
    style: {
      fontSize: 18,
      color: "var(--kp-text)"
    }
  }));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — a bare tappable icon (header chevrons, close, profile).
 * Renders an Ionicons glyph in a square hit area. Use `round` for a filled
 * circular variant (e.g. the orange "today" / add buttons).
 */
function IconButton({
  icon,
  size = 24,
  color = "var(--kp-text)",
  round = false,
  label,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 44,
      minHeight: 44,
      padding: 4,
      border: "none",
      background: round ? "var(--kp-primary)" : "transparent",
      borderRadius: round ? "var(--kp-radius-md)" : "var(--kp-radius-md)",
      cursor: "pointer",
      color: round ? "#fff" : color,
      transition: "background var(--kp-duration) var(--kp-ease), opacity var(--kp-duration) var(--kp-ease)",
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.opacity = "0.7";
    },
    onMouseLeave: e => {
      e.currentTarget.style.opacity = "1";
    }
  }, rest), /*#__PURE__*/React.createElement("ion-icon", {
    name: icon,
    style: {
      fontSize: size,
      color: "inherit"
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — labeled text field with a leading Ionicons icon, matching the
 * auth screens. Supports an error state/message and a password reveal toggle.
 */
function Input({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  revealToggle = false,
  style,
  ...rest
}) {
  const [revealed, setRevealed] = React.useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && revealed ? "text" : type;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kp-font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kp-text)",
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      height: 48,
      padding: "0 12px",
      background: "var(--kp-bg-secondary)",
      border: `1px solid ${error ? "var(--kp-error)" : "var(--kp-border)"}`,
      borderRadius: "var(--kp-radius-lg)"
    }
  }, icon && /*#__PURE__*/React.createElement("ion-icon", {
    name: icon,
    style: {
      fontSize: 20,
      color: "var(--kp-text-secondary)",
      marginRight: 8
    }
  }), /*#__PURE__*/React.createElement("input", _extends({
    type: effectiveType,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--kp-font-sans)",
      fontSize: 16,
      color: "var(--kp-text)",
      minWidth: 0
    }
  }, rest)), (revealToggle || isPassword) && isPassword && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setRevealed(r => !r),
    "aria-label": revealed ? "パスワードを隠す" : "パスワードを表示",
    style: {
      border: "none",
      background: "transparent",
      padding: 4,
      cursor: "pointer",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement("ion-icon", {
    name: revealed ? "eye-outline" : "eye-off-outline",
    style: {
      fontSize: 20,
      color: "var(--kp-text-secondary)"
    }
  }))), error && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--kp-font-sans)",
      fontSize: 12,
      color: "var(--kp-error)",
      marginTop: 4
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/ListItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ListItem — a row in the day-detail list: a colored vertical indicator bar
 * keyed to the category, a title, optional subtitle/meta, and an optional
 * trailing slot (amount, badge, chevron). Mirrors DayScheduleList rows.
 */
function ListItem({
  tone = "var(--kp-text-secondary)",
  title,
  subtitle,
  meta,
  trailing,
  icon,
  onClick,
  style,
  ...rest
}) {
  const TONES = {
    menu: "var(--kp-menu)",
    budget: "var(--kp-budget)",
    personal: "var(--kp-event-personal)",
    family: "var(--kp-event-family)",
    todo: "var(--kp-todo)"
  };
  const color = TONES[tone] || tone;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 0",
      borderBottom: "1px solid var(--kp-border)",
      fontFamily: "var(--kp-font-sans)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 4,
      alignSelf: "stretch",
      minHeight: 40,
      borderRadius: 2,
      background: color,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--kp-text-secondary)",
      marginBottom: 2
    }
  }, meta), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, icon && /*#__PURE__*/React.createElement("ion-icon", {
    name: icon,
    style: {
      fontSize: 18,
      color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: "var(--kp-text)"
    }
  }, title)), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--kp-text-secondary)",
      marginTop: 2
    }
  }, subtitle)), trailing != null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      alignSelf: "center",
      fontSize: 13,
      color: "var(--kp-text-secondary)"
    }
  }, trailing));
}
Object.assign(__ds_scope, { ListItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ListItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/CalendarScreen.jsx
try { (() => {
// 献立プラン — Calendar screen (recreation of CalendarScreen.tsx + CalendarView.tsx)
function KPCalendarScreen({
  onOpenProfile
}) {
  const {
    IconButton,
    Avatar,
    Chip
  } = window.DesignSystem_b98907;
  const D = window.KPData;
  const [month, setMonth] = React.useState({
    y: 2026,
    m: 0
  }); // Jan 2026
  const [selected, setSelected] = React.useState("2026-01-18");
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [category, setCategory] = React.useState("all");
  const [catOpen, setCatOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(["user-1", "user-2", "user-3"]);
  const catLabels = {
    all: "すべて",
    menu: "献立",
    budget: "家計簿",
    todo: "予定"
  };
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const pad = n => String(n).padStart(2, "0");
  const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  // ---- filters ----
  const showCat = c => category === "all" || category === c;
  const inUsers = uid => visible.includes(uid);
  const menus = D.menus.filter(x => showCat("menu") && inUsers(x.userId));
  const budgets = D.budgets.filter(x => showCat("budget") && inUsers(x.userId));
  const events = D.events.filter(x => (category === "all" || category === "todo") && inUsers(x.userId));
  const todos = D.todos.filter(x => (category === "all" || category === "todo") && x.priority === "high" && (!x.assignedTo || inUsers(x.assignedTo)));

  // ---- labels per date ----
  const labelsByDate = {};
  const push = (date, text, color) => {
    (labelsByDate[date] = labelsByDate[date] || []).push({
      text,
      color
    });
  };
  menus.forEach(m => push(m.date, m.name, "var(--kp-menu)"));
  events.forEach(e => push(e.date, e.type === "personal" ? `${D.getUserName(e.userId)}: ${e.title}` : e.title, e.type === "family" ? "var(--kp-event-family)" : "var(--kp-event-personal)"));
  budgets.forEach(b => push(b.date, `¥${Math.abs(b.amount).toLocaleString()}`, "var(--kp-budget)"));
  todos.forEach(t => push(t.date, t.assignedTo ? `${D.getUserName(t.assignedTo)}: ${t.title}` : t.title, "var(--kp-todo)"));

  // ---- build 6-week grid ----
  const first = new Date(month.y, month.m, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const weeks = [];
  const cur = new Date(start);
  for (let w = 0; w < 6; w++) {
    const days = [];
    let weekNum = 0;
    for (let d = 0; d < 7; d++) {
      const dt = new Date(cur);
      days.push(dt);
      if (d === 1) {
        const t = new Date(dt);
        t.setHours(0, 0, 0, 0);
        t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);
        const w1 = new Date(t.getFullYear(), 0, 4);
        weekNum = 1 + Math.round(((t - w1) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
      }
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push({
      days,
      weekNum
    });
  }
  const todayStr = "2026-01-18";
  const changeMonth = delta => setMonth(p => {
    const d = new Date(p.y, p.m + delta, 1);
    return {
      y: d.getFullYear(),
      m: d.getMonth()
    };
  });
  const onDay = dt => {
    setSelected(iso(dt.getFullYear(), dt.getMonth(), dt.getDate()));
    setSheetOpen(true);
  };
  const toggleUser = id => setVisible(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
  const fmtSheet = s => {
    const dt = new Date(s);
    return `${dt.getMonth() + 1}月${dt.getDate()}日（${weekdays[dt.getDay()]}）`;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--kp-bg)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      borderBottom: "1px solid var(--kp-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-back",
    color: "var(--kp-primary)",
    size: 20,
    onClick: () => changeMonth(-1)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: "var(--kp-text)",
      minWidth: 90,
      textAlign: "center"
    }
  }, month.y, "\u5E74", month.m + 1, "\u6708"), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-forward",
    color: "var(--kp-primary)",
    size: 20,
    onClick: () => changeMonth(1)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMonth({
        y: 2026,
        m: 0
      });
      setSelected(todayStr);
    },
    style: {
      border: "none",
      background: "var(--kp-primary)",
      color: "#fff",
      fontSize: 14,
      fontWeight: 500,
      padding: "6px 10px",
      borderRadius: "var(--kp-radius-md)",
      cursor: "pointer"
    }
  }, "18"), /*#__PURE__*/React.createElement(Chip, {
    role: "select",
    onClick: () => setCatOpen(o => !o)
  }, catLabels[category]), /*#__PURE__*/React.createElement(IconButton, {
    icon: "person-circle-outline",
    size: 28,
    onClick: onOpenProfile
  }), catOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 44,
      right: 36,
      background: "var(--kp-bg)",
      borderRadius: "var(--kp-radius-lg)",
      padding: "8px 0",
      minWidth: 140,
      boxShadow: "var(--kp-shadow-popover)",
      zIndex: 20
    }
  }, Object.keys(catLabels).map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    onClick: () => {
      setCategory(c);
      setCatOpen(false);
    },
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      cursor: "pointer",
      background: category === c ? "var(--kp-bg-secondary)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: category === c ? 600 : 400,
      color: category === c ? "var(--kp-primary)" : "var(--kp-text)"
    }
  }, catLabels[c]), category === c && /*#__PURE__*/React.createElement("ion-icon", {
    name: "checkmark",
    style: {
      fontSize: 18,
      color: "var(--kp-primary)"
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 32
    }
  }), weeks.map((wk, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      background: "var(--kp-bg-secondary)",
      borderBottom: "1px solid var(--kp-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--kp-primary)"
    }
  }, wk.weekNum)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      height: 32,
      alignItems: "center"
    }
  }, weekdays.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      textAlign: "center",
      fontSize: 13,
      fontWeight: 500,
      color: i === 0 ? "#E57373" : i === 6 ? "#64B5F6" : "var(--kp-text-secondary)"
    }
  }, d))), weeks.map((wk, wi) => /*#__PURE__*/React.createElement("div", {
    key: wi,
    style: {
      flex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)"
    }
  }, wk.days.map((dt, di) => {
    const ds = iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const inMonth = dt.getMonth() === month.m;
    const isSel = ds === selected;
    const isToday = ds === todayStr;
    const labels = labelsByDate[ds] || [];
    return /*#__PURE__*/React.createElement("div", {
      key: di,
      onClick: () => onDay(dt),
      style: {
        borderBottom: "1px solid var(--kp-border)",
        padding: "3px 1px 4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isSel ? "var(--kp-primary)" : "transparent",
        border: isToday && !isSel ? "1px solid var(--kp-primary)" : "1px solid transparent"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: isSel || isToday ? 600 : 400,
        color: isSel ? "#fff" : !inMonth ? "var(--kp-text-light)" : isToday ? "var(--kp-primary)" : "var(--kp-text)"
      }
    }, dt.getDate())), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        alignItems: "center"
      }
    }, labels.slice(0, 3).map((l, li) => /*#__PURE__*/React.createElement("div", {
      key: li,
      style: {
        background: l.color,
        borderRadius: 3,
        padding: "1px 3px",
        maxWidth: 46,
        width: "fit-content"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        color: "#fff",
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "block",
        maxWidth: 40
      }
    }, l.text))), labels.length > 3 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 8,
        color: "var(--kp-text-secondary)"
      }
    }, "+", labels.length - 3)));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 20,
      padding: "8px 16px",
      borderTop: "1px solid var(--kp-border)"
    }
  }, D.users.map(u => /*#__PURE__*/React.createElement(Avatar, {
    key: u.id,
    name: u.name,
    showName: true,
    active: visible.includes(u.id),
    onClick: () => toggleUser(u.id)
  }))), sheetOpen && /*#__PURE__*/React.createElement("div", {
    onClick: () => setSheetOpen(false),
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.3)",
      zIndex: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 31,
      height: "85%",
      background: "var(--kp-bg)",
      borderTopLeftRadius: "var(--kp-radius-xl)",
      borderTopRightRadius: "var(--kp-radius-xl)",
      boxShadow: "var(--kp-shadow-sheet)",
      transform: sheetOpen ? "translateY(0)" : "translateY(100%)",
      transition: "transform var(--kp-duration-sheet) var(--kp-ease)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: "var(--kp-border)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      borderBottom: "1px solid var(--kp-border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: "var(--kp-text)"
    }
  }, fmtSheet(selected)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "close",
    onClick: () => setSheetOpen(false)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement(window.KPDayDetail, {
    data: D.dataForDate(selected)
  }))));
}
window.KPCalendarScreen = KPCalendarScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/CalendarScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/DayDetail.jsx
try { (() => {
// 献立プラン — Day detail sheet content (recreation of DayScheduleList.tsx)
function KPDayDetail({
  data
}) {
  const {
    ListItem,
    Badge
  } = window.DesignSystem_b98907;
  const {
    getUserName
  } = window.KPData;
  const hasData = data.events.length || data.menus.length || data.todos.length || data.budgets.length;
  const Section = ({
    icon,
    color,
    title,
    children
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("ion-icon", {
    name: icon,
    style: {
      fontSize: 18,
      color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kp-text-secondary)",
      marginLeft: 6
    }
  }, title)), children);
  const priorityTone = {
    high: "high",
    medium: "medium",
    low: "low"
  };
  const priorityLabel = {
    high: "高",
    medium: "中",
    low: "低"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px 40px"
    }
  }, !hasData && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement("ion-icon", {
    name: "calendar-outline",
    style: {
      fontSize: 32,
      color: "var(--kp-text-light)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 14,
      color: "var(--kp-text-light)"
    }
  }, "\u4E88\u5B9A\u30FB\u732E\u7ACB\u306F\u3042\u308A\u307E\u305B\u3093")), data.events.length > 0 && /*#__PURE__*/React.createElement(Section, {
    icon: "time-outline",
    color: "var(--kp-primary)",
    title: "\u4E88\u5B9A"
  }, data.events.map(e => /*#__PURE__*/React.createElement(ListItem, {
    key: e.id,
    tone: e.type === "family" ? "family" : "personal",
    meta: e.time,
    title: e.title,
    subtitle: e.type === "family" ? "家族" : "個人"
  }))), data.menus.length > 0 && /*#__PURE__*/React.createElement(Section, {
    icon: "restaurant-outline",
    color: "var(--kp-menu)",
    title: "\u732E\u7ACB"
  }, data.menus.map(m => /*#__PURE__*/React.createElement(ListItem, {
    key: m.id,
    tone: "menu",
    title: m.name,
    subtitle: m.ingredients.slice(0, 3).join("、") + (m.ingredients.length > 3 ? "..." : ""),
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--kp-primary)",
        fontWeight: 500
      }
    }, "\xA5", m.budget.toLocaleString())
  }))), data.budgets.length > 0 && /*#__PURE__*/React.createElement(Section, {
    icon: "wallet-outline",
    color: "var(--kp-budget)",
    title: "\u5BB6\u8A08\u7C3F"
  }, data.budgets.map(b => /*#__PURE__*/React.createElement(ListItem, {
    key: b.id,
    tone: "budget",
    title: b.description,
    subtitle: b.category,
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--kp-budget)",
        fontWeight: 600
      }
    }, "\u2212\xA5", Math.abs(b.amount).toLocaleString())
  }))), data.todos.length > 0 && /*#__PURE__*/React.createElement(Section, {
    icon: "checkbox-outline",
    color: "var(--kp-todo)",
    title: "Todo"
  }, data.todos.map(t => /*#__PURE__*/React.createElement(ListItem, {
    key: t.id,
    tone: "todo",
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("ion-icon", {
      name: t.completed ? "checkbox" : "square-outline",
      style: {
        fontSize: 20,
        color: t.completed ? "var(--kp-success)" : "var(--kp-text-secondary)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        textDecoration: t.completed ? "line-through" : "none",
        color: t.completed ? "var(--kp-text-light)" : "var(--kp-text)"
      }
    }, t.title)),
    subtitle: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: priorityTone[t.priority]
    }, priorityLabel[t.priority]), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("ion-icon", {
      name: "person",
      style: {
        fontSize: 12,
        color: "var(--kp-text-secondary)"
      }
    }), t.assignedTo ? getUserName(t.assignedTo) : "未割当"))
  }))));
}
window.KPDayDetail = KPDayDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/DayDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/LoginScreen.jsx
try { (() => {
// 献立プラン — Login screen (recreation of LoginScreen.tsx)
function KPLoginScreen({
  onLogin
}) {
  const {
    Button,
    Input
  } = window.DesignSystem_b98907;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      background: "var(--kp-bg)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: 24,
      boxSizing: "border-box",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: 48,
      background: "var(--kp-bg-secondary)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("ion-icon", {
    name: "restaurant",
    style: {
      fontSize: 48,
      color: "var(--kp-primary)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-display)",
      color: "var(--kp-text)"
    }
  }, "\u732E\u7ACB\u30D7\u30E9\u30F3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--kp-text-secondary)",
      marginTop: 4
    }
  }, "\u5BB6\u65CF\u306E\u98DF\u5353\u3092\u3082\u3063\u3068\u697D\u3057\u304F")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
    icon: "mail-outline",
    type: "email",
    placeholder: "example@email.com",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "\u30D1\u30B9\u30EF\u30FC\u30C9",
    icon: "lock-closed-outline",
    type: "password",
    placeholder: "6\u6587\u5B57\u4EE5\u4E0A",
    value: password,
    onChange: e => setPassword(e.target.value)
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    onClick: onLogin,
    style: {
      marginTop: 8
    }
  }, "\u30ED\u30B0\u30A4\u30F3"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--kp-primary)",
      cursor: "pointer"
    }
  }, "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5FD8\u308C\u305F\u65B9\u306F\u3053\u3061\u3089"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--kp-text-secondary)"
    }
  }, "\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u304A\u6301\u3061\u3067\u306A\u3044\u65B9"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--kp-primary)",
      cursor: "pointer"
    }
  }, "\u65B0\u898F\u767B\u9332")));
}
window.KPLoginScreen = KPLoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile/data.js
try { (() => {
// 献立プラン — mock data for the UI kit (January 2026)
// Mirrors src/mocks/data.ts from menuPlanApp-mobile.
window.KPData = function () {
  const users = [{
    id: "user-1",
    name: "パパ"
  }, {
    id: "user-2",
    name: "ママ"
  }, {
    id: "user-3",
    name: "太郎"
  }];
  const getUserName = id => (users.find(u => u.id === id) || {}).name || "不明";
  const menus = [{
    id: "m1",
    date: "2026-01-18",
    name: "チキンカレー",
    budget: 800,
    ingredients: ["鶏肉", "玉ねぎ", "じゃがいも", "にんじん"],
    userId: "user-1"
  }, {
    id: "m2",
    date: "2026-01-19",
    name: "豚の生姜焼き",
    budget: 600,
    ingredients: ["豚肉", "玉ねぎ", "生姜"],
    userId: "user-1"
  }, {
    id: "m3",
    date: "2026-01-20",
    name: "ハンバーグ",
    budget: 700,
    ingredients: ["合い挽き肉", "玉ねぎ", "パン粉", "卵"],
    userId: "user-2"
  }, {
    id: "m5",
    date: "2026-01-22",
    name: "親子丼",
    budget: 550,
    ingredients: ["鶏肉", "卵", "玉ねぎ"],
    userId: "user-2"
  }, {
    id: "m7",
    date: "2026-01-24",
    name: "カツ丼",
    budget: 650,
    ingredients: ["豚肉", "卵", "玉ねぎ"],
    userId: "user-1"
  }, {
    id: "m10",
    date: "2026-01-26",
    name: "唐揚げ",
    budget: 700,
    ingredients: ["鶏もも肉", "醤油", "生姜", "にんにく"],
    userId: "user-1"
  }, {
    id: "m11",
    date: "2026-01-28",
    name: "すき焼き",
    budget: 1500,
    ingredients: ["牛肉", "白菜", "ネギ", "豆腐"],
    userId: "user-1"
  }, {
    id: "m12",
    date: "2026-01-30",
    name: "餃子",
    budget: 600,
    ingredients: ["豚ひき肉", "キャベツ", "ニラ"],
    userId: "user-2"
  }];
  const budgets = [{
    id: "b1",
    date: "2026-01-18",
    category: "食費",
    amount: -800,
    description: "チキンカレー材料費",
    userId: "user-1"
  }, {
    id: "b4",
    date: "2026-01-21",
    category: "日用品",
    amount: -1200,
    description: "洗剤・シャンプー",
    userId: "user-1"
  }, {
    id: "b7",
    date: "2026-01-26",
    category: "衣服",
    amount: -8000,
    description: "太郎の冬服",
    userId: "user-2"
  }, {
    id: "b8",
    date: "2026-01-28",
    category: "食費",
    amount: -1500,
    description: "すき焼き材料",
    userId: "user-1"
  }];
  const events = [{
    id: "e1",
    date: "2026-01-18",
    title: "チーム会議",
    time: "14:00",
    type: "personal",
    userId: "user-1"
  }, {
    id: "e2",
    date: "2026-01-19",
    title: "子供の学校行事",
    time: "10:00",
    type: "family",
    userId: "user-2"
  }, {
    id: "e3",
    date: "2026-01-20",
    title: "歯医者",
    time: "15:30",
    type: "personal",
    userId: "user-1"
  }, {
    id: "e4",
    date: "2026-01-22",
    title: "家族でお出かけ",
    time: "13:00",
    type: "family",
    userId: "user-1"
  }, {
    id: "e5",
    date: "2026-01-24",
    title: "友人とランチ",
    time: "12:00",
    type: "personal",
    userId: "user-1"
  }, {
    id: "e10",
    date: "2026-01-25",
    title: "サッカー練習",
    time: "09:00",
    type: "personal",
    userId: "user-3"
  }, {
    id: "e13",
    date: "2026-01-30",
    title: "習い事（ピアノ）",
    time: "17:00",
    type: "personal",
    userId: "user-3"
  }];
  const todos = [{
    id: "t1",
    date: "2026-01-18",
    title: "牛乳を買う",
    completed: false,
    priority: "high",
    assignedTo: "user-2"
  }, {
    id: "t2",
    date: "2026-01-18",
    title: "クリーニング受け取り",
    completed: true,
    priority: "medium",
    assignedTo: "user-1"
  }, {
    id: "t3",
    date: "2026-01-20",
    title: "銀行振込",
    completed: false,
    priority: "high",
    assignedTo: null
  }, {
    id: "t6",
    date: "2026-01-24",
    title: "ゴミ出し",
    completed: false,
    priority: "high",
    assignedTo: "user-3"
  }, {
    id: "t10",
    date: "2026-01-30",
    title: "月末の家計簿まとめ",
    completed: false,
    priority: "medium",
    assignedTo: "user-2"
  }];
  function dataForDate(date) {
    return {
      date,
      menus: menus.filter(m => m.date === date),
      budgets: budgets.filter(b => b.date === date),
      events: events.filter(e => e.date === date),
      todos: todos.filter(t => t.date === date)
    };
  }
  return {
    users,
    getUserName,
    menus,
    budgets,
    events,
    todos,
    dataForDate
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ListItem = __ds_scope.ListItem;

})();
