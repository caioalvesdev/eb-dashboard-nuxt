<script setup lang="ts">
import { sub } from "date-fns";
import type { DropdownMenuItem, TabsItem } from "@nuxt/ui";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "dashboard-default",
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
    // icon: "i-lucide-user",
    content: "This is the account content.",
    slot: "renovacao",
  },
  {
    label: "Base de alunos info",
    // icon: "i-lucide-lock",
    content: "This is the password content.",
    slot: "base-alunos-info",
  },
  {
    label: "Gestão de Contratos MBA",
    // icon: "i-lucide-lock",
    content: "This is the password content.",
    slot: "gestao-contratos-mba",
  },
  {
    label: "Carteira MBA",
    // icon: "i-lucide-lock",
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

async function onSubmit(event: FormSubmitEvent<schema>) {
  try {
    isLoadingUpload.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(event.data);
    toast.add({
      title: "Sucesso",
      description: "Arquivo carregado com sucesso!",
      icon: "i-lucide-check",
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    isOpenUploadModal.value = false;
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
              <UForm
                :disabled="isLoadingUpload"
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit"
              >
                <UFormField name="file">
                  <UFileUpload
                    v-model="state.file"
                    label="Selecione ou arraste um arquivo"
                    description="CSV, XLS, XLSX (max. 10MB)"
                    accept=".csv,.xls,.xlsx"
                    class="min-h-48"
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
              <!-- <UPlaceholder class="h-48" /> -->
              <!-- <UFileUpload
                label="Selecione ou arraste um arquivo"
                description="CSV, XLSX (max. 10MB)"
                class="min-h-48"
              /> -->
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
            <UPageGrid class="mt-4">
              <ChartPie title="Alunos ChartPie" description="R$ 3050,00" />
              <ChartArea title="Alunos ChartArea" description="R$ 3050,00" />
              <ChartBar title="Alunos ChartBar" description="R$ 3050,00" />
              <ChartDoughnut
                title="Alunos ChartDoughnut"
                description="R$ 3050,00"
              />
              <ChartLine title="Alunos ChartLine" description="R$ 1900,00" />
              <ChartPolar
                title="Alunos ChartDoughnut"
                description="R$ 3050,00"
              />
              <ChartBar title="Alunos ChartBar" description="R$ 3050,00" />
              <ChartLine title="Alunos ChartLine" description="R$ 1900,00" />
              <ChartPie title="Alunos ChartPie" description="R$ 3050,00" />
            </UPageGrid>
          </template>
          <template #base-alunos-info>
            <UPageGrid class="mt-4">
              <DashboardHomeChart
                v-for="i in 12"
                :key="i"
                :period="period"
                :range="range"
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
      <!-- <HomeStats :period="period" :range="range" /> -->
      <!-- <HomeChart :period="period" :range="range" /> -->
      <!-- <HomeSales :period="period" :range="range" /> -->
    </template>
  </UDashboardPanel>
</template>
