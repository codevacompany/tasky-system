import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  FEATURE_TIP_ATTR,
  FEATURE_TIPS,
  type FeatureTipDefinition,
} from '@/feature-tips/registry';
import { featureTipService } from '@/services/featureTipService';
import { useUserStore } from '@/stores/user';

function isElementVisible(el: Element): boolean {
  const htmlEl = el as HTMLElement;
  if (htmlEl.offsetParent === null && getComputedStyle(htmlEl).position !== 'fixed') {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export const useFeatureTipsStore = defineStore('featureTips', () => {
  const seenTipIds = ref<Set<string>>(new Set());
  const activeTipId = ref<string | null>(null);
  const markingTipId = ref<string | null>(null);

  const activeTip = computed(() => {
    if (!activeTipId.value) return null;
    return FEATURE_TIPS.find((tip) => tip.id === activeTipId.value) ?? null;
  });

  const syncFromUser = (ids: string[] | undefined | null) => {
    seenTipIds.value = new Set(ids ?? []);
    if (activeTipId.value && seenTipIds.value.has(activeTipId.value)) {
      activeTipId.value = null;
    }
  };

  const isTipEligibleForUser = (tip: FeatureTipDefinition): boolean => {
    if (seenTipIds.value.has(tip.id)) return false;

    const userStore = useUserStore();
    const user = userStore.user;
    if (!user) return false;

    const now = Date.now();
    const releasedAt = parseDate(tip.releasedAt);
    if (!releasedAt || now < releasedAt.getTime()) return false;

    if (tip.expiresAt) {
      const expiresAt = parseDate(tip.expiresAt);
      if (expiresAt && now >= expiresAt.getTime()) return false;
    }

    const userCreatedAt = parseDate(user.createdAt ?? null);
    if (!userCreatedAt || userCreatedAt.getTime() >= releasedAt.getTime()) return false;

    if (tip.roles?.length) {
      const roleName = user.role?.name;
      if (!roleName || !tip.roles.includes(roleName)) return false;
    }

    return true;
  };

  const findAnchor = (tipId: string): HTMLElement | null => {
    // Quoted attribute value — do not CSS.escape() (dots are fine inside quotes)
    const el = document.querySelector(`[${FEATURE_TIP_ATTR}="${tipId}"]`);

    if (!el || !(el instanceof HTMLElement)) return null;

    if (!isElementVisible(el)) return null;
    return el;
  };

  /**
   * Independent tips (no tour order): keep the current tip while it stays eligible + anchored;
   * otherwise pick the highest-priority tip whose anchor is currently visible.
   */
  const recomputeActiveTip = () => {
    if (activeTipId.value) {
      const current = FEATURE_TIPS.find((tip) => tip.id === activeTipId.value);
      // Keep sticky tip if still eligible even if anchor briefly missing (avoids flicker)
      if (current && isTipEligibleForUser(current)) {
        if (findAnchor(current.id)) return;
        // Anchor gone (left page / modal closed) — clear and look for another tip
      }
      activeTipId.value = null;
    }

    const candidates = FEATURE_TIPS.filter(
      (tip) => isTipEligibleForUser(tip) && findAnchor(tip.id),
    ).sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

    activeTipId.value = candidates[0]?.id ?? null;
  };

  const dismissActiveTip = async () => {
    const tipId = activeTipId.value;
    if (!tipId || markingTipId.value) return;

    markingTipId.value = tipId;
    seenTipIds.value.add(tipId);
    activeTipId.value = null;

    const userStore = useUserStore();
    if (userStore.user) {
      userStore.user.seenFeatureTipIds = [...seenTipIds.value];
    }

    try {
      await featureTipService.markSeen(tipId);
    } catch {
      seenTipIds.value.delete(tipId);
      if (userStore.user) {
        userStore.user.seenFeatureTipIds = [...seenTipIds.value];
      }
    } finally {
      markingTipId.value = null;
      recomputeActiveTip();
    }
  };

  const reset = () => {
    seenTipIds.value = new Set();
    activeTipId.value = null;
    markingTipId.value = null;
  };

  return {
    seenTipIds,
    activeTipId,
    activeTip,
    markingTipId,
    syncFromUser,
    recomputeActiveTip,
    dismissActiveTip,
    findAnchor,
    reset,
  };
});
