const rawMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

/** Set only when VITE_GA_MEASUREMENT_ID is defined in the environment. */
export const GA_MEASUREMENT_ID =
  typeof rawMeasurementId === 'string' ? rawMeasurementId.trim() : '';

export function isGoogleAnalyticsEnabled(): boolean {
  return GA_MEASUREMENT_ID.length > 0;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

let scriptLoadPromise: Promise<void> | null = null;
let initialized = false;

function loadGtagScript(): Promise<void> {
  if (!isGoogleAnalyticsEnabled()) return Promise.resolve();
  if (typeof window === 'undefined') return Promise.resolve();
  if (typeof window.gtag === 'function') return Promise.resolve();

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve) => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/** Loads gtag and configures the measurement ID (no automatic page_view). */
export async function initGoogleAnalytics(): Promise<void> {
  if (!isGoogleAnalyticsEnabled()) return;
  if (typeof window === 'undefined') return;
  await loadGtagScript();
  if (initialized || typeof window.gtag !== 'function') return;

  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
  initialized = true;
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isGoogleAnalyticsEnabled()) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

/** Fires after signup API succeeds (GA4 recommended event). */
export function trackSignUpSuccess(eventLabel = 'Cadastro concluído'): void {
  if (!isGoogleAnalyticsEnabled()) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'sign_up', {
    method: 'formulario',
    event_label: eventLabel,
    send_to: GA_MEASUREMENT_ID,
  });
}
