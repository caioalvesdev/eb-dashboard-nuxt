<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Member } from "~~/types";

defineProps<{
  members: Member[];
}>();

const items = [
  {
    label: "Editar membro",
    onSelect: () => console.log("Editar membro"),
  },
  {
    label: "Remover membro",
    color: "error" as const,
    onSelect: () => console.log("Remover membro"),
  },
] satisfies DropdownMenuItem[];
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar v-bind="member" size="md" />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.username }}
          </p>
          <p class="text-muted truncate">
            {{ (member as any)?.email }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="member.role"
          :items="['member', 'owner']"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <UDropdownMenu :items="items" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>
</template>
