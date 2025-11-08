<script setup lang="ts">
import { Icon, type IconifyIcon } from "@iconify/vue";

const props = defineProps<{
  icon: string | IconifyIcon;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-x-3 pb-2 pt-1">
    <div v-if="props.icon" class="flex p-2 w-fit rounded-md bg-muted">
      <!-- <Icon class="size-10" :name="props.icon" /> -->
      <Icon width="35" :icon="props.icon" />
    </div>
    <div class="p-2 w-fit rounded-md">
      <h2
        v-if="props.title"
        class="text-2xl sm:text-3xl text-center sm:text-start font-bold"
      >
        {{ props.title }}
      </h2>
      <p
        v-if="props.description"
        class="text-sm text-center sm:text-start text-muted-foreground"
      >
        {{ props.description }}
      </p>
    </div>
  </div>
</template>
