<script setup lang="ts">
import type { DropdownMenuItem, FormSubmitEvent, TabsItem } from "@nuxt/ui";
import { sub } from "date-fns";
import * as z from "zod";

definePageMeta({
  layout: "dashboard-default",
  scrollToTop: true,
});

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

const toast = useToast();

const isOpenUploadModal = ref<boolean>(false);
const isLoadingUpload = ref<boolean>(false);
const range = shallowRef<any>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<any>("Diário");
const data = ref<TabsItem[]>([
  {
    label: "Renovação",
    value: "renovacao",
    content: "This is the account content.",
    slot: "renovacao",
  },
  {
    label: "Base de alunos info",
    value: "base-alunos-info",
    content: "This is the password content.",
    slot: "base-alunos-info",
  },
  {
    label: "Gestão de Contratos MBA",
    value: "gestao-contratos-mba",
    content: "This is the password content.",
    slot: "gestao-contratos-mba",
  },
  {
    label: "Carteira MBA",
    value: "carteira-mba",
    content: "This is the password content.",
    slot: "carteira-mba",
  },
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  );
};

const validationSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Por favor, selecione um arquivo.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `O arquivo é muito grande. Escolha um arquivo menor que ${formatBytes(
        MAX_FILE_SIZE
      )}.`,
    })
    .refine(
      (file) => {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        const validMimeTypes = [
          "text/csv",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        const validExtensions = [".csv", ".xlsx", ".xls"];

        const hasValidMime = validMimeTypes.includes(fileType);
        const hasValidExtension = validExtensions.some((ext) =>
          fileName.endsWith(ext)
        );

        return hasValidMime || hasValidExtension;
      },
      {
        message:
          "Por favor, faça upload de um arquivo válido (CSV, XLS ou XLSX).",
      }
    )
    .refine((file) => file.size > 0, {
      message: "O arquivo não pode estar vazio.",
    }),
});

type validationSchema = z.output<typeof validationSchema>;

const formState = reactive<Partial<validationSchema>>({
  file: undefined,
});

const downloadTemplateLoading = ref<boolean>(false);

async function handleDownloadTemplate() {
  try {
    downloadTemplateLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const templateUrl = "/templates/template.xlsx";

    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString("pt-BR", {
      month: "long",
    });
    const year = currentDate.getFullYear();

    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = `template_${monthName}_${year}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.add({
      title: "Sucesso",
      description: "Template baixado com sucesso!",
      icon: "i-lucide-check",
    });
  } catch (error) {
    toast.add({
      title: "Erro",
      description: "Ocorreu um erro ao baixar o template.",
      icon: "i-lucide-x-circle",
      color: "error",
    });
  } finally {
    downloadTemplateLoading.value = false;
  }
}

const value = ref<number>(0);

async function onSubmit(event: FormSubmitEvent<validationSchema>) {
  try {
    isLoadingUpload.value = true;
    value.value = 0;
    await new Promise((resolve) => setTimeout(resolve, 500));
    value.value = 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    value.value = 2;
    await new Promise((resolve) => setTimeout(resolve, 500));
    value.value = 3;
    await new Promise((resolve) => setTimeout(resolve, 500));

    value.value = 4;
    const formData = new FormData();
    formData.append("file", event.data.file);
    await $fetch("/api/dashboard/upload", {
      method: "POST",
      body: formData,
    });

    toast.add({
      title: "Sucesso",
      description: "Arquivo carregado com sucesso!",
      icon: "i-lucide-check",
    });
    isOpenUploadModal.value = false;
    formState.file = undefined;
    await stackFetches();
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Erro",
      description: "Ocorreu um erro ao carregar o arquivo.",
      icon: "i-lucide-x-circle",
      color: "error",
    });
  } finally {
    isLoadingUpload.value = false;
  }
}

const {
  data: renovacao,
  refresh: refreshRenovacao,
  pending: pendingRenovacao,
} = await useFetch("/api/dashboard/renovacao", {
  key: "renovacao",
  query: { month: 11, year: 2025 },
  method: "GET",
  default: () => [],
  transform: (data: any) => data.data || [],
});

const {
  data: baseAlunosInfo,
  refresh: refreshBaseAlunosInfo,
  pending: pendingBaseAlunosInfo,
} = await useFetch("/api/dashboard/base-alunos-info", {
  key: "base-alunos-info",
  query: { month: 11, year: 2025 },
  method: "GET",
  default: () => [],
  transform: (data: any) => data.data || [],
});

const {
  data: carteiraMba,
  refresh: refreshCarteiraMba,
  pending: pendingCarteiraMba,
} = await useFetch("/api/dashboard/carteira-mba", {
  key: "carteira-mba",
  query: { month: 11, year: 2025 },
  method: "GET",
  default: () => [],
  transform: (data: any) => data.data || [],
});

const {
  data: gestaoContratosMba,
  refresh: refreshGestaoContratosMba,
  pending: pendingGestaoContratosMba,
} = await useFetch("/api/dashboard/gestao-contratos-mba", {
  key: "gestao-contratos-mba",
  query: { month: 11, year: 2025 },
  method: "GET",
  default: () => [],
  transform: (data: any) => data.data || [],
});

const active = ref<string>("renovacao");

const pending = computed(
  () =>
    pendingRenovacao.value ||
    pendingBaseAlunosInfo.value ||
    pendingGestaoContratosMba.value ||
    pendingCarteiraMba.value
);

async function stackFetches() {
  await Promise.all([
    refreshRenovacao(),
    refreshBaseAlunosInfo(),
    refreshGestaoContratosMba(),
    refreshCarteiraMba(),
  ]);
}
async function handleRefreshData() {
  await stackFetches();
  toast.add({
    title: "Atualizado",
    description: "Os dados foram atualizados com sucesso.",
    duration: 2500,
  });
}
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

      <UDashboardToolbar :ui="{ right: 'gap-3' }">
        <template #left>
          <DashboardHomeDateRangePicker v-model="range" class="-ms-1" />

          <DashboardHomePeriodSelect v-model="period" :range="range" />
        </template>

        <template #right>
          <UButton
            label="Recarregar"
            variant="soft"
            icon="i-lucide-refresh-cw"
            :loading="pending"
            :disable="pending"
            @click="handleRefreshData"
          />
          <UButton
            label="Baixar template"
            variant="outline"
            icon="i-lucide-download-cloud"
            :loading="downloadTemplateLoading"
            :disable="downloadTemplateLoading"
            @click="handleDownloadTemplate"
          />
          <UModal
            v-model:open="isOpenUploadModal"
            :ui="{ footer: 'justify-end' }"
            title="Upload de arquivo"
            description="Faça o upload do seu arquivo CSV ou XLSX"
          >
            <UButton
              label="Upload"
              variant="solid"
              icon="i-lucide-upload-cloud"
            />

            <template #body>
              <UProgress
                class="mb-2"
                v-if="isLoadingUpload"
                v-model="value"
                :max="[
                  'Aguardando...',
                  'Clonando...',
                  'Migrando...',
                  'Implantando...',
                  'Concluído!',
                ]"
              />
              <UForm
                :disabled="isLoadingUpload"
                :schema="validationSchema"
                :state="formState"
                class="space-y-4"
                @submit="onSubmit"
              >
                <UFormField name="file">
                  <UFileUpload
                    :disabled="isLoadingUpload"
                    :file-delete="!isLoadingUpload"
                    v-model="formState.file"
                    label="Selecione ou arraste um arquivo"
                    description="CSV, XLS, XLSX (max. 10MB)"
                    accept=".csv,.xls,.xlsx"
                    class="min-h-48 select-none"
                  />
                </UFormField>

                <div class="w-full flex justify-end">
                  <UButton
                    :disabled="isLoadingUpload"
                    :loading="isLoadingUpload"
                    type="submit"
                    label="Upload"
                  />
                </div>
              </UForm>
            </template>
          </UModal>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="mx-5 mt-5">
        <DashboardHeading
          icon="mdi:chart-line"
          title="MBA"
          description="Carregue seus arquivos Excel ou CSV para criar gráficos interativos"
        />

        <UTabs
          unmount-on-hide
          data-allow-mismatch
          :items="data"
          class="w-full"
          v-model="active"
        >
          <template #renovacao>
            <UPageGrid :ui="{ base: 'grid grid-cols-12' }" class="mt-4">
              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Meta vs Valor Realizado"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'meta_valor']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Meta vs Valor Realizado"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'meta_valor']"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Média Porcentagem de Contratos Atingida"
                :data="(renovacao as any)"
                index="semana"
                category="porcentagem_contratos"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Valores Cancelados por Semana"
                :data="(renovacao as any)"
                index="semana"
                category="valores_cancelados"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Quantidade Cancelada por Semana"
                :data="(renovacao as any)"
                index="semana"
                category="quantidade_cancelados"
              />

              <AppChartLine
                class="col-span-full xl:col-span-8"
                title="Evolução de Performance"
                :data="(renovacao as any)"
                index="semana"
                :categories="[
                  'meta_valor',
                  'valor_realizado',
                  'valores_cancelados',
                ]"
              />

              <AppChartLine
                class="col-span-full xl:col-span-4"
                title="Evolução da Eficiência (%)"
                :data="(renovacao as any)"
                index="semana"
                :categories="['porcentagem_contratos']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Realizados vs Cancelados (Valores)"
                :data="(renovacao as any)"
                index="semana"
                :categories="['valor_realizado', 'valores_cancelados']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Realizados vs Cancelados (Quantidade)"
                :data="(renovacao as any)"
                index="semana"
                :categories="['quantidade_realizada', 'quantidade_cancelados']"
              />

              <AppChartArea
                class="col-span-full xl:col-span-12"
                title="Visão Geral da Performance de Renovação"
                :data="(renovacao as any)"
                index="semana"
                :categories="[
                  'meta_valor',
                  'valor_realizado',
                  'valores_cancelados',
                  'meta_contratos',
                ]"
              />
            </UPageGrid>
          </template>

          <template #base-alunos-info>
            <UPageGrid :ui="{ base: 'grid grid-cols-12' }" class="mt-4">
              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="Master: Ativo vs Inativo"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="['master_ativo', 'master_inativo']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="Pleno: Ativo vs Inativo"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="['pleno_ativo', 'pleno_inativos']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="Senior: Ativo vs Inativo"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="['senior_ativo', 'senior_inativo']"
              />

              <AppChartLine
                class="col-span-full xl:col-span-6"
                title="Evolução dos Ativos"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="['master_ativo', 'pleno_ativo', 'senior_ativo']"
              />

              <AppChartLine
                class="col-span-full xl:col-span-6"
                title="Evolução dos Inativos"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="[
                  'master_inativo',
                  'pleno_inativos',
                  'senior_inativo',
                ]"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="EB Skills Basic"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="[
                  'eb_skills_basic_ativos',
                  'eb_skills_basic_inativos',
                ]"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="EB Skills Completo"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="[
                  'eb_skills_completo_ativos',
                  'eb_skills_completo_inativos',
                ]"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="EB Skills Tira Dúvidas"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="[
                  'eb_skills_tira_duvidas_ativos',
                  'eb_skills_tira_duvidas_inativos',
                ]"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="EB Skills Cursos"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="[
                  'eb_skills_cursos_ativos',
                  'eb_skills_cursos_inativos',
                ]"
              />

              <AppChartLine
                class="col-span-full xl:col-span-8"
                title="Evolução: Ativos vs Inativos"
                :data="(baseAlunosInfo as any)"
                index="semana"
                :categories="['total_ativos', 'total_inativos']"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Porcentagem de Ativos"
                :data="(baseAlunosInfo as any)"
                index="semana"
                category="porcentagem_ativos"
              />
            </UPageGrid>
          </template>

          <template #gestao-contratos-mba>
            <UPageGrid :ui="{ base: 'grid grid-cols-12' }" class="mt-4">
              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="RH: Assinados vs Pendentes"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['rh_assinados', 'rh_pendente']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="NR1: Assinados vs Pendentes"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['nr1_assinados', 'nr1_pendente']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="DP: Assinados vs Pendentes"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['dp_assinados', 'dp_pendente']"
              />

              <AppChartLine
                class="col-span-full xl:col-span-8"
                title="Evolução de Contratos Assinados por Departamento"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['rh_assinados', 'nr1_assinados', 'dp_assinados']"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Porcentagem Total de Assinados"
                :data="(carteiraMba as any)"
                index="semana"
                category="total_percentual"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Total: Assinados vs Pendentes"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['total_assinados', 'total_pendentes']"
              />

              <AppChartLine
                class="col-span-full xl:col-span-6"
                title="Evolução de Contratos Pendentes"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['rh_pendente', 'nr1_pendente', 'dp_pendente']"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Eficiência RH (%)"
                :data="(gestaoContratosMba as any)"
                index="semana"
                category="rh_percentual"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Eficiência NR1 (%)"
                :data="(gestaoContratosMba as any)"
                index="semana"
                category="nr1_percentual"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Eficiência DP (%)"
                :data="(gestaoContratosMba as any)"
                index="semana"
                category="dp_percentual"
              />

              <AppChartLine
                class="col-span-full xl:col-span-12"
                title="Comparativo de Eficiência por Departamento"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="[
                  'rh_percentual',
                  'nr1_percentual',
                  'dp_percentual',
                ]"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Volume RH por Semana"
                :data="(gestaoContratosMba as any)"
                index="semana"
                category="rh_assinados"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Volume NR1 por Semana"
                :data="(gestaoContratosMba as any)"
                index="semana"
                category="nr1_assinados"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Volume DP por Semana"
                :data="(gestaoContratosMba as any)"
                index="semana"
                category="dp_assinados"
              />

              <AppChartArea
                class="col-span-full xl:col-span-8"
                title="Evolução de Volume de Contratos"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="['rh_assinados', 'nr1_assinados', 'dp_assinados']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="Performance por Departamento"
                :data="(gestaoContratosMba as any)"
                index="semana"
                :categories="[
                  'rh_percentual',
                  'nr1_percentual',
                  'dp_percentual',
                ]"
              />
            </UPageGrid>
          </template>

          <template #carteira-mba>
            <UPageGrid :ui="{ base: 'grid grid-cols-12' }" class="mt-4">
              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Alunos MBA por Departamento"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="[
                  'alunos_mba_rh',
                  'alunos_mba_nr1',
                  'alunos_mba_dp',
                ]"
              />

              <AppChartPie
                class="col-span-full xl:col-span-6"
                title="Total de Alunos por Semana"
                :data="(carteiraMba as any)"
                index="semana"
                category="alunos_total"
              />

              <AppChartBar
                class="col-span-full xl:col-span-8"
                title="Valores MBA por Departamento"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="['valor_mba_nr1', 'valor_mba_dp']"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Média Porcentagem de Contratos Atingida"
                :data="(carteiraMba as any)"
                index="semana"
                category="valor_total"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="Alunos vs Cancelados"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="['alunos_total', 'cancelados']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-4"
                title="Valores vs Cancelados"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="['valor_total', 'valores_cancelados']"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Valores Cancelados"
                :data="(carteiraMba as any)"
                index="semana"
                category="valores_cancelados"
              />

              <AppChartLine
                class="col-span-full xl:col-span-6"
                title="Churn de Alunos (%)"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="['churn_alunos']"
              />

              <AppChartLine
                class="col-span-full xl:col-span-6"
                title="Churn de Valores (%)"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="['churn_valores']"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-3"
                title="% Cancelamento Alunos"
                :data="(carteiraMba as any)"
                index="semana"
                category="percentual_cancelados_alunos"
              />

              <AppChartDoughnut
                class="col-span-full xl:col-span-3"
                title="% Cancelamento Valores"
                :data="(carteiraMba as any)"
                index="semana"
                category="percentual_cancelados_valores"
              />

              <AppChartLine
                class="col-span-full xl:col-span-6"
                title="Comparativo Churn"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="['churn_alunos', 'churn_valores']"
              />

              <AppChartArea
                class="col-span-full xl:col-span-12"
                title="Evolução Geral da Carteira MBA"
                :data="(carteiraMba as any)"
                index="semana"
                :categories="[
                  'alunos_total',
                  'valor_total',
                  'cancelados',
                  'valores_cancelados',
                ]"
              />
            </UPageGrid>
          </template>
        </UTabs>
      </div>
    </template>
  </UDashboardPanel>
</template>
