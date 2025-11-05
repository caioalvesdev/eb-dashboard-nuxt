<script lang="ts" setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "EB - Dashboard";
const description = "Dashboard do EB - Gerencie suas configurações e perfil";

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>
<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
