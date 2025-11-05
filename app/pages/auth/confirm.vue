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
    <div class="text-2xl">Waiting for login...</div>
  </UContainer>
</template>
