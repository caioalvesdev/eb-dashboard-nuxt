<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useStorage } from "@vueuse/core";
import { isStringLiteralOrJsxExpression } from "typescript";

defineProps<{
  collapsed?: boolean;
}>();

const colorMode = useColorMode();
const appConfig = useAppConfig();
const preferences = useStorage("ui-preferences", {
  theme: {
    primary: appConfig.ui.colors.primary,
    neutral: appConfig.ui.colors.neutral,
    radius: appConfig.theme.radius,
    blackAsPrimary: appConfig.theme.blackAsPrimary,
  },
  appearance: {
    colorMode: colorMode.value,
  },
});

const colors = [
  "black",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
const radius = [0, 0.125, 0.25, 0.375, 0.5];
const neutrals = ["slate", "gray", "zinc", "neutral", "stone"];

const { user } = useUser();
const supabase = useSupabaseClient();

const userProfile = computed(() => {
  return {
    name: user.value?.profile?.username ?? user.value?.profile?.email ?? "",
    avatar: {
      src: user.value?.profile?.avatar_url ?? "",
      alt: user.value?.profile?.username ?? user.value?.profile?.email ?? "",
    },
  };
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: userProfile.value.name,
      avatar: userProfile.value.avatar,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Tema",
      icon: "i-lucide-palette",
      children: [
        {
          label: "Primária",
          slot: "chip",
          chip: appConfig.theme.blackAsPrimary
            ? "black"
            : appConfig.ui.colors.primary,
          content: {
            align: "center",
            collisionPadding: 16,
          },
          children: colors.map((color) => ({
            label: color,
            chip: color,
            slot: "chip",
            checked:
              (appConfig.theme.blackAsPrimary && color === "black") ||
              (appConfig.ui.colors.primary === color &&
                appConfig.theme.blackAsPrimary === false),
            type: "checkbox",
            onSelect: (e) => {
              e.preventDefault();

              if (color === "black") {
                appConfig.theme.blackAsPrimary = true;
                preferences.value.theme.blackAsPrimary = true;
              } else {
                appConfig.theme.blackAsPrimary = false;
                preferences.value.theme.blackAsPrimary = false;
                appConfig.ui.colors.primary = color;
                preferences.value.theme.primary = color;
              }
            },
          })),
        },
        {
          label: "Neutro",
          slot: "chip",
          chip:
            appConfig.ui.colors.neutral === "neutral"
              ? "old-neutral"
              : appConfig.ui.colors.neutral,
          content: {
            align: "end",
            collisionPadding: 16,
          },
          children: neutrals.map((color) => ({
            label: color,
            chip: color === "neutral" ? "old-neutral" : color,
            slot: "chip",
            type: "checkbox",
            checked: appConfig.ui.colors.neutral === color,
            onSelect: (e) => {
              e.preventDefault();

              appConfig.ui.colors.neutral = color;
              preferences.value.theme.neutral = color;
            },
          })),
        },
        {
          label: "Radius",
          slot: "chip",
          chip: radius.includes(appConfig.theme.radius)
            ? appConfig.theme.radius
            : 0.25,
          content: {
            align: "end",
            collisionPadding: 16,
          },
          children: radius.map((r) => ({
            label: String(r),
            chip: r === 0 ? "old-neutral" : r,
            slot: "chip",
            type: "checkbox",
            checked: appConfig.theme.radius === r,
            onSelect: (e) => {
              e.preventDefault();
              console.log({ r });
              appConfig.theme.radius = r;
              preferences.value.theme.radius = r;
            },
          })),
        },
      ],
    },
    {
      label: "Aparência",
      icon: "i-lucide-sun-moon",
      children: [
        {
          label: "Light",
          icon: "i-lucide-sun",
          type: "checkbox",
          checked: colorMode.value === "light",
          onSelect(e: Event) {
            e.preventDefault();

            colorMode.preference = "light";
            preferences.value.appearance.colorMode = "light";
          },
        },
        {
          label: "Dark",
          icon: "i-lucide-moon",
          type: "checkbox",
          checked: colorMode.value === "dark",
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = "dark";
              preferences.value.appearance.colorMode = "dark";
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ],

  [
    {
      label: "Log out",
      icon: "i-lucide-log-out",
      onSelect: async () => {
        await supabase.auth.signOut();
        navigateTo("/auth/signin");
      },
    },
  ],
]);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      size="xl"
      v-bind="{
        ...userProfile,
        label: collapsed ? undefined : userProfile?.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />

    <template #chip-leading="{ item }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
          :style="{
            '--chip-light': `var(--color-${(item as any).chip}-500)`,
            '--chip-dark': `var(--color-${(item as any).chip}-400)`
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
