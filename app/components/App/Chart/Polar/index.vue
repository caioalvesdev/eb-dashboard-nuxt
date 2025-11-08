<script lang="ts" setup>
import type { ChartData } from "chart.js";
import { PolarArea } from "vue-chartjs";

const props = defineProps<{
  title?: string;
  description?: string;
}>();

const polarChart = useChart<"polarArea">({
  decorator: (options) => {
    // Remove os números dos eixos (scales não são usados em gráficos polar)
    options.plugins!.legend!.align = "center";
    options.scales = {};
  },
});

const appConfig = useAppConfig();
const polarData = computed<ChartData<"polarArea">>(() => ({
  labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
  datasets: [
    {
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
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-300`),
      borderWidth: 2,
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
      :ui="{ root: 'overflow-visible', body: 'px-0! py-2!' }"
    >
      <template v-if="props.title || props.description" #header>
        <p class="text-xs text-muted uppercase mb-1.5">{{ props.title }}</p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ props.description }}
        </p>
      </template>

      <div class="relative w-full h-[400px]">
        <PolarArea :data="polarData" :options="polarChart.options.value" />
      </div>
    </UCard>
  </ClientOnly>
</template>
