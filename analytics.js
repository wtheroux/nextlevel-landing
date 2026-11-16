// Anonymous attribution shared with the player application. No names, phones or form values.
(() => {
  'use strict';
  const APP = 'https://app.nextlevel-msk.ru';
  if (location.hostname !== 'nextlevel-msk.ru' && location.hostname !== 'www.nextlevel-msk.ru') return;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const fields = { utm_source: 'utmSource', utm_medium: 'utmMedium', utm_campaign: 'utmCampaign', utm_content: 'utmContent', utm_term: 'utmTerm', yclid: 'yclid' };
  const key = 'nl_landing_attribution_v1';
  const clean = (value) => typeof value === 'string' && value.length <= 128 && /^[\p{L}\p{N} _.,:/{}()\-]+$/u.test(value) && !/\+?\d[\d ()-]{9,}\d/.test(value) ? value : undefined;
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key) || 'null'); } catch { /* Storage may be unavailable. */ }
  if (!saved || typeof saved !== 'object' || !Number.isFinite(saved.expiresAt) || saved.expiresAt < Date.now()) saved = {};
  const cookie = document.cookie.split('; ').find((part) => part.startsWith('nl_visitor='))?.slice('nl_visitor='.length);
  let visitorId = uuid.test(cookie || '') ? cookie : uuid.test(saved.visitorId || '') ? saved.visitorId : crypto.randomUUID();
  let clientId;
  let enabled = false;
  let configReady = false;
  let pendingCta = false;
  let visitReady = Promise.resolve(false);
  const attribution = {};
  const params = new URLSearchParams(location.search);
  const hasCampaign = Object.keys(fields).some((name) => params.has(name));
  for (const name of Object.keys(fields)) {
    const raw = params.get(name);
    const value = name === 'yclid' ? /^\d{1,128}$/.test(raw || '') ? raw : undefined : clean(raw);
    const previous = hasCampaign ? undefined : name === 'yclid' ? /^\d{1,128}$/.test(saved[name] || '') ? saved[name] : undefined : clean(saved[name]);
    if (value || previous) attribution[name] = value || previous;
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({ ...attribution, visitorId, expiresAt: Date.now() + 30 * 86400000 })); } catch { /* Best effort. */ }
    document.cookie = `nl_visitor=${visitorId}; Domain=nextlevel-msk.ru; Path=/; Max-Age=2592000; Secure; SameSite=Lax`;
  }
  function appUrl() {
    const url = new URL(APP);
    url.searchParams.set('nl_visitor', visitorId);
    if (clientId) url.searchParams.set('nl_client_id', clientId);
    for (const [name, value] of Object.entries(attribution)) url.searchParams.set(name, value);
    return url.href;
  }
  function send(path, body) {
    if (!enabled) return Promise.resolve(false);
    return fetch(`${APP}/api/analytics/${path}`, { method: 'POST', credentials: 'omit', mode: 'cors', keepalive: true, signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then((response) => response.ok, () => false);
  }
  function visit() {
    const body = { visitorId, ...(clientId ? { clientId } : {}) };
    for (const [name, value] of Object.entries(attribution)) body[fields[name]] = value;
    return send('visit', body);
  }
  function event(name) {
    void visitReady.then((ready) => { if (ready) return send('events', { visitorId, eventId: crypto.randomUUID(), event: name }); }).catch(() => {});
    if (typeof window.ym === 'function') window.ym(111438851, 'reachGoal', `nl_${name}`);
  }
  function trackCta() {
    if (!configReady) { pendingCta = true; return; }
    if (enabled) { visitReady = visit(); event('landing_cta'); }
  }
  function decorate(anchor) {
    try {
      const url = new URL(anchor.href);
      if (url.origin !== APP || url.pathname !== '/') return false;
      anchor.href = appUrl();
      return true;
    } catch { return false; }
  }
  window.nextLevelAnalytics = { appUrl, trackCta };
  document.querySelectorAll('a[href]').forEach(decorate);
  document.addEventListener('click', (e) => {
    const anchor = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (anchor && decorate(anchor)) trackCta();
  }, true);
  if (typeof window.ym === 'function') window.ym(111438851, 'getClientID', (id) => {
    if (!/^\d{1,32}$/.test(String(id))) return;
    clientId = String(id);
    document.querySelectorAll('a[href]').forEach(decorate);
    void visitReady.then(() => visit()).catch(() => {});
  });
  void fetch(`${APP}/api/analytics/config`, { credentials: 'omit', mode: 'cors', signal: AbortSignal.timeout(5000) }).then((r) => r.ok ? r.json() : null).then((config) => {
    configReady = true;
    enabled = config?.enabled === true;
    if (!enabled) return;
    persist(); visitReady = visit(); event('landing_view');
    if (pendingCta) event('landing_cta');
  }).catch(() => { configReady = true; });
})();
