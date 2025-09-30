export function applyTelegramTheme() {
  if (typeof window === "undefined") return;
  const tp = (window as any).Telegram?.WebApp?.themeParams || {};
  const set = (k: string, v?: string) => v && document.documentElement.style.setProperty(k, v);
  set("--bg", tp.bg_color);
  set("--text", tp.text_color);
  set("--hint", tp.hint_color);
  set("--link", tp.link_color);
  set("--btn", tp.button_color);
  set("--btn-text", tp.button_text_color);
}
export function readyTg() {
  const tg = (window as any).Telegram?.WebApp;
  tg?.ready?.(); tg?.expand?.();
}
