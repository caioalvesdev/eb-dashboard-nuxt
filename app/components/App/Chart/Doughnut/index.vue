<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { ChartData } from "chart.js";
import { Doughnut } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    data?: MaybeRef<T[]>;
    index: string;
    category: keyof T;
  }>(),
  {
    title: "Gráfico de Doughnut",
    description: "Este é um gráfico de doughnut de exemplo.",
    data: () => [],
    category: "semana" as any,
  }
);

const doughnutChart = useChart<"doughnut">({
  decorator: (options) => {
    options.plugins!.legend!.align = "center";
    options.plugins!.legend!.position = "top";
    options.scales = {};
  },
});

// Normalized raw data (array)
const rawData = computed(() => unref(props.data) || []);

// Labels for doughnut chart derived from the `index` prop (e.g. "Semana 1", "Semana 2")
const labels = computed(() => {
  return rawData.value.map((item) => {
    const idx = item[props.index];
    const name = `${
      props.index?.charAt(0).toUpperCase() + props.index?.slice(1)
    } ${idx}`;
    return String(name);
  });
});

// Data values for the single category
const doughnutValues = computed(() => {
  return rawData.value.map((item) => {
    const v = item[props.category];
    // try to coerce numeric-like strings to numbers
    const n =
      typeof v === "string" ? Number(String(v).replace(/[^0-9.-]+/g, "")) : v;
    return typeof n === "number" && !Number.isNaN(n) ? (n as number) : 0;
  });
});

// Total for display/formatting
const total = computed(() => {
  return doughnutValues.value.reduce((acc, val) => acc + val, 0);
});

const appConfig = useAppConfig();
const doughnutData = computed<ChartData<"doughnut">>(() => ({
  labels: labels.value,
  datasets: [
    {
      color: appConfig.ui.colors.primary,
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-300`),
      label: String(props.category),
      animation: {
        duration: 1500,
      },
      backgroundColor: doughnutValues.value.map((_, index) => {
        const shades = [200, 300, 400, 500, 600, 700, 800, 900];
        const shade = shades[index % shades.length];
        return cssColor(`--color-${appConfig.ui.colors.primary}-${shade}`);
      }),
      data: doughnutValues.value,
    },
  ],
}));

const formattedTotal = computed(() => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total.value || 0);
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
