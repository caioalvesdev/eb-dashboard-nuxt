<script lang="ts" setup>
import { useStorage } from "@vueuse/core";

const appConfig = useAppConfig();
const colorMode = useColorMode();

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "pt-BR",
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

const preferences = useStorage("preferences", {
  theme: {
    primaryColor: appConfig.ui.colors.primary,
    neutralColor: appConfig.ui.colors.neutral,
  },
  appearance: {
    colorMode: colorMode.value,
  },
});

useFaviconFromTheme();

// onMounted(() => {
//   appConfig.ui.colors.primary = preferences.value.theme.primaryColor;
//   appConfig.ui.colors.neutral = preferences.value.theme.neutralColor;
//   colorMode.preference = preferences.value.appearance.colorMode;
// });
</script>
<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
