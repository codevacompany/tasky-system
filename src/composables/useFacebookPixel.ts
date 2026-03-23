import { onMounted } from 'vue';

const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID || '2121993718537921';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

let initialized = false;

function loadPixelScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  return new Promise((resolve) => {
    if (window.fbq) {
      initialized = true;
      resolve();
      return;
    }

    type FbqStub = ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      push?: FbqStub;
    };
    const n: FbqStub = (window.fbq = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod(...args);
      } else {
        n.queue.push(args);
      }
    }) as FbqStub;
    if (!window._fbq) window._fbq = n;
    n.push = n;
    (n as unknown as { loaded: boolean }).loaded = true;
    (n as unknown as { version: string }).version = '2.0';
    n.queue = [];

    const t = document.createElement('script');
    t.async = true;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const s = document.getElementsByTagName('script')[0];
    s?.parentNode?.insertBefore(t, s);

    t.onload = () => {
      initialized = true;
      resolve();
    };
    t.onerror = () => resolve();
  });
}

function init(): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('init', FB_PIXEL_ID);
}

export function useFacebookPixel() {
  onMounted(async () => {
    await loadPixelScript();
    if (!initialized) return;
    init();
    window.fbq?.('track', 'PageView');
  });

  return {
    track: (eventName: string, params?: Record<string, unknown>) => {
      if (typeof window === 'undefined' || !window.fbq) return;
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
    },
    trackCustom: (eventName: string, params?: Record<string, unknown>) => {
      if (typeof window === 'undefined' || !window.fbq) return;
      window.fbq('trackCustom', eventName, params ?? {});
    },
  };
}
