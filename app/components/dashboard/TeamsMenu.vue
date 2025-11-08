<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  collapsed?: boolean;
}>();

const teams = ref([
  {
    label: "EB - Treinamentos",
    avatar: {
      src: "https://ieybiwepxqfryrzkycui.supabase.co/storage/v1/object/public/avatars/avatars/81aaf46a-2ea6-4a0b-9eb6-6dcfa39257b5.png",
      alt: "Nuxt",
    },
  },
  {
    label: "EB - Marketing",
    avatar: {
      src: "https://ieybiwepxqfryrzkycui.supabase.co/storage/v1/object/public/avatars/avatars/26c824c5-8705-4606-8f1b-4e2100a4522c.png",
      alt: "NuxtHub",
    },
  },
]);
const selectedTeam = ref(teams.value[0]);

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    teams.value.map((team) => ({
      ...team,
      onSelect() {
        selectedTeam.value = team;
      },
    })),
    [
      {
        label: "Criar novo time",
        icon: "i-lucide-circle-plus",
      },
      {
        label: "Gerenciar times",
        icon: "i-lucide-cog",
      },
    ],
  ];
});
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
