<template>
      <div class="flex items-center gap-6 w-full bg-white rounded-lg shadow-md p-2 md:p-2 xl:p-6">
        <slot />
        <div class="flex flex-col w-full justify-between ">
          <h1 class="2xl:text-xl font-semibold text-gray-800">{{ title }}</h1>
          <p class="text-sm text-gray-500">{{ description }}</p>
        </div>
      </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string | number;
  description?: string
  onAction?: () => void
}>();
</script>