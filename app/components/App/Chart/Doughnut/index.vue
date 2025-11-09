<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { ChartData } from "chart.js";
import { Doughnut } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    data?: MaybeRef<T[]>;
    category?: keyof T;
  }>(),
  {
    title: "Gráfico de Pizza",
    description: "Este é um gráfico de pizza de exemplo.",
    data: () => [],
    category: "semana",
  }
);

const doughnutChart = useChart<"doughnut">({
  decorator: (options) => {
    // Remove os números dos eixos (scales não são usados em gráficos doughnut)
    options.plugins!.legend!.align = "center";
    options.responsive = true;
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
const doughnutData = computed<ChartData<"doughnut">>(() => ({
  labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
  datasets: [
    {
      color: appConfig.ui.colors.primary,
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-300`),
      label: "Dataset",
      animation: {
        duration: 1500,
      },
      backgroundColor: [
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
      :ui="{ root: 'overflow-visible', body: 'px-0! py-2!' }"
    >
      <template v-if="props.title || props.description" #header>
        <p class="text-xs text-muted uppercase mb-1.5">{{ props.title }}</p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formattedTotal || props.description }}
        </p>
      </template>

      <div class="relative w-full h-[400px]">
        <Doughnut :data="doughnutData" :options="doughnutChart.options.value" />
      </div>
    </UCard>
  </ClientOnly>
</template>
