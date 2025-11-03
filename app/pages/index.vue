<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

const { data: profiles } = await useAsyncData(
  "profie",
  async () => {
    const { data } = await client.from("profiles").select("*");
    console.log({ user });

    return data;
  },
  { default: () => [] }
);
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <template v-for="profile in profiles" :key="profile.id">
        <!-- <UAvatar :src="profile.avatar_url" /> -->
        <UUser
          :name="profile.username"
          :description="profile.email"
          :avatar="{ src: profile.avatar_url, icon: 'i-lucide-image' }"
        />
      </template>
    </div>
    <div>
      <UButton label="sair" @click="client.auth.signOut()" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
