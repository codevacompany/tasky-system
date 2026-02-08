import { ref } from 'vue';

export const showRichSearch = ref(false);

export function openRichSearch() {
  showRichSearch.value = true;
}

export function closeRichSearch() {
  showRichSearch.value = false;
}
