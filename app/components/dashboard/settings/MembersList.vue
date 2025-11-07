<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

const UBadge = resolveComponent("UBadge");
const UAvatar = resolveComponent("UAvatar");

type Member = {
  created_at: string;
  role: string;
  email: string;
  username: string;
  avatar: string;
  last_sign_in_at: string;
};

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

const columns: TableColumn<Member>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      console.log({ row });
      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          ...row.original,
          size: "lg",
        }),
        h("div", undefined, [
          h(
            "p",
            { class: "font-medium text-highlighted" },
            row.original.username
          ),
          h("p", { class: "" }, `@${row.original.username}`),
        ]),
      ]);
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const color = {
        paid: "success" as const,
        failed: "error" as const,
        refunded: "neutral" as const,
      }[row.getValue("role") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("role")
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleString("pt-BR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "last_sign_in_at",
    header: "Último acesso",
    cell: ({ row }) => {
      return new Date(row.getValue("last_sign_in_at")).toLocaleString("pt-BR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
];
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <UTable :data="members" :columns />
    <li
      v-if="false"
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
        <div class="flex gap-3">
          <!-- <UBadge variant="subtle" class="capitalize">{{ member.role }}</UBadge>
          <UBadge variant="subtle" class="capitalize">{{
            member.last_sign_in_at
          }}</UBadge>
          <UBadge variant="subtle" class="capitalize">{{
            member.created_at
          }}</UBadge> -->
          <!-- <UBadge variant="subtle" class="capitalize">{{ member }}</UBadge> -->
          <!-- <USelect
            :model-value="member.role"
            :items="['member', 'owner']"
            color="neutral"
            :ui="{ value: 'capitalize', item: 'capitalize' }"
          /> -->
        </div>

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
