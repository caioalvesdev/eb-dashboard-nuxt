<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import imageCompression from "browser-image-compression";

const fileRef = ref<HTMLInputElement>();
const file = ref<File | null>(null);
const loading = ref<boolean>(false);

const profileSchema = z.object({
  name: z.string().min(2, "Muito curto"),
  email: z.string().email("E-mail inválido"),
  username: z.string().min(2, "Muito curto"),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileSchema = z.output<typeof profileSchema>;

const { user, uploadProfilePicture, updateProfile } = useUser();
const { getSession } = useAuth();
const profile = reactive<Partial<ProfileSchema>>({
  name: user.value?.profile?.full_name ?? "",
  email: user.value?.profile?.email ?? "",
  username: user.value?.profile?.username ?? "",
  avatar: user.value?.profile?.avatar_url ?? "",
  bio: user.value?.profile?.bio ?? "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {
    loading.value = true;
    const { data: value } = event;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    let publicUrl: string | null = null;

    if (file.value) {
      const compressedFile = await imageCompression(file.value!, options);
      const data = await uploadProfilePicture(compressedFile);
      publicUrl = data?.data?.publicUrl || null;
    }

    const profile: Partial<Profile> = {
      avatar_url: publicUrl ? publicUrl : value.avatar,
      username: value.username,
      full_name: value.name,
      bio: value.bio,
    };

    await updateProfile(profile);
    await getSession();
    toast.add({
      title: "Sucesso",
      description: "Suas configurações foram atualizadas.",
      icon: "i-lucide-check",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Erro",
      description:
        (error as Error).message ||
        "Ocorreu um erro ao atualizar suas configurações.",
      icon: "i-lucide-alert-circle",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

async function onFileChange(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) return;

  if (input.files[0]) {
    file.value = input.files[0];
    profile.avatar = URL.createObjectURL(input.files[0]!);
  }
}

function onFileClick() {
  fileRef.value?.click();
}

definePageMeta({
  layout: "dashboard-default",
});
</script>

<template>
  <UForm
    class="lg:max-w-2xl mx-auto w-full"
    id="settings"
    :schema="profileSchema"
    :state="profile"
    @submit="onSubmit"
  >
    <UPageCard
      title="Perfil"
      description="Atualize suas informações de perfil e foto."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        :loading
        :disabled="loading"
        form="settings"
        label="Salvar alterações"
        color="neutral"
        type="submit"
        class="w-fit ml-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Nome"
        description="Será exibido em recibos, faturas e outras comunicações."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput :disabled="loading" v-model="profile.name" autocomplete="off" />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        description="Usado para fazer login, receber recibos e atualizações de produtos."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          disabled
          v-model="profile.email"
          type="email"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="username"
        label="Username"
        description="Seu nome de usuário único para login e URL do seu perfil."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          :disabled="loading"
          v-model="profile.username"
          type="username"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="avatar"
        label="Avatar"
        description="JPG, GIF or PNG. 1MB Max."
        class="flex max-sm:flex-col justify-between sm:items-center gap-4"
      >
        <div class="flex flex-wrap items-center gap-5">
          <UPopover arrow mode="hover" :open-delay="500" :close-delay="300">
            <UAvatar :src="profile.avatar" :alt="profile.name" size="xl" />

            <template #content>
              <UPageCard spotlight>
                <NuxtImg
                  class="rounded-lg"
                  width="300"
                  height="300"
                  :src="profile.avatar"
                  :alt="profile.name"
                />
              </UPageCard>
            </template>
          </UPopover>
          <UButton
            :disabled="loading"
            label="Escolher"
            color="neutral"
            @click="onFileClick"
          />
          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          />
        </div>
      </UFormField>
      <USeparator />
      <UFormField
        name="bio"
        label="Bio"
        description="Breve descrição do seu perfil. URLs serão transformadas em links."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="profile.bio"
          :disabled="loading"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
