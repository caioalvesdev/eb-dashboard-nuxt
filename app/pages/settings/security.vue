<script setup lang="ts">
import * as z from "zod";
import type { FormError } from "@nuxt/ui";

const isOpen = ref(false);
const loading = ref(false);
const toast = useToast();

const passwordSchema = z.object({
  current: z
    .string("Campo obrigatório")
    .min(8, "Deve ter pelo menos 8 caracteres"),
  new: z.string("Campo obrigatório").min(8, "Deve ter pelo menos 8 caracteres"),
});

type PasswordSchema = z.output<typeof passwordSchema>;

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined,
});

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = [];
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: "new", message: "As senhas devem ser diferentes" });
  }
  return errors;
};
definePageMeta({
  // middleware: "auth",
  layout: "dashboard-default",
});

const handleDeleteAccount = async () => {
  try {
    loading.value = true;
    // await deleteAccount();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.add({ title: "Conta excluída com sucesso" });
  } catch (error: any) {
    toast.add({
      title: "Erro ao excluir conta",
      description: error.message,
      color: "error",
    });
  } finally {
    loading.value = false;
    isOpen.value = false;
  }
};
</script>

<template>
  <UPageCard
    class="lg:max-w-2xl mx-auto w-full"
    title="Senha"
    description="Confirme sua senha atual antes de definir uma nova."
    variant="subtle"
  >
    <UForm
      disabled
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="Senha atual"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="Nova senha"
          class="w-full"
        />
      </UFormField>

      <UButton
        disabled
        label="Atualizar"
        color="neutral"
        class="w-fit"
        type="submit"
      />
    </UForm>
  </UPageCard>

  <UPageCard
    title="Conta"
    description="Não quer mais usar nosso serviço? Você pode excluir sua conta aqui. Esta ação é irreversível. Todas as informações relacionadas a esta conta serão excluídas permanentemente."
    class="bg-linear-to-tl from-error/10 from-5% to-default lg:max-w-2xl mx-auto w-full"
  >
    <template #footer>
      <UModal
        v-model:open="isOpen"
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir sua conta? Esta ação é
              irreversível"
      >
        <UButton label="Deletar conta" color="error" />
        <template #footer>
          <div class="flex gap-2 justify-end w-full">
            <UButton
              variant="outline"
              @click="isOpen = false"
              :disabled="loading"
            >
              Cancelar
            </UButton>
            <UButton
              color="error"
              @click="handleDeleteAccount"
              :loading="loading"
            >
              Excluir Permanentemente
            </UButton>
          </div>
        </template>
      </UModal>
    </template>
  </UPageCard>
</template>
