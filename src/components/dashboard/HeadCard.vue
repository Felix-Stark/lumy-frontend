<template>
      <div class="flex items-center gap-6 w-full h-full min-w-fit bg-white hover:bg-gray-100 rounded-lg shadow-md p-6" @click="onAction">
        <slot />
        <div class="flex flex-col w-full justify-between ">
          <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
          <p class="text-sm text-gray-500">{{ description }}</p>
        </div>
      </div>
</template>
<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  onAction?: () => void
}>();
</script>