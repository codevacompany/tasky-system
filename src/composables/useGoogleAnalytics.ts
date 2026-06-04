import { onMounted } from 'vue';
import {
  GA_MEASUREMENT_ID,
  initGoogleAnalytics,
  isGoogleAnalyticsEnabled,
  trackPageView,
  trackSignUpSuccess,
} from '@/utils/googleAnalytics';

const CADASTRO_PAGE_PATH = '/cadastrar';

/** Loads GA4 and tracks page_view — use only on the public signup page. */
export function useGoogleAnalyticsSignupPage() {
  onMounted(async () => {
    if (!isGoogleAnalyticsEnabled()) return;

    await initGoogleAnalytics();
    trackPageView(CADASTRO_PAGE_PATH, 'Cadastro');
  });

  return {
    isEnabled: isGoogleAnalyticsEnabled(),
    measurementId: GA_MEASUREMENT_ID,
    trackPageView,
    trackSignUpSuccess,
  };
}
