<script setup lang="ts">
const { y, arrivedState } = useWindowScroll();
const showScrollTop = computed(() => y.value > 200);
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
<template>
  <transition name="fade">
    <UButton
      icon="i-lucide-arrow-up"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 rounded-lg shadow-lg"
      variant="ghost"
    />
  </transition>
</template>
