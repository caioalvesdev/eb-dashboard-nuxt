<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { ChartData } from "chart.js";
import { Pie } from "vue-chartjs";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    data?: MaybeRef<T[]>;
    index: string;
    category: keyof T;
  }>(),
  {
    title: "Gráfico de Pizza",
    description: "----",
    data: () => [],
    category: "semana" as any,
  }
);

const pieChart = useChart<"pie">({
  decorator: (options) => {
    options.plugins!.legend!.align = "center";
    options.plugins!.legend!.position = "top";
    options.scales = {};
  },
});

// Normalized raw data (array)
const rawData = computed(() => unref(props.data) || []);

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
const pieValues = computed(() => {
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
  return pieValues.value.reduce((acc, val) => acc + val, 0);
});

const appConfig = useAppConfig();
const pieData = computed<ChartData<"pie">>(() => ({
  labels: labels.value,
  datasets: [
    {
      color: appConfig.ui.colors.primary,
      borderColor: cssColor(`--color-${appConfig.ui.colors.primary}-300`),
      label: String(props.category),
      animation: {
        duration: 1500,
      },
      backgroundColor: pieValues.value.map((_, index) => {
        const shades = [200, 300, 400, 500, 600, 700, 800, 900];
        const shade = shades[index % shades.length];
        return cssColor(`--color-${appConfig.ui.colors.primary}-${shade}`);
      }),
      data: pieValues.value,
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
        <p v-if="total > 0" class="text-3xl text-highlighted font-semibold">
          {{ formattedTotal || props.description }}
        </p>
        <p class="text-3xl text-highlighted font-semibold" v-else>----</p>
      </template>

      <div class="relative w-full h-[400px]">
        <Pie :data="pieData" :options="pieChart.options.value" />
      </div>
      <!-- <div
        v-else
        class="relative w-full h-[400px] flex items-center justify-center"
      >
        <UEmpty
          variant="naked"
          icon="i-lucide-pie-chart"
          title="Nenhum dado disponível"
        />
      </div> -->
    </UCard>
  </ClientOnly>
</template>
