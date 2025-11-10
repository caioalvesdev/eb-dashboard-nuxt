<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { ChartData } from "chart.js";
import { Line } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    data?: MaybeRef<T[]>;
    index: string;
    categories?: (keyof T)[];
  }>(),
  {
    title: "Gráfico de Pizza",
    description: "Este é um gráfico de pizza de exemplo.",
    data: () => [],
    categories: () => ["semana"],
  }
);
const lineChart = useChart<"line">({
  decorator: (options) => {
    options.plugins!.legend!.display = true;
    options.maintainAspectRatio = true;
    options.plugins!.legend!.align = "end";
    options.plugins!.legend!.position = "top";
    // options.responsive = true;
    options.scales!.x!.ticks!.display = true;
    options.scales!.y!.ticks!.display = true;
  },
});

// Normalized raw data (array)
const rawData = computed(() => unref(props.data) || []);

// Labels for the x-axis derived from the `index` prop (e.g. "Semana 1", "Semana 2")
const labels = computed(() => {
  return rawData.value.map((item) => {
    const idx = item[props.index];
    const name = `${
      props.index?.charAt(0).toUpperCase() + props.index?.slice(1)
    } ${idx}`;
    return String(name);
  });
});

// Build datasets from categories: one dataset per category with data values across labels
const datasets = computed(() => {
  const cats = (props.categories || []) as (keyof T)[];
  return cats.map((cat, i) => {
    // map values for this category across all items
    const data = rawData.value.map((item) => {
      const v = item[cat];
      // try to coerce numeric-like strings to numbers
      const n =
        typeof v === "string" ? Number(String(v).replace(/[^0-9.-]+/g, "")) : v;
      return typeof n === "number" && !Number.isNaN(n) ? (n as number) : 0;
    });

    // choose a color shade based on index to differentiate datasets
    const shadeSteps = [300, 400, 500, 600, 700];
    const shade = shadeSteps[i % shadeSteps.length];

    return {
      label: String(cat),
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-${shade}`),
      fill: false,
      borderWidth: 3,
      pointBackgroundColor: cssColor(
        `--color-${appConfig.ui.colors.primary}-${shade}`
      ),
      pointBorderColor: cssColor(
        `--color-${appConfig.ui.colors.primary}-${shade}`
      ),
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.2,
      data,
      animation: {
        duration: 1500,
      },
    } as any;
  });
});
const appConfig = useAppConfig();
const lineData = computed<ChartData<"line">>(() => ({
  labels: labels.value,
  datasets: datasets.value,
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
        <!-- {{ chartData }} -->
        <!-- {{ props.data }} -->
        <p class="text-xs text-muted uppercase mb-1.5">{{ props.title }}</p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ props.description }}
        </p>
      </template>
      <div class="relative w-full h-[400px]">
        <Line
          :style="{ width: '100%', height: '100%' }"
          :data="lineData"
          :options="lineChart.options.value"
        />
      </div>
    </UCard>
  </ClientOnly>
</template>
