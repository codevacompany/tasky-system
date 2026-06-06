import { onMounted } from 'vue';
import { trackPageView, trackSignUpSuccess } from '@/utils/dataLayer';

const CADASTRO_PAGE_PATH = '/cadastrar';

/** Pushes signup page events to dataLayer (GTM handles tags). */
export function useSignupTracking() {
  onMounted(() => {
    trackPageView(CADASTRO_PAGE_PATH, 'Cadastro');
  });

  return {
    trackPageView,
    trackSignUpSuccess,
  };
}
