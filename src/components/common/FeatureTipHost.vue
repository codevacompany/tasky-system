<template>
  <Teleport to="body">
    <div
      v-if="activeTip && anchorRect"
      class="fixed inset-0 z-[10000] pointer-events-none"
      aria-live="polite"
    >
      <Transition name="feature-tip">
        <div
          v-if="isRevealed"
          key="spotlight"
          class="absolute rounded-md ring-1 ring-blue-500/80 ring-offset-2 ring-offset-transparent"
          :style="spotlightStyle"
        />
      </Transition>

      <Transition name="feature-tip">
        <div
          v-if="isRevealed"
          ref="tooltipEl"
          key="tooltip"
          class="pointer-events-auto absolute w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-gray-200 bg-white p-3.5 shadow-xl dark:border-gray-600 dark:bg-gray-800"
          :style="tooltipStyle"
          role="dialog"
          :aria-label="activeTip.title"
        >
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ activeTip.title }}</p>
          <p class="mt-1 text-sm leading-snug text-gray-600 dark:text-gray-300">
            {{ activeTip.body }}
          </p>
          <div class="mt-3 flex justify-end">
            <button
              type="button"
              class="rounded-md bg-[var(--button-primary-color)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
              :disabled="!!markingTipId"
              @click="dismissActiveTip"
            >
              Entendi
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFeatureTipsStore } from '@/stores/featureTips';
import { useUserStore } from '@/stores/user';
import type { FeatureTipPlacement } from '@/feature-tips/registry';

const APPEAR_DELAY_MS = 450;
const GAP = 11;
/** Spotlight padding (4) + ring (~2) + ring-offset (~2) around the anchor */
const SPOTLIGHT_OUTSET = 8;
const VIEWPORT_PAD = 12;
/** Fallback until the tip is measured in the DOM */
const ESTIMATED_TIP_SIZE = { width: 320, height: 140 };

const featureTipsStore = useFeatureTipsStore();
const userStore = useUserStore();
const route = useRoute();

const { activeTip, markingTipId } = storeToRefs(featureTipsStore);
const { dismissActiveTip, recomputeActiveTip, findAnchor, syncFromUser } = featureTipsStore;

const anchorRect = ref<DOMRect | null>(null);
const tipSize = ref({ ...ESTIMATED_TIP_SIZE });
const tooltipEl = ref<HTMLElement | null>(null);
const isRevealed = ref(false);
const pendingRevealTipId = ref<string | null>(null);

let observer: MutationObserver | null = null;
let rafId = 0;
let measureRafId = 0;
let revealTimer: ReturnType<typeof setTimeout> | null = null;

const clearRevealTimer = () => {
  if (revealTimer != null) {
    clearTimeout(revealTimer);
    revealTimer = null;
  }
  pendingRevealTipId.value = null;
};

const measureTooltip = async () => {
  await nextTick();
  cancelAnimationFrame(measureRafId);
  measureRafId = requestAnimationFrame(() => {
    const el = tooltipEl.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      tipSize.value = { width: rect.width, height: rect.height };
    }
  });
};

const scheduleReveal = (tipId: string) => {
  if (pendingRevealTipId.value === tipId || (isRevealed.value && activeTip.value?.id === tipId)) {
    return;
  }

  clearRevealTimer();
  isRevealed.value = false;
  tipSize.value = { ...ESTIMATED_TIP_SIZE };
  pendingRevealTipId.value = tipId;

  revealTimer = setTimeout(() => {
    if (activeTip.value?.id === tipId && anchorRect.value) {
      isRevealed.value = true;
      void measureTooltip();
    }
    revealTimer = null;
    pendingRevealTipId.value = null;
  }, APPEAR_DELAY_MS);
};

const updateAnchorRect = () => {
  const tip = activeTip.value;
  if (!tip) {
    anchorRect.value = null;
    return;
  }
  const el = findAnchor(tip.id);
  anchorRect.value = el ? el.getBoundingClientRect() : null;
};

const scheduleRecompute = () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    recomputeActiveTip();
    updateAnchorRect();
    if (isRevealed.value) void measureTooltip();
  });
};

const pickPlacement = (
  preferred: FeatureTipPlacement,
  anchor: DOMRect,
  size: { width: number; height: number },
): FeatureTipPlacement => {
  const needed = GAP + SPOTLIGHT_OUTSET;
  const space = {
    top: anchor.top - VIEWPORT_PAD,
    bottom: window.innerHeight - anchor.bottom - VIEWPORT_PAD,
    left: anchor.left - VIEWPORT_PAD,
    right: window.innerWidth - anchor.right - VIEWPORT_PAD,
  };

  const fits: Record<FeatureTipPlacement, boolean> = {
    top: space.top >= size.height + needed,
    bottom: space.bottom >= size.height + needed,
    left: space.left >= size.width + needed,
    right: space.right >= size.width + needed,
  };

  if (fits[preferred]) return preferred;

  const order: FeatureTipPlacement[] =
    preferred === 'left' || preferred === 'right'
      ? ['right', 'left', 'top', 'bottom']
      : ['top', 'bottom', 'right', 'left'];

  return order.find((p) => fits[p]) ?? preferred;
};

const computePosition = (
  placement: FeatureTipPlacement,
  anchor: DOMRect,
  size: { width: number; height: number },
) => {
  const offset = GAP + SPOTLIGHT_OUTSET;
  let top = anchor.bottom + offset;
  let left = anchor.left + anchor.width / 2 - size.width / 2;

  if (placement === 'top') {
    top = anchor.top - offset - size.height;
  } else if (placement === 'left') {
    top = anchor.top + anchor.height / 2 - size.height / 2;
    left = anchor.left - offset - size.width;
  } else if (placement === 'right') {
    top = anchor.top + anchor.height / 2 - size.height / 2;
    left = anchor.right + offset;
  }

  left = Math.max(
    VIEWPORT_PAD,
    Math.min(left, window.innerWidth - size.width - VIEWPORT_PAD),
  );
  top = Math.max(
    VIEWPORT_PAD,
    Math.min(top, window.innerHeight - size.height - VIEWPORT_PAD),
  );

  return { top, left };
};

const spotlightStyle = computed(() => {
  if (!anchorRect.value) return {};
  const r = anchorRect.value;
  return {
    top: `${r.top - 4}px`,
    left: `${r.left - 4}px`,
    width: `${r.width + 8}px`,
    height: `${r.height + 8}px`,
  };
});

const tooltipStyle = computed(() => {
  if (!anchorRect.value || !activeTip.value) return {};

  const preferred = activeTip.value.placement ?? 'bottom';
  const size = {
    width: Math.min(tipSize.value.width, window.innerWidth - VIEWPORT_PAD * 2),
    height: tipSize.value.height,
  };

  const placement = pickPlacement(preferred, anchorRect.value, size);
  const { top, left } = computePosition(placement, anchorRect.value, size);

  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${Math.min(320, window.innerWidth - VIEWPORT_PAD * 2)}px`,
  };
});

watch(
  () => userStore.user?.seenFeatureTipIds,
  (ids) => {
    syncFromUser(ids);
    scheduleRecompute();
  },
  { immediate: true, deep: true },
);

watch(
  () => [route.fullPath, userStore.user?.id] as const,
  () => scheduleRecompute(),
);

watch(
  () => ({ tipId: activeTip.value?.id ?? null, hasAnchor: !!anchorRect.value }),
  ({ tipId, hasAnchor }, prev) => {
    if (!tipId || !hasAnchor) {
      clearRevealTimer();
      isRevealed.value = false;
      return;
    }

    if (tipId !== prev?.tipId) {
      scheduleReveal(tipId);
      return;
    }

    if (!isRevealed.value && pendingRevealTipId.value !== tipId) {
      scheduleReveal(tipId);
    }
  },
);

watch(isRevealed, (revealed) => {
  if (revealed) void measureTooltip();
});

const onDocumentClick = (event: MouseEvent) => {
  const tip = activeTip.value;
  if (!tip || !isRevealed.value) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = findAnchor(tip.id);
  if (!anchor) return;

  if (anchor === target || anchor.contains(target)) {
    void dismissActiveTip();
  }
};

onMounted(() => {
  syncFromUser(userStore.user?.seenFeatureTipIds);
  scheduleRecompute();

  observer = new MutationObserver(() => scheduleRecompute());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-feature-tip', 'hidden'],
  });

  window.addEventListener('resize', updateAnchorRect);
  window.addEventListener('scroll', updateAnchorRect, true);
  document.addEventListener('click', onDocumentClick, true);
});

onUnmounted(() => {
  observer?.disconnect();
  cancelAnimationFrame(rafId);
  cancelAnimationFrame(measureRafId);
  clearRevealTimer();
  window.removeEventListener('resize', updateAnchorRect);
  window.removeEventListener('scroll', updateAnchorRect, true);
  document.removeEventListener('click', onDocumentClick, true);
});
</script>

<style>
.feature-tip-enter-active {
  transition:
    opacity 280ms ease-out,
    transform 280ms ease-out;
}
.feature-tip-leave-active {
  transition:
    opacity 160ms ease-in,
    transform 160ms ease-in;
}
.feature-tip-enter-from,
.feature-tip-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.feature-tip-enter-to,
.feature-tip-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
