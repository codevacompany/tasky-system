import { isTrackingEnabled } from '@/utils/gtm';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushDataLayer(payload: Record<string, unknown>): void {
  if (!isTrackingEnabled() || typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  pushDataLayer({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
  });
}

/** Fires after signup API succeeds — actual conversion (not CTA intent). */
export function trackSignUpSuccess(eventLabel = 'Cadastro concluído'): void {
  pushDataLayer({
    event: 'sign_up',
    method: 'formulario',
    event_label: eventLabel,
  });
}
