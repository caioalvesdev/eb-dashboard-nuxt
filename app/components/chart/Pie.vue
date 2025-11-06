<script lang="ts" setup>
import type { ChartData } from "chart.js";
import { Pie } from "vue-chartjs";

const props = defineProps<{
  title?: string;
  description?: string;
}>();

const pieChart = useChart<"pie">({
  decorator: (options) => {
    // Remove os números dos eixos (scales não são usados em gráficos de pizza)
    options.plugins!.legend!.align = "center";
    options.scales = {};
  },
});

const appConfig = useAppConfig();
const pieData = computed<ChartData<"pie">>(() => ({
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
        // cssColor(`--ui-primary`),
        cssColor(`--color-${appConfig.ui.colors.primary}-200`),
        cssColor(`--color-${appConfig.ui.colors.primary}-400`),
        cssColor(`--color-${appConfig.ui.colors.primary}-600`),
        cssColor(`--color-${appConfig.ui.colors.primary}-800`),
      ],
      data: listGenerate(4, (i) => Math.random() * 5),
    },
  ],
}));
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
          {{ props.description }}
        </p>
      </template>
      <!-- <div class="relative w-full" :style="{ height: '30svh' }">
        <Pie :data="pieData" :options="pieChart.options.value" />
      </div> -->

      <div class="relative w-full h-[400px]">
        <Pie :data="pieData" :options="pieChart.options.value" />
      </div>
    </UCard>
  </ClientOnly>
</template>
