<script lang="ts" setup>
import type { ChartData } from "chart.js";
import { Pie } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    data?: MaybeRef<Record<string, unknown>[]>;
    category?: string;
  }>(),
  {
    title: "Gráfico de Pizza",
    description: "Este é um gráfico de pizza de exemplo.",
    data: () => [],
    category: "semana",
  }
);

const pieChart = useChart<"pie">({
  decorator: (options) => {
    options.plugins!.legend!.align = "center";
    options.scales = {};
  },
});

const chartData = computed(() => {
  const dataArray = unref(props.data) || [];
  const field = props.category || "semana";

  const data = dataArray.map((item) => {
    return item[field] as number;
  });
  const total = data.reduce((acc, val) => acc + val, 0);
  return { data, total };
});
const appConfig = useAppConfig();
const pieData = computed<ChartData<"pie">>(() => ({
  labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
  datasets: [
    {
      color: appConfig.ui.colors.primary,
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-300`),
      label: "Valor",
      animation: {
        duration: 1500,
      },
      backgroundColor: [
        // cssColor(`--ui-primary`),
        cssColor(`--color-${appConfig.ui.colors.primary}-200`),
        cssColor(`--color-${appConfig.ui.colors.primary}-400`),
        cssColor(`--color-${appConfig.ui.colors.primary}-600`),
        cssColor(`--color-${appConfig.ui.colors.primary}-800`),
      ],
      data: chartData.value.data,
    },
  ],
}));

const formattedTotal = computed(() => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(chartData.value.total || 0);
});
</script>

<template>
  <ClientOnly>
    <UCard
      variant="subtle"
      ref="cardRef"
      :ui="{ root: 'overflow-visible', body: '!px-0 !py-2' }"
    >
      <template v-if="props.title || props.description" #header>
        <p class="text-xs text-muted uppercase mb-1.5">{{ props.title }}</p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formattedTotal || props.description }}
        </p>
      </template>

      <div class="relative w-full h-[400px]">
        <Pie :data="pieData" :options="pieChart.options.value" />
      </div>
    </UCard>
  </ClientOnly>
</template>
