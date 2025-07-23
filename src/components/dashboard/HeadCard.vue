<template>
      <div class="flex items-center gap-6 w-full bg-white hover:bg-gray-100 rounded-lg shadow-md p-2 md:p-6 cursor-pointer" @click="onAction">
        <slot />
        <div class="flex flex-col min-w-fit w-full justify-between ">
          <h1 class="text-lg md:text-xl font-semibold text-gray-800">{{ title }}</h1>
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