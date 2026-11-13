'use strict';

(() => {
  const key = 'nextlevel:cookie-notice:v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const banner = document.getElementById('cookieBanner');
  const info = document.getElementById('cookieSettings');
  let openedFromFooter = false;

  function alreadyRead() {
    try {
      const at = Number(localStorage.getItem(key));
      return at > 0 && at <= Date.now() && Date.now() - at < lifetime;
    } catch (_) { return false; }
  }

  function resizeBanner() {
    document.documentElement.style.setProperty('--cookie-banner-height',
      banner.hidden ? '0px' : `${banner.offsetHeight + 40}px`);
  }

  document.getElementById('cookieDismiss').addEventListener('click', () => {
    try { localStorage.setItem(key, String(Date.now())); } catch (_) { /* Storage may be blocked. */ }
    banner.hidden = true;
    resizeBanner();
    if (openedFromFooter) info.focus();
  });
  info.addEventListener('click', () => {
    openedFromFooter = true;
    banner.hidden = false;
    resizeBanner();
    document.getElementById('cookieDismiss').focus();
  });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resizeBanner).observe(banner);
  else window.addEventListener('resize', resizeBanner);
  banner.hidden = alreadyRead();
  resizeBanner();

  // This is an informational notice; closing it does not change measurement.
  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js?id=111438851';
  document.head.appendChild(script);
  window.ym(111438851, 'init', {
    clickmap: true, accurateTrackBounce: true, trackLinks: true,
    referrer: document.referrer, url: location.href,
  });
})();
