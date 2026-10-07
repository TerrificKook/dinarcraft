"use strict";

// Prepared release: publish only after the owner approves the notice and operator.
(() => {
  const config = { enabled: true, counterId: 109097580, hosts: ["dinarcraft.ru", "www.dinarcraft.ru"], notice: "/privacy/analytics-consent/", contactGoal: "contact_click", contentGoal: "content_open", contentPaths: ["/catalog/", "/articles/"] };
  if (!config.enabled || !Number.isSafeInteger(config.counterId) ||
      !config.hosts.includes(location.hostname)) return;
  const controllerKey = `__dinarMetrikaConsent${config.counterId}`;
  if (window[controllerKey]) return;
  window[controllerKey] = true;

  const key = "site_analytics_choice_v2";
  const optOutKey = "site_analytics_optout_v2";
  const version = 3;
  const lifetime = 180 * 24 * 60 * 60 * 1000; // Project setting, not a legal retention period.
  const disableKey = `disableYaCounter${config.counterId}`;
  const safePath = /^\/[a-z0-9/_.-]*$/i.test(location.pathname) &&
    !/\d{7,}/.test(location.pathname) ? location.pathname : null;
  let active = false;
  let started = false;
  let revoked = false;
  let panel;
  let panelSpace;
  let script;
  let inputObserver;
  let expiryTimer;
  const channel = typeof BroadcastChannel === "function" ? new BroadcastChannel(key) : null;

  function fallbackDenied() {
    try {
      const until = Number(sessionStorage.getItem(optOutKey));
      if (until > Date.now() && until - Date.now() <= lifetime) return true;
      if (until) sessionStorage.removeItem(optOutKey);
    } catch { /* unavailable */ }
    try { return document.cookie.split(";").some(part => part.trim() === `${optOutKey}=1`); }
    catch { return false; }
  }

  function setFallbackDenied() {
    try { sessionStorage.setItem(optOutKey, String(Date.now() + lifetime)); } catch { /* unavailable */ }
    try { document.cookie = `${optOutKey}=1; Max-Age=${lifetime / 1000}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; }
    catch { /* unavailable */ }
  }

  function clearFallbackDenied() {
    try { sessionStorage.removeItem(optOutKey); } catch { /* unavailable */ }
    try { document.cookie = `${optOutKey}=; Max-Age=0; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; }
    catch { /* unavailable */ }
  }

  function readChoice() {
    if (fallbackDenied()) return "deny";
    try {
      const choice = JSON.parse(localStorage.getItem(key));
      if (!choice || (choice.version !== version && !(choice.version === 2 && choice.status === "deny")) ||
          !["allow", "deny"].includes(choice.status) ||
          !Number.isFinite(choice.at) || !Number.isFinite(choice.until) ||
          choice.at > Date.now() || choice.until <= Date.now() ||
          choice.until - choice.at > lifetime) return null;
      if (choice.status === "allow") {
        // A stale allow must not revive when writes (including revocation) fail.
        const probe = `${key}_storage_check`;
        localStorage.setItem(probe, "1");
        if (localStorage.getItem(probe) !== "1") return null;
        localStorage.removeItem(probe);
        if (localStorage.getItem(probe) !== null) return null;
      }
      return choice.status;
    } catch { return null; }
  }

  function saveChoice(status) {
    try {
      const at = Date.now();
      const choice = JSON.stringify({ status, version, at, until: at + lifetime });
      localStorage.setItem(key, choice);
      return localStorage.getItem(key) === choice;
    } catch { return false; }
  }

  function cleanCookies() {
    try {
      const names = document.cookie.split(";").map(item => item.trim().split("=")[0]);
      const domains = [null, location.hostname];
      const parts = location.hostname.split(".");
      if (parts.length > 2) domains.push(parts.slice(1).join("."));
      for (const name of names) {
        if (!/^_ym_(?:uid|d|isad|visorc(?:_\d+)?|metrika_enabled|retryReqs)$/.test(name)) continue;
        for (const domain of domains) {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
        }
      }
    } catch { /* HttpOnly and third-party cookies cannot be cleared here. */ }
  }

  function validTrackingValue(name, value) {
    if (name === "yclid") return /^[a-zA-Z0-9_-]{1,200}$/.test(value);
    if (name === "_ym_debug") return value === "2";
    if (name === "ym_debug") return value === "1";
    if (name === "match_type") return ["", "rm", "syn"].includes(value);
    if (!/^utm_(source|medium|campaign|content|term)$/.test(name) || value.length > 200) return false;
    // Direct entity IDs are strings, not phone numbers or JS Numbers.
    if (["utm_campaign", "utm_content"].includes(name) && /^\d{1,40}$/.test(value)) return true;
    const allowed = name === "utm_term" ? /^[\p{L}\p{N} _.,:+/!"()[\]-]+$/u : /^[\p{L}\p{N} _.,:/|-]+$/u;
    const checkedValue = name === "utm_campaign" ? value.replace(/(^|_)20\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?=$|_)/g, "$1") : value;
    return allowed.test(value) && !/@|\+?\d[\d .()-]{7,}/.test(checkedValue);
  }

  function safeUrl() {
    if (!safePath) return null;
    // The library can inspect the original location, including its hash.
    if (location.hash && (!/^#[a-z][a-z0-9_-]{0,79}$/i.test(location.hash) || /\d{7,}/.test(location.hash))) return null;
    const url = new URL(safePath, location.origin);
    const input = new URLSearchParams(location.search);
    const seen = new Set();
    // Fail closed on unknown/sensitive or duplicate parameters in the ORIGINAL URL.
    for (const [name, value] of input) {
      if (seen.has(name) || !validTrackingValue(name, value)) return null;
      seen.add(name);
      url.searchParams.append(name, value);
    }
    return url.href;
  }

  function safeReferrer() {
    try {
      const ref = new URL(document.referrer);
      return /^https?:$/.test(ref.protocol) ? ref.origin + "/" : undefined;
    } catch { return undefined; }
  }

  function safeTitle() {
    const title = document.title.trim().slice(0, 120);
    return /@|\+?\d[\d .()-]{7,}/.test(title) ? "Страница сайта" : title;
  }

  function protectInputs(root = document) {
    if (root.nodeType === 1 && root.matches("input, textarea, select, [contenteditable]")) {
      root.classList.add("ym-disable-keys", "ym-hide-content");
    }
    root.querySelectorAll?.("input, textarea, select, [contenteditable]").forEach(element => {
      element.classList.add("ym-disable-keys", "ym-hide-content");
    });
    document.querySelectorAll("#promptResult, .site-search-results, [data-analytics-private]").forEach(element => {
      element.classList.add("ym-hide-content");
    });
  }

  function stop(broadcast = true, persistDeny = true) {
    if (revoked) return;
    active = false;
    revoked = true;
    window[disableKey] = true;
    if (persistDeny) setFallbackDenied();
    if (broadcast) channel?.postMessage("deny");
    clearTimeout(expiryTimer);
    if (script && !script.dataset.loaded) script.remove();
    inputObserver?.disconnect();
    // Yandex documents destruct for an already initialized counter.
    try { if (started && typeof window.ym === "function") window.ym(config.counterId, "destruct"); }
    catch { /* The disable flag remains set if the tag is unavailable. */ }
    if (window.ym?.a) window.ym.a = window.ym.a.filter(args => args[0] !== config.counterId);
    cleanCookies();
  }

  function start() {
    if (started || revoked || readChoice() !== "allow") return;
    const url = safeUrl();
    if (!url) return; // Unknown/sensitive query values may be read by the library itself.
    protectInputs();
    inputObserver = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) protectInputs(node);
    });
    inputObserver.observe(document.documentElement, { childList: true, subtree: true });
    started = true;
    window[disableKey] = false;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${config.counterId}`;
    script.addEventListener("load", () => { script.dataset.loaded = "1"; });
    script.addEventListener("error", () => { stop(false, false); });
    document.head.appendChild(script);
    window.ym(config.counterId, "init", {
      defer: true, webvisor: false, clickmap: false, trackLinks: false,
      accurateTrackBounce: true, disableYtm: true, ecommerce: false, sendTitle: false,
      url, referrer: safeReferrer()
    });
    window.ym(config.counterId, "hit", url, { referer: safeReferrer(), title: safeTitle() });
    active = true;
    scheduleExpiry();
  }

  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    try {
      const choice = JSON.parse(localStorage.getItem(key));
      const delay = Math.max(1, Math.min(choice.until - Date.now(), 2147483647));
      expiryTimer = setTimeout(() => {
        if (readChoice() !== "allow") { stop(false, false); showPanel(); }
        else scheduleExpiry();
      }, delay);
    } catch { stop(false, false); showPanel(); }
  }

  function showPanel() {
    if (panel) { panel.hidden = false; reservePanelSpace(); panel.querySelector("button").focus(); return; }
    const style = document.createElement("style");
    style.textContent = `.analytics-choice{position:fixed;z-index:9999;inset:auto 12px 12px;max-width:560px;margin:auto;padding:18px;border:1px solid #777;border-radius:12px;background:#fff;color:#222;box-shadow:0 8px 32px #0003;font:16px/1.45 system-ui,sans-serif}.analytics-choice p{margin:0 0 12px}.analytics-choice a{color:#174e9c;text-decoration:underline}.analytics-choice-actions{display:flex;flex-wrap:wrap;gap:9px}.analytics-choice button,.analytics-settings{font:inherit;cursor:pointer}.analytics-choice button{padding:9px 12px;border:1px solid #444;border-radius:7px;background:#fff;color:#222}.analytics-choice button:focus-visible,.analytics-choice a:focus-visible,.analytics-settings:focus-visible{outline:3px solid #174e9c;outline-offset:2px}@media(max-width:480px){.analytics-choice{font-size:14px;inset:auto 8px 8px}}`;
    // Landing-specific section spacing must not inflate the consent panel.
    style.textContent += ".analytics-choice.analytics-choice{padding:18px;margin:0 auto}";
    if (document.querySelector(".contact-dock")) style.textContent += "@media(max-width:700px){.analytics-choice{bottom:76px}}";
    document.head.appendChild(style);
    panel = document.createElement("section");
    panel.className = "analytics-choice";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Выбор аналитики");
    panel.innerHTML = `<p>Разрешаете Яндекс Метрику для статистики посещений, источников рекламы и кликов по контактам? Вебвизор и карты кликов выключены. До разрешения Метрика не загружается. <a href="${config.notice}">Условия и текст согласия</a>.</p><div class="analytics-choice-actions"><button type="button" data-choice="allow">Разрешить аналитику</button><button type="button" data-choice="deny">Без аналитики</button></div><p class="analytics-error" hidden role="status">Не удалось сохранить выбор. На этой странице аналитика выключена; перед следующим посещением проверьте выбор снова.</p>`;
    panel.addEventListener("click", event => {
      const button = event.target.closest("button[data-choice]");
      if (!button) return;
      const choice = button.dataset.choice;
      if (choice === "deny") stop(); // Revoke first, even if localStorage.setItem throws.
      if (!saveChoice(choice)) {
        stop(false);
        panel.querySelector(".analytics-error").hidden = false;
        return; // Never reload into a stale stored "allow".
      }
      panel.querySelector(".analytics-error").hidden = true;
      panel.hidden = true;
      panelSpace.hidden = true;
      if (choice === "allow") {
        clearFallbackDenied();
        if (started || revoked) location.reload();
        else start();
      } else if (started) location.reload();
    });
    document.body.appendChild(panel);
    panelSpace = document.createElement("div");
    panelSpace.setAttribute("aria-hidden", "true");
    panelSpace.dataset.dinarConsentSpace = "1";
    document.body.appendChild(panelSpace);
    reservePanelSpace();
    if (typeof ResizeObserver === "function") new ResizeObserver(reservePanelSpace).observe(panel);
    else window.addEventListener("resize", reservePanelSpace);
  }

  function reservePanelSpace() {
    if (!panelSpace) return;
    panelSpace.hidden = panel.hidden;
    if (!panel.hidden) panelSpace.style.height = `${Math.ceil(panel.getBoundingClientRect().height) + 24}px`;
  }

  function channelOf(link) {
    const href = (link.getAttribute("href") || "").trim();
    if (/^tel:/i.test(href)) return "phone";
    if (/^mailto:/i.test(href)) return "email";
    try {
      const url = new URL(href, location.href);
      if (url.hostname === "t.me" || url.hostname === "telegram.me") return "telegram";
      if (url.hostname === "max.ru") return "max";
    } catch { /* No contact link. */ }
    return null;
  }

  document.addEventListener("click", event => {
    if (!active || readChoice() !== "allow") return;
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const channel = channelOf(link);
    if (channel && config.contactGoal) {
      window.ym(config.counterId, "reachGoal", config.contactGoal, { channel, page: safePath });
    } else if (!channel && config.contentGoal) {
      const target = new URL(link.href);
      const path = target.pathname;
      if (link.matches("[data-photo]") && /hudwagen\.ru$/.test(location.hostname)) {
        window.ym(config.counterId, "reachGoal", config.contentGoal, { type: "gallery", page: safePath });
      } else if (target.origin === location.origin && path !== safePath &&
          /^\/[a-z0-9/_.-]*$/i.test(path) && !/\d{7,}/.test(path) &&
          config.contentPaths.some(prefix => path.startsWith(prefix))) {
        window.ym(config.counterId, "reachGoal", config.contentGoal, { type: "page", path });
      }
    }
  });

  function ready() {
    const choice = readChoice();
    window[disableKey] = choice !== "allow";
    const footer = document.querySelector("footer, .footer-note, .privacy-footer") || document.body;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "analytics-settings";
    button.textContent = "Настройки аналитики";
    button.addEventListener("click", showPanel);
    footer.appendChild(button);
    if (choice === "allow") start();
    else if (choice === null) showPanel();
  }
  window.addEventListener("storage", event => {
    if (event.key !== key) return;
    if (readChoice() !== "allow") { stop(false, readChoice() === "deny"); if (readChoice() === null) showPanel(); }
    else if (!started) start();
  });
  if (channel) channel.onmessage = event => {
    if (event.data === "deny") stop(false);
  };
  document.addEventListener("visibilitychange", () => {
    if (active && readChoice() !== "allow") { stop(false, readChoice() === "deny"); showPanel(); }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})();
