<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

// Lista usuários do Supabase Auth com seus profiles (usando a API admin)
const { data: authUsers, refresh: refreshUsers } = await useFetch<any>(
  "/api/users/list",
  {
    default: () => ({ users: [], total: 0 }),
  }
);

const q = ref("");
const isInviteModalOpen = ref(false);
const inviteEmail = ref("");
const loading = ref<boolean>(false);

// Processa os usuários com seus profiles
const allMembers = computed(() => {
  if (!authUsers.value?.users) return [];

  return authUsers.value?.users.map((user: any) => {
    const profile = user?.profile ?? {};

    console.log({ user, profile });
    return {
      id: user.id,
      email: user.email,
      name: profile?.name,
      username: profile?.full_name,
      avatar: profile?.avatar_url,
      bio: profile?.bio,
      role: user.role || "user",
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      src: profile?.avatar_url,
      alt: profile?.name,
      profile,
    };
  });
});

const filteredMembers = computed(() => {
  if (!q.value) return allMembers.value;

  return allMembers.value.filter((member: any) => {
    const searchTerm = q.value.toLowerCase();
    return (
      member.email?.toLowerCase().includes(searchTerm) ||
      member.name?.toLowerCase().includes(searchTerm) ||
      member.username?.toLowerCase().includes(searchTerm)
    );
  });
});

const toast = useToast();

const validationSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type ProfileSchema = z.output<typeof validationSchema>;

const formState = reactive({
  email: "",
});

async function handleSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {
    loading.value = true;
    const { email } = event.data;
    // Chama a API do servidor (que tem acesso ao service key)
    await $fetch("/api/invite-user", {
      method: "POST",
      body: {
        email: email,
        metadata: {
          invited_by: "admin",
        },
      },
    });

    toast.add({
      title: "Sucesso!",
      description: `Convite enviado para ${email}`,
      color: "success",
      icon: "i-lucide-check",
    });

    // Recarrega a lista de usuários
    await refreshUsers();

    inviteEmail.value = "";
    isInviteModalOpen.value = false;
  } catch (error: any) {
    toast.add({
      title: "Erro ao convidar",
      description: error.data?.message || "Erro desconhecido",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Membros"
      description="Convide novos membros por endereço de e-mail."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UModal
        :ui="{
          content: 'max-w-sm',
        }"
        v-model:open="isInviteModalOpen"
        title="Convidar novo membro"
      >
        <template #body>
          <UForm
            @submit="handleSubmit"
            :schema="validationSchema"
            :state="formState"
          >
            <div class="flex flex-col gap-7">
              <UFormField size="lg" label="Email do usuário" name="email">
                <UInput
                  :disabled="loading"
                  class="w-full"
                  icon="i-lucide-mail"
                  size="lg"
                  v-model="formState.email"
                  type="email"
                  placeholder="Email do usuário"
                />
              </UFormField>
              <UButton
                :loading
                :disabled="loading"
                size="lg"
                type="submit"
                block
                label="Convidar usuário"
              />
            </div>
          </UForm>
        </template>
        <UButton
          label="Convidar pessoas"
          color="neutral"
          class="w-fit lg:ms-auto"
          @click="isInviteModalOpen = true"
        />
      </UModal>
    </UPageCard>

    <!-- Modal de Convite -->

    <UPageCard
      variant="subtle"
      :ui="{
        container: 'p-0 sm:p-0 gap-y-0',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-default',
      }"
    >
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </UPageCard>
  </div>
</template>
