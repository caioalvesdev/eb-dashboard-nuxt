<script setup lang="ts">
import { sub } from "date-fns";
import type { DropdownMenuItem, TabsItem } from "@nuxt/ui";
// import { useUser } from "~/shared/composables/user/useUser";

definePageMeta({
  // middleware: "auth",
  layout: "dashboard-default",
});
// import type { Period, Range } from "~~/types";

// const { data: user } = await useAsyncData("profile", async () => {
//   const { data } = await client.from("profiles").select("*").single();
//   return data;
// });

// const { isNotificationsSlideoverOpen } = useDashboard();

const items = [
  [
    {
      label: "New mail",
      icon: "i-lucide-send",
      to: "/inbox",
    },
    {
      label: "New customer",
      icon: "i-lucide-user-plus",
      to: "/customers",
    },
  ],
] satisfies DropdownMenuItem[][];

const range = shallowRef<any>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<any>("daily");
const data = ref<TabsItem[]>([
  {
    label: "Account",
    icon: "i-lucide-user",
    content: "This is the account content.",
  },
  {
    label: "Password",
    icon: "i-lucide-lock",
    content: "This is the password content.",
  },
  {
    label: "Password",
    icon: "i-lucide-lock",
    content: "This is the password content.",
  },
]);
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton color="neutral" variant="ghost" square>
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <!-- <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar> -->
    </template>

    <template #body>
      <UContainer>
        <UTabs :items="data" class="w-full" />
      </UContainer>
      <!-- <HomeStats :period="period" :range="range" /> -->
      <!-- <HomeChart :period="period" :range="range" /> -->
      <!-- <HomeSales :period="period" :range="range" /> -->
    </template>
  </UDashboardPanel>
</template>
