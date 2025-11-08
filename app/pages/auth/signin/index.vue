<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const supabase = useSupabaseClient();

const toast = useToast();

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Insira seu email",
    required: true,
    autocomplete: "email",
    autofocus: true,
    leadingIcon: "i-lucide-mail",
  },

  {
    name: "remember",
    label: "Lembre-se de mim",
    type: "checkbox",
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: () => {
      toast.add({ title: "Google", description: "Login com Google" });
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: () => {
      toast.add({ title: "GitHub", description: "Login com GitHub" });
    },
  },
];

const schema = z.object({
  email: z.email("Email inválido"),
});

type Schema = z.output<typeof schema>;
const runtimeConfig = useRuntimeConfig();

const loading = ref<boolean>(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    const { data } = event;
    const { error } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: runtimeConfig.public.redirectUrl,
        shouldCreateUser: false,
        data: { role: "admin" },
      },
    });
    if (error) console.log(error);
    navigateTo("/auth/pending");
  } catch (error) {
    console.log("Error", error);
  } finally {
    loading.value = false;
  }
}
definePageMeta({
  layout: "auth-default",
});
</script>
<template>
  <UContainer class="flex flex-col items-center justify-center gap-4 p-4 h-dvh">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :loading
        :disabled="loading"
        :schema="schema"
        :submit="{ label: 'Entrar' }"
        title="Login"
        description="Insira suas credenciais para acessar sua conta."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        autofocus
        @submit="onSubmit"
      />
    </UPageCard>
  </UContainer>
</template>
