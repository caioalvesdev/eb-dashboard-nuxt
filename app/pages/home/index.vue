<script setup lang="ts">
import { sub } from "date-fns";
import type { DropdownMenuItem, TabsItem } from "@nuxt/ui";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

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
    content: "This is the account content.",
    slot: "renovacao",
  },
  {
    label: "Base de alunos info",
    content: "This is the password content.",
    slot: "base-alunos-info",
  },
  {
    label: "Gestão de Contratos MBA",
    content: "This is the password content.",
    slot: "gestao-contratos-mba",
  },
  {
    label: "Carteira MBA",
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

const schema = z.object({
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

type schema = z.output<typeof schema>;

const state = reactive<Partial<schema>>({
  file: undefined,
});

const downloadTemplateLoading = ref<boolean>(false);

async function handleDownloadTemplate() {
  try {
    downloadTemplateLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1500));
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

async function onSubmit(event: FormSubmitEvent<schema>) {
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
    console.log(event.data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.add({
      title: "Sucesso",
      description: "Arquivo carregado com sucesso!",
      icon: "i-lucide-check",
    });
    isOpenUploadModal.value = false;
    state.file = undefined;
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

const { data: renovacao } = await useAsyncData("renovacao-data", async () => {
  const { data, error } = await useFetch("/api/dashboard/renovacao", {
    method: "GET",
    query: { month: 11, year: 2025 },
    default: () => [],
    transform: (data) => data.data,
  });

  if (error.value) {
    console.error("Erro ao buscar dados de renovação:", error.value.message);
  }
  return data;
});
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
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit"
              >
                <UFormField name="file">
                  <UFileUpload
                    :disabled="isLoadingUpload"
                    :file-delete="!isLoadingUpload"
                    v-model="state.file"
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

        <UTabs :items="data" class="w-full">
          <template #renovacao>
            <UPageGrid :ui="{ base: 'grid grid-cols-12' }" class="mt-4">
              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Meta vs Valor Realizado"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'meta_valor']"
              />
              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Meta vs Valor Realizado"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'meta_valor']"
              />
              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Média Porcentagem de Contratos Atingida"
                :data="(renovacao as any)"
                category="porcentagem_contratos"
              />
              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Valores Cancelados por Semana"
                :data="(renovacao as any)"
                category="valores_cancelados"
              />
              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Quantidade Cancelada por Semana"
                :data="(renovacao as any)"
                category="quantidade_cancelados"
              />
              <AppChartLine
                class="col-span-full xl:col-span-8"
                title="Evolução de Performance"
                description="R$ 1900,00"
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
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['porcentagem_contratos']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Realizados vs Cancelados (Valores)"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['valor_realizado', 'valores_cancelados']"
              />

              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Realizados vs Cancelados (Quantidade)"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['quantidade_realizada', 'quantidade_cancelados']"
              />

              <AppChartArea
                class="col-span-full xl:col-span-12"
                title="Visão Geral da Performance de Renovação"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'valores_cancelados', 'meta_contratos']"
              />
            </UPageGrid>
          </template>
          <template #base-alunos-info>
            <UPageGrid :ui="{ base: 'grid grid-cols-12' }" class="mt-4">
              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Meta vs Valor Realizado"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'meta_valor']"
              />
              <AppChartBar
                class="col-span-full xl:col-span-6"
                title="Meta vs Valor Realizado"
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['meta_valor', 'valor_realizado', 'meta_valor']"
              />
              <AppChartDoughnut
                class="col-span-full xl:col-span-4"
                title="Média Porcentagem de Contratos Atingida"
                :data="(renovacao as any)"
                category="porcentagem_contratos"
              />
              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Valores Cancelados por Semana"
                :data="(renovacao as any)"
                category="valores_cancelados"
              />
              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Quantidade Cancelada por Semana"
                :data="(renovacao as any)"
                category="quantidade_cancelados"
              />
              <AppChartLine
                class="col-span-full xl:col-span-8"
                title="Evolução de Performance"
                description="R$ 1900,00"
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
                description="R$ 1900,00"
                :data="(renovacao as any)"
                index="semana"
                :categories="['porcentagem_contratos']"
              />
              <!-- <AppChartArea
                class="col-span-full xl:col-span-4"
                title="Alunos ChartArea"
                description="R$ 3050,00"
              /> -->

              <AppChartPolar
                class="col-span-full xl:col-span-4"
                title="Alunos ChartDoughnut"
                description="R$ 3050,00"
              />

              <AppChartPie
                class="col-span-full xl:col-span-4"
                title="Alunos ChartPie"
                description="R$ 3050,00"
              />
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
    </template>
  </UDashboardPanel>
</template>
