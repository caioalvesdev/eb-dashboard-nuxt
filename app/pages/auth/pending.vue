<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const actions: ButtonProps[] = [
  //   {
  //     icon: "i-lucide-refresh-cw",
  //     label: "Reenviar email",
  //     color: "neutral",
  //     variant: "subtle",
  //   },
];
definePageMeta({
  layout: "auth-default",
});
</script>
<template>
  <UContainer class="flex flex-col items-center justify-center gap-4 p-4 h-dvh">
    <Motion
      as-child
      :initial="{ opacity: 0, transform: 'translateY(10px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.2 + 0.4 * 2 }"
      :in-view-options="{ once: true }"
    >
      <UEmpty
        size="xl"
        variant="naked"
        icon="i-lucide-mail-open"
        title="Confira seu e-mail"
        description="Enviamos um link mágico para você acessar sua conta. Clique no link que está no seu e-mail para entrar. Se não encontrar, verifique na caixa de spam."
        :actions
      />
    </Motion>
  </UContainer>
</template>

<style scoped></style>
