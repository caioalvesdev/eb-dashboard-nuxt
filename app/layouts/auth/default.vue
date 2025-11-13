<template>
  <div class="lg:grid lg:grid-cols-2">
    <UPageCard
      class="hidden lg:flex"
      :ui="{ root: 'rounded-none' }"
      variant="naked"
      spotlight
    >
      <UPageSection
        orientation="vertical"
        :ui="{
          root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
          container: 'h-full items-center justify-center',
          wrapper: 'flex flex-col',
          headline: 'mb-6',
          title: 'text-left text-4xl',
          description: 'text-left max-w-lg',
          links: 'gap-1 justify-start -ms-2.5',
        }"
      >
        <template #title>
          <Motion
            as-child
            :initial="{ opacity: 0, transform: 'translateX(-10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateX(0)' }"
            :transition="{ delay: 0.2 + 0.4 * 1 }"
            :in-view-options="{ once: true }"
          >
            <div>RealmTech Solutions</div>
          </Motion>
        </template>

        <template #description>
          <Motion
            as-child
            :initial="{ opacity: 0, transform: 'translateX(-10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateX(0)' }"
            :transition="{ delay: 0.2 + 0.4 * 2 }"
            :in-view-options="{ once: true }"
          >
            <div>
              A plataforma definitiva para gerenciar seus projetos e equipes com
              eficiência e facilidade.
            </div>
          </Motion>
        </template>
        <template #top>
          <LazyAuthSkyBg />

          <div
            class="absolute -right-1/2 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2"
          />
        </template>

        <template #headline>
          <!-- <AuthAppLogo class="w-auto h-6 shrink-0 text-highlighted" /> -->
          <!-- <NuxtImg src="/logo.png" height="35" alt="Logo" /> -->
        </template>

        <template #default />
      </UPageSection>
    </UPageCard>

    <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex-1">
      <UColorModeButton class="fixed top-4 right-4 z-10" />
      <slot />
    </section>
  </div>
</template>
