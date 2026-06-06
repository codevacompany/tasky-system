const rawGtmId = import.meta.env.VITE_GTM_ID;

/** Set only when VITE_GTM_ID is defined in the environment (production builds). */
export const GTM_ID = typeof rawGtmId === 'string' ? rawGtmId.trim() : '';

export function isTrackingEnabled(): boolean {
  return GTM_ID.length > 0;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

let initialized = false;

/** Injects the GTM container snippet. No-op when VITE_GTM_ID is unset. */
export function initGtm(): void {
  if (!isTrackingEnabled() || typeof document === 'undefined' || initialized) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.insertBefore(script, document.head.firstChild);

  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  noscript.appendChild(iframe);
  document.body.insertBefore(noscript, document.body.firstChild);

  initialized = true;
}
