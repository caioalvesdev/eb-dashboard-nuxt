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
    label: "Renovação",
    // icon: "i-lucide-user",
    content: "This is the account content.",
    slot: "renovacao",
  },
  {
    label: "Base de alunos info",
    // icon: "i-lucide-lock",
    content: "This is the password content.",
    slot: "base-alunos-info",
  },
  {
    label: "Gestão de Contratos MBA",
    // icon: "i-lucide-lock",
    content: "This is the password content.",
    slot: "gestao-contratos-mba",
  },
  {
    label: "Carteira MBA",
    // icon: "i-lucide-lock",
    content: "This is the password content.",
    slot: "carteira-mba",
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
      <div class="mx-5 mt-5">
        <DashboardHeading
          icon="mdi:chart-line"
          title="MBA"
          description="Carregue seus arquivos Excel ou CSV para criar gráficos interativos"
        />
        <UTabs :items="data" class="w-full">
          <template #renovacao>
            <UPageGrid class="mt-4">
              <DashboardHomeChart
                v-for="i in 12"
                :key="i"
                :period="period"
                :range="range"
              />
            </UPageGrid>
          </template>
          <template #base-alunos-info>
            <UPageGrid class="mt-4">
              <!-- <ChartLine /> -->
              <ChartPie title="Alunos ChartPie" description="R$ 3050,00" />
              <ChartLine title="Alunos ChartLine" description="R$ 1900,00" />
              <ChartBar title="Alunos ChartBar" description="R$ 3050,00" />
              <ChartBar title="Alunos ChartBar" description="R$ 3050,00" />
              <ChartLine title="Alunos ChartLine" description="R$ 1900,00" />
              <ChartPie title="Alunos ChartPie" description="R$ 3050,00" />
            </UPageGrid>
          </template>
          <template #gestao-contratos-mba>
            <div>Conteúdo da aba Gestão de Contratos</div>
          </template>
          <template #carteira-mba>
            <div>Conteúdo da aba Carteira MBA</div>
          </template>
        </UTabs>
      </div>
      <!-- <HomeStats :period="period" :range="range" /> -->
      <!-- <HomeChart :period="period" :range="range" /> -->
      <!-- <HomeSales :period="period" :range="range" /> -->
    </template>
  </UDashboardPanel>
</template>
