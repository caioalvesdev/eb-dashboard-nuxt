<script setup lang="ts">
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(
  user,
  () => {
    if (user.value) {
      const path = redirectInfo.pluck();
      return navigateTo(path || "/");
    }
  },
  { immediate: true }
);
</script>

<template>
  <UContainer class="flex flex-col items-center justify-center gap-4 p-4 h-dvh">
    <div class="flex gap-3 justify-center items-center">
      <UIcon name="i-lucide-loader" class="animate-spin text-3xl" />
      <div class="text-3xl">Autenticando...</div>
    </div>
  </UContainer>
</template>
