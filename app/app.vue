<script lang="ts" setup>
import colors from "tailwindcss/colors";

const appConfig = useAppConfig();
const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === "dark"
    ? (colors as any)[appConfig.ui.colors.neutral][900]
    : "white"
);
const radius = computed(
  () => `:root { --ui-radius: ${appConfig.theme.radius}rem; }`
);
const blackAsPrimary = computed(() =>
  appConfig.theme.blackAsPrimary
    ? `:root { --ui-primary: black; } .dark { --ui-primary: white; }`
    : ":root {}"
);

useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  style: [
    { innerHTML: radius, id: "nuxt-ui-radius", tagPriority: -2 },
    {
      innerHTML: blackAsPrimary,
      id: "nuxt-ui-black-as-primary",
      tagPriority: -2,
    },
  ],
  htmlAttrs: {
    lang: "pt-BR",
  },
});

const title = "RealmTech - Solutions";
const description =
  "Dashboard do RealmTech - Gerencie suas configurações e perfil";

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

useFaviconFromTheme();
</script>
<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" :height="2" />

    <UBanner
      id="new-release-v2"
      icon="i-lucide-rocket"
      title="RealmDash v2 foi oficialmente lançado!"
      close
    />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
  </UApp>
</template>
