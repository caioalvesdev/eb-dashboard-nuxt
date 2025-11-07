<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

const UBadge = resolveComponent("UBadge");
const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UPopover = resolveComponent("UPopover");
const UPageCard = resolveComponent("UPageCard");
const NuxtImg = resolveComponent("NuxtImg");
const toast = useToast();

type Member = {
  created_at: string;
  role: string;
  email: string;
  username: string;
  avatar: string;
  last_sign_in_at: string;
  full_name: string;
  email_confirmed_at: string;
  invited_at: string;
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
      return h("div", { class: "flex items-center gap-3" }, [
        h(
          UPopover,
          {
            arrow: true,
            mode: "hover",
            openDelay: 250,
            closeDelay: 100,
          },
          {
            default: () =>
              h(UAvatar, {
                ...row.original,
                size: "lg",
              }),
            content: () =>
              h(
                UPageCard,
                {
                  spotlight: true,
                },
                {
                  default: () =>
                    row.original.avatar
                      ? h(NuxtImg, {
                          class: "rounded-lg",
                          width: "300",
                          height: "300",
                          src: row.original.avatar,
                          alt: row.original.username || row.original.full_name,
                        })
                      : h(
                          "div",
                          {
                            class:
                              "w-[300px] h-[300px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg",
                          },
                          "Sem avatar"
                        ),
                }
              ),
          }
        ),
        h("div", undefined, [
          h(
            "p",
            { class: "font-medium text-highlighted" },
            row.original.username
          ),
          h("p", { class: "" }, `@${row.original.full_name}`),
        ]),
      ]);
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return h(
        UButton,
        {
          variant: "link",
          size: "sm",
          class: "px-0",
          color: "neutral",
          trailingIcon: "i-lucide-copy",
          onClick: () => {
            navigator.clipboard.writeText(row.getValue("email"));
            toast.add({
              title: "Email copiado para a área de transferência",
              icon: "i-lucide-check-circle",
            });
          },
        },
        () => row.getValue("email")
      );
    },
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
  {
    accessorKey: "invited_at",
    header: "Email convidado",
    cell: ({ row }) => {
      return new Date(row.getValue("invited_at")).toLocaleString("pt-BR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "email_confirmed_at",
    header: "Email confirmado",
    cell: ({ row }) => {
      return new Date(row.getValue("email_confirmed_at")).toLocaleString(
        "pt-BR",
        {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      );
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
