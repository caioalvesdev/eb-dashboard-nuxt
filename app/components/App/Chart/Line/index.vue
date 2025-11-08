<script lang="ts" setup>
import type { ChartData } from "chart.js";
import { Line, Pie } from "vue-chartjs";

const props = defineProps<{
  title?: string;
  description?: string;
}>();

const lineChart = useChart<"line">({
  decorator: (options) => {
    options.plugins!.legend!.display = false;
    // Faz o gráfico ocupar todo o espaço disponível
    options.maintainAspectRatio = false;
    options.responsive = true;
    // Remove os números dos eixos
    options.scales!.x!.ticks!.display = false;
    options.scales!.y!.ticks!.display = false;
  },
});

const appConfig = useAppConfig();
const lineData = computed<ChartData<"line">>(() => ({
  labels: listGenerate(20, (i) => i.toString()),
  datasets: [
    {
      label: "Dataset",
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-500`),
      fill: false,
      borderWidth: 3,
      pointBackgroundColor: cssColor(
        `--color-${appConfig.ui.colors.primary}-500`
      ),
      pointBorderColor: cssColor(`--color-${appConfig.ui.colors.primary}-500`),
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.2,
      data: listGenerate(20, (i) => Math.random() * 100 + 20),
      animation: {
        duration: 1500,
      },
    },
  ],
}));
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
          {{ props.description }}
        </p>
      </template>
      <div class="relative w-full h-[400px]">
        <Line :data="lineData" :options="lineChart.options.value" />
      </div>
    </UCard>
  </ClientOnly>
</template>
